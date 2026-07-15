# Aviso por correo al aceptar la expedición

Esta función envía al administrador una notificación con diseño KIZUNA cuando el destinatario acepta la decisión final. La llamada está autenticada, comprueba que el expediente esté completado y evita duplicados.

## 1. Crear una cuenta en Resend

Crea una API key en Resend. Para producción, verifica tu dominio y utiliza una dirección de ese dominio como remitente.

## 2. Configurar secretos en Supabase

En **Edge Functions → Secrets**, añade:

- `RESEND_API_KEY`: la API key de Resend.
- `ACCEPTANCE_NOTIFICATION_EMAIL`: el correo donde quieres recibir el aviso.
- `ACCEPTANCE_FROM_EMAIL`: por ejemplo `KIZUNA Travel Bureau <notificaciones@tudominio.com>`.

Para una prueba inicial puedes usar `KIZUNA Travel Bureau <onboarding@resend.dev>` como remitente. Resend limita este remitente de prueba al correo propietario de su cuenta.

## 3. Publicar la función

Desde el panel de Supabase crea o despliega una Edge Function llamada exactamente:

`notify-expedition-accepted`

Su contenido debe ser el archivo `index.ts` de esta carpeta.

También puedes desplegarla con la CLI:

```sh
supabase functions deploy notify-expedition-accepted
```

Los secretos se leen únicamente en Supabase y nunca se envían al navegador.
