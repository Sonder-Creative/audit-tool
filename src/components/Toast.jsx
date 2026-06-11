import { useEffect } from 'react'

// Brief, self-dismissing toast. `tone` controls accent colour.
export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => onDismiss(), toast.duration || 2600)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null

  const tone =
    toast.tone === 'error'
      ? 'border-red-500/40 text-red-500'
      : toast.tone === 'info'
      ? 'border-divider text-body'
      : 'border-emerald-500/40 text-emerald-600'

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4">
      <div
        role="status"
        className={`pointer-events-auto rounded-xl border bg-surface px-4 py-3 text-sm font-medium shadow-lg ${tone}`}
      >
        {toast.message}
      </div>
    </div>
  )
}
