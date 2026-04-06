# Industry Pages SEO Blueprint

**URLs:** `/industries/[slug]` (6 pages)

---

## Shared Current State (all 6 pages)
- Content: ~120–160 words each (overview + challenges + why Tacklers)
- Internal links: 0 inbound from any page, 0 outbound
- Schema: WebPage, Breadcrumb
- No hub page exists
- Completely orphaned from the site's link graph

---

## Shared Blueprint (apply to all 6 pages)

### Target word count: 800 words per page

### Content structure template

```
H1: [Industry] Operational Excellence

## Sector Overview (150 words)
UK market context, scale, key regulatory or operational pressures.
Include at least 1–2 sector statistics.

## Common Operational Challenges (200 words)
Expand the current bullet list into detailed paragraphs.
Include sector-specific examples, not generic statements.

## How Tacklers Helps in [Industry] (200 words)
Map Tacklers' services to this sector's needs.
Link to 2–3 relevant /services/[slug] pages.
Reference Gemba approach — link to /gemba-consulting.

## Results We've Delivered (100 words)
Link to relevant case study(ies) when available.
Include headline metrics if possible.

## Frequently Asked Questions (100 words)
2–3 sector-specific questions.
Schema-tagged as FAQPage.

## CTA
Primary: "Discuss [industry] challenges" → /discovery-call
Secondary: "Request an on-site assessment" → /on-site-assessment
```

### Per-page keyword and content guidance

#### Aerospace & Defence `/industries/aerospace-defence-operational-excellence`
- **Keywords:** aerospace operational excellence, defence process improvement, lean aerospace consulting uk, MRO process improvement
- **Sector context:** Defence procurement cycles, MRO operations, safety-critical processes, AS9100 compliance
- **Relevant services:** Supplier Quality, Business Process Management, Cost Management
- **Challenges:** Supply chain complexity, quality escapes, long lead times, regulatory burden

#### Healthcare & Life Sciences `/industries/healthcare-life-sciences-process-improvement`
- **Keywords:** healthcare process improvement uk, lean healthcare consulting, life sciences operational excellence, clinical process improvement
- **Sector context:** NHS efficiency pressures, CQC compliance, patient safety, GMP/GLP in life sciences
- **Relevant services:** Business Process Management, Productivity Improvement, Executive Leadership Coaching
- **Challenges:** Demand surges, handover failures, waiting lists, documentation burden

#### Energy Sector `/industries/energy-sector-operational-improvement`
- **Keywords:** energy sector operational efficiency, energy process improvement, lean energy operations
- **Sector context:** Net zero transition, regulatory compliance (Ofgem), asset management, safety-critical operations
- **Relevant services:** Cost Management, Productivity Improvement, Strategy Deployment
- **Challenges:** Aging infrastructure, workforce transition, safety compliance, cost pressures

#### Public Sector `/industries/public-sector-lean-transformation`
- **Keywords:** public sector lean transformation, government lean consulting, local authority process improvement
- **Sector context:** Budget constraints, service demand growth, digital transformation, accountability frameworks
- **Relevant services:** Business Process Management, Strategy Deployment, Executive Leadership Coaching
- **Challenges:** Demand outstripping resource, siloed teams, long change cycles, public accountability

#### IT Services `/industries/it-services-lean-operations`
- **Keywords:** IT services lean transformation, lean ITSM, IT operational excellence
- **Sector context:** Digital service delivery, ITIL frameworks, DevOps alignment, service desk operations
- **Relevant services:** Business Process Management, Productivity Improvement, Strategy Deployment
- **Challenges:** Incident backlogs, deployment delays, handover failures, context switching

#### Manufacturing `/industries/manufacturing-operational-excellence`
- **Keywords:** lean manufacturing consulting uk, manufacturing operational excellence, manufacturing process improvement, factory operational excellence
- **Sector context:** UK manufacturing output, automation trends, skills gap, supply chain resilience
- **Relevant services:** Business Process Management, Productivity Improvement, Cost Management, Supplier Quality
- **Challenges:** Rework, downtime, changeover waste, supply chain disruption, quality consistency

### Industry Hub Page (NEW) `/industries`
Create a new hub page to serve as the parent for all industry pages:

- **Title:** Industries We Serve — Operational Excellence Across Sectors — Tacklers (68 → trim) → Industries We Serve — Tacklers Consulting Group (50 chars)
- **Content:** 400–600 words introducing Tacklers' cross-sector experience
- **Links:** Card or list linking to each of 6 industry pages
- **Schema:** CollectionPage + Breadcrumb
- **Nav integration:** Add to main navigation or as sub-item under Services

### Internal linking per industry page
| From | Link to | Anchor text |
|------|---------|-------------|
| How Tacklers helps | 2–3 relevant `/services/[slug]` | Service name |
| Methodology reference | `/gemba-consulting` | "Gemba-based approach" |
| Results section | `/case-studies/[relevant]` | "See how we helped [industry]" |
| CTA | `/discovery-call` | "Discuss your [industry] needs" |
| Breadcrumb | `/industries` (hub) | "Industries" |

### Inbound links needed
| From page | Anchor text |
|-----------|-------------|
| Home page industry section | Industry name |
| Services pillar page | Industry name in "Industries we serve" section |
| Industry hub page | Industry card/name |
| Relevant blog posts | Industry context mention |
| Relevant service detail pages | Industry cross-reference |

---

## Implementation checklist
- [ ] Create `/industries` hub page
- [ ] Expand each of 6 pages from ~130 to 800 words
- [ ] Add sector statistics and context
- [ ] Add FAQ section (2–3 questions) per page with schema
- [ ] Add service cross-links (2–3 per page)
- [ ] Add Gemba methodology link
- [ ] Add case study links (when available)
- [ ] Link from home page industry section
- [ ] Link from services pillar page
- [ ] Add to navigation (as sub-item or footer)
