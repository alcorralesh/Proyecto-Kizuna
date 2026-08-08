import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json; charset=utf-8',
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders })

const safeDeepLink = (value: unknown) => {
  const link = String(value ?? '').trim().replace(/^\/+/, '')
  if (!link || /^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('//') || /[\u0000-\u001f]/.test(link)) {
    return 'expediente/index.html'
  }
  return link.slice(0, 500)
}

const readKeyMap = (name: string) => {
  const raw = Deno.env.get(name)
  if (!raw) return ''
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'string') return parsed
    if (!parsed || typeof parsed !== 'object') return ''
    const values = Object.values(parsed).filter(value => typeof value === 'string') as string[]
    return String((parsed as Record<string, unknown>).default ?? values[0] ?? '')
  } catch {
    return ''
  }
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Método no permitido.' }, 405)

  const payload = await request.json().catch(() => ({}))
  const action = String(payload.action ?? 'send')
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceRoleKey =
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ||
    Deno.env.get('SUPABASE_SECRET_KEY') ||
    readKeyMap('SUPABASE_SECRET_KEYS')
  const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY') ?? ''
  const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
  const vapidSubject = Deno.env.get('VAPID_SUBJECT') ?? ''

  if (action === 'public-key') {
    if (!vapidPublicKey) return json({ error: 'Web Push no está configurado.' }, 503)
    return json({ publicKey: vapidPublicKey })
  }

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Supabase configuration is incomplete', {
      hasUrl: Boolean(supabaseUrl),
      hasSecretKey: Boolean(serviceRoleKey),
    })
    return json({
      error: 'La función no dispone de la clave secreta necesaria para consultar Supabase.',
    }, 503)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey)

  if (action === 'track') {
    const deliveryId = String(payload.deliveryId ?? '')
    const trackingToken = String(payload.trackingToken ?? '')
    const event = String(payload.event ?? '')
    if (!deliveryId || !trackingToken || !['received', 'opened'].includes(event)) {
      return json({ error: 'Seguimiento no válido.' }, 400)
    }
    const { data: delivery, error: deliveryError } = await adminClient
      .from('expedient_push_deliveries')
      .select('id,received_at,opened_at')
      .eq('id', deliveryId)
      .eq('tracking_token', trackingToken)
      .maybeSingle()
    if (deliveryError || !delivery) return json({ error: 'Entrega no localizada.' }, 404)
    const now = new Date().toISOString()
    const changes = event === 'opened'
      ? { status: 'opened', received_at: delivery.received_at ?? now, opened_at: delivery.opened_at ?? now, updated_at: now }
      : { status: delivery.opened_at ? 'opened' : 'received', received_at: delivery.received_at ?? now, updated_at: now }
    const { error } = await adminClient.from('expedient_push_deliveries').update(changes).eq('id', delivery.id)
    return error ? json({ error: error.message }, 400) : json({ tracked: true })
  }

  const authorization = request.headers.get('Authorization')
  if (!authorization) return json({ error: 'Autorización requerida.' }, 401)
  const accessToken = authorization.replace(/^Bearer\s+/i, '').trim()
  if (!accessToken) return json({ error: 'Autorización requerida.' }, 401)
  const { data: userData, error: userError } = await adminClient.auth.getUser(accessToken)
  if (userError || !userData.user) return json({ error: 'Sesión no válida.' }, 401)
  if (userData.user.app_metadata?.role !== 'admin') return json({ error: 'Acceso administrativo requerido.' }, 403)
  if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
    return json({ error: 'Configura los secretos VAPID de la función.' }, 503)
  }

  const messageId = String(payload.messageId ?? '')
  if (!messageId) return json({ error: 'Mensaje no válido.' }, 400)
  const { data: message, error: messageError } = await adminClient
    .from('expedient_messages')
    .select('id,user_id,subject,body,priority,deep_link,send_push')
    .eq('id', messageId)
    .maybeSingle()
  if (messageError) {
    console.error('Message lookup failed', {
      messageId,
      code: messageError.code,
      message: messageError.message,
      details: messageError.details,
      hint: messageError.hint,
    })
    return json({
      error: 'No se pudo consultar el mensaje en Supabase.',
      detail: messageError.message,
      code: messageError.code,
    }, 500)
  }
  if (!message) return json({ error: 'Mensaje no localizado.', messageId }, 404)
  if (!message.send_push) return json({ sent: 0, ignored: true })

  const signalCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: subscriptions, error: subscriptionsError } = await adminClient
    .from('expedient_push_subscriptions')
    .select('id,endpoint,p256dh,auth')
    .eq('user_id', message.user_id)
    .is('revoked_at', null)
    .eq('permission_state', 'granted')
    .eq('subscription_present', true)
    .gte('permission_checked_at', signalCutoff)
  if (subscriptionsError) return json({ error: subscriptionsError.message }, 400)
  if (!subscriptions?.length) return json({ sent: 0, noSubscription: true })

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
  let accepted = 0
  let failed = 0
  for (const subscription of subscriptions) {
    const { data: delivery, error: deliveryError } = await adminClient
      .from('expedient_push_deliveries')
      .upsert({
        message_id: message.id,
        subscription_id: subscription.id,
        status: 'queued',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'message_id,subscription_id' })
      .select('id,tracking_token')
      .single()
    if (deliveryError || !delivery) {
      failed += 1
      continue
    }
    const notification = JSON.stringify({
      title: String(message.subject ?? 'KIZUNA').slice(0, 120),
      body: String(message.body ?? '').slice(0, 700),
      messageId: message.id,
      deliveryId: delivery.id,
      trackingToken: delivery.tracking_token,
      trackingUrl: `${supabaseUrl}/functions/v1/send-expedient-push`,
      deepLink: safeDeepLink(message.deep_link),
      openMessage: !message.deep_link,
      priority: message.priority,
    })
    try {
      const result = await webpush.sendNotification({
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      }, notification, { TTL: 60 * 60 * 24 * 7, urgency: message.priority === 'urgent' ? 'high' : 'normal' })
      const now = new Date().toISOString()
      await adminClient.from('expedient_push_deliveries').update({
        status: 'accepted',
        accepted_at: now,
        provider_status: result.statusCode,
        error: null,
        updated_at: now,
      }).eq('id', delivery.id)
      accepted += 1
    } catch (error) {
      const statusCode = Number((error as { statusCode?: number })?.statusCode || 0)
      const now = new Date().toISOString()
      await adminClient.from('expedient_push_deliveries').update({
        status: 'failed',
        failed_at: now,
        provider_status: statusCode || null,
        error: String((error as Error)?.message || error).slice(0, 1000),
        updated_at: now,
      }).eq('id', delivery.id)
      if ([404, 410].includes(statusCode)) {
        await adminClient.from('expedient_push_subscriptions')
          .update({ revoked_at: now, revoked_reason: 'provider', subscription_present: false, updated_at: now })
          .eq('id', subscription.id)
      }
      failed += 1
    }
  }
  return json({ sent: accepted, failed, subscriptions: subscriptions.length })
})
