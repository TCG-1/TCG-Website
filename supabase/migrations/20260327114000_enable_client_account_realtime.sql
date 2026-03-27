drop policy if exists "client_accounts_select" on public.client_accounts;
create policy "client_accounts_select"
on public.client_accounts
for select
to authenticated
using (
  public.current_admin_account_id() is not null
  or auth_user_id = auth.uid()
  or client_id = public.current_client_id()
);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'client_accounts'
  ) then
    execute 'alter publication supabase_realtime add table public.client_accounts';
  end if;
end
$$;
