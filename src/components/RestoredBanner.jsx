// Shown when an audit was loaded from a JSON import, so the team knows they're
// working on a restored session rather than a fresh one.
export default function RestoredBanner({ info, onDismiss }) {
  if (!info) return null
  return (
    <div className="flex items-center gap-3 rounded-xl border border-accent bg-accent-fill/50 px-4 py-3 text-sm">
      <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-accent" />
      <span className="text-body">
        Restored:{' '}
        <strong className="font-semibold">{info.client || 'Untitled client'}</strong>
        {info.date ? ` — ${info.date}` : ''}
        <span className="text-muted"> · {info.typeLabel}</span>
      </span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-auto text-xs font-medium text-muted hover:text-body"
      >
        Dismiss
      </button>
    </div>
  )
}
