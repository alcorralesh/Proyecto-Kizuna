-- KIZUNA · mensajes enviados desde el formulario público
-- Ejecutar una vez en Supabase > SQL Editor.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists contact_messages_unread_idx
  on public.contact_messages (is_read, created_at desc);

alter table public.contact_messages enable row level security;

grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;

drop policy if exists "Public can send contact messages" on public.contact_messages;
create policy "Public can send contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (
  is_read = false
  and char_length(trim(name)) between 1 and 120
  and char_length(trim(email)) between 3 and 254
  and char_length(trim(message)) between 1 and 5000
);

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
on public.contact_messages for select
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages"
on public.contact_messages for update
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages"
on public.contact_messages for delete
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'contact_messages'
  ) then
    alter publication supabase_realtime add table public.contact_messages;
  end if;
end $$;
