# Admin Portal Schema Notes

This schema expands the current Supabase setup beyond:

- `careers_jobs`
- `career_applications`
- `client_hub_content`

It is designed to support the existing admin portal and client dashboard with normalized tables.

## Admin Portal Coverage

- `clients`
  Stores the organisations managed from the admin portal.
- `client_contacts`
  Stores named contacts for each organisation.
- `consultants`
  Stores internal consultants who can be shown in programme/session views.
- `client_consultant_assignments`
  Connects consultants to client accounts.
- `lead_submissions`
  Replaces static lead rows with real enquiry records.
- `blog_posts`
  Replaces static blog post headers and metadata.
- `blog_post_sections`
  Stores ordered blog content blocks instead of hard-coded arrays.
- `admin_audit_log`
  Tracks internal admin actions for future change history.

## Client Dashboard Coverage

- `client_portal_profiles`
  Stores top-level shell copy such as greeting, brand, CTA label, and footer.
- `client_navigation_items`
  Stores editable sidebar and footer navigation items.
- `client_programmes`
  Stores live client programmes.
- `client_programme_stages`
  Stores ordered roadmap stages for each programme.
- `client_programme_collaborators`
  Stores visible collaborator avatars/cards per programme.
- `client_metrics`
  Stores KPI cards such as waste reduced and efficiency gain.
- `client_resources`
  Stores knowledge library items.
- `client_featured_resources`
  Stores the featured case study/resource card.
- `client_sessions`
  Stores mentoring calendar items and scheduled sessions.
- `client_session_consultants`
  Connects sessions to consultants.
- `client_insights`
  Stores the right-rail insight/recommendation card.

## Current App Gap

The UI is not fully migrated to these new tables yet.

Right now:

- blog content still comes from `src/lib/site-data.ts`
- leads still come from `src/lib/admin-data.ts`
- the client dashboard still reads from `client_hub_content` as a single JSON row

The new schema is the database foundation for the next migration pass.
