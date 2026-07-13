-- KIZUNA · ampliación del panel de administración
-- Ejecuta este bloque una sola vez en Supabase > SQL Editor.
-- Añade un estado visible para activar o desactivar destinatarios.

alter table public.expedient_profiles
  add column if not exists is_active boolean not null default true;

update public.expedient_profiles
set is_active = true
where is_active is null;

-- La Edge Function actúa con el rol interno de servicio para gestionar
-- destinatarios. Estos permisos no se exponen al navegador.
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.expedient_profiles to service_role;
grant select, insert, update, delete on table public.expedient_progress to service_role;
