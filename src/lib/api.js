// Thin client for the Netlify Functions that read/write the base template blob.
// Every call fails soft: callers fall back to the hardcoded default silently.

const GET_URL = '/api/get-template'
const SAVE_URL = '/api/save-template'

// Returns { ok, template } or { ok: false }. Never throws.
export async function fetchBaseTemplate() {
  try {
    const res = await fetch(GET_URL, { method: 'GET' })
    if (!res.ok) return { ok: false }
    const data = await res.json()
    // Empty blob -> function returns { template: null }
    if (!data || !data.template) return { ok: false, empty: true }
    return { ok: true, template: data.template }
  } catch (_) {
    return { ok: false }
  }
}

// Saves the full template object to the blob. Returns { ok } or { ok: false, error }.
export async function saveBaseTemplate(template) {
  try {
    const res = await fetch(SAVE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template }),
    })
    if (!res.ok) {
      let msg = `Save failed (${res.status}).`
      try {
        const body = await res.json()
        if (body && body.error) msg = body.error
      } catch (_) {
        /* ignore */
      }
      return { ok: false, error: msg }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: 'Could not reach the template service.' }
  }
}
