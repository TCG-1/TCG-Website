# Sitewide SEO Blueprint — tacklersconsulting.com

---

## Vision

Transform tacklersconsulting.com from a 31-page brochure site into a 60–80 page topical authority hub for lean transformation, operational excellence, and continuous improvement consulting in the UK — within 6 months.

---

## Guiding Principles

1. **Content-first:** Every page must earn its place by targeting a real keyword and serving a real user need.
2. **People-first lean:** All content reinforces the brand differentiator — waste reduction without redundancy.
3. **British English throughout:** Consistent use of UK spelling, grammar, and terminology.
4. **E-E-A-T obsession:** Every claim backed by evidence; author signals on all editorial content.
5. **Internal linking as architecture:** Every page connected to its logical parent, siblings, and children.

---

## Site Architecture Blueprint

### Current: 31 pages, flat structure
### Target: 65–80 pages, clustered hierarchy

```
tacklersconsulting.com
│
├── / (Home — hub for all clusters)
│
├── /operational-excellence-consulting-uk (Services pillar)
│   ├── /services/business-process-management-consulting-uk
│   ├── /services/cost-management-consulting-uk
│   ├── /services/executive-leadership-coaching-operations
│   ├── /services/productivity-improvement-consulting-uk
│   ├── /services/supplier-quality-development-consulting
│   ├── /services/strategy-deployment-consulting-uk
│   └── /services/project-management-for-transformation
│
├── /lean-transformation-consulting-uk (NEW — lean transformation pillar)
│
├── /continuous-improvement-consulting-uk (NEW — CI pillar)
│
├── /gemba-consulting (NEW — Gemba methodology pillar)
│
├── /lean-training-uk (Training & mentoring pillar)
│   └── /book-lean-training
│
├── /industries (NEW — industry hub)
│   ├── /industries/aerospace-defence-operational-excellence
│   ├── /industries/healthcare-life-sciences-process-improvement
│   ├── /industries/energy-sector-operational-improvement
│   ├── /industries/public-sector-lean-transformation
│   ├── /industries/it-services-lean-operations
│   └── /industries/manufacturing-operational-excellence
│
├── /case-studies (NEW — results hub)
│   ├── /case-studies/[slug-1]
│   ├── /case-studies/[slug-2]
│   └── ... (5–8 case studies)
│
├── /blog (Content hub)
│   ├── 5 pillar posts
│   ├── 6 industry posts
│   ├── 5 problem-solution posts
│   ├── 5 methodology posts
│   └── 3 leadership posts
│
├── /about
├── /contact
├── /careers
├── /discovery-call
├── /on-site-assessment
├── /support
├── /terms-and-conditions
├── /privacy-policy
└── /cookie-policy
```

---

## New Pages to Create

| Page | Slug | Type | Primary keyword | Target word count | Priority |
|------|------|------|----------------|-------------------|----------|
| Lean Transformation Consulting UK | `/lean-transformation-consulting-uk` | Service pillar | lean transformation consulting uk | 1,500 | Sprint 1 |
| Continuous Improvement Consulting UK | `/continuous-improvement-consulting-uk` | Service pillar | continuous improvement consulting uk | 1,500 | Sprint 1 |
| Gemba Consulting | `/gemba-consulting` | Methodology pillar | gemba consulting | 1,200 | Sprint 1 |
| Industries Hub | `/industries` | Hub page | UK operational excellence industries | 800 | Sprint 2 |
| Case Studies | `/case-studies` | Hub page | lean consulting case studies | 600 + per-study pages | Sprint 2 |
| 5+ Case Study Pages | `/case-studies/[slug]` | Evidence page | [industry]-specific | 600–800 each | Sprint 2–3 |

---

## Existing Pages to Expand

| Page | Current words | Target words | Key additions |
|------|--------------|-------------|---------------|
| `/services/business-process-management-consulting-uk` | 140 | 1,000 | Methodology, outcomes, FAQ, cross-links |
| `/services/cost-management-consulting-uk` | 140 | 1,000 | Methodology, outcomes, FAQ, cross-links |
| `/services/executive-leadership-coaching-operations` | 140 | 1,000 | Programme structure, outcomes, FAQ |
| `/services/productivity-improvement-consulting-uk` | 140 | 1,000 | Methodology, metrics, FAQ, cross-links |
| `/services/supplier-quality-development-consulting` | 140 | 1,000 | Process, outcomes, FAQ |
| `/services/strategy-deployment-consulting-uk` | 140 | 1,000 | Hoshin Kanri detail, outcomes, FAQ |
| `/services/project-management-for-transformation` | 140 | 1,000 | Approach, tools, FAQ |
| `/industries/aerospace-defence-operational-excellence` | 130 | 800 | Sector data, compliance, case study ref |
| `/industries/healthcare-life-sciences-process-improvement` | 130 | 800 | Sector data, regulation, case study ref |
| `/industries/energy-sector-operational-improvement` | 130 | 800 | Sector data, case study ref |
| `/industries/public-sector-lean-transformation` | 130 | 800 | Sector data, case study ref |
| `/industries/it-services-lean-operations` | 130 | 800 | Sector data, case study ref |
| `/industries/manufacturing-operational-excellence` | 130 | 800 | Sector data, case study ref |
| `/lean-training-uk` | 500 | 1,200 | Programme detail, outcomes, link to booking |

---

## Technical SEO Fixes

| Fix | Component | File | Detail |
|-----|-----------|------|--------|
| Restore service card links | ServiceCard render | `page.tsx` (services) | Remove `href: undefined` stripping |
| Remove SearchAction schema | structured-data.ts | WebSite builder | Remove or implement search |
| Add author to BlogPosting schema | structured-data.ts | BlogPosting builder | Add author.name, author.url |
| Add dateModified to blog schema | structured-data.ts | BlogPosting builder | Add dateModified field |
| Shorten truncating titles | site-seo.ts or page metadata | Services, About | Reduce to ≤60 chars |
| Add hreflang | layout.tsx | Root layout | `<link rel="alternate" hreflang="en-GB">` |
| Create industry hub page | New route | `/industries/page.tsx` | Hub page for industry cluster |
| Create case studies pages | New route | `/case-studies/page.tsx`, `/case-studies/[slug]/page.tsx` | Results hub + individual pages |

---

## Content Cluster Strategy

### Cluster 1: Operational Excellence
- **Pillar:** `/operational-excellence-consulting-uk` (existing, expand)
- **Supporting blog:** "What Is Operational Excellence?" + "Operational Excellence Framework"
- **Service pages:** All 7 service detail pages
- **Case studies:** Link relevant

### Cluster 2: Lean Transformation
- **Pillar:** `/lean-transformation-consulting-uk` (new)
- **Supporting blog:** "Why Lean Transformation Fails" + "How to Sustain Lean Improvements"
- **Supporting service pages:** BPM, Productivity, Cost Management
- **Case studies:** Link relevant

### Cluster 3: Gemba & Methodology
- **Pillar:** `/gemba-consulting` (new)
- **Supporting blog:** "What Is Gemba?" + "Gemba Walk Checklist" + "Lean Daily Management"
- **Supporting page:** On-site assessment
- **Case studies:** Link relevant

### Cluster 4: Continuous Improvement
- **Pillar:** `/continuous-improvement-consulting-uk` (new)
- **Supporting blog:** "Continuous Improvement Framework" + "Kaizen Events" + "Standard Work"
- **Supporting service pages:** Productivity, BPM
- **Case studies:** Link relevant

### Cluster 5: Training & Capability
- **Pillar:** `/lean-training-uk` (existing, expand)
- **Supporting blog:** "Lean Leadership Principles" + "How to Build Internal Lean Capability"
- **Supporting pages:** Book Training, Executive Coaching service
- **Case studies:** Link relevant

### Cluster 6: Industry Expertise
- **Hubs:** 6 industry pages (expand)
- **Supporting blog:** 6 industry-specific posts
- **Cross-links:** Service pages ↔ industry pages
- **Case studies:** 1 per industry minimum

---

## Internal Linking Blueprint

### Link rules
1. Every service detail page links to 2–3 sibling services + its parent pillar
2. Every industry page links to 2–3 relevant services + discovery call
3. Every blog post links to 1 service page + 1 industry page + 1 conversion page + 1 related post
4. Every case study links to the relevant service + industry + discovery call
5. Pillar pages link to all children + blog cluster posts
6. Home page links to pillar pages + industry hub + case studies hub

### Minimum internal links per page type
| Page type | Minimum inbound | Minimum outbound |
|-----------|----------------|-----------------|
| Home | — | 10+ |
| Pillar pages | 5+ | 8+ (children + blog) |
| Service detail | 3+ (pillar, siblings, blog) | 4+ (pillar, siblings, industry, CTA) |
| Industry pages | 3+ (hub, services, blog) | 4+ (services, CTA, blog, case study) |
| Blog posts | 2+ (hub, related posts) | 4+ (service, industry, CTA, related) |
| Case studies | 2+ (hub, service page) | 3+ (service, industry, CTA) |
| Conversion pages | 3+ (from relevant service/industry/blog) | 0–1 (minimal — keep focus) |

---

## Metadata Blueprint

### Title tag formula
- **Service pages:** `[Service Name] Consulting UK — Tacklers`
- **Industry pages:** `[Industry] Operational Excellence — Tacklers`
- **Blog posts:** `[Title — max 45 chars] — Tacklers Blog`
- **Pillar pages:** `[Primary Keyword] — Tacklers Consulting Group`
- **Legal/support:** `[Page Name] — Tacklers Consulting Group`

### Meta description formula
- **Commercial pages:** `[Value proposition in ≤120 chars]. [CTA in ≤40 chars].`
- **Blog posts:** `[Summary in ≤130 chars]. Read the full guide.`
- **Hub pages:** `[Overview in ≤130 chars]. Explore our [collection].`

### All descriptions ≤ 155 characters. All titles ≤ 60 characters.

---

## Measurement Framework

### KPIs (6-month targets)
| KPI | Current | Target | Measurement |
|-----|---------|--------|-------------|
| Indexed pages | 31 | 65–80 | Google Search Console |
| Organic clicks/month | Unknown | 500+ | Google Search Console |
| Average position for "operational excellence consulting uk" | Unknown | Top 10 | Google Search Console |
| Average position for "lean consulting uk" | Unknown | Top 20 | Google Search Console |
| Blog posts published | 4 | 22+ | CMS count |
| Case studies published | 0 | 5+ | CMS count |
| Discovery call form submissions/month | Unknown | 10+ | Form analytics |
| Average word count (landing pages) | ~140 | 900+ | Content audit |
