-- KIZUNA · biblioteca pública de imágenes
-- Ejecutar una vez en Supabase > SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kizuna-assets',
  'kizuna-assets',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Kizuna assets public read" on storage.objects;
create policy "Kizuna assets public read" on storage.objects
for select to public using (bucket_id = 'kizuna-assets');

drop policy if exists "Kizuna assets admin insert" on storage.objects;
create policy "Kizuna assets admin insert" on storage.objects
for insert to authenticated with check (
  bucket_id = 'kizuna-assets'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Kizuna assets admin update" on storage.objects;
create policy "Kizuna assets admin update" on storage.objects
for update to authenticated using (
  bucket_id = 'kizuna-assets'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
) with check (
  bucket_id = 'kizuna-assets'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Kizuna assets admin delete" on storage.objects;
create policy "Kizuna assets admin delete" on storage.objects
for delete to authenticated using (
  bucket_id = 'kizuna-assets'
  and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
