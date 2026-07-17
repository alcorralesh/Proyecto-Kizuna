-- KIZUNA · preferencias de comunicaciones administrativas
-- Ejecuta este bloque una sola vez en Supabase > SQL Editor.

create table if not exists public.expedient_communication_preferences (
  event_key text primary key,
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.expedient_communication_deliveries (
  id bigint generated always as identity primary key,
  activity_id bigint not null unique references public.expedient_activity_log(id) on delete cascade,
  event_key text not null,
  recipient text not null,
  provider_id text,
  sent_at timestamptz not null default now()
);

alter table public.expedient_communication_preferences enable row level security;
alter table public.expedient_communication_deliveries enable row level security;

grant select, insert, update, delete on table public.expedient_communication_preferences to authenticated;
grant select, insert, update, delete on table public.expedient_communication_preferences to service_role;
grant select, insert, update, delete on table public.expedient_communication_deliveries to service_role;
grant usage, select on sequence public.expedient_communication_deliveries_id_seq to service_role;

drop policy if exists "Admins manage communication preferences" on public.expedient_communication_preferences;
create policy "Admins manage communication preferences"
on public.expedient_communication_preferences for all to authenticated
using ((select public.is_archive_admin()))
with check ((select public.is_archive_admin()));

-- La devolución del identificador recién creado permite solicitar el aviso
-- desde el navegador sin dar acceso a la actividad de otros destinatarios.
drop policy if exists "Users can view own activity" on public.expedient_activity_log;
create policy "Users can view own activity"
on public.expedient_activity_log for select to authenticated
using ((select auth.uid()) = user_id);

