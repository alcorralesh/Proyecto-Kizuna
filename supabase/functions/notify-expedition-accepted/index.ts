import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json; charset=utf-8',
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders })

const htmlEntities: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}
const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, character => htmlEntities[character] ?? character)

const responseLabels: Record<string, string> = {
  japon: 'Sí. Nos vamos a Japón.',
  ramen: 'Acepto... pero quiero mucho ramen.',
  claro: '¿De verdad pensabas que iba a decir que no?',
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Método no permitido.' }, 405)

  const authorization = request.headers.get('Authorization')
  if (!authorization) return json({ error: 'Autorización requerida.' }, 401)

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? ''
  const notificationEmail = Deno.env.get('ACCEPTANCE_NOTIFICATION_EMAIL') ?? ''
  const fromEmail = Deno.env.get('ACCEPTANCE_FROM_EMAIL') ?? 'KIZUNA Travel Bureau <onboarding@resend.dev>'

  if (!resendApiKey || !notificationEmail) {
    return json({ error: 'Configura RESEND_API_KEY y ACCEPTANCE_NOTIFICATION_EMAIL.' }, 503)
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  })
  const { data: userData, error: userError } = await userClient.auth.getUser()
  if (userError || !userData.user) return json({ error: 'Sesión no válida.' }, 401)

  const adminClient = createClient(supabaseUrl, serviceRoleKey)
  const [{ data: progress, error: progressError }, { data: profile, error: profileError }] = await Promise.all([
    adminClient.from('expedient_progress').select('state').eq('user_id', userData.user.id).maybeSingle(),
    adminClient.from('expedient_profiles').select('display_name,email').eq('id', userData.user.id).maybeSingle(),
  ])
  if (progressError || profileError) return json({ error: progressError?.message ?? profileError?.message }, 400)

  const state = progress?.state ?? {}
  if (!state.completed || !state.albertoResponseAccepted) {
    return json({ error: 'La expedición todavía no ha sido aceptada.' }, 409)
  }
  if (state.acceptanceEmailSentAt) {
    return json({ sent: false, duplicate: true, id: state.acceptanceEmailId ?? null })
  }

  const payload = await request.json().catch(() => ({}))
  const responseKey = String(payload.response ?? state.albertoResponse ?? '')
  const responseText = responseLabels[responseKey] ?? 'Aceptación confirmada.'
  const recipientName = profile?.display_name || userData.user.user_metadata?.display_name || profile?.email || userData.user.email || 'Destinatario autorizado'
  const recipientEmail = profile?.email || userData.user.email || ''
  const acceptedAt = state.albertoRespondedAt || new Date().toISOString()
  const logoUrl = `${supabaseUrl}/storage/v1/object/public/kizuna-assets/kizuna-logo-official.png`
  const formattedDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Madrid' }).format(new Date(acceptedAt))

  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#17201d;padding:28px 12px;color:#202726;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center"><table role="presentation" width="620" style="max-width:620px;width:100%;background:#f4ecdc;border-collapse:collapse;box-shadow:12px 14px 0 rgba(0,0,0,.22)"><tr><td style="padding:38px 46px 24px;text-align:center;border-bottom:1px solid #c8bca7"><img src="${logoUrl}" alt="KIZUNA" width="92" height="92" style="display:block;margin:0 auto 18px;object-fit:contain"><div style="color:#8c1e1b;font:11px monospace;letter-spacing:2px">DIVISIÓN DE ARCHIVOS TEMPORALES</div></td></tr><tr><td style="padding:42px 46px"><div style="color:#8c1e1b;font:11px monospace;letter-spacing:2px">EXPEDICIÓN CONFIRMADA</div><h1 style="margin:14px 0 25px;font:normal 44px/1.02 Georgia,serif">José ha tomado<br>la última decisión.</h1><p style="margin:0 0 26px;color:#555d58;font-size:15px;line-height:1.7">El destinatario ha completado su expediente y ha aceptado vivir esta historia de verdad.</p><table role="presentation" width="100%" style="border-collapse:collapse;background:#eee3cf;border-left:4px solid #8c1e1b"><tr><td style="padding:24px"><div style="margin-bottom:7px;color:#8c1e1b;font:10px monospace;letter-spacing:1px">RESPUESTA REGISTRADA</div><strong style="font:normal 23px/1.35 Georgia,serif">${escapeHtml(responseText)}</strong></td></tr></table><table role="presentation" width="100%" style="margin-top:28px;border-collapse:collapse;font-size:13px;line-height:1.7"><tr><td style="padding:7px 0;color:#7b7469">Destinatario</td><td style="padding:7px 0;text-align:right"><strong>${escapeHtml(recipientName)}</strong></td></tr><tr><td style="padding:7px 0;color:#7b7469">Correo</td><td style="padding:7px 0;text-align:right">${escapeHtml(recipientEmail)}</td></tr><tr><td style="padding:7px 0;color:#7b7469">Expediente</td><td style="padding:7px 0;text-align:right"><strong>JP-2026-001</strong></td></tr><tr><td style="padding:7px 0;color:#7b7469">Fecha</td><td style="padding:7px 0;text-align:right">${escapeHtml(formattedDate)}</td></tr></table><div style="margin-top:34px;padding-top:23px;border-top:1px solid #c8bca7;text-align:center;color:#8c1e1b;font:12px monospace;letter-spacing:1px">No se requieren más intervenciones.<br><strong>Buen viaje.</strong></div></td></tr></table></td></tr></table></body></html>`

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `kizuna-expedition-${userData.user.id}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notificationEmail],
      subject: `Expedición confirmada · ${recipientName}`,
      html,
    }),
  })
  const emailData = await emailResponse.json().catch(() => ({}))
  if (!emailResponse.ok) return json({ error: emailData?.message ?? 'No se pudo enviar el correo.' }, 502)

  const nextState = {
    ...state,
    acceptanceEmailSentAt: new Date().toISOString(),
    acceptanceEmailId: emailData.id ?? null,
  }
  const { error: updateError } = await adminClient
    .from('expedient_progress')
    .upsert({ user_id: userData.user.id, state: nextState, updated_at: new Date().toISOString() })
  if (updateError) console.warn('El correo se envió, pero no se pudo guardar su identificador:', updateError.message)

  return json({ sent: true, id: emailData.id ?? null })
})
