import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SCALE } from '../data/defaultTemplate.js'

// --- Sonder-style sunburst "award" shape, generated once. -------------------
function starPath(points, outer, inner, cx = 50, cy = 50) {
  const step = Math.PI / points
  let d = ''
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = i * step - Math.PI / 2
    const x = cx + r * Math.cos(a)
    const y = cy + r * Math.sin(a)
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `
  }
  return `${d}Z`
}
const BURST_D = starPath(12, 50, 37)

function Burst({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={BURST_D} fill="currentColor" />
    </svg>
  )
}

const NUMS = [1, 2, 3, 4, 5]

// A juicy 1–5 score control that lives as an award badge in the card corner.
// Collapsed it shows a chevron (unrated) or the chosen number inside a burst.
// Clicking expands a pill of 1–5 that slide out with a stagger; picking one
// pops, recolours, and collapses back into the badge.
export default function ScoreBadge({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [popped, setPopped] = useState(null)
  const ref = useRef(null)

  // Close on outside click / Esc.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (n) => {
    const next = n === value ? null : n
    onChange(next)
    setPopped(n)
    window.setTimeout(() => setPopped(null), 280)
    window.setTimeout(() => setOpen(false), 240)
  }

  return (
    <div ref={ref} className="relative h-9 w-9">
      {/* Expanded pill of 1–5 */}
      <div
        className={[
          'absolute right-0 top-1/2 z-20 flex h-10 -translate-y-1/2 items-center gap-1 rounded-full px-1.5',
          'bg-surface shadow-card-hover ring-1 ring-black/5 transition-all duration-200 ease-out',
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-90 opacity-0',
        ].join(' ')}
        role="radiogroup"
        aria-label="Score from 1 (significant issues) to 5 (strong)"
      >
        {NUMS.map((n) => {
          const selected = value === n
          const isPop = popped === n
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`Score ${n}`}
              tabIndex={open ? 0 : -1}
              onClick={() => pick(n)}
              style={{ transitionDelay: open ? `${(5 - n) * 32}ms` : '0ms' }}
              className={[
                'group relative grid h-8 w-8 place-items-center rounded-full text-sm font-semibold',
                'transition-all duration-200 ease-out',
                open ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0',
                selected ? 'text-white' : 'text-accent hover:scale-110',
                isPop ? 'scale-125' : '',
              ].join(' ')}
            >
              {/* burst behind: light on hover, accent when selected */}
              <Burst
                className={[
                  'pointer-events-none absolute -inset-1 transition-all duration-200',
                  selected
                    ? 'scale-100 text-accent opacity-100'
                    : 'scale-75 text-accent-fill opacity-0 group-hover:scale-100 group-hover:opacity-100',
                ].join(' ')}
              />
              {/* white disc for unselected so the number reads on the pill */}
              {!selected && (
                <span className="absolute inset-0 rounded-full bg-surface shadow-sm ring-1 ring-black/5 transition-opacity group-hover:opacity-0" />
              )}
              <span className="relative">{n}</span>
            </button>
          )
        })}
      </div>

      {/* Caption under the pill while open */}
      <div
        className={[
          'absolute right-0 top-[42px] z-20 whitespace-nowrap text-[11px] text-muted transition-opacity duration-200',
          open ? 'opacity-100 delay-150' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        {SCALE.low} · {SCALE.high}
      </div>

      {/* Collapsed badge (hidden while open) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={value ? `Score ${value} of 5, change` : 'Set score'}
        className={[
          'absolute inset-0 grid place-items-center transition-all duration-200',
          open ? 'pointer-events-none scale-90 opacity-0' : 'scale-100 opacity-100',
        ].join(' ')}
      >
        {value ? (
          <span className="relative grid h-9 w-9 place-items-center">
            <Burst className="absolute -inset-1 text-accent-fill" />
            <span className="relative grid h-7 w-7 place-items-center rounded-full bg-accent text-sm font-bold text-white shadow-badge">
              {value}
            </span>
          </span>
        ) : (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-fill/70 text-accent transition-colors hover:bg-accent-fill">
            <ChevronDown size={16} />
          </span>
        )}
      </button>
    </div>
  )
}
