# Web Push de mensajes del expediente

1. Ejecuta `supabase-web-push.sql`.
2. Genera un par VAPID ejecutando `node scripts/generate-vapid-keys.mjs`
   desde la raíz del proyecto. También sirve `npx web-push generate-vapid-keys`.
3. Configura estos secretos en Supabase Edge Functions:
   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `VAPID_SUBJECT` con un valor como `mailto:tu-correo@dominio.com`
4. Despliega la función con el nombre `send-expedient-push`. Con la CLI:
   `supabase functions deploy send-expedient-push --no-verify-jwt`.

La función no confía en el navegador para enviar mensajes: valida el JWT y el
rol administrativo. Las confirmaciones `received` y `opened` utilizan un token
aleatorio distinto para cada entrega y no exponen la sesión del destinatario.
