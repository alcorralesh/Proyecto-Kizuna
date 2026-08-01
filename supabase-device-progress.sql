-- KIZUNA · progreso aislado del dispositivo clonado AR-06
-- Ejecuta este archivo completo en Supabase > SQL Editor.
-- No modifica public.expedient_progress ni el progreso documental.

create table if not exists public.expedient_device_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reviewed text[] not null default '{}'::text[],
  module_state text not null default 'locked'
    check (module_state in ('locked', 'available', 'consumed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.expedient_device_progress enable row level security;

grant select on table public.expedient_device_progress to authenticated;
grant select, insert, update, delete on table public.expedient_device_progress to service_role;

drop policy if exists "Users can view own device progress"
on public.expedient_device_progress;

create policy "Users can view own device progress"
on public.expedient_device_progress
for select to authenticated
using ((select auth.uid()) = user_id);

-- La escritura se realiza exclusivamente mediante esta función para unir de
-- forma atómica el progreso de varias pestañas o dispositivos. Una sesión
-- atrasada nunca puede eliminar evidencias revisadas anteriormente.
create or replace function public.save_expedient_device_progress(
  p_reviewed text[] default '{}'::text[],
  p_module_state text default 'locked'
)
returns public.expedient_device_progress
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_reviewed text[];
  v_row public.expedient_device_progress;
  v_requested_state text;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select coalesce(array_agg(distinct evidence_id order by evidence_id), '{}'::text[])
  into v_reviewed
  from unnest(coalesce(p_reviewed, '{}'::text[])) as evidence_id
  where evidence_id = any(array[
    'timeline', 'routes', 'gallery', 'whatsapp', 'search', 'health', 'lost'
  ]::text[]);

  insert into public.expedient_device_progress (user_id, reviewed)
  values (v_user_id, v_reviewed)
  on conflict (user_id) do update
  set
    reviewed = (
      select coalesce(array_agg(distinct evidence_id order by evidence_id), '{}'::text[])
      from unnest(
        public.expedient_device_progress.reviewed || excluded.reviewed
      ) as evidence_id
    ),
    updated_at = now()
  returning * into v_row;

  v_requested_state := case
    when p_module_state in ('locked', 'available', 'consumed') then p_module_state
    else 'locked'
  end;

  if cardinality(v_row.reviewed) = 7 then
    update public.expedient_device_progress
    set
      module_state = case
        when module_state = 'consumed' then 'consumed'
        when v_requested_state = 'consumed' then 'consumed'
        when v_requested_state = 'available' then 'available'
        else module_state
      end,
      updated_at = now()
    where user_id = v_user_id
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

revoke all on function public.save_expedient_device_progress(text[], text) from public;
grant execute on function public.save_expedient_device_progress(text[], text) to authenticated;

