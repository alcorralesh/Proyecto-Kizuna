-- Comunicaciones directas entre Administración y cada destinatario.
-- Ejecutar una vez en el editor SQL de Supabase.

create table if not exists public.expedient_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.expedient_profiles(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  subject text not null check (char_length(trim(subject)) between 1 and 160),
  body text not null check (char_length(trim(body)) between 1 and 5000),
  display_mode text not null default 'mailbox'
    check (display_mode in ('mailbox', 'banner', 'highlight', 'modal')),
  priority text not null default 'normal'
    check (priority in ('normal', 'high', 'urgent')),
  requires_ack boolean not null default false,
  published_at timestamptz not null default now(),
  expires_at timestamptz,
  displayed_at timestamptz,
  read_at timestamptz,
  acknowledged_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expedient_messages_expiry_check
    check (expires_at is null or expires_at > published_at)
);

create index if not exists expedient_messages_recipient_idx
  on public.expedient_messages (user_id, published_at desc);
create index if not exists expedient_messages_unread_idx
  on public.expedient_messages (user_id, read_at)
  where read_at is null;

alter table public.expedient_messages enable row level security;
alter table public.expedient_messages replica identity full;

drop policy if exists "Recipients read their messages" on public.expedient_messages;
create policy "Recipients read their messages"
  on public.expedient_messages for select
  to authenticated
  using (auth.uid() = user_id or public.is_archive_admin());

drop policy if exists "Recipients update their message state" on public.expedient_messages;
create policy "Recipients update their message state"
  on public.expedient_messages for update
  to authenticated
  using (auth.uid() = user_id or public.is_archive_admin())
  with check (auth.uid() = user_id or public.is_archive_admin());

drop policy if exists "Admins create recipient messages" on public.expedient_messages;
create policy "Admins create recipient messages"
  on public.expedient_messages for insert
  to authenticated
  with check (public.is_archive_admin());

drop policy if exists "Admins delete recipient messages" on public.expedient_messages;
create policy "Admins delete recipient messages"
  on public.expedient_messages for delete
  to authenticated
  using (public.is_archive_admin());

-- Un destinatario sólo puede registrar el ciclo de vida del mensaje. El texto,
-- destinatario, prioridad y modo de presentación sólo los modifica Administración.
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

drop trigger if exists protect_expedient_message_content_trigger
  on public.expedient_messages;
create trigger protect_expedient_message_content_trigger
before update on public.expedient_messages
for each row execute function public.protect_expedient_message_content();

grant select, update on public.expedient_messages to authenticated;
grant insert, delete on public.expedient_messages to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'expedient_messages'
  ) then
    alter publication supabase_realtime add table public.expedient_messages;
  end if;
end
$$;
