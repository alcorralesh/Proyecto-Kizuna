-- KIZUNA · Suscripciones Web Push, entregas y enlaces profundos.
-- Ejecutar una vez en Supabase > SQL Editor después de
-- supabase-expedient-messages.sql.

alter table public.expedient_messages
  add column if not exists send_push boolean not null default false,
  add column if not exists deep_link text;

alter table public.expedient_messages
  drop constraint if exists expedient_messages_display_mode_check;
alter table public.expedient_messages
  add constraint expedient_messages_display_mode_check
  check (display_mode in ('mailbox', 'banner', 'highlight', 'modal', 'push'));

alter table public.expedient_messages
  drop constraint if exists expedient_messages_deep_link_check;
alter table public.expedient_messages
  add constraint expedient_messages_deep_link_check
  check (
    deep_link is null
    or (
      char_length(deep_link) between 1 and 500
      and deep_link !~* '^[a-z][a-z0-9+.-]*:'
      and deep_link !~ '^//'
      and deep_link !~ '[[:cntrl:]]'
    )
  );

create table if not exists public.expedient_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.expedient_profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  platform text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- Estado observado por la propia instalación. Se conserva separado de
-- revoked_at porque el bloqueo del sistema y la revocación administrativa
-- representan decisiones diferentes.
alter table public.expedient_push_subscriptions
  add column if not exists client_key text,
  add column if not exists device_signature text,
  add column if not exists device_label text,
  add column if not exists device_model text,
  add column if not exists device_class text,
  add column if not exists permission_state text not null default 'granted',
  add column if not exists subscription_present boolean not null default true,
  add column if not exists permission_checked_at timestamptz not null default now(),
  add column if not exists revoked_reason text;

alter table public.expedient_push_subscriptions
  drop constraint if exists expedient_push_subscriptions_permission_state_check;
alter table public.expedient_push_subscriptions
  add constraint expedient_push_subscriptions_permission_state_check
  check (permission_state in ('granted', 'denied', 'unknown'));

alter table public.expedient_push_subscriptions
  drop constraint if exists expedient_push_subscriptions_revoked_reason_check;
alter table public.expedient_push_subscriptions
  add constraint expedient_push_subscriptions_revoked_reason_check
  check (revoked_reason is null or revoked_reason in ('admin', 'provider', 'replaced'));

create index if not exists expedient_push_subscriptions_user_idx
  on public.expedient_push_subscriptions (user_id, revoked_at);

create index if not exists expedient_push_subscriptions_signal_idx
  on public.expedient_push_subscriptions (user_id, permission_checked_at desc);

create index if not exists expedient_push_subscriptions_device_signature_idx
  on public.expedient_push_subscriptions (user_id, device_signature, revoked_at);

create table if not exists public.expedient_push_preferences (
  user_id uuid primary key references public.expedient_profiles(id) on delete cascade,
  status text not null
    check (status in ('granted', 'declined')),
  responded_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expedient_push_deliveries (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.expedient_messages(id) on delete cascade,
  subscription_id uuid references public.expedient_push_subscriptions(id) on delete set null,
  tracking_token uuid not null default gen_random_uuid() unique,
  status text not null default 'queued'
    check (status in ('queued', 'accepted', 'received', 'opened', 'failed')),
  accepted_at timestamptz,
  received_at timestamptz,
  opened_at timestamptz,
  failed_at timestamptz,
  provider_status integer,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (message_id, subscription_id)
);

create index if not exists expedient_push_deliveries_message_idx
  on public.expedient_push_deliveries (message_id, status);

alter table public.expedient_push_subscriptions enable row level security;
alter table public.expedient_push_preferences enable row level security;
alter table public.expedient_push_deliveries enable row level security;
alter table public.expedient_push_deliveries replica identity full;

drop policy if exists "Recipients manage their push subscriptions"
  on public.expedient_push_subscriptions;
create policy "Recipients manage their push subscriptions"
  on public.expedient_push_subscriptions
  for all to authenticated
  using (auth.uid() = user_id or public.is_archive_admin())
  with check (auth.uid() = user_id or public.is_archive_admin());

drop policy if exists "Recipients manage their notification preference"
  on public.expedient_push_preferences;
create policy "Recipients manage their notification preference"
  on public.expedient_push_preferences
  for all to authenticated
  using (auth.uid() = user_id or public.is_archive_admin())
  with check (auth.uid() = user_id or public.is_archive_admin());

drop policy if exists "Admins inspect push deliveries"
  on public.expedient_push_deliveries;
create policy "Admins inspect push deliveries"
  on public.expedient_push_deliveries
  for select to authenticated
  using (public.is_archive_admin());

grant select, insert, update, delete
  on public.expedient_push_subscriptions to authenticated;
grant select, insert, update, delete
  on public.expedient_push_preferences to authenticated;
grant select on public.expedient_push_deliveries to authenticated;

-- La función Edge utiliza una clave secreta de servidor. Estas concesiones son
-- necesarias además de la omisión de RLS para las tablas creadas por SQL.
grant select, insert, update, delete
  on public.expedient_messages to service_role;
grant select, insert, update, delete
  on public.expedient_push_subscriptions to service_role;
grant select, insert, update, delete
  on public.expedient_push_preferences to service_role;
grant select, insert, update, delete
  on public.expedient_push_deliveries to service_role;

-- Registra o reasigna de forma segura el dispositivo a la sesión actual. Esto
-- evita que un teléfono compartido siga recibiendo avisos del usuario anterior.
create or replace function public.register_expedient_push_subscription(
  push_endpoint text,
  push_p256dh text,
  push_auth text,
  push_user_agent text default null,
  push_platform text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  subscription_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if nullif(trim(push_endpoint), '') is null
    or nullif(trim(push_p256dh), '') is null
    or nullif(trim(push_auth), '') is null then
    raise exception 'Invalid push subscription';
  end if;

  insert into public.expedient_push_subscriptions (
    user_id, endpoint, p256dh, auth, user_agent, platform,
    last_seen_at, permission_state, subscription_present,
    permission_checked_at, revoked_at, updated_at
  ) values (
    auth.uid(), push_endpoint, push_p256dh, push_auth,
    push_user_agent, push_platform, now(), 'granted', true,
    now(), null, now()
  )
  on conflict (endpoint) do update set
    user_id = auth.uid(),
    p256dh = excluded.p256dh,
    auth = excluded.auth,
    user_agent = excluded.user_agent,
    platform = excluded.platform,
    last_seen_at = now(),
    permission_state = 'granted',
    subscription_present = true,
    permission_checked_at = now(),
    revoked_at = case
      when public.expedient_push_subscriptions.user_id = auth.uid()
        then public.expedient_push_subscriptions.revoked_at
      else null
    end,
    revoked_reason = case
      when public.expedient_push_subscriptions.user_id = auth.uid()
        then public.expedient_push_subscriptions.revoked_reason
      else null
    end,
    updated_at = now()
  returning id into subscription_id;

  return subscription_id;
end;
$$;

revoke all on function public.register_expedient_push_subscription(text, text, text, text, text) from public;
grant execute on function public.register_expedient_push_subscription(text, text, text, text, text) to authenticated;

-- Registro ampliado de terminal. La firma es un resumen técnico generado en el
-- navegador que permite proponer duplicados sin guardar datos del expediente.
-- Sólo client_key provoca una sustitución automática porque identifica con
-- certeza la misma instalación. Las firmas aproximadas se consolidan desde
-- administración para no confundir dos dispositivos legítimos del mismo modelo.
create or replace function public.register_expedient_push_subscription_v2(
  push_endpoint text,
  push_p256dh text,
  push_auth text,
  push_user_agent text,
  push_platform text,
  push_client_key text,
  push_device_signature text,
  push_device_label text,
  push_device_model text,
  push_device_class text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  subscription_id uuid;
  normalized_client_key text := nullif(trim(push_client_key), '');
  normalized_signature text := nullif(trim(push_device_signature), '');
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if nullif(trim(push_endpoint), '') is null
    or nullif(trim(push_p256dh), '') is null
    or nullif(trim(push_auth), '') is null then
    raise exception 'Invalid push subscription';
  end if;
  if normalized_client_key is not null and char_length(normalized_client_key) > 100 then
    raise exception 'Invalid client key';
  end if;
  if normalized_signature is not null and normalized_signature !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid device signature';
  end if;
  if push_device_class is not null and push_device_class not in ('phone','tablet','computer') then
    raise exception 'Invalid device class';
  end if;

  insert into public.expedient_push_subscriptions (
    user_id, endpoint, p256dh, auth, user_agent, platform, client_key,
    device_signature, device_label, device_model, device_class,
    last_seen_at, permission_state, subscription_present,
    permission_checked_at, revoked_at, revoked_reason, updated_at
  ) values (
    auth.uid(), push_endpoint, push_p256dh, push_auth, push_user_agent,
    push_platform, normalized_client_key, normalized_signature,
    nullif(trim(push_device_label), ''), nullif(trim(push_device_model), ''),
    nullif(trim(push_device_class), ''), now(), 'granted', true,
    now(), null, null, now()
  )
  on conflict (endpoint) do update set
    user_id = auth.uid(),
    p256dh = excluded.p256dh,
    auth = excluded.auth,
    user_agent = excluded.user_agent,
    platform = excluded.platform,
    client_key = coalesce(excluded.client_key, public.expedient_push_subscriptions.client_key),
    device_signature = coalesce(excluded.device_signature, public.expedient_push_subscriptions.device_signature),
    device_label = coalesce(excluded.device_label, public.expedient_push_subscriptions.device_label),
    device_model = coalesce(excluded.device_model, public.expedient_push_subscriptions.device_model),
    device_class = coalesce(excluded.device_class, public.expedient_push_subscriptions.device_class),
    last_seen_at = now(),
    permission_state = 'granted',
    subscription_present = true,
    permission_checked_at = now(),
    revoked_at = case
      when public.expedient_push_subscriptions.user_id = auth.uid()
        and public.expedient_push_subscriptions.revoked_reason = 'admin'
        then public.expedient_push_subscriptions.revoked_at
      else null
    end,
    revoked_reason = case
      when public.expedient_push_subscriptions.user_id = auth.uid()
        and public.expedient_push_subscriptions.revoked_reason = 'admin'
        then 'admin'
      else null
    end,
    updated_at = now()
  returning id into subscription_id;

  if normalized_client_key is not null then
    update public.expedient_push_subscriptions
    set revoked_at = coalesce(revoked_at, now()),
        revoked_reason = coalesce(revoked_reason, 'replaced'),
        subscription_present = false,
        updated_at = now()
    where user_id = auth.uid()
      and client_key = normalized_client_key
      and id <> subscription_id
      and revoked_at is null;
  end if;

  return subscription_id;
end;
$$;

revoke all on function public.register_expedient_push_subscription_v2(text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.register_expedient_push_subscription_v2(text, text, text, text, text, text, text, text, text, text) to authenticated;

-- Recibe el pulso del terminal al abrir KIZUNA. client_key es un identificador
-- técnico aleatorio de la instalación; no contiene datos del expediente.
create or replace function public.sync_expedient_push_terminal_state(
  push_endpoint text default null,
  push_client_key text default null,
  push_permission text default 'unknown',
  push_has_subscription boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  subscription_id uuid;
  normalized_endpoint text := nullif(trim(push_endpoint), '');
  normalized_client_key text := nullif(trim(push_client_key), '');
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if push_permission not in ('granted', 'denied', 'unknown') then
    raise exception 'Invalid permission state';
  end if;
  if normalized_client_key is not null and char_length(normalized_client_key) > 100 then
    raise exception 'Invalid client key';
  end if;

  select id into subscription_id
  from public.expedient_push_subscriptions
  where user_id = auth.uid()
    and (
      (normalized_endpoint is not null and endpoint = normalized_endpoint)
      or (normalized_endpoint is null and normalized_client_key is not null and client_key = normalized_client_key)
    )
  order by (endpoint = normalized_endpoint) desc, updated_at desc
  limit 1;

  if subscription_id is null then
    return null;
  end if;

  if normalized_client_key is not null then
    update public.expedient_push_subscriptions
    set revoked_at = coalesce(revoked_at, now()),
        revoked_reason = coalesce(revoked_reason, 'replaced'),
        updated_at = now()
    where user_id = auth.uid()
      and client_key = normalized_client_key
      and id <> subscription_id
      and revoked_at is null;
  end if;

  update public.expedient_push_subscriptions
  set client_key = coalesce(normalized_client_key, client_key),
      permission_state = push_permission,
      subscription_present = push_has_subscription,
      permission_checked_at = now(),
      last_seen_at = now(),
      updated_at = now()
  where id = subscription_id
    and user_id = auth.uid();

  return subscription_id;
end;
$$;

revoke all on function public.sync_expedient_push_terminal_state(text, text, text, boolean) from public;
grant execute on function public.sync_expedient_push_terminal_state(text, text, text, boolean) to authenticated;

-- Conserva la respuesta narrativa del destinatario sin mezclarla con el
-- progreso documental. La presencia de dispositivos activos se consulta aparte.
create or replace function public.set_expedient_push_preference(
  preference_status text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if preference_status not in ('granted', 'declined') then
    raise exception 'Invalid notification preference';
  end if;

  insert into public.expedient_push_preferences (
    user_id, status, responded_at, updated_at
  ) values (
    auth.uid(), preference_status, now(), now()
  )
  on conflict (user_id) do update set
    status = excluded.status,
    responded_at = now(),
    updated_at = now();

  return preference_status;
end;
$$;

revoke all on function public.set_expedient_push_preference(text) from public;
grant execute on function public.set_expedient_push_preference(text) to authenticated;

-- Mantiene protegidos los campos redactados por Administración y permite al
-- destinatario actualizar únicamente el ciclo de vida del mensaje.
create or replace function public.protect_expedient_message_content()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.user_id and not public.is_archive_admin() then
    new.id := old.id;
    new.user_id := old.user_id;
    new.sender_id := old.sender_id;
    new.subject := old.subject;
    new.body := old.body;
    new.display_mode := old.display_mode;
    new.priority := old.priority;
    new.requires_ack := old.requires_ack;
    new.send_push := old.send_push;
    new.deep_link := old.deep_link;
    new.published_at := old.published_at;
    new.expires_at := old.expires_at;
    new.created_at := old.created_at;
    new.displayed_at := coalesce(old.displayed_at, new.displayed_at);
    new.read_at := coalesce(old.read_at, new.read_at);
    new.acknowledged_at := coalesce(old.acknowledged_at, new.acknowledged_at);
    new.dismissed_at := coalesce(old.dismissed_at, new.dismissed_at);
  end if;
  new.updated_at := now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'expedient_push_deliveries'
  ) then
    alter publication supabase_realtime
      add table public.expedient_push_deliveries;
  end if;
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'expedient_push_preferences'
  ) then
    alter publication supabase_realtime
      add table public.expedient_push_preferences;
  end if;
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'expedient_push_subscriptions'
  ) then
    alter publication supabase_realtime
      add table public.expedient_push_subscriptions;
  end if;
end
$$;
