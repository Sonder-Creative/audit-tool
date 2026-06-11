// Cover fields: client, date, auditor. Audit type now lives in the sidebar.
export default function Cover({ cover, onCover }) {
  const field = (key, label, type = 'text', placeholder = '') => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      <input
        type={type}
        value={cover[key] || ''}
        placeholder={placeholder}
        onChange={(e) => onCover(key, e.target.value)}
        className="w-full rounded-xl border border-divider/50 bg-bg px-3.5 py-2.5 text-body placeholder:text-muted/70 transition-colors focus:border-accent"
      />
    </label>
  )

  return (
    <div className="card p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {field('client', 'Client name', 'text', 'Acme Co')}
        {field('date', 'Date', 'date')}
        {field('auditor', 'Auditor name', 'text', 'Your name')}
      </div>
    </div>
  )
}
