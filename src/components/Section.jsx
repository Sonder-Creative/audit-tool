import { useState } from 'react'
import { Plus } from 'lucide-react'
import Question from './Question.jsx'
import AutoTextarea from './AutoTextarea.jsx'
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

  return (
    <section className="space-y-5">
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-semibold tabular-nums text-accent">
          {String(number).padStart(2, '0')}
        </span>
        <h3 className="text-xl font-semibold tracking-tight text-body">{section.name}</h3>
      </div>

      <div className="space-y-3.5">
        {section.questions.map((q, i) => (
          <Question
            key={q.id}
            question={q}
            index={i + 1}
            score={answers[q.id] ?? null}
            note={notes[q.id]}
            onScore={(v) => onScore(q.id, v)}
            onNote={(v) => onNote(q.id, v)}
            onRequestEdit={(payload) => onRequestEdit(section.id, q.id, payload)}
            onRequestDelete={() => onRequestDelete(section.id, q.id)}
          />
        ))}
      </div>

      {adding ? (
        <div className="space-y-3 rounded-2xl border border-dashed border-accent/70 bg-accent-fill/20 p-4">
          <AutoTextarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            minRows={2}
            placeholder="New question text"
            className="w-full rounded-xl border border-divider/50 bg-bg px-3.5 py-2.5 text-body focus:border-accent"
          />
          <input
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
            placeholder="Hint (optional)"
            className="w-full rounded-xl border border-divider/50 bg-bg px-3.5 py-2.5 text-sm text-body focus:border-accent"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submitAdd}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Add question
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-xl border border-divider/60 px-4 py-2 text-sm font-medium text-body hover:border-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          <Plus size={16} />
          Add question
        </button>
      )}

      {/* Section summary */}
      <div className="rounded-2xl bg-accent-fill/40 p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-body">
            Section summary
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-accent">
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
        <AutoTextarea
          value={observation || ''}
          onChange={(e) => onObservation(e.target.value)}
          minRows={2}
          placeholder="Overall section observation"
          className="mt-3 w-full rounded-xl border border-divider/50 bg-bg px-3.5 py-2.5 text-sm text-body placeholder:text-muted/70 focus:border-accent"
        />
      </div>
    </section>
  )
}
