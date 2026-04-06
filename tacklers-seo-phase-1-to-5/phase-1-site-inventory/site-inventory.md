# Site Inventory — tacklersconsulting.com

**Audit date:** 6 April 2026
**Domain:** https://www.tacklersconsulting.com
**Framework:** Next.js (App Router) with Supabase backend
**Locale:** en-GB
**Sitemap:** https://tacklersconsulting.com/sitemap.xml

---

## 1. Core Navigation Pages

| # | Page name | URL | Page type | Status |
|---|-----------|-----|-----------|--------|
| 1 | Home | `/` | Pillar / commercial | Live |
| 2 | Services (Operational Excellence) | `/operational-excellence-consulting-uk` | Pillar / commercial | Live |
| 3 | Mentoring (Lean Training) | `/lean-training-uk` | Pillar / commercial | Live |
| 4 | About | `/about` | Trust / brand | Live |
| 5 | Blog hub | `/blog` | Content hub | Live |
| 6 | Contact | `/contact` | Conversion | Live |
| 7 | Careers | `/careers` | Recruitment | Live |

---

## 2. Conversion & Lead-Capture Pages

| # | Page name | URL | Page type | Status |
|---|-----------|-----|-----------|--------|
| 8 | Discovery Call | `/discovery-call` | Lead capture | Live |
| 9 | On-Site Assessment | `/on-site-assessment` | Lead capture | Live |
| 10 | Book Lean Training | `/book-lean-training` | Lead capture | Live |

---

## 3. Support & Utility Pages

| # | Page name | URL | Page type | Status |
|---|-----------|-----|-----------|--------|
| 11 | Support | `/support` | Help / utility | Live |

---

## 4. Legal & Compliance Pages

| # | Page name | URL | Page type | Status |
|---|-----------|-----|-----------|--------|
| 12 | Terms & Conditions | `/terms-and-conditions` | Legal | Live |
| 13 | Privacy Policy | `/privacy-policy` | Legal | Live |
| 14 | Cookie Policy | `/cookie-policy` | Legal | Live |

---

## 5. Service Detail Pages (dynamic route: `/services/[slug]`)

| # | Page name | URL | Status |
|---|-----------|-----|--------|
| 15 | Business Process Management Consulting UK | `/services/business-process-management-consulting-uk` | Live |
| 16 | Cost Management Consulting UK | `/services/cost-management-consulting-uk` | Live |
| 17 | Executive Leadership Coaching Operations | `/services/executive-leadership-coaching-operations` | Live |
| 18 | Productivity Improvement Consulting UK | `/services/productivity-improvement-consulting-uk` | Live |
| 19 | Supplier Quality Development Consulting | `/services/supplier-quality-development-consulting` | Live |
| 20 | Strategy Deployment Consulting UK | `/services/strategy-deployment-consulting-uk` | Live |
| 21 | Project Management for Transformation | `/services/project-management-for-transformation` | Live |

---

## 6. Industry Pages (dynamic route: `/industries/[slug]`)

| # | Page name | URL | Status |
|---|-----------|-----|--------|
| 22 | Aerospace & Defence Operational Excellence | `/industries/aerospace-defence-operational-excellence` | Live |
| 23 | Healthcare & Life Sciences Process Improvement | `/industries/healthcare-life-sciences-process-improvement` | Live |
| 24 | Energy Sector Operational Improvement | `/industries/energy-sector-operational-improvement` | Live |
| 25 | Public Sector Lean Transformation | `/industries/public-sector-lean-transformation` | Live |
| 26 | IT Services Lean Operations | `/industries/it-services-lean-operations` | Live |
| 27 | Manufacturing Operational Excellence | `/industries/manufacturing-operational-excellence` | Live |

---

## 7. Blog Posts (dynamic route: `/blog/[slug]`)

| # | Title | URL | Category | Date |
|---|-------|-----|----------|------|
| 28 | 2025: A Year of Digital Breakthrough | `/blog/2025-a-year-of-digital-breakthrough-tacklers-consulting-group-ltd-leading-the-charge` | Digital Transformation | 3 Mar 2025 |
| 29 | Enhance Operational Excellence with TCG | `/blog/enhance-operational-excellence-with-tacklers-consulting-group` | Operational Excellence | 3 Dec 2024 |
| 30 | Drive Efficiency with Lean Methodologies | `/blog/drive-efficiency-with-lean-methodologies-at-tacklers-consulting` | Lean Methodologies | 3 Dec 2024 |
| 31 | Maximise Productivity with TCG Services | `/blog/maximise-productivity-with-tacklers-consulting-group-services` | Productivity Improvement | 3 Dec 2024 |

---

## 8. Authentication & Portal Pages (noIndex, disallowed in robots.txt)

| Page | URL | Purpose |
|------|-----|---------|
| Sign In | `/sign-in` | Portal authentication |
| Sign Up | `/sign-up` | Portal registration |
| Reset Password | `/reset-password` | Credential recovery |
| Admin | `/admin` | Internal admin panel |
| Client Hub | `/client-hub` | Authenticated client dashboard |
| Newsletter Subscription | `/newsletter/subscription` | Preference management (noIndex) |

---

## 9. Configured Redirects (301 Permanent)

| Source | Destination |
|--------|-------------|
| `/about-tacklers-consulting-group` | `/about` |
| `/operational-excellence-services-uk` | `/operational-excellence-consulting-uk` |
| `/lean-services` | `/lean-training-uk` |
| `/contact-us` | `/contact` |
| `/book-a-discovery-call` | `/discovery-call` |
| `/book-lean-training-session` | `/book-lean-training` |
| `/request-an-on-site-assessment` | `/on-site-assessment` |
| `/terms-condition` | `/terms-and-conditions` |
| `/services` | `/operational-excellence-consulting-uk` |
| `/mentoring` | `/lean-training-uk` |
| `/terms` | `/terms-and-conditions` |
| `/privacy` | `/privacy-policy` |
| `/blog/maximize-productivity-with-tacklers-consulting-group-services` | `/blog/maximise-productivity-with-tacklers-consulting-group-services` |

---

## 10. Template-Based Content Types

| Content type | Route pattern | Source |
|--------------|---------------|--------|
| Service detail | `/services/[slug]` | `landing-pages.ts` static data |
| Industry page | `/industries/[slug]` | `landing-pages.ts` static data |
| Blog post | `/blog/[slug]` | Supabase + static fallback in `site-data.ts` |
| Careers listing | `/careers` + dynamic portal | Supabase `job_listings` table |

---

## 11. Structured Data Present

| Schema type | Where applied |
|-------------|---------------|
| Organization | Root layout (every page) |
| LocalBusiness / ProfessionalService | Root layout (every page) |
| WebSite + SearchAction | Root layout (every page) |
| WebPage | Every page-level component |
| BreadcrumbList | Every page-level component |
| FAQPage | Home, Services, Mentoring, About, Contact, Support |
| Service | Services pillar, Lean Training pillar, each `/services/[slug]` |
| BlogPosting | Each `/blog/[slug]` |
| CollectionPage | `/blog` hub |
| Article (BlogPosting) | Each blog post |

---

## 12. Summary Statistics

| Metric | Count |
|--------|-------|
| Total public indexable pages | 31 |
| Core navigation pages | 7 |
| Conversion / lead-capture pages | 3 |
| Support / utility pages | 1 |
| Legal pages | 3 |
| Service detail pages | 7 |
| Industry pages | 6 |
| Blog posts | 4 |
| Configured 301 redirects | 13 |
| noIndex pages | 6+ (auth, admin, portal) |
