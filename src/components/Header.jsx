import { useRef } from 'react'
import Logo from './Logo.jsx'
import { useTheme } from '../theme/ThemeProvider.jsx'

// Sun / moon glyphs for the theme toggle.
function ThemeIcon({ theme }) {
  return theme === 'dark' ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function StatusDot({ status }) {
  const map = {
    loading: { color: 'bg-amber-400', label: 'Loading template' },
    live: { color: 'bg-emerald-500', label: 'Base template · live' },
    fallback: { color: 'bg-divider', label: 'Built-in template' },
  }
  const s = map[status] || map.fallback
  return (
    <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex">
      <span className={`h-2 w-2 rounded-full ${s.color}`} />
      {s.label}
    </span>
  )
}

export default function Header({ status, onImport, onExport, onNew, dirty }) {
  const { theme, toggle } = useTheme()
  const fileRef = useRef(null)

  const pickFile = () => fileRef.current?.click()
  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (f) onImport(f)
    e.target.value = '' // allow re-importing the same file
  }

  const btn =
    'rounded-lg border border-divider px-3 py-2 text-sm font-medium text-body hover:border-accent hover:text-accent transition-colors'

  return (
    <header className="sticky top-0 z-20 border-b border-divider bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Logo />
        <span className="hidden text-sm text-muted sm:inline">Audit tool</span>
        <StatusDot status={status} />

        <div className="ml-auto flex items-center gap-2">
          {dirty && (
            <span className="hidden text-xs text-amber-500 sm:inline">
              Unsaved changes
            </span>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFile}
            className="hidden"
          />
          <button type="button" onClick={pickFile} className={btn}>
            Import
          </button>
          <button type="button" onClick={onExport} className={btn}>
            Export
          </button>
          <button type="button" onClick={onNew} className={btn}>
            New
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="rounded-lg border border-divider p-2 text-body hover:border-accent hover:text-accent"
          >
            <ThemeIcon theme={theme} />
          </button>
        </div>
      </div>
    </header>
  )
}
