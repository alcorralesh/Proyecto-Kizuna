if(!window.kizunaStorage){const storageAssetsScript=document.createElement('script');storageAssetsScript.src='../storage-assets.js';document.head.appendChild(storageAssetsScript)}
const sequence=['KTB-001','KTB-002','KTB-003','KTB-004','KTB-005','KTB-006','AR-01','KTB-007','AR-02','KTB-008','AR-03','KTB-009','AR-04','KTB-010','AR-05','KTB-011','AR-06','KTB-012','KTB-013','KTB-014'];
const documentImages=new Set(['KTB-001','KTB-002','KTB-003','KTB-004','KTB-005','KTB-006','KTB-007','KTB-008','KTB-009','KTB-010','KTB-011','KTB-012','KTB-013','KTB-014']);
const nestedKtb=new Set(['KTB-007','KTB-008','KTB-009','KTB-010','KTB-011','KTB-012']);
const folders={'AR-01':{title:'Documentación operativa',update:'KTB-007',files:[{id:'AR01-01',title:'Carta de bienvenida',src:'01-Carta-de-bienvenida.png'},{id:'AR01-02',title:'Acuerdo de participación',src:'02-Acuerdo-de-participacion.png'},{id:'AR01-03',title:'Garantía de expedición',src:'03-Garantia-de-expedicion.png'}]},'AR-02':{title:'Planificación de la expedición',update:'KTB-008',files:[{id:'AR02-01',title:'Itinerario clasificado',src:'01-Itinerario.png'},{id:'AR02-02',title:'Mapa de la aventura',src:'02-Mapa.png'}]},'AR-04':{title:'Archivos culturales',update:'KTB-010',files:[{id:'AR04-01',title:'Guía de etiqueta japonesa',src:'01-Guia-de-etiqueta.png'},{id:'AR04-02',title:'Guía gastronómica · Parte 1 de 2',src:'02-Guia-de-gastronomia-parte-1.png'},{id:'AR04-03',title:'Guía gastronómica · Parte 2 de 2',src:'03-Guia-de-gastronomia-parte-2.png'}]},'AR-05':{title:'Archivos personales',update:'KTB-011',files:[{id:'AR05-01',title:'Carta desde Japón',src:'01-Carta-desde-Japon.png'},{id:'AR05-02',title:'Carta de feliz cumpleaños',src:'02-Carta-feliz-cumpleanos.png'}]},'AR-06':{title:'Datos recuperados del dispositivo',update:'KTB-012',files:[{id:'AR06-01',title:'Historial de ubicaciones',src:'01-Historial-de-ubicaciones.png'},{id:'AR06-02',title:'Rutas GPS caminadas',src:'02-Rutas-GPS-caminadas.png'},{id:'AR06-03',title:'Miniaturas de fotografías',src:'03-Miniaturas-de-fotografias.png'},{id:'AR06-04',title:'Conversaciones recuperadas',src:'04-Conversaciones-recuperadas.png'},{id:'AR06-05',title:'Historial de búsquedas',src:'05-Historial-de-busquedas.png'},{id:'AR06-06',title:'Estadísticas del dispositivo',src:'06-Estadisticas.png'},{id:'AR06-07',title:'Archivos irrecuperables',src:'07-Archivos-irrecuperables.png'}]}};
const folderDetails={'AR-01':['Documentación operativa','Esta carpeta contiene los documentos de apertura de la expedición.'],'AR-02':['Planificación de la expedición','Rutas, reservas y preparativos que hicieron posible el comienzo de esta historia.'],'AR-03':['Registros geográficos','Mapas, coordenadas y lugares que ya estaban esperando ser recordados.'],'AR-04':['Archivos culturales','Documentación sobre tradiciones, historia y pequeños gestos que dan sentido al viaje.'],'AR-05':['Archivos personales','Registros íntimos que confirman que el destino nunca fue solo un lugar.'],'AR-06':['Datos recuperados del dispositivo','Archivos recuperados parcialmente. Su integridad es limitada, pero su valor permanece intacto.']};
const ar01Tickets=[{id:'AR01-TICKET-01',title:'Billete Enoden',src:'BilleteEnoden.png'},{id:'AR01-TICKET-02',title:'Billete Hakone',src:'BilleteHakone.png'},{id:'AR01-TICKET-03',title:'Billete Kioto',src:'BilleteKyoto.png'},{id:'AR01-TICKET-04',title:'Billete Metro Tokio',src:'BilleteMetroTokyo.png'},{id:'AR01-TICKET-05',title:'Billete Miyajima',src:'BilleteMiyajima.png'},{id:'AR01-TICKET-06',title:'Billete Odaiba',src:'BilleteOdaiba.png'},{id:'AR01-TICKET-07',title:'Billete Osaka',src:'BilleteOsaka.png'}];
folders['AR-01'].files.push({id:'AR01-04',title:'Boarding pass · José Cuadrado',src:'04-Boarding-pass-Jose.png'},{id:'AR01-05',title:'JR Pass',src:'05-JR-Pass.png'},{id:'AR01-BILLETES',title:'Carpeta · Billetes de transporte',mosaic:'tickets'});
const ar03Cities=['01-Tokyo.png','02-Tokyo_barrios.png','03-Kyoto.png','04-Osaka.png','05-Nara.png','06-Hiroshima.png','07-Miyajima.png','08-Nikko.png','09-Hakone.png','10-Kamakura.png','11-Yokohama.png','12-Kanazawa.png'];
const ar03Temples=['001-Fushimi Inari.png','002-Kiyomizu Dera.png','003-Kinkaku ji.png','004-Todai ji.png','005-Itsukushima.png','006-Senso ji.png','007-Meiji jingu.png','008-Kotoku in.png','009-Ginkaku ji.png','010-Tenryu ji.png','011-Kasuga taisha.png','012-nikko tosho gu.png','013-Hase dera.png','014-Yasaka shrine.png','015-Arashiyama bamboo grove.png','016-Heian jingu.png'];
const supabaseUrl='https://vcwqkideizdrhzpbghkj.supabase.co';
const supabaseKey='sb_publishable_h3pjxT8UPZkYqRhLskVdlA_m-ulI4EF';
let supabaseClient=null,currentUser=null,remoteState=null,supabaseScript=null,currentDisplayName='Destinatario autorizado';
const recipientName=()=>currentDisplayName||'Destinatario autorizado';
const updateRecipientName=()=>{
  const fullName=recipientName().trim();
  const parts=fullName.split(/\s+/);
  const first=parts.shift()||fullName;
  const last=parts.join(' ');
  const welcome=document.querySelector('#auth-welcome-name');
  const headFirst=document.querySelector('#case-name-first');
  const headLast=document.querySelector('#case-name-last');
  if(welcome)welcome.textContent=fullName;
  if(headFirst)headFirst.textContent=first;
  if(headLast){headLast.textContent=last;headLast.hidden=!last}
};
const originalUpdateCompletionHeader=updateCompletionHeader;
updateCompletionHeader=done=>{
  originalUpdateCompletionHeader(done);
  const completion=document.querySelector('#completion-record');
  if(!completion)return;
  const recipient=[...completion.querySelectorAll('span')].find(item=>item.textContent.trim().startsWith('DESTINATARIO'));
  const recipientValue=recipient?.querySelector('strong');
  if(recipientValue)recipientValue.textContent=recipientName().toLocaleUpperCase('es-ES');
};
const localState=()=>({read:JSON.parse(localStorage.getItem('kizuna-read')||'[]'),mailRead:Number(localStorage.getItem('kizuna-mail-read')||0),finalFileSeen:localStorage.getItem('kizuna-final-file-seen')==='true',completed:localStorage.getItem('kizuna-complete')==='true',comicReadPages:JSON.parse(localStorage.getItem('kizuna-comic-read-pages')||'[]'),legalAccepted:localStorage.getItem('kizuna-legal-accepted')==='true',loadingSeen:localStorage.getItem('kizuna-loading-seen')==='true'});
const getState=()=>remoteState||localState();
const read=()=>getState().read||[];
const persistRemote=async()=>{if(!supabaseClient||!currentUser||!remoteState)return;const {error}=await supabaseClient.from('expedient_progress').upsert({user_id:currentUser.id,state:remoteState,updated_at:new Date().toISOString()});if(error)console.error('No se pudo guardar el progreso remoto.',error)};
const recordActivity=async(eventType,documentId=null,details={})=>{
  if(!currentUser)return;
  try{
    const client=await getSupabase();
    const {error}=await client.from('expedient_activity_log').insert({
      user_id:currentUser.id,
      event_type:eventType,
      document_id:documentId,
      details
    });
    if(error)throw error;
  }catch(error){
    // El expediente continúa aunque el registro secundario no esté disponible.
    console.warn('No se pudo registrar la actividad del expediente.',error);
  }
};
const patchState=changes=>{if(remoteState){remoteState={...remoteState,...changes};persistRemote();return}const state={...localState(),...changes};localStorage.setItem('kizuna-read',JSON.stringify(state.read));localStorage.setItem('kizuna-mail-read',String(state.mailRead));localStorage.setItem('kizuna-final-file-seen',String(state.finalFileSeen));localStorage.setItem('kizuna-complete',String(state.completed));localStorage.setItem('kizuna-comic-read-pages',JSON.stringify(state.comicReadPages||[]));localStorage.setItem('kizuna-legal-accepted',String(Boolean(state.legalAccepted)));localStorage.setItem('kizuna-loading-seen',String(Boolean(state.loadingSeen)))};
const save=items=>patchState({read:items});
const getSupabase=async()=>{if(supabaseClient)return supabaseClient;if(!window.supabase){if(!supabaseScript){supabaseScript=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';script.onload=resolve;script.onerror=reject;document.head.appendChild(script)})}await supabaseScript}supabaseClient=window.supabase.createClient(supabaseUrl,supabaseKey);return supabaseClient};
const loadRemoteProgress=async user=>{currentUser=user;const client=await getSupabase();const [{data,error},{data:profile,error:profileError}]=await Promise.all([client.from('expedient_progress').select('state').eq('user_id',user.id).maybeSingle(),client.from('expedient_profiles').select('display_name,email,is_active').eq('id',user.id).maybeSingle()]);if(error)throw error;if(profileError)console.warn('No se pudo leer el nombre del perfil.',profileError);if(profile?.is_active===false){await client.auth.signOut();throw new Error('Este acceso ha sido desactivado por la División de Archivos Temporales.')}currentDisplayName=profile?.display_name||user.user_metadata?.display_name||user.email?.split('@')[0]||'Destinatario autorizado';updateRecipientName();if(data?.state){remoteState={read:[],mailRead:0,finalFileSeen:false,completed:false,comicReadPages:[],legalAccepted:false,loadingSeen:false,...data.state};return}remoteState=localState();await persistRemote()};
const recordComicPage=async page=>{
  const viewed=Array.isArray(getState().comicReadPages)?getState().comicReadPages:[];
  if(viewed.includes(page))return;
  const comicReadPages=[...viewed,page].sort((a,b)=>a-b);
  patchState({comicReadPages});
  await recordActivity('comic_page_read','AC-01',{read:comicReadPages.length,total:11,page});
};
const markFinalFileConsulted=async source=>{
  if(!getState().finalFileSeen)await recordActivity('supplementary_file_consulted','FINAL-01',{source});
  patchState({finalFileSeen:true});
};
const originalOpenComicViewer=openComicViewer;
openComicViewer=page=>{
  const available=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`).filter(id=>read().includes(id)).length;
  if(available)void recordComicPage(Math.min(Math.max(1,page),available));
  return originalOpenComicViewer(page);
};
const originalOpenFinalLocatedFile=openFinalLocatedFile;
openFinalLocatedFile=()=>{
  if(!getState().finalFileSeen)void markFinalFileConsulted('direct_access');
  return originalOpenFinalLocatedFile();
};
const isFolder=id=>id.startsWith('AR-');const fileFolder=id=>Object.keys(folders).find(key=>folders[key].files.some(file=>file.id===id));
const nativeGetItem=Storage.prototype.getItem,nativeSetItem=Storage.prototype.setItem;
Storage.prototype.getItem=function(key){if(this===localStorage&&remoteState&&key==='kizuna-read')return JSON.stringify(remoteState.read||[]);if(this===localStorage&&remoteState&&key==='kizuna-mail-read')return String(remoteState.mailRead||0);if(this===localStorage&&remoteState&&key==='kizuna-final-file-seen')return String(Boolean(remoteState.finalFileSeen));if(this===localStorage&&remoteState&&key==='kizuna-complete')return String(Boolean(remoteState.completed));return nativeGetItem.call(this,key)};
Storage.prototype.setItem=function(key,value){if(this===localStorage&&remoteState&&key==='kizuna-read'){patchState({read:JSON.parse(value||'[]')});return}if(this===localStorage&&remoteState&&key==='kizuna-mail-read'){patchState({mailRead:Number(value||0)});return}if(this===localStorage&&remoteState&&key==='kizuna-final-file-seen'){patchState({finalFileSeen:value==='true'});return}if(this===localStorage&&remoteState&&key==='kizuna-complete'){if(value==='false')patchState({completed:false});return}return nativeSetItem.call(this,key,value)};
setTimeout(()=>{
  // Sustituye el acceso local por la identidad real de Supabase cuando el
  // resto de la interfaz ya se ha inicializado.
  document.querySelector('#access-form').onsubmit=async event=>{
    event.preventDefault();
    const email=document.querySelector('#username').value.trim();
    const password=document.querySelector('#password').value;
    const submit=document.querySelector('#access-form button');
    message.textContent='Verificando autorización…';
    submit.disabled=true;
    try{
      const client=await getSupabase();
       const {data,error}=await client.auth.signInWithPassword({email,password});
       if(error)throw error;
       await loadRemoteProgress(data.user);
       await recordActivity('login',null,{source:'private_access'});
       message.textContent='';
      openDashboard();
    }catch(error){message.textContent='No se han podido verificar las credenciales de acceso.';console.error(error)}finally{submit.disabled=false}
  };
  document.querySelector('#exit').onclick=async()=>{try{await recordActivity('logout',null,{source:'private_access'});if(supabaseClient)await supabaseClient.auth.signOut()}finally{currentUser=null;remoteState=null;location.href='../index.html'}};
  let finalSequenceActive=false,finalPopupPending=false;
  const originalStartFinale=startFinale,originalFinalAlert=showFinalFileAlert;
  startFinale=()=>{finalSequenceActive=true;finalPopupPending=true;return originalStartFinale()};
  showFinalFileAlert=()=>{if(finalSequenceActive||finalPopupPending)return;return originalFinalAlert()};
  viewer.addEventListener('close',()=>{if(!finalPopupPending)return;finalPopupPending=false;setTimeout(()=>showFinalFileAlert(),250)});
  const openGuaranteedFinalAlert=()=>{
    if(getState().finalAlertShown)return;
    patchState({completed:true,finalAlertShown:true});
    document.querySelector('#final-file-alert')?.remove();
    const alert=document.createElement('section');
    alert.id='final-file-alert';
    alert.style.cssText='position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:#17211ddd;color:#f6f0e2';
    alert.innerHTML='<div style="width:min(530px,88vw);padding:46px;background:#efe4cf;color:#202726;border:2px solid #7e1b19;box-shadow:14px 16px 0 #0005"><p style="margin:0 0 18px;color:#7e1b19;font:10px var(--mono);letter-spacing:.12em">ATENCIÓN REQUERIDA · VERIFICACIÓN FINAL</p><h2 style="font:600 47px/.92 var(--serif);margin:0">Se ha localizado<br>un <em style="color:#7e1b19">archivo.</em></h2><p style="font:14px/1.7 var(--mono);margin:28px 0">Durante la verificación final del expediente se ha detectado un registro no catalogado.</p><p style="font:11px/1.8 var(--mono)">CLASIFICACIÓN: NO CATALOGADO<br>ESTADO: PENDIENTE DE REVISIÓN</p><button id="final-file-alert-open" style="margin-top:22px;background:#7e1b19;color:#fff;border:0;padding:15px 18px;font:10px var(--mono);cursor:pointer">Consultar archivo →</button></div>';
    document.body.appendChild(alert);
    document.querySelector('#final-file-alert-open').onclick=async()=>{alert.remove();await markFinalFileConsulted('final_alert');openFinalLocatedFile()};
  };
  const originalShowFinaleMessage=showFinaleMessage;
  showFinaleMessage=()=>{
    originalShowFinaleMessage();
    const continueButton=document.querySelector('#final-continue');
    if(continueButton)continueButton.onclick=()=>{viewer.close();patchState({completed:true,finalFileSeen:false});setTimeout(()=>{render();openGuaranteedFinalAlert()},180)};
  };
  openDashboard=()=>{
    const done=read(),state=getState(),consulted=sequence.filter(id=>done.includes(id)),total=sequence.length;
    const completed=Boolean(state.completed||done.includes('KTB-014'));
    const reviewed=completed?total:consulted.length;
    const percentage=completed?100:Math.round(reviewed/total*100);
    const lastDocument=completed?'KTB-014':consulted.at(-1)||'Ninguno';
    const nextDocument=completed?null:sequence.find(id=>!done.includes(id))||'KTB-001';
    const accessLevel=completed?'VIII':roman(Math.max(1,Math.ceil(percentage/12.5)));
    const status=completed?'Expediente cerrado':reviewed?'En curso':'Pendiente de inicio';
    const username=currentUser?.email?.split('@')[0]||'jose.cuadrado';
    const safe=value=>String(value).replace(/[&<>'"]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
    const caseMessage=completed
      ?'<p>Historial completo localizado.</p><p>Verificando cierre del expediente…</p><p>Secuencia de lectura completada.</p><p>Integridad documental confirmada.</p>'
      :reviewed
        ?'<p>Historial de consulta localizado.</p><p>Restaurando sesión…</p><p>Permisos activos verificados.</p><p>Secuencia de lectura sincronizada.</p>'
        :'<p>No se han encontrado consultas anteriores.</p><p>Inicializando expediente…</p><p>Nivel de acceso I concedido.</p><p>Documento inicial disponible: <strong>KTB-001</strong></p>';
    const closingMessage=completed
      ?'<strong>Expediente archivado.</strong><br>Consulta histórica autorizada.'
      :reviewed
        ?`<strong>Sesión restaurada.</strong><br>Continuación disponible desde: <strong>${safe(nextDocument)}</strong>`
        :'<strong>Expediente preparado.</strong><br>Documento inicial disponible: <strong>KTB-001</strong>';
    access.hidden=true;
    loading.hidden=false;
    gate.hidden=true;
    dash.hidden=true;
    const log=document.querySelector('#auth-log');
    log.innerHTML=`<p class="auth-live-message">Conectando con el Archivo Central…</p><section class="auth-recipient" hidden><p>DESTINATARIO AUTORIZADO</p><h2>${safe(recipientName())}</h2><dl><div><dt>Usuario</dt><dd>${safe(username)}</dd></div><div><dt>Expediente asociado</dt><dd>KTB-EXP-2026-JP-00184</dd></div></dl></section><div class="auth-case-message" hidden>${caseMessage}</div><section class="auth-state-summary" hidden><p>ESTADO DEL EXPEDIENTE</p><dl><div><dt>Documentos consultados</dt><dd>${reviewed} de ${total}</dd></div><div><dt>Último documento leído</dt><dd>${safe(lastDocument)}</dd></div><div><dt>Progreso total</dt><dd>${percentage} %</dd></div><div><dt>Nivel de acceso</dt><dd>${accessLevel}</dd></div><div><dt>Estado</dt><dd>${status}</dd></div></dl><div class="auth-expedient-progress"><i style="width:${percentage}%"></i></div></section><p class="auth-closing-message" hidden>${closingMessage}</p><p class="auth-routing-message" hidden>Derivando consulta a la<br><strong>División de Archivos Temporales…</strong></p>`;
    const masterProgress=document.querySelector('#auth-master-progress');
    masterProgress.parentElement.hidden=false;
    const live=log.querySelector('.auth-live-message');
    const recipient=log.querySelector('.auth-recipient');
    const caseBlock=log.querySelector('.auth-case-message');
    const summary=log.querySelector('.auth-state-summary');
    const closing=log.querySelector('.auth-closing-message');
    const routing=log.querySelector('.auth-routing-message');
    const skip=document.querySelector('#auth-skip');
    const continueButton=document.querySelector('#auth-continue')||document.createElement('button');
    continueButton.id='auth-continue';continueButton.type='button';continueButton.hidden=true;
    if(!continueButton.isConnected)skip.before(continueButton);
    routing.innerHTML='Verificaci&oacute;n completada.<br><strong>El expediente est&aacute; preparado para su consulta.</strong>';
    const timers=[];
    let finished=false;
    const show=element=>{element.hidden=false;requestAnimationFrame(()=>element.classList.add('is-visible'))};
    const setProgress=value=>masterProgress.style.width=`${value}%`;
    const schedule=(delay,action)=>timers.push(setTimeout(()=>{if(!finished)action()},delay));
    const showCompletion=()=>{
      if(finished)return;
      finished=true;timers.forEach(clearTimeout);setProgress(100);patchState({loadingSeen:true});
      live.hidden=true;caseBlock.hidden=true;show(recipient);show(summary);show(closing);show(routing);
      continueButton.innerHTML=`${completed?'Consultar expediente archivado':reviewed?'Continuar expediente':'Iniciar consulta'} <b>→</b>`;
      continueButton.hidden=false;skip.hidden=true;
    };
    const advance=()=>{
      loading.hidden=true;
      dash.hidden=true;gate.hidden=false;
    };
    continueButton.onclick=advance;
    skip.hidden=!state.loadingSeen;
    skip.onclick=showCompletion;
    masterProgress.style.width='0';
    schedule(100,()=>setProgress(12));
    schedule(650,()=>{live.textContent='Validando credenciales…';setProgress(24)});
    schedule(1250,()=>{live.textContent='Identidad confirmada.';show(recipient);setProgress(36)});
    schedule(1950,()=>{live.textContent='Recuperando historial de consulta…';setProgress(48)});
    schedule(2450,()=>{live.textContent='Comprobando permisos activos…';setProgress(58)});
    schedule(2950,()=>{live.textContent='Calculando progreso del expediente…';setProgress(68)});
    schedule(3450,()=>{live.hidden=true;show(caseBlock);setProgress(76)});
    schedule(4050,()=>{caseBlock.hidden=true;show(summary);setProgress(84)});
    schedule(4650,()=>{show(closing);setProgress(92)});
    schedule(5150,()=>{show(routing);setProgress(98)});
    schedule(5700,showCompletion);
  };
  mark.onclick=async()=>{
    const done=read(),alreadyRead=done.includes(active);
    if(!alreadyRead){done.push(active);save(done)}
    if(alreadyRead){viewer.close();render();return}
    if(!alreadyRead&&active.startsWith('AR'))await recordActivity('document_confirmed',active,{source:'recovered_file'});
    if(active.startsWith('AR03-')){if(ar03Complete())openAr03();else if(active==='AR03-CARTA')openAr03Mosaic('temples');else openAr03Mosaic(active.startsWith('AR03-C-')?'cities':'temples');return}
    if(readerReturnToFolder){readerBackFolder.click();return}
    const parent=fileFolder(active);
    if(parent){openFolder(parent);return}
    if(active.startsWith('KTB-')){
      const id=active;
      await recordActivity('document_confirmed',id,{source:'recipient_consultation'});
      syncKtb(id,()=>{if(id==='KTB-014'){localStorage.setItem('kizuna-complete','true');startFinale()}else{viewer.close();render()}});
      return;
    }
    viewer.close();render();
  };
},0);
const progressKeys=[...Array.from({length:14},(_,i)=>`KTB-${String(i+1).padStart(3,'0')}`),...Object.values(folders).flatMap(folder=>folder.files.map(file=>file.id)),'AR03-CARTA',...ar03Cities.map((_,i)=>`AR03-C-${i}`),...ar03Temples.map((_,i)=>`AR03-T-${i}`),...ar01Tickets.map(ticket=>ticket.id),'AR06-PROTOCOL'];
const name=id=>isFolder(id)?`Carpeta ${id} · ${folderDetails[id][0]}`:`Expediente ${id}`;const gate=document.querySelector('#gate'),access=document.querySelector('#access'),adminAccess=document.querySelector('#admin-access'),loading=document.querySelector('#auth-loading'),dash=document.querySelector('#dashboard'),message=document.querySelector('#access-message'),adminMessage=document.querySelector('#admin-access-message'),viewer=document.querySelector('#viewer'),mark=document.querySelector('#mark-read'),next=document.querySelector('#next-doc'),readerBackFolder=document.querySelector('#reader-back-folder'),readerBackExpedient=document.querySelector('#reader-back-expedient');let active='',readerReturnToFolder=null,readerCanConfirm=false,readerChromeActive='';
const comicPrevious=document.createElement('button'),comicFollowing=document.createElement('button');comicPrevious.id='comic-prev-fixed';comicPrevious.type='button';comicPrevious.textContent='← Página anterior';comicPrevious.hidden=true;comicFollowing.id='comic-next-fixed';comicFollowing.type='button';comicFollowing.textContent='Página siguiente →';comicFollowing.hidden=true;readerBackFolder.before(comicPrevious,comicFollowing);
const adminAccessMode=new URLSearchParams(location.search).get('admin')==='1';
if(!adminAccessMode)access.hidden=true;
if(adminAccessMode){gate.hidden=true;access.hidden=true;adminAccess.hidden=false;setTimeout(()=>document.querySelector('#admin-username').focus(),0)}
const imageToolsStyle=document.createElement('style');imageToolsStyle.textContent=`.image-inspector{position:relative;max-height:64vh;overflow:auto;background:#1b211f;border:1px solid #8b887d;cursor:grab;touch-action:pan-y pinch-zoom;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;outline:none}.image-inspector:active{cursor:grabbing}.image-inspector img{display:block;max-width:none!important;max-height:none!important;margin:0!important;user-select:none;-webkit-user-select:none;-webkit-user-drag:none;transform-origin:0 0}.image-tools{display:flex;align-items:center;gap:7px;margin:10px 0 20px}.image-tools button{min-width:44px;min-height:44px;border:1px solid #7e1b19;background:#f7edda;color:#7e1b19;padding:9px 12px;font:10px var(--mono);cursor:pointer}.image-tools button:hover,.image-tools button:focus-visible{background:#7e1b19;color:#fff}.image-tools .image-gesture-hint{margin-left:auto;font:9px/1.5 var(--mono);color:#7e1b19;text-align:right}.image-fullscreen-exit{display:none;position:fixed;right:max(14px,env(safe-area-inset-right));top:max(14px,env(safe-area-inset-top));z-index:20002;min-width:48px;min-height:48px;border:1px solid #fff;background:#171d1ddd;color:#fff;padding:10px 14px;font:10px var(--mono);cursor:pointer}.image-inspector:fullscreen,.image-inspector.is-fallback-fullscreen{box-sizing:border-box;max-height:none;width:100%;height:100%;padding:max(12px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));background:#171d1b;overflow:auto;display:block;touch-action:none}.image-inspector.is-fallback-fullscreen{position:fixed;inset:0;z-index:20000}.image-inspector:fullscreen .image-fullscreen-exit,.image-inspector.is-fallback-fullscreen .image-fullscreen-exit{display:block}.image-inspector:fullscreen img,.image-inspector.is-fallback-fullscreen img{height:auto!important}.image-inspector.is-zoomed{touch-action:none}@media(max-width:700px){.image-inspector{max-height:62vh}.image-tools{flex-wrap:wrap}.image-tools button{flex:1}.image-tools button[data-action="full"]{flex-basis:100%}.image-tools .image-gesture-hint{width:100%;margin:3px 0 0;text-align:center}}`;document.head.appendChild(imageToolsStyle);
const enhanceDocumentImagesLegacy=()=>{
  document.querySelectorAll('#doc-body > img:not([data-inspected])').forEach(img=>{
    img.dataset.inspected='true';
    let scale=1,dragging=false,pinchStart=null,previousBodyOverflow='';
    const pointers=new Map(),frame=document.createElement('div'),tools=document.createElement('div'),exitFullButton=document.createElement('button');
    frame.className='image-inspector';
    frame.tabIndex=0;
    tools.className='image-tools';
    exitFullButton.type='button';
    exitFullButton.className='image-fullscreen-exit';
    exitFullButton.textContent='Salir';
    img.replaceWith(frame);
    frame.appendChild(img);
    frame.appendChild(exitFullButton);
    img.style.width='100%';
    img.style.height='auto';
    img.draggable=false;
    tools.innerHTML='<button type="button" data-action="out" aria-label="Reducir zoom">−</button><button type="button" data-action="fit">Ajustar · 100 %</button><button type="button" data-action="in" aria-label="Aumentar zoom">+</button><button type="button" data-action="full">Pantalla completa</button><span class="image-gesture-hint">Pellizca para ampliar · Arrastra para recorrer</span>';
    frame.after(tools);

    const fitButton=tools.querySelector('[data-action="fit"]'),fullButton=tools.querySelector('[data-action="full"]');
    const useTouchFullscreen=(navigator.maxTouchPoints||0)>0||window.matchMedia?.('(pointer: coarse)').matches;
    const enterFallbackFullscreen=()=>{previousBodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';frame.classList.add('is-fallback-fullscreen');fullButton.textContent='Salir de pantalla completa';frame.focus()};
    const exitFallbackFullscreen=()=>{frame.classList.remove('is-fallback-fullscreen');document.body.style.overflow=previousBodyOverflow;fullButton.textContent='Pantalla completa'};
    const exitFullscreen=async()=>{if(frame.classList.contains('is-fallback-fullscreen'))exitFallbackFullscreen();else if(document.fullscreenElement)await document.exitFullscreen()};
    const clamp=value=>Math.min(5,Math.max(1,value));
    const update=()=>{
      img.style.width=`${scale*100}%`;
      fitButton.textContent=`Ajustar · ${Math.round(scale*100)} %`;
      frame.classList.toggle('is-zoomed',scale>1.01);
    };
    const setScale=(nextScale,clientX,clientY)=>{
      nextScale=clamp(nextScale);
      if(Math.abs(nextScale-scale)<.001)return;
      const rect=frame.getBoundingClientRect(),viewX=(clientX??rect.left+frame.clientWidth/2)-rect.left,viewY=(clientY??rect.top+frame.clientHeight/2)-rect.top,contentX=frame.scrollLeft+viewX,contentY=frame.scrollTop+viewY,ratio=nextScale/scale;
      scale=nextScale;
      update();
      frame.scrollLeft=contentX*ratio-viewX;
      frame.scrollTop=contentY*ratio-viewY;
    };
    const distance=points=>Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);
    const center=points=>({x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2});
    const canDrag=()=>scale>1.01||frame.classList.contains('is-fallback-fullscreen')||document.fullscreenElement===frame;
    const restartDrag=()=>{
      const remaining=[...pointers.values()][0];
      dragging=Boolean(remaining&&canDrag());
      if(remaining){remaining.startX=remaining.x;remaining.startY=remaining.y;remaining.scrollX=frame.scrollLeft;remaining.scrollY=frame.scrollTop}
    };

    tools.onclick=async event=>{
      const action=event.target.dataset.action;
      if(!action)return;
      if(action==='in')setScale(scale+.25);
      if(action==='out')setScale(scale-.25);
      if(action==='fit'){scale=1;update();frame.scrollTo({left:0,top:0,behavior:'smooth'})}
      if(action==='full'){
        try{if(document.fullscreenElement||frame.classList.contains('is-fallback-fullscreen'))await exitFullscreen();else if(useTouchFullscreen)enterFallbackFullscreen();else if(frame.requestFullscreen)await frame.requestFullscreen();else enterFallbackFullscreen()}
        catch(error){console.warn('Se utilizará el modo de pantalla completa compatible.',error);enterFallbackFullscreen()}
      }
    };
    exitFullButton.onclick=exitFullscreen;

    frame.addEventListener('pointerdown',event=>{
      const point={x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,scrollX:frame.scrollLeft,scrollY:frame.scrollTop};
      pointers.set(event.pointerId,point);
      frame.setPointerCapture?.(event.pointerId);
      if(pointers.size===2){const points=[...pointers.values()];pinchStart={distance:Math.max(1,distance(points)),scale};dragging=false}
      else if(canDrag())dragging=true;
    });
    frame.addEventListener('pointermove',event=>{
      const point=pointers.get(event.pointerId);
      if(!point)return;
      point.x=event.clientX;point.y=event.clientY;
      if(pointers.size>=2&&pinchStart){
        event.preventDefault();
        const points=[...pointers.values()].slice(0,2),focus=center(points);
        setScale(pinchStart.scale*distance(points)/pinchStart.distance,focus.x,focus.y);
      }else if(dragging){
        event.preventDefault();
        frame.scrollLeft=point.scrollX-(event.clientX-point.startX);
        frame.scrollTop=point.scrollY-(event.clientY-point.startY);
      }
    });
    const releasePointer=event=>{pointers.delete(event.pointerId);pinchStart=null;restartDrag()};
    frame.addEventListener('pointerup',releasePointer);
    frame.addEventListener('pointercancel',releasePointer);
    frame.addEventListener('dblclick',event=>{event.preventDefault();setScale(scale>1.01?1:2.5,event.clientX,event.clientY)});
    frame.addEventListener('wheel',event=>{if(!event.ctrlKey)return;event.preventDefault();setScale(scale+(event.deltaY<0?.2:-.2),event.clientX,event.clientY)},{passive:false});
    frame.addEventListener('fullscreenchange',()=>{pointers.clear();pinchStart=null;dragging=false;fullButton.textContent=document.fullscreenElement===frame?'Salir de pantalla completa':'Pantalla completa'});
    frame.addEventListener('keydown',event=>{if(event.key==='Escape'&&frame.classList.contains('is-fallback-fullscreen')){event.preventDefault();exitFallbackFullscreen()}});
    update();
  });
};

imageToolsStyle.remove();
const readerTools=document.querySelector('.reader-tools'),readerZoom=document.querySelector('#reader-zoom'),readerStatus=document.querySelector('#reader-status'),readerCode=document.querySelector('#reader-code'),readerContent=document.querySelector('.reader-content'),readerPosition=document.querySelector('.reader-position'),readerHint=document.querySelector('.reader-hint');
let readerPreviousBodyOverflow='';
const setReaderFullscreenState=activeState=>{
  viewer.classList.toggle('is-reader-fullscreen',activeState);
  readerTools.querySelector('[data-reader-action="full"]').setAttribute('aria-label',activeState?'Salir de pantalla completa':'Pantalla completa');
};
const exitReaderFullscreen=async()=>{
  if(viewer.classList.contains('is-fallback-fullscreen')){
    viewer.classList.remove('is-fallback-fullscreen');
    document.body.style.overflow=readerPreviousBodyOverflow;
    setReaderFullscreenState(false);
  }else if(document.fullscreenElement===viewer)await document.exitFullscreen();
};
const syncReaderChrome=()=>{
  readerCode.textContent=active||'ARCHIVO';
  const hasImage=Boolean(document.querySelector('#doc-body>.image-inspector'));
  const comicImage=document.querySelector('#doc-body img[src*="/AC-01/Pagina-"]');
  const comicPage=Number(document.querySelector('#doc-body')?.dataset.comicPage||0);
  const comicPages=Number(document.querySelector('#doc-body')?.dataset.comicPages||0);
  if(active!==readerChromeActive||mark.style.display!=='none'){readerCanConfirm=mark.style.display!=='none';readerChromeActive=active}
  readerReturnToFolder=ar01Tickets.some(ticket=>ticket.id===active)?'tickets':active==='AR01-BILLETES'?'AR-01':active==='AR03-CARTA'||active.startsWith('AR03-T-')?'temples':active.startsWith('AR03-C-')?'cities':active==='AR03-cities'||active==='AR03-temples'?'AR-03':folders[active]?null:fileFolder(active)||null;
  const folderView=Boolean(folders[active]||active==='AR-03'||active==='AR01-BILLETES'||active==='AR03-cities'||active==='AR03-temples');
  readerContent.classList.toggle('has-image',hasImage);
  readerContent.classList.toggle('is-folder',folderView);
  readerPosition.innerHTML=comicImage?`PÁGINA ${comicPage} <span>·</span> ${comicPages} DE 11 RECUPERADAS`:folderView?'ÍNDICE DE CARPETA <span>·</span> ARCHIVO RECUPERADO':'DOCUMENTO COMPLETO <span>·</span> FINAL DEL DOCUMENTO';
  readerHint.innerHTML=comicImage?'Navega entre las páginas disponibles':folderView?'Selecciona un documento para abrirlo':'Desplaza para leer <span>·</span> Pellizca para ampliar';
  readerTools.hidden=!hasImage;
  comicPrevious.hidden=!comicImage;
  comicFollowing.hidden=!comicImage;
  const alreadyRead=Boolean(active&&read().includes(active));
  mark.style.display=readerCanConfirm&&!alreadyRead?'inline-block':'none';
  readerBackFolder.hidden=!readerReturnToFolder;
  readerStatus.classList.toggle('is-confirmed',readerCanConfirm&&alreadyRead);
  readerStatus.textContent=!readerCanConfirm?'CONSULTA INTERNA':alreadyRead?'LECTURA CONFIRMADA':'PENDIENTE DE CONFIRMACIÓN';
};
const enhanceDocumentImages=()=>{
  document.querySelectorAll('#doc-body>img:not([data-inspected])').forEach(img=>{
    img.dataset.inspected='true';
    let scale=1,dragging=false,pinchStart=null;
    const pointers=new Map(),frame=document.createElement('div');
    frame.className='image-inspector';frame.tabIndex=0;
    img.replaceWith(frame);frame.appendChild(img);
    img.style.width='100%';img.style.height='auto';img.draggable=false;
    const clamp=value=>Math.min(5,Math.max(1,value));
    const update=()=>{img.style.width=`${scale*100}%`;readerZoom.textContent=`${Math.round(scale*100)} %`;frame.classList.toggle('is-zoomed',scale>1.01)};
    const setScale=(nextScale,clientX,clientY)=>{
      nextScale=clamp(nextScale);if(Math.abs(nextScale-scale)<.001)return;
      const rect=frame.getBoundingClientRect(),viewX=(clientX??rect.left+frame.clientWidth/2)-rect.left,viewY=(clientY??rect.top+frame.clientHeight/2)-rect.top,contentX=frame.scrollLeft+viewX,contentY=frame.scrollTop+viewY,ratio=nextScale/scale;
      scale=nextScale;update();frame.scrollLeft=contentX*ratio-viewX;frame.scrollTop=contentY*ratio-viewY;
    };
    const distance=points=>Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y),center=points=>({x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2});
    const canDrag=()=>true;
    const restartDrag=()=>{const point=[...pointers.values()][0];dragging=Boolean(point&&canDrag());if(point){point.startX=point.x;point.startY=point.y;point.scrollX=frame.scrollLeft;point.scrollY=frame.scrollTop}};
    readerTools.onclick=async event=>{
      const action=event.target.closest('[data-reader-action]')?.dataset.readerAction;if(!action)return;
      if(action==='in')setScale(scale+.25);
      if(action==='out')setScale(scale-.25);
      if(action==='fit'){scale=1;update();frame.scrollTo({left:0,top:0,behavior:'smooth'})}
      if(action==='full'){
        try{
          if(document.fullscreenElement===viewer||viewer.classList.contains('is-fallback-fullscreen'))await exitReaderFullscreen();
          else if((navigator.maxTouchPoints||0)>0||window.matchMedia?.('(pointer: coarse)').matches){readerPreviousBodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';viewer.classList.add('is-fallback-fullscreen');setReaderFullscreenState(true)}
          else if(viewer.requestFullscreen)await viewer.requestFullscreen();
        }catch(error){console.warn('Se utilizará el modo de pantalla completa compatible.',error);readerPreviousBodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';viewer.classList.add('is-fallback-fullscreen');setReaderFullscreenState(true)}
      }
    };
    frame.addEventListener('pointerdown',event=>{const point={x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,scrollX:frame.scrollLeft,scrollY:frame.scrollTop};pointers.set(event.pointerId,point);frame.setPointerCapture?.(event.pointerId);if(pointers.size===2){const points=[...pointers.values()];pinchStart={distance:Math.max(1,distance(points)),scale};dragging=false}else if(canDrag())dragging=true});
    frame.addEventListener('pointermove',event=>{const point=pointers.get(event.pointerId);if(!point)return;point.x=event.clientX;point.y=event.clientY;if(pointers.size>=2&&pinchStart){event.preventDefault();const points=[...pointers.values()].slice(0,2),focus=center(points);setScale(pinchStart.scale*distance(points)/pinchStart.distance,focus.x,focus.y)}else if(dragging){event.preventDefault();frame.scrollLeft=point.scrollX-(event.clientX-point.startX);frame.scrollTop=point.scrollY-(event.clientY-point.startY)}});
    const releasePointer=event=>{pointers.delete(event.pointerId);pinchStart=null;restartDrag()};frame.addEventListener('pointerup',releasePointer);frame.addEventListener('pointercancel',releasePointer);
    frame.addEventListener('dblclick',event=>{event.preventDefault();setScale(scale>1.01?1:2.5,event.clientX,event.clientY)});
    frame.addEventListener('wheel',event=>{event.preventDefault();if(event.ctrlKey)setScale(scale+(event.deltaY<0?.2:-.2),event.clientX,event.clientY);else{frame.scrollTop+=event.deltaY;frame.scrollLeft+=event.deltaX}},{passive:false});
    update();
  });
  syncReaderChrome();
};
document.addEventListener('fullscreenchange',()=>setReaderFullscreenState(document.fullscreenElement===viewer));
readerBackExpedient.onclick=()=>{viewer.close();render()};
readerBackFolder.onclick=()=>{if(readerReturnToFolder==='tickets')openTicketMosaic();else if(readerReturnToFolder==='cities'||readerReturnToFolder==='temples')openAr03Mosaic(readerReturnToFolder);else if(readerReturnToFolder==='AR-03')openAr03();else if(readerReturnToFolder)openFolder(readerReturnToFolder)};
viewer.addEventListener('close',()=>{readerReturnToFolder=null;readerCanConfirm=false;readerChromeActive='';comicPrevious.hidden=true;comicFollowing.hidden=true;const paper=document.querySelector('.paper'),body=document.querySelector('#doc-body');paper.style.width='';paper.style.maxWidth='';paper.style.padding='';body.style.maxWidth='';body.style.margin='';delete body.dataset.comicPage;delete body.dataset.comicPages;if(viewer.classList.contains('is-fallback-fullscreen')){viewer.classList.remove('is-fallback-fullscreen');document.body.style.overflow=readerPreviousBodyOverflow}if(document.fullscreenElement===viewer)document.exitFullscreen();setReaderFullscreenState(false)});
const documentImageObserver=new MutationObserver(()=>enhanceDocumentImages());documentImageObserver.observe(document.querySelector('#doc-body'),{childList:true});document.addEventListener('keydown',event=>{if(!viewer.open)return;if(event.key==='ArrowLeft'&&!comicPrevious.hidden&&!comicPrevious.disabled){event.preventDefault();comicPrevious.click()}if(event.key==='ArrowRight'&&!comicFollowing.hidden&&!comicFollowing.disabled){event.preventDefault();comicFollowing.click()}});
const allowed=id=>{const index=sequence.indexOf(id);return index===0||read().includes(sequence[index-1])};const roman=value=>{const table=[[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let result='';for(const [number,symbol] of table){while(value>=number){result+=symbol;value-=number}}return result};
const mailboxButton=document.createElement('button'),mailbox=document.createElement('aside'),publicReturnButton=document.createElement('button');mailboxButton.id='mailbox-toggle';mailboxButton.type='button';mailboxButton.textContent='Buzón';mailboxButton.style.cssText='border:1px solid #7e1b19;background:#f6f0e2;color:#7e1b19;padding:10px;font:9px var(--mono);cursor:pointer';mailbox.id='mailbox';mailbox.style.cssText='display:none;position:fixed;right:5vw;top:82px;z-index:30;width:min(450px,calc(100vw - 32px));max-height:72vh;overflow:auto;background:#f6f0e2;color:#202726;border:1px solid #8b887d;box-shadow:12px 14px 30px #0004;padding:22px';publicReturnButton.id='return-public-site';publicReturnButton.type='button';publicReturnButton.textContent='Volver a la web pública';publicReturnButton.onclick=()=>{location.href='../index.html'};const headerActions=document.querySelector('.header-actions');headerActions?.prepend(mailboxButton);headerActions?.insertBefore(publicReturnButton,document.querySelector('#exit'));dash.appendChild(mailbox);
const mailboxMessages=()=>{const done=read(),items=[];for(let i=1;i<=14;i++){const id=`KTB-${String(i).padStart(3,'0')}`;if(!done.includes(id))continue;items.push({id:id,subject:`Lectura confirmada · ${id}`,body:`La consulta del documento ${id} ha sido registrada correctamente. La secuencia autorizada ha sido actualizada.`,order:i})}if(done.includes('KTB-003'))items.push({id:'AC-01',subject:'Archivo complementario localizado',body:'Durante la reconstrucción del expediente se ha localizado el Archivo Complementario AC-01. Su contenido permanece en proceso de clasificación.',order:3.2});if(done.includes('KTB-006'))items.push({id:'AR-01',subject:'Acceso a Archivo Recuperado 01',body:'La documentación operativa ha quedado disponible para su consulta conforme al protocolo de custodia.',order:6.2});if(done.includes('KTB-011'))items.push({id:'AR-06',subject:'Acceso a datos recuperados',body:'Se ha autorizado la consulta de los datos recuperados del dispositivo asociado al expediente.',order:11.2});if(done.includes('KTB-014'))items.push({id:'KTB-014-FINAL',subject:'Expediente archivado',body:'La consulta ha finalizado. El expediente PROJECT JAPAN ha sido archivado con integridad documental preservada.',order:14.2});if(done.includes('AR01-BILLETES'))items.push({id:'AR01-BILLETES',subject:'Registros de transporte verificados',body:'Todos los billetes recuperados de AR-01 han sido confirmados y archivados.',order:6.5});if(ar03Complete())items.push({id:'AR03',subject:'Registros geográficos completados',body:'Las guías de ciudades y las entradas de templos han sido incorporadas al expediente.',order:8.5});if(done.includes('KTB-014'))items.push({id:'FINAL-01',subject:'ATENCIÓN · Archivo localizado',body:'Se ha localizado un archivo durante la verificación final del expediente. Clasificación: No catalogado. Estado: Pendiente de revisión.',order:100,urgent:true});return items.sort((a,b)=>b.order-a.order)};
const renderMailbox=()=>{const items=mailboxMessages(),seen=Number(localStorage.getItem('kizuna-mail-read')||0),unread=Math.max(0,items.length-seen);mailboxButton.textContent=`Buzón${unread?` · ${unread}`:''}`;mailbox.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #b4ae9f;padding-bottom:14px"><div><p style="margin:0;color:#7e1b19;font:10px var(--mono);letter-spacing:.1em">SISTEMA DE NOTIFICACIONES</p><h3 style="margin:6px 0 0;font:31px var(--serif)">Buzón del expediente</h3></div><button id="mailbox-close" style="border:0;background:none;font:25px var(--serif);color:#7e1b19;cursor:pointer">×</button></div><p style="font:10px/1.6 var(--mono)">${items.length} comunicaciones registradas · más recientes primero</p>${items.map((item,index)=>`<details style="border-top:1px solid ${item.urgent?'#7e1b19':'#c5bdaa'};padding:13px 0;${item.urgent?'background:#f4dfd5;margin:0 -10px;padding:15px 10px;border-left:4px solid #7e1b19':''}"><summary style="cursor:pointer;list-style:none;font:600 13px var(--serif)"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${item.urgent||index<unread?'#7e1b19':'#9a998f'};margin-right:8px"></span>${item.subject}<small style="display:block;margin:5px 0 0 16px;font:9px var(--mono);color:#7e1b19">DIVISIÓN DE ARCHIVOS TEMPORALES · ${item.id}</small></summary><p style="margin:12px 0 0 16px;font:12px/1.65 var(--mono)">${item.body}</p>${item.id==='FINAL-01'?'<button id="final-file-from-mail" style="margin:10px 0 0 16px;background:#7e1b19;color:#fff;border:0;padding:10px 13px;font:9px var(--mono);cursor:pointer">Consultar archivo</button>':''}</details>`).join('')||'<p>No hay comunicaciones registradas.</p>'}`;document.querySelector('#mailbox-close').onclick=()=>mailbox.style.display='none';const finalButton=document.querySelector('#final-file-from-mail');if(finalButton)finalButton.onclick=async()=>{mailbox.style.display='none';await markFinalFileConsulted('mailbox');openFinalLocatedFile()}};
mailboxButton.onclick=()=>{const opening=mailbox.style.display==='none';if(opening){renderMailbox();mailbox.style.display='block';localStorage.setItem('kizuna-mail-read',mailboxMessages().length);renderMailbox();updateMailboxIndicator()}else mailbox.style.display='none'};
const updateMailboxIndicator=()=>{const unread=Math.max(0,mailboxMessages().length-Number(localStorage.getItem('kizuna-mail-read')||0));mailboxButton.textContent=`Buzón${unread?` · ${unread} nuevo${unread===1?'':'s'}`:''}`;mailboxButton.style.background=unread?'#7e1b19':'#f6f0e2';mailboxButton.style.color=unread?'#fff':'#7e1b19';mailboxButton.style.boxShadow=unread?'0 0 0 4px #7e1b1930':'none'};
const privateStyle=document.createElement('style');privateStyle.textContent=`.dashboard>header{position:sticky;top:0;z-index:40;padding:8px 5vw;background:#f6f0e2!important;isolation:isolate;box-shadow:0 1px 0 #b4ae9f}.dashboard>header .access-brand img{width:44px;height:44px}.case-head{position:sticky;top:61px;z-index:30;padding:20px 10vw!important;min-height:140px;align-items:center;background:#e6dac2!important;isolation:isolate;box-shadow:0 8px 16px #8f80661c}.case-head h1{font-size:48px}.case-head .system-line{margin:0 0 8px}.case-head .case-id{margin:7px 0 0;font-size:8px}.case-head dl{gap:28px}.case-list{position:relative;z-index:1;padding-top:34px}.header-actions{display:flex;align-items:center;gap:15px}.header-actions .sync-clock{margin:0}#return-public-site{border-color:#202726;color:#202726}@media(max-width:750px){.case-head{top:61px;padding:17px 7vw!important;min-height:0}.case-head h1{font-size:40px}.case-head dl{margin-top:17px}.header-actions{gap:5px}.header-actions button{padding:8px 6px;font-size:7px}.sync-clock{display:none!important}}`;document.head.appendChild(privateStyle);setInterval(()=>{if(!dash.hidden)updateMailboxIndicator()},600);updateMailboxIndicator();
const mobileCaseHeaderStyle=document.createElement('style');mobileCaseHeaderStyle.textContent=`@media(max-width:600px){.dashboard{overflow-x:hidden}.dashboard>header{min-height:50px;padding:5px 10px!important;gap:8px}.dashboard>header .access-brand{min-width:0;gap:7px}.dashboard>header .access-brand img{width:34px;height:34px}.dashboard>header .access-brand span{overflow:hidden;font-size:11px;letter-spacing:.12em;text-overflow:ellipsis;white-space:nowrap}.dashboard>header .access-brand small{display:none}.dashboard>header .header-actions{flex:0 0 auto;margin-left:auto;gap:4px!important}.dashboard>header .header-actions button{display:grid;place-items:center;height:38px;min-width:42px;padding:4px 6px!important;line-height:1.15}.dashboard>header #mailbox-toggle{max-width:62px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dashboard>header #return-public-site,.dashboard>header #exit{width:44px;font-size:0!important}.dashboard>header #return-public-site::after{content:'WEB';font:7px var(--mono);letter-spacing:.04em}.dashboard>header #exit::after{content:'SALIR';font:7px var(--mono);letter-spacing:.04em}.case-head{top:49px!important}}@media(max-width:360px){.dashboard>header .access-brand span{font-size:9px}.dashboard>header #mailbox-toggle{max-width:54px}.dashboard>header #return-public-site,.dashboard>header #exit{width:40px;min-width:40px}}`;document.head.appendChild(mobileCaseHeaderStyle);
function openFinalLocatedFile(){active='FINAL-01';next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES / VERIFICACIÓN FINAL';document.querySelector('#doc-title').textContent='Archivo localizado';document.querySelector('#doc-body').innerHTML='<img src="../assets/documents/FINAL-01-email-interno.png" alt="Correo interno recuperado de José" style="display:block;width:100%;height:auto;border:1px solid #8b887d">';if(!viewer.open)viewer.showModal()}
function showFinalFileAlert(){if(!read().includes('KTB-014')||localStorage.getItem('kizuna-final-file-seen')||viewer.open||document.querySelector('#final-file-alert'))return;const alert=document.createElement('section');alert.id='final-file-alert';alert.style.cssText='position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:#17211ddd;color:#f6f0e2';alert.innerHTML='<div style="width:min(530px,88vw);padding:46px;background:#efe4cf;color:#202726;border:2px solid #7e1b19;box-shadow:14px 16px 0 #0005"><p style="margin:0 0 18px;color:#7e1b19;font:10px var(--mono);letter-spacing:.12em">ATENCIÓN REQUERIDA · VERIFICACIÓN FINAL</p><h2 style="font:600 47px/.92 var(--serif);margin:0">Se ha localizado<br>un <em style="color:#7e1b19">archivo.</em></h2><p style="font:14px/1.7 var(--mono);margin:28px 0">Durante la verificación final del expediente se ha detectado un registro no catalogado.</p><p style="font:11px/1.8 var(--mono)">CLASIFICACIÓN: NO CATALOGADO<br>ESTADO: PENDIENTE DE REVISIÓN</p><button id="final-file-alert-open" style="margin-top:22px;background:#7e1b19;color:#fff;border:0;padding:15px 18px;font:10px var(--mono);cursor:pointer">Consultar archivo →</button></div>';document.body.appendChild(alert);document.querySelector('#final-file-alert-open').onclick=()=>{alert.remove();localStorage.setItem('kizuna-final-file-seen','true');openFinalLocatedFile()}}
function openDashboard(){access.hidden=true;loading.hidden=false;const log=document.querySelector('#auth-log');log.innerHTML='<p>Comprobando expediente…</p><div style="height:8px;background:#d3c8b4"><i id="auth-progress" style="display:block;width:0;height:100%;background:#7e1b19;transition:width 1.7s ease"></i></div><p>Sincronizando registros…</p><p>Integridad documental: <strong>100 %</strong></p>';setTimeout(()=>document.querySelector('#auth-progress').style.width='100%',80);setTimeout(()=>{loading.hidden=true;gate.hidden=false},2100)}
function updateCompletionHeader(done){const head=document.querySelector('.case-head'),old=document.querySelector('#completion-record');if(old)old.remove();head.style.position='';if(!done.includes('KTB-014')){head.style.setProperty('padding-bottom','20px','important');head.style.minHeight='140px';return}head.style.setProperty('padding-bottom','100px','important');head.style.minHeight='245px';const record=document.createElement('section');record.id='completion-record';record.style.cssText='position:absolute;left:10vw;right:10vw;bottom:18px;border-top:1px solid #9b8870;padding-top:12px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 20px;color:#7e1b19;font:9px/1.65 "DM Mono",monospace;letter-spacing:.03em';record.innerHTML=`<span>PROJECT JAPAN<br><strong style="font-size:11px">✔ FINALIZADO · EXPEDIENTE ARCHIVADO</strong></span><span>DESTINATARIO<br><strong style="font-size:11px">JOSÉ CUADRADO</strong></span><span>FECHA DE ARCHIVO<br><strong style="font-size:11px">${new Date().toLocaleDateString('es-ES')}</strong></span><span>INTEGRIDAD<br><strong style="font-size:11px">100 %</strong></span>`;head.appendChild(record)}
function render(){const done=read(),visible=sequence.filter(id=>!nestedKtb.has(id)),completed=progressKeys.filter(id=>done.includes(id)).length,integrity=Math.round(completed/progressKeys.length*100),ktbRead=done.filter(id=>id.startsWith('KTB-')).length,level=Math.max(1,ktbRead-5),comicPages=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`).filter(id=>done.includes(id)).length,supplementary=done.includes('KTB-003')?`<article class="document complementary"><span class="doc-no">○ AC-01</span><h3>ARCHIVO COMPLEMENTARIO<br>AC-01</h3><p><strong>Estado:</strong> Recuperado<br><strong>Tipo:</strong> Registro ilustrado<br><strong>Origen:</strong> No catalogado<br><strong>Relación:</strong> Pendiente de clasificación<br><strong>Páginas recuperadas:</strong> ${comicPages} / 11</p><button data-id="AC-01">CONSULTAR</button></article>`:'';document.querySelector('#integrity').textContent=`${integrity} %`;document.querySelector('#integrity-fill').style.width=`${integrity}%`;document.querySelector('#authorization').textContent=`Nivel ${roman(level)}`;document.querySelector('#case-status').textContent=done.includes('KTB-014')?'Expediente completado':'En proceso';updateCompletionHeader(done);document.querySelector('#documents').innerHTML=visible.map(id=>{const ok=allowed(id),seen=done.includes(id),label=isFolder(id)?'Abrir carpeta':'Abrir documento';return `<article class="document ${ok?'':'locked'}"><span class="doc-no">${seen?'✓ ':ok?'○ ':'⌕ '}${id}</span><h3>${name(id)}</h3><p>${seen?'LECTURA CONFIRMADA':ok?'DISPONIBLE PARA CONSULTA':'AUTORIZACIÓN PENDIENTE'}</p><button data-id="${id}" ${ok?'':'disabled'}>${ok?label:'Acceso restringido'}</button></article>`}).join('')+supplementary;document.querySelectorAll('.document button:not([disabled])').forEach(button=>button.onclick=()=>openDoc(button.dataset.id))}
function textFor(id){if(id==='AC-01')return ['Archivo complementario AC-01','Estado: Recuperado. Tipo: Registro ilustrado. Origen: No catalogado.','La relación de este registro con la expedición permanece pendiente de clasificación.'];if(id==='KTB-014')return ['Cierre de expediente','La secuencia ha sido completada. Los recuerdos han sido preservados y la línea temporal mantiene una integridad del 100 %.','No se requieren más intervenciones.'];if(isFolder(id))return [`${id} · ${folderDetails[id][0]}`,folderDetails[id][1],'Archivo recuperado parcialmente. El contenido debe consultarse respetando el orden de la secuencia temporal.'];return [`Expediente ${id}`,'Registro validado por la División de Archivos Temporales. Este documento forma parte de una secuencia personal de continuidad.','La lectura atenta de cada página ayuda a que las historias importantes sucedan exactamente como deben.']}
function openFolder(folderId){active=folderId;readerReturnToFolder=null;readerCanConfirm=false;next.style.display='none';document.querySelector('#doc-type').textContent='CARPETA DE ARCHIVOS RECUPERADOS / ACCESO AUTORIZADO';document.querySelector('#doc-title').textContent=`${folderId} · ${folders[folderId].title}`;const done=read(),files=folders[folderId].files,seenCount=files.filter(file=>done.includes(file.id)).length;const list=files.map((file,index)=>{const unlocked=index===0||done.includes(files[index-1].id),seen=done.includes(file.id);return `<button class="folder-file ${seen?'is-read':unlocked?'is-ready':'is-locked'}" data-file="${file.id}" ${unlocked?'':'disabled'}><span class="folder-file-number">${String(index+1).padStart(2,'0')}</span><span class="folder-file-copy"><strong>${file.title}</strong><small>${seen?'LECTURA CONFIRMADA':unlocked?'DISPONIBLE':'BLOQUEADO HASTA COMPLETAR EL ANTERIOR'}</small></span><span class="folder-file-action">${seen?'REVISAR':unlocked?'ABRIR':'⌕'}</span></button>`}).join('');const complete=files.every(file=>done.includes(file.id)),update=folders[folderId].update;document.querySelector('#doc-body').innerHTML=`<section class="folder-index"><header><div><p class="system-line">ÍNDICE DE LA CARPETA</p><h3>${folders[folderId].title}</h3></div><p><strong>${seenCount}</strong> de ${files.length}<span>documentos leídos</span></p></header><p class="folder-intro">Los documentos internos deben consultarse siguiendo el orden autorizado.</p><div class="folder-file-list">${list}</div><footer>${complete?`<button id="folder-update">Abrir ${update} · Actualización del expediente →</button>`:`<p>La actualización permanecerá sellada hasta completar todos los documentos.</p>`}</footer></section>`;mark.style.display='none';if(!viewer.open)viewer.showModal();document.querySelectorAll('.folder-file:not([disabled])').forEach(button=>button.onclick=()=>openFolderFile(folderId,button.dataset.file));const updateButton=document.querySelector('#folder-update');if(updateButton)updateButton.onclick=()=>openDoc(update)}
function openFolderFile(folderId,fileId){const file=folders[folderId].files.find(item=>item.id===fileId);active=fileId;readerReturnToFolder=folderId;readerCanConfirm=true;next.style.display='none';mark.style.display='inline-block';document.querySelector('#doc-type').textContent=`${folderId} / DOCUMENTO INTERNO`;document.querySelector('#doc-title').textContent=file.title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="../assets/documents/${folderId}/${file.src}" alt="${file.title}">`}
function openFolderFile(folderId,fileId){const file=folders[folderId].files.find(item=>item.id===fileId);if(file.mosaic==='tickets'){openTicketMosaic();return}active=fileId;readerReturnToFolder=folderId;readerCanConfirm=true;next.style.display='none';mark.style.display='inline-block';document.querySelector('#doc-type').textContent=`${folderId} / DOCUMENTO INTERNO`;document.querySelector('#doc-title').textContent=file.title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="../assets/documents/${folderId}/${file.src}" alt="${file.title}">`}
function openTicketMosaic(){active='AR01-BILLETES';next.style.display='none';mark.style.display='none';const done=read(),seen=ar01Tickets.filter(ticket=>done.includes(ticket.id)).length,complete=seen===ar01Tickets.length;document.querySelector('#doc-type').textContent='AR-01 / BILLETES DE TRANSPORTE';document.querySelector('#doc-title').textContent='Billetes recuperados';document.querySelector('#doc-body').innerHTML=`<p>Registros de transporte recuperados · ${seen}/${ar01Tickets.length} consultados.</p><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">${ar01Tickets.map(ticket=>{const readTicket=done.includes(ticket.id);return `<button class="ticket-card" data-ticket="${ticket.id}" style="position:relative;border:2px solid ${readTicket?'#6b863e':'#9b8d78'};background:#f7efdf;padding:7px;text-align:left"><img src="../assets/documents/AR-01/Billetes/${ticket.src}" alt="${ticket.title}" style="display:block;width:100%;height:130px;object-fit:cover;object-position:center;opacity:${readTicket?'.72':'1'}"><span style="position:absolute;right:6px;top:6px;background:${readTicket?'#355d37':'#7e1b19'};color:#fff;padding:4px 6px;font:9px monospace">${readTicket?'✓ LEÍDO':'BILLETE'}</span><span style="display:block;margin-top:7px;font:11px var(--mono)">${ticket.title}</span></button>`}).join('')}</div><p style="margin-top:22px"><button id="ticket-confirm-all">Confirmar lectura de todos los billetes</button></p>${complete?'<p><strong>Billetes de transporte verificados.</strong></p>':''}`;if(!viewer.open)viewer.showModal();document.querySelectorAll('.ticket-card').forEach(button=>button.onclick=()=>{const ticket=ar01Tickets.find(item=>item.id===button.dataset.ticket);openTicketItem(ticket)});document.querySelector('#ticket-confirm-all').onclick=async()=>{const records=read(),newIds=ar01Tickets.filter(ticket=>!records.includes(ticket.id)).map(ticket=>ticket.id);newIds.forEach(id=>records.push(id));if(!records.includes('AR01-BILLETES'))records.push('AR01-BILLETES');save(records);await Promise.all(newIds.map(id=>recordActivity('document_confirmed',id,{source:'recovered_file_bulk'})));openFolder('AR-01')}}
function openTicketItem(ticket){active=ticket.id;next.style.display='none';mark.style.display='inline-block';mark.textContent=read().includes(ticket.id)?'Volver al expediente':'Confirmar lectura';mark.dataset.returnTo='tickets';document.querySelector('#doc-type').textContent='AR-01 / BILLETE RECUPERADO';document.querySelector('#doc-title').textContent=ticket.title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="../assets/documents/AR-01/Billetes/${ticket.src}" alt="${ticket.title}">`;if(!viewer.open)viewer.showModal()}
function ar03Complete(){const keys=['AR03-CARTA',...ar03Cities.map((_,i)=>`AR03-C-${i}`),...ar03Temples.map((_,i)=>`AR03-T-${i}`)];return keys.every(key=>read().includes(key))}
function openAr03(){active='AR-03';readerReturnToFolder=null;readerCanConfirm=false;next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='AR-03 / REGISTROS GEOGRÁFICOS';document.querySelector('#doc-title').textContent='Archivo Recuperado 03';const done=read(),citiesDone=ar03Cities.filter((_,i)=>done.includes(`AR03-C-${i}`)).length,templesDone=ar03Temples.filter((_,i)=>done.includes(`AR03-T-${i}`)).length,letterDone=done.includes('AR03-CARTA'),ready=ar03Complete(),reviewed=citiesDone+templesDone,total=ar03Cities.length+ar03Temples.length;document.querySelector('#doc-body').innerHTML=`<section class="folder-index ar03-folder-index"><header><div><p class="system-line">ÍNDICE DE LA CARPETA</p><h3>Registros geográficos</h3></div><p><strong>${reviewed}</strong> de ${total}<span>registros consultados</span></p></header><p class="folder-intro">Selecciona una subcarpeta para consultar sus registros recuperados.</p><div class="folder-file-list"><button id="ar03-cities" class="folder-file ${citiesDone===ar03Cities.length?'is-read':'is-ready'}"><span class="folder-file-number">01</span><span class="folder-file-copy"><strong>Guías de ciudades</strong><small>${citiesDone} DE ${ar03Cities.length} REGISTROS CONSULTADOS</small></span><span class="folder-file-action">${citiesDone===ar03Cities.length?'REVISAR':'ABRIR'}</span></button><button id="ar03-temples" class="folder-file ${letterDone&&templesDone===ar03Temples.length?'is-read':'is-ready'}"><span class="folder-file-number">02</span><span class="folder-file-copy"><strong>Entradas de templos</strong><small>${letterDone?'CARTA CONSULTADA · ':''}${templesDone} DE ${ar03Temples.length} REGISTROS CONSULTADOS</small></span><span class="folder-file-action">${letterDone&&templesDone===ar03Temples.length?'REVISAR':'ABRIR'}</span></button></div><footer>${ready?'<button id="ar03-update">Abrir KTB-009 · Actualización del expediente →</button>':'<p>KTB-009 permanecerá sellado hasta consultar todos los registros.</p>'}</footer></section>`;if(!viewer.open)viewer.showModal();document.querySelector('#ar03-cities').onclick=()=>openAr03Mosaic('cities');document.querySelector('#ar03-temples').onclick=()=>{if(!read().includes('AR03-CARTA'))openAr03Item('AR03-CARTA','Carta de presentación','../assets/documents/AR-03/Templos/000-Carta.png');else openAr03Mosaic('temples')};const update=document.querySelector('#ar03-update');if(update)update.onclick=()=>openDoc('KTB-009')}
function openAr03Mosaic(type){active=`AR03-${type}`;next.style.display='none';mark.style.display='none';const items=type==='cities'?ar03Cities:ar03Temples,key=type==='cities'?'C':'T',folder=type==='cities'?'Ciudades':'Templos',done=read(),count=items.filter((_,i)=>done.includes(`AR03-${key}-${i}`)).length;document.querySelector('#doc-type').textContent=`AR-03 / ARCHIVO VISUAL · ${count}/${items.length} CONSULTADOS`;document.querySelector('#doc-title').textContent=type==='cities'?'Guías de ciudades':'Entradas de templos';const cards=items.map((file,index)=>{const seen=done.includes(`AR03-${key}-${index}`);return `<button class="ar03-card" data-file="${file}" data-index="${index}" style="position:relative;padding:0;border:2px solid ${seen?'#6b863e':'#9b8d78'};background:#f5ead5;cursor:pointer"><img style="display:block;width:100%;height:120px;object-fit:cover;opacity:${seen?'.72':'1'}" src="../assets/documents/AR-03/${folder}/${file}" alt="${file}"><span style="position:absolute;right:6px;top:6px;background:${seen?'#355d37':'#7e1b19'};color:#fff;padding:4px 6px;font:9px monospace">${seen?'✓ LEÍDO':`${String(index+1).padStart(2,'0')}`}</span></button>`}).join('');document.querySelector('#doc-body').innerHTML=`<p><strong>${count} de ${items.length} registros confirmados.</strong></p><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">${cards}</div><p><button id="ar03-confirm-all">Confirmar lectura de todas las fichas</button></p>`;document.querySelectorAll('.ar03-card').forEach(button=>button.onclick=()=>openAr03Item(`AR03-${key}-${button.dataset.index}`,button.dataset.file,`../assets/documents/AR-03/${folder}/${button.dataset.file}`,type));document.querySelector('#ar03-confirm-all').onclick=async()=>{const records=read(),newIds=[];items.forEach((_,index)=>{const record=`AR03-${key}-${index}`;if(!records.includes(record)){records.push(record);newIds.push(record)}});save(records);await Promise.all(newIds.map(id=>recordActivity('document_confirmed',id,{source:'recovered_file_bulk'})));openAr03()}}
function openAr03Item(id,title,src,type){active=id;next.style.display='none';mark.style.display='inline-block';mark.textContent=read().includes(id)?'Volver al expediente':'Confirmar lectura';document.querySelector('#doc-type').textContent='AR-03 / REGISTRO AMPLIADO';document.querySelector('#doc-title').textContent=title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="${src}" alt="${title}">`;mark.dataset.returnTo=type||'temples'}
function openAr06Protocol(){active='AR06-PROTOCOL';next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES / PROTOCOLO 06';document.querySelector('#doc-title').textContent='Autorización de acceso';document.querySelector('#doc-body').innerHTML=`<p><strong>Advertencia al destinatario autorizado</strong></p><p>Los archivos que va a consultar no forman parte de la documentación preparada originalmente para la expedición. Corresponden a una extracción parcial realizada sobre un dispositivo móvil asociado al destinatario.</p><p>Estos registros pueden presentar errores, fragmentos incompletos o alteraciones derivadas del proceso de recuperación. La División recomienda consultar los documentos en el orden establecido.</p><p>Se ha verificado que ha completado la lectura de:</p><p>✓ KTB-001<br>✓ KTB-002<br>✓ KTB-003<br>✓ KTB-004<br>✓ KTB-005</p><p><strong>Acceso autorizado al Archivo Recuperado 06.</strong><br>Integridad estimada del conjunto: <strong>68 %</strong></p><label style="display:block;margin:24px 0"><input id="ar06-confirm" type="checkbox"> Confirmo que deseo continuar.</label><button id="ar06-start" disabled>Acceder a los archivos recuperados</button><p style="font-size:10px;opacity:.7;margin-top:32px">Una vez iniciado el análisis de los archivos recuperados, no será posible volver al estado anterior del expediente.</p>`;if(!viewer.open)viewer.showModal();const checkbox=document.querySelector('#ar06-confirm'),start=document.querySelector('#ar06-start');checkbox.onchange=()=>start.disabled=!checkbox.checked;start.onclick=()=>startAr06Recovery()}
function startAr06Recovery(){document.querySelector('#doc-title').textContent='Recuperando archivos…';document.querySelector('#doc-body').innerHTML='<p id="recovery-log">Verificando autorización…</p>';const lines=['✔ Nivel de acceso IV validado','Localizando dispositivo…','Recuperando archivos…','Reconstruyendo metadatos…','Integridad del conjunto: 68 %','Acceso concedido.'];let index=0;const timer=setInterval(()=>{const log=document.querySelector('#recovery-log');log.innerHTML+=`<br>${lines[index++]}`;if(index===lines.length){clearInterval(timer);setTimeout(()=>{const done=read();if(!done.includes('AR06-PROTOCOL')){done.push('AR06-PROTOCOL');save(done);void recordActivity('document_confirmed','AR06-PROTOCOL',{source:'recovered_file_protocol'})}openFolder('AR-06')},500)}},420)}
function recoveryScreen(id){active=id;next.style.display='none';mark.style.display='none';document.querySelector('.stamp').style.display='none';document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES';document.querySelector('#doc-title').textContent='Recuperando documento…';const integrity=Math.floor(Math.random()*101);const bar=(label,id)=>`<p style="margin:25px 0 8px">${label} <strong id="${id}-value">0 %</strong></p><div style="height:9px;background:#d3c8b4;border:1px solid #8b887d"><i id="${id}" style="display:block;width:0;height:100%;background:#7e1b19;transition:width .55s ease"></i></div>`;document.querySelector('#doc-body').innerHTML=`<p style="position:absolute;top:32px;right:38px;margin:0;font-size:10px;letter-spacing:.12em;text-align:right;color:#7e1b19">SERVIDOR<br><strong>TOKYO NODE 03</strong></p><p>Solicitud de recuperación recibida…</p>${bar('Comprobando autorización…','auth-bar')}${bar('Verificando integridad del archivo…','integrity-bar')}${bar('Reconstruyendo metadatos…','metadata-bar')}<p id="recovery-ready" style="margin-top:28px"></p>`;if(!viewer.open)viewer.showModal();const setBar=(barId,value)=>{document.querySelector(`#${barId}`).style.width=`${value}%`;document.querySelector(`#${barId}-value`).textContent=`${value} %`};setTimeout(()=>setBar('auth-bar',100),120);setTimeout(()=>setBar('integrity-bar',integrity),650);setTimeout(()=>setBar('metadata-bar',100),1150);setTimeout(()=>{document.querySelector('#recovery-ready').textContent='Documento recuperado.';setTimeout(()=>{document.querySelector('#recovery-ready').innerHTML='Nivel de autorización verificado.<br><strong>Apertura autorizada.</strong>';setTimeout(()=>{document.querySelector('.stamp').style.display='block';showDoc(id)},500)},420)},1800)}
function showDoc(id){if(id==='AR-06'&&!read().includes('AR06-PROTOCOL')){openAr06Protocol();return}if(id==='AR-03'){openAr03();return}if(folders[id]){openFolder(id);return}active=id;next.style.display='inline-block';mark.style.display='inline-block';const [title,...paras]=textFor(id);document.querySelector('#doc-type').textContent=isFolder(id)?'CARPETA DE ARCHIVOS RECUPERADOS / ACCESO AUTORIZADO':'DIVISIÓN DE ARCHIVOS TEMPORALES / ACCESO AUTORIZADO';document.querySelector('#doc-title').textContent=documentImages.has(id)?'Documento recuperado':title;document.querySelector('#doc-body').innerHTML=documentImages.has(id)?`<img style="display:block;width:100%;height:auto" src="../assets/documents/${id}.png" alt="Documento ${id}">`:paras.map(text=>`<p>${text}</p>`).join('')+(id==='KTB-014'?'<p><strong>EXPEDIENTE CERRADO<br>ARCHIVADO DEFINITIVAMENTE</strong></p>':'');mark.textContent=read().includes(id)?'Volver al expediente':isFolder(id)?'Cerrar carpeta y autorizar siguiente fase':'Confirmar lectura';if(!viewer.open)viewer.showModal()}
function openDoc(id){const paper=document.querySelector('.paper'),body=document.querySelector('#doc-body');if(id!=='AC-01'){paper.style.width='';paper.style.maxWidth='';paper.style.padding='';body.style.maxWidth='';body.style.margin=''}if(id==='AC-01'){openAcInfo();return}if(id.startsWith('KTB-')&&!read().includes(id)){recoveryScreen(id);return}showDoc(id)}
function openAcInfo(){active='AC-01';next.style.display='none';mark.style.display='none';const pages=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`).filter(id=>read().includes(id)).length;document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES';document.querySelector('#doc-title').textContent='ARCHIVO COMPLEMENTARIO AC-01';document.querySelector('#doc-body').innerHTML=`<p style="color:#7e1b19;letter-spacing:.1em;font-size:12px"><strong>REGISTRO ILUSTRADO RECUPERADO</strong></p><section style="margin:28px 0;padding:22px;border:1px solid #8b887d;background:#f6eddd"><p><strong>Clasificación:</strong> No determinada<br><strong>Integridad:</strong> <span style="color:#356a41">100 %</span><br><strong>Páginas disponibles:</strong> ${pages} / 11</p><p><strong>Observación:</strong></p><p>Durante la reconstrucción del expediente se ha localizado un documento ilustrado que no figura en el inventario original.</p><p>Su contenido parece guardar relación con el expediente, aunque su procedencia no ha podido verificarse.</p></section>${pages?'<button id="ac-open-record">Abrir registro</button>':'<p style="color:#7e1b19"><strong>Registro en reconstrucción.</strong><br>La primera página se recuperará al confirmar el siguiente documento KTB.</p>'}`;if(!viewer.open)viewer.showModal();const open=document.querySelector('#ac-open-record');if(open)open.onclick=()=>openComicViewer(1)}
function openComicViewer(page){const pages=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`).filter(id=>read().includes(id)).length;if(!pages){openAcInfo();return}page=Math.min(Math.max(1,page),pages);active='AC-01';next.style.display='none';mark.style.display='none';const paper=document.querySelector('.paper'),body=document.querySelector('#doc-body');paper.style.width='min(1120px,calc(100% - 34px))';paper.style.maxWidth='1120px';paper.style.padding='42px';body.style.maxWidth='900px';body.style.margin='0 auto';document.querySelector('#doc-type').textContent='KIZUNA · DIVISIÓN DE ARCHIVOS TEMPORALES';document.querySelector('#doc-title').textContent='ARCHIVO COMPLEMENTARIO AC-01';document.querySelector('#doc-body').innerHTML=`<img src="../assets/documents/AC-01/Pagina-${page}.png" alt="Página ${page} del registro ilustrado" style="display:block;width:100%;height:auto;border:1px solid #8b887d"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px"><button id="comic-prev" ${page===1?'disabled':''}>← Página anterior</button><strong style="font:12px var(--mono)">PÁGINA ${page} / ${pages}<br><span style="font-size:9px;color:#7e1b19">${pages} DE 11 RECUPERADAS</span></strong><button id="comic-next" ${page===pages?'disabled':''}>Página siguiente →</button></div><button id="comic-back" style="margin-top:18px;background:#7e1b19;color:#fff;border:0;padding:14px 18px;font:11px var(--mono);cursor:pointer">Regresar al expediente</button>`;document.querySelector('#comic-prev').onclick=()=>openComicViewer(page-1);document.querySelector('#comic-next').onclick=()=>openComicViewer(page+1);document.querySelector('#comic-back').onclick=()=>{paper.style.width='';paper.style.maxWidth='';paper.style.padding='';body.style.maxWidth='';body.style.margin='';viewer.close()};if(!viewer.open)viewer.showModal()}
function syncKtb(id,onComplete){next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES';document.querySelector('#doc-title').textContent=id==='KTB-003'?'Hallazgo asociado…':'Actualizando expediente…';if(id!=='KTB-003'){const accessNotice=id==='KTB-006'?'<p><strong>Acceso concedido · Archivo Recuperado 01.</strong></p>':id==='KTB-011'?'<p><strong>Acceso concedido · Datos recuperados del dispositivo.</strong></p>':'';document.querySelector('#doc-body').innerHTML=`<p>Sincronizando progreso…</p><p><strong>Lectura confirmada · ${id}.</strong></p><p>Expediente ${id} registrado.</p>${accessNotice}<p>Nuevo nivel de autorización concedido.</p><p id="sync-complete">Actualización completada.</p>`;setTimeout(onComplete,2100);return}document.querySelector('#doc-body').innerHTML=`<p>Sincronizando progreso…</p><p><strong>Lectura confirmada · KTB-003.</strong></p><p>Expediente KTB-003 registrado.</p><section style="margin:32px 0;padding:22px;border:2px solid #7e1b19;background:#f7edda;box-shadow:7px 7px 0 #7e1b1940"><p style="margin:0 0 13px;color:#7e1b19;font-size:11px;letter-spacing:.12em">BUSCANDO MATERIAL ASOCIADO… <strong id="ac-progress-value">0 %</strong></p><div style="height:12px;background:#d3c8b4;border:1px solid #7e1b19"><i id="ac-progress" style="display:block;width:0;height:100%;background:#7e1b19;transition:width 1.1s ease"></i></div><p id="ac-result" style="margin:18px 0 0;font-size:19px;color:#7e1b19"></p></section><p>Nuevo nivel de autorización concedido.</p><p>Actualización completada.</p>`;setTimeout(()=>{document.querySelector('#ac-progress').style.width='100%';document.querySelector('#ac-progress-value').textContent='100 %'},180);setTimeout(()=>{document.querySelector('#ac-result').innerHTML='<strong>1 archivo nuevo localizado.</strong><br><span style="font-size:12px">ARCHIVO COMPLEMENTARIO AC-01 · RECUPERADO</span>'},1350);setTimeout(onComplete,2400)}
function startFinale(){next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='KIZUNA / VALIDACIÓN FINAL';document.querySelector('#doc-title').textContent='Verificando expediente…';document.querySelector('#doc-body').innerHTML='<p id="final-log">Integridad de la línea temporal<br>████████████████████<br><strong>100 %</strong></p>';const lines=['Comprobando coherencia narrativa…<br>✔ Sin incidencias','Comprobando integridad documental…<br>✔ Sin incidencias','Validando secuencia temporal…<br>✔ Confirmada','Archivando expediente…','<strong style="font-size:28px;color:#7e1b19">EXPEDIENTE CERRADO</strong>'];let i=0;const timer=setInterval(()=>{document.querySelector('#final-log').innerHTML+=`<br><br>${lines[i++]}`;if(i===lines.length){clearInterval(timer);setTimeout(showFinaleMessage,700)}},520)}
function showFinaleMessage(){document.querySelector('#doc-type').textContent='KIZUNA TRAVEL BUREAU';document.querySelector('#doc-title').textContent='PROJECT JAPAN';document.querySelector('#doc-body').innerHTML=`<p><strong>Estado del expediente</strong><br>COMPLETADO</p><p>Durante las últimas semanas has recorrido un expediente que nunca debió existir.</p><p>Has leído documentos escritos antes de ser creados. Has seguido el rastro de recuerdos que todavía no habían sucedido.</p><p>Y, aun así…</p><p>Has llegado exactamente al lugar al que debías llegar.</p><p>Gracias por confiar en nosotros.</p><p>Ha sido un honor acompañarte durante esta expedición.</p><p><strong>KIZUNA TRAVEL BUREAU</strong></p><button id="final-continue">Continuar</button>`;document.querySelector('#final-continue').onclick=()=>{viewer.close();render();setTimeout(showFinalFileAlert,180)}}
function showFinalLogo(){document.querySelector('#doc-type').textContent='';document.querySelector('#doc-title').textContent='KIZUNA';document.querySelector('#doc-body').innerHTML='<img style="display:block;width:130px;margin:0 auto 18px;border-radius:50%" src="../assets/kizuna-logo-official.png" alt="Kizuna Travel Bureau"><p style="text-align:center;font-size:20px">TRAVEL BUREAU</p><p style="text-align:center;margin-top:70px">Porque los mejores recuerdos nunca pertenecieron a un expediente. Siempre te pertenecieron a ti.</p>'}
document.querySelector('#gate-consent').onchange=event=>document.querySelector('#gate-continue').disabled=!event.target.checked;document.querySelector('#gate-continue').onclick=()=>{patchState({legalAccepted:true});gate.hidden=true;dash.hidden=false;render()};document.querySelector('#access-form').onsubmit=event=>{event.preventDefault();const username=document.querySelector('#username').value.trim().toLowerCase(),password=document.querySelector('#password').value;if(username!=='jose.cuadrado'||password!=='kizuna2026')message.textContent='No se han podido verificar las credenciales de acceso.';else openDashboard()};document.querySelector('#exit').onclick=()=>{location.href='../index.html'};document.querySelector('.close').onclick=()=>viewer.close();mark.onclick=()=>{const done=read();if(!done.includes(active)){done.push(active);save(done)}if(active.startsWith('AR03-')){if(ar03Complete())openAr03();else if(active==='AR03-CARTA')openAr03Mosaic('temples');else openAr03Mosaic(active.startsWith('AR03-C-')?'cities':'temples');return}const parent=fileFolder(active);if(parent){openFolder(parent);return}if(active.startsWith('KTB-')){const id=active;syncKtb(id,()=>{if(id==='KTB-014'){localStorage.setItem('kizuna-complete','true');startFinale()}else{viewer.close();render()}});return}viewer.close();render()};next.onclick=()=>{const index=sequence.indexOf(active);if(index<sequence.length-1&&allowed(sequence[index+1]))openDoc(sequence[index+1])};

// Panel reservado para cuentas con el rol seguro app_metadata.role = admin.
const adminPanel=document.createElement('main');
adminPanel.id='admin-dashboard';
adminPanel.hidden=true;
adminPanel.className='admin-dashboard';
adminPanel.innerHTML=`<aside class="admin-rail"><div class="admin-brand"><img src="../assets/kizuna-logo-official.png" alt="Kizuna"><div><span>DIVISIÓN DE ARCHIVOS TEMPORALES</span><strong>Administración</strong></div></div><nav class="admin-sidebar" aria-label="Secciones de administración"><button type="button" class="active" data-admin-view="users"><span>01</span>Usuarios</button><button type="button" data-admin-view="mailbox"><span>02</span>Buzón <b id="admin-mailbox-badge" hidden>0</b></button><button type="button" data-admin-view="media"><span>03</span>Media</button><button type="button" data-admin-view="blog"><span>04</span>Blog</button></nav><button id="admin-exit">Cerrar sesión <span>→</span></button></aside><section class="admin-content"><div class="admin-views"><section id="admin-users-view" class="admin-view"><p class="system-line">ACCESO ADMINISTRATIVO · REGISTROS DE DESTINATARIOS</p><h1>Gestión de<br><em>expedientes.</em></h1><p class="admin-intro">Crea nuevos accesos o consulta y corrige los expedientes existentes.</p><div class="admin-user-tabs" role="tablist" aria-label="Gestión de usuarios"><button type="button" class="active" role="tab" aria-selected="true" aria-controls="admin-user-create-tab" data-user-tab="create"><span>01</span>Crear nuevo usuario</button><button type="button" role="tab" aria-selected="false" aria-controls="admin-user-manage-tab" data-user-tab="manage"><span>02</span>Consultar y editar usuarios</button></div><section id="admin-user-create-tab" class="admin-user-tab-panel" role="tabpanel"></section><section id="admin-user-manage-tab" class="admin-user-tab-panel" role="tabpanel" hidden><p class="admin-user-panel-intro">Selecciona un destinatario para consultar y corregir su progreso documental, identidad y actividad.</p><div class="admin-layout"><aside><label>DESTINATARIOS<select id="admin-user-list"><option value="">Cargando registros…</option></select></label></aside><section id="admin-editor" hidden></section></div></section></section><section id="admin-mailbox-view" class="admin-view" hidden><div class="admin-mailbox-heading"><div><p class="system-line">MENSAJES · FORMULARIO PÚBLICO</p><h1>Buzón de<br><em>mensajes.</em></h1><p id="admin-mailbox-summary" class="admin-intro">Cargando mensajes…</p></div><button id="admin-mailbox-refresh" type="button">↻ Actualizar</button></div><div id="admin-mailbox-list" class="admin-mailbox-list"></div></section><section id="admin-media-view" class="admin-view" hidden><p class="system-line">MEDIA · SUPABASE STORAGE</p><h1>Biblioteca de<br><em>imágenes.</em></h1><p class="admin-intro">Importa la carpeta assets completa o sustituye una imagen conservando su ruta pública.</p><div class="admin-media-actions"><label class="admin-media-upload">Importar carpeta assets<input id="admin-media-folder" type="file" accept="image/*" webkitdirectory multiple></label><button id="admin-media-refresh" type="button">Actualizar biblioteca</button></div><p id="admin-media-status" role="status">Preparado para conectar con el bucket kizuna-assets.</p><div id="admin-media-grid" class="admin-media-grid"></div></section><section id="admin-blog-view" class="admin-view" hidden><p class="system-line">CUADERNO DE VIAJE · CONTENIDO PÚBLICO</p><h1>Gestión del<br><em>blog.</em></h1><p class="admin-intro">Crea, edita, ordena y publica los artículos que aparecen en la web.</p><div class="admin-blog-layout"><form id="admin-blog-form"><input type="hidden" name="id"><input type="hidden" name="slug"><p class="system-line" id="admin-blog-form-title">NUEVO ARTÍCULO</p><label>Título<input name="title" required maxlength="180"></label><label>Categoría<input name="category" required maxlength="60" placeholder="GUÍA, CULTURA, SABORES…"></label><label>Resumen<textarea name="excerpt" required maxlength="500" rows="3"></textarea></label><label>Texto completo<textarea name="content" required maxlength="20000" rows="12"></textarea></label><div class="admin-blog-options"><label>Orden<input name="sort_order" type="number" value="0" step="1"></label><label class="admin-blog-published"><input name="is_published" type="checkbox" checked> Publicado</label></div><div class="admin-blog-form-actions"><button>Guardar artículo</button><button id="admin-blog-cancel" type="button" hidden>Cancelar edición</button></div><span id="admin-blog-status" role="status"></span></form><section><div class="admin-blog-list-heading"><p class="system-line">ARTÍCULOS EXISTENTES</p><button id="admin-blog-refresh" type="button">↻ Actualizar</button></div><div id="admin-blog-list"></div></section></div></section></div></section>`;
document.body.appendChild(adminPanel);

const adminEventsNav=document.createElement('button');
adminEventsNav.type='button';adminEventsNav.dataset.adminView='events';adminEventsNav.innerHTML='<span>05</span>Eventos';
document.querySelector('.admin-sidebar').appendChild(adminEventsNav);
const adminEventsView=document.createElement('section');
adminEventsView.id='admin-events-view';adminEventsView.className='admin-view';adminEventsView.hidden=true;
adminEventsView.innerHTML=`<p class="system-line">AGENDA KIZUNA · EVENTOS EN JAPÓN</p><h1>Gestión de<br><em>eventos.</em></h1><p class="admin-intro">Crea encuentros, controla su aforo y consulta cuántas personas se han apuntado.</p><div class="admin-events-layout"><form id="admin-event-form"><input type="hidden" name="id"><p class="system-line" id="admin-event-form-title">NUEVO EVENTO</p><label>Título<input name="title" required maxlength="180"></label><label>Descripción<textarea name="description" required maxlength="1000" rows="4"></textarea></label><label>Lugar<input name="location" required maxlength="180"></label><div class="admin-event-fields"><label>Fecha y hora en Japón<input name="starts_at" type="datetime-local" required></label><label>Plazas totales<input name="capacity" type="number" min="1" max="10000" required value="20"></label><label>Orden<input name="sort_order" type="number" step="1" value="0"></label></div><label class="admin-event-published"><input name="is_published" type="checkbox" checked> Publicado en la web</label><div class="admin-event-form-actions"><button>Guardar evento</button><button id="admin-event-cancel" type="button" hidden>Cancelar edición</button></div><span id="admin-event-status" role="status"></span></form><section><div class="admin-event-list-heading"><p class="system-line">EVENTOS EXISTENTES</p><button id="admin-event-refresh" type="button">↻ Actualizar</button></div><div id="admin-event-list"></div></section></div>`;
document.querySelector('.admin-views').appendChild(adminEventsView);

const adminViews={users:document.querySelector('#admin-users-view'),mailbox:document.querySelector('#admin-mailbox-view'),media:document.querySelector('#admin-media-view'),blog:document.querySelector('#admin-blog-view'),events:adminEventsView};
const adminViewTitles={users:['USUARIOS','Gestión de expedientes'],mailbox:['BUZÓN','Mensajes recibidos'],media:['MEDIA','Biblioteca de imágenes'],blog:['BLOG','Gestión de artículos'],events:['EVENTOS','Gestión de eventos']};
Object.entries(adminViews).forEach(([name,view])=>{
  const [section,title]=adminViewTitles[name];
  const bar=document.createElement('header');
  bar.className='admin-section-bar';
  bar.innerHTML=`<span>${section}</span><strong>${title}</strong>`;
  view.prepend(bar);
});
const adminUserPanels={create:document.querySelector('#admin-user-create-tab'),manage:document.querySelector('#admin-user-manage-tab')};
document.querySelectorAll('.admin-user-tabs button').forEach(button=>button.onclick=()=>{
  document.querySelectorAll('.admin-user-tabs button').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active))});
  Object.entries(adminUserPanels).forEach(([name,panel])=>panel.hidden=name!==button.dataset.userTab);
});
document.querySelectorAll('.admin-sidebar button').forEach(button=>button.onclick=()=>{
  document.querySelectorAll('.admin-sidebar button').forEach(item=>item.classList.toggle('active',item===button));
  Object.entries(adminViews).forEach(([name,view])=>view.hidden=name!==button.dataset.adminView);
  if(button.dataset.adminView==='mailbox')loadAdminMessages();
  if(button.dataset.adminView==='media')loadMediaLibrary();
  if(button.dataset.adminView==='blog')loadAdminArticles();
  if(button.dataset.adminView==='events')loadAdminEvents();
});

const mailboxBadge=document.querySelector('#admin-mailbox-badge');
const mailboxSummary=document.querySelector('#admin-mailbox-summary');
const mailboxList=document.querySelector('#admin-mailbox-list');
let mailboxChannel=null;

const refreshMailboxBadge=async()=>{
  if(!supabaseClient)return;
  const {count,error}=await supabaseClient.from('contact_messages').select('id',{count:'exact',head:true}).eq('is_read',false);
  if(error){console.error('No se pudo actualizar el indicador del buzón.',error);return}
  mailboxBadge.textContent=String(count||0);
  mailboxBadge.hidden=!count;
};

const updateContactMessage=async(id,changes)=>{
  const {error}=await supabaseClient.from('contact_messages').update({...changes,updated_at:new Date().toISOString()}).eq('id',id);
  if(error)throw error;
  await loadAdminMessages();
};

const deleteContactMessage=async message=>{
  if(!confirm(`¿Eliminar definitivamente el mensaje de ${message.name}?`))return;
  const {error}=await supabaseClient.from('contact_messages').delete().eq('id',message.id);
  if(error){console.error(error);alert('No se ha podido eliminar el mensaje.');return}
  await loadAdminMessages();
};

const createMailboxCard=message=>{
  const card=document.createElement('article');
  card.className=`admin-mailbox-card ${message.is_read?'is-read':'is-unread'}`;
  const meta=document.createElement('div');meta.className='admin-mailbox-meta';
  const state=document.createElement('span');state.textContent=message.is_read?'LEÍDO':'NUEVO';
  const date=document.createElement('time');date.dateTime=message.created_at;date.textContent=new Date(message.created_at).toLocaleString('es-ES',{dateStyle:'medium',timeStyle:'short'});
  meta.append(state,date);
  const name=document.createElement('h2');name.textContent=message.name;
  const email=document.createElement('a');email.href=`mailto:${message.email}`;email.textContent=message.email;
  const text=document.createElement('p');text.className='admin-mailbox-text';text.textContent=message.message;
  const actions=document.createElement('div');actions.className='admin-mailbox-actions';
  const reply=document.createElement('a');reply.className='primary';reply.href=`mailto:${message.email}?subject=${encodeURIComponent('Respuesta de KIZUNA Travel Bureau')}`;reply.textContent='Responder por correo';
  const toggle=document.createElement('button');toggle.type='button';toggle.textContent=message.is_read?'Marcar como no leído':'Marcar como leído';toggle.onclick=async()=>{toggle.disabled=true;try{await updateContactMessage(message.id,{is_read:!message.is_read})}catch(error){console.error(error);toggle.disabled=false}};
  const remove=document.createElement('button');remove.type='button';remove.className='danger';remove.textContent='Eliminar';remove.onclick=()=>deleteContactMessage(message);
  actions.append(reply,toggle,remove);card.append(meta,name,email,text,actions);return card;
};

const loadAdminMessages=async()=>{
  if(!supabaseClient||adminViews.mailbox.hidden)return refreshMailboxBadge();
  mailboxSummary.textContent='Actualizando buzón…';
  const {data,error}=await supabaseClient.from('contact_messages').select('id,name,email,message,is_read,created_at').order('created_at',{ascending:false});
  if(error){mailboxSummary.textContent='No se han podido recuperar los mensajes. Ejecuta primero supabase-contact-messages.sql.';console.error(error);return}
  const unread=data.filter(item=>!item.is_read).length;
  mailboxSummary.textContent=`${data.length} mensaje${data.length===1?'':'s'} · ${unread} sin leer`;
  mailboxList.replaceChildren(...data.map(createMailboxCard));
  if(!data.length){const empty=document.createElement('p');empty.className='admin-mailbox-empty';empty.textContent='Todavía no se ha recibido ningún mensaje.';mailboxList.appendChild(empty)}
  mailboxBadge.textContent=String(unread);mailboxBadge.hidden=!unread;
};

const connectMailboxRealtime=()=>{
  if(mailboxChannel||!supabaseClient)return;
  mailboxChannel=supabaseClient.channel('admin-contact-messages').on('postgres_changes',{event:'*',schema:'public',table:'contact_messages'},()=>{if(adminViews.mailbox.hidden)refreshMailboxBadge();else loadAdminMessages()}).subscribe();
};

document.querySelector('#admin-mailbox-refresh').onclick=loadAdminMessages;

const mediaBucket='kizuna-assets';
const mediaStatus=document.querySelector('#admin-media-status');
const mediaGrid=document.querySelector('#admin-media-grid');

const listMediaFiles=async(prefix='')=>{
  const {data,error}=await supabaseClient.storage.from(mediaBucket).list(prefix,{limit:1000,sortBy:{column:'name',order:'asc'}});
  if(error)throw error;
  const files=[];
  for(const item of data||[]){
    const path=prefix?`${prefix}/${item.name}`:item.name;
    if(item.id)files.push({...item,path});
    else files.push(...await listMediaFiles(path));
  }
  return files;
};

const uploadMediaFile=async(file,path)=>{
  const {error}=await supabaseClient.storage.from(mediaBucket).upload(path,file,{upsert:true,cacheControl:'60',contentType:file.type||'image/png'});
  if(error)throw error;
};

const replaceMediaFile=(path)=>{
  const input=document.createElement('input');
  input.type='file';
  input.accept='image/*';
  input.hidden=true;
  input.onchange=async()=>{
    const file=input.files?.[0];
    if(!file){input.remove();return}
    mediaStatus.textContent=`Sustituyendo ${path}…`;
    try{await uploadMediaFile(file,path);mediaStatus.textContent=`Imagen actualizada: ${path}`;await loadMediaLibrary()}
    catch(error){mediaStatus.textContent=`No se pudo actualizar ${path}: ${error.message}`}
    finally{input.remove()}
  };
  document.body.appendChild(input);
  input.click();
};

const loadMediaLibrary=async()=>{
  if(!supabaseClient||adminViews.media.hidden)return;
  mediaStatus.textContent='Consultando biblioteca…';
  mediaGrid.innerHTML='';
  try{
    const files=await listMediaFiles();
    mediaStatus.textContent=files.length?`${files.length} imágenes disponibles en Supabase Storage.`:'El bucket está vacío. Importa la carpeta assets para completar la migración.';
    files.forEach(file=>{
      const card=document.createElement('article');
      const image=document.createElement('img');
      const path=document.createElement('p');
      const button=document.createElement('button');
      const {data}=supabaseClient.storage.from(mediaBucket).getPublicUrl(file.path);
      image.src=`${data.publicUrl}?v=${encodeURIComponent(file.updated_at||Date.now())}`;
      image.alt=file.name;
      path.textContent=file.path;
      button.type='button';
      button.textContent='Reemplazar imagen';
      button.onclick=()=>replaceMediaFile(file.path);
      card.append(image,path,button);
      mediaGrid.appendChild(card);
    });
  }catch(error){mediaStatus.textContent=`No se pudo abrir la biblioteca. Ejecuta primero supabase-storage-setup.sql. ${error.message}`}
};

document.querySelector('#admin-media-refresh').onclick=loadMediaLibrary;
document.querySelector('#admin-media-folder').onchange=async event=>{
  const files=[...event.target.files].filter(file=>file.type.startsWith('image/'));
  if(!files.length)return;
  let uploaded=0;
  try{
    for(const file of files){
      const parts=(file.webkitRelativePath||file.name).replace(/\\/g,'/').split('/');
      if(parts[0].toLowerCase()==='assets')parts.shift();
      const path=parts.join('/');
      mediaStatus.textContent=`Subiendo ${uploaded+1} de ${files.length}: ${path}`;
      await uploadMediaFile(file,path);
      uploaded++;
    }
    mediaStatus.textContent=`Importación completada: ${uploaded} imágenes subidas.`;
    await loadMediaLibrary();
  }catch(error){mediaStatus.textContent=`Importación detenida tras ${uploaded} archivos: ${error.message}`}
  finally{event.target.value=''}
};

const adminBlogForm=document.querySelector('#admin-blog-form');
const adminBlogList=document.querySelector('#admin-blog-list');
const adminBlogStatus=document.querySelector('#admin-blog-status');
let adminArticles=[];
const articleSlug=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,140);
const resetAdminBlogForm=()=>{
  adminBlogForm.reset();
  adminBlogForm.elements.id.value='';
  adminBlogForm.elements.slug.value='';
  adminBlogForm.elements.sort_order.value='0';
  adminBlogForm.elements.is_published.checked=true;
  document.querySelector('#admin-blog-form-title').textContent='NUEVO ARTÍCULO';
  document.querySelector('#admin-blog-cancel').hidden=true;
  adminBlogStatus.textContent='';
};
const editAdminArticle=article=>{
  adminBlogForm.elements.id.value=article.id;
  adminBlogForm.elements.slug.value=article.slug;
  adminBlogForm.elements.title.value=article.title;
  adminBlogForm.elements.category.value=article.category;
  adminBlogForm.elements.excerpt.value=article.excerpt;
  adminBlogForm.elements.content.value=article.content;
  adminBlogForm.elements.sort_order.value=article.sort_order;
  adminBlogForm.elements.is_published.checked=article.is_published;
  document.querySelector('#admin-blog-form-title').textContent='EDITANDO ARTÍCULO';
  document.querySelector('#admin-blog-cancel').hidden=false;
  adminBlogForm.scrollIntoView({behavior:'smooth',block:'start'});
};
const deleteAdminArticle=async article=>{
  if(!confirm(`¿Eliminar definitivamente «${article.title}»?`))return;
  const {error}=await supabaseClient.from('blog_articles').delete().eq('id',article.id);
  if(error){alert('No se ha podido eliminar el artículo.');console.error(error);return}
  if(adminBlogForm.elements.id.value===article.id)resetAdminBlogForm();
  await loadAdminArticles();
};
const createAdminArticleCard=article=>{
  const card=document.createElement('article');
  card.className=`admin-blog-card ${article.is_published?'is-published':'is-draft'}`;
  const meta=document.createElement('p');meta.className='admin-blog-card-meta';meta.textContent=`${article.category} · ORDEN ${article.sort_order} · ${article.is_published?'PUBLICADO':'BORRADOR'}`;
  const title=document.createElement('h2');title.textContent=article.title;
  const excerpt=document.createElement('p');excerpt.textContent=article.excerpt;
  const actions=document.createElement('div');actions.className='admin-blog-card-actions';
  const edit=document.createElement('button');edit.type='button';edit.textContent='Editar';edit.onclick=()=>editAdminArticle(article);
  const remove=document.createElement('button');remove.type='button';remove.className='danger';remove.textContent='Eliminar';remove.onclick=()=>deleteAdminArticle(article);
  actions.append(edit,remove);card.append(meta,title,excerpt,actions);return card;
};
const loadAdminArticles=async()=>{
  if(!supabaseClient||adminViews.blog.hidden)return;
  adminBlogList.innerHTML='<p class="admin-blog-empty">Cargando artículos…</p>';
  const {data,error}=await supabaseClient.from('blog_articles').select('id,slug,category,title,excerpt,content,is_published,sort_order,published_at').order('sort_order',{ascending:true}).order('published_at',{ascending:false});
  if(error){adminBlogList.innerHTML='<p class="admin-blog-empty">No se pueden recuperar los artículos. Ejecuta primero supabase-blog.sql.</p>';console.error(error);return}
  adminArticles=data||[];
  adminBlogList.replaceChildren(...adminArticles.map(createAdminArticleCard));
  if(!adminArticles.length)adminBlogList.innerHTML='<p class="admin-blog-empty">Todavía no hay artículos. Crea el primero desde el formulario.</p>';
};
adminBlogForm.onsubmit=async event=>{
  event.preventDefault();
  const button=adminBlogForm.querySelector('.admin-blog-form-actions button');
  const values=Object.fromEntries(new FormData(adminBlogForm));
  const id=values.id;
  const payload={title:values.title.trim(),category:values.category.trim().toUpperCase(),excerpt:values.excerpt.trim(),content:values.content.trim(),sort_order:Number(values.sort_order)||0,is_published:adminBlogForm.elements.is_published.checked,updated_at:new Date().toISOString()};
  payload.slug=values.slug||`${articleSlug(payload.title)}-${Date.now().toString(36)}`;
  adminBlogStatus.textContent=id?'Guardando cambios…':'Creando artículo…';button.disabled=true;
  try{
    const result=id?await supabaseClient.from('blog_articles').update(payload).eq('id',id):await supabaseClient.from('blog_articles').insert(payload);
    if(result.error)throw result.error;
    resetAdminBlogForm();await loadAdminArticles();adminBlogStatus.textContent='Artículo guardado correctamente.';setTimeout(()=>adminBlogStatus.textContent='',1800);
  }catch(error){console.error(error);adminBlogStatus.textContent=`No se ha podido guardar: ${error.message}`}
  finally{button.disabled=false}
};
document.querySelector('#admin-blog-cancel').onclick=resetAdminBlogForm;
document.querySelector('#admin-blog-refresh').onclick=loadAdminArticles;

const adminEventForm=document.querySelector('#admin-event-form');
const adminEventList=document.querySelector('#admin-event-list');
const adminEventStatus=document.querySelector('#admin-event-status');
let adminEvents=[];
const toJapanDateInput=value=>new Intl.DateTimeFormat('sv-SE',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Tokyo'}).format(new Date(value)).replace(' ','T');
const resetAdminEventForm=()=>{
  adminEventForm.reset();adminEventForm.elements.id.value='';adminEventForm.elements.capacity.min='1';adminEventForm.elements.capacity.value='20';adminEventForm.elements.sort_order.value='0';adminEventForm.elements.is_published.checked=true;
  document.querySelector('#admin-event-form-title').textContent='NUEVO EVENTO';document.querySelector('#admin-event-cancel').hidden=true;adminEventStatus.textContent='';
};
const editAdminEvent=event=>{
  adminEventForm.elements.id.value=event.id;adminEventForm.elements.title.value=event.title;adminEventForm.elements.description.value=event.description;adminEventForm.elements.location.value=event.location;adminEventForm.elements.starts_at.value=toJapanDateInput(event.starts_at);adminEventForm.elements.capacity.value=event.capacity;adminEventForm.elements.sort_order.value=event.sort_order;adminEventForm.elements.is_published.checked=event.is_published;
  adminEventForm.elements.capacity.min=String(Math.max(1,event.registered_count));document.querySelector('#admin-event-form-title').textContent=`EDITANDO EVENTO · ${event.registered_count} INSCRITOS`;document.querySelector('#admin-event-cancel').hidden=false;adminEventForm.scrollIntoView({behavior:'smooth',block:'start'});
};
const deleteAdminEvent=async event=>{
  if(!confirm(`¿Eliminar definitivamente «${event.title}» y sus ${event.registered_count} inscripciones?`))return;
  const {error}=await supabaseClient.from('events').delete().eq('id',event.id);
  if(error){alert('No se ha podido eliminar el evento.');console.error(error);return}
  if(adminEventForm.elements.id.value===event.id)resetAdminEventForm();await loadAdminEvents();
};
const createAdminEventCard=event=>{
  const card=document.createElement('article');card.className=`admin-event-card ${event.is_published?'is-published':'is-draft'}`;
  const meta=document.createElement('p');meta.className='admin-event-card-meta';meta.textContent=`${event.is_published?'PUBLICADO':'BORRADOR'} · ORDEN ${event.sort_order}`;
  const title=document.createElement('h2');title.textContent=event.title;
  const date=document.createElement('p');date.className='admin-event-card-date';date.textContent=new Intl.DateTimeFormat('es-ES',{dateStyle:'long',timeStyle:'short',timeZone:'Asia/Tokyo'}).format(new Date(event.starts_at))+' · hora de Japón';
  const place=document.createElement('p');place.textContent=event.location;
  const occupancy=document.createElement('strong');occupancy.className='admin-event-occupancy';occupancy.textContent=`${event.registered_count} personas apuntadas · ${Math.max(0,event.capacity-event.registered_count)} plazas libres de ${event.capacity}`;
  const actions=document.createElement('div');actions.className='admin-event-card-actions';
  const edit=document.createElement('button');edit.type='button';edit.textContent='Editar';edit.onclick=()=>editAdminEvent(event);
  const remove=document.createElement('button');remove.type='button';remove.className='danger';remove.textContent='Eliminar';remove.onclick=()=>deleteAdminEvent(event);
  actions.append(edit,remove);card.append(meta,title,date,place,occupancy,actions);return card;
};
const loadAdminEvents=async()=>{
  if(!supabaseClient||adminViews.events.hidden)return;
  adminEventList.innerHTML='<p class="admin-event-empty">Cargando eventos…</p>';
  const {data,error}=await supabaseClient.from('events').select('id,title,description,location,starts_at,capacity,registered_count,is_published,sort_order').order('sort_order',{ascending:true}).order('starts_at',{ascending:true});
  if(error){adminEventList.innerHTML='<p class="admin-event-empty">No se pueden recuperar los eventos. Ejecuta primero supabase-events.sql.</p>';console.error(error);return}
  adminEvents=data||[];adminEventList.replaceChildren(...adminEvents.map(createAdminEventCard));if(!adminEvents.length)adminEventList.innerHTML='<p class="admin-event-empty">Todavía no hay eventos. Crea el primero desde el formulario.</p>';
};
adminEventForm.onsubmit=async submitEvent=>{
  submitEvent.preventDefault();
  const button=adminEventForm.querySelector('.admin-event-form-actions button'),values=Object.fromEntries(new FormData(adminEventForm)),id=values.id;
  const payload={title:values.title.trim(),description:values.description.trim(),location:values.location.trim(),starts_at:new Date(`${values.starts_at}:00+09:00`).toISOString(),capacity:Number(values.capacity),sort_order:Number(values.sort_order)||0,is_published:adminEventForm.elements.is_published.checked,updated_at:new Date().toISOString()};
  adminEventStatus.textContent=id?'Guardando cambios…':'Creando evento…';button.disabled=true;
  try{
    const result=id?await supabaseClient.from('events').update(payload).eq('id',id):await supabaseClient.from('events').insert(payload);if(result.error)throw result.error;
    resetAdminEventForm();await loadAdminEvents();adminEventStatus.textContent='Evento guardado correctamente.';setTimeout(()=>adminEventStatus.textContent='',1800);
  }catch(error){console.error(error);adminEventStatus.textContent=`No se ha podido guardar: ${error.message}`}
  finally{button.disabled=false}
};
document.querySelector('#admin-event-cancel').onclick=()=>{adminEventForm.elements.capacity.min='1';resetAdminEventForm()};
document.querySelector('#admin-event-refresh').onclick=loadAdminEvents;

const isAdmin=user=>user?.app_metadata?.role==='admin';
const safeState=state=>({read:[],mailRead:0,finalFileSeen:false,finalAlertShown:false,completed:false,...(state||{})});
const adminExit=async()=>{try{if(mailboxChannel&&supabaseClient){await supabaseClient.removeChannel(mailboxChannel);mailboxChannel=null}if(supabaseClient)await supabaseClient.auth.signOut()}finally{currentUser=null;remoteState=null;adminPanel.hidden=true;location.href='../index.html'}};
document.querySelector('#admin-exit').onclick=adminExit;

// El alta se muestra directamente en su pestaña y continúa solicitándose a
// la Edge Function, por lo que la clave de administración nunca viaja al navegador.
const adminCreateSection=document.createElement('section');
adminCreateSection.className='admin-create-section admin-create-inline';
adminCreateSection.innerHTML=`<p class="system-line">NUEVO DESTINATARIO · ACCESO CONTROLADO</p><h2>Crear una nueva<br><em>expedición.</em></h2><p>Introduce los datos de acceso que recibirá el nuevo destinatario.</p><form id="admin-create-user-form"><label>Nombre visible<input name="displayName" type="text" autocomplete="name" required maxlength="80" placeholder="Nombre y apellidos"></label><label>Correo electrónico<input name="email" type="email" autocomplete="email" required placeholder="nombre@correo.com"></label><label>Contraseña temporal<input name="password" type="password" autocomplete="new-password" required minlength="8" placeholder="Mínimo 8 caracteres"></label><button>Crear usuario</button><span id="admin-create-user-status" role="status"></span></form>`;
document.querySelector('#admin-user-create-tab').appendChild(adminCreateSection);

const functionErrorMessage=async error=>{
  try{
    const details=await error?.context?.clone().json();
    if(details?.error)return details.error;
  }catch(_){/* La respuesta puede no ser JSON. */}
  return error?.message||'No se ha podido completar la operación.';
};
document.querySelector('#admin-create-user-form').onsubmit=async event=>{
  event.preventDefault();
  const form=event.currentTarget;
  const status=document.querySelector('#admin-create-user-status');
  const button=form.querySelector('button');
  const payload=Object.fromEntries(new FormData(form));
  status.textContent='Creando expediente…';
  button.disabled=true;
  try{
    const {data,error}=await supabaseClient.functions.invoke('create-expedient-user',{body:payload});
    if(error)throw error;
    status.textContent=`Usuario creado: ${data?.email||payload.email}`;
    form.reset();
    await openAdminDashboard();
    setTimeout(()=>status.textContent='',1800);
  }catch(error){
    console.error(error);
    status.textContent=await functionErrorMessage(error);
  }finally{button.disabled=false}
};

const renderAdminEditorLegacy=(profile,state)=>{
  const editor=document.querySelector('#admin-editor');
  const current=safeState(state);
  const reviewed=progressKeys.filter(id=>current.read.includes(id)).length;
  const integrity=Math.round(reviewed/progressKeys.length*100);
  editor.hidden=false;
  editor.innerHTML=`<div class="admin-summary"><p class="system-line">DESTINATARIO SELECCIONADO</p><h2>${profile.display_name||profile.email}</h2><p>${profile.email}</p><p><strong>${reviewed}</strong> de ${progressKeys.length} registros confirmados · Integridad <strong>${integrity} %</strong></p></div><form id="admin-progress-form"><fieldset><legend>DOCUMENTOS Y REGISTROS CONFIRMADOS</legend><div class="admin-checklist">${progressKeys.map(id=>`<label><input type="checkbox" name="records" value="${id}" ${current.read.includes(id)?'checked':''}> ${id}${folders[id]?.title?` · ${folders[id].title}`:''}</label>`).join('')}</div></fieldset><p class="admin-note">Al desmarcar KTB-014 se reabre el expediente y se restaura el aviso final para una nueva revisión.</p><button>Guardar cambios</button><span id="admin-save-status" role="status"></span></form>`;
  const activityLog=document.createElement('section');
  activityLog.id='admin-activity-log';
  activityLog.style.cssText='margin-top:36px;padding-top:22px;border-top:1px solid #c6bda9';
  activityLog.innerHTML='<p class="system-line">REGISTRO DE ACTIVIDAD</p><h3 style="margin:7px 0 16px;font:27px var(--serif)">Actividad reciente</h3><p>Cargando actividad del expediente…</p>';
  editor.appendChild(activityLog);
  const isActive=profile.is_active!==false;
  const identityForm=document.createElement('form');
  identityForm.id='admin-identity-form';
  identityForm.className='admin-identity-form';
  identityForm.innerHTML=`<fieldset><legend>IDENTIDAD Y ACCESO</legend><label>Nombre y apellidos<input name="displayName" required maxlength="80" value="${profile.display_name||''}"></label><p class="admin-account-status ${isActive?'active':'inactive'}">${isActive?'● Cuenta activa':'● Cuenta desactivada'}</p><div class="admin-identity-actions"><button>Guardar nombre</button><button type="button" id="admin-toggle-user" class="${isActive?'danger':''}">${isActive?'Desactivar acceso':'Reactivar acceso'}</button></div><span id="admin-identity-status" role="status"></span></fieldset>`;
  editor.insertBefore(identityForm,document.querySelector('#admin-progress-form'));
  const resetPanel=document.createElement('section');
  resetPanel.className='admin-reset-panel';
  resetPanel.style.cssText='margin-top:26px;padding:20px;border:1px solid #a84a42;background:#f5e1d8';
  resetPanel.innerHTML='<p class="system-line" style="color:#7e1b19">REINICIO DE EXPEDIENTE</p><h3 style="margin:7px 0;font:24px var(--serif)">Limpiar expediente</h3><p style="max-width:620px">Elimina todos los documentos confirmados, avisos, páginas leídas del cómic y mensajes del destinatario. Esta acción no borra su cuenta ni su nombre.</p><button type="button" id="admin-reset-progress" style="background:#7e1b19;color:#fff;border:0;padding:13px 16px;font:10px var(--mono);cursor:pointer">Limpiar expediente</button><span id="admin-reset-status" role="status" style="margin-left:12px;font:11px var(--mono)"></span>';
  editor.insertBefore(resetPanel,activityLog);
  document.querySelector('#admin-reset-progress').onclick=async()=>{
    const resetButton=document.querySelector('#admin-reset-progress');
    const status=document.querySelector('#admin-reset-status');
    if(!confirm(`¿Limpiar por completo el expediente de ${profile.display_name||profile.email}? Se perderá su progreso actual.`))return;
    resetButton.disabled=true;
    status.textContent='Reiniciando expediente…';
    try{
      const {data,error}=await supabaseClient.functions.invoke('create-expedient-user',{body:{action:'reset-progress',userId:profile.id}});
      if(error)throw error;
      renderAdminEditor(profile,data?.state||safeState());
    }catch(error){
      console.error(error);
      status.textContent=await functionErrorMessage(error);
      resetButton.disabled=false;
    }
  };
  identityForm.onsubmit=async event=>{
    event.preventDefault();
    const name=new FormData(identityForm).get('displayName').trim();
    const status=document.querySelector('#admin-identity-status');
    const button=identityForm.querySelector('button');
    status.textContent='Actualizando identidad…';button.disabled=true;
    try{
      const {data,error}=await supabaseClient.functions.invoke('create-expedient-user',{body:{action:'update-profile',userId:profile.id,displayName:name}});
      if(error)throw error;
      profile.display_name=data?.displayName||name;
      status.textContent='Nombre actualizado.';
      setTimeout(()=>renderAdminEditor(profile,current),500);
    }catch(error){console.error(error);status.textContent=await functionErrorMessage(error)}finally{button.disabled=false}
  };
  document.querySelector('#admin-toggle-user').onclick=async()=>{
    const toggle=document.querySelector('#admin-toggle-user');
    const status=document.querySelector('#admin-identity-status');
    const nextActive=!isActive;
    if(!confirm(nextActive?'¿Reactivar el acceso de este destinatario?':'¿Desactivar el acceso de este destinatario? No podrá iniciar sesión hasta que lo reactives.'))return;
    toggle.disabled=true;status.textContent=nextActive?'Reactivando acceso…':'Desactivando acceso…';
    try{
      const {data,error}=await supabaseClient.functions.invoke('create-expedient-user',{body:{action:'set-active',userId:profile.id,active:nextActive}});
      if(error)throw error;
      profile.is_active=data?.isActive===undefined?nextActive:data.isActive;
      renderAdminEditor(profile,current);
    }catch(error){console.error(error);status.textContent=await functionErrorMessage(error);toggle.disabled=false}
  };
  document.querySelector('#admin-progress-form').onsubmit=async event=>{
    event.preventDefault();
    const status=document.querySelector('#admin-save-status');
    const selected=[...event.currentTarget.querySelectorAll('input[name="records"]:checked')].map(input=>input.value);
    const closing=selected.includes('KTB-014');
    const nextState={...current,read:selected,completed:closing?current.completed:false,finalAlertShown:closing?current.finalAlertShown:false,finalFileSeen:closing?current.finalFileSeen:false};
    status.textContent='Guardando…';
    const {error}=await supabaseClient.from('expedient_progress').upsert({user_id:profile.id,state:nextState,updated_at:new Date().toISOString()});
    if(error){status.textContent='No se pudieron guardar los cambios.';console.error(error);return}
    status.textContent='Cambios guardados.';
    renderAdminEditor(profile,nextState);
  };
  renderAdminActivity(profile.id);
};

const renderAdminActivityLegacy=async userId=>{
  const target=document.querySelector('#admin-activity-log');
  if(!target)return;
  try{
    const {data,error}=await supabaseClient.from('expedient_activity_log')
      .select('event_type,document_id,details,created_at')
      .eq('user_id',userId)
      .order('created_at',{ascending:false})
      .limit(50);
    if(error)throw error;
    if(!data?.length){target.innerHTML='<p class="system-line">REGISTRO DE ACTIVIDAD</p><h3 style="margin:7px 0 16px;font:27px var(--serif)">Actividad reciente</h3><p>Aún no hay actividad registrada para este destinatario.</p>';return}
    const rows=data.map(item=>{
      const title=item.event_type==='login'?'Inicio de sesión verificado':item.event_type==='logout'?'Cierre de sesión':item.event_type==='comic_page_read'?`Registro ilustrado · ${item.details?.read||'?'} / ${item.details?.total||11} páginas leídas`:item.event_type==='supplementary_file_consulted'?'Archivo final consultado':item.event_type==='expedient_reset'?'Expediente reiniciado por administración':item.details?.source?.startsWith('recovered_file')?`Archivo recuperado confirmado · ${item.document_id||'Documento'}`:`Lectura confirmada · ${item.document_id||'Documento'}`;
      const date=new Date(item.created_at).toLocaleString('es-ES',{dateStyle:'short',timeStyle:'short'});
      return `<li style="display:flex;justify-content:space-between;align-items:flex-start;gap:18px;padding:11px 0;border-top:1px solid #ddd1ba;font:13px var(--serif)"><strong>${title}</strong><small style="font:9px var(--mono);color:#7e1b19;white-space:nowrap">${date}</small></li>`;
    }).join('');
    target.innerHTML=`<p class="system-line">REGISTRO DE ACTIVIDAD</p><h3 style="margin:7px 0 6px;font:27px var(--serif)">Actividad reciente</h3><p style="margin:0 0 12px;font:11px var(--mono);color:#746957">Los eventos más recientes aparecen primero. Desplázate para consultar los anteriores.</p><div style="max-height:min(420px,52vh);overflow-y:auto;overscroll-behavior:contain;padding-right:10px;scrollbar-width:thin;scrollbar-color:#8d1f1b #eee5d3"><ol style="margin:0;padding:0;list-style:none">${rows}</ol></div>`;
  }catch(error){
    console.error('No se pudo cargar el registro de actividad.',error);
    target.innerHTML='<p class="system-line">REGISTRO DE ACTIVIDAD</p><h3 style="margin:7px 0 16px;font:27px var(--serif)">Actividad reciente</h3><p>No se ha podido recuperar el historial de este destinatario.</p>';
  }
};

const adminEditorEscape=value=>String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const adminRecordTitle=id=>{
  if(id.startsWith('KTB-'))return `Expediente ${id}`;
  for(const folder of Object.values(folders)){const file=folder.files.find(item=>item.id===id);if(file)return file.title}
  const ticket=ar01Tickets.find(item=>item.id===id);if(ticket)return ticket.title;
  if(id==='AR03-CARTA')return 'Carta de introducción geográfica';
  if(id.startsWith('AR03-C-'))return `Guía de ciudad ${Number(id.split('-').at(-1))+1}`;
  if(id.startsWith('AR03-T-'))return `Registro cultural ${Number(id.split('-').at(-1))+1}`;
  if(id==='AR06-PROTOCOL')return 'Protocolo de recuperación';
  return id;
};

const renderAdminEditor=(profile,state)=>{
  const editor=document.querySelector('#admin-editor'),current=safeState(state);
  const selected=new Set(current.read),reviewed=progressKeys.filter(id=>selected.has(id)).length,total=progressKeys.length;
  const integrity=Math.round(reviewed/total*100),isActive=profile.is_active!==false;
  const ktbRead=progressKeys.filter(id=>id.startsWith('KTB-')&&selected.has(id)).length;
  const accessLevel=roman(Math.max(1,Math.min(8,ktbRead-5||1)));
  const displayName=adminEditorEscape(profile.display_name||profile.email),email=adminEditorEscape(profile.email);
  const documents=progressKeys.map(id=>{
    const read=selected.has(id),title=adminEditorEscape(adminRecordTitle(id));
    return `<label class="admin-document-row" data-status="${read?'read':'pending'}" data-search="${adminEditorEscape(`${id} ${title}`.toLowerCase())}" data-document-id="${id}"><span class="admin-document-code">${id}</span><span class="admin-document-title">${title}</span><span class="admin-document-state ${read?'is-read':''}">${read?'LEÍDO':'PENDIENTE'}</span><time class="admin-document-date">${read?'Registrado':'—'}</time><input type="checkbox" name="records" value="${id}" ${read?'checked':''}><i aria-hidden="true"></i></label>`;
  }).join('');
  editor.hidden=false;editor.className='admin-user-workspace';
  editor.innerHTML=`<header class="admin-user-profile"><div><p class="system-line">DESTINATARIO SELECCIONADO</p><h2>${displayName}</h2><p>${email}</p></div><dl><div><dt>Expediente</dt><dd>KTB-EXP-2026-JP-00184</dd><span class="admin-user-badge ${isActive?'active':'inactive'}">${isActive?'CUENTA ACTIVA':'CUENTA DESACTIVADA'}</span></div><div><dt>Documentos</dt><dd>${reviewed} de ${total}</dd></div><div><dt>Progreso</dt><dd>${integrity} %</dd></div><div><dt>Última actividad</dt><dd id="admin-last-activity">Consultando…</dd></div></dl></header><nav class="admin-editor-tabs" role="tablist"><button type="button" data-editor-tab="summary">Resumen</button><button type="button" class="active" data-editor-tab="documents">Documentos</button><button type="button" data-editor-tab="activity">Actividad</button><button type="button" data-editor-tab="settings">Ajustes</button></nav><div class="admin-user-body"><div class="admin-user-main"><section class="admin-editor-panel" data-editor-panel="summary" hidden><p class="system-line">RESUMEN DEL EXPEDIENTE</p><h3>Estado general</h3><div class="admin-overview-grid"><article><strong>${reviewed}</strong><span>Registros confirmados</span></article><article><strong>${total-reviewed}</strong><span>Registros pendientes</span></article><article><strong>${accessLevel}</strong><span>Nivel de acceso</span></article><article><strong>${integrity} %</strong><span>Integridad documental</span></article></div></section><section class="admin-editor-panel" data-editor-panel="documents"><div class="admin-document-toolbar"><div class="admin-document-filters"><button type="button" class="active" data-record-filter="all">Todos</button><button type="button" data-record-filter="read">Leídos</button><button type="button" data-record-filter="pending">Pendientes</button></div><label><span>Buscar documento</span><input id="admin-document-search" type="search" placeholder="Buscar documento"></label></div><form id="admin-progress-form"><div class="admin-document-grid">${documents}</div><p class="admin-note">Al desmarcar KTB-014 se reabre el expediente y se restaura el aviso final para una nueva revisión.</p></form><details class="admin-identity-details"><summary>Identidad y acceso</summary><form id="admin-identity-form"><label>Nombre y apellidos<input name="displayName" required maxlength="80" value="${displayName}"></label><div><span>Estado de la cuenta</span><button type="button" id="admin-toggle-user" class="admin-account-toggle ${isActive?'active':''}" aria-pressed="${isActive}"><i></i>${isActive?'Cuenta activa':'Cuenta desactivada'}</button></div><button>Guardar identidad</button><span id="admin-identity-status" role="status"></span></form></details></section><section class="admin-editor-panel" data-editor-panel="activity" hidden><div id="admin-activity-log"><p class="system-line">REGISTRO DE ACTIVIDAD</p><h3>Actividad del expediente</h3><p>Cargando actividad…</p></div></section><section class="admin-editor-panel" data-editor-panel="settings" hidden><p class="system-line">AJUSTES DEL DESTINATARIO</p><h3>Acceso y seguridad</h3><p>Gestiona la identidad, el acceso y las acciones permanentes de este expediente.</p><button type="button" class="admin-open-identity">Editar identidad y acceso</button></section></div><aside class="admin-user-side"><section class="admin-progress-card"><p class="system-line">PROGRESO DEL EXPEDIENTE</p><strong>${integrity} %</strong><div><i style="width:${integrity}%"></i></div><dl><div><dt>${reviewed}</dt><dd>Documentos leídos</dd></div><div><dt>${total-reviewed}</dt><dd>Documentos pendientes</dd></div></dl><p>NIVEL DE ACCESO ACTUAL<br><b>${accessLevel}</b></p><button type="button" id="admin-save-progress">Guardar cambios</button><span id="admin-save-status" role="status"></span></section><section class="admin-activity-preview"><p class="system-line">ACTIVIDAD RECIENTE</p><div id="admin-activity-preview"><p>Cargando actividad…</p></div><button type="button" id="admin-view-all-activity">Ver actividad completa →</button></section><section class="admin-danger-zone"><p class="system-line">ZONA DE SEGURIDAD</p><p>Estas acciones afectan al acceso o al progreso guardado.</p><button type="button" id="admin-reset-progress">Limpiar expediente</button><button type="button" id="admin-side-toggle-user">${isActive?'Desactivar acceso':'Reactivar acceso'}</button><span id="admin-reset-status" role="status"></span></section></aside></div>`;

  const documentsPanel=editor.querySelector('[data-editor-panel="documents"]'),settingsPanel=editor.querySelector('[data-editor-panel="settings"]');
  const identityDetails=editor.querySelector('.admin-identity-details'),dangerZone=editor.querySelector('.admin-danger-zone');
  identityDetails.open=true;settingsPanel.append(identityDetails,dangerZone);
  const albertoSettings=document.createElement('section'),expedientCompleted=Boolean(current.completed&&selected.has('KTB-014'));
  albertoSettings.className='admin-message-settings';
  albertoSettings.innerHTML=`<p class="system-line">COMUNICACIÓN FINAL</p><h4>Mensaje de Alberto</h4><p>${expedientCompleted?current.albertoResponseAccepted===true?'La decisión final ya está registrada. Puedes restaurar el mensaje y repetir el flujo completo.':current.albertoMessageRead===true?'El destinatario ya ha leído el mensaje. Puedes volver a mostrarlo como pendiente.':'El mensaje está pendiente de lectura.':'Esta acción estará disponible cuando el expediente esté completado.'}</p><button type="button" id="admin-reset-alberto" ${expedientCompleted?'':'disabled'}>Restaurar mensaje y decisión final</button><span id="admin-alberto-status" role="status"></span>`;
  settingsPanel.insertBefore(albertoSettings,dangerZone);
  const saveActions=document.createElement('div');saveActions.className='admin-document-save';
  saveActions.append(editor.querySelector('#admin-save-progress'),editor.querySelector('#admin-save-status'));
  documentsPanel.querySelector('#admin-progress-form').append(saveActions);
  editor.querySelector('.admin-user-side').remove();
  [...editor.querySelectorAll('.admin-user-profile dl>div')].slice(1).forEach(item=>item.remove());

  const activateTab=name=>{editor.querySelectorAll('[data-editor-tab]').forEach(button=>button.classList.toggle('active',button.dataset.editorTab===name));editor.querySelectorAll('[data-editor-panel]').forEach(panel=>panel.hidden=panel.dataset.editorPanel!==name)};
  editor.querySelectorAll('[data-editor-tab]').forEach(button=>button.onclick=()=>activateTab(button.dataset.editorTab));
  const viewAllActivity=document.querySelector('#admin-view-all-activity');if(viewAllActivity)viewAllActivity.onclick=()=>activateTab('activity');
  document.querySelector('.admin-open-identity').onclick=()=>{activateTab('settings');const details=document.querySelector('.admin-identity-details');details.open=true;details.scrollIntoView({behavior:'smooth',block:'center'})};
  let recordFilter='all';
  const filterRecords=()=>{const query=document.querySelector('#admin-document-search').value.trim().toLowerCase();editor.querySelectorAll('.admin-document-row').forEach(row=>row.hidden=(recordFilter!=='all'&&row.dataset.status!==recordFilter)||!row.dataset.search.includes(query))};
  editor.querySelectorAll('[data-record-filter]').forEach(button=>button.onclick=()=>{recordFilter=button.dataset.recordFilter;editor.querySelectorAll('[data-record-filter]').forEach(item=>item.classList.toggle('active',item===button));filterRecords()});
  document.querySelector('#admin-document-search').oninput=filterRecords;
  editor.querySelectorAll('.admin-document-row input').forEach(input=>input.onchange=()=>{const row=input.closest('.admin-document-row');row.dataset.status=input.checked?'read':'pending';row.querySelector('.admin-document-state').textContent=input.checked?'LEÍDO':'PENDIENTE';row.querySelector('.admin-document-state').classList.toggle('is-read',input.checked);row.querySelector('.admin-document-date').textContent=input.checked?'Sin guardar':'—';filterRecords()});

  const saveProgress=async()=>{const status=document.querySelector('#admin-save-status'),button=document.querySelector('#admin-save-progress');const records=[...editor.querySelectorAll('input[name="records"]:checked')].map(input=>input.value),closing=records.includes('KTB-014'),wasCompleted=Boolean(current.completed);const nextState={...current,read:records,completed:closing,albertoMessageRead:closing&&wasCompleted?Boolean(current.albertoMessageRead):false,albertoResponseAccepted:closing&&wasCompleted?Boolean(current.albertoResponseAccepted):false,finalAlertShown:closing?current.finalAlertShown:false,finalFileSeen:closing?current.finalFileSeen:false};status.textContent='Guardando…';button.disabled=true;const {error}=await supabaseClient.from('expedient_progress').upsert({user_id:profile.id,state:nextState,updated_at:new Date().toISOString()});if(error){status.textContent='No se pudieron guardar los cambios.';console.error(error);button.disabled=false;return}renderAdminEditor(profile,nextState)};
  document.querySelector('#admin-save-progress').onclick=saveProgress;
  const identityForm=document.querySelector('#admin-identity-form');
  identityForm.onsubmit=async event=>{event.preventDefault();const status=document.querySelector('#admin-identity-status'),button=identityForm.querySelector('button:not([type="button"])'),newName=new FormData(identityForm).get('displayName').trim();status.textContent='Actualizando identidad…';button.disabled=true;try{const {data,error}=await supabaseClient.functions.invoke('create-expedient-user',{body:{action:'update-profile',userId:profile.id,displayName:newName}});if(error)throw error;profile.display_name=data?.displayName||newName;renderAdminEditor(profile,current)}catch(error){console.error(error);status.textContent=await functionErrorMessage(error);button.disabled=false}};
  const toggleAccess=async()=>{const nextActive=!isActive;if(!confirm(nextActive?'¿Reactivar el acceso de este destinatario?':'¿Desactivar el acceso de este destinatario? No podrá iniciar sesión hasta que lo reactives.'))return;const buttons=[document.querySelector('#admin-toggle-user'),document.querySelector('#admin-side-toggle-user')];buttons.forEach(button=>button.disabled=true);try{const {data,error}=await supabaseClient.functions.invoke('create-expedient-user',{body:{action:'set-active',userId:profile.id,active:nextActive}});if(error)throw error;profile.is_active=data?.isActive===undefined?nextActive:data.isActive;renderAdminEditor(profile,current)}catch(error){console.error(error);buttons.forEach(button=>button.disabled=false);document.querySelector('#admin-identity-status').textContent=await functionErrorMessage(error)}};
  document.querySelector('#admin-toggle-user').onclick=toggleAccess;document.querySelector('#admin-side-toggle-user').onclick=toggleAccess;
  document.querySelector('#admin-reset-alberto').onclick=async()=>{const button=document.querySelector('#admin-reset-alberto'),status=document.querySelector('#admin-alberto-status');if(!confirm(`¿Volver a mostrar el mensaje y la decisión final a ${profile.display_name||profile.email}?`))return;button.disabled=true;status.textContent='Restaurando mensaje…';const nextState={...current,completed:true,albertoMessageRead:false,albertoResponseAccepted:false,albertoResponse:null,albertoRespondedAt:null,acceptanceEmailSentAt:null,acceptanceEmailId:null};const {error}=await supabaseClient.from('expedient_progress').upsert({user_id:profile.id,state:nextState,updated_at:new Date().toISOString()});if(error){console.error(error);status.textContent='No se ha podido restaurar el mensaje.';button.disabled=false;return}renderAdminEditor(profile,nextState)};
  document.querySelector('#admin-reset-progress').onclick=async()=>{const button=document.querySelector('#admin-reset-progress'),status=document.querySelector('#admin-reset-status');if(!confirm(`¿Limpiar por completo el expediente de ${profile.display_name||profile.email}? Esta acción no se puede deshacer.`))return;button.disabled=true;status.textContent='Limpiando expediente…';try{const {data,error}=await supabaseClient.functions.invoke('create-expedient-user',{body:{action:'reset-progress',userId:profile.id}});if(error)throw error;renderAdminEditor(profile,data?.state||safeState())}catch(error){console.error(error);status.textContent=await functionErrorMessage(error);button.disabled=false}};
  renderAdminActivity(profile.id);
};

const renderAdminActivity=async userId=>{
  const full=document.querySelector('#admin-activity-log'),preview=document.querySelector('#admin-activity-preview'),last=document.querySelector('#admin-last-activity');if(!full)return;
  try{const {data,error}=await supabaseClient.from('expedient_activity_log').select('event_type,document_id,details,created_at').eq('user_id',userId).order('created_at',{ascending:false});if(error)throw error;const items=data||[];if(last)last.textContent=items[0]?new Date(items[0].created_at).toLocaleDateString('es-ES'):'Sin actividad';
    const activityTitle=item=>item.event_type==='login'?'Inicio de sesión verificado':item.event_type==='logout'?'Cierre de sesión':item.event_type==='comic_page_read'?`Registro ilustrado · ${item.details?.read||'?'} / ${item.details?.total||11} páginas`:item.event_type==='supplementary_file_consulted'?'Archivo final consultado':item.event_type==='expedient_reset'?'Expediente reiniciado por administración':item.details?.source?.startsWith('recovered_file')?`Archivo recuperado · ${item.document_id||'Documento'}`:`Lectura confirmada · ${item.document_id||'Documento'}`;
    const row=item=>`<li><time>${new Date(item.created_at).toLocaleString('es-ES',{dateStyle:'short',timeStyle:'short'})}</time><strong>${adminEditorEscape(activityTitle(item))}</strong></li>`;
    if(!items.length){full.innerHTML='<p class="system-line">REGISTRO DE ACTIVIDAD</p><h3>Actividad del expediente</h3><p>Aún no hay actividad registrada para este destinatario.</p>';if(preview)preview.innerHTML='<p>Sin actividad registrada.</p>';return}
    full.innerHTML=`<p class="system-line">REGISTRO DE ACTIVIDAD</p><h3>Actividad del expediente</h3><p class="admin-activity-count">${items.length} registros</p><ol class="admin-activity-list">${items.map(row).join('')}</ol>`;if(preview)preview.innerHTML=`<ol class="admin-activity-list compact">${items.slice(0,3).map(row).join('')}</ol>`;
    const dates=new Map();items.filter(item=>item.document_id).forEach(item=>{if(!dates.has(item.document_id))dates.set(item.document_id,new Date(item.created_at).toLocaleDateString('es-ES'))});dates.forEach((date,id)=>{const target=document.querySelector(`.admin-document-row[data-document-id="${id}"] .admin-document-date`);if(target)target.textContent=date});
  }catch(error){console.error(error);if(last)last.textContent='No disponible';full.innerHTML='<p>No se ha podido recuperar la actividad.</p>';if(preview)preview.innerHTML='<p>Actividad no disponible.</p>'}
};

const openAdminDashboard=async()=>{
  access.hidden=true;
  adminAccess.hidden=true;
  loading.hidden=false;
  document.querySelector('#auth-master-progress').parentElement.hidden=true;
  document.querySelector('#auth-skip').hidden=true;
  const log=document.querySelector('#auth-log');
  log.innerHTML='<p>Verificando acceso administrativo…</p><div style="height:8px;background:#d3c8b4"><i id="admin-access-progress" style="display:block;width:0;height:100%;background:#7e1b19;transition:width 1.2s ease"></i></div><p>Preparando herramientas de gestión…</p><div style="height:8px;background:#d3c8b4"><i id="admin-tools-progress" style="display:block;width:0;height:100%;background:#7e1b19;transition:width 1.2s ease"></i></div>';
  setTimeout(()=>document.querySelector('#admin-access-progress').style.width='100%',100);
  setTimeout(()=>document.querySelector('#admin-tools-progress').style.width='100%',1500);
  const [{data,error}]=await Promise.all([
    supabaseClient.from('expedient_profiles').select('id,email,display_name,is_active').order('email'),
    new Promise(resolve=>setTimeout(resolve,3000))
  ]);
  loading.hidden=true;
  if(error){adminAccess.hidden=false;adminMessage.textContent='No se ha podido cargar el directorio de expedientes.';console.error(error);return}
  adminPanel.hidden=false;
  refreshMailboxBadge();
  connectMailboxRealtime();
  const select=document.querySelector('#admin-user-list');
  if(select.closest('label')?.firstChild)select.closest('label').firstChild.nodeValue='BUSCAR DESTINATARIO';
  select.innerHTML='<option value="">Selecciona un destinatario</option>'+data.filter(profile=>profile.id!==currentUser.id).map(profile=>`<option value="${profile.id}">${profile.display_name||profile.email} · ${profile.email}</option>`).join('');
  select.onchange=async()=>{
    const profile=data.find(item=>item.id===select.value);
    if(!profile){document.querySelector('#admin-editor').hidden=true;return}
    const {data:progress,error:progressError}=await supabaseClient.from('expedient_progress').select('state').eq('user_id',profile.id).maybeSingle();
    if(progressError){console.error(progressError);return}
    renderAdminEditor(profile,progress?.state);
  };
};

setTimeout(()=>{
  const form=document.querySelector('#access-form');
  form.onsubmit=async event=>{
    event.preventDefault();
    const email=document.querySelector('#username').value.trim();
    const password=document.querySelector('#password').value;
    const submit=form.querySelector('button');
    message.textContent='Verificando autorización…';
    submit.disabled=true;
    try{
      const client=await getSupabase();
      const {data,error}=await client.auth.signInWithPassword({email,password});
      if(error)throw error;
      if(isAdmin(data.user)){await client.auth.signOut();throw new Error('Las cuentas administrativas deben usar el acceso privado.')}
      currentUser=data.user;
      await loadRemoteProgress(data.user);
      message.textContent='';
      openDashboard();
    }catch(error){message.textContent='No se han podido verificar las credenciales de acceso.';console.error(error)}finally{submit.disabled=false}
  };

  const restoreRecipientSession=async()=>{
    if(adminAccessMode)return;
    try{
      const client=await getSupabase();
      const {data:{session}}=await client.auth.getSession();
      if(!session||isAdmin(session.user)){access.hidden=false;return}
      currentUser=session.user;
      await loadRemoteProgress(session.user);
      message.textContent='';
      access.hidden=true;
      adminAccess.hidden=true;
      loading.hidden=true;
      gate.hidden=true;
      dash.hidden=false;
      render();
    }catch(error){console.warn('No se pudo restaurar la sesión del expediente.',error);message.textContent='';access.hidden=false}
  };
  void restoreRecipientSession();

  const adminForm=document.querySelector('#admin-access-form');
  adminForm.onsubmit=async event=>{
    event.preventDefault();
    const email=document.querySelector('#admin-username').value.trim();
    const password=document.querySelector('#admin-password').value;
    const submit=adminForm.querySelector('button');
    adminMessage.textContent='Verificando permisos administrativos…';
    submit.disabled=true;
    try{
      const client=await getSupabase();
      const {data,error}=await client.auth.signInWithPassword({email,password});
      if(error)throw error;
      if(!isAdmin(data.user)){await client.auth.signOut();throw new Error('La cuenta no dispone de permisos administrativos.')}
      currentUser=data.user;
      adminMessage.textContent='';
      await openAdminDashboard();
    }catch(error){adminMessage.textContent='No se han podido verificar las credenciales administrativas.';console.error(error)}finally{submit.disabled=false}
  };
},20);

// El registro ilustrado conserva una única evidencia por cada página vista.
// Así, volver atrás o releer una página no infla el historial de actividad.
function openComicViewer(page){
  const availablePages=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`)
    .filter(id=>read().includes(id)).length;
  if(!availablePages){openAcInfo();return}
  page=Math.min(Math.max(1,page),availablePages);

  const pagesRead=[...(getState().comicReadPages||[])]
    .map(Number)
    .filter(Number.isInteger);
  if(!pagesRead.includes(page)){
    const updatedPages=[...pagesRead,page].sort((a,b)=>a-b);
    patchState({comicReadPages:updatedPages});
    recordActivity('comic_page_read','AC-01',{
      page,
      read:updatedPages.length,
      total:11,
      progress:`${updatedPages.length}/11`
    });
  }

  active='AC-01';
  next.style.display='none';
  mark.style.display='none';
  const paper=document.querySelector('.paper');
  const body=document.querySelector('#doc-body');
  paper.style.width='';
  paper.style.maxWidth='';
  paper.style.padding='';
  body.style.maxWidth='';
  body.style.margin='';
  body.dataset.comicPage=String(page);
  body.dataset.comicPages=String(availablePages);
  document.querySelector('#doc-type').textContent='KIZUNA · DIVISIÓN DE ARCHIVOS TEMPORALES';
  document.querySelector('#doc-title').textContent='ARCHIVO COMPLEMENTARIO AC-01';
  body.innerHTML=`<img src="../assets/documents/AC-01/Pagina-${page}.png" alt="Página ${page} del registro ilustrado" style="display:block;width:100%;height:auto">`;
  comicPrevious.hidden=false;
  comicPrevious.disabled=page===1;
  comicPrevious.onclick=()=>openComicViewer(page-1);
  comicFollowing.hidden=false;
  comicFollowing.disabled=page===availablePages;
  comicFollowing.onclick=()=>openComicViewer(page+1);
  if(!viewer.open)viewer.showModal();
}
