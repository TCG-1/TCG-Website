# Tacklers Consulting Group — Complete Website System Guide

Last updated: March 29, 2026

---

## 1) What this document is

This is the single, end-to-end guide for how the full website works.

It explains:

- The full tech stack
- How pages and dashboards are structured
- How sign-in and access control work
- How admin and user dashboards work in plain language
- How Supabase is used
- How Git and Vercel deployment work
- How `hello@tacklersconsulting.com` is used for platform access and ownership

---

## 2) High-level system overview (plain English)

The platform is one website with two private workspaces:

1. **Public Website**
   - Marketing pages, contact pages, service pages, blog, legal pages.
   - Anyone can visit.

2. **Admin Dashboard** (`/admin`)
   - For internal team operations: training delivery, blog, leads, jobs, applications, client hub content, support, and platform settings.
   - Restricted to authorized admin users.

3. **User Dashboard / Client Hub** (`/client-hub`)
   - For signed-in clients/learners to view training schedule, syllabus, resources, progress, notifications, profile, support, and settings.
   - Restricted to signed-in portal users.

Everything runs from one Next.js codebase and one Supabase backend, then deploys to Vercel.

---

## 3) Tech stack (full)

### Frontend + App framework

- **Next.js 16.2.1** (App Router)
- **React 19.2.4**
- **TypeScript 5**
- **Tailwind CSS v4**

### Backend services inside the same app

- **Next.js Route Handlers** under `src/app/api/*`
- Server-side auth/session checks in app layouts and API routes

### Data + Auth + Realtime

- **Supabase**
  - Postgres database
  - Authentication (email/password and Google OAuth for portal users)
  - Realtime subscriptions for live dashboard refresh
  - Storage bucket support (for careers application files)

### Email / notifications

- **Nodemailer** via SMTP (for contact/leads/support/careers/training comms)

### QA + tooling

- **ESLint**
- **Playwright** for e2e tests

### Hosting + release

- **Vercel** (production hosting + scheduled cron)
- **GitHub** repo as source of truth

---

## 4) Repository structure (what lives where)

## Root-level key files

- `package.json` — scripts, dependencies, Node version
- `next.config.ts` — redirect rules
- `vercel.json` — Vercel cron schedule
- `README.md` — setup summary

## App and UI

- `src/app` — all routes/pages/layouts/API route handlers
- `src/components` — UI components (public, admin, client hub, shared)
- `src/lib` — business logic, data access, auth helpers, email, SEO

## Database setup

- `supabase/*.sql` — setup SQL by domain
- `supabase/migrations/*` — migration history

## Internal documentation

- `docs/*` — audits, blueprints, and this complete guide

---

## 5) Public website structure

Main public pages include:

- Home (`/`)
- About (`/about`)
- Services (`/operational-excellence-consulting-uk`)
- Lean training (`/lean-training-uk`)
- Discovery call (`/discovery-call`)
- On-site assessment (`/on-site-assessment`)
- Book lean training (`/book-lean-training`)
- Careers (`/careers`)
- Blog (`/blog`, `/blog/[slug]`)
- Contact (`/contact`)
- Support (`/support`)
- Privacy policy (`/privacy-policy`)
- Terms (`/terms-and-conditions`)

Legacy URLs are redirected to current routes via `next.config.ts`.

---

## 6) Private dashboard structure

## Admin dashboard routes

Located under `src/app/admin/*`:

- dashboard, training, sessions, learners, assessments, resources, progress
- blog, leads, client-hub content manager
- jobs, applications, notifications, documents, support, activity
- profile, settings

## Client hub routes

Located under `src/app/client-hub/*`:

- training overview, schedule, syllabus, assessments, resources, progress
- notifications, documents, support, profile, settings

Both dashboards use dedicated layouts and sidebars, and both show branded loading states.

---

## 7) Access model and ownership (`hello@tacklersconsulting.com`)

`hello@tacklersconsulting.com` is the central platform identity used across admin ownership and access routing.

### How this works today

1. **Admin credential identity**
   - Admin login is controlled by env vars:
     - `ADMIN_EMAIL`
     - `ADMIN_PASSWORD`
     - `ADMIN_SESSION_SECRET`
   - In local non-production fallback, default admin identity is:
     - Email: `hello@tacklersconsulting.com`
     - Password: `Hello@123`

2. **Portal sign-in special routing**
   - In the portal sign-in flow, if user enters `hello@tacklersconsulting.com`, the form routes through admin session login and sends them to `/admin`.

3. **Admin recognition from Supabase**
   - If a signed-in Supabase user matches admin account rules (email/id mapping), they are treated as admin and redirected to admin workspace where relevant.

### Recommended operating policy

- Keep `hello@tacklersconsulting.com` as owner/admin identity.
- In production, always configure secure secrets and never rely on local fallback credentials.
- For team scaling, use Supabase `admin_accounts` records and role-based access, while preserving owner account controls.

---

## 8) Sign-in, session, and logout flows (simple language)

## User (client hub) sign-in

- User signs in with email/password or Google.
- Supabase creates a session.
- Session is persisted server-side via `/api/auth/session`.
- User lands in `/client-hub`.

## Admin sign-in

- Admin signs in through `/api/admin/session` using admin credentials.
- App sets a secure admin cookie (`tcg_admin_session`).
- Admin lands in `/admin`.

## Mixed session awareness

- Header checks `/api/auth/status` to know if user/admin/both are currently active.
- UI adapts to show account menu options.

## Logout behavior

Current logout is designed to clear both types of sessions where relevant:

- Admin logout clears admin cookie and Supabase session
- Client logout clears Supabase browser + server session

This avoids “stuck logged-in” behavior.

---

## 9) Admin dashboard workflow (non-technical explanation)

Think of admin as the internal operations control room.

### Day-to-day flow

1. **Open dashboard**
   - See delivery health, current risks, and priority work.

2. **Manage training operations**
   - Update programmes, sessions, learners, assessments, resources, progress.

3. **Run communication and support**
   - Check notifications, support tickets, and activity trail.

4. **Manage website/business inputs**
   - Publish blog content, review leads, manage jobs/applications.

5. **Control client-facing portal content**
   - Edit content shown inside user dashboard.

6. **Review profile/settings and sign out**
   - End session safely.

### Important behavior

- If data changes in tracked training tables, dashboard can refresh in near real-time (via Supabase realtime bridge).

---

## 10) User dashboard (client hub) workflow (non-technical explanation)

Think of client hub as the learner’s training journey workspace.

### Typical user journey

1. **Sign in**
   - User logs in and enters hub.

2. **See what’s next**
   - Dashboard highlights upcoming sessions and training journey steps.

3. **Follow learning path**
   - Visit schedule, syllabus, assessments, resources, and progress.

4. **Handle account + communication**
   - Check notifications/documents, update profile/settings, open support requests.

5. **Log out safely**
   - Session is fully cleared.

### UX expectations already implemented

- Sidebar route prefetching for faster feel
- Branded loading states while server data is loading

---

## 11) API structure (what the backend endpoints do)

Main API route groups under `src/app/api`:

- `admin/*` — admin operations (training, leads, jobs, blog, support, settings, session)
- `client/*` — client-facing portal data APIs
- `auth/*` — auth status + session persistence
- `careers/*` — careers/jobs/applications flows
- `forms/*` — lead/contact workflows
- `cron/*` — scheduled jobs (training reminders)

## Scheduled job

- `vercel.json` runs `/api/cron/training-reminders` daily at 08:00.
- Route accepts Vercel cron header or a bearer token using `CRON_SECRET`.

---

## 12) Supabase setup details

Supabase is the core data/auth layer.

### Main setup SQL files

- `supabase/site_content_setup.sql`
- `supabase/careers_setup.sql`
- `supabase/client_hub_setup.sql`
- `supabase/admin_portal_setup.sql`
- `supabase/portal_access_setup.sql`
- `supabase/todos_setup.sql`

### Migration history includes domains for

- todos
- careers
- client hub content
- admin portal core
- site content
- portal access
- training delivery and realtime extensions

### Realtime

Training/admin/client role and delivery tables are subscribed for refresh via `TrainingRealtimeBridge`.

---

## 13) Environment variables (single reference)

Set in:

- Local: `.env.local`
- Vercel: Project Settings → Environment Variables

Required/used keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_CAREERS_BUCKET=career-applications

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_NAME=Tacklers Consulting Group
SMTP_FROM_EMAIL=
SMTP_ADMIN_EMAIL=

ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=Tacklers Admin
ADMIN_SESSION_SECRET=

CRON_SECRET=
```

Security note:

- `SUPABASE_SERVICE_ROLE_KEY` must remain server-only.
- Use strong production values for admin credentials and secrets.

---

## 14) Git workflow (how updates are released)

Current operating pattern:

1. Make changes locally in feature or direct `main` workflow.
2. Run checks (`npm run lint`, targeted tests as needed).
3. Commit and push to GitHub (`origin/main`).
4. Deploy to Vercel production (`vercel --prod --yes`) or via Vercel Git integration.

Recommended team standard:

- Prefer PR-based review before merge to `main`.
- Tag major releases.
- Keep deployment notes in commit messages or release notes.

---

## 15) Vercel deployment workflow

### First-time setup

1. Import GitHub repo into Vercel.
2. Keep framework preset as Next.js.
3. Add all required environment variables.
4. Deploy.

### Ongoing releases

- Push code to GitHub and/or deploy directly with Vercel CLI.
- Production alias points to the latest successful production build.

### Runtime behavior

- Next.js server routes run on Vercel runtime.
- Cron route executes from Vercel schedule in `vercel.json`.

---

## 16) How the full system works end to end (simple)

1. **Visitor lands on website** and reads service information.
2. **Visitor submits enquiry/booking/contact** or signs in.
3. **If admin credentials are used**, user enters admin dashboard.
4. **If normal portal credentials are used**, user enters client hub.
5. **Admin manages content + operations** (training, leads, jobs, support, blog).
6. **Client/learner follows training journey** (sessions, syllabus, assessments, progress, support).
7. **Supabase stores data + auth**, while Next.js renders pages and APIs.
8. **Vercel hosts and deploys** the full platform.
9. **GitHub tracks all code changes** and version history.

---

## 17) Operations checklist for owners

Use this as a quick recurring check:

- [ ] `hello@tacklersconsulting.com` admin access works
- [ ] Admin and client logout both clear sessions
- [ ] Supabase env vars are set in production
- [ ] SMTP credentials valid and mail delivery works
- [ ] Vercel cron route is healthy
- [ ] Dashboard pages load with correct role-based access
- [ ] Redirects are functioning for legacy URLs
- [ ] Last production deploy status is green

---

## 18) Recommended future improvements

- Add explicit role matrix documentation (owner/admin/editor/client)
- Add architecture diagram image in docs
- Add incident recovery checklist (Supabase outage, SMTP outage, bad deploy rollback)
- Add onboarding runbook for new internal admins
- Add monthly access audit process tied to `hello@tacklersconsulting.com`

---

## 19) Single-sentence summary

This platform is a unified Next.js + Supabase + Vercel system where the public website, admin operations dashboard, and client training dashboard all run together, with `hello@tacklersconsulting.com` acting as the central owner/admin identity and access anchor.
