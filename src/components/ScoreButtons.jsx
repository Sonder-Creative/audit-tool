import { SCALE } from '../data/defaultTemplate.js'

// 1–5 scoring control. Selected value = filled Sonder Blue with white number.
export default function ScoreButtons({ value, onChange, questionId }) {
  const nums = []
  for (let n = SCALE.min; n <= SCALE.max; n++) nums.push(n)

  return (
    <div
      className="flex items-center gap-2"
      role="radiogroup"
      aria-label="Score from 1 (significant issues) to 5 (strong)"
    >
      {nums.map((n) => {
        const selected = value === n
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`Score ${n}`}
            onClick={() => onChange(selected ? null : n)}
            className={[
              'h-10 w-10 sm:h-11 sm:w-11 rounded-lg border text-sm font-semibold',
              'transition-colors duration-150 select-none',
              selected
                ? 'bg-accent border-accent text-white shadow-sm'
                : 'bg-surface border-divider text-body hover:border-accent hover:text-accent',
            ].join(' ')}
          >
            {n}
          </button>
        )
      })}
    </div>
  )
}
