export default function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <h2>Éléments</h2>
      <p className="sidebar-hint">Glissez-déposez sur le canvas</p>

      <div
        className="sidebar-item sidebar-poste"
        draggable
        onDragStart={(e) => onDragStart(e, 'poste')}
      >
        <span className="sidebar-icon">⚙️</span>
        <div>
          <div className="sidebar-item-title">Poste</div>
          <div className="sidebar-item-desc">Poste de travail</div>
        </div>
      </div>

      <div
        className="sidebar-item sidebar-stock"
        draggable
        onDragStart={(e) => onDragStart(e, 'stock')}
      >
        <span className="sidebar-icon">📦</span>
        <div>
          <div className="sidebar-item-title">Stock</div>
          <div className="sidebar-item-desc">Stock tampon</div>
        </div>
      </div>
    </aside>
  );
}
