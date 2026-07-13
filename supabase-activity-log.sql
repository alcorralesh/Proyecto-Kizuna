-- KIZUNA · registro central de actividad
-- Ejecuta este bloque una sola vez en Supabase > SQL Editor.

create table if not exists public.expedient_activity_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('login', 'document_confirmed', 'comic_page_read', 'supplementary_file_consulted')),
  document_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Amplía los tipos permitidos si la tabla ya existía antes de este cambio.
alter table public.expedient_activity_log
  drop constraint if exists expedient_activity_log_event_type_check;
alter table public.expedient_activity_log
  add constraint expedient_activity_log_event_type_check
  check (event_type in ('login', 'document_confirmed', 'comic_page_read', 'supplementary_file_consulted'));

create index if not exists expedient_activity_log_user_created_at_idx
  on public.expedient_activity_log (user_id, created_at desc);

alter table public.expedient_activity_log enable row level security;

grant insert, select on table public.expedient_activity_log to authenticated;
grant usage, select on sequence public.expedient_activity_log_id_seq to authenticated;
grant select, insert, update, delete on table public.expedient_activity_log to service_role;
grant usage, select on sequence public.expedient_activity_log_id_seq to service_role;

drop policy if exists "Users can register own activity" on public.expedient_activity_log;
drop policy if exists "Admins can view activity logs" on public.expedient_activity_log;

create policy "Users can register own activity"
on public.expedient_activity_log for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Admins can view activity logs"
on public.expedient_activity_log for select to authenticated
using ((select public.is_archive_admin()));
