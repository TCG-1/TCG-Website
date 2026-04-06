# SEO Sprint Plan — tacklersconsulting.com

---

## Overview

This sprint plan organises all SEO work into 6 two-week sprints (12 weeks / 3 months) for technical and structural improvements, plus an ongoing 6-month content calendar running in parallel.

**Sprint methodology:** Each sprint has clear deliverables. Technical work (code changes) and content work (writing) can run in parallel with separate owners.

---

## Sprint 1 — Critical Fixes & Foundation (Weeks 1–2)

### Objective
Fix the highest-impact technical SEO bugs and establish the foundation for content clusters.

### Technical tasks
| Task | File(s) | Effort | Impact |
|------|---------|--------|--------|
| **Fix service card href stripping** | `src/app/operational-excellence-consulting-uk/page.tsx` | 30 min | Critical — unblocks 7 service detail pages |
| Remove WebSite SearchAction schema | `src/lib/structured-data.ts` | 15 min | Medium — removes misleading schema |
| Shorten Services title to ≤60 chars | Page metadata | 10 min | Medium |
| Shorten About title to ≤60 chars | Page metadata | 10 min | Medium |
| Add author + dateModified to BlogPosting schema | `src/lib/structured-data.ts` | 30 min | Medium — E-E-A-T |
| Link mentoring page → `/book-lean-training` | `src/app/lean-training-uk/page.tsx` | 15 min | High — conversion path |
| Replace "Download brochure" CTA with real CTA | `src/app/lean-training-uk/page.tsx` | 15 min | Medium |

### Content tasks
| Task | Effort | Impact |
|------|--------|--------|
| Write 150-word blog hub introduction | 1 hour | Medium |
| Consolidate/rewrite 3 cannibalised Dec 2024 blog posts | 6 hours | High |
| Rewrite Jan 2025 blog post (digital breakthrough) | 3 hours | Medium |

### Deliverables
- [ ] Service card links live and working
- [ ] SearchAction removed from schema
- [ ] Titles within 60-char limit
- [ ] BlogPosting schema includes author
- [ ] Mentoring → book training link live
- [ ] Blog hub intro published
- [ ] 4 blog posts rewritten/consolidated

---

## Sprint 2 — New Pillar Pages & Industry Linking (Weeks 3–4)

### Objective
Create new high-priority pillar pages and connect industry pages to the site's link graph.

### Technical tasks
| Task | File(s) | Effort | Impact |
|------|---------|--------|--------|
| Create `/lean-transformation-consulting-uk` route + page | New route | 4 hours | High — commercial keyword |
| Create `/continuous-improvement-consulting-uk` route + page | New route | 4 hours | High — commercial keyword |
| Create `/gemba-consulting` route + page | New route | 4 hours | High — brand differentiator |
| Create `/industries` hub page | New route | 3 hours | High — links all industry pages |
| Link home page industry section to industry pages | `src/app/page.tsx` or `src/lib/site-data.ts` | 1 hour | Critical — de-orphan industries |
| Add industries section to services pillar page | Services page | 1 hour | High |
| Add new pages to sitemap | `src/lib/site-seo.ts` | 30 min | Required |
| Add new pages to navigation (footer or sub-nav) | `src/lib/site-data.ts` | 1 hour | High |

### Content tasks
| Task | Effort | Impact |
|------|--------|--------|
| Write content for 3 new pillar pages (1,200–1,500 words each) | 12 hours | High |
| Write content for industries hub page (600 words) | 2 hours | Medium |
| Publish blog post #1: "What Is Operational Excellence?" (2,500 words) | 8 hours | High |
| Publish blog post #2: "What Is Gemba?" (2,000 words) | 6 hours | High |

### Deliverables
- [ ] 3 new pillar pages live with full content
- [ ] Industries hub page live
- [ ] All 6 industry pages linked from hub + home
- [ ] 2 pillar blog posts published
- [ ] Sitemap updated
- [ ] Navigation updated

---

## Sprint 3 — Service Page Expansion (Weeks 5–6)

### Objective
Expand all 7 service detail pages from ~140 to 1,000 words with proper cross-linking.

### Technical tasks
| Task | File(s) | Effort | Impact |
|------|---------|--------|--------|
| Expand service page data model to support full content | `src/lib/landing-pages.ts` | 2 hours | Required |
| Add FAQ schema to each service page | `src/lib/structured-data.ts` + service template | 1 hour | Medium |
| Add related services cross-links to template | Service page template | 1 hour | High |
| Add industry cross-links to template | Service page template | 1 hour | High |

### Content tasks
| Task | Effort | Impact |
|------|--------|--------|
| Write expanded content for 7 service pages (1,000 words each) | 28 hours | Critical |
| Write 3 FAQ questions per service page | 7 hours | Medium |
| Publish blog post #3: "Cost Reduction Without Redundancies" (1,500 words) | 4 hours | High |
| Publish blog post #4: "Value Stream Mapping Guide" (2,500 words) | 8 hours | High |
| Publish blog post #5: "Why Lean Transformation Fails" (1,500 words) | 4 hours | High |

### Deliverables
- [ ] 7 service detail pages expanded to 1,000+ words
- [ ] FAQ schema on each service page
- [ ] Cross-links between service pages live
- [ ] 3 new blog posts published

---

## Sprint 4 — Industry Page Expansion & Case Studies (Weeks 7–8)

### Objective
Expand industry pages and launch the case studies section.

### Technical tasks
| Task | File(s) | Effort | Impact |
|------|---------|--------|--------|
| Expand industry page data model for full content | `src/lib/landing-pages.ts` | 2 hours | Required |
| Create `/case-studies` hub route | New route | 3 hours | High |
| Create `/case-studies/[slug]` dynamic route | New route | 3 hours | High |
| Add case study pages to sitemap | `src/lib/site-seo.ts` | 30 min | Required |
| Add FAQ schema to each industry page | Structured data | 1 hour | Medium |

### Content tasks
| Task | Effort | Impact |
|------|--------|--------|
| Write expanded content for 6 industry pages (800 words each) | 18 hours | High |
| Write 5 case studies (800 words each) | 20 hours | Critical |
| Publish blog post #6: "Lean in Aerospace" (1,200 words) | 3 hours | Medium |
| Publish blog post #7: "CI Framework Guide" (2,000 words) | 6 hours | High |
| Publish blog post #8: "Gemba Walk Checklist" (1,500 words) | 4 hours | High |

### Deliverables
- [ ] 6 industry pages expanded to 800+ words
- [ ] Case studies hub + 5 case study pages live
- [ ] FAQ schema on industry pages
- [ ] 3 new blog posts published

---

## Sprint 5 — E-E-A-T & Author Signals (Weeks 9–10)

### Objective
Strengthen E-E-A-T signals across the site and enhance author visibility.

### Technical tasks
| Task | File(s) | Effort | Impact |
|------|---------|--------|--------|
| Create author bio component for blog posts | New component | 2 hours | High |
| Add author attribution to all blog posts | Blog template | 1 hour | High |
| Add related posts component | New component | 3 hours | Medium |
| Add category/tag system to blog | Blog data model + UI | 4 hours | Medium |
| Create page-specific og:image for top 5 pages | Static assets | 3 hours | Medium |

### Content tasks
| Task | Effort | Impact |
|------|--------|--------|
| Expand team bios on about page with credentials | 2 hours | High |
| Add professional affiliations to about page | 1 hour | Medium |
| Publish blog post #9: "Healthcare Process Improvement" (1,200 words) | 3 hours | Medium |
| Publish blog post #10: "How to Sustain Lean Improvements" (1,500 words) | 4 hours | High |
| Publish blog post #11: "Lean Manufacturing UK" (1,200 words) | 3 hours | Medium |

### Deliverables
- [ ] Author bios on all blog posts
- [ ] Related posts component live
- [ ] Blog category system implemented
- [ ] Team credentials expanded
- [ ] 3 new blog posts published

---

## Sprint 6 — Polish & Optimise (Weeks 11–12)

### Objective
Final optimisation pass — metadata, internal links, and performance.

### Technical tasks
| Task | File(s) | Effort | Impact |
|------|---------|--------|--------|
| Audit and fix all title tags to ≤60 chars | All pages | 1 hour | Medium |
| Add CTA text to all meta descriptions | All pages | 2 hours | Medium |
| Add og:image:alt to all pages | Root layout or page metadata | 1 hour | Low |
| Add hreflang="en-GB" to root layout | `src/app/layout.tsx` | 15 min | Low |
| Full internal link audit — verify all planned links are live | All pages | 2 hours | High |
| Verify all new pages in sitemap | `src/app/sitemap.ts` | 30 min | Required |
| Submit updated sitemap to Google Search Console | External | 15 min | Required |

### Content tasks
| Task | Effort | Impact |
|------|--------|--------|
| Publish blog post #12: "How to Reduce Rework" (1,200 words) | 3 hours | Medium |
| Publish blog post #13: "OpEx Framework" (2,000 words) | 6 hours | High |
| Publish blog post #14: "Lean Leadership Principles" (1,500 words) | 4 hours | Medium |

### Deliverables
- [ ] All metadata optimised
- [ ] Internal link audit passed
- [ ] Sitemap verified and submitted
- [ ] 3 new blog posts published

---

## Sprint Timeline Summary

| Sprint | Weeks | Focus | New pages | Blog posts | Total effort (est.) |
|--------|-------|-------|-----------|------------|-------------------|
| 1 | 1–2 | Critical fixes + blog rewrite | 0 | 4 rewritten | 20 hours |
| 2 | 3–4 | New pillar pages + industry links | 5 | 2 new | 40 hours |
| 3 | 5–6 | Service page expansion | 0 (expanded 7) | 3 new | 50 hours |
| 4 | 7–8 | Industry expansion + case studies | 6 (case studies) + 0 (expanded 6) | 3 new | 55 hours |
| 5 | 9–10 | E-E-A-T + author signals | 0 | 3 new | 25 hours |
| 6 | 11–12 | Polish + optimise | 0 | 3 new | 20 hours |
| **Total** | **12 weeks** | | **11 new + 13 expanded** | **4 rewritten + 14 new** | **~210 hours** |

---

## Post-Sprint Ongoing (Months 4–6)

After the 6-sprint foundation is complete:
- Publish 2–3 blog posts per month
- Add 1 case study per month
- Monitor Search Console for keyword movement
- A/B test meta descriptions for top pages
- Continue internal linking as new content is published
