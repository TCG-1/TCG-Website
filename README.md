# Tacklers Next.js Clone

This project is a static Next.js recreation of the Tacklers WordPress site structure.

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

## Build

```bash
npm run build
npm run start
```

## Project structure

- `src/app` — route pages
- `src/components` — shared layout and content sections
- `src/lib/site-data.ts` — centralised site content and navigation data

## Notes

- The booking and contact forms are static UI placeholders ready to connect to your preferred backend or scheduler.
- Shared navigation, CTA styling, and footer content are centralised for easier editing.
