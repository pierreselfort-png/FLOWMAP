import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import PosteNode from './nodes/PosteNode';
import StockNode from './nodes/StockNode';
import Sidebar from './components/Sidebar';
import EditPanel from './components/EditPanel';
import './App.css';

const nodeTypes = { poste: PosteNode, stock: StockNode };

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#6366f1', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
};

let idCounter = 0;
const getId = () => `node_${++idCounter}`;

export default function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          label: type === 'poste' ? 'Nouveau Poste' : 'Nouveau Stock',
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNodeDataChange = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: newData } : n))
      );
      setSelectedNode((prev) =>
        prev && prev.id === nodeId ? { ...prev, data: newData } : prev
      );
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const handleExport = useCallback(() => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowmap.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const { nodes: n, edges: e } = JSON.parse(ev.target.result);
          setNodes(n || []);
          setEdges(e || []);
          setSelectedNode(null);
        } catch {
          alert('Fichier invalide');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges]);

  const handleClear = useCallback(() => {
    if (nodes.length === 0 || confirm('Effacer tout le canvas ?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  }, [nodes, setNodes, setEdges]);

  return (
    <div className="app">
      <header className="toolbar">
        <h1>FlowMap Builder</h1>
        <div className="toolbar-actions">
          <button onClick={handleImport}>Importer</button>
          <button onClick={handleExport}>Exporter</button>
          <button onClick={handleClear} className="btn-danger">Effacer</button>
        </div>
      </header>

      <div className="main-layout">
        <Sidebar />

        <div className="canvas-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            deleteKeyCode="Delete"
            snapToGrid
            snapGrid={[16, 16]}
          >
            <Controls />
            <Background gap={16} size={1} color="#e2e8f0" />
            <MiniMap
              nodeColor={(n) =>
                n.type === 'poste' ? '#6366f1' : '#f59e0b'
              }
              maskColor="rgba(0,0,0,0.08)"
            />
          </ReactFlow>
        </div>

        <EditPanel
          node={selectedNode}
          onChange={handleNodeDataChange}
          onClose={() => setSelectedNode(null)}
          onDelete={handleDeleteNode}
        />
      </div>
    </div>
  );
}
