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

create table if not exists public.careers_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  department text,
  location_label text not null default 'On-site at client locations across the UK',
  employment_type text not null default 'Full-time',
  experience_level text,
  summary text not null,
  description text not null,
  responsibilities text,
  requirements text,
  status text not null default 'draft' check (status in ('draft', 'open', 'closed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_careers_jobs_updated_at on public.careers_jobs;
create trigger set_careers_jobs_updated_at
before update on public.careers_jobs
for each row
execute function public.set_updated_at();

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.careers_jobs(id) on delete set null,
  job_title_snapshot text not null,
  full_name text not null,
  email text not null,
  phone text,
  location text,
  linkedin_url text,
  portfolio_url text,
  cover_note text,
  resume_filename text not null,
  resume_path text not null,
  resume_content_type text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'shortlisted', 'rejected')),
  review_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_career_applications_updated_at on public.career_applications;
create trigger set_career_applications_updated_at
before update on public.career_applications
for each row
execute function public.set_updated_at();

alter table public.careers_jobs enable row level security;
alter table public.career_applications enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'career-applications',
  'career-applications',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.careers_jobs is
'Job positions shown on the public careers page and managed from the admin panel.';

comment on table public.career_applications is
'Job applications submitted from the public careers page. Resume files live in the career-applications storage bucket.';
