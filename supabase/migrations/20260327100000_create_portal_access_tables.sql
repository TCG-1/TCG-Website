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

-- Roles, accounts, and access control
create table if not exists public.role_definitions (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('admin', 'client')),
  slug text not null unique,
  label text not null,
  description text,
  permissions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  job_title text,
  avatar_url text,
  phone text,
  status text not null default 'active' check (status in ('active', 'invited', 'suspended', 'archived')),
  last_signed_in_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_account_roles (
  id uuid primary key default gen_random_uuid(),
  admin_account_id uuid not null references public.admin_accounts(id) on delete cascade,
  role_id uuid not null references public.role_definitions(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (admin_account_id, role_id)
);

create table if not exists public.client_accounts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role_title text,
  avatar_url text,
  phone text,
  status text not null default 'invited' check (status in ('invited', 'active', 'suspended', 'archived')),
  last_signed_in_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_account_roles (
  id uuid primary key default gen_random_uuid(),
  client_account_id uuid not null references public.client_accounts(id) on delete cascade,
  role_id uuid not null references public.role_definitions(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (client_account_id, role_id)
);

create table if not exists public.account_preferences (
  id uuid primary key default gen_random_uuid(),
  account_scope text not null check (account_scope in ('admin', 'client')),
  admin_account_id uuid references public.admin_accounts(id) on delete cascade,
  client_account_id uuid references public.client_accounts(id) on delete cascade,
  theme text default 'light',
  timezone text default 'Europe/London',
  locale text default 'en-GB',
  date_format text default 'dd MMM yyyy',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (
    (account_scope = 'admin' and admin_account_id is not null and client_account_id is null)
    or
    (account_scope = 'client' and client_account_id is not null and admin_account_id is null)
  )
);

create table if not exists public.account_security_events (
  id uuid primary key default gen_random_uuid(),
  account_scope text not null check (account_scope in ('admin', 'client')),
  admin_account_id uuid references public.admin_accounts(id) on delete cascade,
  client_account_id uuid references public.client_accounts(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'login_success',
      'login_failed',
      'logout',
      'password_changed',
      'password_reset_requested',
      'password_reset_completed',
      'mfa_enabled',
      'mfa_disabled',
      'account_locked'
    )
  ),
  ip_address inet,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.account_sessions (
  id uuid primary key default gen_random_uuid(),
  account_scope text not null check (account_scope in ('admin', 'client')),
  admin_account_id uuid references public.admin_accounts(id) on delete cascade,
  client_account_id uuid references public.client_accounts(id) on delete cascade,
  session_token_hash text not null,
  session_status text not null default 'active' check (session_status in ('active', 'expired', 'revoked')),
  ip_address inet,
  user_agent text,
  last_seen_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.password_change_requests (
  id uuid primary key default gen_random_uuid(),
  account_scope text not null check (account_scope in ('admin', 'client')),
  admin_account_id uuid references public.admin_accounts(id) on delete cascade,
  client_account_id uuid references public.client_accounts(id) on delete cascade,
  request_status text not null default 'pending' check (request_status in ('pending', 'completed', 'expired', 'cancelled')),
  reset_token_hash text,
  requested_by text,
  expires_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Notifications, announcements, and inbox state
create table if not exists public.notification_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  channel text not null check (channel in ('in_app', 'email', 'sms')),
  subject_template text,
  body_template text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_scope text not null check (recipient_scope in ('admin', 'client')),
  admin_account_id uuid references public.admin_accounts(id) on delete cascade,
  client_account_id uuid references public.client_accounts(id) on delete cascade,
  template_id uuid references public.notification_templates(id) on delete set null,
  title text not null,
  body text not null,
  link_href text,
  delivery_channel text not null default 'in_app' check (delivery_channel in ('in_app', 'email', 'sms')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  is_read boolean not null default false,
  read_at timestamptz,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  account_scope text not null check (account_scope in ('admin', 'client')),
  admin_account_id uuid references public.admin_accounts(id) on delete cascade,
  client_account_id uuid references public.client_accounts(id) on delete cascade,
  preference_key text not null,
  email_enabled boolean not null default true,
  in_app_enabled boolean not null default true,
  sms_enabled boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (account_scope, admin_account_id, client_account_id, preference_key)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  audience_scope text not null check (audience_scope in ('all_admins', 'all_clients', 'client', 'role')),
  client_id uuid references public.clients(id) on delete cascade,
  role_id uuid references public.role_definitions(id) on delete set null,
  title text not null,
  body text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Support, collaboration, and operational workflow
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  client_id uuid references public.clients(id) on delete set null,
  requester_admin_id uuid references public.admin_accounts(id) on delete set null,
  requester_client_account_id uuid references public.client_accounts(id) on delete set null,
  assigned_admin_id uuid references public.admin_accounts(id) on delete set null,
  subject text not null,
  category text not null default 'general' check (
    category in ('general', 'technical', 'training', 'portal_access', 'reporting', 'billing', 'documents')
  ),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  summary text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_scope text not null check (author_scope in ('admin', 'client')),
  admin_account_id uuid references public.admin_accounts(id) on delete set null,
  client_account_id uuid references public.client_accounts(id) on delete set null,
  message_body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.portal_tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  programme_id uuid references public.client_programmes(id) on delete set null,
  created_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  assigned_admin_id uuid references public.admin_accounts(id) on delete set null,
  assigned_client_account_id uuid references public.client_accounts(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'done', 'archived')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.portal_tasks(id) on delete cascade,
  author_scope text not null check (author_scope in ('admin', 'client')),
  admin_account_id uuid references public.admin_accounts(id) on delete set null,
  client_account_id uuid references public.client_accounts(id) on delete set null,
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activity_feed_events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  actor_scope text not null check (actor_scope in ('admin', 'client', 'system')),
  admin_account_id uuid references public.admin_accounts(id) on delete set null,
  client_account_id uuid references public.client_accounts(id) on delete set null,
  event_type text not null,
  title text not null,
  description text,
  entity_table text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saved_views (
  id uuid primary key default gen_random_uuid(),
  owner_scope text not null check (owner_scope in ('admin', 'client')),
  admin_account_id uuid references public.admin_accounts(id) on delete cascade,
  client_account_id uuid references public.client_accounts(id) on delete cascade,
  view_name text not null,
  view_type text not null,
  filters jsonb not null default '{}'::jsonb,
  sort jsonb not null default '{}'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.search_history (
  id uuid primary key default gen_random_uuid(),
  owner_scope text not null check (owner_scope in ('admin', 'client')),
  admin_account_id uuid references public.admin_accounts(id) on delete cascade,
  client_account_id uuid references public.client_accounts(id) on delete cascade,
  query_text text not null,
  context_label text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Documents and sharing
create table if not exists public.document_collections (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text,
  visibility text not null default 'client' check (visibility in ('admin_only', 'client', 'shared')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references public.document_collections(id) on delete set null,
  client_id uuid references public.clients(id) on delete cascade,
  uploaded_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  uploaded_by_client_account_id uuid references public.client_accounts(id) on delete set null,
  title text not null,
  file_name text not null,
  file_path text,
  public_url text,
  mime_type text,
  file_size_bytes bigint,
  document_type text not null default 'general' check (
    document_type in ('general', 'report', 'training', 'assessment', 'proposal', 'invoice', 'resume', 'policy')
  ),
  visibility text not null default 'client' check (visibility in ('admin_only', 'client', 'shared')),
  version_label text,
  is_latest boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.document_access_rules (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  access_scope text not null check (access_scope in ('role', 'admin_account', 'client_account', 'client')),
  role_id uuid references public.role_definitions(id) on delete cascade,
  admin_account_id uuid references public.admin_accounts(id) on delete cascade,
  client_account_id uuid references public.client_accounts(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  can_view boolean not null default true,
  can_download boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.integration_settings (
  id uuid primary key default gen_random_uuid(),
  provider_slug text not null unique,
  label text not null,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'disabled' check (status in ('disabled', 'enabled', 'error')),
  last_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text,
  is_enabled boolean not null default false,
  audience_scope text not null default 'global' check (audience_scope in ('global', 'admin', 'client', 'client_specific')),
  client_id uuid references public.clients(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Triggers
drop trigger if exists set_role_definitions_updated_at on public.role_definitions;
create trigger set_role_definitions_updated_at before update on public.role_definitions for each row execute function public.set_updated_at();

drop trigger if exists set_admin_accounts_updated_at on public.admin_accounts;
create trigger set_admin_accounts_updated_at before update on public.admin_accounts for each row execute function public.set_updated_at();

drop trigger if exists set_admin_account_roles_updated_at on public.admin_account_roles;
create trigger set_admin_account_roles_updated_at before update on public.admin_account_roles for each row execute function public.set_updated_at();

drop trigger if exists set_client_accounts_updated_at on public.client_accounts;
create trigger set_client_accounts_updated_at before update on public.client_accounts for each row execute function public.set_updated_at();

drop trigger if exists set_client_account_roles_updated_at on public.client_account_roles;
create trigger set_client_account_roles_updated_at before update on public.client_account_roles for each row execute function public.set_updated_at();

drop trigger if exists set_account_preferences_updated_at on public.account_preferences;
create trigger set_account_preferences_updated_at before update on public.account_preferences for each row execute function public.set_updated_at();

drop trigger if exists set_account_sessions_updated_at on public.account_sessions;
create trigger set_account_sessions_updated_at before update on public.account_sessions for each row execute function public.set_updated_at();

drop trigger if exists set_password_change_requests_updated_at on public.password_change_requests;
create trigger set_password_change_requests_updated_at before update on public.password_change_requests for each row execute function public.set_updated_at();

drop trigger if exists set_notification_templates_updated_at on public.notification_templates;
create trigger set_notification_templates_updated_at before update on public.notification_templates for each row execute function public.set_updated_at();

drop trigger if exists set_notifications_updated_at on public.notifications;
create trigger set_notifications_updated_at before update on public.notifications for each row execute function public.set_updated_at();

drop trigger if exists set_notification_preferences_updated_at on public.notification_preferences;
create trigger set_notification_preferences_updated_at before update on public.notification_preferences for each row execute function public.set_updated_at();

drop trigger if exists set_announcements_updated_at on public.announcements;
create trigger set_announcements_updated_at before update on public.announcements for each row execute function public.set_updated_at();

drop trigger if exists set_support_tickets_updated_at on public.support_tickets;
create trigger set_support_tickets_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();

drop trigger if exists set_support_ticket_messages_updated_at on public.support_ticket_messages;
create trigger set_support_ticket_messages_updated_at before update on public.support_ticket_messages for each row execute function public.set_updated_at();

drop trigger if exists set_portal_tasks_updated_at on public.portal_tasks;
create trigger set_portal_tasks_updated_at before update on public.portal_tasks for each row execute function public.set_updated_at();

drop trigger if exists set_task_comments_updated_at on public.task_comments;
create trigger set_task_comments_updated_at before update on public.task_comments for each row execute function public.set_updated_at();

drop trigger if exists set_saved_views_updated_at on public.saved_views;
create trigger set_saved_views_updated_at before update on public.saved_views for each row execute function public.set_updated_at();

drop trigger if exists set_document_collections_updated_at on public.document_collections;
create trigger set_document_collections_updated_at before update on public.document_collections for each row execute function public.set_updated_at();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at before update on public.documents for each row execute function public.set_updated_at();

drop trigger if exists set_document_access_rules_updated_at on public.document_access_rules;
create trigger set_document_access_rules_updated_at before update on public.document_access_rules for each row execute function public.set_updated_at();

drop trigger if exists set_integration_settings_updated_at on public.integration_settings;
create trigger set_integration_settings_updated_at before update on public.integration_settings for each row execute function public.set_updated_at();

drop trigger if exists set_feature_flags_updated_at on public.feature_flags;
create trigger set_feature_flags_updated_at before update on public.feature_flags for each row execute function public.set_updated_at();

-- Indexes
create index if not exists idx_admin_accounts_status on public.admin_accounts(status);
create index if not exists idx_client_accounts_client_status on public.client_accounts(client_id, status);
create index if not exists idx_notifications_admin_unread on public.notifications(admin_account_id, is_read, created_at desc);
create index if not exists idx_notifications_client_unread on public.notifications(client_account_id, is_read, created_at desc);
create index if not exists idx_support_tickets_status_priority on public.support_tickets(status, priority, created_at desc);
create index if not exists idx_support_messages_ticket on public.support_ticket_messages(ticket_id, created_at);
create index if not exists idx_portal_tasks_client_status on public.portal_tasks(client_id, status, due_at);
create index if not exists idx_activity_feed_client_created on public.activity_feed_events(client_id, created_at desc);
create index if not exists idx_saved_views_owner on public.saved_views(admin_account_id, client_account_id, view_type);
create index if not exists idx_search_history_owner on public.search_history(admin_account_id, client_account_id, created_at desc);
create index if not exists idx_documents_client_type on public.documents(client_id, document_type, created_at desc);
create index if not exists idx_document_access_document on public.document_access_rules(document_id);
create index if not exists idx_announcements_scope_dates on public.announcements(audience_scope, starts_at, ends_at);
create index if not exists idx_feature_flags_scope on public.feature_flags(audience_scope, is_enabled);

-- Enable RLS on all new portal-access tables
alter table public.role_definitions enable row level security;
alter table public.admin_accounts enable row level security;
alter table public.admin_account_roles enable row level security;
alter table public.client_accounts enable row level security;
alter table public.client_account_roles enable row level security;
alter table public.account_preferences enable row level security;
alter table public.account_security_events enable row level security;
alter table public.account_sessions enable row level security;
alter table public.password_change_requests enable row level security;
alter table public.notification_templates enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.announcements enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;
alter table public.portal_tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.activity_feed_events enable row level security;
alter table public.saved_views enable row level security;
alter table public.search_history enable row level security;
alter table public.document_collections enable row level security;
alter table public.documents enable row level security;
alter table public.document_access_rules enable row level security;
alter table public.integration_settings enable row level security;
alter table public.feature_flags enable row level security;

-- Comments
comment on table public.role_definitions is
'Reusable role definitions and permission bundles for admin and client accounts.';

comment on table public.admin_accounts is
'Database-backed admin profiles for future replacement of env-only admin login.';

comment on table public.admin_account_roles is
'Role assignments for admin accounts.';

comment on table public.client_accounts is
'Client-side portal user accounts for real authenticated client access.';

comment on table public.client_account_roles is
'Role assignments for client portal accounts.';

comment on table public.account_preferences is
'Per-account settings such as theme, timezone, locale, and dashboard preferences.';

comment on table public.account_security_events is
'Security and authentication history such as sign-ins, password changes, and lockouts.';

comment on table public.account_sessions is
'Tracked active and historical sessions for account management.';

comment on table public.password_change_requests is
'Password reset and change workflow records.';

comment on table public.notification_templates is
'Reusable notification templates for email, SMS, and in-app delivery.';

comment on table public.notifications is
'Delivered notifications for admin and client users.';

comment on table public.notification_preferences is
'Per-account notification opt-in settings by preference key.';

comment on table public.announcements is
'Broadcast messages shown to admins, clients, or client-specific audiences.';

comment on table public.support_tickets is
'Support case records for portal access, technical issues, and service requests.';

comment on table public.support_ticket_messages is
'Threaded ticket messages including internal admin-only notes.';

comment on table public.portal_tasks is
'Operational tasks connected to clients, programmes, and delivery workflows.';

comment on table public.task_comments is
'Comments attached to tasks by admin or client users.';

comment on table public.activity_feed_events is
'Unified feed of portal events and important account or client activity.';

comment on table public.saved_views is
'Saved filters and dashboard views for admin and client users.';

comment on table public.search_history is
'Recent searches for quick-return UX in admin and client portals.';

comment on table public.document_collections is
'Named folders or collections for client and admin document organization.';

comment on table public.documents is
'Uploaded documents, reports, proposals, resumes, and shared files.';

comment on table public.document_access_rules is
'Access rules controlling who can view or download a document.';

comment on table public.integration_settings is
'Configuration records for third-party integrations such as calendars, CRM, or email systems.';

comment on table public.feature_flags is
'Switches for rolling out portal features globally or to specific client audiences.';
