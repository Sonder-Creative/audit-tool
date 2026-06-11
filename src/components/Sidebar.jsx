import { useRef } from 'react'
import {
  Sparkles,
  Monitor,
  Megaphone,
  Layers,
  Plus,
  Download,
  Upload,
  Sun,
  Moon,
  X,
} from 'lucide-react'
import { useTheme } from '../theme/ThemeProvider.jsx'

const ICONS = { sparkles: Sparkles, monitor: Monitor, megaphone: Megaphone, layers: Layers }

function questionCount(type) {
  if (!type) return 0
  return type.sections.reduce((a, s) => a + s.questions.length, 0)
}

function NavItem({ type, active, count, onClick }) {
  const Icon = ICONS[type.icon] || Sparkles
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-sidebar-elevated text-white'
          : 'text-sidebar-muted hover:bg-white/5 hover:text-sidebar-fg',
      ].join(' ')}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent" />
      )}
      <Icon size={18} className={active ? 'text-accent' : 'text-sidebar-muted group-hover:text-sidebar-fg'} />
      <span className="flex-1 text-left">{type.short}</span>
      <span
        className={[
          'rounded-full px-2 py-0.5 text-[11px] tabular-nums',
          active ? 'bg-accent/20 text-white' : 'bg-white/5 text-sidebar-muted',
        ].join(' ')}
      >
        {count}
      </span>
    </button>
  )
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-muted transition-colors hover:bg-white/5 hover:text-sidebar-fg"
    >
      <Icon size={18} />
      {label}
    </button>
  )
}

const STATUS = {
  loading: { color: 'bg-amber-400', label: 'Loading template' },
  live: { color: 'bg-emerald-400', label: 'Base template live' },
  fallback: { color: 'bg-sidebar-muted', label: 'Built-in template' },
}

export default function Sidebar({
  types,
  effectiveTypes,
  activeType,
  onSelectType,
  onNew,
  onImport,
  onExport,
  status,
  dirty,
  open,
  onClose,
}) {
  const { theme, toggle } = useTheme()
  const fileRef = useRef(null)
  const s = STATUS[status] || STATUS.fallback

  const pickFile = () => fileRef.current?.click()
  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (f) onImport(f)
    e.target.value = ''
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-sidebar text-sidebar-fg',
          'transition-transform duration-300 ease-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 pb-2 pt-5">
          <div className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M28.073 31.4944C23.917 35.5281 17.1534 35.8134 12.0195 33.6946C7.53752 31.8611 3.91121 28.194 1.67023 23.8751C-1.18192 18.2522 -0.285529 12.5072 3.74823 7.82151C7.17082 3.82849 12.2232 0.894849 17.3978 0.202183C17.6423 0.161438 17.8868 0.161438 18.1312 0.120693C23.9985 -0.408993 29.7028 1.26155 33.1254 6.51767C36.0998 11.1219 34.9589 16.215 33.5736 20.9007C32.392 24.9344 30.8029 28.846 28.073 31.4944Z" fill="#355BFF" />
              <path d="M23.062 9.25098C22.9398 9.29173 22.8175 9.37322 22.736 9.41396C21.6767 9.94365 21.31 11.492 21.9619 12.5106C22.6138 13.5292 23.9991 13.8959 25.14 13.4477C26.2401 12.9995 27.0143 11.8587 27.0958 10.6771C27.1773 9.49545 26.6883 8.2731 25.8734 7.41746C25.0585 6.52107 23.9584 5.95063 22.8175 5.62467C21.1877 5.17648 19.4764 5.21722 17.8466 5.70616C16.2168 6.19511 14.75 7.0915 13.7314 8.47683C12.9165 9.5362 12.4275 10.84 12.5498 12.1846C12.672 13.7737 13.6092 15.1998 14.6278 16.4221C15.6464 17.6445 16.828 18.7446 17.6429 20.1299C18.2133 21.0671 18.5393 22.1672 18.4171 23.2673C18.2948 24.2859 17.6837 25.2638 16.828 25.8342C15.9724 26.4047 14.8722 26.6084 13.8536 26.3639C12.9165 26.1194 12.3868 25.4675 12.0201 24.5711C11.7349 23.797 11.8164 22.9006 12.1423 22.1672C12.4683 21.393 13.0387 20.7411 13.6499 20.2114C13.9351 19.9669 14.2203 19.641 14.1796 19.2743C14.0981 18.7446 13.3647 18.6631 12.8757 18.7853C11.4089 19.0705 10.0643 19.9669 9.29018 21.2708C8.51602 22.5339 8.35304 24.2044 8.88273 25.5898C9.33092 26.7306 10.2681 27.6678 11.3274 28.2382C12.4275 28.8086 13.3239 29.0531 14.5463 29.0531C16.991 29.0938 19.4764 28.1159 21.1062 26.3232C22.736 24.5304 23.3472 21.7597 22.4508 19.478C21.5137 17.074 19.1097 15.5257 17.7651 13.2847C17.1947 12.3884 16.828 11.2882 17.0725 10.2289C17.2762 9.33247 17.9281 8.59906 18.6615 8.11012C20.0469 7.21373 22.0434 7.13224 23.225 8.2731C23.388 8.43608 23.5509 8.63981 23.5102 8.88428C23.4695 9.00651 23.2657 9.12875 23.062 9.25098Z" fill="white" />
            </svg>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">Sonder Creative</div>
              <div className="text-[11px] text-sidebar-muted">Audit tool</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-sidebar-muted hover:bg-white/5 hover:text-sidebar-fg lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
            Audits
          </div>
          <div className="space-y-1">
            {types.map((t) => (
              <NavItem
                key={t.id}
                type={t}
                active={t.id === activeType}
                count={questionCount(effectiveTypes[t.id])}
                onClick={() => onSelectType(t.id)}
              />
            ))}
          </div>

          <div className="mt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
            Audit file
          </div>
          <div className="space-y-1">
            <ActionButton icon={Plus} label="New audit" onClick={onNew} />
            <ActionButton icon={Upload} label="Import JSON" onClick={pickFile} />
            <ActionButton icon={Download} label="Export JSON" onClick={onExport} />
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFile}
              className="hidden"
            />
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <button
            type="button"
            onClick={toggle}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-muted transition-colors hover:bg-white/5 hover:text-sidebar-fg"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <div className="flex items-center gap-2 px-3 pt-2 text-[11px] text-sidebar-muted">
            <span className={`h-2 w-2 rounded-full ${s.color}`} />
            {s.label}
            {dirty && <span className="ml-auto text-amber-400">Unsaved</span>}
          </div>
        </div>
      </aside>
    </>
  )
}
