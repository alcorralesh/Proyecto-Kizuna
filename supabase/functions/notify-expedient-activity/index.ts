import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json; charset=utf-8',
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders })

const entities: Record<string, string> = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}
const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, character => entities[character] ?? character)

const preferenceFor = (activity: { event_type: string; document_id: string | null; details: Record<string, unknown> | null }) => {
  const details = activity.details ?? {}
  if (activity.event_type === 'supplementary_file_consulted' && activity.document_id === 'FINAL-01') {
    return { key: 'special:final-opened', action: 'Archivo final abierto', reference: 'FINAL-01' }
  }
  if (activity.event_type === 'document_confirmed' && activity.document_id === 'ALBERTO' && details.activity_kind === 'alberto_message_opened') {
    return { key: 'special:alberto-opened', action: 'Mensaje de Alberto abierto', reference: 'ALBERTO' }
  }
  if (activity.event_type === 'document_confirmed' && activity.document_id && activity.document_id !== 'ALBERTO') {
    return { key: `document:${activity.document_id}`, action: 'Lectura confirmada', reference: activity.document_id }
  }
  return null
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
  const notificationEmail = Deno.env.get('ACTIVITY_NOTIFICATION_EMAIL') ?? Deno.env.get('ACCEPTANCE_NOTIFICATION_EMAIL') ?? ''
  const fromEmail = Deno.env.get('ACTIVITY_FROM_EMAIL') ?? Deno.env.get('ACCEPTANCE_FROM_EMAIL') ?? 'KIZUNA Travel Bureau <onboarding@resend.dev>'
  if (!resendApiKey || !notificationEmail) return json({ error: 'Configura RESEND_API_KEY y ACTIVITY_NOTIFICATION_EMAIL.' }, 503)

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } })
  const { data: userData, error: userError } = await userClient.auth.getUser()
  if (userError || !userData.user) return json({ error: 'Sesión no válida.' }, 401)

  const payload = await request.json().catch(() => ({}))
  const activityId = Number(payload.activityId)
  if (!Number.isInteger(activityId) || activityId < 1) return json({ error: 'Actividad no válida.' }, 400)

  const adminClient = createClient(supabaseUrl, serviceRoleKey)
  const { data: activity, error: activityError } = await adminClient
    .from('expedient_activity_log')
    .select('id,user_id,event_type,document_id,details,created_at')
    .eq('id', activityId)
    .eq('user_id', userData.user.id)
    .maybeSingle()
  if (activityError || !activity) return json({ error: activityError?.message ?? 'Actividad no localizada.' }, 404)

  const notification = preferenceFor(activity)
  if (!notification) return json({ sent: false, ignored: true })

  const { data: preference, error: preferenceError } = await adminClient
    .from('expedient_communication_preferences')
    .select('enabled')
    .eq('event_key', notification.key)
    .maybeSingle()
  if (preferenceError) return json({ error: preferenceError.message }, 400)
  if (!preference?.enabled) return json({ sent: false, disabled: true })

  const { data: delivered } = await adminClient
    .from('expedient_communication_deliveries')
    .select('provider_id')
    .eq('activity_id', activity.id)
    .maybeSingle()
  if (delivered) return json({ sent: false, duplicate: true, id: delivered.provider_id })

  const { data: profile, error: profileError } = await adminClient
    .from('expedient_profiles')
    .select('display_name,email')
    .eq('id', userData.user.id)
    .maybeSingle()
  if (profileError) return json({ error: profileError.message }, 400)

  const recipientName = profile?.display_name || profile?.email || userData.user.email || 'Destinatario autorizado'
  const recipientAccount = profile?.email || userData.user.email || ''
  const logoUrl = `${supabaseUrl}/storage/v1/object/public/kizuna-assets/kizuna-logo-official.png`
  const formattedDate = new Intl.DateTimeFormat('es-ES', {dateStyle:'full',timeStyle:'short',timeZone:'Europe/Madrid'}).format(new Date(activity.created_at))
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#17201d;padding:28px 12px;color:#202726;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center"><table role="presentation" width="620" style="max-width:620px;width:100%;background:#f4ecdc;border-collapse:collapse;box-shadow:12px 14px 0 rgba(0,0,0,.22)"><tr><td style="padding:32px 42px 22px;text-align:center;border-bottom:1px solid #c8bca7"><img src="${logoUrl}" alt="KIZUNA" width="82" height="82" style="display:block;margin:0 auto 16px;object-fit:contain"><div style="color:#8c1e1b;font:11px monospace;letter-spacing:2px">DIVISIÓN DE ARCHIVOS TEMPORALES</div></td></tr><tr><td style="padding:38px 42px"><div style="color:#8c1e1b;font:11px monospace;letter-spacing:2px">ACTIVIDAD DEL EXPEDIENTE</div><h1 style="margin:14px 0 12px;font:normal 42px/1.05 Georgia,serif">${escapeHtml(notification.action)}</h1><p style="margin:0 0 28px;color:#555d58;font-size:15px;line-height:1.7">Se ha registrado nueva actividad en el Archivo Central de KIZUNA.</p><table role="presentation" width="100%" style="border-collapse:collapse;background:#eee3cf;border-left:4px solid #8c1e1b"><tr><td style="padding:23px"><div style="margin-bottom:7px;color:#8c1e1b;font:10px monospace;letter-spacing:1px">REGISTRO</div><strong style="font:normal 25px Georgia,serif">${escapeHtml(notification.reference)}</strong></td></tr></table><table role="presentation" width="100%" style="margin-top:25px;border-collapse:collapse;font-size:13px;line-height:1.7"><tr><td style="padding:7px 0;color:#7b7469">Destinatario</td><td style="padding:7px 0;text-align:right"><strong>${escapeHtml(recipientName)}</strong></td></tr><tr><td style="padding:7px 0;color:#7b7469">Cuenta</td><td style="padding:7px 0;text-align:right">${escapeHtml(recipientAccount)}</td></tr><tr><td style="padding:7px 0;color:#7b7469">Fecha</td><td style="padding:7px 0;text-align:right">${escapeHtml(formattedDate)}</td></tr></table><div style="margin-top:30px;padding-top:21px;border-top:1px solid #c8bca7;text-align:center;color:#8c1e1b;font:11px monospace;letter-spacing:1px">AVISO AUTOMÁTICO · ARCHIVO CENTRAL</div></td></tr></table></td></tr></table></body></html>`

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization:`Bearer ${resendApiKey}`,'Content-Type':'application/json','Idempotency-Key':`kizuna-activity-${activity.id}`},
    body: JSON.stringify({from:fromEmail,to:[notificationEmail],subject:`KIZUNA · ${notification.action} · ${notification.reference} · ${recipientName}`,html}),
  })
  const emailData = await emailResponse.json().catch(() => ({}))
  if (!emailResponse.ok) return json({ error: emailData?.message ?? 'No se pudo enviar el correo.' }, 502)

  const { error: deliveryError } = await adminClient.from('expedient_communication_deliveries').insert({
    activity_id: activity.id,
    event_key: notification.key,
    recipient: notificationEmail,
    provider_id: emailData.id ?? null,
  })
  if (deliveryError && deliveryError.code !== '23505') console.warn('No se pudo registrar la entrega:', deliveryError.message)
  return json({ sent: true, id: emailData.id ?? null })
})

