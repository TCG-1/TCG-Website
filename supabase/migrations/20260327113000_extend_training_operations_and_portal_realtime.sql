alter table public.client_accounts
  add column if not exists invited_at timestamptz,
  add column if not exists activated_at timestamptz,
  add column if not exists onboarding_completed_at timestamptz;

alter table public.training_assessment_submissions
  add column if not exists evidence_file_name text,
  add column if not exists evidence_file_path text,
  add column if not exists evidence_file_size_bytes bigint,
  add column if not exists evidence_file_mime_type text;

alter table public.training_certificates
  add column if not exists artifact_file_name text,
  add column if not exists artifact_file_path text,
  add column if not exists artifact_mime_type text;

create table if not exists public.training_assessment_submission_events (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.training_assessment_submissions(id) on delete cascade,
  assessment_id uuid not null references public.training_assessments(id) on delete cascade,
  membership_id uuid not null references public.training_cohort_memberships(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'submitted',
      'graded_passed',
      'graded_failed',
      'returned',
      'override_passed',
      'override_failed',
      'assessment_reopened',
      'assessment_closed',
      'attempt_override',
      'evidence_uploaded'
    )
  ),
  actor_scope text not null check (actor_scope in ('admin', 'client', 'system')),
  admin_account_id uuid references public.admin_accounts(id) on delete set null,
  client_account_id uuid references public.client_accounts(id) on delete set null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_reminder_log (
  id uuid primary key default gen_random_uuid(),
  reminder_kind text not null check (
    reminder_kind in (
      'session_upcoming',
      'assessment_due',
      'grading_queue',
      'certificate_ready',
      'certificate_awarded'
    )
  ),
  target_entity_type text not null check (
    target_entity_type in (
      'training_sessions',
      'training_assessments',
      'training_assessment_submissions',
      'training_certificates',
      'training_cohort_memberships'
    )
  ),
  target_entity_id uuid not null,
  recipient_scope text not null check (recipient_scope in ('admin', 'client')),
  recipient_account_id uuid not null,
  reminder_window_key text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (reminder_kind, target_entity_id, recipient_scope, recipient_account_id, reminder_window_key)
);

drop trigger if exists set_training_assessment_submission_events_updated_at on public.training_assessment_submission_events;
create trigger set_training_assessment_submission_events_updated_at
before update on public.training_assessment_submission_events
for each row execute function public.set_updated_at();

drop trigger if exists set_training_reminder_log_updated_at on public.training_reminder_log;
create trigger set_training_reminder_log_updated_at
before update on public.training_reminder_log
for each row execute function public.set_updated_at();

create index if not exists idx_training_submission_events_submission_created
  on public.training_assessment_submission_events(submission_id, created_at desc);

create index if not exists idx_training_reminder_log_lookup
  on public.training_reminder_log(reminder_kind, target_entity_id, recipient_scope, recipient_account_id, reminder_window_key);

alter table public.training_assessment_submission_events enable row level security;
alter table public.training_reminder_log enable row level security;

drop policy if exists "training_assessment_submission_events_select" on public.training_assessment_submission_events;
create policy "training_assessment_submission_events_select"
on public.training_assessment_submission_events
for select
to authenticated
using (public.can_access_training_membership(membership_id));

drop policy if exists "training_reminder_log_select" on public.training_reminder_log;
create policy "training_reminder_log_select"
on public.training_reminder_log
for select
to authenticated
using (public.current_admin_account_id() is not null);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'training-evidence',
  'training-evidence',
  false,
  10485760,
  array['application/pdf', 'image/png', 'image/jpeg', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'training-certificates',
  'training-certificates',
  false,
  5242880,
  array['text/html']
)
on conflict (id) do nothing;

drop policy if exists "support_tickets_select" on public.support_tickets;
create policy "support_tickets_select"
on public.support_tickets
for select
to authenticated
using (
  public.current_admin_account_id() is not null
  or client_id = public.current_client_id()
);

drop policy if exists "support_ticket_messages_select" on public.support_ticket_messages;
create policy "support_ticket_messages_select"
on public.support_ticket_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.support_tickets ticket
    where ticket.id = support_ticket_messages.ticket_id
      and (
        public.current_admin_account_id() is not null
        or ticket.client_id = public.current_client_id()
      )
  )
);

drop policy if exists "document_collections_select" on public.document_collections;
create policy "document_collections_select"
on public.document_collections
for select
to authenticated
using (
  public.current_admin_account_id() is not null
  or (client_id = public.current_client_id() and visibility in ('client', 'shared'))
  or (client_id is null and visibility = 'shared')
);

drop policy if exists "documents_select" on public.documents;
create policy "documents_select"
on public.documents
for select
to authenticated
using (
  public.current_admin_account_id() is not null
  or (client_id = public.current_client_id() and visibility in ('client', 'shared'))
  or (client_id is null and visibility = 'shared')
);

do $$
declare
  table_name text;
begin
  foreach table_name in array ARRAY[
    'support_tickets',
    'support_ticket_messages',
    'document_collections',
    'documents',
    'training_assessment_submission_events'
  ]
  loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end
$$;

comment on table public.training_assessment_submission_events is
'Operational event history for learner submissions, grading decisions, overrides, and reopen actions.';

comment on table public.training_reminder_log is
'Deduplicated log of automated training reminders sent to admins or client users.';
