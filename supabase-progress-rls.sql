-- KIZUNA · acceso del destinatario a su propio progreso
-- Ejecuta el bloque completo en Supabase > SQL Editor.

alter table public.expedient_progress enable row level security;

grant select, insert, update on table public.expedient_progress to authenticated;

drop policy if exists "Users can view own progress" on public.expedient_progress;
drop policy if exists "Users can create own progress" on public.expedient_progress;
drop policy if exists "Users can update own progress" on public.expedient_progress;

create policy "Users can view own progress"
on public.expedient_progress for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create own progress"
on public.expedient_progress for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own progress"
on public.expedient_progress for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Recupera las lecturas que quedaron registradas en la actividad pero fueron
-- eliminadas accidentalmente del JSON de progreso.
update public.expedient_progress as progress
set
  state = jsonb_set(
    coalesce(progress.state, '{}'::jsonb),
    '{read}',
    (
      select coalesce(
        jsonb_agg(to_jsonb(recovered.document_id) order by recovered.document_id),
        '[]'::jsonb
      )
      from (
        select distinct jsonb_array_elements_text(
          case
            when jsonb_typeof(progress.state -> 'read') = 'array'
              then progress.state -> 'read'
            else '[]'::jsonb
          end
        ) as document_id
        union
        select distinct activity.document_id
        from public.expedient_activity_log as activity
        where activity.user_id = progress.user_id
          and activity.event_type = 'document_confirmed'
          and activity.document_id is not null
      ) as recovered
    ),
    true
  ),
  updated_at = now()
where exists (
  select 1
  from public.expedient_activity_log as activity
  where activity.user_id = progress.user_id
    and activity.event_type = 'document_confirmed'
    and activity.document_id is not null
);

-- Una actualización del propio destinatario puede añadir lecturas, pero nunca
-- eliminar las que ya existen. Los reinicios explícitos realizados por la
-- administración o por service_role quedan fuera de esta protección.
create or replace function public.preserve_recipient_read_progress()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  previous_read jsonb;
  requested_read jsonb;
  merged_read jsonb;
begin
  if auth.uid() = old.user_id
     and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    previous_read := case
      when jsonb_typeof(old.state -> 'read') = 'array' then old.state -> 'read'
      else '[]'::jsonb
    end;
    requested_read := case
      when jsonb_typeof(new.state -> 'read') = 'array' then new.state -> 'read'
      else '[]'::jsonb
    end;

    select coalesce(jsonb_agg(to_jsonb(document_id) order by document_id), '[]'::jsonb)
    into merged_read
    from (
      select distinct jsonb_array_elements_text(previous_read) as document_id
      union
      select distinct jsonb_array_elements_text(requested_read) as document_id
    ) as protected_documents;

    new.state := jsonb_set(coalesce(new.state, '{}'::jsonb), '{read}', merged_read, true);
  end if;

  return new;
end;
$$;

drop trigger if exists preserve_recipient_read_progress
on public.expedient_progress;

create trigger preserve_recipient_read_progress
before update of state on public.expedient_progress
for each row
execute function public.preserve_recipient_read_progress();
