import { useState } from 'react'
import ScoreButtons from './ScoreButtons.jsx'
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
    <div className="rounded-xl border border-divider bg-surface p-4 sm:p-5">
      {editing ? (
        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Question
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-divider bg-bg px-3 py-2 text-body focus:border-accent"
          />
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Hint
          </label>
          <input
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            className="w-full rounded-lg border border-divider bg-bg px-3 py-2 text-sm text-body focus:border-accent"
            placeholder="Short guidance for the auditor"
          />
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-divider px-4 py-2 text-sm font-medium text-body hover:border-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onRequestDelete}
              className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
            >
              Delete question
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium leading-snug text-body">
                <span className="mr-2 text-muted">{index}.</span>
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
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-muted hover:text-accent"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ScoreButtons
              value={score}
              onChange={onScore}
              questionId={question.id}
            />
            <span className="text-xs text-muted">
              {SCALE.low} &nbsp;·&nbsp; {SCALE.high}
            </span>
          </div>

          <textarea
            value={note || ''}
            onChange={(e) => onNote(e.target.value)}
            rows={2}
            placeholder="Notes — specific observations, examples, supporting context"
            className="w-full resize-y rounded-lg border border-divider bg-bg px-3 py-2 text-sm text-body placeholder:text-muted focus:border-accent"
          />
        </div>
      )}
    </div>
  )
}
