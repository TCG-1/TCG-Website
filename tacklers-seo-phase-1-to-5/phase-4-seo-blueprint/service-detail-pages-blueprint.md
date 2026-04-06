# Service Detail Pages SEO Blueprint

**URLs:** `/services/[slug]` (7 pages)

---

## Shared Current State (all 7 pages)
- Content: ~120–160 words each (overview + bullet list)
- Internal links: 0 inbound from services pillar (href stripped), 1 outbound (breadcrumb)
- Schema: Service, Breadcrumb, WebPage
- CTA: Single "Book a discovery call"

---

## Shared Blueprint (apply to all 7 pages)

### Target word count: 1,000 words per page

### Content structure template

```
H1: [Service Name]

## Overview (150 words)
What this service is and who it's for. Position the problem, then the solution.

## How We Deliver [Service Name] (250 words)
Step-by-step methodology. Reference Gemba-based approach.
Link to /gemba-consulting.

## What You Can Expect (150 words)
Typical outcomes, metrics, and timelines.
Include 3–5 specific results statements.
Link to /case-studies when available.

## Who This Is For (100 words)
Target personas: operations directors, plant managers, transformation sponsors.
Include industry context where relevant.
Link to relevant /industries/[slug] pages.

## Related Services (100 words)
Brief mention of 2–3 complementary services.
Link to each /services/[slug].

## Frequently Asked Questions (200 words)
3 unique questions per service page.
Schema-tagged as FAQPage.

## CTA
Primary: "Book a discovery call" → /discovery-call
Secondary: "Request an on-site assessment" → /on-site-assessment
```

### Per-page keyword and content guidance

#### Business Process Management `/services/business-process-management-consulting-uk`
- **Keywords:** business process management consulting uk, process improvement consultant, operational process mapping, BPM consultancy
- **Methodology focus:** Process mapping, Gemba observation, waste removal, process standardisation
- **Related services:** Productivity Improvement, Cost Management
- **Related industries:** Manufacturing, Healthcare, Public Sector

#### Cost Management `/services/cost-management-consulting-uk`
- **Keywords:** cost management consulting uk, operational cost reduction, lean cost improvement, cost reduction without redundancies
- **Methodology focus:** Cost-benefit analysis, waste identification, sustainable cost reduction, people-first approach to savings
- **Related services:** Business Process Management, Productivity Improvement
- **Related industries:** Manufacturing, Aerospace, Energy

#### Executive Leadership Coaching `/services/executive-leadership-coaching-operations`
- **Keywords:** executive leadership coaching operations, operational leadership development, lean leadership coaching
- **Methodology focus:** Leadership routines, standard work for leaders, Gemba leadership, daily management systems
- **Related services:** Strategy Deployment, Productivity Improvement
- **Related industries:** All — leadership is cross-sector

#### Productivity Improvement `/services/productivity-improvement-consulting-uk`
- **Keywords:** productivity improvement consulting uk, improve operational productivity, increase throughput consulting
- **Methodology focus:** Bottleneck analysis, flow improvement, visual management, standard work
- **Related services:** Business Process Management, Cost Management
- **Related industries:** Manufacturing, IT Services

#### Supplier Quality Development `/services/supplier-quality-development-consulting`
- **Keywords:** supplier quality development consulting, supplier quality improvement, supplier performance management
- **Methodology focus:** Supplier audit, incoming quality improvement, supplier development programmes, root cause analysis
- **Related services:** Business Process Management, Cost Management
- **Related industries:** Aerospace, Manufacturing, Healthcare

#### Strategy Deployment `/services/strategy-deployment-consulting-uk`
- **Keywords:** strategy deployment consulting uk, hoshin kanri consulting uk, strategy execution
- **Methodology focus:** Hoshin Kanri, X-matrix, cascading objectives, catchball process, visual strategy management
- **Related services:** Executive Leadership Coaching, Project Management
- **Related industries:** All — strategy is cross-sector

#### Project Management for Transformation `/services/project-management-for-transformation`
- **Keywords:** transformation project management, operational transformation support, lean programme management
- **Methodology focus:** Programme governance, milestone management, change management, stakeholder engagement
- **Related services:** Strategy Deployment, Business Process Management
- **Related industries:** All — transformation is cross-sector

### Internal linking per service page
| From | Link to | Anchor text |
|------|---------|-------------|
| Methodology section | `/gemba-consulting` | "our Gemba approach" |
| Outcomes section | `/case-studies` | "See our results" |
| Related services | Each relevant `/services/[slug]` | Service name |
| "Who this is for" | Relevant `/industries/[slug]` | Industry name |
| CTA | `/discovery-call` | "Book a discovery call" |
| CTA secondary | `/on-site-assessment` | "Request an assessment" |
| Breadcrumb | `/operational-excellence-consulting-uk` | "Services" |

### Schema additions per page
- Add FAQPage schema for the FAQ section
- Ensure Service schema has `provider` pointing to Organization
- Add `areaServed: "GB"` to Service schema

---

## Implementation checklist
- [ ] Expand each of 7 pages from ~140 to 1,000 words
- [ ] Add FAQ section (3 questions) per page
- [ ] Add FAQPage schema per page
- [ ] Add related services cross-links
- [ ] Add industry cross-links
- [ ] Add Gemba methodology link
- [ ] Add case studies link (when available)
- [ ] Add secondary CTA for on-site assessment
