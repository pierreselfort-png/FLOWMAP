export default function EditPanel({ node, onChange, onClose, onDelete }) {
  if (!node) return null;

  const isPoste = node.type === 'poste';
  const data = node.data;

  const update = (field, value) => {
    onChange(node.id, { ...data, [field]: value });
  };

  return (
    <div className="edit-panel">
      <div className="edit-panel-header">
        <h3>{isPoste ? '⚙️ Poste' : '📦 Stock'}</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="edit-panel-body">
        <label>
          Nom
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => update('label', e.target.value)}
            placeholder={isPoste ? 'Nom du poste' : 'Nom du stock'}
          />
        </label>

        {isPoste && (
          <>
            <label>
              Temps de cycle (s)
              <input
                type="number"
                value={data.cycleTime || ''}
                onChange={(e) => update('cycleTime', e.target.value)}
                placeholder="Ex: 30"
                min="0"
              />
            </label>
            <label>
              Nombre de personnes
              <input
                type="number"
                value={data.nbPersonnes || ''}
                onChange={(e) => update('nbPersonnes', e.target.value)}
                placeholder="Ex: 2"
                min="0"
              />
            </label>
          </>
        )}

        {!isPoste && (
          <>
            <label>
              Stock tampon
              <input
                type="number"
                value={data.stockTampon || ''}
                onChange={(e) => update('stockTampon', e.target.value)}
                placeholder="Ex: 50"
                min="0"
              />
            </label>
            <label>
              Stock max
              <input
                type="number"
                value={data.stockMax || ''}
                onChange={(e) => update('stockMax', e.target.value)}
                placeholder="Ex: 200"
                min="0"
              />
            </label>
          </>
        )}

        <label>
          Description
          <textarea
            value={data.description || ''}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Notes..."
            rows={3}
          />
        </label>

        <button className="delete-btn" onClick={() => onDelete(node.id)}>
          🗑 Supprimer cet élément
        </button>
      </div>
    </div>
  );
}
