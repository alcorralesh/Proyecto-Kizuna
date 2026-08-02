-- KIZUNA · protección de los formularios públicos ya desplegados.
-- Ejecutar una vez en Supabase > SQL Editor antes de desplegar submit-public-form.

create table if not exists public.public_submission_limits (
  action text not null,
  identifier_hash text not null check (char_length(identifier_hash)=64),
  window_seconds integer not null check (window_seconds between 60 and 86400),
  window_started_at timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  updated_at timestamptz not null default now(),
  primary key (action,identifier_hash,window_seconds,window_started_at)
);

create index if not exists public_submission_limits_expiry_idx
on public.public_submission_limits (window_started_at);

alter table public.public_submission_limits enable row level security;
revoke all on public.public_submission_limits from public,anon,authenticated;

create or replace function public.consume_public_submission_limit(
  p_action text,
  p_identifier_hash text,
  p_window_seconds integer,
  p_maximum integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_start timestamptz;
  v_count integer;
  v_retry_after integer;
begin
  if p_action not in ('contact','event') or char_length(p_identifier_hash)<>64 then
    raise exception 'Parámetros de límite no válidos';
  end if;
  if p_window_seconds not between 60 and 86400 or p_maximum not between 1 and 100 then
    raise exception 'Ventana de límite no válida';
  end if;
  v_window_start=to_timestamp(floor(extract(epoch from now())/p_window_seconds)*p_window_seconds);
  insert into public.public_submission_limits(action,identifier_hash,window_seconds,window_started_at,request_count,updated_at)
  values(p_action,p_identifier_hash,p_window_seconds,v_window_start,1,now())
  on conflict(action,identifier_hash,window_seconds,window_started_at)
  do update set request_count=public.public_submission_limits.request_count+1,updated_at=now()
  returning request_count into v_count;
  v_retry_after=greatest(1,ceil(extract(epoch from (v_window_start+make_interval(secs=>p_window_seconds)-now())))::integer);
  delete from public.public_submission_limits where window_started_at<now()-interval '2 days';
  return jsonb_build_object('allowed',v_count<=p_maximum,'count',v_count,'retry_after',v_retry_after);
end;
$$;

revoke all on function public.consume_public_submission_limit(text,text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_public_submission_limit(text,text,integer,integer) to service_role;

create or replace function public.submit_contact_message(p_name text,p_email text,p_message text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text=trim(p_name);
  v_email text=lower(trim(p_email));
  v_message text=trim(p_message);
  v_id uuid;
begin
  if char_length(v_name) not between 1 and 120 or char_length(v_email) not between 3 and 254 or position('@' in v_email)=0 or char_length(v_message) not between 1 and 5000 then
    raise exception 'Datos de contacto no válidos';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_email||':'||lower(v_message),0));
  if exists(
    select 1 from public.contact_messages
    where lower(trim(email))=v_email and lower(trim(message))=lower(v_message)
      and created_at>now()-interval '24 hours'
  ) then
    raise exception 'CONTACT_DUPLICATE';
  end if;
  insert into public.contact_messages(name,email,message,is_read)
  values(v_name,v_email,v_message,false) returning id into v_id;
  return v_id;
end;
$$;

revoke insert on public.contact_messages from anon,authenticated;
drop policy if exists "Public can send contact messages" on public.contact_messages;
revoke all on function public.submit_contact_message(text,text,text) from public,anon,authenticated;
grant execute on function public.submit_contact_message(text,text,text) to service_role;

create or replace function public.register_for_event(p_event_id uuid,p_first_name text,p_last_name text,p_birth_date date)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.events%rowtype;
  v_first_name text=trim(p_first_name);
  v_last_name text=trim(p_last_name);
  v_registration_id uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_event_id::text||':'||lower(v_first_name)||':'||lower(v_last_name)||':'||coalesce(p_birth_date::text,''),0));
  select * into v_event from public.events where id=p_event_id for update;
  if not found or not v_event.is_published then raise exception 'Evento no disponible'; end if;
  if v_event.starts_at<=now() then raise exception 'La inscripción está cerrada'; end if;
  if v_event.registered_count>=v_event.capacity then raise exception 'No quedan plazas'; end if;
  if char_length(v_first_name) not between 1 and 80 or char_length(v_last_name) not between 1 and 120 then raise exception 'Datos personales incompletos'; end if;
  if p_birth_date is null or p_birth_date>current_date then raise exception 'Fecha de nacimiento no válida'; end if;
  if exists(
    select 1 from public.event_registrations
    where event_id=p_event_id and lower(trim(first_name))=lower(v_first_name)
      and lower(trim(last_name))=lower(v_last_name) and birth_date=p_birth_date
  ) then
    raise exception 'EVENT_DUPLICATE';
  end if;
  insert into public.event_registrations(event_id,first_name,last_name,birth_date)
  values(p_event_id,v_first_name,v_last_name,p_birth_date)
  returning id into v_registration_id;
  return v_registration_id;
end;
$$;

revoke all on function public.register_for_event(uuid,text,text,date) from public,anon,authenticated;
grant execute on function public.register_for_event(uuid,text,text,date) to service_role;
