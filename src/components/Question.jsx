import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import ScoreButtons from './ScoreButtons.jsx'
import AutoTextarea from './AutoTextarea.jsx'
import { SCALE } from '../data/defaultTemplate.js'

// A single scored question with notes, plus inline editing of text/hint.
export default function Question({
  question,
  index,
  score,
  note,
  onScore,
  onNote,
  onRequestEdit,
  onRequestDelete,
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(question.text)
  const [hint, setHint] = useState(question.hint || '')

  const startEdit = () => {
    setText(question.text)
    setHint(question.hint || '')
    setEditing(true)
  }

  const save = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onRequestEdit({ text: trimmed, hint: hint.trim() })
    setEditing(false)
  }

  return (
    <div className="card p-4 hover:shadow-card-hover sm:p-5">
      {editing ? (
        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Question
          </label>
          <AutoTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            minRows={2}
            className="w-full rounded-xl border border-divider/50 bg-bg px-3.5 py-2.5 text-body focus:border-accent"
          />
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Hint
          </label>
          <input
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            className="w-full rounded-xl border border-divider/50 bg-bg px-3.5 py-2.5 text-sm text-body focus:border-accent"
            placeholder="Short guidance for the auditor"
          />
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={save}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-xl border border-divider/60 px-4 py-2 text-sm font-medium text-body hover:border-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onRequestDelete}
              className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium leading-snug text-body">
                <span className="mr-2 text-muted tabular-nums">{index}.</span>
                {question.text}
              </p>
              {question.hint && (
                <p className="mt-1 text-sm text-muted">{question.hint}</p>
              )}
            </div>
            <button
              type="button"
              onClick={startEdit}
              aria-label="Edit question"
              className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-accent-fill/40 hover:text-accent"
            >
              <Pencil size={15} />
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ScoreButtons value={score} onChange={onScore} questionId={question.id} />
            <span className="text-xs text-muted">
              {SCALE.low} &nbsp;·&nbsp; {SCALE.high}
            </span>
          </div>

          <AutoTextarea
            value={note || ''}
            onChange={(e) => onNote(e.target.value)}
            minRows={2}
            placeholder="Notes — specific observations, examples, supporting context"
            className="w-full rounded-xl border border-divider/50 bg-bg px-3.5 py-2.5 text-sm text-body placeholder:text-muted/70 transition-colors focus:border-accent"
          />
        </div>
      )}
    </div>
  )
}
