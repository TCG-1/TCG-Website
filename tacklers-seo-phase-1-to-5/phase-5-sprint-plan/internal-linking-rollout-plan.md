# Internal Linking Rollout Plan — tacklersconsulting.com

---

## Rollout Phases

### Phase 1 — Emergency Fixes (Sprint 1, Day 1)

**Objective:** Fix the two critical link topology failures.

#### Fix 1: Restore service card links
- **File:** `src/app/operational-excellence-consulting-uk/page.tsx`
- **Code change:** Remove `href: undefined` from the service card map function
- **Result:** 7 service detail pages gain primary inbound link from services pillar
- **Effort:** 10 minutes

#### Fix 2: Link mentoring → book training
- **File:** `src/app/lean-training-uk/page.tsx`
- **Action:** Add prominent CTA button linking to `/book-lean-training`
- **Replace:** "Download brochure" CTA (links to `/contact` with no brochure)
- **Result:** Training conversion funnel completed
- **Effort:** 15 minutes

#### Fix 3: Link home industry section → industry pages
- **File:** `src/app/page.tsx` or `src/lib/site-data.ts`
- **Action:** Add `href` to industry items pointing to `/industries/[slug]`
- **Result:** 6 industry pages gain first inbound link
- **Effort:** 30 minutes

---

### Phase 2 — Blog Cross-Linking (Sprint 1, Week 2)

**Objective:** Add internal links to all 4 existing blog posts.

#### Per-post link additions:
| Blog post | Links to add |
|-----------|-------------|
| 2025 Digital Breakthrough | → `/operational-excellence-consulting-uk`, → `/services/business-process-management-consulting-uk`, → `/discovery-call` |
| Enhance Operational Excellence | → `/operational-excellence-consulting-uk`, → `/lean-training-uk`, → `/blog/drive-efficiency-lean-methodologies`, → `/discovery-call` |
| Drive Efficiency with Lean | → `/lean-training-uk`, → `/services/productivity-improvement-consulting-uk`, → `/blog/maximise-productivity`, → `/discovery-call` |
| Maximise Productivity | → `/operational-excellence-consulting-uk`, → `/services/productivity-improvement-consulting-uk`, → `/blog/enhance-operational-excellence`, → `/discovery-call` |

**Implementation:** Add links within blog post content in Supabase. If posts are static fallbacks in `site-data.ts`, add links in the body text.

---

### Phase 3 — Service Page Cross-Links (Sprint 3)

**Objective:** Connect service detail pages to each other and to industry pages.

#### Cross-link map:

| Service page | Links to services | Links to industries |
|-------------|-------------------|-------------------|
| BPM Consulting | Productivity, Cost Management | Manufacturing, Healthcare, Public Sector |
| Cost Management | BPM, Productivity | Manufacturing, Aerospace, Energy |
| Executive Coaching | Strategy Deployment, Productivity | (All — cross-sector) |
| Productivity | BPM, Cost Management | Manufacturing, IT Services |
| SQD | BPM, Cost Management | Aerospace, Manufacturing, Healthcare |
| Strategy Deployment | Executive Coaching, Project Management | (All — cross-sector) |
| Project Management | Strategy Deployment, BPM | (All — cross-sector) |

#### Additional links per service page:
- Each → `/gemba-consulting` (methodology reference)
- Each → `/discovery-call` (CTA)
- Each → `/on-site-assessment` (secondary CTA)
- Each → `/case-studies/[relevant]` (when available)

**Implementation:** Add a "Related Services" section and "Industries" section to the service page template. Link data can be defined in `landing-pages.ts` as arrays of related slugs.

---

### Phase 4 — Industry Page Cross-Links (Sprint 4)

**Objective:** Connect industry pages to relevant services, blog posts, and case studies.

#### Cross-link map:

| Industry page | Links to services | Links to blog (when published) |
|-------------|-------------------|-----------------------------|
| Aerospace & Defence | SQD, BPM, Cost Management | "Lean in Aerospace" |
| Healthcare & Life Sciences | BPM, Productivity, Executive Coaching | "Healthcare Process Improvement" |
| Energy Sector | Cost Management, Productivity, Strategy Deployment | "Energy Sector Operational Improvement" |
| Public Sector | BPM, Strategy Deployment, Executive Coaching | "Lean in the Public Sector" |
| IT Services | BPM, Productivity, Strategy Deployment | "Lean for IT Services" |
| Manufacturing | BPM, Productivity, Cost Management, SQD | "Lean Manufacturing UK" |

#### Additional links per industry page:
- Each → `/gemba-consulting` (methodology reference)
- Each → `/discovery-call` (CTA)
- Each → `/case-studies/[relevant]` (when available)
- Each ← `/industries` hub (inbound from hub)

---

### Phase 5 — New Content Linking (Sprints 2–6, ongoing)

**Objective:** Every new page and blog post follows linking rules from day one.

#### Rules for new blog posts:
Every new blog post must include:
1. 1 link to a relevant service page (contextual anchor)
2. 1 link to a relevant industry page (if sector-specific)
3. 1 link to a conversion page (`/discovery-call` or `/on-site-assessment`)
4. 1–2 links to related blog posts (cross-post linking)

#### Rules for new pillar pages:
- Link to all child pages in the cluster
- Link to 2–3 key blog posts
- Link to relevant case studies
- Link to at least one conversion page

#### Rules for case studies:
- Link to the relevant service page
- Link to the relevant industry page
- Link to `/discovery-call` (CTA)

---

## Link Audit Verification

After each phase, verify:
- [ ] No orphan pages (every page has ≥1 non-navigation inbound link)
- [ ] No broken links (404s)
- [ ] All links use descriptive anchor text (not "click here")
- [ ] All links are relative to domain (no external links to own site)
- [ ] Conversion pages have ≥3 inbound links from commercial content

### Target link metrics (end of Sprint 6)

| Page type | Min. inbound (non-nav) | Min. outbound (content) |
|-----------|----------------------|------------------------|
| Home | — | 10+ |
| Pillar pages | 5+ | 8+ |
| Service detail | 3+ | 4+ |
| Industry pages | 3+ | 4+ |
| Blog posts | 2+ | 4+ |
| Case studies | 2+ | 3+ |
| Conversion pages | 3+ | 0–1 |
