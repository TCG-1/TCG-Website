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

alter table public.admin_accounts
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

alter table public.client_accounts
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

create unique index if not exists idx_admin_accounts_auth_user_id
  on public.admin_accounts(auth_user_id)
  where auth_user_id is not null;

create unique index if not exists idx_client_accounts_auth_user_id
  on public.client_accounts(auth_user_id)
  where auth_user_id is not null;

insert into public.role_definitions (scope, slug, label, description, permissions)
values
  (
    'admin',
    'admin_owner',
    'Admin Owner',
    'Full control of training delivery, access, reporting, and operational governance.',
    '[
      "training.programmes.manage",
      "training.sessions.manage",
      "training.learners.manage",
      "training.assessments.manage",
      "training.resources.manage",
      "training.progress.view_all",
      "training.reporting.export",
      "portal.notifications.manage",
      "portal.support.manage",
      "portal.documents.manage"
    ]'::jsonb
  ),
  (
    'admin',
    'trainer',
    'Trainer',
    'Delivers sessions, captures attendance, grades evidence, and supports learners.',
    '[
      "training.programmes.view_assigned",
      "training.sessions.manage_assigned",
      "training.learners.view_assigned",
      "training.assessments.grade_assigned",
      "training.resources.manage_assigned",
      "training.progress.view_assigned"
    ]'::jsonb
  ),
  (
    'client',
    'client_manager',
    'Client Manager',
    'Owns cohort readiness, team participation, sponsor visibility, and training outcomes.',
    '[
      "training.dashboard.view_team",
      "training.sessions.view_team",
      "training.learners.view_team",
      "training.assessments.view_team",
      "training.resources.view_manager",
      "training.progress.view_team",
      "training.support.raise"
    ]'::jsonb
  ),
  (
    'client',
    'learner',
    'Learner',
    'Completes prework, attends sessions, submits assessments, and tracks progress.',
    '[
      "training.dashboard.view_self",
      "training.sessions.view_self",
      "training.assessments.submit_self",
      "training.resources.view_self",
      "training.progress.view_self",
      "training.support.raise"
    ]'::jsonb
  )
on conflict (slug) do update
set
  label = excluded.label,
  description = excluded.description,
  permissions = excluded.permissions,
  updated_at = timezone('utc', now());

create table if not exists public.training_programmes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  summary text not null,
  target_audience text,
  certificate_title text,
  duration_weeks integer,
  delivery_format text not null default 'onsite' check (delivery_format in ('onsite', 'virtual', 'hybrid')),
  status text not null default 'live' check (status in ('draft', 'live', 'archived')),
  created_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  updated_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_programme_modules (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.training_programmes(id) on delete cascade,
  slug text not null,
  title text not null,
  phase text not null,
  summary text not null,
  duration_label text not null,
  delivery_type text not null default 'workshop' check (delivery_type in ('workshop', 'coaching', 'assessment', 'self_study')),
  release_rule text,
  required_for_completion boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (programme_id, slug)
);

create table if not exists public.training_module_outcomes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.training_programme_modules(id) on delete cascade,
  outcome_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_cohorts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  programme_id uuid not null references public.training_programmes(id) on delete restrict,
  title text not null,
  code text not null unique,
  sponsor_name text,
  sponsor_email text,
  primary_client_manager_id uuid references public.client_accounts(id) on delete set null,
  primary_trainer_admin_id uuid references public.admin_accounts(id) on delete set null,
  status text not null default 'scheduled' check (status in ('draft', 'scheduled', 'active', 'paused', 'completed', 'archived')),
  delivery_mode text not null default 'onsite' check (delivery_mode in ('onsite', 'virtual', 'hybrid')),
  timezone text not null default 'Europe/London',
  starts_on date,
  ends_on date,
  target_pass_rate numeric(5,2) not null default 85 check (target_pass_rate >= 0 and target_pass_rate <= 100),
  notes text,
  created_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  updated_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_cohort_trainers (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.training_cohorts(id) on delete cascade,
  admin_account_id uuid not null references public.admin_accounts(id) on delete cascade,
  role_label text not null default 'Lead trainer',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (cohort_id, admin_account_id)
);

create table if not exists public.training_cohort_memberships (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.training_cohorts(id) on delete cascade,
  client_account_id uuid not null references public.client_accounts(id) on delete cascade,
  role_slug text not null check (role_slug in ('client_manager', 'learner')),
  enrollment_status text not null default 'active' check (enrollment_status in ('invited', 'active', 'completed', 'withdrawn', 'paused')),
  attendance_target numeric(5,2) not null default 90 check (attendance_target >= 0 and attendance_target <= 100),
  assessment_target numeric(5,2) not null default 80 check (assessment_target >= 0 and assessment_target <= 100),
  confidence_baseline numeric(5,2) check (confidence_baseline >= 0 and confidence_baseline <= 100),
  confidence_current numeric(5,2) check (confidence_current >= 0 and confidence_current <= 100),
  certification_status text not null default 'not_started' check (
    certification_status in ('not_started', 'in_progress', 'ready_for_review', 'awarded', 'not_awarded')
  ),
  joined_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (cohort_id, client_account_id)
);

create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.training_cohorts(id) on delete cascade,
  module_id uuid references public.training_programme_modules(id) on delete set null,
  title text not null,
  summary text,
  session_type text not null default 'workshop' check (session_type in ('workshop', 'coaching', 'office_hours', 'assessment', 'review')),
  status text not null default 'scheduled' check (status in ('draft', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  delivery_mode text not null default 'onsite' check (delivery_mode in ('onsite', 'virtual', 'hybrid')),
  starts_at timestamptz,
  ends_at timestamptz,
  location_label text,
  virtual_link text,
  readiness_status text not null default 'not_ready' check (
    readiness_status in ('not_ready', 'materials_pending', 'ready', 'at_risk', 'completed')
  ),
  facilitator_notes text,
  follow_up_actions text,
  created_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  updated_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_session_prework_items (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  title text not null,
  description text,
  is_required boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_session_prework_status (
  id uuid primary key default gen_random_uuid(),
  prework_item_id uuid not null references public.training_session_prework_items(id) on delete cascade,
  membership_id uuid not null references public.training_cohort_memberships(id) on delete cascade,
  status text not null default 'todo' check (status in ('todo', 'done', 'approved')),
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (prework_item_id, membership_id)
);

create table if not exists public.training_session_attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  membership_id uuid not null references public.training_cohort_memberships(id) on delete cascade,
  attendance_status text not null default 'expected' check (attendance_status in ('expected', 'attended', 'late', 'excused', 'missed')),
  check_in_at timestamptz,
  check_out_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (session_id, membership_id)
);

create table if not exists public.training_assessments (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.training_cohorts(id) on delete cascade,
  module_id uuid references public.training_programme_modules(id) on delete set null,
  title text not null,
  summary text,
  instructions text,
  assessment_type text not null default 'quiz' check (assessment_type in ('quiz', 'practical', 'exam', 'reflection')),
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'open', 'closed', 'graded', 'archived')),
  grading_mode text not null default 'manual' check (grading_mode in ('manual', 'automatic', 'blended')),
  release_at timestamptz,
  due_at timestamptz,
  max_score numeric(6,2),
  pass_score numeric(6,2),
  max_attempts integer not null default 1,
  created_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  updated_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.training_assessments(id) on delete cascade,
  membership_id uuid not null references public.training_cohort_memberships(id) on delete cascade,
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'submitted', 'returned', 'passed', 'failed')
  ),
  submission_text text,
  evidence_link text,
  attempt_count integer not null default 0,
  score numeric(6,2),
  feedback text,
  submitted_at timestamptz,
  graded_at timestamptz,
  graded_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (assessment_id, membership_id)
);

create table if not exists public.training_resources (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references public.training_cohorts(id) on delete cascade,
  programme_id uuid references public.training_programmes(id) on delete cascade,
  module_id uuid references public.training_programme_modules(id) on delete set null,
  document_id uuid references public.documents(id) on delete set null,
  title text not null,
  summary text,
  resource_kind text not null default 'workbook' check (
    resource_kind in ('prework', 'workbook', 'template', 'revision_guide', 'recording', 'facilitator_pack', 'manager_pack')
  ),
  audience_role_slug text not null default 'all' check (audience_role_slug in ('trainer', 'client_manager', 'learner', 'all')),
  status text not null default 'released' check (status in ('draft', 'released', 'archived')),
  delivery_channel text not null default 'link' check (delivery_channel in ('link', 'document', 'embed')),
  href text,
  version_label text,
  estimated_minutes integer,
  sort_order integer not null default 0,
  visible_from timestamptz,
  created_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  updated_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null unique references public.training_cohort_memberships(id) on delete cascade,
  completion_percentage numeric(5,2) not null default 0 check (completion_percentage >= 0 and completion_percentage <= 100),
  attendance_percentage numeric(5,2) not null default 0 check (attendance_percentage >= 0 and attendance_percentage <= 100),
  average_score numeric(5,2) not null default 0 check (average_score >= 0 and average_score <= 100),
  overdue_assessments_count integer not null default 0,
  overdue_prework_count integer not null default 0,
  readiness_status text not null default 'green' check (readiness_status in ('green', 'amber', 'red', 'completed')),
  last_calculated_at timestamptz not null default timezone('utc', now()),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.current_admin_account_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.admin_accounts
  where auth_user_id = auth.uid()
    and status in ('active', 'invited')
  limit 1;
$$;

create or replace function public.current_client_account_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.client_accounts
  where auth_user_id = auth.uid()
    and status in ('active', 'invited')
  limit 1;
$$;

create or replace function public.current_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select client_id
  from public.client_accounts
  where auth_user_id = auth.uid()
    and status in ('active', 'invited')
  limit 1;
$$;

create or replace function public.has_admin_role(role_slugs text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_accounts aa
    join public.admin_account_roles aar on aar.admin_account_id = aa.id
    join public.role_definitions rd on rd.id = aar.role_id
    where aa.auth_user_id = auth.uid()
      and aa.status in ('active', 'invited')
      and rd.slug = any(role_slugs)
  );
$$;

create or replace function public.has_client_role(role_slugs text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.client_accounts ca
    join public.client_account_roles car on car.client_account_id = ca.id
    join public.role_definitions rd on rd.id = car.role_id
    where ca.auth_user_id = auth.uid()
      and ca.status in ('active', 'invited')
      and rd.slug = any(role_slugs)
  );
$$;

create or replace function public.can_access_training_cohort(target_cohort_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.has_admin_role(array['admin_owner', 'trainer'])
    or exists (
      select 1
      from public.training_cohort_memberships membership
      join public.client_accounts account on account.id = membership.client_account_id
      where membership.cohort_id = target_cohort_id
        and account.auth_user_id = auth.uid()
        and membership.enrollment_status in ('active', 'completed')
    )
    or exists (
      select 1
      from public.training_cohorts cohort
      join public.client_accounts account on account.client_id = cohort.client_id
      join public.client_account_roles assignment on assignment.client_account_id = account.id
      join public.role_definitions role_definition on role_definition.id = assignment.role_id
      where cohort.id = target_cohort_id
        and account.auth_user_id = auth.uid()
        and role_definition.slug = 'client_manager'
        and account.status in ('active', 'invited')
    );
$$;

create or replace function public.can_access_training_membership(target_membership_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.has_admin_role(array['admin_owner', 'trainer'])
    or exists (
      select 1
      from public.training_cohort_memberships membership
      join public.client_accounts account on account.id = membership.client_account_id
      where membership.id = target_membership_id
        and account.auth_user_id = auth.uid()
    )
    or exists (
      select 1
      from public.training_cohort_memberships membership
      join public.training_cohorts cohort on cohort.id = membership.cohort_id
      join public.client_accounts account on account.client_id = cohort.client_id
      join public.client_account_roles assignment on assignment.client_account_id = account.id
      join public.role_definitions role_definition on role_definition.id = assignment.role_id
      where membership.id = target_membership_id
        and account.auth_user_id = auth.uid()
        and role_definition.slug = 'client_manager'
        and account.status in ('active', 'invited')
    );
$$;

create or replace function public.can_access_training_resource(
  target_cohort_id uuid,
  target_programme_id uuid,
  target_audience_role_slug text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.has_admin_role(array['admin_owner', 'trainer'])
    or (
      target_cohort_id is not null
      and public.can_access_training_cohort(target_cohort_id)
      and (
        target_audience_role_slug = 'all'
        or target_audience_role_slug = 'learner'
        or (
          target_audience_role_slug = 'client_manager'
          and public.has_client_role(array['client_manager'])
        )
      )
    )
    or (
      target_cohort_id is null
      and target_programme_id is not null
      and exists (
        select 1
        from public.training_cohorts cohort
        where cohort.programme_id = target_programme_id
          and public.can_access_training_cohort(cohort.id)
      )
    );
$$;

create or replace function public.refresh_training_membership_progress(target_membership_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  membership_record public.training_cohort_memberships%rowtype;
  total_sessions integer := 0;
  present_sessions integer := 0;
  total_assessments integer := 0;
  submitted_assessments integer := 0;
  average_score numeric(5,2) := 0;
  overdue_assessments integer := 0;
  overdue_prework integer := 0;
  completion_percentage numeric(5,2) := 0;
  attendance_percentage numeric(5,2) := 0;
  readiness_status text := 'green';
begin
  select *
  into membership_record
  from public.training_cohort_memberships
  where id = target_membership_id;

  if not found then
    delete from public.training_progress_snapshots where membership_id = target_membership_id;
    return;
  end if;

  select count(*)
  into total_sessions
  from public.training_sessions session
  where session.cohort_id = membership_record.cohort_id
    and session.status in ('scheduled', 'in_progress', 'completed');

  select count(*)
  into present_sessions
  from public.training_session_attendance attendance
  join public.training_sessions session on session.id = attendance.session_id
  where attendance.membership_id = membership_record.id
    and attendance.attendance_status in ('attended', 'late')
    and session.status in ('scheduled', 'in_progress', 'completed');

  select count(*)
  into total_assessments
  from public.training_assessments assessment
  where assessment.cohort_id = membership_record.cohort_id
    and assessment.status in ('scheduled', 'open', 'closed', 'graded');

  select count(*)
  into submitted_assessments
  from public.training_assessment_submissions submission
  join public.training_assessments assessment on assessment.id = submission.assessment_id
  where submission.membership_id = membership_record.id
    and submission.status in ('submitted', 'returned', 'passed', 'failed')
    and assessment.status in ('scheduled', 'open', 'closed', 'graded');

  select coalesce(round(avg(submission.score)::numeric, 2), 0)
  into average_score
  from public.training_assessment_submissions submission
  where submission.membership_id = membership_record.id
    and submission.score is not null;

  select count(*)
  into overdue_assessments
  from public.training_assessments assessment
  left join public.training_assessment_submissions submission
    on submission.assessment_id = assessment.id
   and submission.membership_id = membership_record.id
  where assessment.cohort_id = membership_record.cohort_id
    and assessment.due_at is not null
    and assessment.due_at < timezone('utc', now())
    and assessment.status in ('open', 'closed', 'graded')
    and (submission.id is null or submission.status in ('not_started', 'in_progress'));

  select count(*)
  into overdue_prework
  from public.training_session_prework_items prework
  join public.training_sessions session on session.id = prework.session_id
  left join public.training_session_prework_status status
    on status.prework_item_id = prework.id
   and status.membership_id = membership_record.id
  where session.cohort_id = membership_record.cohort_id
    and prework.is_required = true
    and session.starts_at is not null
    and session.starts_at < timezone('utc', now())
    and (status.id is null or status.status = 'todo');

  attendance_percentage :=
    case
      when total_sessions = 0 then 0
      else round((present_sessions::numeric / total_sessions::numeric) * 100, 2)
    end;

  completion_percentage :=
    case
      when (total_sessions + total_assessments) = 0 then 0
      else round((((present_sessions + submitted_assessments)::numeric) / ((total_sessions + total_assessments)::numeric)) * 100, 2)
    end;

  readiness_status :=
    case
      when membership_record.enrollment_status = 'completed' or membership_record.certification_status = 'awarded' then 'completed'
      when overdue_assessments > 0 or overdue_prework > 1 or attendance_percentage < 70 then 'red'
      when overdue_prework > 0 or attendance_percentage < membership_record.attendance_target or average_score < membership_record.assessment_target then 'amber'
      else 'green'
    end;

  insert into public.training_progress_snapshots (
    membership_id,
    completion_percentage,
    attendance_percentage,
    average_score,
    overdue_assessments_count,
    overdue_prework_count,
    readiness_status,
    last_calculated_at,
    notes
  )
  values (
    membership_record.id,
    completion_percentage,
    attendance_percentage,
    average_score,
    overdue_assessments,
    overdue_prework,
    readiness_status,
    timezone('utc', now()),
    case
      when readiness_status = 'red' then 'Needs intervention across attendance, overdue work, or readiness blockers.'
      when readiness_status = 'amber' then 'Monitor closely and coach before the next training milestone.'
      when readiness_status = 'completed' then 'Training journey complete or certification awarded.'
      else 'On track for the next training milestone.'
    end
  )
  on conflict (membership_id) do update
  set
    completion_percentage = excluded.completion_percentage,
    attendance_percentage = excluded.attendance_percentage,
    average_score = excluded.average_score,
    overdue_assessments_count = excluded.overdue_assessments_count,
    overdue_prework_count = excluded.overdue_prework_count,
    readiness_status = excluded.readiness_status,
    last_calculated_at = excluded.last_calculated_at,
    notes = excluded.notes,
    updated_at = timezone('utc', now());
end;
$$;

create or replace function public.refresh_training_progress_for_cohort(target_cohort_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  membership_record record;
begin
  for membership_record in
    select id
    from public.training_cohort_memberships
    where cohort_id = target_cohort_id
  loop
    perform public.refresh_training_membership_progress(membership_record.id);
  end loop;
end;
$$;

create or replace function public.handle_training_membership_progress_refresh()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_membership_id uuid;
begin
  if tg_table_name = 'training_cohort_memberships' then
    target_membership_id := coalesce(new.id, old.id);
  else
    target_membership_id := coalesce(new.membership_id, old.membership_id);
  end if;

  if target_membership_id is not null then
    perform public.refresh_training_membership_progress(target_membership_id);
  end if;

  return coalesce(new, old);
end;
$$;

create or replace function public.handle_training_cohort_progress_refresh()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_cohort_id uuid;
begin
  target_cohort_id := coalesce(new.cohort_id, old.cohort_id);

  if target_cohort_id is not null then
    perform public.refresh_training_progress_for_cohort(target_cohort_id);
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists set_training_programmes_updated_at on public.training_programmes;
create trigger set_training_programmes_updated_at before update on public.training_programmes for each row execute function public.set_updated_at();

drop trigger if exists set_training_programme_modules_updated_at on public.training_programme_modules;
create trigger set_training_programme_modules_updated_at before update on public.training_programme_modules for each row execute function public.set_updated_at();

drop trigger if exists set_training_module_outcomes_updated_at on public.training_module_outcomes;
create trigger set_training_module_outcomes_updated_at before update on public.training_module_outcomes for each row execute function public.set_updated_at();

drop trigger if exists set_training_cohorts_updated_at on public.training_cohorts;
create trigger set_training_cohorts_updated_at before update on public.training_cohorts for each row execute function public.set_updated_at();

drop trigger if exists set_training_cohort_trainers_updated_at on public.training_cohort_trainers;
create trigger set_training_cohort_trainers_updated_at before update on public.training_cohort_trainers for each row execute function public.set_updated_at();

drop trigger if exists set_training_cohort_memberships_updated_at on public.training_cohort_memberships;
create trigger set_training_cohort_memberships_updated_at before update on public.training_cohort_memberships for each row execute function public.set_updated_at();

drop trigger if exists set_training_sessions_updated_at on public.training_sessions;
create trigger set_training_sessions_updated_at before update on public.training_sessions for each row execute function public.set_updated_at();

drop trigger if exists set_training_session_prework_items_updated_at on public.training_session_prework_items;
create trigger set_training_session_prework_items_updated_at before update on public.training_session_prework_items for each row execute function public.set_updated_at();

drop trigger if exists set_training_session_prework_status_updated_at on public.training_session_prework_status;
create trigger set_training_session_prework_status_updated_at before update on public.training_session_prework_status for each row execute function public.set_updated_at();

drop trigger if exists set_training_session_attendance_updated_at on public.training_session_attendance;
create trigger set_training_session_attendance_updated_at before update on public.training_session_attendance for each row execute function public.set_updated_at();

drop trigger if exists set_training_assessments_updated_at on public.training_assessments;
create trigger set_training_assessments_updated_at before update on public.training_assessments for each row execute function public.set_updated_at();

drop trigger if exists set_training_assessment_submissions_updated_at on public.training_assessment_submissions;
create trigger set_training_assessment_submissions_updated_at before update on public.training_assessment_submissions for each row execute function public.set_updated_at();

drop trigger if exists set_training_resources_updated_at on public.training_resources;
create trigger set_training_resources_updated_at before update on public.training_resources for each row execute function public.set_updated_at();

drop trigger if exists set_training_progress_snapshots_updated_at on public.training_progress_snapshots;
create trigger set_training_progress_snapshots_updated_at before update on public.training_progress_snapshots for each row execute function public.set_updated_at();

drop trigger if exists refresh_training_progress_from_membership on public.training_cohort_memberships;
create trigger refresh_training_progress_from_membership
after insert or update or delete on public.training_cohort_memberships
for each row execute function public.handle_training_membership_progress_refresh();

drop trigger if exists refresh_training_progress_from_attendance on public.training_session_attendance;
create trigger refresh_training_progress_from_attendance
after insert or update or delete on public.training_session_attendance
for each row execute function public.handle_training_membership_progress_refresh();

drop trigger if exists refresh_training_progress_from_prework_status on public.training_session_prework_status;
create trigger refresh_training_progress_from_prework_status
after insert or update or delete on public.training_session_prework_status
for each row execute function public.handle_training_membership_progress_refresh();

drop trigger if exists refresh_training_progress_from_submission on public.training_assessment_submissions;
create trigger refresh_training_progress_from_submission
after insert or update or delete on public.training_assessment_submissions
for each row execute function public.handle_training_membership_progress_refresh();

drop trigger if exists refresh_training_progress_from_session on public.training_sessions;
create trigger refresh_training_progress_from_session
after insert or update or delete on public.training_sessions
for each row execute function public.handle_training_cohort_progress_refresh();

drop trigger if exists refresh_training_progress_from_assessment on public.training_assessments;
create trigger refresh_training_progress_from_assessment
after insert or update or delete on public.training_assessments
for each row execute function public.handle_training_cohort_progress_refresh();

-- Indexes
create index if not exists idx_training_programmes_status on public.training_programmes(status);
create index if not exists idx_training_modules_programme_sort on public.training_programme_modules(programme_id, sort_order);
create index if not exists idx_training_cohorts_client_status on public.training_cohorts(client_id, status, starts_on desc);
create index if not exists idx_training_cohorts_manager on public.training_cohorts(primary_client_manager_id);
create index if not exists idx_training_memberships_account on public.training_cohort_memberships(client_account_id, enrollment_status);
create index if not exists idx_training_memberships_cohort_role on public.training_cohort_memberships(cohort_id, role_slug, enrollment_status);
create index if not exists idx_training_sessions_cohort_start on public.training_sessions(cohort_id, starts_at);
create index if not exists idx_training_sessions_status on public.training_sessions(status, readiness_status);
create index if not exists idx_training_attendance_membership on public.training_session_attendance(membership_id, attendance_status);
create index if not exists idx_training_assessments_cohort_due on public.training_assessments(cohort_id, due_at);
create index if not exists idx_training_submissions_membership on public.training_assessment_submissions(membership_id, status);
create index if not exists idx_training_resources_scope on public.training_resources(cohort_id, programme_id, module_id, audience_role_slug);
create index if not exists idx_training_progress_membership on public.training_progress_snapshots(membership_id, readiness_status);

-- Enable RLS for realtime-safe reads.
alter table public.training_programmes enable row level security;
alter table public.training_programme_modules enable row level security;
alter table public.training_module_outcomes enable row level security;
alter table public.training_cohorts enable row level security;
alter table public.training_cohort_trainers enable row level security;
alter table public.training_cohort_memberships enable row level security;
alter table public.training_sessions enable row level security;
alter table public.training_session_prework_items enable row level security;
alter table public.training_session_prework_status enable row level security;
alter table public.training_session_attendance enable row level security;
alter table public.training_assessments enable row level security;
alter table public.training_assessment_submissions enable row level security;
alter table public.training_resources enable row level security;
alter table public.training_progress_snapshots enable row level security;

drop policy if exists "training_programmes_select" on public.training_programmes;
create policy "training_programmes_select"
on public.training_programmes
for select
to authenticated
using (public.current_admin_account_id() is not null or public.current_client_account_id() is not null);

drop policy if exists "training_programme_modules_select" on public.training_programme_modules;
create policy "training_programme_modules_select"
on public.training_programme_modules
for select
to authenticated
using (public.current_admin_account_id() is not null or public.current_client_account_id() is not null);

drop policy if exists "training_module_outcomes_select" on public.training_module_outcomes;
create policy "training_module_outcomes_select"
on public.training_module_outcomes
for select
to authenticated
using (public.current_admin_account_id() is not null or public.current_client_account_id() is not null);

drop policy if exists "training_cohorts_select" on public.training_cohorts;
create policy "training_cohorts_select"
on public.training_cohorts
for select
to authenticated
using (public.can_access_training_cohort(id));

drop policy if exists "training_cohort_trainers_select" on public.training_cohort_trainers;
create policy "training_cohort_trainers_select"
on public.training_cohort_trainers
for select
to authenticated
using (public.can_access_training_cohort(cohort_id));

drop policy if exists "training_cohort_memberships_select" on public.training_cohort_memberships;
create policy "training_cohort_memberships_select"
on public.training_cohort_memberships
for select
to authenticated
using (public.can_access_training_membership(id));

drop policy if exists "training_sessions_select" on public.training_sessions;
create policy "training_sessions_select"
on public.training_sessions
for select
to authenticated
using (public.can_access_training_cohort(cohort_id));

drop policy if exists "training_session_prework_items_select" on public.training_session_prework_items;
create policy "training_session_prework_items_select"
on public.training_session_prework_items
for select
to authenticated
using (
  exists (
    select 1
    from public.training_sessions session
    where session.id = session_id
      and public.can_access_training_cohort(session.cohort_id)
  )
);

drop policy if exists "training_session_prework_status_select" on public.training_session_prework_status;
create policy "training_session_prework_status_select"
on public.training_session_prework_status
for select
to authenticated
using (public.can_access_training_membership(membership_id));

drop policy if exists "training_session_attendance_select" on public.training_session_attendance;
create policy "training_session_attendance_select"
on public.training_session_attendance
for select
to authenticated
using (public.can_access_training_membership(membership_id));

drop policy if exists "training_assessments_select" on public.training_assessments;
create policy "training_assessments_select"
on public.training_assessments
for select
to authenticated
using (public.can_access_training_cohort(cohort_id));

drop policy if exists "training_assessment_submissions_select" on public.training_assessment_submissions;
create policy "training_assessment_submissions_select"
on public.training_assessment_submissions
for select
to authenticated
using (public.can_access_training_membership(membership_id));

drop policy if exists "training_assessment_submissions_manage_own" on public.training_assessment_submissions;
create policy "training_assessment_submissions_manage_own"
on public.training_assessment_submissions
for all
to authenticated
using (
  public.has_admin_role(array['admin_owner', 'trainer'])
  or exists (
    select 1
    from public.training_cohort_memberships membership
    join public.client_accounts account on account.id = membership.client_account_id
    where membership.id = membership_id
      and account.auth_user_id = auth.uid()
  )
)
with check (
  public.has_admin_role(array['admin_owner', 'trainer'])
  or exists (
    select 1
    from public.training_cohort_memberships membership
    join public.client_accounts account on account.id = membership.client_account_id
    where membership.id = membership_id
      and account.auth_user_id = auth.uid()
  )
);

drop policy if exists "training_resources_select" on public.training_resources;
create policy "training_resources_select"
on public.training_resources
for select
to authenticated
using (public.can_access_training_resource(cohort_id, programme_id, audience_role_slug));

drop policy if exists "training_progress_snapshots_select" on public.training_progress_snapshots;
create policy "training_progress_snapshots_select"
on public.training_progress_snapshots
for select
to authenticated
using (public.can_access_training_membership(membership_id));

-- Realtime publication
do $$
declare
  table_name text;
begin
  foreach table_name in array ARRAY[
    'training_programmes',
    'training_programme_modules',
    'training_module_outcomes',
    'training_cohorts',
    'training_cohort_trainers',
    'training_cohort_memberships',
    'training_sessions',
    'training_session_prework_items',
    'training_session_prework_status',
    'training_session_attendance',
    'training_assessments',
    'training_assessment_submissions',
    'training_resources',
    'training_progress_snapshots'
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

-- Seed one canonical Lean programme template.
insert into public.training_programmes (
  slug,
  title,
  subtitle,
  summary,
  target_audience,
  certificate_title,
  duration_weeks,
  delivery_format,
  status
)
values (
  'lean-fundamentals-practitioner',
  'Lean Fundamentals Practitioner Programme',
  'People-first Lean capability building for front-line teams through leaders',
  'Structured Lean training that combines live workshops, applied practice, coaching, assessments, and on-site implementation support.',
  'Front-line teams, team leaders, sponsors, and operational managers',
  'Lean Fundamentals Practitioner',
  8,
  'onsite',
  'live'
)
on conflict (slug) do update
set
  title = excluded.title,
  subtitle = excluded.subtitle,
  summary = excluded.summary,
  target_audience = excluded.target_audience,
  certificate_title = excluded.certificate_title,
  duration_weeks = excluded.duration_weeks,
  delivery_format = excluded.delivery_format,
  status = excluded.status,
  updated_at = timezone('utc', now());

with programme as (
  select id
  from public.training_programmes
  where slug = 'lean-fundamentals-practitioner'
),
module_values as (
  select *
  from (
    values
      ('lean-principles-and-waste', 'Lean Principles & Waste', 'Foundation', 'Establish people-first Lean principles, waste awareness, and the case for capability building.', 'Half day workshop', 'workshop', 1),
      ('value-stream-mapping', 'Value Stream Mapping', 'Analysis', 'Map the current state, see delays and rework, and frame a practical future state.', 'Full day practical session', 'workshop', 2),
      ('visual-management-and-5s', 'Visual Management & 5S', 'Control', 'Create visible standards and workplace conditions that protect flow and expose abnormality.', 'Half day workshop + field exercise', 'workshop', 3),
      ('standard-work', 'Standard Work', 'Stability', 'Build repeatable sequence, quality points, and escalation rules into daily work.', 'Half day workshop + on-floor coaching', 'workshop', 4),
      ('structured-problem-solving', 'Structured Problem Solving', 'Capability', 'Coach teams to move from symptoms to causes and evidence-led countermeasures.', 'Full day simulation and case review', 'assessment', 5)
  ) as item(slug, title, phase, summary, duration_label, delivery_type, sort_order)
)
insert into public.training_programme_modules (
  programme_id,
  slug,
  title,
  phase,
  summary,
  duration_label,
  delivery_type,
  sort_order
)
select
  programme.id,
  module_values.slug,
  module_values.title,
  module_values.phase,
  module_values.summary,
  module_values.duration_label,
  module_values.delivery_type,
  module_values.sort_order
from programme
cross join module_values
on conflict (programme_id, slug) do update
set
  title = excluded.title,
  phase = excluded.phase,
  summary = excluded.summary,
  duration_label = excluded.duration_label,
  delivery_type = excluded.delivery_type,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now());

with outcomes as (
  select *
  from (
    values
      ('lean-principles-and-waste', 1, 'Understand the eight wastes in the context of the real process.'),
      ('lean-principles-and-waste', 2, 'Frame Lean as redeployment and capability growth rather than headcount reduction.'),
      ('value-stream-mapping', 1, 'Capture current-state flow across people, information, and material.'),
      ('value-stream-mapping', 2, 'Identify delay, rework, and handoff problems worth attacking first.'),
      ('visual-management-and-5s', 1, 'Create visual cues and workplace conditions that support stability.'),
      ('visual-management-and-5s', 2, 'Connect 5S and visual management to daily leadership routines.'),
      ('standard-work', 1, 'Define best-known sequence, timing, and critical quality points.'),
      ('standard-work', 2, 'Protect the standard while coaching teams to improve it.'),
      ('structured-problem-solving', 1, 'Move from issue statement to root cause and countermeasure using evidence.'),
      ('structured-problem-solving', 2, 'Demonstrate applied improvement thinking in the learner’s own environment.')
  ) as item(module_slug, sort_order, outcome_text)
)
insert into public.training_module_outcomes (module_id, outcome_text, sort_order)
select
  module.id,
  outcomes.outcome_text,
  outcomes.sort_order
from outcomes
join public.training_programmes programme
  on programme.slug = 'lean-fundamentals-practitioner'
join public.training_programme_modules module
  on module.programme_id = programme.id
 and module.slug = outcomes.module_slug
where not exists (
  select 1
  from public.training_module_outcomes existing
  where existing.module_id = module.id
    and existing.sort_order = outcomes.sort_order
);

comment on table public.training_programmes is
'Lean training programme templates defining the overall pathway and completion rules.';

comment on table public.training_programme_modules is
'Modules within a Lean training programme, ordered as the syllabus journey.';

comment on table public.training_module_outcomes is
'Learning outcomes attached to each training module.';

comment on table public.training_cohorts is
'Client-specific deliveries of a training programme, including sponsors, dates, and status.';

comment on table public.training_cohort_trainers is
'Admin and trainer accounts assigned to deliver a cohort.';

comment on table public.training_cohort_memberships is
'Per-user enrolment records showing whether someone is a learner or client manager in a cohort.';

comment on table public.training_sessions is
'Scheduled workshops, coaching sessions, reviews, and assessment windows for a cohort.';

comment on table public.training_session_prework_items is
'Required preparation items attached to an upcoming session.';

comment on table public.training_session_prework_status is
'Learner or client-manager completion state for prework items.';

comment on table public.training_session_attendance is
'Attendance records for each learner against a scheduled training session.';

comment on table public.training_assessments is
'Knowledge checks, practical assignments, exams, and reflections across the training journey.';

comment on table public.training_assessment_submissions is
'Per-learner evidence, status, score, and feedback for an assessment.';

comment on table public.training_resources is
'Module-linked learning materials, revision guides, templates, and facilitator or manager packs.';

comment on table public.training_progress_snapshots is
'Denormalized learner progress state used for dashboards, alerts, and realtime training health views.';
