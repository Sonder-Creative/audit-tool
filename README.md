# Sonder Creative — Audit Tool

Internal client audit tool for running brand, website, and digital marketing
audits, exporting per-client results, and generating a copy-ready Claude prompt
for a findings brief.

Stack: React + Vite + Tailwind. Base template persistence via Netlify Blobs
through a Netlify serverless function. No external database, no auth.

## Run locally

```bash
npm install
npm run dev          # Vite dev server (UI only; blob functions not active)
```

The Netlify Functions (`/api/get-template`, `/api/save-template`) only run under
the Netlify dev server or a real deploy. To test blob persistence locally:

```bash
npm install -g netlify-cli   # once
netlify dev                  # serves the app + functions together
```

Without the functions, the app loads the **hardcoded default question set**
silently and the "Save to base template" option will fall back to saving on the
current client only. Everything else works.

## Deploy to Netlify

1. Push this folder to a Git repo and "Add new site" in Netlify (or
   `netlify deploy --build`).
2. Build settings are already in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
3. **Enable Blobs.** Netlify Blobs works automatically on the linked site once
   the function uses `@netlify/blobs` (already wired). No env vars needed for the
   default store. The store is named `audit-template`; the key is `base-template`.
4. First load: the blob is empty, so the app uses the hardcoded default. The
   first time someone clicks **Save to base template**, the function writes the
   full question set to the blob, and every future audit loads from it.

### Confirm the blob round-trip after deploy
- Edit a question and choose **Save to base template** → expect the green
  "Base template updated" toast.
- Reload the page → your edit should still be there (now coming from the blob,
  shown by the green "Base template · live" dot in the header).

## How it works

- **Three audit types**: Brand Health Review, Website Performance Review,
  Digital Marketing Assessment. Source of truth for all questions, hints, and
  sections is `src/data/defaultTemplate.js` (transcribed from
  `sonder-audit-methodology.docx`).
- **Scoring**: each question scores 1–5 (1 = significant issues, 5 = strong).
  Section summaries auto-calculate as the average of answered questions.
- **Question editing**: edit / add / delete any question inline. Saving prompts
  for **base template** (writes the blob, changes the default for everyone) or
  **client only** (stays in this audit and its JSON export).
- **Export / import**: Export writes `client-type-audit-YYYY-MM-DD.json`
  containing cover info, the full question set (including client edits), all
  scores, notes, section summaries, and a timestamp. Import restores the exact
  state and shows a "Restored" banner.
- **Generate Claude prompt**: builds a prompt with a locked preamble and locked
  Sonder voice rules, injects all audit data, and shows it in a modal with a
  one-click copy button. The prompt is for manual paste — no Claude API call.
- **Dark mode**: header toggle, persisted to `localStorage`, system preference
  respected on first run.

### A note on hints
The methodology doc lists hints at the section level and does not give one per
question. Where the doc supplied a hint it is used verbatim; where it ran short,
a hint was written in Sonder voice and tagged `invented: true` in
`src/data/defaultTemplate.js`. Search that file for `invented` to review or swap
those (28 hints are from the doc, 23 are filled-in).

## Project structure

```
netlify/functions/   get-template.js · save-template.js  (blob read/write + CORS)
src/data/            defaultTemplate.js                   (question set / fallback)
src/lib/             scoring · prompt · fileIO · api · edits
src/components/      Header · Cover · Section · Question · ScoreButtons ·
                     SaveChoiceModal · PromptModal · ConfirmDialog ·
                     RestoredBanner · Toast · Modal · Logo
src/theme/           ThemeProvider.jsx                    (dark mode)
src/App.jsx          state + flows
```

## Not included (by design)
No authentication, no multi-user sync, no dashboard or audit history, no direct
Claude API call.
