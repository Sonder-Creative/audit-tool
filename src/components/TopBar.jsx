import { Menu } from 'lucide-react'

// Slim bar shown on tablet/mobile to open the sidebar drawer. Hidden on lg+.
export default function TopBar({ title, onMenu }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-divider/50 bg-bg/85 px-4 py-3 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="rounded-lg border border-divider/60 p-2 text-body hover:border-accent hover:text-accent"
      >
        <Menu size={18} />
      </button>
      <span className="truncate text-sm font-semibold text-body">{title}</span>
    </div>
  )
}
