// GET /api/get-template
// Reads the `base-template` key from the `audit-template` blob store.
// Returns { template: <json> } or { template: null } when the blob is empty.

import { getStore } from '@netlify/blobs'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: CORS })
  }
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: CORS,
    })
  }

  try {
    const store = getStore('audit-template')
    const template = await store.get('base-template', { type: 'json' })
    return new Response(JSON.stringify({ template: template ?? null }), {
      status: 200,
      headers: CORS,
    })
  } catch (err) {
    // Blob unavailable / not configured — let the client fall back silently.
    return new Response(
      JSON.stringify({ template: null, error: 'Template store unavailable' }),
      { status: 200, headers: CORS }
    )
  }
}

export const config = { path: '/api/get-template' }
