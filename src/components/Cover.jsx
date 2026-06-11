import { AUDIT_TYPES } from '../data/defaultTemplate.js'

// Cover fields: client, date, auditor, audit type.
export default function Cover({ cover, typeId, onCover, onChangeType }) {
  const field = (key, label, type = 'text') => (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      <input
        type={type}
        value={cover[key] || ''}
        onChange={(e) => onCover(key, e.target.value)}
        className="w-full rounded-lg border border-divider bg-surface px-3 py-2 text-body focus:border-accent"
      />
    </label>
  )

  return (
    <div className="rounded-2xl border border-divider bg-surface/60 p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field('client', 'Client name')}
        {field('date', 'Date', 'date')}
        {field('auditor', 'Auditor name')}
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
            Audit type
          </span>
          <select
            value={typeId}
            onChange={(e) => onChangeType(e.target.value)}
            className="w-full rounded-lg border border-divider bg-surface px-3 py-2 text-body focus:border-accent"
          >
            {AUDIT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
