# Internal Linking Gap Analysis — tacklersconsulting.com

---

## Current Internal Link Structure

### Navigation-based links (present on every page)
Header nav provides links to:
- `/` (logo)
- `/about`
- `/operational-excellence-consulting-uk`
- `/lean-training-uk`
- `/blog`
- `/contact`
- `/careers`
- `/discovery-call` (CTA button)

Footer provides links to:
- All header nav items
- `/terms-and-conditions`
- `/privacy-policy`
- `/cookie-policy`
- Social media links (external)

### In-content internal links

| Source page | Target pages | Count | Assessment |
|-------------|-------------|-------|------------|
| Home | Nav only + hero CTA to `/discovery-call` | 1 content link | **Poor** — massive opportunity |
| Services pillar | **0 links to service detail pages** | 0 | **Critical failure** |
| Mentoring | No link to `/book-lean-training` | 0 | **Major gap** |
| About | No links to services or case studies | 0 | Poor |
| Blog hub | Links to each blog post | 4 | Acceptable |
| Blog posts (×4) | **0 cross-links** in any post | 0 | **Critical** |
| Service pages (×7) | Back to services via breadcrumb only | 1 each | **Poor** |
| Industry pages (×6) | **0 inbound, 0 outbound** | 0 | **Orphan pages** |
| Discovery call | 0 | 0 | Acceptable for conversion page |
| On-site assessment | 0 | 0 | Acceptable for conversion page |
| Book lean training | 0 | 0 | Acceptable for conversion page |
| Contact | 0 | 0 | Acceptable for contact page |

---

## Critical Gaps

### 1. Services Page → Service Detail Pages (SEVERITY: CRITICAL)

The services pillar page at `/operational-excellence-consulting-uk` renders 11 service cards. However, the code explicitly removes the `href` and `cta` properties from 5 of the cards displayed as a grid, and none of the 11 cards on the page link to their corresponding `/services/[slug]` detail pages.

**Impact:** The 7 service detail pages have zero internal links from their logical parent. Google may not discover or prioritise these pages.

**Fix:** Restore `href` on all service cards. Each card should link to its `/services/[slug]` page.

### 2. Industry Pages — Complete Orphans (SEVERITY: CRITICAL)

The 6 industry pages under `/industries/[slug]` have:
- No links from any other page
- No industry hub page
- No mention in the navigation
- No links from the home page's industry section

**Impact:** These pages are effectively invisible to both users and crawlers unless accessed via sitemap.

**Fix:**
1. Create an industries hub page OR add industries to the services pillar page
2. Link from home page industry section to each industry page
3. Link from relevant service pages to relevant industries

### 3. Blog Post Cross-Linking (SEVERITY: HIGH)

All 4 blog posts contain zero internal links within their body content. No links to:
- Relevant service pages
- Relevant industry pages
- Other related blog posts
- Conversion pages (discovery call, assessment)

**Impact:** Missed PageRank distribution, no topical clustering, poor user journey.

**Fix:** Add 3–5 contextual internal links per blog post.

### 4. Mentoring → Book Training (SEVERITY: HIGH)

The mentoring page at `/lean-training-uk` describes lean training programmes but has no link to the booking form at `/book-lean-training`. The "Download brochure" CTA links to `/contact` (no brochure exists).

**Impact:** Broken conversion funnel — users interested in training cannot find the booking page from the training page.

**Fix:** 
1. Add prominent CTA linking to `/book-lean-training`
2. Replace "Download brochure" with honest CTA or create a real brochure

---

## Missing Link Paths (Recommended New Links)

### From Home Page
| Link from | Link to | Anchor text suggestion |
|-----------|---------|----------------------|
| Service cards section | `/operational-excellence-consulting-uk` | "Explore our consulting services" |
| Industry section | Each `/industries/[slug]` page | Industry name |
| Stats section | `/case-studies` (when created) | "See our results" |
| Hero CTA | `/discovery-call` | ✅ Already exists |

### From Services Pillar
| Link from | Link to | Anchor text suggestion |
|-----------|---------|----------------------|
| Each service card | `/services/[slug]` | "Learn more about [service]" |
| Intro text | `/lean-training-uk` | "lean training and mentoring" |
| Outro text | `/discovery-call` | "Book a free discovery call" |

### From Service Detail Pages
| Link from | Link to | Anchor text suggestion |
|-----------|---------|----------------------|
| Related services section (add) | 2–3 related `/services/[slug]` pages | Service name |
| Industry reference | Relevant `/industries/[slug]` | Industry name |
| CTA section | `/discovery-call` | "Discuss your [service] needs" |

### From Industry Pages
| Link from | Link to | Anchor text suggestion |
|-----------|---------|----------------------|
| Services referenced | Relevant `/services/[slug]` | Service name |
| CTA section | `/discovery-call` | "Discuss [industry] challenges" |
| Related blog content | Relevant blog posts | Descriptive anchor |

### From Blog Posts
| Link from | Link to | Anchor text suggestion |
|-----------|---------|----------------------|
| When mentioning a service | Relevant `/services/[slug]` | Service name |
| When mentioning an industry | Relevant `/industries/[slug]` | Industry context |
| When mentioning methodology | Other relevant blog posts | Topic-specific anchor |
| CTA at end of post | `/discovery-call` | "Discuss this with our team" |
| Related posts section (add) | 2–3 related posts | Post title |

### From Mentoring Page
| Link from | Link to | Anchor text suggestion |
|-----------|---------|----------------------|
| Programme descriptions | `/book-lean-training` | "Book this programme" |
| Intro | `/operational-excellence-consulting-uk` | "our consulting services" |
| CTA section | `/discovery-call` | "Discuss your training needs" |

---

## Ideal Link Architecture (Target State)

```
Home
├── Services Pillar (/operational-excellence-consulting-uk)
│   ├── BPM Consulting (/services/business-process-management-consulting-uk)
│   ├── Cost Management (/services/cost-management-consulting-uk)
│   ├── Executive Coaching (/services/executive-leadership-coaching-operations)
│   ├── Productivity (/services/productivity-improvement-consulting-uk)
│   ├── SQD (/services/supplier-quality-development-consulting)
│   ├── Strategy Deployment (/services/strategy-deployment-consulting-uk)
│   └── Project Management (/services/project-management-for-transformation)
│
├── Industries (hub or section on services page)
│   ├── Aerospace & Defence
│   ├── Healthcare & Life Sciences
│   ├── Energy Sector
│   ├── Public Sector
│   ├── IT Services
│   └── Manufacturing
│
├── Mentoring (/lean-training-uk)
│   └── Book Training (/book-lean-training)
│
├── Blog (/blog)
│   ├── Post 1 ↔ Post 2 (cross-link)
│   ├── Post 2 ↔ Post 3 (cross-link)
│   └── Each post → relevant service & industry pages
│
├── About → Case Studies (proposed)
│
├── Discovery Call (linked from every service + industry page)
├── On-Site Assessment (linked from services pillar + mentoring)
└── Contact (linked from footer + contextual)
```

---

## Priority Action Plan

| Priority | Action | Pages affected | Effort |
|----------|--------|---------------|--------|
| **P0** | Fix service card href stripping | Services pillar | 10 min code change |
| **P0** | Link industry pages from home + services | Home, services | 30 min |
| **P1** | Add internal links to all blog posts | 4 blog posts | 1 hour |
| **P1** | Link mentoring → book training | Mentoring | 15 min |
| **P1** | Add cross-links between service detail pages | 7 pages | 2 hours |
| **P2** | Add cross-links between industry and service pages | 13 pages | 2 hours |
| **P2** | Add related posts section to blog | Blog post template | 1 hour |
| **P3** | Create industries hub page or section | New page | 4 hours |
