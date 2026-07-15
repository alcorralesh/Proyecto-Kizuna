-- Historial de pedidos simulados para una tienda KIZUNA ya instalada.
-- Ejecuta este archivo en Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null unique,
  customer_name text not null,
  customer_email text not null,
  country text not null,
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  item_count integer not null check (item_count > 0),
  total numeric(10,2) not null check (total >= 0),
  status text not null default 'REGISTRADO · SIMULACIÓN',
  created_at timestamptz not null default now()
);

create index if not exists shop_orders_user_created_idx
on public.shop_orders (user_id, created_at desc);

alter table public.shop_orders enable row level security;
grant select, insert on table public.shop_orders to authenticated;

drop policy if exists "Users can create own simulated orders" on public.shop_orders;
create policy "Users can create own simulated orders"
on public.shop_orders for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can view own simulated orders" on public.shop_orders;
create policy "Users can view own simulated orders"
on public.shop_orders for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Admins can view every simulated order" on public.shop_orders;
create policy "Admins can view every simulated order"
on public.shop_orders for select to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
