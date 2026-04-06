# Metadata Rollout Plan — tacklersconsulting.com

---

## Rollout Phases

### Phase A — Critical Fixes (Sprint 1, Week 1)

**Fix truncating titles + remove broken schema**

| Page | Action | Current | New |
|------|--------|---------|-----|
| Services | Shorten title | "Operational Excellence Consulting UK — Tacklers Consulting Group" (65) | "Operational Excellence Consulting UK — Tacklers" (50) |
| About | Shorten title | "About Tacklers Consulting Group — Our People-First Lean Philosophy" (67) | "UK Lean Consultants — About Tacklers Consulting Group" (54) |
| All pages | Remove SearchAction | `potentialAction: SearchAction` in WebSite schema | Remove entirely |
| Blog posts | Add author to schema | BlogPosting missing author | Add author.name, author.url, dateModified |

**Implementation:**
1. Update `createPageMetadata` calls in services and about page files
2. Remove SearchAction from `buildWebSiteSchema()` in `structured-data.ts`
3. Add `author` and `dateModified` params to `buildBlogPostingSchema()` in `structured-data.ts`

---

### Phase B — Title Tag Optimisation (Sprint 1–2, Week 2)

**Align all title tags to the formula: `[Primary Keyword] — Tacklers`**

| Page | Current title | Proposed title |
|------|--------------|---------------|
| Home | Tacklers Consulting Group — Reduce Waste, Protect Talent | Operational Excellence Consulting UK — Tacklers |
| Careers | Careers at Tacklers Consulting Group | Lean Consulting Careers UK — Tacklers |
| Discovery call | Discovery Call — Free Lean Consultation — Tacklers | Book a Discovery Call — Free Lean Consultation |
| On-site assessment | On-Site Lean Assessment — Tacklers Consulting Group | On-Site Lean Assessment UK — Tacklers |

Service detail page and industry page titles are already acceptable. No changes needed.

**Implementation:**
Update metadata in each page's `generateMetadata()` or static metadata export.

---

### Phase C — Meta Description Optimisation (Sprint 2, Week 3–4)

**Add CTAs and keywords to all descriptions**

Deploy updated meta descriptions as specified in the metadata blueprint:
1. Home — add CTA: "Book a free discovery call."
2. Services — add CTA: "Explore our services."
3. Mentoring — add CTA: "Explore programmes."
4. Conversion pages — add specific action CTAs
5. Service detail pages — unique per-service descriptions
6. Industry pages — unique per-industry descriptions

**Implementation:**
Update `description` in each page's metadata. Batch all changes in a single deployment.

---

### Phase D — Open Graph Enhancement (Sprint 5–6)

**Create page-specific social images and add og:image:alt**

Priority pages for custom og:image (1200×630px):
1. Home
2. Services pillar
3. Mentoring
4. About
5. Blog hub
6. Lean Transformation pillar (new)
7. Continuous Improvement pillar (new)
8. Gemba Consulting pillar (new)
9. Case Studies hub (new)

Add `og:image:alt` to all pages via `openGraph.images[].alt` in metadata.

---

### Phase E — New Page Metadata (Sprints 2–4, as pages are created)

Each new page requires metadata before launch:

| New page | Title | Description |
|----------|-------|-------------|
| `/lean-transformation-consulting-uk` | Lean Transformation Consulting UK — Tacklers | People-first lean transformation consulting for UK organisations. Reduce waste and build sustainable capability. Book a call. |
| `/continuous-improvement-consulting-uk` | Continuous Improvement Consulting UK — Tacklers | Continuous improvement consulting for UK operations. Build CI frameworks that deliver sustained results. Book a call. |
| `/gemba-consulting` | Gemba Consulting — People-First Lean — Tacklers | Gemba-based lean consulting. We go where the work happens to understand your challenges before proposing solutions. |
| `/industries` | Industries We Serve — Tacklers Consulting Group | Operational excellence consulting across aerospace, healthcare, energy, public sector, IT, and manufacturing. Explore sectors. |
| `/case-studies` | Lean Consulting Case Studies & Results — Tacklers | Real results from lean transformation and operational excellence projects across UK industries. Read our case studies. |

---

## Verification Checklist

After each phase, verify:
- [ ] All titles ≤ 60 characters
- [ ] All descriptions ≤ 155 characters
- [ ] No duplicate titles across pages
- [ ] No duplicate descriptions across pages
- [ ] Primary keyword in title for each page
- [ ] og:title matches page title
- [ ] og:description matches meta description
- [ ] Canonical URLs correct
- [ ] Structured data valid (test with Google Rich Results Test)
- [ ] New pages appear in sitemap
