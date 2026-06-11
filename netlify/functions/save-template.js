// POST /api/save-template  { template: <json> }
// Writes the full default question set to the `base-template` key.
// This updates the default for all future audits.

import { getStore } from '@netlify/blobs'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: CORS })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: CORS,
    })
  }

  let body
  try {
    body = await req.json()
  } catch (_) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: CORS,
    })
  }

  const template = body && body.template
  // Light structural validation before we overwrite the shared default.
  if (!template || typeof template !== 'object' || !template.types) {
    return new Response(
      JSON.stringify({ error: 'Template payload is missing or malformed.' }),
      { status: 400, headers: CORS }
    )
  }

  try {
    const store = getStore('audit-template')
    await store.setJSON('base-template', template)
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: CORS })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Could not write to the template store.' }),
      { status: 500, headers: CORS }
    )
  }
}

export const config = { path: '/api/save-template' }
