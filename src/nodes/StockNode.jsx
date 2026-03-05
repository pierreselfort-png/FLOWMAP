import { Handle, Position } from '@xyflow/react';

export default function StockNode({ data, selected }) {
  return (
    <div className={`node-stock ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-header stock-header">
        <span className="node-icon">📦</span>
        <span className="node-type">Stock</span>
      </div>
      <div className="node-body">
        <div className="node-label">{data.label || 'Stock'}</div>
        {data.stockTampon && (
          <div className="node-info">
            <span className="info-label">Tampon:</span> {data.stockTampon}
          </div>
        )}
        {data.stockMax && (
          <div className="node-info">
            <span className="info-label">Max:</span> {data.stockMax}
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
