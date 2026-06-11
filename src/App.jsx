import { useEffect, useMemo, useState, useCallback, Fragment } from 'react'
import defaultTemplate, { AUDIT_TYPES, ensureGrowth } from './data/defaultTemplate.js'
import { fetchBaseTemplate, saveBaseTemplate } from './lib/api.js'
import { applyOpToType, clone } from './lib/edits.js'
import { downloadAudit, parseImport, readFileAsText } from './lib/fileIO.js'
import { generatePrompt } from './lib/prompt.js'
import { overallScore, band } from './lib/scoring.js'

import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Cover from './components/Cover.jsx'
import Section from './components/Section.jsx'
import SaveChoiceModal from './components/SaveChoiceModal.jsx'
import PromptModal from './components/PromptModal.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import RestoredBanner from './components/RestoredBanner.jsx'
import Toast from './components/Toast.jsx'

const FIRST_TYPE = AUDIT_TYPES[0].id

export default function App() {
  const [baseTemplate, setBaseTemplate] = useState(() => clone(defaultTemplate))
  const [status, setStatus] = useState('loading')

  const [typeId, setTypeId] = useState(FIRST_TYPE)
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
  const [menuOpen, setMenuOpen] = useState(false)

  // ---- Load base template from blob on mount (fail soft) ------------------
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await fetchBaseTemplate()
      if (cancelled) return
      if (res.ok && res.template && res.template.types) {
        const tmpl = ensureGrowth(res.template)
        setBaseTemplate(tmpl)
        setWorkingType(clone(tmpl.types[FIRST_TYPE] || defaultTemplate.types[FIRST_TYPE]))
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

    setWorkingType((t) => applyOpToType(t, op))
    setPendingEdit(null)

    if (res.ok) {
      setBaseTemplate(nextBase)
      setStatus('live')
      showToast('Base template updated for all future audits', 'success')
    } else {
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
    setMenuOpen(false)
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
    setMenuOpen(false)
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
    setMenuOpen(false)
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
    setMenuOpen(false)
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

  const overall = useMemo(() => overallScore(workingType, answers), [workingType, answers])

  // Precompute group labels (only the Growth audit uses them).
  const rows = useMemo(() => {
    let last = null
    return workingType.sections.map((section, i) => {
      const showGroup = section.group && section.group !== last
      last = section.group
      return { section, number: i + 1, group: showGroup ? section.group : null }
    })
  }, [workingType])

  return (
    <div className="min-h-full">
      <Sidebar
        types={AUDIT_TYPES}
        effectiveTypes={baseTemplate.types}
        activeType={typeId}
        onSelectType={changeType}
        onNew={newAudit}
        onImport={handleImport}
        onExport={handleExport}
        status={status}
        dirty={dirty}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="lg:pl-[264px]">
        <TopBar title={workingType.label} onMenu={() => setMenuOpen(true)} />

        <main className="dot-grid min-h-screen">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-body sm:text-3xl">
                  {workingType.label}
                </h1>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
                  {workingType.intro}
                </p>
              </div>

              <RestoredBanner info={restored} onDismiss={() => setRestored(null)} />

              <Cover cover={cover} onCover={updateCover} />

              {/* Overall progress */}
              <div className="card flex items-center justify-between px-5 py-4">
                <span className="text-sm font-medium text-body">Overall score</span>
                <span className="text-sm text-muted">
                  {overall.average != null ? (
                    <>
                      <span className="text-lg font-bold tabular-nums text-accent">
                        {overall.average.toFixed(1)}
                      </span>{' '}
                      / 5 · {band(overall.average)} · {overall.answered}/{overall.total} scored
                    </>
                  ) : (
                    `0 / ${overall.total} scored`
                  )}
                </span>
              </div>

              {/* Sections */}
              <div className="space-y-12 pt-2 sm:space-y-14">
                {rows.map(({ section, number, group }) => (
                  <Fragment key={section.id}>
                    {group && (
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                          {group}
                        </span>
                        <span className="h-px flex-1 bg-divider/50" />
                      </div>
                    )}
                    <Section
                      section={section}
                      number={number}
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
                  </Fragment>
                ))}
              </div>

              {/* Generate prompt */}
              <div className="card mt-4 p-6 text-center sm:p-8">
                <h2 className="text-lg font-semibold text-body">Findings brief</h2>
                <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">
                  Generate a copy-ready Claude prompt from this audit — scores, notes, and
                  section summaries, in Sonder's voice.
                </p>
                <button
                  type="button"
                  onClick={openPrompt}
                  className="mt-5 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-card transition-opacity hover:opacity-90"
                >
                  Generate Claude prompt
                </button>
              </div>

              <footer className="pb-12 pt-2 text-center text-xs text-muted">
                Sonder Creative — internal audit tool
              </footer>
            </div>
          </div>
        </main>
      </div>

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
