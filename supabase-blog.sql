-- KIZUNA · artículos del cuaderno de viaje
-- Ejecutar una vez en Supabase > SQL Editor.

create table if not exists public.blog_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (char_length(trim(category)) between 1 and 60),
  title text not null check (char_length(trim(title)) between 1 and 180),
  excerpt text not null check (char_length(trim(excerpt)) between 1 and 500),
  content text not null check (char_length(trim(content)) between 1 and 20000),
  is_published boolean not null default true,
  sort_order integer not null default 0,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_articles_public_order_idx on public.blog_articles (is_published, sort_order, published_at desc);
alter table public.blog_articles enable row level security;
grant select on public.blog_articles to anon, authenticated;
grant insert, update, delete on public.blog_articles to authenticated;

drop policy if exists "Anyone can read published blog articles" on public.blog_articles;
create policy "Anyone can read published blog articles" on public.blog_articles for select to anon, authenticated
using (is_published or coalesce(auth.jwt() -> 'app_metadata' ->> 'role','') = 'admin');

drop policy if exists "Admins can create blog articles" on public.blog_articles;
create policy "Admins can create blog articles" on public.blog_articles for insert to authenticated
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

drop policy if exists "Admins can update blog articles" on public.blog_articles;
create policy "Admins can update blog articles" on public.blog_articles for update to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

drop policy if exists "Admins can delete blog articles" on public.blog_articles;
create policy "Admins can delete blog articles" on public.blog_articles for delete to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

insert into public.blog_articles (slug,category,title,excerpt,content,sort_order) values
('como-viajar-en-shinkansen','GUÍA','Cómo viajar en Shinkansen','Todo lo que necesitas saber antes de subir al tren más puntual del mundo.','Viajar en Shinkansen es una de las formas más cómodas de recorrer Japón. Conviene reservar los trayectos principales con antelación, llegar al andén unos minutos antes y comprobar el número de vagón indicado en el billete.\n\nEl equipaje pequeño puede colocarse sobre el asiento. Para maletas de gran tamaño, algunos trenes requieren reservar un espacio específico. Durante el trayecto se agradece hablar en voz baja y evitar llamadas telefónicas en el vagón.\n\nNo olvides mirar por la ventanilla: en los días despejados, el trayecto entre Tokio y Kioto ofrece una vista inolvidable del monte Fuji.',10),
('etiqueta-en-japon','CULTURA','La etiqueta en Japón, sin complicaciones','Pequeños gestos que abren puertas y muestran respeto.','La cortesía japonesa se apoya en gestos sencillos. Saludar con una ligera inclinación, respetar las filas y mantener un tono de voz moderado son buenas formas de empezar.\n\nEn casas, alojamientos tradicionales y algunos restaurantes tendrás que quitarte los zapatos. Observa siempre lo que hacen quienes te reciben y utiliza las zapatillas que te ofrezcan.\n\nNo hace falta conocer todas las normas. Mostrar atención, agradecer y actuar con calma transmite el respeto necesario en casi cualquier situación.',20),
('que-comer-en-japon','SABORES','Qué comer en Japón: una primera ruta','De un ramen nocturno a un desayuno inolvidable en el mercado.','Una primera ruta gastronómica puede comenzar con un desayuno en un mercado local: pescado a la parrilla, arroz, sopa de miso y encurtidos. Al mediodía, un bol de donburi o una bandeja de sushi permiten probar distintos sabores sin detener el viaje.\n\nPor la noche llega el momento del ramen, el yakitori o una pequeña izakaya. Las especialidades cambian en cada región, así que merece la pena preguntar por el plato de la casa.\n\nDeja también espacio para lo inesperado: una pastelería de barrio, un puesto junto a un templo o una bebida encontrada en una máquina pueden convertirse en el recuerdo más vivo del día.',30)
on conflict (slug) do nothing;

-- Convierte los separadores de párrafo de los artículos iniciales en saltos reales.
update public.blog_articles
set content = replace(content, '\n', E'\n')
where slug in ('como-viajar-en-shinkansen','etiqueta-en-japon','que-comer-en-japon');
