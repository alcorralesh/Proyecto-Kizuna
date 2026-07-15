-- Tienda simulada KIZUNA: catálogo configurable sin pagos ni pedidos reales.
create extension if not exists pgcrypto;

create table if not exists public.shop_products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) between 2 and 180),
  category text not null check (category in ('museos','templos','parques','transporte','merchandising')),
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  stock integer not null default 100 check (stock >= 0),
  image_url text not null default '',
  badge text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shop_products enable row level security;

-- Los GRANT habilitan el acceso base; las políticas RLS de abajo determinan
-- qué filas puede consultar o modificar cada sesión.
grant select on table public.shop_products to anon, authenticated;
grant insert, update, delete on table public.shop_products to authenticated;

drop policy if exists "Public can view active shop products" on public.shop_products;
create policy "Public can view active shop products"
on public.shop_products for select
using (is_active = true or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

drop policy if exists "Admins can manage shop products" on public.shop_products;
create policy "Admins can manage shop products"
on public.shop_products for all
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

insert into public.shop_products(name,category,description,price,stock,image_url,badge,sort_order) values
('Museo Ghibli · Mitaka','museos','Entrada simulada con acceso programado al universo de Studio Ghibli.',10.00,18,'../assets/guides/tokio.png','MUY SOLICITADO',10),
('teamLab Planets · Tokio','museos','Experiencia artística inmersiva entre luz, agua y jardines digitales.',24.50,32,'../assets/sensations/memory.png','ENTRADA DIGITAL',20),
('Kiyomizu-dera · Kioto','templos','Acceso cultural simulado al histórico templo de las colinas de Higashiyama.',4.00,80,'../assets/guides/kioto.png','PATRIMONIO',30),
('Universal Studios Japan','parques','Pase de un día simulado para el parque de Osaka.',54.00,25,'../assets/guides/osaka.png','1 DÍA',40),
('Tokyo Subway Ticket · 72 h','transporte','Uso ilimitado simulado durante 72 horas en las líneas de metro de Tokio.',9.50,120,'../assets/documents/AR-01/Billetes/BilleteMetroTokyo.png','72 HORAS',50),
('JR Pass KIZUNA · 7 días','transporte','Bono ferroviario ficticio para continuar el viaje por Japón.',185.00,50,'../assets/documents/AR-01/05-JR-Pass.png','7 DÍAS',60),
('Cuaderno de viaje KIZUNA','merchandising','Cuaderno de tapa dura con sello de la División de Archivos Temporales.',18.00,40,'../assets/kizuna-logo-official.png','EDICIÓN KIZUNA',70)
on conflict do nothing;
