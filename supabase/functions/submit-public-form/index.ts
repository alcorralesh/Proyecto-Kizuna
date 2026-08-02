import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json; charset=utf-8',
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders })

const clean = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max)
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const requestAddress = (request: Request) => {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || forwarded || 'unknown'
}

const digest = async (value: string) => {
  const bytes = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('')
}

const verifyTurnstile = async (request: Request, token: string, expectedAction: string) => {
  const secret = Deno.env.get('TURNSTILE_SECRET') ?? ''
  if (!secret) return true
  if (!token) return false
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: requestAddress(request) }),
  })
  if (!response.ok) return false
  const result = await response.json().catch(() => ({}))
  if (!result.success || result.action !== expectedAction) return false
  const allowedHosts = (Deno.env.get('TURNSTILE_ALLOWED_HOSTNAMES') ?? '')
    .split(',').map(value => value.trim().toLowerCase()).filter(Boolean)
  return !allowedHosts.length || allowedHosts.includes(String(result.hostname ?? '').toLowerCase())
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Método no permitido.' }, 405)

  const payload = await request.json().catch(() => null)
  if (!payload || typeof payload !== 'object') return json({ error: 'Solicitud no válida.' }, 400)

  // Los robots que rellenan el campo trampa reciben una respuesta neutra sin guardar nada.
  if (clean(payload.website, 200)) return json({ ok: true, discarded: true })
  const startedAt = Number(payload.startedAt)
  if (Number.isFinite(startedAt) && Date.now() - startedAt >= 0 && Date.now() - startedAt < 2500) {
    return json({ error: 'Espera unos segundos antes de enviar el formulario.', code: 'antispam_failed' }, 429)
  }

  const action = clean(payload.action, 30)
  if (!['contact', 'event'].includes(action)) return json({ error: 'Formulario desconocido.' }, 400)

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const admin = createClient(supabaseUrl, serviceRoleKey)
  const address = requestAddress(request)
  const salt = Deno.env.get('PUBLIC_FORM_RATE_LIMIT_SALT') || serviceRoleKey
  const identifier = await digest(`${salt}:${address}`)
  const limits = action === 'contact'
    ? [{ seconds: 900, maximum: 3 }, { seconds: 86400, maximum: 10 }]
    : [{ seconds: 3600, maximum: 10 }, { seconds: 86400, maximum: 30 }]

  for (const limit of limits) {
    const { data, error } = await admin.rpc('consume_public_submission_limit', {
      p_action: action,
      p_identifier_hash: identifier,
      p_window_seconds: limit.seconds,
      p_maximum: limit.maximum,
    })
    if (error) return json({ error: 'No se pudo comprobar el límite de envíos.' }, 503)
    if (data?.allowed === false) {
      return json({ error: 'Has realizado varios envíos. Espera antes de intentarlo de nuevo.', code: 'rate_limited', retryAfter: data.retry_after }, 429)
    }
  }

  const turnstileAction = action === 'contact' ? 'contact_message' : 'event_registration'
  if (!await verifyTurnstile(request, clean(payload.turnstileToken, 2048), turnstileAction)) {
    return json({ error: 'No se ha podido verificar el envío.', code: 'antispam_failed' }, 403)
  }

  if (action === 'contact') {
    const name = clean(payload.name, 120)
    const email = clean(payload.email, 254).toLowerCase()
    const message = clean(payload.message, 5000)
    if (!name || !validEmail(email) || !message) return json({ error: 'Completa correctamente todos los campos.' }, 400)
    const { data, error } = await admin.rpc('submit_contact_message', { p_name: name, p_email: email, p_message: message })
    if (error) {
      if (error.message.includes('CONTACT_DUPLICATE')) return json({ error: 'Ya hemos recibido esta consulta.', code: 'duplicate' }, 409)
      return json({ error: 'No se pudo guardar el mensaje.' }, 400)
    }
    return json({ ok: true, id: data })
  }

  const eventId = clean(payload.eventId, 80)
  const firstName = clean(payload.firstName, 80)
  const lastName = clean(payload.lastName, 120)
  const birthDate = clean(payload.birthDate, 10)
  if (!/^[0-9a-f-]{36}$/i.test(eventId) || !firstName || !lastName || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return json({ error: 'Completa correctamente todos los datos de la inscripción.' }, 400)
  }
  const { data, error } = await admin.rpc('register_for_event', {
    p_event_id: eventId,
    p_first_name: firstName,
    p_last_name: lastName,
    p_birth_date: birthDate,
  })
  if (error) {
    if (error.message.includes('EVENT_DUPLICATE')) return json({ error: 'Ya existe una inscripción con estos datos.', code: 'duplicate' }, 409)
    if (error.message.includes('No quedan plazas')) return json({ error: 'No quedan plazas.', code: 'full' }, 409)
    return json({ error: error.message.includes('cerrada') ? 'La inscripción está cerrada.' : 'No se pudo registrar la inscripción.' }, 400)
  }
  return json({ ok: true, id: data })
})
