# Avisos de actividad del expediente

1. Ejecuta `supabase-communication-preferences.sql` en Supabase > SQL Editor.
2. Configura `RESEND_API_KEY` y `ACTIVITY_NOTIFICATION_EMAIL` en Edge Functions > Secrets.
   Si ya existen `ACCEPTANCE_NOTIFICATION_EMAIL` y `ACCEPTANCE_FROM_EMAIL`, se reutilizan automáticamente.
3. Despliega la función con el nombre `notify-expedient-activity`.

La función valida la sesión, comprueba que la actividad pertenece al usuario, consulta la preferencia administrativa y evita correos duplicados.
