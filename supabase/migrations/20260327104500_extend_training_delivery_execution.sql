create table if not exists public.training_certificates (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null unique references public.training_cohort_memberships(id) on delete cascade,
  cohort_id uuid not null references public.training_cohorts(id) on delete cascade,
  programme_id uuid not null references public.training_programmes(id) on delete restrict,
  certificate_number text not null unique,
  status text not null default 'awarded' check (status in ('awarded', 'revoked')),
  awarded_at timestamptz not null default timezone('utc', now()),
  awarded_by_admin_id uuid references public.admin_accounts(id) on delete set null,
  notes text,
  revoked_at timestamptz,
  revoked_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_training_certificates_updated_at on public.training_certificates;
create trigger set_training_certificates_updated_at
before update on public.training_certificates
for each row execute function public.set_updated_at();

create or replace function public.refresh_training_membership_certification(target_membership_id uuid)
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
  passed_assessments integer := 0;
  final_failed_assessments integer := 0;
  activity_count integer := 0;
  attendance_percentage numeric(5,2) := 0;
  next_status text := 'not_started';
  awarded_certificate_exists boolean := false;
begin
  select *
  into membership_record
  from public.training_cohort_memberships
  where id = target_membership_id;

  if not found then
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
  into passed_assessments
  from public.training_assessment_submissions submission
  join public.training_assessments assessment on assessment.id = submission.assessment_id
  where submission.membership_id = membership_record.id
    and submission.status = 'passed'
    and assessment.status in ('scheduled', 'open', 'closed', 'graded');

  select count(*)
  into final_failed_assessments
  from public.training_assessment_submissions submission
  join public.training_assessments assessment on assessment.id = submission.assessment_id
  where submission.membership_id = membership_record.id
    and submission.status = 'failed'
    and assessment.status in ('scheduled', 'open', 'closed', 'graded');

  select
    count(*)
  into activity_count
  from (
    select 1
    from public.training_session_attendance attendance
    where attendance.membership_id = membership_record.id
    union all
    select 1
    from public.training_assessment_submissions submission
    where submission.membership_id = membership_record.id
  ) as activity_rows;

  attendance_percentage :=
    case
      when total_sessions = 0 then 0
      else round((present_sessions::numeric / total_sessions::numeric) * 100, 2)
    end;

  select exists (
    select 1
    from public.training_certificates certificate
    where certificate.membership_id = membership_record.id
      and certificate.status = 'awarded'
  )
  into awarded_certificate_exists;

  next_status :=
    case
      when awarded_certificate_exists then 'awarded'
      when final_failed_assessments > 0 then 'not_awarded'
      when (
        total_assessments > 0
        and passed_assessments >= total_assessments
        and attendance_percentage >= membership_record.attendance_target
      ) then 'ready_for_review'
      when activity_count > 0 then 'in_progress'
      else 'not_started'
    end;

  if membership_record.certification_status is distinct from next_status
    or (next_status = 'awarded' and membership_record.completed_at is null) then
    update public.training_cohort_memberships
    set
      certification_status = next_status,
      completed_at =
        case
          when next_status = 'awarded' then coalesce(completed_at, timezone('utc', now()))
          else completed_at
        end,
      updated_at = timezone('utc', now())
    where id = membership_record.id;
  end if;
end;
$$;

create or replace function public.refresh_training_certification_for_cohort(target_cohort_id uuid)
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
    perform public.refresh_training_membership_certification(membership_record.id);
  end loop;
end;
$$;

create or replace function public.handle_training_membership_certification_refresh()
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
  elsif tg_table_name = 'training_certificates' then
    target_membership_id := coalesce(new.membership_id, old.membership_id);
  else
    target_membership_id := coalesce(new.membership_id, old.membership_id);
  end if;

  if target_membership_id is not null then
    perform public.refresh_training_membership_certification(target_membership_id);
  end if;

  return coalesce(new, old);
end;
$$;

create or replace function public.handle_training_cohort_certification_refresh()
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
    perform public.refresh_training_certification_for_cohort(target_cohort_id);
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists refresh_training_certification_from_membership on public.training_cohort_memberships;
create trigger refresh_training_certification_from_membership
after insert or update or delete on public.training_cohort_memberships
for each row execute function public.handle_training_membership_certification_refresh();

drop trigger if exists refresh_training_certification_from_attendance on public.training_session_attendance;
create trigger refresh_training_certification_from_attendance
after insert or update or delete on public.training_session_attendance
for each row execute function public.handle_training_membership_certification_refresh();

drop trigger if exists refresh_training_certification_from_submission on public.training_assessment_submissions;
create trigger refresh_training_certification_from_submission
after insert or update or delete on public.training_assessment_submissions
for each row execute function public.handle_training_membership_certification_refresh();

drop trigger if exists refresh_training_certification_from_assessment on public.training_assessments;
create trigger refresh_training_certification_from_assessment
after insert or update or delete on public.training_assessments
for each row execute function public.handle_training_cohort_certification_refresh();

drop trigger if exists refresh_training_certification_from_certificate on public.training_certificates;
create trigger refresh_training_certification_from_certificate
after insert or update or delete on public.training_certificates
for each row execute function public.handle_training_membership_certification_refresh();

create index if not exists idx_training_certificates_membership_status
  on public.training_certificates(membership_id, status);

alter table public.training_certificates enable row level security;

drop policy if exists "training_certificates_select" on public.training_certificates;
create policy "training_certificates_select"
on public.training_certificates
for select
to authenticated
using (public.can_access_training_membership(membership_id));

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'training_certificates'
  ) then
    execute 'alter publication supabase_realtime add table public.training_certificates';
  end if;
end
$$;

do $$
declare
  membership_record record;
begin
  for membership_record in
    select id
    from public.training_cohort_memberships
  loop
    perform public.refresh_training_membership_certification(membership_record.id);
  end loop;
end
$$;

comment on table public.training_certificates is
'Awarded or revoked Lean training certificates tied to learner cohort memberships.';
