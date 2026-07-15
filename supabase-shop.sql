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

-- Los pedidos siguen siendo simulados. Solo se registran cuando la compra la
-- realiza una cuenta autenticada, para poder consultar después su historial.
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

insert into public.shop_products(name,category,description,price,stock,image_url,badge,sort_order) values
('Museo Ghibli · Mitaka','museos','Entrada simulada con acceso programado al universo de Studio Ghibli.',10.00,18,'../assets/guides/tokio.png','MUY SOLICITADO',10),
('teamLab Planets · Tokio','museos','Experiencia artística inmersiva entre luz, agua y jardines digitales.',24.50,32,'../assets/sensations/memory.png','ENTRADA DIGITAL',20),
('Kiyomizu-dera · Kioto','templos','Acceso cultural simulado al histórico templo de las colinas de Higashiyama.',4.00,80,'../assets/guides/kioto.png','PATRIMONIO',30),
('Universal Studios Japan','parques','Pase de un día simulado para el parque de Osaka.',54.00,25,'../assets/guides/osaka.png','1 DÍA',40),
('Tokyo Subway Ticket · 72 h','transporte','Uso ilimitado simulado durante 72 horas en las líneas de metro de Tokio.',9.50,120,'../assets/documents/AR-01/Billetes/BilleteMetroTokyo.png','72 HORAS',50),
('JR Pass KIZUNA · 7 días','transporte','Bono ferroviario ficticio para continuar el viaje por Japón.',185.00,50,'../assets/documents/AR-01/05-JR-Pass.png','7 DÍAS',60),
('Cuaderno de viaje KIZUNA','merchandising','Cuaderno de tapa dura con sello de la División de Archivos Temporales.',18.00,40,'../assets/kizuna-logo-official.png','EDICIÓN KIZUNA',70),
('Museo Nacional de Tokio','museos','Entrada simulada para recorrer las colecciones de arte y patrimonio japonés de Ueno.',6.50,70,'../assets/guides/tokio.png','UENO',80),
('Museo Edo-Tokyo al Aire Libre','museos','Acceso ficticio a edificios históricos que reconstruyen la vida cotidiana del antiguo Tokio.',5.00,45,'../assets/documents/AR-03/Ciudades/01-Tokyo.png','ARQUITECTURA',90),
('Museo del Ferrocarril · Saitama','museos','Entrada simulada para descubrir la historia ferroviaria de Japón y sus primeros Shinkansen.',8.00,55,'../assets/sensations/shinkansen.png','FERROCARRIL',100),
('Museo de Arte Adachi','museos','Visita simulada a su colección de pintura japonesa y a uno de los jardines más reconocidos del país.',14.00,28,'../assets/sensations/tea.png','JARDÍN JAPONÉS',110),
('Fushimi Inari Taisha · Kioto','templos','Pase cultural ficticio con guía digital para recorrer los senderos de torii de Inari.',3.50,100,'../assets/documents/AR-03/Templos/001-Fushimi Inari.png','SENDA DE TORII',120),
('Kinkaku-ji · Pabellón Dorado','templos','Entrada simulada al templo dorado y sus jardines históricos en Kioto.',4.50,85,'../assets/documents/AR-03/Templos/003-Kinkaku ji.png','KIOTO',130),
('Sensō-ji · Asakusa','templos','Visita cultural ficticia con guía de audio por el templo más antiguo de Tokio.',3.00,110,'../assets/documents/AR-03/Templos/006-Senso ji.png','ASAKUSA',140),
('Tōdai-ji · Nara','templos','Acceso simulado al Gran Buda, el salón Daibutsuden y el entorno histórico de Nara.',5.00,75,'../assets/documents/AR-03/Templos/004-Todai ji.png','GRAN BUDA',150),
('Tokyo DisneySea','parques','Pase ficticio de un día para explorar los puertos y atracciones de Tokyo DisneySea.',58.00,22,'../assets/documents/AR-03/Ciudades/01-Tokyo.png','1 DÍA',160),
('Fuji-Q Highland','parques','Entrada simulada al parque de atracciones situado junto al monte Fuji.',43.00,30,'../assets/guides/hakone.png','VISTAS AL FUJI',170),
('Sanrio Puroland','parques','Acceso ficticio de un día al parque cubierto de Sanrio en Tama.',32.00,35,'../assets/sensations/memory.png','PARQUE CUBIERTO',180),
('Hakone Freepass · 2 días','transporte','Bono simulado para trenes, autobuses, teleférico y barco en la región de Hakone.',36.00,65,'../assets/documents/AR-01/Billetes/BilleteHakone.png','2 DÍAS',190),
('Kansai Railway Pass · 3 días','transporte','Pase ficticio para desplazamientos seleccionados por Osaka, Kioto, Nara y Kobe.',42.00,60,'../assets/documents/AR-01/Billetes/BilleteOsaka.png','3 DÍAS',200),
('Tarjeta Suica KIZUNA','transporte','Tarjeta de transporte simulada con saldo ficticio inicial para moverse por Tokio.',15.00,95,'../assets/documents/AR-01/Billetes/BilleteOdaiba.png','SALDO INICIAL',210),
('Pin esmaltado KIZUNA','merchandising','Insignia metálica con el torii y el sello rojo de KIZUNA Travel Bureau.',9.00,75,'../assets/kizuna-logo-official.png','SERIE 01',220),
('Bolsa de viaje KIZUNA','merchandising','Bolsa de algodón color marfil con la identidad de la División de Archivos Temporales.',16.00,45,'../assets/kizuna-logo-official.png','ALGODÓN',230),
('Taza Archivo Central','merchandising','Taza de cerámica con sello de archivo recuperado y numeración de expediente.',13.50,38,'../assets/kizuna-logo-official.png','ARCHIVO CENTRAL',240),
('Lámina Project Japan','merchandising','Lámina decorativa ficticia inspirada en el recorrido de Project Japan.',12.00,50,'../assets/kyoto-hero.png','A3',250)
on conflict do nothing;
