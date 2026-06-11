import { useState } from 'react'
import Question from './Question.jsx'
import { sectionScore, band } from '../lib/scoring.js'

// One audit section: heading, its questions, an add-question form, and an
// auto-calculating summary score + observation field.
export default function Section({
  section,
  number,
  answers,
  notes,
  observation,
  onScore,
  onNote,
  onObservation,
  onRequestEdit,
  onRequestAdd,
  onRequestDelete,
}) {
  const [adding, setAdding] = useState(false)
  const [newText, setNewText] = useState('')
  const [newHint, setNewHint] = useState('')

  const score = sectionScore(section, answers)

  const submitAdd = () => {
    const t = newText.trim()
    if (!t) return
    onRequestAdd({ text: t, hint: newHint.trim() })
    setNewText('')
    setNewHint('')
    setAdding(false)
  }

  // Global question numbering across the audit is handled by the parent via
  // `baseIndex`; here we just number within fallback. Parent passes explicit
  // indices through children to keep continuous numbering.
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3 border-b border-divider pb-2">
        <span className="text-sm font-semibold text-accent">
          {String(number).padStart(2, '0')}
        </span>
        <h3 className="text-lg font-semibold text-body">{section.name}</h3>
      </div>

      <div className="space-y-3">
        {section.questions.map((q, i) => (
          <Question
            key={q.id}
            question={q}
            index={i + 1}
            score={answers[q.id] ?? null}
            note={notes[q.id]}
            onScore={(v) => onScore(q.id, v)}
            onNote={(v) => onNote(q.id, v)}
            onRequestEdit={(payload) =>
              onRequestEdit(section.id, q.id, payload)
            }
            onRequestDelete={() => onRequestDelete(section.id, q.id)}
          />
        ))}
      </div>

      {adding ? (
        <div className="space-y-3 rounded-xl border border-dashed border-accent bg-accent-fill/30 p-4">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={2}
            placeholder="New question text"
            className="w-full resize-none rounded-lg border border-divider bg-bg px-3 py-2 text-body focus:border-accent"
          />
          <input
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
            placeholder="Hint (optional)"
            className="w-full rounded-lg border border-divider bg-bg px-3 py-2 text-sm text-body focus:border-accent"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submitAdd}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Add question
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-lg border border-divider px-4 py-2 text-sm font-medium text-body hover:border-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="text-sm font-medium text-accent hover:underline"
        >
          + Add question
        </button>
      )}

      {/* Section summary */}
      <div className="rounded-xl border border-divider bg-accent-fill/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold uppercase tracking-wide text-body">
            Section summary
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-accent">
              {score.average != null ? score.average.toFixed(1) : '—'}
            </span>
            <span className="text-sm text-muted">
              / 5 {score.average != null && `· ${band(score.average)}`}
            </span>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted">
          {score.count > 0
            ? `${score.total} / ${score.max} across ${score.count} scored question${
                score.count === 1 ? '' : 's'
              }`
            : 'No questions scored yet'}
        </p>
        <textarea
          value={observation || ''}
          onChange={(e) => onObservation(e.target.value)}
          rows={2}
          placeholder="Overall section observation"
          className="mt-3 w-full resize-y rounded-lg border border-divider bg-bg px-3 py-2 text-sm text-body placeholder:text-muted focus:border-accent"
        />
      </div>
    </section>
  )
}
