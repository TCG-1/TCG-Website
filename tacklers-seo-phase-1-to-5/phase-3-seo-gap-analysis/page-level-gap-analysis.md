# Page-Level SEO Gap Analysis — tacklersconsulting.com

---

## Core Pages

### Home `/`
| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Title | "Tacklers Consulting Group — Reduce Waste, Protect Talent" (58 chars) | Acceptable length; consider adding "UK" or "Operational Excellence" | Medium |
| H1 | Dynamic slideshow (3 rotating H1s) | Multiple H1s — ensure only one is in the DOM at a time or use CSS-only rotation | Medium |
| Content depth | ~600 words narrative + stats | Adequate for homepage | Low |
| Internal links | Navigation only, no in-content links to service or industry pages | **Add links from service cards and industry section** | High |
| Keyword targeting | "operational excellence", "lean transformation" mentioned | Good — but no explicit link between keywords and target pages | Medium |
| Structured data | Organization, LocalBusiness, WebSite, WebPage, FAQ | Comprehensive | Low |

### Services `/operational-excellence-consulting-uk`
| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Title | "Operational Excellence Consulting UK — Tacklers Consulting Group" (65 chars) | Slightly over 60 — truncation risk | Medium |
| H1 | "Operational Excellence Consulting UK" | Good | Low |
| Content depth | ~600 words + 11 service cards | Service cards stripped of links — **no way to navigate to detail pages** | **Critical** |
| Internal links | 0 links to service detail pages | **Fix card href stripping immediately** | **Critical** |
| Keyword coverage | "operational excellence consulting uk" | Missing: "lean consulting uk", "continuous improvement" | High |
| Service schema | Present for each service card | Good | Low |

### Mentoring `/lean-training-uk`
| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Title | "Lean Training UK — Capability Building Programmes — Tacklers" (61 chars) | Marginally long | Low |
| H1 | "Lean Training UK" | Direct keyword match — good | Low |
| Content depth | ~500 words + 3 programme cards | Thin — needs programme details, outcomes, pricing signals | High |
| Internal links | No link to `/book-lean-training` | **Missing conversion path** | High |
| "Download brochure" CTA | Links to `/contact` — no brochure exists | Misleading — replace with honest CTA | Medium |
| Keyword coverage | "lean training uk" | Missing: "lean training courses uk", "continuous improvement training" | Medium |

### About `/about`
| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Title | "About Tacklers Consulting Group — Our People-First Lean Philosophy" (67 chars) | Over 60 — will truncate | Medium |
| H1 | "About Tacklers Consulting Group" | No keyword in H1 | Medium |
| Content depth | ~700 words + team bios | Adequate but no external credentials | Medium |
| Team bios | 2 founders listed | Missing credentials, LinkedIn links, professional associations | High |
| E-E-A-T signals | No certifications, awards, or affiliations mentioned | **Add any relevant credentials** | High |

### Blog Hub `/blog`
| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Title | "Lean Consulting Blog — Insights From the Gemba" (48 chars) | Acceptable | Low |
| Content | Post listing only, no intro text | **Add 100–200 word hub intro for SEO** | Medium |
| Category/tag system | None | **Add categories for content clusters** | Medium |
| Internal links | Links to each post | Good | Low |
| Pagination | None (only 4 posts) | Will need if >10 posts | Low |

### Contact `/contact`
| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Title | "Contact Tacklers Consulting Group — Get in Touch" (50 chars) | Acceptable but generic | Low |
| Content | Form + address + trust signals | Adequate for contact page | Low |
| Schema | ContactPage schema | Missing LocalBusiness address in main schema | Medium |

---

## Conversion Pages

### Discovery Call `/discovery-call`
| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Title | "Discovery Call — Free Lean Consultation" | Good — keyword-aligned | Low |
| Content | ~200 words + form | Thin — add what happens in the call, testimonial | Medium |
| Keyword | "free lean consultation uk" | Add to description | Medium |

### On-Site Assessment `/on-site-assessment`
| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Title | "On-Site Lean Assessment" | Good | Low |
| Content | ~200 words + form | Thin — add assessment process detail, deliverable expectations | Medium |
| Keyword | "on-site lean assessment uk", "lean readiness assessment" | Not in title or description | Medium |

### Book Lean Training `/book-lean-training`
| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Content | ~150 words + form | Very thin — add programme overview | Medium |
| Internal links from mentoring | **None** | Mentoring page should link here directly | High |

---

## Service Detail Pages (×7)

All 7 pages share the same structural gaps:

| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Content depth | ~120–160 words each | **Critically thin — 800–1,000 words minimum** | **Critical** |
| Internal links inbound | 0 from parent pillar page | **Orphaned — fix services page card links** | **Critical** |
| Internal links outbound | Back to services only | Add links to related services, industry pages, blog posts | High |
| CTAs | Single "Book a Discovery Call" | Add secondary CTA, testimonial link | Medium |
| Schema | Service + Breadcrumb | Good | Low |
| FAQ section | None | Add page-specific FAQ (2–3 questions) | Medium |

---

## Industry Pages (×6)

All 6 pages share the same structural gaps:

| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Content depth | ~120–160 words each | **Critically thin — 800 words minimum** | **Critical** |
| Hub page | No industry hub exists | **Need industry overview page or link from nav** | High |
| Internal links inbound | 0 from any page | **Orphaned — completely disconnected** | **Critical** |
| Internal links outbound | None | Link to relevant services, case studies | High |
| Industry-specific data | None (no stats, figures, or sector context) | Add sector statistics, regulatory context | High |
| Schema | WebPage + Breadcrumb | Missing IndustryPage or specialized markup | Low |

---

## Blog Posts (×4)

All 4 posts share these gaps:

| Element | Current state | Gap | Priority |
|---------|--------------|-----|----------|
| Word count | 330–420 words each | Below 600-word minimum for ranking; below 1,200 best practice | **Critical** |
| Author attribution | None | **Add author name + link to bio** | High |
| Internal links | 0 cross-links | **Add 3–5 internal links per post** | High |
| Updated date | None | Add published + last updated dates | Medium |
| Featured image | None visible | Add with descriptive alt text | Medium |
| Schema | BlogPosting present | Missing author details in schema | Medium |
| Cannibalisation | 3 Dec 2024 posts overlap on "lean productivity" topic | **Consolidate or differentiate** | High |
