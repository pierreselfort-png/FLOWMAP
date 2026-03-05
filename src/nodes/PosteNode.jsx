import { Handle, Position } from '@xyflow/react';

export default function PosteNode({ data, selected }) {
  return (
    <div className={`node-poste ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-header poste-header">
        <span className="node-icon">⚙️</span>
        <span className="node-type">Poste</span>
      </div>
      <div className="node-body">
        <div className="node-label">{data.label || 'Poste'}</div>
        {data.cycleTime && (
          <div className="node-info">
            <span className="info-label">TC:</span> {data.cycleTime}s
          </div>
        )}
        {data.nbPersonnes && (
          <div className="node-info">
            <span className="info-label">Pers:</span> {data.nbPersonnes}
          </div>
        )}
        {data.description && (
          <div className="node-description">{data.description}</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
