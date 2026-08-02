# Protección de los formularios públicos

La web ya no debe escribir directamente en `contact_messages` ni ejecutar públicamente `register_for_event`. Todos los envíos pasan por la función `submit-public-form`.

## Activación en Supabase

1. Ejecuta `supabase-public-form-protection.sql` en **Supabase → SQL Editor**.
2. Despliega la función:

   `supabase functions deploy submit-public-form --no-verify-jwt`

3. Configura un valor secreto y aleatorio para cifrar los identificadores usados por los límites:

   `supabase secrets set PUBLIC_FORM_RATE_LIMIT_SALT="un-valor-largo-y-aleatorio"`

## Activar Cloudflare Turnstile

Los límites y el campo trampa funcionan sin Turnstile. Para añadir la comprobación invisible:

1. Crea un widget en Cloudflare Turnstile para el dominio público de KIZUNA.
2. Copia la clave pública en `TURNSTILE_SITE_KEY` dentro de `public-form-security.js`.
3. Guarda el secreto únicamente en Supabase:

   `supabase secrets set TURNSTILE_SECRET="tu-secreto" TURNSTILE_ALLOWED_HOSTNAMES="tu-dominio.com"`

Nunca escribas `TURNSTILE_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` ni `PUBLIC_FORM_RATE_LIMIT_SALT` en archivos de la web.

## Límites aplicados

- Contacto: 3 envíos cada 15 minutos y 10 al día.
- Eventos: 10 intentos cada hora y 30 al día.
- Contacto repetido: mismo correo y mensaje durante 24 horas.
- Evento repetido: mismo evento, nombre, apellidos y fecha de nacimiento.

Las direcciones de red no se guardan: la función genera un identificador SHA-256 con una sal secreta.
