# Metadata Gap Analysis — tacklersconsulting.com

---

## Title Tag Audit

### Length Analysis
| Page | Title | Length | Status |
|------|-------|--------|--------|
| Home | Tacklers Consulting Group — Reduce Waste, Protect Talent | 58 | OK |
| Services | Operational Excellence Consulting UK — Tacklers Consulting Group | 65 | **Over 60 — truncation risk** |
| Mentoring | Lean Training UK — Capability Building Programmes — Tacklers | 61 | Marginal |
| About | About Tacklers Consulting Group — Our People-First Lean Philosophy | 67 | **Over 60 — truncation risk** |
| Blog hub | Lean Consulting Blog — Insights From the Gemba | 48 | OK |
| Contact | Contact Tacklers Consulting Group — Get in Touch | 50 | OK |
| Careers | Careers at Tacklers Consulting Group | 36 | OK but generic |
| Discovery call | Discovery Call — Free Lean Consultation — Tacklers | 52 | OK |
| On-site assessment | On-Site Lean Assessment — Tacklers Consulting Group | 52 | OK |
| Book lean training | Book Lean Training — Tacklers Consulting Group | 48 | OK |
| Support | Support — Tacklers Consulting Group | 35 | OK but generic |
| Terms | Terms and Conditions — Tacklers Consulting Group | 49 | OK |
| Privacy | Privacy Policy — Tacklers Consulting Group | 43 | OK |
| Cookie policy | Cookie Policy — Tacklers Consulting Group | 42 | OK |

### Title Keyword Placement
| Page | Primary keyword in first 4 words? | Action |
|------|-----------------------------------|--------|
| Home | "Tacklers Consulting Group" — brand only | Consider: "Operational Excellence Consulting UK — Tacklers" |
| Services | Yes — "Operational Excellence Consulting UK" | Good |
| Mentoring | Yes — "Lean Training UK" | Good |
| About | No — "About Tacklers Consulting Group" | Consider: "UK Lean Consultants — About Tacklers" |
| Blog hub | Yes — "Lean Consulting Blog" | Good |
| Contact | No — "Contact Tacklers Consulting Group" | Low priority — contact page |
| Careers | No — "Careers at Tacklers" | Low priority |

### Service detail page titles
| Page | Title | Status |
|------|-------|--------|
| BPM | Business Process Management Consulting UK — Tacklers | OK (52 chars) |
| Cost Management | Cost Management Consulting UK — Tacklers | OK (42 chars) |
| Executive Leadership | Executive Leadership Coaching for Operations — Tacklers | OK (56 chars) |
| Productivity | Productivity Improvement Consulting UK — Tacklers | OK (50 chars) |
| SQD | Supplier Quality Development Consulting — Tacklers | OK (52 chars) |
| Strategy Deployment | Strategy Deployment Consulting UK — Tacklers | OK (46 chars) |
| Project Management | Project Management for Transformation — Tacklers | OK (50 chars) |

### Industry page titles
| Page | Title | Status |
|------|-------|--------|
| Aerospace | Aerospace & Defence Operational Excellence — Tacklers | OK (54 chars) |
| Healthcare | Healthcare & Life Sciences Process Improvement — Tacklers | OK (58 chars) |
| Energy | Energy Sector Operational Improvement — Tacklers | OK (50 chars) |
| Public Sector | Public Sector Lean Transformation — Tacklers | OK (46 chars) |
| IT Services | IT Services Lean Operations — Tacklers | OK (40 chars) |
| Manufacturing | Manufacturing Operational Excellence — Tacklers | OK (49 chars) |

---

## Meta Description Audit

### Length Analysis
Descriptions over 160 characters risk truncation in SERPs:

| Page | Description | Length | Status |
|------|-------------|--------|--------|
| Home | "Tacklers Consulting Group delivers people-first operational excellence consulting across the UK. Reduce waste while protecting and redeploying your talent." | 155 | OK |
| Services | (Generated from siteConfig) | ~155 | OK |
| Mentoring | (Generated from siteConfig) | ~150 | OK |
| About | (Generated from siteConfig) | ~160 | Marginal |

### Call-to-Action in Descriptions
| Page | CTA present? | Recommendation |
|------|-------------|----------------|
| Home | No | Add: "Book a free discovery call." |
| Services | No | Add: "Explore our consulting services." |
| Mentoring | No | Add: "Explore lean training programmes." |
| About | No | Low priority |
| Discovery call | No | Add: "Book your free 30-minute call today." |
| On-site assessment | No | Add: "Request your on-site assessment." |

---

## Open Graph & Social Metadata

### Current state
- `og:type`: "website" on all pages
- `og:title`: Mirrors page title
- `og:description`: Mirrors meta description
- `og:image`: Generic brand image (same across all pages)
- `og:url`: Canonical URL — correct
- `twitter:card`: "summary_large_image" — correct

### Gaps
| Gap | Impact | Action |
|-----|--------|--------|
| Same og:image across all pages | Medium — missed CTR on social shares | Create page-specific social images for top 5 pages |
| No og:image:alt | Low | Add alt text to og:image meta |
| No twitter:creator | Low | Add company Twitter handle |

---

## Structured Data (Schema) Audit

### Present schemas
| Schema type | Pages | Status |
|-------------|-------|--------|
| Organization | All (via layout) | Good |
| LocalBusiness / ProfessionalService | All (via layout) | Good |
| WebSite + SearchAction | All (via layout) | ⚠️ SearchAction declared but no search exists |
| WebPage | All pages | Good |
| BreadcrumbList | All pages | Good |
| FAQPage | Home, services, mentoring, about, contact, support | Good |
| Service | Services page (per card) | Good |
| BlogPosting | Blog post pages | Missing: author, dateModified |
| CollectionPage | Blog hub | Good |

### Schema gaps
| Gap | Severity | Action |
|-----|----------|--------|
| SearchAction references non-existent search | Medium | Remove SearchAction or implement search |
| BlogPosting missing author.name / author.url | Medium | Add author schema with link to about page |
| BlogPosting missing dateModified | Low | Add last modified date |
| No HowTo schema on methodology pages | Low | Consider for instructional content |
| No Review / AggregateRating schema | Low | Could add if collecting reviews |

---

## Canonical URL Audit

All pages use correct absolute canonical URLs via `metadataBase` in root layout:
- `https://www.tacklersconsulting.com/[path]`
- No duplicate canonical issues found
- All redirects are 301 permanent — correct

---

## Robots & Indexation

### robots.txt
Correctly disallows: `/admin`, `/api`, `/auth`, `/client-hub`, `/newsletter/subscription`, `/reset-password`, `/sign-in`, `/sign-up`

### Page-level robots
- All public pages: `index, follow` — correct
- Admin/auth pages: `noindex` — correct

### No issues found in robots configuration.

---

## Recommendations Summary

### Immediate fixes
1. Shorten titles for Services (65→60) and About (67→60)
2. Remove or implement WebSite SearchAction schema
3. Add author + dateModified to BlogPosting schema
4. Add CTA text to meta descriptions on conversion pages

### Medium-term improvements
1. Create page-specific og:image for top 5 pages
2. Add "UK" to home page title
3. Add og:image:alt to all pages
4. Frontload primary keywords in About and Careers titles
