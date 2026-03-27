# Tacklers Consulting Group Site

This project is a Next.js 16 marketing site plus an authenticated admin area for careers, applications,
blog content, leads, and the client hub.

## Included routes

- `/`
- `/operational-excellence-services-uk`
- `/lean-services`
- `/about-tacklers-consulting-group`
- `/blog`
- `/blog/[slug]`
- `/contact-us`
- `/book-a-discovery-call`
- `/request-an-on-site-assessment`
- `/book-lean-training-session`
- `/careers`
- `/support`
- `/privacy-policy`
- `/terms-condition`

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

Local development uses a fallback admin login only when `NODE_ENV` is not `production`:

- Email: `hello@tacklersconsulting.com`
- Password: `Hello@123`

## Build

```bash
npm run build
npm run start
```

Next.js 16 requires Node.js `20.9+`, and the project declares that in `package.json`.

## Project structure

- `src/app` — route pages
- `src/app/api` — route handlers for admin and careers data flows
- `src/components` — shared layout, admin tools, and dashboard sections
- `src/lib/site-data.ts` — centralised site content and navigation data
- `supabase` — SQL setup for careers and client hub content

## Environment variables

Set these in `.env.local` for local work and in Vercel Project Settings for deploys:

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
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only.
- `SUPABASE_URL` is optional if you already set `NEXT_PUBLIC_SUPABASE_URL`.
- SMTP is used for enquiry, careers, and support emails. For Google Workspace or Gmail app passwords, `smtp.gmail.com` on port `465` with `SMTP_SECURE=true` is the intended setup.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` are required for production admin access.

## Supabase setup

Run both SQL files in your Supabase SQL editor before deploying the admin features:

```bash
supabase/careers_setup.sql
supabase/client_hub_setup.sql
```

## Vercel deployment

1. Import the GitHub repo into Vercel.
2. Keep the detected framework preset as `Next.js`.
3. Add all environment variables from the section above to Production, and Preview if you want previews to work with admin features too.
4. Deploy.
5. After the first deploy, sign in at `/sign-in` using the admin credentials you configured in Vercel.

## Notes

- Google Calendar booking pages are embedded with live scheduler iframes.
- Careers, applications, and client hub management depend on Supabase being configured.
- Admin access is now cookie-based and server-validated for production deployments.
