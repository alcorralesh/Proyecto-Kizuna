-- Configuración central de la ambientación sonora de KIZUNA.
-- Ejecutar una sola vez en Supabase > SQL Editor.

create table if not exists public.kizuna_sound_config (
  id smallint primary key default 1 check (id = 1),
  enabled boolean not null default true,
  master_volume numeric(4,3) not null default .75 check (master_volume between 0 and 1),
  vibration_enabled boolean not null default true,
  events jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.kizuna_sound_config enable row level security;
grant select on public.kizuna_sound_config to anon, authenticated;
grant insert, update on public.kizuna_sound_config to authenticated;

drop policy if exists "sound config can be read" on public.kizuna_sound_config;
create policy "sound config can be read"
on public.kizuna_sound_config for select
to anon, authenticated
using (true);

drop policy if exists "admins manage sound config" on public.kizuna_sound_config;
create policy "admins manage sound config"
on public.kizuna_sound_config for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into public.kizuna_sound_config (id)
values (1)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('kizuna-audio', 'kizuna-audio', true, 5242880, array['audio/wav','audio/mpeg','audio/ogg'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads kizuna audio" on storage.objects;
create policy "public reads kizuna audio"
on storage.objects for select
to public
using (bucket_id = 'kizuna-audio');

drop policy if exists "admins upload kizuna audio" on storage.objects;
create policy "admins upload kizuna audio"
on storage.objects for insert
to authenticated
with check (bucket_id = 'kizuna-audio' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admins update kizuna audio" on storage.objects;
create policy "admins update kizuna audio"
on storage.objects for update
to authenticated
using (bucket_id = 'kizuna-audio' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check (bucket_id = 'kizuna-audio' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
