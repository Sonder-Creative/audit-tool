// Generates the copy-ready Claude prompt from audit state.
// The preamble and voice rules are LOCKED constants — not editable from the UI.

import { sectionScore, overallScore, band } from './scoring.js'

// --- Locked preamble (not editable in the UI) -----------------------------
const PREAMBLE = `You are a senior brand, web, and marketing strategist with 15+ years of agency experience. You know the Canadian market well. You are writing a client findings brief for Sonder Creative, and you write in Sonder Creative's voice.`

// --- Locked Sonder voice rules --------------------------------------------
const VOICE = `Write in Sonder Creative's voice:
- Warm, direct, and specific. Client-first: lead with the client's world, not Sonder's services.
- Use sentence case. No jargon. No em dashes. No bullet-point padding or filler.
- Be concrete. Name the actual issue and what it costs the client, then what to do about it.
- Confident but not salesy. You are a trusted advisor, not a pitch deck.`

// --- Locked output format instructions ------------------------------------
const OUTPUT_FORMAT = `Format the output as follows:
1. Executive summary: 3 to 4 sentences capturing the single most important thing the client needs to know.
2. Section-by-section findings: use the named sections. 2 to 3 sentences each, grounded in the scores and notes provided. Do not invent detail that is not supported by the notes.
3. Priority recommendations: the top 3 to 5, written as specific actions the client can take, not general advice.
4. Suggested next steps with Sonder: one short paragraph, written in Sonder's voice, on how Sonder would help from here.`

function fmtScore(s) {
  return typeof s === 'number' ? `${s}/5` : 'not scored'
}

// Build the structured data block: every section, question, score, note,
// plus section summary (average + observation).
function buildDataBlock(type, audit) {
  const { answers, notes, observations } = audit
  const lines = []
  type.sections.forEach((section) => {
    const score = sectionScore(section, answers)
    lines.push(`\n## ${section.name}`)
    section.questions.forEach((qn) => {
      const s = answers[qn.id]
      lines.push(`- (${fmtScore(s)}) ${qn.text}`)
      const note = (notes[qn.id] || '').trim()
      if (note) lines.push(`    Notes: ${note}`)
    })
    const avgText =
      score.average != null
        ? `${score.average}/5 (${band(score.average)}), ${score.total}/${score.max} across ${score.count} scored`
        : 'not scored'
    lines.push(`Section summary: ${avgText}`)
    const obs = (observations[section.id] || '').trim()
    if (obs) lines.push(`Section observation: ${obs}`)
  })
  return lines.join('\n')
}

export function generatePrompt(type, audit) {
  const overall = overallScore(type, audit.answers)
  const overallText =
    overall.average != null
      ? `${overall.average}/5 (${band(overall.average)}), ${overall.answered} of ${overall.total} questions scored`
      : 'not yet scored'

  const cover = audit.cover || {}
  const header = [
    `Client: ${cover.client || '[client name]'}`,
    `Audit type: ${type.label}`,
    `Auditor: ${cover.auditor || '[name]'}`,
    `Date: ${cover.date || '[date]'}`,
    `Overall score: ${overallText}`,
  ].join('\n')

  return `${PREAMBLE}

${VOICE}

You are preparing a findings brief for the following Sonder Creative audit. Use the scores and notes below to generate a structured report. Where notes are sparse, stay honest about what the score implies rather than inventing specifics.

${header}

Scores and notes by section:
${buildDataBlock(type, audit)}

${OUTPUT_FORMAT}`
}

// Exported for tests / reference.
export const LOCKED = { PREAMBLE, VOICE, OUTPUT_FORMAT }
