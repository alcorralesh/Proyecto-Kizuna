import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json; charset=utf-8',
}

const response = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ error: 'Método no permitido.' }, 405)

  const authorization = request.headers.get('Authorization')
  if (!authorization) return response({ error: 'Autorización requerida.' }, 401)

  const userClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authorization } } },
  )
  const { data: userData, error: userError } = await userClient.auth.getUser()
  if (userError || !userData.user || userData.user.app_metadata?.role !== 'admin') {
    return response({ error: 'Acceso administrativo requerido.' }, 403)
  }

  // Solo esta función, alojada en Supabase, puede usar la clave de servicio.
  // Así ningún secreto administrativo llega nunca al navegador.
  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )
  const payload = await request.json()
  const action = String(payload.action ?? 'create')

  if (action === 'update-profile') {
    const userId = String(payload.userId ?? '')
    const displayName = String(payload.displayName ?? '').trim()
    const requestedEmail = String(payload.email ?? '').trim().toLowerCase()
    if (!userId || !displayName) return response({ error: 'Indica un nombre para el destinatario.' }, 400)

    const { data: currentProfile, error: currentProfileError } = await adminClient
      .from('expedient_profiles')
      .select('email, display_name')
      .eq('id', userId)
      .maybeSingle()
    if (currentProfileError) return response({ error: currentProfileError.message }, 400)
    if (!currentProfile) return response({ error: 'El destinatario ya no está disponible.' }, 404)

    const email = requestedEmail || String(currentProfile.email ?? '').trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response({ error: 'Indica un correo electrónico válido.' }, 400)
    }

    const { data: authData, error: authLookupError } = await adminClient.auth.admin.getUserById(userId)
    if (authLookupError || !authData.user) {
      return response({ error: authLookupError?.message ?? 'No se encontró la cuenta de acceso.' }, 400)
    }

    const previousEmail = String(authData.user.email ?? currentProfile.email ?? '').trim().toLowerCase()
    const emailChanged = email !== previousEmail
    const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
      ...(emailChanged ? { email, email_confirm: true } : {}),
      user_metadata: { ...(authData.user.user_metadata ?? {}), display_name: displayName },
    })
    if (authError) return response({ error: authError.message }, 400)

    const { error: profileError } = await adminClient
      .from('expedient_profiles')
      .update({ display_name: displayName, email })
      .eq('id', userId)
    if (profileError) {
      const { error: rollbackError } = await adminClient.auth.admin.updateUserById(userId, {
        ...(emailChanged ? { email: previousEmail, email_confirm: true } : {}),
        user_metadata: { ...(authData.user.user_metadata ?? {}), display_name: currentProfile.display_name },
      })
      if (rollbackError) console.error('No se pudo revertir la cuenta de Auth:', rollbackError.message)
      return response({ error: profileError.message }, 400)
    }
    return response({ id: userId, displayName, email })
  }

  if (action === 'set-active') {
    const userId = String(payload.userId ?? '')
    const active = Boolean(payload.active)
    if (!userId) return response({ error: 'Destinatario no identificado.' }, 400)
    if (userId === userData.user.id) return response({ error: 'No puedes desactivar tu propia cuenta administrativa.' }, 400)

    const { error: profileError } = await adminClient
      .from('expedient_profiles')
      .update({ is_active: active })
      .eq('id', userId)
    if (profileError) return response({ error: profileError.message }, 400)
    // La aplicación respeta is_active al iniciar sesión. El bloqueo de Auth
    // es una capa adicional, pero no debe bloquear el cambio administrativo.
    const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
      ban_duration: active ? 'none' : '876000h',
    })
    if (authError) console.warn('No se pudo sincronizar el bloqueo en Auth:', authError.message)
    return response({ id: userId, isActive: active })
  }

  if (action === 'reset-progress') {
    const userId = String(payload.userId ?? '')
    if (!userId) return response({ error: 'Destinatario no identificado.' }, 400)
    if (userId === userData.user.id) return response({ error: 'No puedes reiniciar tu propia cuenta administrativa.' }, 400)

    const cleanState = {
      read: [],
      mailRead: 0,
      finalFileSeen: false,
      finalAlertShown: false,
      completed: false,
      albertoMessageRead: false,
      comicReadPages: [],
    }
    const { error: progressError } = await adminClient
      .from('expedient_progress')
      .upsert({ user_id: userId, state: cleanState })
    if (progressError) return response({ error: progressError.message }, 400)

    // El historial anterior se elimina para dejar una única evidencia del reinicio.
    const { error: deleteLogError } = await adminClient
      .from('expedient_activity_log')
      .delete()
      .eq('user_id', userId)
    if (deleteLogError) return response({ error: deleteLogError.message }, 400)

    const { error: logError } = await adminClient
      .from('expedient_activity_log')
      .insert({
        user_id: userId,
        event_type: 'expedient_reset',
        details: { source: 'admin_panel', reset_by: userData.user.id },
      })
    if (logError) return response({ error: logError.message }, 400)

    return response({ id: userId, state: cleanState })
  }

  const normalizedEmail = String(payload.email ?? '').trim().toLowerCase()
  const normalizedName = String(payload.displayName ?? '').trim()
  if (!normalizedEmail || !normalizedEmail.includes('@')) return response({ error: 'Introduce un correo válido.' }, 400)
  if (String(payload.password ?? '').length < 8) return response({ error: 'La contraseña debe tener al menos 8 caracteres.' }, 400)

  const { data, error } = await adminClient.auth.admin.createUser({
    email: normalizedEmail,
    password: String(payload.password),
    email_confirm: true,
    user_metadata: { display_name: normalizedName || normalizedEmail },
  })
  if (error || !data.user) return response({ error: error?.message ?? 'No se pudo crear el usuario.' }, 400)

  await adminClient.from('expedient_profiles').upsert({
    id: data.user.id,
    email: data.user.email,
    display_name: normalizedName || data.user.email,
    is_active: true,
  })
  await adminClient.from('expedient_progress').upsert({
    user_id: data.user.id,
    state: { read: [], mailRead: 0, finalFileSeen: false, finalAlertShown: false, completed: false, albertoMessageRead: false, comicReadPages: [] },
  })

  return response({ id: data.user.id, email: data.user.email })
})
