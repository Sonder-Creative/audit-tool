import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import ScoreBadge from './ScoreBadge.jsx'
import AutoTextarea from './AutoTextarea.jsx'

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

  if (editing) {
    return (
      <div className="card p-4 sm:p-5">
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
      </div>
    )
  }

  return (
    <div className="card group relative p-4 transition-shadow hover:shadow-card-hover sm:p-5">
      {/* Award-badge score control, top-right */}
      <div className="absolute right-4 top-4">
        <ScoreBadge value={score} onChange={onScore} />
      </div>

      <div className="pr-14">
        <p className="font-medium leading-snug text-body">
          <span className="mr-2 text-muted tabular-nums">{index}.</span>
          {question.text}
        </p>
        {question.hint && <p className="mt-1 text-sm text-muted">{question.hint}</p>}
      </div>

      <AutoTextarea
        value={note || ''}
        onChange={(e) => onNote(e.target.value)}
        minRows={2}
        placeholder="Notes — specific observations, examples, supporting context"
        className="mt-4 w-full rounded-xl border border-divider/50 bg-bg px-3.5 py-2.5 text-sm text-body placeholder:text-muted/70 transition-colors focus:border-accent"
      />

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={startEdit}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted opacity-0 transition-opacity hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Pencil size={13} />
          Edit
        </button>
      </div>
    </div>
  )
}
