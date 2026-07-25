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

create index if not exists expedient_push_subscriptions_user_idx
  on public.expedient_push_subscriptions (user_id, revoked_at);

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
    last_seen_at, revoked_at, updated_at
  ) values (
    auth.uid(), push_endpoint, push_p256dh, push_auth,
    push_user_agent, push_platform, now(), null, now()
  )
  on conflict (endpoint) do update set
    user_id = auth.uid(),
    p256dh = excluded.p256dh,
    auth = excluded.auth,
    user_agent = excluded.user_agent,
    platform = excluded.platform,
    last_seen_at = now(),
    revoked_at = case
      when public.expedient_push_subscriptions.user_id = auth.uid()
        then public.expedient_push_subscriptions.revoked_at
      else null
    end,
    updated_at = now()
  returning id into subscription_id;

  return subscription_id;
end;
$$;

revoke all on function public.register_expedient_push_subscription(text, text, text, text, text) from public;
grant execute on function public.register_expedient_push_subscription(text, text, text, text, text) to authenticated;

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
