drop policy if exists "role_definitions_select" on public.role_definitions;
create policy "role_definitions_select"
on public.role_definitions
for select
to authenticated
using (public.current_admin_account_id() is not null or public.current_client_account_id() is not null);

drop policy if exists "admin_account_roles_select" on public.admin_account_roles;
create policy "admin_account_roles_select"
on public.admin_account_roles
for select
to authenticated
using (public.current_admin_account_id() is not null);

drop policy if exists "client_account_roles_select" on public.client_account_roles;
create policy "client_account_roles_select"
on public.client_account_roles
for select
to authenticated
using (
  public.current_admin_account_id() is not null
  or client_account_id = public.current_client_account_id()
);

drop policy if exists "notifications_select" on public.notifications;
create policy "notifications_select"
on public.notifications
for select
to authenticated
using (
  (recipient_scope = 'admin' and admin_account_id = public.current_admin_account_id())
  or
  (recipient_scope = 'client' and client_account_id = public.current_client_account_id())
);

do $$
declare
  table_name text;
begin
  foreach table_name in array ARRAY[
    'role_definitions',
    'admin_account_roles',
    'client_account_roles',
    'notifications'
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
