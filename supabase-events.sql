-- KIZUNA · agenda pública e inscripciones a eventos
-- Ejecutar una vez en Supabase > SQL Editor.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 180),
  description text not null check (char_length(trim(description)) between 1 and 1000),
  location text not null check (char_length(trim(location)) between 1 and 180),
  starts_at timestamptz not null,
  capacity integer not null check (capacity between 1 and 10000),
  registered_count integer not null default 0 check (registered_count >= 0 and registered_count <= capacity),
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  first_name text not null check (char_length(trim(first_name)) between 1 and 80),
  last_name text not null check (char_length(trim(last_name)) between 1 and 120),
  birth_date date not null check (birth_date <= current_date),
  created_at timestamptz not null default now()
);

create index if not exists events_public_order_idx on public.events (is_published, sort_order, starts_at);
create unique index if not exists events_title_date_idx on public.events (title, starts_at);
create index if not exists event_registrations_event_idx on public.event_registrations (event_id, created_at desc);
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant select, delete on public.event_registrations to authenticated;

drop policy if exists "Anyone can read published events" on public.events;
create policy "Anyone can read published events" on public.events for select to anon, authenticated
using (is_published or coalesce(auth.jwt() -> 'app_metadata' ->> 'role','') = 'admin');

drop policy if exists "Admins can create events" on public.events;
create policy "Admins can create events" on public.events for insert to authenticated
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
drop policy if exists "Admins can update events" on public.events;
create policy "Admins can update events" on public.events for update to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
drop policy if exists "Admins can delete events" on public.events;
create policy "Admins can delete events" on public.events for delete to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

drop policy if exists "Admins can read event registrations" on public.event_registrations;
create policy "Admins can read event registrations" on public.event_registrations for select to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
drop policy if exists "Admins can delete event registrations" on public.event_registrations;
create policy "Admins can delete event registrations" on public.event_registrations for delete to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create or replace function public.update_event_registered_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.events set registered_count=registered_count+1,updated_at=now() where id=new.event_id;
    return new;
  end if;
  update public.events set registered_count=greatest(0,registered_count-1),updated_at=now() where id=old.event_id;
  return old;
end;
$$;

drop trigger if exists event_registration_counter on public.event_registrations;
create trigger event_registration_counter
after insert or delete on public.event_registrations
for each row execute function public.update_event_registered_count();

create or replace function public.register_for_event(p_event_id uuid,p_first_name text,p_last_name text,p_birth_date date)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.events%rowtype;
  v_registration_id uuid;
begin
  select * into v_event from public.events where id=p_event_id for update;
  if not found or not v_event.is_published then raise exception 'Evento no disponible'; end if;
  if v_event.starts_at <= now() then raise exception 'La inscripción está cerrada'; end if;
  if v_event.registered_count >= v_event.capacity then raise exception 'No quedan plazas'; end if;
  if char_length(trim(p_first_name)) not between 1 and 80 or char_length(trim(p_last_name)) not between 1 and 120 then raise exception 'Datos personales incompletos'; end if;
  if p_birth_date is null or p_birth_date > current_date then raise exception 'Fecha de nacimiento no válida'; end if;
  insert into public.event_registrations(event_id,first_name,last_name,birth_date)
  values(p_event_id,trim(p_first_name),trim(p_last_name),p_birth_date)
  returning id into v_registration_id;
  return v_registration_id;
end;
$$;

revoke all on function public.register_for_event(uuid,text,text,date) from public;
grant execute on function public.register_for_event(uuid,text,text,date) to anon, authenticated;

insert into public.events(title,description,location,starts_at,capacity,sort_order) values
('Festival de fuegos artificiales de Sumida','Una noche junto al río para contemplar uno de los hanabi más emblemáticos de Tokio.','Parque Sumida · Tokio','2026-09-12 19:00:00+09',40,10),
('Ceremonia de té al amanecer','Una introducción íntima al chanoyu en un jardín tradicional de Kioto.','Distrito de Higashiyama · Kioto','2026-09-26 08:30:00+09',12,20),
('Ruta de otoño entre templos','Paseo guiado para descubrir los primeros colores del momiji y su historia.','Arashiyama · Kioto','2026-10-17 09:00:00+09',24,30)
on conflict do nothing;
