-- Configuración central de microeventos KIZUNA. Ejecutar una vez en Supabase > SQL Editor.
create table if not exists public.kizuna_microevent_config (
  id smallint primary key default 1 check (id = 1),
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.kizuna_microevent_config enable row level security;
grant select on public.kizuna_microevent_config to anon, authenticated;
grant insert, update on public.kizuna_microevent_config to authenticated;
drop policy if exists "microevents can be read" on public.kizuna_microevent_config;
create policy "microevents can be read" on public.kizuna_microevent_config for select to anon, authenticated using (true);
drop policy if exists "admins manage microevents" on public.kizuna_microevent_config;
create policy "admins manage microevents" on public.kizuna_microevent_config for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
insert into public.kizuna_microevent_config (id,settings) values (1,'{}'::jsonb) on conflict (id) do nothing;
