alter table if exists public.newsletter_subscriptions enable row level security;

revoke all on table public.newsletter_subscriptions from anon;
revoke all on table public.newsletter_subscriptions from authenticated;
