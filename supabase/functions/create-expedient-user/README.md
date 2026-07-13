# Crear destinatarios desde el panel

Esta función permite que una cuenta cuyo `app_metadata.role` sea `admin` cree nuevos destinatarios desde el panel privado.

## Publicación desde el panel de Supabase

1. Abre **Edge Functions** en el proyecto `kizuna-progress`.
2. Pulsa **Create a new function** y usa exactamente este nombre: `create-expedient-user`.
3. Sustituye el contenido del editor por el de `index.ts` de esta carpeta.
4. Pulsa **Deploy function**.

No copies ninguna clave de servicio en la web. La función utiliza las variables protegidas que Supabase proporciona dentro de Edge Functions.

## Uso

Entra en el área privada con la cuenta administrativa, pulsa **Crear destinatario**, rellena nombre, correo y una contraseña temporal de al menos ocho caracteres. El destinatario aparecerá en la lista y podrá iniciar sesión inmediatamente.
