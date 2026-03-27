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

create table if not exists public.client_hub_content (
  id text primary key check (id = 'default'),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_client_hub_content_updated_at on public.client_hub_content;
create trigger set_client_hub_content_updated_at
before update on public.client_hub_content
for each row
execute function public.set_updated_at();

alter table public.client_hub_content enable row level security;

insert into public.client_hub_content (id, content)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;

comment on table public.client_hub_content is
'Single-record content store for the editable client hub dashboard experience.';
