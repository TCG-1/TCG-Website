# Homepage SEO Blueprint — tacklersconsulting.com

**URL:** `/`

---

## Current State
- Title: "Tacklers Consulting Group — Reduce Waste, Protect Talent" (58 chars)
- H1: Rotating slideshow with 3 headlines
- Content: ~600 words + stats + service cards + industry section + testimonials + FAQ
- Structured data: Organization, LocalBusiness, WebSite, WebPage, FAQPage
- Internal links: Navigation only (no in-content links to service/industry pages)

---

## Blueprint

### Title
**Current:** Tacklers Consulting Group — Reduce Waste, Protect Talent
**Proposed:** Operational Excellence Consulting UK — Tacklers (50 chars)

**Rationale:** Frontload the primary commercial keyword. Brand recognition comes second at this stage of growth.

### Meta description
**Proposed:** People-first lean consulting across the UK. Reduce waste while protecting your talent. Book a free discovery call. (114 chars)

### H1
**Proposed:** Keep the strongest slideshow variant as the primary H1; ensure the others are `<p>` or `<h2>`.

Recommended primary: "Reduce Waste While Protecting and Redeploying Your Talent"

### Content changes

#### Hero section
- Keep the current slideshow but ensure only one `<h1>` exists in the DOM at any time
- Add a subtitle line reinforcing the primary keyword: "UK operational excellence and lean transformation consulting"

#### Stats section
- Add a link from "£M+ savings delivered" → `/case-studies` (when created)
- Add a link from "1000+ team members upskilled" → `/lean-training-uk`

#### Service cards section
- Currently: Cards display service names but no links
- **Fix:** Add clickable links to each card pointing to `/operational-excellence-consulting-uk` or the relevant `/services/[slug]` page
- Featured 3–4 top services with thumbnail descriptions

#### Industry section
- Currently: Industry names displayed without links
- **Fix:** Link each industry name to its `/industries/[slug]` page
- Add a "View all industries" link to `/industries` (when hub page created)

#### Testimonials section
- Add client company name and industry context (anonymised if needed)
- Link to `/case-studies` once available

#### FAQ section
- Existing FAQ is good; no changes needed
- Ensure FAQ schema remains in place

### Internal linking additions
| From section | Link to | Anchor text |
|-------------|---------|-------------|
| Service cards | `/operational-excellence-consulting-uk` | "Explore our consulting services" |
| Service cards (individual) | `/services/[slug]` | Service name |
| Industry section | `/industries/[slug]` | Industry name |
| Stats | `/case-studies` | "See our results" |
| Stats | `/lean-training-uk` | "Our training programmes" |
| Hero CTA | `/discovery-call` | ✅ Already exists |
| Body text | `/about` | "our people-first approach" |

### Structured data
- ✅ Organization — keep
- ✅ LocalBusiness — keep
- ⚠️ WebSite SearchAction — remove (no search exists)
- ✅ WebPage — keep
- ✅ FAQ — keep

---

## Implementation checklist
- [ ] Update title tag to frontload primary keyword
- [ ] Update meta description with CTA
- [ ] Ensure single H1 in DOM
- [ ] Add in-content links from service cards to service pages
- [ ] Add links from industry section to industry pages
- [ ] Add links from stats to case studies and training
- [ ] Remove WebSite SearchAction from schema
