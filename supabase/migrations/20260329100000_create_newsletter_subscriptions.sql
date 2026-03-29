create table if not exists public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  is_subscribed boolean not null default true,
  source text not null default 'newsletter',
  unsubscribed_at timestamptz,
  resubscribed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists newsletter_subscriptions_email_lower_unique_idx
  on public.newsletter_subscriptions (lower(email));

create index if not exists newsletter_subscriptions_is_subscribed_idx
  on public.newsletter_subscriptions (is_subscribed);

drop trigger if exists set_newsletter_subscriptions_updated_at on public.newsletter_subscriptions;
create trigger set_newsletter_subscriptions_updated_at
before update on public.newsletter_subscriptions
for each row
execute function public.set_updated_at();
