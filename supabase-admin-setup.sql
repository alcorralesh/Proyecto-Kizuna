-- KIZUNA · configuración del panel de administración
-- Ejecuta todo este bloque una sola vez en Supabase > SQL Editor.

create or replace function public.is_archive_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

grant execute on function public.is_archive_admin() to authenticated;

create table if not exists public.expedient_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.expedient_profiles enable row level security;
grant select on public.expedient_profiles to authenticated;

create or replace function public.handle_expedient_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.expedient_profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.email)
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = excluded.display_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_expedient_profile on auth.users;
create trigger on_auth_user_created_expedient_profile
after insert on auth.users
for each row execute procedure public.handle_expedient_profile();

-- Añade al directorio los usuarios que ya existían antes de activar el trigger.
insert into public.expedient_profiles (id, email, display_name)
select id, email, coalesce(raw_user_meta_data ->> 'display_name', email)
from auth.users
on conflict (id) do update
  set email = excluded.email,
      display_name = excluded.display_name;

drop policy if exists "Users can view own profile" on public.expedient_profiles;
drop policy if exists "Admins can view all profiles" on public.expedient_profiles;

create policy "Users can view own profile"
on public.expedient_profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "Admins can view all profiles"
on public.expedient_profiles for select to authenticated
using ((select public.is_archive_admin()));

drop policy if exists "Admins can view every progress record" on public.expedient_progress;
drop policy if exists "Admins can update every progress record" on public.expedient_progress;
drop policy if exists "Admins can create every progress record" on public.expedient_progress;

create policy "Admins can view every progress record"
on public.expedient_progress for select to authenticated
using ((select public.is_archive_admin()));

create policy "Admins can update every progress record"
on public.expedient_progress for update to authenticated
using ((select public.is_archive_admin()))
with check ((select public.is_archive_admin()));

create policy "Admins can create every progress record"
on public.expedient_progress for insert to authenticated
with check ((select public.is_archive_admin()));
