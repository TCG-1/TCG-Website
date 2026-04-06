# Services Pillar Page SEO Blueprint

**URL:** `/operational-excellence-consulting-uk`

---

## Current State
- Title: "Operational Excellence Consulting UK — Tacklers Consulting Group" (65 chars — over limit)
- H1: "Operational Excellence Consulting UK"
- Content: ~600 words + 11 service cards (links stripped) + FAQ
- Critical bug: Service cards rendered with `href: undefined`
- Structured data: WebPage, Breadcrumb, FAQ, Service (per card)

---

## Blueprint

### Title
**Proposed:** Operational Excellence Consulting UK — Tacklers (50 chars)

### Meta description
**Proposed:** Lean consulting and operational excellence services across the UK. From process improvement to strategy deployment. Explore our services. (139 chars)

### Content expansion (target: 1,500 words)

**Current content is adequate as hub overview.** The main issue is not content depth (this is a hub) but missing links to child pages.

Add the following sections:

1. **Services overview paragraph** (100 words) — brief positioning statement explaining the service portfolio and how they interconnect
2. **How we work section** (200 words) — Gemba-first methodology overview with link to `/gemba-consulting`
3. **Service detail cards with links** — fix the href stripping immediately; each card links to its `/services/[slug]`
4. **Industries we serve section** (100 words) — brief mention of 6 industries with links to each `/industries/[slug]`
5. **Results snapshot** (100 words) — 2–3 headline metrics with link to `/case-studies`
6. **FAQ section** — keep existing, consider adding 2–3 more questions

### Technical fix: Restore service card links
```
// CURRENT (broken):
{ ...card, cta: undefined, href: undefined }

// FIX:
{ ...card }  // Or explicitly set href to the /services/[slug] path
```

This is the single highest-priority technical SEO fix on the site.

### Internal linking additions
| From | Link to | Anchor text |
|------|---------|-------------|
| Each service card | `/services/[slug]` | "Learn more" or service name |
| "How we work" section | `/gemba-consulting` | "Gemba-based approach" |
| Industries section | Each `/industries/[slug]` | Industry name |
| Results section | `/case-studies` | "View case studies" |
| CTA | `/discovery-call` | "Book a discovery call" |
| Training mention | `/lean-training-uk` | "lean training and mentoring" |

### Structured data
- ✅ Service schema (per card) — keep
- ✅ FAQ schema — keep
- ✅ Breadcrumb — keep
- Add: SameAs links in Service schema pointing to detail pages

---

## Implementation checklist
- [ ] **FIX SERVICE CARD LINKS** — highest priority
- [ ] Shorten title to ≤60 chars
- [ ] Add industries section with links
- [ ] Add results snapshot section
- [ ] Add "How we work" Gemba section with link
- [ ] Add link to mentoring/training page
