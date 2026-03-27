# Site Content Schema Notes

This schema extends the project beyond the admin/client portal and covers the public website content model.

## Public Site Coverage

- `site_settings`
  Global values such as footer copy, contact details, and reusable brand settings.
- `site_navigation_items`
  Header, footer, and social links.
- `site_cta_blocks`
  Reusable CTA content such as the shared yellow callout block.
- `site_pages`
  Top-level page metadata and hero content.
- `site_page_sections`
  Structured sections for each page.
- `site_section_items`
  Repeatable items inside sections, such as cards, stats, steps, FAQ rows, and list points.

## Content Modules

- `service_offerings`
  Service cards for the home and services pages.
- `service_programmes`
  Lean training / mentoring programme records.
- `industry_segments`
  Industry cards and segment content.
- `team_profiles`
  Team member profiles and bio data.
- `testimonial_entries`
  Testimonial quote content.
- `faq_groups`
  Named FAQ collections for each page or user journey.
- `faq_items`
  Question-and-answer rows inside FAQ groups.

## Booking And Inbound Workflow Coverage

- `booking_flows`
  Discovery call, lean training, and on-site assessment booking configurations.
- `booking_expectations`
  What-to-expect bullet points for each booking experience.
- `contact_channels`
  Email, phone, support, and operating-information content.
- `contact_submissions`
  Contact form submissions for admin review.
- `discovery_requests`
  Structured request records for discovery calls, lean training, and assessments.
- `resource_assets`
  Uploaded documents, images, and reusable media references.

## Current App Gap

The current app still reads most public content from `src/lib/site-data.ts`, and the contact form is not yet backed by a submission table.

This schema is the database foundation for migrating:

- service cards
- industry cards
- testimonials
- FAQ content
- CTA blocks
- booking page settings
- contact form submissions
