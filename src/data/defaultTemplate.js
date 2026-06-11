// ---------------------------------------------------------------------------
// Sonder Creative — default audit question set.
//
// SOURCE OF TRUTH: sonder-audit-methodology.docx.
// This is the hardcoded fallback used when the Netlify Blob base template is
// empty or unavailable. It also seeds the blob the first time someone saves.
//
// HINTS: the doc lists hints at the section level and does not provide one per
// question. Where the doc supplied a hint it is used verbatim. Where it ran
// short, the missing hint is written in Sonder voice and tagged `invented: true`
// so the team can review or swap them. Search this file for `invented` to find
// every hint that did not come straight from the doc.
//
// SCHEMA_VERSION lets us detect blob templates saved by an older shape.
// ---------------------------------------------------------------------------

export const SCHEMA_VERSION = 1

// Helper to keep question objects terse below. `inv` marks an invented hint.
const q = (id, text, hint, inv = false) => ({
  id,
  text,
  hint,
  invented: inv,
})

export const AUDIT_TYPES = [
  { id: 'brand', label: 'Brand Health Review', short: 'Brand', icon: 'sparkles' },
  { id: 'website', label: 'Website Performance Review', short: 'Website', icon: 'monitor' },
  { id: 'marketing', label: 'Digital Marketing Assessment', short: 'Marketing', icon: 'megaphone' },
  { id: 'growth', label: 'Growth Audit', short: 'Growth', icon: 'layers' },
]

export const SCALE = {
  min: 1,
  max: 5,
  low: '1 = significant issues',
  high: '5 = strong',
}

export const defaultTemplate = {
  schemaVersion: SCHEMA_VERSION,
  types: {
    // ---------------------------------------------------------------- BRAND
    brand: {
      id: 'brand',
      label: 'Brand Health Review',
      intro:
        'Assesses whether the brand is doing its job: clarity of positioning, consistency across touchpoints, and how it performs against relevant comparators.',
      sections: [
        {
          id: 'positioning-clarity',
          name: 'Positioning clarity',
          questions: [
            q(
              'b1',
              'Is it immediately clear who this organization serves and what it does?',
              'Test it cold. Would a stranger get it in 10 seconds?'
            ),
            q(
              'b2',
              'Does the positioning differentiate, or does it describe a category?',
              'Look for language that could apply to 10 competitors.'
            ),
            q(
              'b3',
              'Is there a point of view — something the brand actually stands for beyond what it sells?',
              "Mission statements don't count. Look for a genuine perspective."
            ),
            q(
              'b4',
              "Does the positioning match the audience it's trying to reach?",
              'Language, tone, and level of specificity matter here.'
            ),
          ],
        },
        {
          id: 'messaging-consistency',
          name: 'Messaging consistency',
          questions: [
            q(
              'b5',
              'Does the website, proposal deck, and any sales materials tell the same story?',
              'Inconsistency usually shows up in how the organization describes its differentiators.'
            ),
            q(
              'b6',
              'Are key messages landing at the right level of specificity — concrete and credible, not vague?',
              'Watch for "we deliver results" type language.'
            ),
            q(
              'b7',
              'Is the tone consistent across materials, or does it shift register between formal and casual?',
              'Read a paragraph from each source aloud. Does the same person seem to be speaking?',
              true
            ),
            q(
              'b8',
              'Does the headline hierarchy guide a reader through the right story, in the right order?',
              'Read just the headings. Does it make sense on its own?'
            ),
          ],
        },
        {
          id: 'visual-identity',
          name: 'Visual identity',
          questions: [
            q(
              'b9',
              'Is the visual system coherent across touchpoints — website, print, digital?',
              'Look for rogue colours, inconsistent logo use, or clashing type choices.'
            ),
            q(
              'b10',
              'Does the identity feel appropriate for the audience and the category?',
              'Not just "does it look nice" — does it read correctly to the right people?'
            ),
            q(
              'b11',
              'Is there a clear visual hierarchy that guides the eye?',
              'Squint at the page. Does your eye land where it should first?',
              true
            ),
            q(
              'b12',
              'Does the visual identity feel current — or is it showing its age?',
              'Compare against two or three brands the audience already trusts.',
              true
            ),
          ],
        },
        {
          id: 'competitive-context',
          name: 'Competitive context',
          questions: [
            q(
              'b13',
              'How clearly is the organization differentiated from three to five relevant comparators?',
              'Pull up their websites side by side if possible.'
            ),
            q(
              'b14',
              'Are there areas where the brand blends in rather than stands out?',
              'Note any claim a competitor could copy word for word.',
              true
            ),
            q(
              'b15',
              'Is there a gap in the competitive landscape this brand could own more deliberately?',
              'Look for a position no competitor is clearly claiming yet.',
              true
            ),
          ],
        },
      ],
    },

    // -------------------------------------------------------------- WEBSITE
    website: {
      id: 'website',
      label: 'Website Performance Review',
      intro:
        'Evaluates whether the website is doing its primary job — giving the right people enough confidence to take the next step. Covers user experience, content, conversion, SEO, and technical health.',
      sections: [
        {
          id: 'first-impressions',
          name: 'First impressions',
          questions: [
            q(
              'w1',
              'What does a first-time visitor understand within the first 10 seconds?',
              "Time yourself. Don't read — scan."
            ),
            q(
              'w2',
              'Is the value proposition clear above the fold on the homepage?',
              'If you had to leave after one screen, would you know what they offer?',
              true
            ),
            q(
              'w3',
              'Does the visual experience build credibility or undermine it?',
              'Trust signals, quality of imagery, whitespace, and visual polish all factor in.'
            ),
            q(
              'w4',
              'Does the site feel appropriate for the intended audience?',
              'A consumer brand and a B2B service firm should feel different.'
            ),
          ],
        },
        {
          id: 'ux-navigation',
          name: 'User experience and navigation',
          questions: [
            q(
              'w5',
              "Can visitors find what they're looking for without working for it?",
              'Try completing a key task as a first-time visitor.'
            ),
            q(
              'w6',
              'Is the navigation structure logical and clearly labelled?',
              'Clever menu labels often obscure more than they reveal.'
            ),
            q(
              'w7',
              'Are calls to action clear, well-placed, and consistent?',
              'Count how many CTAs compete on a single page.'
            ),
            q(
              'w8',
              'Does the mobile experience hold up — layout, readability, touch targets?',
              'Open it on an actual phone, not a resized browser window.',
              true
            ),
          ],
        },
        {
          id: 'content-messaging',
          name: 'Content and messaging',
          questions: [
            q(
              'w9',
              "Is the copy written from the reader's perspective, or the organization's?",
              'Count "we/our" versus "you/your" as a quick diagnostic.'
            ),
            q(
              'w10',
              'Are service or product descriptions specific enough to be useful?',
              'Generic descriptions create price pressure. Specificity builds confidence.'
            ),
            q(
              'w11',
              'Does the content guide a visitor toward a decision — or just inform them?',
              'Follow the copy. Does it ever ask for the next step?',
              true
            ),
            q(
              'w12',
              'Is there enough proof — case studies, results, testimonials, recognizable clients?',
              'Look for evidence a skeptic would believe, not just claims.',
              true
            ),
          ],
        },
        {
          id: 'seo-fundamentals',
          name: 'SEO fundamentals',
          questions: [
            q(
              'w13',
              'Are page titles and meta descriptions present, unique, and written for search intent?',
              'View source or use a crawler. Check the first 20 pages.',
              true
            ),
            q(
              'w14',
              'Is there a clear heading structure (H1, H2, H3) used correctly across key pages?',
              'One H1 per page, headings nested in order.',
              true
            ),
            q(
              'w15',
              'Is the site indexable — no robots.txt blocks, sitemaps present, no major crawl errors?',
              'Check robots.txt and the XML sitemap directly.',
              true
            ),
            q(
              'w16',
              'Does the content align with what the target audience is actually searching for?',
              'Keyword alignment vs. internal language.'
            ),
          ],
        },
        {
          id: 'technical-health',
          name: 'Technical health',
          questions: [
            q(
              'w17',
              'How does the site perform on Core Web Vitals — LCP, CLS, FID?',
              'Run through PageSpeed Insights. Flag anything below 70.'
            ),
            q(
              'w18',
              'Is the site free of broken links, missing images, or broken form submissions?',
              'Click through the main journeys and submit a test form.',
              true
            ),
            q(
              'w19',
              'Are accessibility basics in place — alt text, colour contrast, keyboard navigation?',
              'Tab through the page. Can you reach everything without a mouse?',
              true
            ),
            q(
              'w20',
              'Is the CMS / platform current, secure, and maintainable?',
              'Note plugin versions and any obvious technical debt.'
            ),
          ],
        },
      ],
    },

    // ------------------------------------------------------------ MARKETING
    marketing: {
      id: 'marketing',
      label: 'Digital Marketing Assessment',
      intro:
        'Reviews whether current marketing activity is pointed in the right direction relative to actual goals. Covers SEO performance, paid search, content, and channel alignment.',
      sections: [
        {
          id: 'goals-current-state',
          name: 'Goals and current state',
          questions: [
            q(
              'm1',
              'Are marketing goals clearly defined and measurable — not just "more traffic"?',
              'Look for specific outcomes: leads, bookings, revenue, retention.'
            ),
            q(
              'm2',
              'Is there a shared understanding across the team of what success looks like?',
              'Ask two people what success means. Do the answers match?',
              true
            ),
            q(
              'm3',
              'Is there a tracking setup in place that actually measures what matters?',
              'GA4, call tracking, form completions, CRM attribution.'
            ),
            q(
              'm4',
              'Is there a documented channel strategy — or are channels active by habit or instinct?',
              "Ask why each channel is running. Listen for \"we've always done it.\"",
              true
            ),
          ],
        },
        {
          id: 'seo-performance',
          name: 'SEO performance',
          questions: [
            q(
              'm5',
              'Is organic visibility growing, flat, or declining over the past 12 months?',
              'Pull data from GSC or SEMrush.'
            ),
            q(
              'm6',
              'Are there clear keyword opportunities the site is underserving?',
              'Look for terms with demand where they rank on page two.',
              true
            ),
            q(
              'm7',
              'Is the content on the site aligned with actual search intent — or is it written for internal audiences?',
              'Match top pages against what people actually search.',
              true
            ),
            q(
              'm8',
              'Are there technical SEO issues limiting performance?',
              'Crawl errors, slow pages, duplicate content, index bloat.'
            ),
          ],
        },
        {
          id: 'paid-search',
          name: 'Paid search',
          questions: [
            q(
              'm9',
              'Is the campaign structure logical and well-organized?',
              'Ad groups, match types, and negative keyword lists.'
            ),
            q(
              'm10',
              'Is spend concentrated on the highest-converting terms — or spread too thin?',
              'Sort spend by conversion. Look for budget on terms that never convert.',
              true
            ),
            q(
              'm11',
              'Are Quality Scores healthy and are ads being served to the right audiences?',
              'Check Quality Score by keyword and the search terms report.',
              true
            ),
            q(
              'm12',
              'Is conversion tracking accurate and attributed correctly?',
              'Fire a test conversion. Verify it lands in the right place.'
            ),
          ],
        },
        {
          id: 'content-channel-alignment',
          name: 'Content and channel alignment',
          questions: [
            q(
              'm13',
              'Is content being produced with a specific audience and intent in mind — or for its own sake?',
              'For each piece, name the reader and the action it should prompt.',
              true
            ),
            q(
              'm14',
              'Is the content producing measurable outcomes — traffic, leads, engagement?',
              'Tie recent content to a number, not a feeling.',
              true
            ),
            q(
              'm15',
              'Are the active channels appropriate for the audience being targeted?',
              'LinkedIn vs. Instagram vs. email vs. search — not all channels serve all audiences.'
            ),
            q(
              'm16',
              'Is there a clear path from content engagement to a meaningful next step for the reader?',
              'Follow a reader from a post. Where does the trail end?',
              true
            ),
          ],
        },
      ],
    },
  },
}

// ---------------------------------------------------------------------------
// Growth Audit = the complete picture: brand + website + marketing reviewed in
// one pass. Built from the other three types so it always stays in sync with
// their content, but with its own `g-` prefixed ids so editing/scoring a Growth
// question is independent of the standalone audits. Each section carries a
// `group` label so the UI can show which pillar it belongs to.
// ---------------------------------------------------------------------------
function buildGrowthType(tpl) {
  const deep = (o) => JSON.parse(JSON.stringify(o))
  const sources = ['brand', 'website', 'marketing']
  const sections = []
  for (const key of sources) {
    const t = tpl.types[key]
    for (const s of t.sections) {
      const cs = deep(s)
      cs.id = `g-${cs.id}`
      cs.group = t.label
      cs.questions = cs.questions.map((qn) => ({ ...qn, id: `g-${qn.id}` }))
      sections.push(cs)
    }
  }
  return {
    id: 'growth',
    label: 'Growth Audit',
    intro:
      'The complete picture: brand, website, and digital marketing reviewed together in one pass. Use this when a client needs everything assessed at once.',
    sections,
  }
}

defaultTemplate.types.growth = buildGrowthType(defaultTemplate)

// Used when loading a base template from the blob that predates the Growth type:
// derive it from the loaded brand/website/marketing sets so the tab always works.
export function ensureGrowth(template) {
  if (template && template.types && !template.types.growth) {
    template.types.growth = buildGrowthType(template)
  }
  return template
}

export default defaultTemplate
