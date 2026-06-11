import { useEffect } from 'react'

// Lightweight modal shell: backdrop, centered card, Esc to close, scroll lock.
export default function Modal({ open, onClose, children, labelledBy, wide = false }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={[
          'w-full rounded-t-2xl bg-surface p-5 shadow-xl sm:rounded-2xl sm:p-6',
          wide ? 'sm:max-w-2xl' : 'sm:max-w-md',
          'max-h-[92vh] overflow-y-auto',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
