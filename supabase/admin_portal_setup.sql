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

-- Core CRM / client management
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  industry text,
  status text not null default 'active' check (status in ('prospect', 'active', 'paused', 'archived')),
  overview text,
  location_label text not null default 'On-site at client locations across the UK',
  account_owner_name text,
  account_owner_email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  full_name text not null,
  role_title text,
  email text,
  phone text,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.consultants (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text,
  email text unique,
  phone text,
  avatar_url text,
  avatar_alt text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_consultant_assignments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  consultant_id uuid not null references public.consultants(id) on delete cascade,
  role_label text,
  is_primary boolean not null default false,
  starts_at date,
  ends_at date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (client_id, consultant_id)
);

-- Client portal / dashboard presentation
create table if not exists public.client_portal_profiles (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.clients(id) on delete cascade,
  page_title text not null default 'Client Hub | Tacklers Consulting',
  brand_name text not null default 'Tacklers Consulting',
  brand_subtitle text not null default 'Bespoke advisory workspace',
  sidebar_title text not null default 'Client Hub',
  sidebar_subtitle text not null default 'Programme access',
  greeting_label text not null default 'Portfolio Overview',
  greeting_name text not null default 'Client',
  greeting_body text not null default '',
  search_placeholder text not null default 'Search programme data...',
  cta_label text not null default 'Enquire Now',
  footer_copy text not null default '© 2026 Tacklers Consulting Group • Bespoke Advisory Services',
  avatar_url text,
  avatar_alt text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_navigation_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  nav_group text not null check (nav_group in ('primary', 'secondary', 'footer')),
  label text not null,
  icon_name text,
  section_key text,
  href text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_programmes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  subtitle text,
  completion_label text not null default 'Completion',
  completion_percentage numeric(5,2) not null default 0 check (completion_percentage >= 0 and completion_percentage <= 100),
  cta_label text not null default 'View Full Roadmap',
  status text not null default 'assess' check (status in ('assess', 'collaborate', 'upskill', 'sustain', 'complete')),
  is_primary boolean not null default false,
  starts_at date,
  ends_at date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_programme_stages (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.client_programmes(id) on delete cascade,
  label text not null,
  state text not null check (state in ('complete', 'active', 'upcoming')),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_programme_collaborators (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.client_programmes(id) on delete cascade,
  consultant_id uuid references public.consultants(id) on delete set null,
  display_name text not null,
  role_label text,
  image_url text,
  image_alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_metrics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  metric_key text,
  value_text text not null,
  label text not null,
  icon_name text,
  badge_text text,
  badge_tone text check (badge_tone in ('success', 'accent', 'neutral')),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_resources (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  meta text,
  resource_type text not null default 'link' check (resource_type in ('link', 'download', 'document', 'case-study')),
  icon_name text,
  href text,
  file_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_featured_resources (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.clients(id) on delete cascade,
  badge text not null,
  title text not null,
  image_url text,
  image_alt text,
  href text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  programme_id uuid references public.client_programmes(id) on delete set null,
  title text not null,
  subtitle text,
  starts_at timestamptz,
  ends_at timestamptz,
  delivery_mode text not null default 'onsite' check (delivery_mode in ('onsite', 'virtual', 'hybrid')),
  display_location text,
  status text not null default 'scheduled' check (status in ('draft', 'scheduled', 'completed', 'cancelled')),
  is_highlighted boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_session_consultants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.client_sessions(id) on delete cascade,
  consultant_id uuid not null references public.consultants(id) on delete cascade,
  role_label text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (session_id, consultant_id)
);

create table if not exists public.client_insights (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  body text not null,
  cta_label text,
  href text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Admin portal content management
create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text,
  email text not null,
  phone text,
  source text not null default 'contact-form',
  status text not null default 'new' check (status in ('new', 'qualified', 'follow_up', 'closed')),
  enquiry_type text,
  message text,
  internal_notes text,
  client_id uuid references public.clients(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  author_name text,
  category text,
  cover_url text,
  seo_title text,
  seo_description text,
  canonical_url text,
  og_image_url text,
  noindex boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_post_sections (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  section_type text not null default 'paragraph' check (section_type in ('heading', 'paragraph', 'quote', 'bullet_list')),
  body text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_name text,
  actor_email text,
  action_type text not null,
  entity_table text not null,
  entity_id text,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

-- Triggers
drop trigger if exists set_clients_updated_at on public.clients;
create trigger set_clients_updated_at
before update on public.clients
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_contacts_updated_at on public.client_contacts;
create trigger set_client_contacts_updated_at
before update on public.client_contacts
for each row
execute function public.set_updated_at();

drop trigger if exists set_consultants_updated_at on public.consultants;
create trigger set_consultants_updated_at
before update on public.consultants
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_consultant_assignments_updated_at on public.client_consultant_assignments;
create trigger set_client_consultant_assignments_updated_at
before update on public.client_consultant_assignments
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_portal_profiles_updated_at on public.client_portal_profiles;
create trigger set_client_portal_profiles_updated_at
before update on public.client_portal_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_navigation_items_updated_at on public.client_navigation_items;
create trigger set_client_navigation_items_updated_at
before update on public.client_navigation_items
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_programmes_updated_at on public.client_programmes;
create trigger set_client_programmes_updated_at
before update on public.client_programmes
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_programme_stages_updated_at on public.client_programme_stages;
create trigger set_client_programme_stages_updated_at
before update on public.client_programme_stages
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_programme_collaborators_updated_at on public.client_programme_collaborators;
create trigger set_client_programme_collaborators_updated_at
before update on public.client_programme_collaborators
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_metrics_updated_at on public.client_metrics;
create trigger set_client_metrics_updated_at
before update on public.client_metrics
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_resources_updated_at on public.client_resources;
create trigger set_client_resources_updated_at
before update on public.client_resources
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_featured_resources_updated_at on public.client_featured_resources;
create trigger set_client_featured_resources_updated_at
before update on public.client_featured_resources
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_sessions_updated_at on public.client_sessions;
create trigger set_client_sessions_updated_at
before update on public.client_sessions
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_session_consultants_updated_at on public.client_session_consultants;
create trigger set_client_session_consultants_updated_at
before update on public.client_session_consultants
for each row
execute function public.set_updated_at();

drop trigger if exists set_client_insights_updated_at on public.client_insights;
create trigger set_client_insights_updated_at
before update on public.client_insights
for each row
execute function public.set_updated_at();

drop trigger if exists set_lead_submissions_updated_at on public.lead_submissions;
create trigger set_lead_submissions_updated_at
before update on public.lead_submissions
for each row
execute function public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

drop trigger if exists set_blog_post_sections_updated_at on public.blog_post_sections;
create trigger set_blog_post_sections_updated_at
before update on public.blog_post_sections
for each row
execute function public.set_updated_at();

-- Helpful indexes
create index if not exists idx_client_contacts_client_id on public.client_contacts(client_id);
create index if not exists idx_client_assignments_client_id on public.client_consultant_assignments(client_id);
create index if not exists idx_client_assignments_consultant_id on public.client_consultant_assignments(consultant_id);
create index if not exists idx_client_navigation_items_client_group_order on public.client_navigation_items(client_id, nav_group, sort_order);
create index if not exists idx_client_programmes_client_id on public.client_programmes(client_id);
create index if not exists idx_client_programmes_client_primary on public.client_programmes(client_id, is_primary);
create index if not exists idx_client_programme_stages_programme_id on public.client_programme_stages(programme_id, sort_order);
create index if not exists idx_client_programme_collaborators_programme_id on public.client_programme_collaborators(programme_id, sort_order);
create index if not exists idx_client_metrics_client_id on public.client_metrics(client_id, sort_order);
create index if not exists idx_client_resources_client_id on public.client_resources(client_id, sort_order);
create index if not exists idx_client_sessions_client_id on public.client_sessions(client_id, starts_at);
create index if not exists idx_client_session_consultants_session_id on public.client_session_consultants(session_id);
create index if not exists idx_client_insights_client_id on public.client_insights(client_id, is_active);
create index if not exists idx_lead_submissions_status on public.lead_submissions(status, created_at desc);
create index if not exists idx_blog_posts_status on public.blog_posts(status, published_at desc nulls last);
create index if not exists idx_blog_post_sections_post_id on public.blog_post_sections(post_id, sort_order);
create index if not exists idx_admin_audit_log_entity on public.admin_audit_log(entity_table, entity_id, created_at desc);

-- Secure all admin-managed tables by default
alter table public.clients enable row level security;
alter table public.client_contacts enable row level security;
alter table public.consultants enable row level security;
alter table public.client_consultant_assignments enable row level security;
alter table public.client_portal_profiles enable row level security;
alter table public.client_navigation_items enable row level security;
alter table public.client_programmes enable row level security;
alter table public.client_programme_stages enable row level security;
alter table public.client_programme_collaborators enable row level security;
alter table public.client_metrics enable row level security;
alter table public.client_resources enable row level security;
alter table public.client_featured_resources enable row level security;
alter table public.client_sessions enable row level security;
alter table public.client_session_consultants enable row level security;
alter table public.client_insights enable row level security;
alter table public.lead_submissions enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_sections enable row level security;
alter table public.admin_audit_log enable row level security;

-- Table comments
comment on table public.clients is
'Core organisation records for the admin portal and client dashboard experience.';

comment on table public.client_contacts is
'Named contacts for each client organisation.';

comment on table public.consultants is
'Internal consultants who can be assigned to clients, sessions, and programmes.';

comment on table public.client_consultant_assignments is
'Relationship table connecting consultants to client accounts.';

comment on table public.client_portal_profiles is
'Client-specific copy and display settings for the portal shell.';

comment on table public.client_navigation_items is
'Editable sidebar and footer navigation items for each client dashboard.';

comment on table public.client_programmes is
'Programmes shown on the client dashboard and managed from the admin portal.';

comment on table public.client_programme_stages is
'Ordered roadmap stages for each client programme.';

comment on table public.client_programme_collaborators is
'Visible collaborator cards or avatars shown on each programme.';

comment on table public.client_metrics is
'Top-level KPI cards for each client dashboard.';

comment on table public.client_resources is
'Knowledge library resources, downloads, and support materials for each client.';

comment on table public.client_featured_resources is
'Single featured case study or highlighted resource for each client dashboard.';

comment on table public.client_sessions is
'Mentoring calendar and delivery sessions for each client.';

comment on table public.client_session_consultants is
'Assignment table linking consultants to client sessions.';

comment on table public.client_insights is
'Insight or recommendation cards shown in the client dashboard sidebar.';

comment on table public.lead_submissions is
'Structured inbound lead data for discovery calls, assessments, and contact enquiries.';

comment on table public.blog_posts is
'Editable blog post records for the public site and admin blog manager.';

comment on table public.blog_post_sections is
'Ordered content blocks belonging to each blog post.';

comment on table public.admin_audit_log is
'Internal audit history of admin-side edits and workflow actions.';
