// Client JSON export / import. Round-trips the FULL audit state, including any
// client-specific question edits, so an imported file restores exactly.

import { SCHEMA_VERSION } from '../data/defaultTemplate.js'
import { sectionScore, overallScore } from './scoring.js'

const slug = (s) =>
  (s || 'client')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'client'

const typeWord = (typeId) =>
  ({ brand: 'brand', website: 'website', marketing: 'marketing' }[typeId] || typeId)

// e.g. acme-brand-audit-2026-06-11.json
export function exportFilename(cover, typeId) {
  const date = cover.date || new Date().toISOString().slice(0, 10)
  return `${slug(cover.client)}-${typeWord(typeId)}-audit-${date}.json`
}

// Build the serializable payload. `type` is the active audit type object,
// including any client edits made to its questions/sections.
export function buildExport(audit, type) {
  // Pre-compute section summaries so the file is self-describing even outside the app.
  const sectionSummaries = type.sections.map((s) => {
    const score = sectionScore(s, audit.answers)
    return {
      sectionId: s.id,
      name: s.name,
      average: score.average,
      total: score.total,
      max: score.max,
      scored: score.count,
      observation: (audit.observations[s.id] || '').trim(),
    }
  })

  return {
    sonderAudit: true,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    cover: {
      client: audit.cover.client || '',
      date: audit.cover.date || '',
      auditor: audit.cover.auditor || '',
    },
    typeId: type.id,
    typeLabel: type.label,
    // Full question set as used for THIS client (captures client-only edits).
    type,
    answers: audit.answers,
    notes: audit.notes,
    observations: audit.observations,
    sectionSummaries,
    overall: overallScore(type, audit.answers),
  }
}

// Trigger a browser download of the JSON.
export function downloadAudit(audit, type) {
  const payload = buildExport(audit, type)
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = exportFilename(audit.cover, type.id)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return payload
}

// Validate + parse an imported file. Returns { ok, data | error }.
export function parseImport(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    return { ok: false, error: 'That file is not valid JSON.' }
  }
  if (!data || data.sonderAudit !== true || !data.type || !data.typeId) {
    return { ok: false, error: 'This does not look like a Sonder audit export.' }
  }
  if (!Array.isArray(data.type.sections)) {
    return { ok: false, error: 'The audit file is missing its question structure.' }
  }
  return { ok: true, data }
}

// Read a File object to text (used by the import <input>).
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsText(file)
  })
}
