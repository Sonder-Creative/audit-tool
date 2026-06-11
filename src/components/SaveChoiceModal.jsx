import Modal from './Modal.jsx'

// Two-option save flow shown after any question edit / add / delete.
// `pending` describes the change so we can title the modal sensibly.
export default function SaveChoiceModal({ pending, saving, onBase, onClient, onCancel }) {
  const open = !!pending
  const kind = pending?.op?.kind
  const verb =
    kind === 'add' ? 'New question' : kind === 'delete' ? 'Delete question' : 'Edit'

  return (
    <Modal open={open} onClose={saving ? undefined : onCancel} labelledBy="save-choice-title">
      <h2 id="save-choice-title" className="text-lg font-semibold text-body">
        {verb} — where should this apply?
      </h2>
      <p className="mt-1 text-sm text-muted">
        Save to the base template to change the default for every future audit, or
        keep it on this client only so it lives in this audit and its JSON export.
      </p>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          disabled={saving}
          onClick={onBase}
          className="w-full rounded-xl border border-accent bg-accent px-4 py-3 text-left text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <span className="block font-semibold">
            {saving ? 'Saving…' : 'Save to base template'}
          </span>
          <span className="block text-sm text-white/80">
            Updates the default for all future audits.
          </span>
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={onClient}
          className="w-full rounded-xl border border-divider bg-surface px-4 py-3 text-left text-body hover:border-accent disabled:opacity-60"
        >
          <span className="block font-semibold">Save to client only</span>
          <span className="block text-sm text-muted">
            Stays in this audit and its JSON export.
          </span>
        </button>
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={onCancel}
        className="mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-body disabled:opacity-60"
      >
        Cancel
      </button>
    </Modal>
  )
}
