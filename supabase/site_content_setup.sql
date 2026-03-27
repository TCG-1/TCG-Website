create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Global site settings and reusable content
create table if not exists public.site_settings (
  id text primary key,
  label text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_navigation_items (
  id uuid primary key default gen_random_uuid(),
  nav_location text not null check (nav_location in ('header', 'footer_useful', 'footer_additional', 'footer_legal', 'footer_social')),
  label text not null,
  href text,
  sort_order integer not null default 0,
  is_external boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_cta_blocks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  eyebrow text,
  title text not null,
  body text,
  primary_label text,
  primary_href text,
  secondary_label text,
  secondary_href text,
  variant text not null default 'default' check (variant in ('default', 'highlight', 'compact')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  route_path text not null unique,
  title text not null,
  meta_title text,
  meta_description text,
  hero_eyebrow text,
  hero_title text,
  hero_body text,
  hero_image_url text,
  hero_primary_label text,
  hero_primary_href text,
  hero_secondary_label text,
  hero_secondary_href text,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.site_pages(id) on delete cascade,
  section_key text not null,
  section_type text not null check (
    section_type in (
      'hero',
      'stats',
      'cards',
      'faq',
      'cta',
      'testimonials',
      'team',
      'feature_list',
      'rich_text',
      'booking',
      'contact'
    )
  ),
  eyebrow text,
  title text,
  body text,
  style_variant text,
  settings jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (page_id, section_key)
);

create table if not exists public.site_section_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.site_page_sections(id) on delete cascade,
  item_type text not null check (
    item_type in (
      'card',
      'stat',
      'point',
      'step',
      'resource',
      'testimonial',
      'industry',
      'service',
      'faq',
      'link'
    )
  ),
  title text,
  subtitle text,
  body text,
  value_text text,
  badge_text text,
  image_url text,
  icon_name text,
  href text,
  meta jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Service catalogue and supporting content
create table if not exists public.service_offerings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text,
  image_url text,
  cta_label text,
  cta_href text,
  category text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.service_programmes (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.service_offerings(id) on delete set null,
  title text not null,
  body text not null,
  cta_label text,
  cta_href text,
  programme_type text not null default 'mentoring' check (programme_type in ('mentoring', 'training', 'delivery', 'assessment')),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.industry_segments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.team_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  slug text unique,
  role_title text not null,
  bio text,
  headshot_url text,
  credentials text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.testimonial_entries (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text,
  company_name text,
  industry text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.faq_groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text,
  page_id uuid references public.site_pages(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  faq_group_id uuid not null references public.faq_groups(id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Booking, contact, and inbound workflows
create table if not exists public.booking_flows (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  page_path text not null unique,
  label text not null,
  title text not null,
  description text,
  embed_url text not null,
  confirmation_message text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.booking_expectations (
  id uuid primary key default gen_random_uuid(),
  booking_flow_id uuid not null references public.booking_flows(id) on delete cascade,
  item_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_channels (
  id uuid primary key default gen_random_uuid(),
  channel_type text not null check (channel_type in ('email', 'phone', 'hours', 'coverage_note', 'support')),
  label text not null,
  value text not null,
  href text,
  page_context text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  work_email text not null,
  company_name text,
  phone text,
  message text not null,
  source_page text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'responded', 'closed')),
  assigned_to text,
  internal_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.discovery_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  company_name text,
  email text,
  phone text,
  request_type text not null check (request_type in ('discovery_call', 'lean_training', 'on_site_assessment')),
  preferred_date text,
  notes text,
  status text not null default 'new' check (status in ('new', 'scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.resource_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  asset_type text not null check (asset_type in ('image', 'document', 'download', 'logo', 'icon')),
  file_path text,
  public_url text,
  alt_text text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Triggers
drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

drop trigger if exists set_site_navigation_items_updated_at on public.site_navigation_items;
create trigger set_site_navigation_items_updated_at
before update on public.site_navigation_items
for each row
execute function public.set_updated_at();

drop trigger if exists set_site_cta_blocks_updated_at on public.site_cta_blocks;
create trigger set_site_cta_blocks_updated_at
before update on public.site_cta_blocks
for each row
execute function public.set_updated_at();

drop trigger if exists set_site_pages_updated_at on public.site_pages;
create trigger set_site_pages_updated_at
before update on public.site_pages
for each row
execute function public.set_updated_at();

drop trigger if exists set_site_page_sections_updated_at on public.site_page_sections;
create trigger set_site_page_sections_updated_at
before update on public.site_page_sections
for each row
execute function public.set_updated_at();

drop trigger if exists set_site_section_items_updated_at on public.site_section_items;
create trigger set_site_section_items_updated_at
before update on public.site_section_items
for each row
execute function public.set_updated_at();

drop trigger if exists set_service_offerings_updated_at on public.service_offerings;
create trigger set_service_offerings_updated_at
before update on public.service_offerings
for each row
execute function public.set_updated_at();

drop trigger if exists set_service_programmes_updated_at on public.service_programmes;
create trigger set_service_programmes_updated_at
before update on public.service_programmes
for each row
execute function public.set_updated_at();

drop trigger if exists set_industry_segments_updated_at on public.industry_segments;
create trigger set_industry_segments_updated_at
before update on public.industry_segments
for each row
execute function public.set_updated_at();

drop trigger if exists set_team_profiles_updated_at on public.team_profiles;
create trigger set_team_profiles_updated_at
before update on public.team_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_testimonial_entries_updated_at on public.testimonial_entries;
create trigger set_testimonial_entries_updated_at
before update on public.testimonial_entries
for each row
execute function public.set_updated_at();

drop trigger if exists set_faq_groups_updated_at on public.faq_groups;
create trigger set_faq_groups_updated_at
before update on public.faq_groups
for each row
execute function public.set_updated_at();

drop trigger if exists set_faq_items_updated_at on public.faq_items;
create trigger set_faq_items_updated_at
before update on public.faq_items
for each row
execute function public.set_updated_at();

drop trigger if exists set_booking_flows_updated_at on public.booking_flows;
create trigger set_booking_flows_updated_at
before update on public.booking_flows
for each row
execute function public.set_updated_at();

drop trigger if exists set_booking_expectations_updated_at on public.booking_expectations;
create trigger set_booking_expectations_updated_at
before update on public.booking_expectations
for each row
execute function public.set_updated_at();

drop trigger if exists set_contact_channels_updated_at on public.contact_channels;
create trigger set_contact_channels_updated_at
before update on public.contact_channels
for each row
execute function public.set_updated_at();

drop trigger if exists set_contact_submissions_updated_at on public.contact_submissions;
create trigger set_contact_submissions_updated_at
before update on public.contact_submissions
for each row
execute function public.set_updated_at();

drop trigger if exists set_discovery_requests_updated_at on public.discovery_requests;
create trigger set_discovery_requests_updated_at
before update on public.discovery_requests
for each row
execute function public.set_updated_at();

drop trigger if exists set_resource_assets_updated_at on public.resource_assets;
create trigger set_resource_assets_updated_at
before update on public.resource_assets
for each row
execute function public.set_updated_at();

-- Indexes
create index if not exists idx_site_navigation_items_location_order on public.site_navigation_items(nav_location, sort_order);
create index if not exists idx_site_pages_route_path on public.site_pages(route_path);
create index if not exists idx_site_page_sections_page_order on public.site_page_sections(page_id, sort_order);
create index if not exists idx_site_section_items_section_order on public.site_section_items(section_id, sort_order);
create index if not exists idx_service_offerings_sort on public.service_offerings(sort_order);
create index if not exists idx_service_programmes_service_order on public.service_programmes(service_id, sort_order);
create index if not exists idx_industry_segments_sort on public.industry_segments(sort_order);
create index if not exists idx_team_profiles_sort on public.team_profiles(sort_order);
create index if not exists idx_testimonial_entries_sort on public.testimonial_entries(sort_order);
create index if not exists idx_faq_items_group_order on public.faq_items(faq_group_id, sort_order);
create index if not exists idx_booking_expectations_flow_order on public.booking_expectations(booking_flow_id, sort_order);
create index if not exists idx_contact_submissions_status on public.contact_submissions(status, created_at desc);
create index if not exists idx_discovery_requests_type_status on public.discovery_requests(request_type, status, created_at desc);

-- Secure admin-managed content tables by default
alter table public.site_settings enable row level security;
alter table public.site_navigation_items enable row level security;
alter table public.site_cta_blocks enable row level security;
alter table public.site_pages enable row level security;
alter table public.site_page_sections enable row level security;
alter table public.site_section_items enable row level security;
alter table public.service_offerings enable row level security;
alter table public.service_programmes enable row level security;
alter table public.industry_segments enable row level security;
alter table public.team_profiles enable row level security;
alter table public.testimonial_entries enable row level security;
alter table public.faq_groups enable row level security;
alter table public.faq_items enable row level security;
alter table public.booking_flows enable row level security;
alter table public.booking_expectations enable row level security;
alter table public.contact_channels enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.discovery_requests enable row level security;
alter table public.resource_assets enable row level security;

-- Comments
comment on table public.site_settings is
'Global site settings such as footer copy, contact details, and reusable brand values.';

comment on table public.site_navigation_items is
'Editable header, footer, and social navigation links.';

comment on table public.site_cta_blocks is
'Reusable call-to-action blocks used across multiple pages.';

comment on table public.site_pages is
'Top-level page metadata and hero content records for public pages.';

comment on table public.site_page_sections is
'Structured public-site section containers attached to a page.';

comment on table public.site_section_items is
'Repeatable cards, stats, points, FAQ rows, and other items inside page sections.';

comment on table public.service_offerings is
'Public service catalogue entries for home and services pages.';

comment on table public.service_programmes is
'Lean programmes and service-specific delivery packages.';

comment on table public.industry_segments is
'Industry cards and target-sector content shown across the site.';

comment on table public.team_profiles is
'Founder and team profile records for about pages and future bio modules.';

comment on table public.testimonial_entries is
'Client testimonials and endorsement content.';

comment on table public.faq_groups is
'Named FAQ collections for different pages or user journeys.';

comment on table public.faq_items is
'Question and answer rows belonging to FAQ groups.';

comment on table public.booking_flows is
'Booking page definitions and embed configurations for discovery calls, training, and assessments.';

comment on table public.booking_expectations is
'Expected outcomes and bullet points shown alongside booking flows.';

comment on table public.contact_channels is
'Contact emails, phone numbers, support messages, and coverage notes.';

comment on table public.contact_submissions is
'Inbound contact form submissions that should appear in admin.';

comment on table public.discovery_requests is
'Structured request records for discovery calls, lean training, and on-site assessments.';

comment on table public.resource_assets is
'Reusable uploaded assets and media records for site-managed content.';
