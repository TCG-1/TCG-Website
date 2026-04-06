# Sitewide SEO Gap Analysis — tacklersconsulting.com

**Audit date:** 6 April 2026

---

## Executive Summary

The site has a solid technical foundation (Next.js SSR, comprehensive JSON-LD, canonical URLs, dynamic sitemap, clean URL structure) but significant gaps in content depth, internal linking, and keyword coverage. The site's 31 indexable pages rank it below the minimum threshold for topical authority in the UK lean consulting niche.

**Overall SEO health score: 45/100**

| Category | Score | Status |
|----------|-------|--------|
| Technical SEO | 75/100 | Good foundation, minor issues |
| Content depth | 25/100 | Critical — thin content across landing pages and blog |
| Internal linking | 20/100 | Critical — broken topology, orphan pages |
| Keyword coverage | 30/100 | Major gaps in high-volume search terms |
| E-E-A-T signals | 35/100 | Missing case studies, thin author signals, no external proof |
| Metadata quality | 55/100 | Decent but inconsistent, missing some optimisations |

---

## 1. Content Depth Gaps

### Critical: Thin Landing Pages
All 13 landing pages (7 service detail + 6 industry) contain approximately 120–160 words of body copy. Google's Helpful Content guidelines and competitive benchmarks indicate that commercial service pages in this niche need 800–1,500 words minimum.

| Page type | Count | Avg. word count | Recommended minimum | Gap |
|-----------|-------|-----------------|--------------------|----|
| Service detail pages | 7 | ~140 words | 1,000 words | −860 |
| Industry pages | 6 | ~130 words | 800 words | −670 |
| Blog posts | 4 | ~380 words | 1,200 words | −820 |
| Services pillar | 1 | ~600 words | 1,500 words | −900 |
| Mentoring pillar | 1 | ~500 words | 1,200 words | −700 |

### Missing Content Types
| Content type | Status | Impact |
|--------------|--------|--------|
| Case studies / results | Not present | **Critical** — competitors all feature case studies; key E-E-A-T signal |
| Client testimonial page | Not present (3 testimonials on home only) | Medium |
| Methodology explainers | Not present | High — missed informational keyword volume |
| Resource downloads (checklists, templates) | Not present | Medium — lead capture opportunity |
| Video content | Not present | Medium — rich snippet opportunity |
| FAQ page (standalone) | Not present (FAQs on individual pages only) | Low |

---

## 2. Keyword Coverage Gaps

### Commercial Keywords Not Targeted
| Keyword | Est. UK volume/mo | Status |
|---------|-------------------|--------|
| lean transformation consulting uk | 170–260 | No dedicated page |
| continuous improvement consulting uk | 210–320 | No dedicated page |
| gemba consulting | 50–110 | No dedicated page |
| lean consulting uk | 260–480 | Partially covered by services page |
| lean six sigma consulting uk | 170–260 | Not targeted |
| value stream mapping consulting uk | 40–90 | Not targeted |
| kaizen consulting uk | 40–90 | Not targeted |

### Informational Keywords Not Targeted
| Keyword | Est. UK volume/mo | Status |
|---------|-------------------|--------|
| what is operational excellence | 720–1,100 | No content |
| what is gemba | 480–720 | Mentioned in FAQ only |
| value stream mapping guide | 320–480 | No content |
| continuous improvement framework | 210–320 | No content |
| operational excellence framework | 260–390 | No content |
| gemba walk template | 260–390 | No content |

---

## 3. Internal Linking Gaps

### Critical: Services pillar does not link to service detail pages
The services page (`/operational-excellence-consulting-uk`) renders service cards but explicitly strips the `href` property:
```
{ ...card, cta: undefined, href: undefined }
```
This means the 7 service detail pages have **zero internal links from their parent pillar page**.

### Linking topology summary
| Page | Inbound internal links | Outbound internal links | Status |
|------|----------------------|------------------------|--------|
| Home | N/A (root) | 6 (nav) + 0 (content) | Navigation-only |
| Services pillar | 2 (nav + footer) | 0 to service pages | **Critical gap** |
| Service detail pages (×7) | 0 (each) | 1 (back to services via breadcrumb) | **Orphan risk** |
| Industry pages (×6) | 0 (each) | 1 (not linked from any hub) | **Orphan pages** |
| Blog posts (×4) | 1 each (blog hub) | 0 cross-links | **No interlinking** |
| Mentoring page | 2 (nav + footer) | 0 to training booking | Missing CTA link |
| Discovery call | 1 (nav CTA) | 0 | Minimal |
| On-site assessment | 1 (nav CTA) | 0 | Minimal |

### Missing internal link paths
1. Home → service detail pages (via cards or featured services)
2. Services pillar → all 7 service detail pages (fix the stripped href)
3. Any page → industry pages (no hub page exists)
4. Blog posts → relevant service or industry pages
5. Service detail pages → related service pages (cross-linking)
6. Industry pages → relevant service pages
7. About → case studies (when created)
8. Mentoring → book lean training

---

## 4. Metadata Gaps

### Title tag issues
| Issue | Pages affected | Impact |
|-------|---------------|--------|
| Title over 60 chars (truncation risk) | Home, about, contact, some services | Medium |
| No primary keyword in first 4 words | Blog posts, careers | Medium |
| Duplicate intent in titles | 3 Dec 2024 blog posts | High (cannibalisation) |

### Meta description issues
| Issue | Pages affected | Impact |
|-------|---------------|--------|
| Over 160 chars (truncation) | Home, services, mentoring | Medium |
| Generic/brand-only descriptions | Careers, support | Low |
| Missing keyword in description | Blog hub, about | Medium |

### Open Graph gaps
| Issue | Pages affected | Impact |
|-------|---------------|--------|
| og:image uses generic brand image only | All pages | Medium — missed CTR opportunity |
| No page-specific og:description | Some pages inherit root | Low |

---

## 5. Technical SEO Gaps

| Issue | Severity | Detail |
|-------|----------|--------|
| WebSite SearchAction in schema but no search function exists | Medium | Schema declares search capability that doesn't exist — potential structured data inconsistency |
| No hreflang tags | Low | Site is UK-only but no signal to Google for en-GB locale disambiguation |
| No breadcrumb visible on service/industry pages | Low | BreadcrumbList schema present but no visible breadcrumb UI |
| Image alt text quality unknown | Medium | Cannot verify from code — dynamic images may lack descriptive alt text |
| Blog post content from Supabase — no pre-render guarantee | Medium | Blog posts fetched at request time; ensure SSR/ISR for SEO |
| "Download brochure" CTA on mentoring page links to /contact | Low | User expectation mismatch — not a technical SEO issue per se |

---

## 6. E-E-A-T Gaps

| Signal | Status | Impact |
|--------|--------|--------|
| Case studies | Missing | **Critical** — competitors all feature results |
| Author bios on blog posts | Missing | High — E-E-A-T for YMYL-adjacent topics |
| Client logos / social proof page | Missing | Medium |
| External press mentions / awards | Missing | Medium |
| Google Business Profile link | Missing | Low |
| Published whitepapers or research | Missing | Medium |

---

## 7. Competitor Benchmarking Summary

| Competitor | Est. indexed pages | Case studies | Blog frequency | Key advantage |
|------------|-------------------|-------------|---------------|---------------|
| S A Partners | 200+ | 20+ | Monthly | Established authority |
| Four Principles | 150+ | 15+ | Biweekly | Lean maturity tools |
| TBM Consulting | 300+ | 30+ | Weekly | Volume and breadth |
| Catalyst Consulting | 100+ | 10+ | Monthly | UK-focused content |
| **Tacklers** | **31** | **0** | **Sporadic** | **Gemba positioning, people-first brand** |

Tacklers must reach 60–80 quality indexed pages within 6 months to begin competing for topical authority.
