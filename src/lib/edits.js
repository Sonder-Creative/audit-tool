// Pure helpers for applying a question edit/add/delete to an audit type object.
// Always returns a new object — never mutates the input.

const clone = (o) => JSON.parse(JSON.stringify(o))

function newQuestionId(typeId) {
  return `${typeId}-c${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`
}

// op shapes:
//   { kind: 'edit',   sectionId, questionId, text, hint }
//   { kind: 'add',    sectionId, text, hint }
//   { kind: 'delete', sectionId, questionId }
export function applyOpToType(type, op) {
  const next = clone(type)
  const section = next.sections.find((s) => s.id === op.sectionId)
  if (!section) return next

  if (op.kind === 'edit') {
    const q = section.questions.find((x) => x.id === op.questionId)
    if (q) {
      q.text = op.text
      q.hint = op.hint
      q.invented = false // edited by a human — no longer auto-generated
    }
  } else if (op.kind === 'add') {
    section.questions.push({
      id: newQuestionId(next.id),
      text: op.text,
      hint: op.hint,
      invented: false,
      clientAdded: true,
    })
  } else if (op.kind === 'delete') {
    section.questions = section.questions.filter((x) => x.id !== op.questionId)
  }

  return next
}

export { clone }
