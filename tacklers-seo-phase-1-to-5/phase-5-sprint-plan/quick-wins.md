# Quick Wins — tacklersconsulting.com

**Effort: < 1 hour each. Impact: High.**

These are the fastest, highest-impact SEO improvements that can be deployed immediately.

---

## Quick Win 1: Fix Service Card Links

**Effort:** 10 minutes
**Impact:** Critical
**File:** Services pillar page (`/operational-excellence-consulting-uk`)

The service cards are rendered with `href: undefined`. Remove the line that strips the href property so all service cards link to their `/services/[slug]` detail pages.

```typescript
// CURRENT (broken):
{ ...card, cta: undefined, href: undefined }

// FIX:
{ ...card }
```

**Result:** 7 service detail pages gain their primary inbound link from the services pillar.

---

## Quick Win 2: Link Mentoring to Book Training

**Effort:** 15 minutes
**Impact:** High
**File:** `/lean-training-uk/page.tsx`

Add a prominent CTA linking to `/book-lean-training` from the mentoring page. Replace or supplement the "Download brochure" CTA (which points to `/contact` with no actual brochure).

**Result:** Conversion funnel completed for training enquiries.

---

## Quick Win 3: Remove WebSite SearchAction Schema

**Effort:** 10 minutes
**Impact:** Medium
**File:** `src/lib/structured-data.ts`

Remove the `SearchAction` from the WebSite structured data. The site has no search functionality, so this schema is inaccurate.

**Result:** Accurate structured data; no risk of Google flagging schema mismatch.

---

## Quick Win 4: Shorten Truncating Title Tags

**Effort:** 10 minutes
**Impact:** Medium
**Files:** Page metadata for services and about pages

| Page | Current title | Chars | Proposed | Chars |
|------|--------------|-------|----------|-------|
| Services | Operational Excellence Consulting UK — Tacklers Consulting Group | 65 | Operational Excellence Consulting UK — Tacklers | 50 |
| About | About Tacklers Consulting Group — Our People-First Lean Philosophy | 67 | UK Lean Consultants — About Tacklers Consulting Group | 54 |

**Result:** No more title truncation in SERPs.

---

## Quick Win 5: Add Blog Hub Introduction

**Effort:** 30 minutes
**Impact:** Medium
**File:** `/blog/page.tsx`

Add a 150–200 word introduction above the post listing. Include keywords: operational excellence, lean transformation, continuous improvement, Gemba. This gives the page unique content beyond a post list.

**Result:** Blog hub has indexable content and targets informational queries.

---

## Quick Win 6: Add Author Attribution to Blog Posts

**Effort:** 30 minutes
**Impact:** Medium
**File:** Blog post template / `src/lib/structured-data.ts`

Add author name and role to each blog post (visible on page + in BlogPosting schema). Link author to the about page. Add `dateModified` to schema.

**Result:** E-E-A-T signal improvement; richer search snippets.

---

## Quick Win 7: Add Internal Links to Existing Blog Posts

**Effort:** 45 minutes (4 posts × ~10 min each)
**Impact:** High
**File:** Blog post content in Supabase

For each of the 4 existing blog posts, add 3–5 contextual internal links:
- 1 link to a relevant service page
- 1 link to the services pillar page
- 1 link to `/discovery-call`
- 1 link to a related blog post

**Result:** Blog posts distributed PageRank to commercial pages; improved user journey.

---

## Quick Win 8: Link Home Industry Section to Industry Pages

**Effort:** 30 minutes
**Impact:** High
**File:** `src/app/page.tsx` or `src/lib/site-data.ts`

The home page displays industry names but doesn't link them. Add `href` to each industry item pointing to `/industries/[slug]`.

**Result:** 6 industry pages gain their first inbound internal link; no longer orphaned from home.

---

## Quick Win 9: Add Meta Description CTAs

**Effort:** 20 minutes
**Impact:** Low-Medium
**Files:** Page metadata for conversion pages

Add action language to meta descriptions:
- Discovery call: "Book your free 30-minute call today."
- On-site assessment: "Request your on-site assessment."
- Book training: "Enquire about lean training for your team."

**Result:** Improved click-through rate from SERPs.

---

## Quick Win 10: Add Breadcrumb Cross-Link on Industry Pages

**Effort:** 15 minutes
**Impact:** Medium
**File:** Industry page template

Industry pages have breadcrumbs in schema but the parent points to Home only. Add a logical parent breadcrumb pointing to `/operational-excellence-consulting-uk` or `/industries` (when hub exists) to reinforce the page hierarchy.

**Result:** Clearer site hierarchy signal to Google.

---

## Quick Wins Summary

| # | Task | Effort | Impact | Sprint |
|---|------|--------|--------|--------|
| 1 | Fix service card links | 10 min | Critical | Sprint 1 |
| 2 | Link mentoring → book training | 15 min | High | Sprint 1 |
| 3 | Remove SearchAction schema | 10 min | Medium | Sprint 1 |
| 4 | Shorten truncating titles | 10 min | Medium | Sprint 1 |
| 5 | Add blog hub introduction | 30 min | Medium | Sprint 1 |
| 6 | Add author attribution to blog | 30 min | Medium | Sprint 1 |
| 7 | Add internal links to blog posts | 45 min | High | Sprint 1 |
| 8 | Link home industries to pages | 30 min | High | Sprint 1 |
| 9 | Add CTA to meta descriptions | 20 min | Low-Medium | Sprint 1 |
| 10 | Fix industry page breadcrumbs | 15 min | Medium | Sprint 1 |

**Total quick wins effort: ~3.5 hours**
**All deployable in Sprint 1, Day 1.**
