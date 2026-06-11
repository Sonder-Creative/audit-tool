import { useEffect, useMemo, useState, useCallback } from 'react'
import defaultTemplate, { AUDIT_TYPES } from './data/defaultTemplate.js'
import { fetchBaseTemplate, saveBaseTemplate } from './lib/api.js'
import { applyOpToType, clone } from './lib/edits.js'
import { downloadAudit, parseImport, readFileAsText } from './lib/fileIO.js'
import { generatePrompt } from './lib/prompt.js'
import { overallScore, band } from './lib/scoring.js'

import Header from './components/Header.jsx'
import Cover from './components/Cover.jsx'
import Section from './components/Section.jsx'
import SaveChoiceModal from './components/SaveChoiceModal.jsx'
import PromptModal from './components/PromptModal.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import RestoredBanner from './components/RestoredBanner.jsx'
import Toast from './components/Toast.jsx'

const FIRST_TYPE = AUDIT_TYPES[0].id

export default function App() {
  // Base template = all three types. Starts from hardcoded default, may be
  // replaced by the blob on load.
  const [baseTemplate, setBaseTemplate] = useState(() => clone(defaultTemplate))
  const [status, setStatus] = useState('loading')

  const [typeId, setTypeId] = useState(FIRST_TYPE)
  // Working copy of the active type — carries any client-only edits.
  const [workingType, setWorkingType] = useState(() => clone(defaultTemplate.types[FIRST_TYPE]))

  const [answers, setAnswers] = useState({})
  const [notes, setNotes] = useState({})
  const [observations, setObservations] = useState({})
  const [cover, setCover] = useState({ client: '', date: today(), auditor: '' })

  const [dirty, setDirty] = useState(false)
  const [restored, setRestored] = useState(null)

  const [pendingEdit, setPendingEdit] = useState(null)
  const [savingBase, setSavingBase] = useState(false)
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [prompt, setPrompt] = useState(null)

  // ---- Load base template from blob on mount (fail soft) ------------------
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await fetchBaseTemplate()
      if (cancelled) return
      if (res.ok && res.template && res.template.types) {
        setBaseTemplate(res.template)
        // Refresh working copy only if the user hasn't started editing.
        setWorkingType(clone(res.template.types[FIRST_TYPE] || defaultTemplate.types[FIRST_TYPE]))
        setStatus('live')
      } else {
        setStatus('fallback')
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Warn before leaving with unsaved changes --------------------------
  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone })
  }, [])

  // ---- Cover / scoring handlers ------------------------------------------
  const updateCover = (key, value) => {
    setCover((c) => ({ ...c, [key]: value }))
    setDirty(true)
  }
  const setScore = (qid, val) => {
    setAnswers((a) => ({ ...a, [qid]: val }))
    setDirty(true)
  }
  const setNote = (qid, val) => {
    setNotes((n) => ({ ...n, [qid]: val }))
    setDirty(true)
  }
  const setObservation = (sid, val) => {
    setObservations((o) => ({ ...o, [sid]: val }))
    setDirty(true)
  }

  // ---- Question edit / add / delete --------------------------------------
  const requestEdit = (sectionId, questionId, { text, hint }) =>
    setPendingEdit({ op: { kind: 'edit', sectionId, questionId, text, hint } })
  const requestAdd = (sectionId, { text, hint }) =>
    setPendingEdit({ op: { kind: 'add', sectionId, text, hint } })
  const requestDelete = (sectionId, questionId) =>
    setPendingEdit({ op: { kind: 'delete', sectionId, questionId } })

  const applyClientOnly = () => {
    const { op } = pendingEdit
    setWorkingType((t) => applyOpToType(t, op))
    setDirty(true)
    setPendingEdit(null)
    showToast('Saved to this client only', 'info')
  }

  const applyToBase = async () => {
    const { op } = pendingEdit
    setSavingBase(true)
    const nextBaseType = applyOpToType(baseTemplate.types[typeId], op)
    const nextBase = {
      ...baseTemplate,
      types: { ...baseTemplate.types, [typeId]: nextBaseType },
    }
    const res = await saveBaseTemplate(nextBase)
    setSavingBase(false)

    // Always reflect the change in the current audit so the edit isn't lost.
    setWorkingType((t) => applyOpToType(t, op))
    setPendingEdit(null)

    if (res.ok) {
      setBaseTemplate(nextBase)
      setStatus('live')
      showToast('Base template updated for all future audits', 'success')
    } else {
      // Soft failure: keep the edit on this client and be honest about it.
      setDirty(true)
      showToast(
        res.error
          ? `${res.error} Saved to this client instead.`
          : "Couldn't reach the template store. Saved to this client instead.",
        'error'
      )
    }
  }

  // ---- Type switching (guarded) ------------------------------------------
  const doSwitchType = (newType) => {
    setTypeId(newType)
    setWorkingType(clone(baseTemplate.types[newType] || defaultTemplate.types[newType]))
    setAnswers({})
    setNotes({})
    setObservations({})
    setRestored(null)
    setDirty(false)
  }
  const changeType = (newType) => {
    if (newType === typeId) return
    if (dirty) {
      setConfirm({
        title: 'Switch audit type?',
        message:
          'Switching audit type will clear the current scores and notes. Export first if you want to keep them.',
        confirmLabel: 'Switch and clear',
        onConfirm: () => {
          setConfirm(null)
          doSwitchType(newType)
        },
      })
    } else {
      doSwitchType(newType)
    }
  }

  // ---- New audit (guarded) -----------------------------------------------
  const doNew = () => {
    setWorkingType(clone(baseTemplate.types[typeId] || defaultTemplate.types[typeId]))
    setAnswers({})
    setNotes({})
    setObservations({})
    setCover({ client: '', date: today(), auditor: '' })
    setRestored(null)
    setDirty(false)
  }
  const newAudit = () => {
    if (dirty) {
      setConfirm({
        title: 'Start a new audit?',
        message: 'This clears the current audit. Unsaved changes will be lost.',
        confirmLabel: 'Start new',
        onConfirm: () => {
          setConfirm(null)
          doNew()
        },
      })
    } else {
      doNew()
    }
  }

  // ---- Export / Import ----------------------------------------------------
  const handleExport = () => {
    downloadAudit({ cover, answers, notes, observations }, workingType)
    setDirty(false)
    showToast('Audit exported', 'success')
  }

  const loadImport = (data) => {
    setTypeId(data.typeId)
    setWorkingType(data.type)
    setAnswers(data.answers || {})
    setNotes(data.notes || {})
    setObservations(data.observations || {})
    setCover({
      client: data.cover?.client || '',
      date: data.cover?.date || '',
      auditor: data.cover?.auditor || '',
    })
    setRestored({
      client: data.cover?.client,
      date: data.cover?.date,
      typeLabel: data.typeLabel || data.type?.label,
    })
    setDirty(false)
    showToast('Audit restored from file', 'success')
  }

  const handleImport = async (file) => {
    let text
    try {
      text = await readFileAsText(file)
    } catch (_) {
      showToast('Could not read that file.', 'error')
      return
    }
    const parsed = parseImport(text)
    if (!parsed.ok) {
      showToast(parsed.error, 'error')
      return
    }
    if (dirty) {
      setConfirm({
        title: 'Import will replace the current audit',
        message: 'Unsaved changes will be lost. Continue?',
        confirmLabel: 'Import',
        onConfirm: () => {
          setConfirm(null)
          loadImport(parsed.data)
        },
      })
    } else {
      loadImport(parsed.data)
    }
  }

  // ---- Prompt -------------------------------------------------------------
  const openPrompt = () => {
    setPrompt(generatePrompt(workingType, { cover, answers, notes, observations }))
  }

  const overall = useMemo(
    () => overallScore(workingType, answers),
    [workingType, answers]
  )

  return (
    <div className="min-h-full">
      <Header
        status={status}
        onImport={handleImport}
        onExport={handleExport}
        onNew={newAudit}
        dirty={dirty}
      />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-body">
              {workingType.label}
            </h1>
            <p className="mt-1 max-w-prose text-sm text-muted">{workingType.intro}</p>
          </div>

          <RestoredBanner info={restored} onDismiss={() => setRestored(null)} />

          <Cover
            cover={cover}
            typeId={typeId}
            onCover={updateCover}
            onChangeType={changeType}
          />

          {/* Overall progress chip */}
          <div className="flex items-center justify-between rounded-xl border border-divider bg-surface/60 px-4 py-3">
            <span className="text-sm font-medium text-body">Overall score</span>
            <span className="text-sm text-muted">
              {overall.average != null ? (
                <>
                  <span className="text-lg font-bold text-accent">
                    {overall.average.toFixed(1)}
                  </span>{' '}
                  / 5 · {band(overall.average)} · {overall.answered}/{overall.total} scored
                </>
              ) : (
                `0 / ${overall.total} scored`
              )}
            </span>
          </div>

          <div className="space-y-8">
            {workingType.sections.map((section, i) => (
              <Section
                key={section.id}
                section={section}
                number={i + 1}
                answers={answers}
                notes={notes}
                observation={observations[section.id]}
                onScore={setScore}
                onNote={setNote}
                onObservation={(v) => setObservation(section.id, v)}
                onRequestEdit={requestEdit}
                onRequestAdd={requestAdd}
                onRequestDelete={requestDelete}
              />
            ))}
          </div>

          {/* Generate prompt */}
          <div className="rounded-2xl border border-divider bg-surface/60 p-5 text-center sm:p-6">
            <h2 className="text-lg font-semibold text-body">Findings brief</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted">
              Generate a copy-ready Claude prompt from this audit — scores, notes, and
              section summaries, in Sonder's voice.
            </p>
            <button
              type="button"
              onClick={openPrompt}
              className="mt-4 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Generate Claude prompt
            </button>
          </div>

          <footer className="pb-10 pt-2 text-center text-xs text-muted">
            Sonder Creative — internal audit tool
          </footer>
        </div>
      </main>

      <SaveChoiceModal
        pending={pendingEdit}
        saving={savingBase}
        onBase={applyToBase}
        onClient={applyClientOnly}
        onCancel={() => setPendingEdit(null)}
      />
      <PromptModal open={!!prompt} prompt={prompt || ''} onClose={() => setPrompt(null)} />
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        onConfirm={confirm?.onConfirm}
        onCancel={() => setConfirm(null)}
      />
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

function today() {
  return new Date().toISOString().slice(0, 10)
}
