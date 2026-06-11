// Scoring helpers. A "score" lives in audit.answers[questionId] = 1..5 | null.

import { SCALE } from '../data/defaultTemplate.js'

// Average of answered questions in a section, rounded to one decimal.
// Unanswered questions are ignored so a half-done section still reads sensibly.
export function sectionScore(section, answers) {
  const scores = section.questions
    .map((q) => answers[q.id])
    .filter((s) => typeof s === 'number')
  if (scores.length === 0) {
    return { total: 0, count: 0, max: section.questions.length * SCALE.max, average: null }
  }
  const total = scores.reduce((a, b) => a + b, 0)
  return {
    total,
    count: scores.length,
    answeredCount: scores.length,
    questionCount: section.questions.length,
    max: section.questions.length * SCALE.max,
    average: Math.round((total / scores.length) * 10) / 10,
  }
}

// Overall average across every answered question in the audit type.
export function overallScore(type, answers) {
  const all = type.sections.flatMap((s) => s.questions.map((q) => answers[q.id]))
  const scores = all.filter((s) => typeof s === 'number')
  const answerable = all.length
  if (scores.length === 0) return { average: null, answered: 0, total: answerable }
  const sum = scores.reduce((a, b) => a + b, 0)
  return {
    average: Math.round((sum / scores.length) * 10) / 10,
    answered: scores.length,
    total: answerable,
  }
}

// A short qualitative band for a numeric average. Used in the prompt + UI chip.
export function band(average) {
  if (average == null) return 'not scored'
  if (average >= 4.5) return 'strong'
  if (average >= 3.5) return 'solid'
  if (average >= 2.5) return 'mixed'
  if (average >= 1.5) return 'weak'
  return 'significant issues'
}
