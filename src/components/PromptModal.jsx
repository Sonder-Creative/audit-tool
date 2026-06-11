import { useState } from 'react'
import Modal from './Modal.jsx'

// Displays the generated Claude prompt with a one-click copy button.
export default function PromptModal({ open, prompt, onClose }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
    } catch (_) {
      // Fallback for older browsers / insecure contexts.
      const ta = document.createElement('textarea')
      ta.value = prompt
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch (_) {
        /* ignore */
      }
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="prompt-title" wide>
      <div className="flex items-center justify-between gap-3">
        <h2 id="prompt-title" className="text-lg font-semibold text-body">
          Claude prompt
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {copied ? 'Copied' : 'Copy prompt'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-divider px-3 py-2 text-sm font-medium text-body hover:border-accent"
          >
            Close
          </button>
        </div>
      </div>
      <p className="mt-1 text-sm text-muted">
        Paste this into Claude to generate the findings brief. The preamble and voice
        rules are locked in.
      </p>
      <pre className="mt-4 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-xl border border-divider bg-bg p-4 text-sm leading-relaxed text-body">
        {prompt}
      </pre>
    </Modal>
  )
}
