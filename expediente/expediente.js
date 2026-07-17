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
const localState=()=>({read:JSON.parse(localStorage.getItem('kizuna-read')||'[]'),mailRead:Number(localStorage.getItem('kizuna-mail-read')||0),finalFileSeen:localStorage.getItem('kizuna-final-file-seen')==='true',completed:localStorage.getItem('kizuna-complete')==='true',finalFlowStage:localStorage.getItem('kizuna-final-flow-stage')||'',comicReadPages:JSON.parse(localStorage.getItem('kizuna-comic-read-pages')||'[]'),legalAccepted:localStorage.getItem('kizuna-legal-accepted')==='true',legalAcceptedAt:localStorage.getItem('kizuna-legal-accepted-at')||null,legalVersion:Number(localStorage.getItem('kizuna-legal-version')||1),loadingSeen:localStorage.getItem('kizuna-loading-seen')==='true',onboardingCompleted:localStorage.getItem('kizuna-onboarding-completed')==='true',onboardingCompletedAt:localStorage.getItem('kizuna-onboarding-completed-at')||null,onboardingVersion:Number(localStorage.getItem('kizuna-onboarding-version')||1)});
const getState=()=>remoteState||localState();
const read=()=>getState().read||[];
const getFinalFlowStage=()=>{const state=getState(),done=state.read||[];if(state.finalFlowStage)return state.finalFlowStage;if(state.finalFileSeen||state.finalAlertShown)return'closed';if(done.includes('KTB-014'))return'verification';return''};
const finalFlowPending=()=>read().includes('KTB-014')&&getFinalFlowStage()!=='closed';
const finalFlowClosed=()=>getFinalFlowStage()==='closed';
const persistRemote=async()=>{if(!supabaseClient||!currentUser||!remoteState)return;const {error}=await supabaseClient.from('expedient_progress').upsert({user_id:currentUser.id,state:remoteState,updated_at:new Date().toISOString()});if(error)console.error('No se pudo guardar el progreso remoto.',error)};
const recordActivity=async(eventType,documentId=null,details={})=>{
  if(!currentUser)return;
  try{
    const client=await getSupabase();
    const {data,error}=await client.from('expedient_activity_log').insert({
      user_id:currentUser.id,
      event_type:eventType,
      document_id:documentId,
      details
    }).select('id').single();
    if(error)throw error;
    const canNotify=(eventType==='document_confirmed'&&documentId!=='ALBERTO')||(eventType==='supplementary_file_consulted'&&documentId==='FINAL-01');
    if(canNotify&&data?.id)void client.functions.invoke('notify-expedient-activity',{body:{activityId:data.id}}).catch(error=>console.warn('No se pudo solicitar el aviso de actividad.',error));
  }catch(error){
    // El expediente continúa aunque el registro secundario no esté disponible.
    console.warn('No se pudo registrar la actividad del expediente.',error);
  }
};
const patchState=changes=>{if(remoteState){remoteState={...remoteState,...changes};return persistRemote()}const state={...localState(),...changes};localStorage.setItem('kizuna-read',JSON.stringify(state.read));localStorage.setItem('kizuna-mail-read',String(state.mailRead));localStorage.setItem('kizuna-final-file-seen',String(state.finalFileSeen));localStorage.setItem('kizuna-complete',String(state.completed));localStorage.setItem('kizuna-final-flow-stage',state.finalFlowStage||'');localStorage.setItem('kizuna-comic-read-pages',JSON.stringify(state.comicReadPages||[]));localStorage.setItem('kizuna-legal-accepted',String(Boolean(state.legalAccepted)));if(state.legalAcceptedAt)localStorage.setItem('kizuna-legal-accepted-at',state.legalAcceptedAt);else localStorage.removeItem('kizuna-legal-accepted-at');localStorage.setItem('kizuna-legal-version',String(state.legalVersion||1));localStorage.setItem('kizuna-loading-seen',String(Boolean(state.loadingSeen)));localStorage.setItem('kizuna-onboarding-completed',String(Boolean(state.onboardingCompleted)));if(state.onboardingCompletedAt)localStorage.setItem('kizuna-onboarding-completed-at',state.onboardingCompletedAt);else localStorage.removeItem('kizuna-onboarding-completed-at');localStorage.setItem('kizuna-onboarding-version',String(state.onboardingVersion||1));return Promise.resolve()};
const save=items=>patchState({read:items});
const getSupabase=async()=>{if(supabaseClient)return supabaseClient;if(!window.supabase){if(!supabaseScript){supabaseScript=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';script.onload=resolve;script.onerror=reject;document.head.appendChild(script)})}await supabaseScript}supabaseClient=window.supabase.createClient(supabaseUrl,supabaseKey);return supabaseClient};
const loadRemoteProgress=async user=>{currentUser=user;const client=await getSupabase();const [{data,error},{data:profile,error:profileError}]=await Promise.all([client.from('expedient_progress').select('state').eq('user_id',user.id).maybeSingle(),client.from('expedient_profiles').select('display_name,email,is_active').eq('id',user.id).maybeSingle()]);if(error)throw error;if(profileError)console.warn('No se pudo leer el nombre del perfil.',profileError);if(profile?.is_active===false){await client.auth.signOut();throw new Error('Este acceso ha sido desactivado por la División de Archivos Temporales.')}currentDisplayName=profile?.display_name||user.user_metadata?.display_name||user.email?.split('@')[0]||'Destinatario autorizado';updateRecipientName();if(data?.state){remoteState={read:[],mailRead:0,finalFileSeen:false,completed:false,finalFlowStage:'',comicReadPages:[],legalAccepted:false,legalAcceptedAt:null,legalVersion:1,loadingSeen:false,onboardingCompleted:false,onboardingCompletedAt:null,onboardingVersion:1,...data.state};return}remoteState=localState();await persistRemote()};
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
  startFinale=(...args)=>{finalSequenceActive=true;finalPopupPending=true;return originalStartFinale(...args)};
  showFinalFileAlert=()=>{if(finalSequenceActive||finalPopupPending)return;return originalFinalAlert()};
  viewer.addEventListener('close',()=>{finalPopupPending=false});
  const showFinalExitWarning=()=>{
    document.querySelector('#final-flow-exit-warning')?.remove();
    const warning=document.createElement('section');
    warning.id='final-flow-exit-warning';warning.className='final-flow-exit-warning';warning.setAttribute('role','dialog');warning.setAttribute('aria-modal','true');
    warning.innerHTML=`<div><p>CIERRE DE EXPEDIENTE EN CURSO</p><h2>El proceso todavía<br><em>no ha terminado.</em></h2><span>Tu avance está guardado. Si sales ahora, KTB-014 permanecerá pendiente y deberás continuar el cierre la próxima vez.</span><footer><button type="button" data-final-stay>Continuar el cierre</button><button type="button" data-final-leave>Salir y continuar después</button></footer></div>`;
    // El visor es un <dialog> modal y vive en la capa superior del navegador.
    // El aviso debe formar parte del propio diálogo para quedar visible y
    // recibir los clics mientras el cierre de KTB-014 está en curso.
    viewer.appendChild(warning);
    warning.querySelector('[data-final-stay]').onclick=()=>warning.remove();
    warning.querySelector('[data-final-leave]').onclick=()=>{warning.remove();finalSequenceActive=false;finalPopupPending=false;viewer.close();render()};
  };
  readerCloseButton.onclick=async()=>{if(viewer.classList.contains('is-reader-fullscreen')||document.fullscreenElement===viewer){await exitReaderFullscreen();return}if(finalFlowPending()&&active==='KTB-014'){showFinalExitWarning();return}viewer.close()};
  window.addEventListener('beforeunload',event=>{if(!finalFlowPending())return;event.preventDefault();event.returnValue=''});
  const openGuaranteedFinalAlert=()=>{
    if(getState().finalAlertShown)return;
    patchState({finalAlertShown:true});
    createFinalDiscoveryAlert(async()=>{await markFinalFileConsulted('final_alert');openFinalLocatedFile()});
  };
  const originalShowFinaleMessage=showFinaleMessage;
  showFinaleMessage=()=>{
    originalShowFinaleMessage();
    if(finalVerificationButton.dataset.stage==='complete')finalVerificationButton.onclick=()=>{
      finalVerificationButton.hidden=true;
      finalVerificationButton.dataset.ready='false';
      finalSequenceActive=false;finalPopupPending=false;
      viewer.close();
      patchState({completed:true,finalFlowStage:'closed',finalFileSeen:false});
      setTimeout(()=>{render();openGuaranteedFinalAlert()},180);
    };
  };
  openDashboard=()=>{
    const done=read(),state=getState(),consulted=sequence.filter(id=>done.includes(id)),total=sequence.length;
    const completed=finalFlowClosed();
    const pendingClosure=finalFlowPending();
    const reviewed=completed?total:consulted.length;
    const percentage=completed?100:Math.round(reviewed/total*100);
    const lastDocument=completed?'KTB-014':consulted.at(-1)||'Ninguno';
    const nextDocument=completed?null:pendingClosure?'CIERRE KTB-014':sequence.find(id=>!done.includes(id))||'KTB-001';
    const accessLevel=completed?'VIII':roman(Math.max(1,Math.ceil(percentage/12.5)));
    const status=completed?'Expediente cerrado':pendingClosure?'Cierre en curso':reviewed?'En curso':'Pendiente de inicio';
    const username=currentUser?.email?.split('@')[0]||'jose.cuadrado';
    const safe=value=>String(value).replace(/[&<>'"]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
    const caseMessage=completed
      ?'<p>Historial completo localizado.</p><p>Verificando cierre del expediente…</p><p>Secuencia de lectura completada.</p><p>Integridad documental confirmada.</p>'
      :pendingClosure
        ?'<p>Lectura de KTB-014 confirmada.</p><p>Protocolo de cierre localizado.</p><p>Restaurando el último paso pendiente…</p><p>El expediente todavía no está archivado.</p>'
      :reviewed
        ?'<p>Historial de consulta localizado.</p><p>Restaurando sesión…</p><p>Permisos activos verificados.</p><p>Secuencia de lectura sincronizada.</p>'
        :'<p>No se han encontrado consultas anteriores.</p><p>Inicializando expediente…</p><p>Nivel de acceso I concedido.</p><p>Documento inicial disponible: <strong>KTB-001</strong></p>';
    const closingMessage=completed
      ?'<strong>Expediente archivado.</strong><br>Consulta histórica autorizada.'
      :pendingClosure
        ?'<strong>Cierre pendiente.</strong><br>Continúa el protocolo obligatorio de KTB-014.'
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
      continueButton.innerHTML=`${completed?'Consultar expediente archivado':pendingClosure?'Continuar cierre':reviewed?'Continuar expediente':'Iniciar consulta'} <b>→</b>`;
      continueButton.hidden=false;skip.hidden=true;
    };
    const advance=()=>{
      loading.hidden=true;
      if(getState().legalAccepted){gate.hidden=true;dash.hidden=false;render();maybeStartExpedientTour()}
      else{dash.hidden=true;gate.hidden=false}
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
  mark.onclick=()=>{
    // El avance visual nunca debe depender de una escritura auxiliar en Supabase.
    // Conservamos el identificador porque una actualización remota puede volver a
    // renderizar la interfaz mientras se registra la actividad.
    const id=active,done=read(),alreadyRead=done.includes(id);
    if(!alreadyRead){done.push(id);void Promise.resolve(save(done)).catch(error=>console.warn('No se pudo sincronizar la lectura.',error))}
    if(alreadyRead){viewer.close();render();return}
    if(id.startsWith('AR'))void recordActivity('document_confirmed',id,{source:'recovered_file'}).catch(error=>console.warn('No se pudo registrar la actividad.',error));
    if(id.startsWith('AR03-')){if(ar03Complete())openAr03();else if(id==='AR03-CARTA')openAr03Mosaic('temples');else openAr03Mosaic(id.startsWith('AR03-C-')?'cities':'temples');return}
    if(readerReturnToFolder){readerBackFolder.click();return}
    const parent=fileFolder(id);
    if(parent){openFolder(parent);return}
    if(id.startsWith('KTB-')){
      syncKtb(id,()=>{if(id==='KTB-014')startFinale();else{viewer.close();render()}});
      void recordActivity('document_confirmed',id,{source:'recipient_consultation'}).catch(error=>console.warn('No se pudo registrar la actividad.',error));
      return;
    }
    viewer.close();render();
  };
},0);
const progressKeys=[...Array.from({length:14},(_,i)=>`KTB-${String(i+1).padStart(3,'0')}`),...Object.values(folders).flatMap(folder=>folder.files.map(file=>file.id)),'AR03-CARTA',...ar03Cities.map((_,i)=>`AR03-C-${i}`),...ar03Temples.map((_,i)=>`AR03-T-${i}`),...ar01Tickets.map(ticket=>ticket.id),'AR06-PROTOCOL'];
const name=id=>isFolder(id)?`Carpeta ${id} · ${folderDetails[id][0]}`:`Expediente ${id}`;const gate=document.querySelector('#gate'),access=document.querySelector('#access'),adminAccess=document.querySelector('#admin-access'),loading=document.querySelector('#auth-loading'),dash=document.querySelector('#dashboard'),message=document.querySelector('#access-message'),adminMessage=document.querySelector('#admin-access-message'),viewer=document.querySelector('#viewer'),mark=document.querySelector('#mark-read'),next=document.querySelector('#next-doc'),readerBackFolder=document.querySelector('#reader-back-folder'),readerBackExpedient=document.querySelector('#reader-back-expedient');let active='',readerReturnToFolder=null,readerCanConfirm=false,readerChromeActive='';
const comicPrevious=document.createElement('button'),comicFollowing=document.createElement('button');comicPrevious.id='comic-prev-fixed';comicPrevious.type='button';comicPrevious.textContent='← Página anterior';comicPrevious.hidden=true;comicFollowing.id='comic-next-fixed';comicFollowing.type='button';comicFollowing.textContent='Página siguiente →';comicFollowing.hidden=true;readerBackFolder.before(comicPrevious,comicFollowing);
const archiveBatchConfirm=document.createElement('button');archiveBatchConfirm.id='archive-confirm-batch';archiveBatchConfirm.type='button';archiveBatchConfirm.hidden=true;readerBackFolder.before(archiveBatchConfirm);
const finalVerificationButton=document.createElement('button');finalVerificationButton.id='final-verification-action';finalVerificationButton.type='button';finalVerificationButton.textContent='Iniciar verificación final →';finalVerificationButton.hidden=true;finalVerificationButton.dataset.ready='false';finalVerificationButton.dataset.locked='false';finalVerificationButton.dataset.stage='';readerBackExpedient.before(finalVerificationButton);
const setFinalFlowAction=(stage,label,handler,ready=true)=>{
  finalVerificationButton.dataset.stage=stage;
  finalVerificationButton.dataset.ready=ready?'true':'false';
  finalVerificationButton.dataset.locked='true';
  finalVerificationButton.textContent=label;
  finalVerificationButton.onclick=handler;
  finalVerificationButton.disabled=!ready;
  finalVerificationButton.hidden=!ready;
  readerBackExpedient.hidden=true;
};
const clearFinalFlow=()=>{
  finalVerificationButton.dataset.stage='';
  finalVerificationButton.dataset.ready='false';
  finalVerificationButton.dataset.locked='false';
  finalVerificationButton.onclick=null;
  finalVerificationButton.disabled=false;
  finalVerificationButton.hidden=true;
  readerBackExpedient.hidden=false;
};
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
const readerCloseButton=document.querySelector('#viewer .reader-toolbar .close');
let readerPreviousBodyOverflow='';
const setReaderFullscreenState=activeState=>{
  viewer.classList.toggle('is-reader-fullscreen',activeState);
  readerTools.querySelector('[data-reader-action="full"]').setAttribute('aria-label',activeState?'Salir de pantalla completa':'Pantalla completa');
  readerCloseButton.setAttribute('aria-label',activeState?'Salir del modo de lectura inmersiva':'Cerrar lector');
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
  const comicImage=document.querySelector('#doc-body>.image-inspector img[src*="/AC-01/Pagina-"]');
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
  const activeBatchMarker=active==='AR01-BILLETES'?'AR01-BILLETES':active==='AR03-cities'?'AR03-CITIES-COMPLETE':active==='AR03-temples'?'AR03-TEMPLES-COMPLETE':'';
  archiveBatchConfirm.hidden=!activeBatchMarker||read().includes(activeBatchMarker);
  finalVerificationButton.hidden=finalVerificationButton.dataset.ready!=='true';
  readerBackExpedient.hidden=finalVerificationButton.dataset.locked==='true';
  const alreadyRead=Boolean(active&&read().includes(active));
  if(readerCanConfirm&&!alreadyRead)mark.textContent='Confirmar lectura';
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
viewer.addEventListener('close',()=>{clearRecoveryTimers();viewer.classList.remove('is-recovery-mode');document.querySelector('.reader-content').classList.remove('is-recovery');readerReturnToFolder=null;readerCanConfirm=false;readerChromeActive='';comicPrevious.hidden=true;comicFollowing.hidden=true;const paper=document.querySelector('.paper'),body=document.querySelector('#doc-body');paper.style.width='';paper.style.maxWidth='';paper.style.padding='';body.style.maxWidth='';body.style.margin='';delete body.dataset.comicPage;delete body.dataset.comicPages;if(viewer.classList.contains('is-fallback-fullscreen')){viewer.classList.remove('is-fallback-fullscreen');document.body.style.overflow=readerPreviousBodyOverflow}if(document.fullscreenElement===viewer)document.exitFullscreen();setReaderFullscreenState(false)});
const documentImageObserver=new MutationObserver(()=>enhanceDocumentImages());documentImageObserver.observe(document.querySelector('#doc-body'),{childList:true});document.addEventListener('keydown',event=>{if(!viewer.open)return;if(event.key==='ArrowLeft'&&!comicPrevious.hidden&&!comicPrevious.disabled){event.preventDefault();comicPrevious.click()}if(event.key==='ArrowRight'&&!comicFollowing.hidden&&!comicFollowing.disabled){event.preventDefault();comicFollowing.click()}});
const allowed=id=>{const index=sequence.indexOf(id);return index===0||read().includes(sequence[index-1])};const roman=value=>{const table=[[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let result='';for(const [number,symbol] of table){while(value>=number){result+=symbol;value-=number}}return result};
const mailboxButton=document.createElement('button'),mailbox=document.createElement('aside'),publicReturnButton=document.createElement('button');mailboxButton.id='mailbox-toggle';mailboxButton.type='button';mailboxButton.textContent='Buzón';mailboxButton.style.cssText='border:1px solid #7e1b19;background:#f6f0e2;color:#7e1b19;padding:10px;font:9px var(--mono);cursor:pointer';mailbox.id='mailbox';mailbox.style.cssText='display:none;position:fixed;right:5vw;top:82px;z-index:30;width:min(450px,calc(100vw - 32px));max-height:72vh;overflow:auto;background:#f6f0e2;color:#202726;border:1px solid #8b887d;box-shadow:12px 14px 30px #0004;padding:22px';publicReturnButton.id='return-public-site';publicReturnButton.type='button';publicReturnButton.textContent='Volver a la web pública';publicReturnButton.onclick=()=>{location.href='../index.html'};const headerActions=document.querySelector('.header-actions');headerActions?.prepend(mailboxButton);headerActions?.insertBefore(publicReturnButton,document.querySelector('#exit'));dash.appendChild(mailbox);
const mailboxMessages=()=>{const done=read(),items=[];for(let i=1;i<=14;i++){const id=`KTB-${String(i).padStart(3,'0')}`;if(!done.includes(id))continue;items.push({id:id,subject:`Lectura confirmada · ${id}`,body:`La consulta del documento ${id} ha sido registrada correctamente. La secuencia autorizada ha sido actualizada.`,order:i})}if(done.includes('KTB-003'))items.push({id:'AC-01',subject:'Archivo complementario localizado',body:'Durante la reconstrucción del expediente se ha localizado el Archivo Complementario AC-01. Su contenido permanece en proceso de clasificación.',order:3.2});if(done.includes('KTB-006'))items.push({id:'AR-01',subject:'Acceso a Archivo Recuperado 01',body:'La documentación operativa ha quedado disponible para su consulta conforme al protocolo de custodia.',order:6.2});if(done.includes('KTB-011'))items.push({id:'AR-06',subject:'Acceso a datos recuperados',body:'Se ha autorizado la consulta de los datos recuperados del dispositivo asociado al expediente.',order:11.2});if(finalFlowClosed())items.push({id:'KTB-014-FINAL',subject:'Expediente archivado',body:'La consulta ha finalizado. El expediente PROJECT JAPAN ha sido archivado con integridad documental preservada.',order:14.2});if(done.includes('AR01-BILLETES'))items.push({id:'AR01-BILLETES',subject:'Registros de transporte verificados',body:'Todos los billetes recuperados de AR-01 han sido confirmados y archivados.',order:6.5});if(ar03Complete())items.push({id:'AR03',subject:'Registros geográficos completados',body:'Las guías de ciudades y las entradas de templos han sido incorporadas al expediente.',order:8.5});if(finalFlowClosed())items.push({id:'FINAL-01',subject:'ATENCIÓN · Archivo localizado',body:'Se ha localizado un archivo durante la verificación final del expediente. Clasificación: No catalogado. Estado: Pendiente de revisión.',order:100,urgent:true});return items.sort((a,b)=>b.order-a.order)};
const renderMailbox=()=>{const items=mailboxMessages(),seen=Number(localStorage.getItem('kizuna-mail-read')||0),unread=Math.max(0,items.length-seen);mailboxButton.textContent=`Buzón${unread?` · ${unread}`:''}`;mailbox.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #b4ae9f;padding-bottom:14px"><div><p style="margin:0;color:#7e1b19;font:10px var(--mono);letter-spacing:.1em">SISTEMA DE NOTIFICACIONES</p><h3 style="margin:6px 0 0;font:31px var(--serif)">Buzón del expediente</h3></div><button id="mailbox-close" style="border:0;background:none;font:25px var(--serif);color:#7e1b19;cursor:pointer">×</button></div><p style="font:10px/1.6 var(--mono)">${items.length} comunicaciones registradas · más recientes primero</p>${items.map((item,index)=>`<details style="border-top:1px solid ${item.urgent?'#7e1b19':'#c5bdaa'};padding:13px 0;${item.urgent?'background:#f4dfd5;margin:0 -10px;padding:15px 10px;border-left:4px solid #7e1b19':''}"><summary style="cursor:pointer;list-style:none;font:600 13px var(--serif)"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${item.urgent||index<unread?'#7e1b19':'#9a998f'};margin-right:8px"></span>${item.subject}<small style="display:block;margin:5px 0 0 16px;font:9px var(--mono);color:#7e1b19">DIVISIÓN DE ARCHIVOS TEMPORALES · ${item.id}</small></summary><p style="margin:12px 0 0 16px;font:12px/1.65 var(--mono)">${item.body}</p>${item.id==='FINAL-01'?'<button id="final-file-from-mail" style="margin:10px 0 0 16px;background:#7e1b19;color:#fff;border:0;padding:10px 13px;font:9px var(--mono);cursor:pointer">Consultar archivo</button>':''}</details>`).join('')||'<p>No hay comunicaciones registradas.</p>'}`;document.querySelector('#mailbox-close').onclick=()=>mailbox.style.display='none';const finalButton=document.querySelector('#final-file-from-mail');if(finalButton)finalButton.onclick=async()=>{mailbox.style.display='none';await markFinalFileConsulted('mailbox');openFinalLocatedFile()}};
mailboxButton.onclick=()=>{const opening=mailbox.style.display==='none';if(opening){renderMailbox();mailbox.style.display='block';localStorage.setItem('kizuna-mail-read',mailboxMessages().length);renderMailbox();updateMailboxIndicator()}else mailbox.style.display='none'};
const updateMailboxIndicator=()=>{const unread=Math.max(0,mailboxMessages().length-Number(localStorage.getItem('kizuna-mail-read')||0));mailboxButton.textContent=`Buzón${unread?` · ${unread} nuevo${unread===1?'':'s'}`:''}`;mailboxButton.style.background=unread?'#7e1b19':'#f6f0e2';mailboxButton.style.color=unread?'#fff':'#7e1b19';mailboxButton.style.boxShadow=unread?'0 0 0 4px #7e1b1930':'none'};

const expedientTourSteps=[
  {selector:'#mailbox-toggle',eyebrow:'COMUNICACIONES',title:'Tu buzón privado',text:'Aquí aparecerán los avisos y registros que la División de Archivos Temporales envíe durante la consulta.'},
  {selector:'#return-public-site',eyebrow:'NAVEGACIÓN',title:'Vuelve cuando quieras',text:'Puedes regresar a la web pública sin cerrar la sesión. Al volver, entrarás directamente en tu expediente.'},
  {selector:'#exit',eyebrow:'SEGURIDAD',title:'Cierra tu acceso',text:'Este botón finaliza por completo la sesión privada en este dispositivo.'},
  {selector:'.case-head',eyebrow:'ESTADO DEL EXPEDIENTE',title:'Tu progreso, de un vistazo',text:'Aquí puedes consultar el estado, el nivel de autorización y la integridad documental alcanzada.'},
  {selector:'.documents .document:not(.locked)',eyebrow:'SECUENCIA AUTORIZADA',title:'Consulta en orden',text:'Cada tarjeta representa un documento o una carpeta. Los siguientes registros se desbloquearán conforme confirmes las lecturas.'},
  {selector:'.documents .document:not(.locked) button',eyebrow:'LECTURA DOCUMENTAL',title:'Abre el primer registro',text:'Dentro del lector podrás desplazarte, ampliar la imagen y confirmar la lectura cuando hayas terminado.'}
];
let expedientTourActive=false,expedientTourTimer=null,expedientTourController=null;
const closeExpedientTour=async result=>{
  const root=document.querySelector('#expedient-tour');if(!root)return;
  expedientTourActive=false;clearTimeout(expedientTourTimer);expedientTourController?.abort();expedientTourController=null;root.remove();document.body.classList.remove('expedient-tour-open');
  const completedAt=new Date().toISOString();
  await patchState({onboardingCompleted:true,onboardingCompletedAt:completedAt,onboardingVersion:1,onboardingResult:result});
  await recordActivity(result==='completed'?'onboarding_completed':'onboarding_skipped',null,{version:1});
};
const startExpedientTour=()=>{
  if(expedientTourActive||getState().onboardingCompleted||dash.hidden)return;
  const available=expedientTourSteps.filter(step=>document.querySelector(step.selector));if(!available.length)return;
  expedientTourActive=true;expedientTourController=new AbortController();document.body.classList.add('expedient-tour-open');
  const root=document.createElement('section');root.id='expedient-tour';root.className='expedient-tour';root.setAttribute('aria-label','Guía del expediente');
  root.innerHTML='<div class="expedient-tour-blocker"></div><div class="expedient-tour-focus" aria-hidden="true"></div><article class="expedient-tour-card" role="dialog" aria-modal="true"><header><span id="expedient-tour-count"></span><button type="button" data-tour-skip>Omitir guía</button></header><p id="expedient-tour-eyebrow"></p><h2 id="expedient-tour-title"></h2><div id="expedient-tour-text"></div><div class="expedient-tour-progress" aria-hidden="true"></div><footer><button type="button" data-tour-back>Anterior</button><button type="button" data-tour-next>Siguiente <span>→</span></button></footer></article>';
  document.body.appendChild(root);
  const focus=root.querySelector('.expedient-tour-focus'),card=root.querySelector('.expedient-tour-card'),count=root.querySelector('#expedient-tour-count'),eyebrow=root.querySelector('#expedient-tour-eyebrow'),title=root.querySelector('#expedient-tour-title'),text=root.querySelector('#expedient-tour-text'),progress=root.querySelector('.expedient-tour-progress'),back=root.querySelector('[data-tour-back]'),next=root.querySelector('[data-tour-next]');
  let index=0;
  const position=()=>{
    const target=document.querySelector(available[index].selector);if(!target)return;
    const rect=target.getBoundingClientRect(),padding=8;
    focus.style.cssText=`left:${Math.max(6,rect.left-padding)}px;top:${Math.max(6,rect.top-padding)}px;width:${Math.min(innerWidth-12,rect.width+padding*2)}px;height:${Math.min(innerHeight-12,rect.height+padding*2)}px`;
    if(matchMedia('(max-width:700px)').matches){card.style.left='12px';card.style.right='12px';card.style.top='auto';card.style.bottom='12px';return}
    const gap=22,width=Math.min(390,innerWidth-32),height=card.offsetHeight||330;let left,top;
    if(rect.right+gap+width<=innerWidth)left=rect.right+gap;
    else if(rect.left-gap-width>=0)left=rect.left-gap-width;
    else left=Math.max(16,Math.min(innerWidth-width-16,rect.left));
    if(rect.bottom+gap+height<=innerHeight&&rect.width>width*.8)top=rect.bottom+gap;
    else top=Math.max(16,Math.min(innerHeight-height-16,rect.top));
    card.style.left=`${left}px`;card.style.right='auto';card.style.top=`${top}px`;card.style.bottom='auto';
  };
  const showStep=()=>{
    const step=available[index],target=document.querySelector(step.selector);if(!target)return;
    const rect=target.getBoundingClientRect();if(rect.top<82||rect.bottom>innerHeight-70)target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center',inline:'nearest'});
    count.textContent=`PASO ${String(index+1).padStart(2,'0')} DE ${String(available.length).padStart(2,'0')}`;eyebrow.textContent=step.eyebrow;title.textContent=step.title;text.textContent=step.text;
    progress.innerHTML=available.map((_,stepIndex)=>`<i class="${stepIndex===index?'active':stepIndex<index?'done':''}"></i>`).join('');back.hidden=index===0;next.innerHTML=index===available.length-1?'Comenzar expediente <span>→</span>':'Siguiente <span>→</span>';
    card.classList.remove('is-visible');clearTimeout(expedientTourTimer);expedientTourTimer=setTimeout(()=>{position();card.classList.add('is-visible');next.focus({preventScroll:true})},matchMedia('(prefers-reduced-motion:reduce)').matches?0:240);
  };
  back.onclick=()=>{if(index>0){index--;showStep()}};
  next.onclick=()=>{if(index===available.length-1){void closeExpedientTour('completed');return}index++;showStep()};
  root.querySelector('[data-tour-skip]').onclick=()=>void closeExpedientTour('skipped');
  root.addEventListener('keydown',event=>{if(event.key==='Escape')void closeExpedientTour('skipped');if(event.key==='ArrowRight')next.click();if(event.key==='ArrowLeft'&&!back.hidden)back.click()});
  addEventListener('resize',position,{signal:expedientTourController.signal});
  addEventListener('scroll',position,{passive:true,signal:expedientTourController.signal});
  showStep();
};
const maybeStartExpedientTour=()=>{clearTimeout(expedientTourTimer);if(!getState().onboardingCompleted)expedientTourTimer=setTimeout(startExpedientTour,500)};
const privateStyle=document.createElement('style');privateStyle.textContent=`.dashboard>header{position:sticky;top:0;z-index:40;padding:8px 5vw;background:#f6f0e2!important;isolation:isolate;box-shadow:0 1px 0 #b4ae9f}.dashboard>header .access-brand img{width:44px;height:44px}.case-head{position:sticky;top:61px;z-index:30;padding:20px 10vw!important;min-height:140px;align-items:center;background:#e6dac2!important;isolation:isolate;box-shadow:0 8px 16px #8f80661c}.case-head h1{font-size:48px}.case-head .system-line{margin:0 0 8px}.case-head .case-id{margin:7px 0 0;font-size:8px}.case-head dl{gap:28px}.case-list{position:relative;z-index:1;padding-top:34px}.header-actions{display:flex;align-items:center;gap:15px}.header-actions .sync-clock{margin:0}#return-public-site{border-color:#202726;color:#202726}@media(max-width:750px){.case-head{top:61px;padding:17px 7vw!important;min-height:0}.case-head h1{font-size:40px}.case-head dl{margin-top:17px}.header-actions{gap:5px}.header-actions button{padding:8px 6px;font-size:7px}.sync-clock{display:none!important}}`;document.head.appendChild(privateStyle);setInterval(()=>{if(!dash.hidden)updateMailboxIndicator()},600);updateMailboxIndicator();
const mobileCaseHeaderStyle=document.createElement('style');mobileCaseHeaderStyle.textContent=`@media(max-width:600px){.dashboard{overflow-x:hidden}.dashboard>header{min-height:50px;padding:5px 10px!important;gap:8px}.dashboard>header .access-brand{min-width:0;gap:7px}.dashboard>header .access-brand img{width:34px;height:34px}.dashboard>header .access-brand span{overflow:hidden;font-size:11px;letter-spacing:.12em;text-overflow:ellipsis;white-space:nowrap}.dashboard>header .access-brand small{display:none}.dashboard>header .header-actions{flex:0 0 auto;margin-left:auto;gap:4px!important}.dashboard>header .header-actions button{display:grid;place-items:center;height:38px;min-width:42px;padding:4px 6px!important;line-height:1.15}.dashboard>header #mailbox-toggle{max-width:62px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dashboard>header #return-public-site,.dashboard>header #exit{width:44px;font-size:0!important}.dashboard>header #return-public-site::after{content:'WEB';font:7px var(--mono);letter-spacing:.04em}.dashboard>header #exit::after{content:'SALIR';font:7px var(--mono);letter-spacing:.04em}.case-head{top:49px!important}}@media(max-width:360px){.dashboard>header .access-brand span{font-size:9px}.dashboard>header #mailbox-toggle{max-width:54px}.dashboard>header #return-public-site,.dashboard>header #exit{width:40px;min-width:40px}}`;document.head.appendChild(mobileCaseHeaderStyle);
function createFinalDiscoveryAlert(onOpen){document.querySelector('#final-file-alert')?.remove();const alert=document.createElement('section');alert.id='final-file-alert';alert.className='final-discovery-alert';alert.setAttribute('role','dialog');alert.setAttribute('aria-modal','true');alert.setAttribute('aria-labelledby','final-discovery-title');alert.innerHTML=`<div class="final-discovery-card"><div class="final-discovery-scan" aria-hidden="true"></div><section class="final-discovery-closing" aria-live="polite"><p>VERIFICACIÓN FINAL · ARCHIVO CENTRAL</p><h2>Cerrando<br><em>expediente.</em></h2><div class="final-discovery-progress"><i></i><strong>100 %</strong></div><ol><li>Integridad documental confirmada</li><li>Secuencia temporal archivada</li><li>Comprobando registros residuales…</li></ol></section><section class="final-discovery-result" aria-live="assertive"><header><div><p>INCIDENCIA DURANTE EL CIERRE</p><h2 id="final-discovery-title">Archivo fuera<br><em>de inventario.</em></h2></div><span>FINAL-01</span></header><p>Se ha detectado un registro que no forma parte de la secuencia autorizada del expediente.</p><dl><div><dt>CLASIFICACIÓN</dt><dd>No catalogado</dd></div><div><dt>ORIGEN</dt><dd>No verificado</dd></div><div><dt>RELACIÓN</dt><dd>Desconocida</dd></div><div><dt>ESTADO</dt><dd>Pendiente de revisión</dd></div></dl><div class="final-discovery-seal">NO INCLUIR<br>EN EL EXPEDIENTE</div><footer><p>¿Desea examinar el archivo localizado?</p><button id="final-file-alert-open" type="button">Examinar FINAL-01 <span>→</span></button></footer></section></div>`;document.body.appendChild(alert);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;setTimeout(()=>alert.classList.add('is-scanning'),reduced?20:700);setTimeout(()=>{alert.classList.add('is-detected');document.querySelector('#final-file-alert-open')?.focus()},reduced?60:2350);document.querySelector('#final-file-alert-open').onclick=async()=>{alert.remove();await onOpen()}}
function openFinalLocatedFile(){clearFinalFlow();active='FINAL-01';next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES / VERIFICACIÓN FINAL';document.querySelector('#doc-title').textContent='Archivo localizado';document.querySelector('#doc-body').innerHTML='<img src="../assets/documents/FINAL-01-email-interno.png" alt="Correo interno recuperado de José" style="display:block;width:100%;height:auto;border:1px solid #8b887d">';if(!viewer.open)viewer.showModal()}
function showFinalFileAlert(){if(!finalFlowClosed()||getState().finalFileSeen||viewer.open||document.querySelector('#final-file-alert'))return;createFinalDiscoveryAlert(async()=>{await markFinalFileConsulted('final_alert');openFinalLocatedFile()})}
function openDashboard(){access.hidden=true;loading.hidden=false;const log=document.querySelector('#auth-log');log.innerHTML='<p>Comprobando expediente…</p><div style="height:8px;background:#d3c8b4"><i id="auth-progress" style="display:block;width:0;height:100%;background:#7e1b19;transition:width 1.7s ease"></i></div><p>Sincronizando registros…</p><p>Integridad documental: <strong>100 %</strong></p>';setTimeout(()=>document.querySelector('#auth-progress').style.width='100%',80);setTimeout(()=>{loading.hidden=true;gate.hidden=false},2100)}
function updateCompletionHeader(done){const head=document.querySelector('.case-head'),old=document.querySelector('#completion-record');if(old)old.remove();head.style.position='';if(!finalFlowClosed()){head.style.setProperty('padding-bottom','20px','important');head.style.minHeight='140px';return}head.style.setProperty('padding-bottom','100px','important');head.style.minHeight='245px';const record=document.createElement('section');record.id='completion-record';record.style.cssText='position:absolute;left:10vw;right:10vw;bottom:18px;border-top:1px solid #9b8870;padding-top:12px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 20px;color:#7e1b19;font:9px/1.65 "DM Mono",monospace;letter-spacing:.03em';record.innerHTML=`<span>PROJECT JAPAN<br><strong style="font-size:11px">✔ FINALIZADO · EXPEDIENTE ARCHIVADO</strong></span><span>DESTINATARIO<br><strong style="font-size:11px">JOSÉ CUADRADO</strong></span><span>FECHA DE ARCHIVO<br><strong style="font-size:11px">${new Date().toLocaleDateString('es-ES')}</strong></span><span>INTEGRIDAD<br><strong style="font-size:11px">100 %</strong></span>`;head.appendChild(record)}
let pendingFinalAlertTimer=0;
function render(){
  const done=read(),visible=sequence.filter(id=>!nestedKtb.has(id));
  const completed=progressKeys.filter(id=>done.includes(id)).length;
  const integrity=Math.round(completed/progressKeys.length*100);
  const ktbRead=done.filter(id=>id.startsWith('KTB-')).length;
  const level=Math.max(1,ktbRead-5);
  const comicPages=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`).filter(id=>done.includes(id)).length;
  const pending=finalFlowPending(),stage=getFinalFlowStage();
  const stageLabels={verification:'PASO 1 DE 3 · VERIFICACIÓN FINAL',summary:'PASO 2 DE 3 · ACTA DE CIERRE',complete:'PASO 3 DE 3 · ARCHIVADO'};
  const resumeBanner=pending?`<section class="final-flow-resume"><div><p>CIERRE OBLIGATORIO EN CURSO</p><h3>El expediente todavía no está archivado.</h3><span>${stageLabels[stage]||stageLabels.verification}. Continúa desde el punto guardado.</span></div><button type="button" data-final-resume>Continuar cierre →</button></section>`:'';
  const supplementary=done.includes('KTB-003')?`<article class="document complementary"><span class="doc-no">○ AC-01</span><h3>ARCHIVO COMPLEMENTARIO<br>AC-01</h3><p><strong>Estado:</strong> Recuperado<br><strong>Tipo:</strong> Registro ilustrado<br><strong>Origen:</strong> No catalogado<br><strong>Relación:</strong> Pendiente de clasificación<br><strong>Páginas recuperadas:</strong> ${comicPages} / 11</p><button data-id="AC-01">CONSULTAR</button></article>`:'';
  document.querySelector('#integrity').textContent=`${integrity} %`;
  document.querySelector('#integrity-fill').style.width=`${integrity}%`;
  document.querySelector('#authorization').textContent=`Nivel ${roman(level)}`;
  document.querySelector('#case-status').textContent=finalFlowClosed()?'Expediente completado':pending?'Cierre en curso':'En proceso';
  updateCompletionHeader(done);
  document.querySelector('#documents').innerHTML=resumeBanner+visible.map(id=>{
    const ok=allowed(id),seen=done.includes(id),isClosing=id==='KTB-014'&&pending;
    const label=isClosing?'Continuar cierre':isFolder(id)?'Abrir carpeta':'Abrir documento';
    const status=isClosing?(stageLabels[stage]||stageLabels.verification):seen?'LECTURA CONFIRMADA':ok?'DISPONIBLE PARA CONSULTA':'AUTORIZACIÓN PENDIENTE';
    return `<article class="document ${ok?'':'locked'} ${isClosing?'final-flow-card':''}"><span class="doc-no">${isClosing?'◐ ':seen?'✓ ':ok?'○ ':'⌕ '}${id}</span><h3>${name(id)}</h3><p>${status}</p><button data-id="${id}" ${ok?'':'disabled'} ${isClosing?'data-final-resume':''}>${ok?label:'Acceso restringido'}</button></article>`
  }).join('')+supplementary;
  document.querySelectorAll('.document button:not([disabled]):not([data-final-resume])').forEach(button=>button.onclick=()=>openDoc(button.dataset.id));
  document.querySelectorAll('[data-final-resume]').forEach(button=>button.onclick=resumeFinalFlow);
  clearTimeout(pendingFinalAlertTimer);
  if(finalFlowClosed()&&!getState().finalFileSeen){
    pendingFinalAlertTimer=setTimeout(showFinalFileAlert,350);
  }
}
function textFor(id){if(id==='AC-01')return ['Archivo complementario AC-01','Estado: Recuperado. Tipo: Registro ilustrado. Origen: No catalogado.','La relación de este registro con la expedición permanece pendiente de clasificación.'];if(id==='KTB-014')return ['Cierre de expediente','La secuencia ha sido completada. Los recuerdos han sido preservados y la línea temporal mantiene una integridad del 100 %.','No se requieren más intervenciones.'];if(isFolder(id))return [`${id} · ${folderDetails[id][0]}`,folderDetails[id][1],'Archivo recuperado parcialmente. El contenido debe consultarse respetando el orden de la secuencia temporal.'];return [`Expediente ${id}`,'Registro validado por la División de Archivos Temporales. Este documento forma parte de una secuencia personal de continuidad.','La lectura atenta de cada página ayuda a que las historias importantes sucedan exactamente como deben.']}
const nextRequiredDocument=(id,buttonId)=>{const confirmed=read().includes(id);return `<aside class="folder-next-phase ${confirmed?'is-complete':''}"><div class="folder-next-symbol" aria-hidden="true">${confirmed?'✓':'↗'}</div><div class="folder-next-copy"><p>${confirmed?'DOCUMENTO DE CONTINUIDAD':'FASE SIGUIENTE DESBLOQUEADA'}</p><h4><span>${id}</span> Actualización del expediente</h4><small>${confirmed?'La lectura de este documento ya está confirmada. Puedes volver a consultarlo.':'Para continuar es obligatorio consultar y confirmar la lectura de este nuevo documento.'}</small></div><div class="folder-next-state"><span>${confirmed?'ARCHIVADO':'NUEVO'}</span><strong>${confirmed?'LECTURA CONFIRMADA':'LECTURA PENDIENTE'}</strong></div><button id="${buttonId}" type="button">${confirmed?'Revisar':'Consultar'} ${id} <span>→</span></button></aside>`};
function openFolder(folderId){active=folderId;readerReturnToFolder=null;readerCanConfirm=false;next.style.display='none';document.querySelector('#doc-type').textContent='CARPETA DE ARCHIVOS RECUPERADOS / ACCESO AUTORIZADO';document.querySelector('#doc-title').textContent=`${folderId} · ${folders[folderId].title}`;const done=read(),files=folders[folderId].files,seenCount=files.filter(file=>done.includes(file.id)).length;const list=files.map((file,index)=>{const unlocked=index===0||done.includes(files[index-1].id),seen=done.includes(file.id);return `<button class="folder-file ${seen?'is-read':unlocked?'is-ready':'is-locked'}" data-file="${file.id}" ${unlocked?'':'disabled'}><span class="folder-file-number">${String(index+1).padStart(2,'0')}</span><span class="folder-file-copy"><strong>${file.title}</strong><small>${seen?'LECTURA CONFIRMADA':unlocked?'DISPONIBLE':'BLOQUEADO HASTA COMPLETAR EL ANTERIOR'}</small></span><span class="folder-file-action">${seen?'REVISAR':unlocked?'ABRIR':'⌕'}</span></button>`}).join('');const complete=files.every(file=>done.includes(file.id)),update=folders[folderId].update;document.querySelector('#doc-body').innerHTML=`<section class="folder-index"><header><div><p class="system-line">ÍNDICE DE LA CARPETA</p><h3>${folders[folderId].title}</h3></div><p><strong>${seenCount}</strong> de ${files.length}<span>documentos leídos</span></p></header><p class="folder-intro">Los documentos internos deben consultarse siguiendo el orden autorizado.</p><div class="folder-file-list">${list}</div><footer>${complete?nextRequiredDocument(update,'folder-update'):'<p>La actualización permanecerá sellada hasta completar todos los documentos.</p>'}</footer></section>`;mark.style.display='none';if(!viewer.open)viewer.showModal();document.querySelectorAll('.folder-file:not([disabled])').forEach(button=>button.onclick=()=>openFolderFile(folderId,button.dataset.file));const updateButton=document.querySelector('#folder-update');if(updateButton)updateButton.onclick=()=>openDoc(update)}
function openFolderFile(folderId,fileId){const file=folders[folderId].files.find(item=>item.id===fileId);active=fileId;readerReturnToFolder=folderId;readerCanConfirm=true;next.style.display='none';mark.style.display='inline-block';document.querySelector('#doc-type').textContent=`${folderId} / DOCUMENTO INTERNO`;document.querySelector('#doc-title').textContent=file.title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="../assets/documents/${folderId}/${file.src}" alt="${file.title}">`}
function openFolderFile(folderId,fileId){const file=folders[folderId].files.find(item=>item.id===fileId);if(file.mosaic==='tickets'){openTicketMosaic();return}active=fileId;readerReturnToFolder=folderId;readerCanConfirm=true;next.style.display='none';mark.style.display='inline-block';document.querySelector('#doc-type').textContent=`${folderId} / DOCUMENTO INTERNO`;document.querySelector('#doc-title').textContent=file.title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="../assets/documents/${folderId}/${file.src}" alt="${file.title}">`}
function openTicketMosaic(){
  active='AR01-BILLETES';readerReturnToFolder='AR-01';readerCanConfirm=false;next.style.display='none';mark.style.display='none';
  const done=read(),seen=ar01Tickets.filter(ticket=>done.includes(ticket.id)).length,total=ar01Tickets.length,remaining=total-seen,complete=remaining===0,batchConfirmed=done.includes('AR01-BILLETES'),progress=Math.round(seen/total*100);
  document.querySelector('#doc-type').textContent=`AR-01 / BILLETES DE TRANSPORTE · ${seen}/${total} CONSULTADOS`;
  document.querySelector('#doc-title').textContent='Billetes recuperados';
  document.querySelector('#doc-body').innerHTML=`<section class="ticket-archive ${complete?'is-complete':''} ${batchConfirmed?'is-confirmed':''}"><header class="ticket-archive-header"><div><p class="system-line">LOTE DOCUMENTAL · TRANSPORTE</p><h3>Billetes de transporte</h3><p>Consulta cada registro antes de confirmar e incorporar el lote al expediente.</p></div><div class="ticket-progress-count"><strong>${seen}</strong><span>de ${total}<br>consultados</span></div></header><div class="ticket-progress" aria-label="${progress} % consultado"><i style="width:${progress}%"></i></div><div class="ticket-grid">${ar01Tickets.map((ticket,index)=>{const readTicket=done.includes(ticket.id);return `<button class="ticket-card ${readTicket?'is-read':'is-pending'}" data-ticket="${ticket.id}"><span class="ticket-card-number">${String(index+1).padStart(2,'0')}</span><span class="ticket-card-state">${readTicket?'✓ CONSULTADO':'PENDIENTE'}</span><img src="../assets/documents/AR-01/Billetes/${ticket.src}" alt="${ticket.title}"><span class="ticket-card-copy"><strong>${ticket.title}</strong><small>${readTicket?'LECTURA CONFIRMADA · REVISAR':'ABRIR REGISTRO'}</small></span></button>`}).join('')}</div><aside class="ticket-batch-summary ${complete?'is-ready':''} ${batchConfirmed?'is-confirmed':''}"><span class="ticket-batch-symbol">${batchConfirmed?'✓':complete?'07':String(remaining).padStart(2,'0')}</span><div><p>${batchConfirmed?'LOTE ARCHIVADO':complete?'CONFIRMACIÓN DISPONIBLE':'CONSULTA INCOMPLETA'}</p><h4>${batchConfirmed?'Billetes incorporados al expediente':complete?'Todos los billetes han sido consultados':`${remaining} ${remaining===1?'billete pendiente':'billetes pendientes'}`}</h4><small>${batchConfirmed?'La documentación de transporte permanece disponible para su revisión.':complete?'Utiliza el botón fijo inferior para confirmar el lote documental.':'Abre y confirma cada registro para desbloquear la acción final.'}</small></div></aside></section>`;
  archiveBatchConfirm.textContent=batchConfirmed?'Lote confirmado':complete?'Confirmar lectura del lote':`${remaining} ${remaining===1?'billete pendiente':'billetes pendientes'}`;
  archiveBatchConfirm.disabled=!complete||batchConfirmed;
  archiveBatchConfirm.hidden=batchConfirmed;
  archiveBatchConfirm.onclick=async()=>{if(!complete||read().includes('AR01-BILLETES'))return;archiveBatchConfirm.disabled=true;archiveBatchConfirm.textContent='Archivando lote…';const records=read();records.push('AR01-BILLETES');save(records);await recordActivity('document_confirmed','AR01-BILLETES',{source:'recovered_file_bulk',documents:total});openFolder('AR-01')};
  if(!viewer.open)viewer.showModal();
  document.querySelectorAll('.ticket-card').forEach(button=>button.onclick=()=>{const ticket=ar01Tickets.find(item=>item.id===button.dataset.ticket);openTicketItem(ticket)});
}
function openTicketItem(ticket){active=ticket.id;next.style.display='none';mark.style.display='inline-block';mark.textContent=read().includes(ticket.id)?'Volver al expediente':'Confirmar lectura';mark.dataset.returnTo='tickets';document.querySelector('#doc-type').textContent='AR-01 / BILLETE RECUPERADO';document.querySelector('#doc-title').textContent=ticket.title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="../assets/documents/AR-01/Billetes/${ticket.src}" alt="${ticket.title}">`;if(!viewer.open)viewer.showModal()}
function ar03Complete(){const records=read();if(records.includes('KTB-009'))return true;const keys=['AR03-CARTA','AR03-CITIES-COMPLETE','AR03-TEMPLES-COMPLETE',...ar03Cities.map((_,i)=>`AR03-C-${i}`),...ar03Temples.map((_,i)=>`AR03-T-${i}`)];return keys.every(key=>records.includes(key))}
function openAr03(){
  active='AR-03';readerReturnToFolder=null;readerCanConfirm=false;next.style.display='none';mark.style.display='none';
  document.querySelector('#doc-type').textContent='AR-03 / REGISTROS GEOGRÁFICOS';document.querySelector('#doc-title').textContent='Archivo Recuperado 03';
  const done=read(),citiesDone=ar03Cities.filter((_,i)=>done.includes(`AR03-C-${i}`)).length,templesDone=ar03Temples.filter((_,i)=>done.includes(`AR03-T-${i}`)).length,letterDone=done.includes('AR03-CARTA'),citiesBatch=done.includes('AR03-CITIES-COMPLETE')||done.includes('KTB-009'),templesBatch=done.includes('AR03-TEMPLES-COMPLETE')||done.includes('KTB-009'),ready=ar03Complete(),reviewed=citiesDone+templesDone,total=ar03Cities.length+ar03Temples.length;
  document.querySelector('#doc-body').innerHTML=`<section class="folder-index ar03-folder-index"><header><div><p class="system-line">ÍNDICE DE LA CARPETA</p><h3>Registros geográficos</h3></div><p><strong>${reviewed}</strong> de ${total}<span>registros consultados</span></p></header><p class="folder-intro">Selecciona una subcarpeta para consultar sus registros recuperados.</p><div class="folder-file-list"><button id="ar03-cities" class="folder-file ${citiesBatch?'is-read':'is-ready'}"><span class="folder-file-number">01</span><span class="folder-file-copy"><strong>Guías de ciudades</strong><small>${citiesBatch?'LOTE CONFIRMADO':`${citiesDone} DE ${ar03Cities.length} REGISTROS CONSULTADOS`}</small></span><span class="folder-file-action">${citiesBatch?'REVISAR':'ABRIR'}</span></button><button id="ar03-temples" class="folder-file ${templesBatch?'is-read':'is-ready'}"><span class="folder-file-number">02</span><span class="folder-file-copy"><strong>Entradas de templos</strong><small>${templesBatch?'LOTE CONFIRMADO':`${letterDone?'CARTA CONSULTADA · ':''}${templesDone} DE ${ar03Temples.length} REGISTROS CONSULTADOS`}</small></span><span class="folder-file-action">${templesBatch?'REVISAR':'ABRIR'}</span></button></div><footer>${ready?nextRequiredDocument('KTB-009','ar03-update'):'<p>KTB-009 permanecerá sellado hasta confirmar ambos lotes documentales.</p>'}</footer></section>`;
  if(!viewer.open)viewer.showModal();document.querySelector('#ar03-cities').onclick=()=>openAr03Mosaic('cities');document.querySelector('#ar03-temples').onclick=()=>{if(!read().includes('AR03-CARTA'))openAr03Item('AR03-CARTA','Carta de presentación','../assets/documents/AR-03/Templos/000-Carta.png');else openAr03Mosaic('temples')};const update=document.querySelector('#ar03-update');if(update)update.onclick=()=>openDoc('KTB-009');
}
function openAr03Mosaic(type){
  active=`AR03-${type}`;readerReturnToFolder='AR-03';readerCanConfirm=false;next.style.display='none';mark.style.display='none';
  const items=type==='cities'?ar03Cities:ar03Temples,key=type==='cities'?'C':'T',folder=type==='cities'?'Ciudades':'Templos',title=type==='cities'?'Guías de ciudades':'Entradas de templos',itemLabel=type==='cities'?'guía':'entrada',marker=type==='cities'?'AR03-CITIES-COMPLETE':'AR03-TEMPLES-COMPLETE',done=read(),count=items.filter((_,i)=>done.includes(`AR03-${key}-${i}`)).length,total=items.length,remaining=total-count,complete=remaining===0,batchConfirmed=done.includes(marker),progress=Math.round(count/total*100);
  document.querySelector('#doc-type').textContent=`AR-03 / ARCHIVO VISUAL · ${count}/${total} CONSULTADOS`;
  document.querySelector('#doc-title').textContent=title;
  document.querySelector('#doc-body').innerHTML=`<section class="ticket-archive visual-archive ${complete?'is-complete':''} ${batchConfirmed?'is-confirmed':''}"><header class="ticket-archive-header"><div><p class="system-line">LOTE DOCUMENTAL · REGISTROS GEOGRÁFICOS</p><h3>${title}</h3><p>Consulta cada ${itemLabel} antes de confirmar e incorporar el lote al expediente.</p></div><div class="ticket-progress-count"><strong>${count}</strong><span>de ${total}<br>consultados</span></div></header><div class="ticket-progress" aria-label="${progress} % consultado"><i style="width:${progress}%"></i></div><div class="ticket-grid">${items.map((file,index)=>{const seen=done.includes(`AR03-${key}-${index}`),displayName=type==='cities'?`Guía de ciudad ${String(index+1).padStart(2,'0')}`:`Entrada de templo ${String(index+1).padStart(2,'0')}`;return `<button class="ticket-card visual-archive-card ${seen?'is-read':'is-pending'}" data-file="${file}" data-index="${index}"><span class="ticket-card-number">${String(index+1).padStart(2,'0')}</span><span class="ticket-card-state">${seen?'✓ CONSULTADO':'PENDIENTE'}</span><img src="../assets/documents/AR-03/${folder}/${file}" alt="${displayName}"><span class="ticket-card-copy"><strong>${displayName}</strong><small>${seen?'LECTURA CONFIRMADA · REVISAR':'ABRIR REGISTRO'}</small></span></button>`}).join('')}</div><aside class="ticket-batch-summary ${complete?'is-ready':''} ${batchConfirmed?'is-confirmed':''}"><span class="ticket-batch-symbol">${batchConfirmed?'✓':complete?String(total).padStart(2,'0'):String(remaining).padStart(2,'0')}</span><div><p>${batchConfirmed?'LOTE ARCHIVADO':complete?'CONFIRMACIÓN DISPONIBLE':'CONSULTA INCOMPLETA'}</p><h4>${batchConfirmed?`${title} incorporadas al expediente`:complete?'Todos los registros han sido consultados':`${remaining} ${remaining===1?'registro pendiente':'registros pendientes'}`}</h4><small>${batchConfirmed?'El lote permanece disponible para su revisión.':complete?'Utiliza el botón fijo inferior para confirmar el lote documental.':'Abre y confirma cada registro para desbloquear la acción final.'}</small></div></aside></section>`;
  archiveBatchConfirm.textContent=batchConfirmed?'Lote confirmado':complete?'Confirmar lectura del lote':`${remaining} ${remaining===1?'registro pendiente':'registros pendientes'}`;
  archiveBatchConfirm.disabled=!complete||batchConfirmed;
  archiveBatchConfirm.hidden=batchConfirmed;
  archiveBatchConfirm.onclick=async()=>{if(!complete||read().includes(marker))return;archiveBatchConfirm.disabled=true;archiveBatchConfirm.textContent='Archivando lote…';const records=read();records.push(marker);save(records);await recordActivity('document_confirmed',marker,{source:'recovered_file_bulk',documents:total});openAr03()};
  document.querySelectorAll('.visual-archive-card').forEach(button=>button.onclick=()=>openAr03Item(`AR03-${key}-${button.dataset.index}`,button.dataset.file,`../assets/documents/AR-03/${folder}/${button.dataset.file}`,type));
}
function openAr03Item(id,title,src,type){active=id;next.style.display='none';mark.style.display='inline-block';mark.textContent=read().includes(id)?'Volver al expediente':'Confirmar lectura';document.querySelector('#doc-type').textContent='AR-03 / REGISTRO AMPLIADO';document.querySelector('#doc-title').textContent=title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="${src}" alt="${title}">`;mark.dataset.returnTo=type||'temples'}
const archiveNodes=['TOKYO','KYOTO','OSAKA','NARA','SAPPORO','KOBE','NAGOYA','KANAZAWA','YOKOHAMA','FUKUOKA','SENDAI','HIROSHIMA'];
const randomArchiveNode=()=>`${archiveNodes[Math.floor(Math.random()*archiveNodes.length)]}-${String(Math.floor(Math.random()*99)+1).padStart(2,'0')}`;
let recoveryTimers=[];
const clearRecoveryTimers=()=>{recoveryTimers.forEach(clearTimeout);recoveryTimers=[]};
const recoveryLater=(callback,delay)=>{const timer=setTimeout(callback,delay);recoveryTimers.push(timer);return timer};
const prepareRecoveryView=(id,title,type)=>{clearRecoveryTimers();active=id;readerCanConfirm=false;next.style.display='none';mark.style.display='none';readerBackFolder.hidden=true;viewer.classList.add('is-recovery-mode');document.querySelector('.stamp').style.display='none';document.querySelector('#doc-type').textContent=type;document.querySelector('#doc-title').textContent=title;document.querySelector('#reader-status').textContent='PROCESO DE ARCHIVO';document.querySelector('.reader-content').classList.add('is-recovery');if(!viewer.open)viewer.showModal()};
const recoveryStepsMarkup=steps=>`<ol class="recovery-steps">${steps.map((step,index)=>`<li data-recovery-step="${index}"><i>${String(index+1).padStart(2,'0')}</i><span>${step}</span><b>EN ESPERA</b></li>`).join('')}</ol>`;
const setRecoveryPhase=(phase,progress,label)=>{const steps=[...document.querySelectorAll('[data-recovery-step]')];steps.forEach((step,index)=>{step.classList.toggle('is-active',index===phase);step.classList.toggle('is-complete',index<phase);step.querySelector('b').textContent=index<phase?'COMPLETADO':index===phase?'PROCESANDO':'EN ESPERA'});const fill=document.querySelector('.recovery-progress-fill'),value=document.querySelector('.recovery-progress-value'),live=document.querySelector('.recovery-live');if(fill)fill.style.width=`${progress}%`;if(value)value.textContent=`${progress} %`;if(live)live.textContent=label};
const showRecoveredDocumentReady=id=>{document.querySelector('#doc-title').textContent='Archivo recuperado';document.querySelector('#doc-body').innerHTML=`<section class="recovery-ready"><div class="recovery-ready-symbol">◇</div><p class="recovery-kicker">ARCHIVO RECUPERADO</p><h3>${id}</h3><p class="recovery-ready-name">Documento recuperado</p><dl><div><dt>INTEGRIDAD DOCUMENTAL</dt><dd>100 %</dd></div><div><dt>ESTADO</dt><dd>Disponible para consulta</dd></div></dl><div class="recovery-final-stamp">ARCHIVO RECUPERADO</div><button type="button" id="open-recovered-document">Abrir documento →</button></section>`;document.querySelector('#open-recovered-document').onclick=()=>{clearRecoveryTimers();document.querySelector('.reader-content').classList.remove('is-recovery');showDoc(id)}};
function recoveryScreen(id){prepareRecoveryView(id,'Recuperación de archivo','DIVISIÓN DE ARCHIVOS TEMPORALES / RECUPERACIÓN');const node=randomArchiveNode();if(read().includes(id)){document.querySelector('#doc-body').innerHTML=`<section class="recovery-quick"><div class="recovery-quick-icon">✓</div><p>CONSULTA DE ARCHIVO</p><h3>${id}</h3><strong>Lectura confirmada</strong><span>Abriendo documento archivado…</span><small>NODO · ${node}</small></section>`;recoveryLater(()=>{document.querySelector('.reader-content').classList.remove('is-recovery');showDoc(id)},1350);return}const steps=['Localizando registro autorizado','Validando autorización de consulta','Comprobando integridad documental','Reconstruyendo archivo temporal'];document.querySelector('#doc-body').innerHTML=`<section class="archive-recovery"><header><div><p>RECUPERACIÓN DE ARCHIVO</p><h3>${id}</h3></div><span>NODO DE ARCHIVO<strong>${node}</strong></span></header>${recoveryStepsMarkup(steps)}<div class="recovery-progress"><div><i class="recovery-progress-fill"></i></div><strong class="recovery-progress-value">0 %</strong></div><p class="recovery-live" aria-live="polite">Solicitud de recuperación recibida…</p></section>`;setRecoveryPhase(0,8,'Localizando registro autorizado…');recoveryLater(()=>setRecoveryPhase(1,31,'Registro localizado. Validando autorización…'),650);recoveryLater(()=>setRecoveryPhase(2,58,'Acceso confirmado. Comprobando integridad…'),1350);recoveryLater(()=>setRecoveryPhase(3,82,'Integridad verificada. Reconstruyendo archivo…'),2150);recoveryLater(()=>{setRecoveryPhase(4,100,'Documento recuperado.');recoveryLater(()=>showRecoveredDocumentReady(id),500)},3050)}
const folderRecoveryState=id=>{const done=read();if(id==='AR-03'){const keys=[...ar03Cities.map((_,index)=>`AR03-C-${index}`),...ar03Temples.map((_,index)=>`AR03-T-${index}`)];return{seen:keys.filter(key=>done.includes(key)).length,total:keys.length,complete:ar03Complete(),title:folderDetails[id][0]}}const files=folders[id]?.files||[];return{seen:files.filter(file=>done.includes(file.id)).length,total:files.length,complete:files.length>0&&files.every(file=>done.includes(file.id)),title:folders[id]?.title||folderDetails[id]?.[0]||'Archivos recuperados'}};
const openRecoveredFolder=id=>{clearRecoveryTimers();viewer.classList.remove('is-recovery-mode');document.querySelector('.reader-content').classList.remove('is-recovery');showDoc(id)};
const showRecoveredFolderReady=(id,state)=>{document.querySelector('#doc-title').textContent='Carpeta recuperada';document.querySelector('#doc-body').innerHTML=`<section class="recovery-ready recovery-folder-ready"><div class="recovery-ready-symbol">▱</div><p class="recovery-kicker">CARPETA RECUPERADA</p><h3>${id}</h3><p class="recovery-ready-name">${state.title}</p><dl><div><dt>DOCUMENTOS LOCALIZADOS</dt><dd>${state.total}</dd></div><div><dt>DOCUMENTOS CONSULTADOS</dt><dd>${state.seen}</dd></div><div><dt>ESTADO</dt><dd>Disponible para consulta</dd></div></dl><div class="recovery-final-stamp">ÍNDICE RECUPERADO</div><button type="button" id="open-recovered-folder">Abrir carpeta →</button></section>`;document.querySelector('#open-recovered-folder').onclick=()=>openRecoveredFolder(id)};
function folderRecoveryScreen(id){const state=folderRecoveryState(id),node=randomArchiveNode();prepareRecoveryView(id,state.seen?'Consultando carpeta':'Recuperación de carpeta','DIVISIÓN DE ARCHIVOS TEMPORALES / ÍNDICE DE ARCHIVO');if(state.seen){const heading=state.complete?'Carpeta completada':'Índice recuperado',message=state.complete?'Abriendo archivo histórico…':'Restaurando última posición…';document.querySelector('#doc-body').innerHTML=`<section class="recovery-quick recovery-folder-quick"><div class="recovery-quick-icon">${state.complete?'✓':'↻'}</div><p>CONSULTA DE CARPETA</p><h3>${id}</h3><strong>${heading}</strong><span>${state.seen} de ${state.total} documentos consultados</span><span>${message}</span><small>NODO · ${node}</small></section>`;recoveryLater(()=>openRecoveredFolder(id),1450);return}const steps=['Localizando índice autorizado','Validando permisos de consulta','Catalogando documentos internos','Reconstruyendo estructura de la carpeta'];document.querySelector('#doc-body').innerHTML=`<section class="archive-recovery archive-folder-recovery"><header><div><p>RECUPERACIÓN DE CARPETA</p><h3>${id}</h3><small>${state.title}</small></div><span>NODO DE ARCHIVO<strong>${node}</strong></span></header>${recoveryStepsMarkup(steps)}<div class="recovery-progress"><div><i class="recovery-progress-fill"></i></div><strong class="recovery-progress-value">0 %</strong></div><p class="recovery-live" aria-live="polite">Solicitud de índice recibida…</p></section>`;setRecoveryPhase(0,7,'Localizando índice autorizado…');recoveryLater(()=>setRecoveryPhase(1,29,'Índice localizado. Validando permisos…'),650);recoveryLater(()=>setRecoveryPhase(2,57,`Permisos confirmados. Catalogando ${state.total} registros…`),1350);recoveryLater(()=>setRecoveryPhase(3,84,'Reconstruyendo estructura de la carpeta…'),2150);recoveryLater(()=>{setRecoveryPhase(4,100,'Carpeta recuperada.');recoveryLater(()=>showRecoveredFolderReady(id,state),500)},3050)}
const warningReadList=()=>Array.from({length:11},(_,index)=>`<li><span>✓</span>KTB-${String(index+1).padStart(3,'0')}</li>`).join('');
const renderArchiveWarning=(code,title,onAccept)=>{prepareRecoveryView(code,title,'DIVISIÓN DE ARCHIVOS TEMPORALES / ADVERTENCIA DE ACCESO');document.querySelector('#doc-body').innerHTML=`<section class="archive-warning"><header><div><p>ADVERTENCIA DE ACCESO</p><h3>Contenido recuperado<br><em>fuera del expediente original.</em></h3></div><div class="warning-seal">ACCESO<br>CONTROLADO</div></header><p>Los archivos que va a consultar proceden de una extracción parcial realizada sobre un dispositivo asociado al destinatario.</p><div class="warning-risks"><strong>Los registros pueden contener:</strong><ul><li>Fragmentos incompletos</li><li>Errores de recuperación</li><li>Alteraciones en los metadatos</li><li>Información no catalogada</li></ul></div><section><div><p>LECTURAS PREVIAS VERIFICADAS</p><ul class="warning-read-list">${warningReadList()}</ul></div><dl><div><dt>ARCHIVO RECUPERADO</dt><dd>${code.replace('KTB-','')}</dd></div><div><dt>INTEGRIDAD ESTIMADA</dt><dd>68 %</dd></div><div><dt>ESTADO</dt><dd>Acceso autorizado</dd></div></dl></section><label class="warning-consent"><input id="archive-warning-confirm" type="checkbox"><span>Comprendo el origen de estos archivos y deseo continuar.</span></label><footer><button type="button" id="archive-warning-cancel">Volver al expediente</button><button type="button" id="archive-warning-accept" disabled>Aceptar y continuar →</button></footer></section>`;const checkbox=document.querySelector('#archive-warning-confirm'),accept=document.querySelector('#archive-warning-accept');checkbox.onchange=()=>accept.disabled=!checkbox.checked;document.querySelector('#archive-warning-cancel').onclick=()=>viewer.close();accept.onclick=onAccept};
function openAr06Protocol(){renderArchiveWarning('AR-06','Autorización de acceso',()=>startAr06Recovery())}
function startAr06Recovery(){const done=read();if(!done.includes('AR06-PROTOCOL')){done.push('AR06-PROTOCOL');save(done);void recordActivity('document_confirmed','AR06-PROTOCOL',{source:'recovered_file_protocol'})}folderRecoveryScreen('AR-06')}
function showDoc(id){clearRecoveryTimers();viewer.classList.remove('is-recovery-mode');document.querySelector('.reader-content').classList.remove('is-recovery');document.querySelector('.stamp').style.display='block';if(id==='AR-06'&&!read().includes('AR06-PROTOCOL')){openAr06Protocol();return}if(id==='AR-03'){openAr03();return}if(folders[id]){openFolder(id);return}active=id;next.style.display='inline-block';mark.style.display='inline-block';const [title,...paras]=textFor(id);document.querySelector('#doc-type').textContent=isFolder(id)?'CARPETA DE ARCHIVOS RECUPERADOS / ACCESO AUTORIZADO':'DIVISIÓN DE ARCHIVOS TEMPORALES / ACCESO AUTORIZADO';document.querySelector('#doc-title').textContent=documentImages.has(id)?'Documento recuperado':title;document.querySelector('#doc-body').innerHTML=documentImages.has(id)?`<img style="display:block;width:100%;height:auto" src="../assets/documents/${id}.png" alt="Documento ${id}">`:paras.map(text=>`<p>${text}</p>`).join('')+(id==='KTB-014'?'<p><strong>EXPEDIENTE CERRADO<br>ARCHIVADO DEFINITIVAMENTE</strong></p>':'');mark.textContent=read().includes(id)?'Volver al expediente':isFolder(id)?'Cerrar carpeta y autorizar siguiente fase':'Confirmar lectura';if(!viewer.open)viewer.showModal()}
function openDoc(id){const paper=document.querySelector('.paper'),body=document.querySelector('#doc-body');if(id!=='AC-01'){paper.style.width='';paper.style.maxWidth='';paper.style.padding='';body.style.maxWidth='';body.style.margin=''}if(id==='AC-01'){openAcInfo();return}if(id==='AR-06'&&!read().includes('AR06-PROTOCOL')){openAr06Protocol();return}if(id==='AR-03'||folders[id]){folderRecoveryScreen(id);return}if(id.startsWith('KTB-')){recoveryScreen(id);return}showDoc(id)}
function openAcInfo(){active='AC-01';next.style.display='none';mark.style.display='none';const pages=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`).filter(id=>read().includes(id)).length;document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES';document.querySelector('#doc-title').textContent='ARCHIVO COMPLEMENTARIO AC-01';document.querySelector('#doc-body').innerHTML=`<p style="color:#7e1b19;letter-spacing:.1em;font-size:12px"><strong>REGISTRO ILUSTRADO RECUPERADO</strong></p><section style="margin:28px 0;padding:22px;border:1px solid #8b887d;background:#f6eddd"><p><strong>Clasificación:</strong> No determinada<br><strong>Integridad:</strong> <span style="color:#356a41">100 %</span><br><strong>Páginas disponibles:</strong> ${pages} / 11</p><p><strong>Observación:</strong></p><p>Durante la reconstrucción del expediente se ha localizado un documento ilustrado que no figura en el inventario original.</p><p>Su contenido parece guardar relación con el expediente, aunque su procedencia no ha podido verificarse.</p></section>${pages?'<button id="ac-open-record">Abrir registro</button>':'<p style="color:#7e1b19"><strong>Registro en reconstrucción.</strong><br>La primera página se recuperará al confirmar el siguiente documento KTB.</p>'}`;if(!viewer.open)viewer.showModal();const open=document.querySelector('#ac-open-record');if(open)open.onclick=()=>openComicViewer(1)}
function openComicViewer(page){const pages=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`).filter(id=>read().includes(id)).length;if(!pages){openAcInfo();return}page=Math.min(Math.max(1,page),pages);active='AC-01';next.style.display='none';mark.style.display='none';const paper=document.querySelector('.paper'),body=document.querySelector('#doc-body');paper.style.width='min(1120px,calc(100% - 34px))';paper.style.maxWidth='1120px';paper.style.padding='42px';body.style.maxWidth='900px';body.style.margin='0 auto';document.querySelector('#doc-type').textContent='KIZUNA · DIVISIÓN DE ARCHIVOS TEMPORALES';document.querySelector('#doc-title').textContent='ARCHIVO COMPLEMENTARIO AC-01';document.querySelector('#doc-body').innerHTML=`<img src="../assets/documents/AC-01/Pagina-${page}.png" alt="Página ${page} del registro ilustrado" style="display:block;width:100%;height:auto;border:1px solid #8b887d"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px"><button id="comic-prev" ${page===1?'disabled':''}>← Página anterior</button><strong style="font:12px var(--mono)">PÁGINA ${page} / ${pages}<br><span style="font-size:9px;color:#7e1b19">${pages} DE 11 RECUPERADAS</span></strong><button id="comic-next" ${page===pages?'disabled':''}>Página siguiente →</button></div><button id="comic-back" style="margin-top:18px;background:#7e1b19;color:#fff;border:0;padding:14px 18px;font:11px var(--mono);cursor:pointer">Regresar al expediente</button>`;document.querySelector('#comic-prev').onclick=()=>openComicViewer(page-1);document.querySelector('#comic-next').onclick=()=>openComicViewer(page+1);document.querySelector('#comic-back').onclick=()=>{paper.style.width='';paper.style.maxWidth='';paper.style.padding='';body.style.maxWidth='';body.style.margin='';viewer.close()};if(!viewer.open)viewer.showModal()}
const confirmationFolderAfter=id=>{
  const index=sequence.indexOf(id),candidate=sequence[index+1];
  return candidate&&isFolder(candidate)?candidate:null;
};
const confirmationAcPage=id=>{
  const number=Number(id.slice(-3));
  return number>=4?Math.min(11,number-3):0;
};
function syncKtb(id,onComplete){
  next.style.display='none';
  mark.style.display='none';
  if(id==='KTB-014'){void patchState({completed:false,finalFlowStage:'verification',finalAlertShown:false,finalFileSeen:false});setFinalFlowAction('verification','Iniciar verificación final →',onComplete,false)}
  else clearFinalFlow();
  comicPrevious.hidden=true;
  comicFollowing.hidden=true;
  readerBackFolder.hidden=true;
  readerTools.hidden=true;
  readerContent.classList.remove('has-image','is-folder');
  readerPosition.innerHTML='DOCUMENTO COMPLETO <span>·</span> FINAL DEL DOCUMENTO';
  readerHint.innerHTML='Desplaza para leer <span>·</span> Pellizca para ampliar';
  document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES · REGISTRO DE CONSULTA';
  document.querySelector('#doc-title').textContent='Actualizando expediente…';
  const body=document.querySelector('#doc-body'),folder=confirmationFolderAfter(id),acPage=confirmationAcPage(id),isAcDiscovery=id==='KTB-003',isFinal=id==='KTB-014';
  delete body.dataset.comicPage;
  delete body.dataset.comicPages;
  const nextKtb=sequence.slice(sequence.indexOf(id)+1).find(item=>item.startsWith('KTB-'));
  const detail=isAcDiscovery
    ?`<section class="confirmation-event confirmation-event-ac" id="confirmation-event"><p class="system-line">HALLAZGO ASOCIADO</p><div class="confirmation-event-head"><span>AC-01</span><div><h4>Archivo complementario localizado</h4><p>El registro existe, pero todavía no contiene páginas recuperadas.</p></div></div><div class="confirmation-meter"><i style="--confirmation-value:0%"></i></div><p class="confirmation-count"><strong>0</strong> de 11 páginas disponibles</p></section>`
    :acPage
      ?`<section class="confirmation-event confirmation-event-page" id="confirmation-event"><p class="system-line">ARCHIVO COMPLEMENTARIO AC-01</p><figure class="confirmation-preview"><div><img src="../assets/documents/AC-01/Pagina-${acPage}.png" alt="Vista previa de la página ${acPage} recuperada"><i aria-hidden="true"></i><span>RECONSTRUYENDO</span></div><figcaption>PÁGINA ${String(acPage).padStart(2,'0')} · AC-01</figcaption></figure><div class="confirmation-event-copy"><div class="confirmation-event-head"><span>${String(acPage).padStart(2,'0')}</span><div><h4>${isFinal?'Reconstrucción completada':'Nueva página reconstruida'}</h4><p>${isFinal?'La secuencia complementaria ya está disponible en su totalidad.':`La confirmación de ${id} ha incorporado una nueva página al archivo.`}</p></div></div><div class="confirmation-meter"><i style="--confirmation-value:${Math.round(acPage/11*100)}%"></i></div><p class="confirmation-count"><strong>${acPage}</strong> de 11 páginas disponibles</p></div></section>`
      :`<section class="confirmation-event confirmation-event-next" id="confirmation-event"><p class="system-line">SECUENCIA ACTUALIZADA</p><div class="confirmation-event-head"><span>→</span><div><h4>${nextKtb?'Siguiente documento autorizado':'Registro completado'}</h4><p>${nextKtb?`${nextKtb} queda preparado para continuar la consulta.`:'La lectura ha quedado archivada correctamente.'}</p></div></div></section>`;
  const unlock=folder?`<section class="confirmation-unlock" id="confirmation-unlock"><span class="confirmation-folder-symbol" aria-hidden="true"><i></i></span><div><p class="system-line">NUEVA FASE AUTORIZADA</p><h4>${folder} · ${folderDetails[folder][0]}</h4><p>${folderDetails[folder][1]}</p></div><strong>AUTORIZADO</strong></section>`:'';
  body.innerHTML=`<section class="reading-confirmation ${isFinal?'is-final':''}" aria-live="polite"><header><p class="system-line">REGISTRO DE LECTURA · ${id}</p><h3>Confirmando<br><em>lectura.</em></h3></header><div class="confirmation-progress" aria-hidden="true"><i id="confirmation-progress"></i></div><ol class="confirmation-log"><li id="confirmation-step-1"><span></span>Verificando integridad de la consulta</li><li id="confirmation-step-2"><span></span>Registrando ${id} en el expediente</li><li id="confirmation-step-3"><span></span>Sincronizando nivel de autorización</li></ol><section class="confirmation-result" id="confirmation-result" hidden><div class="confirmation-seal"><span>LECTURA</span><strong>CONFIRMADA</strong></div><div><p class="system-line">REGISTRO COMPLETADO</p><h4>${id} ha quedado archivado.</h4><p>La secuencia autorizada se ha actualizado correctamente.</p></div></section>${detail}${unlock}<footer><p id="confirmation-final-note">Procesando cambios en el Archivo Central…</p></footer></section>`;
  const progress=document.querySelector('#confirmation-progress'),result=document.querySelector('#confirmation-result'),event=document.querySelector('#confirmation-event'),unlockPanel=document.querySelector('#confirmation-unlock'),note=document.querySelector('#confirmation-final-note');
  const steps=[1,2,3];
  steps.forEach((step,index)=>setTimeout(()=>{
    if(!viewer.open)return;
    document.querySelector(`#confirmation-step-${step}`)?.classList.add('is-complete');
    if(progress)progress.style.width=`${(index+1)*25}%`;
  },300+index*420));
  setTimeout(()=>{
    if(!viewer.open)return;
    if(progress)progress.style.width='100%';
    result.hidden=false;
    requestAnimationFrame(()=>result.classList.add('is-visible'));
  },1580);
  setTimeout(()=>{
    if(!viewer.open)return;
    if(event?.querySelector('.confirmation-preview'))event.classList.add('is-scanning');
  },1820);
  setTimeout(()=>{
    if(!viewer.open)return;
    event?.classList.add('is-visible');
    event?.classList.remove('is-scanning');
    event?.querySelector('.confirmation-meter i')?.classList.add('is-filled');
  },acPage?2450:2050);
  setTimeout(()=>{
    if(!viewer.open)return;
    unlockPanel?.classList.add('is-visible');
    note.textContent=isFinal?'La verificación final ya puede comenzar.':folder?'La nueva fase queda disponible desde este momento.':'El expediente está preparado para continuar.';
    if(isFinal)setFinalFlowAction('verification','Iniciar verificación final →',onComplete,true);
  },isFinal?3100:folder?2900:acPage?2850:2350);
}
function startFinale(resumeCompleted=false){
  void patchState({completed:false,finalFlowStage:resumeCompleted?'summary':'verification'});
  next.style.display='none';mark.style.display='none';setFinalFlowAction('summary','Ver acta de cierre →',showFinaleMessage,false);readerTools.hidden=true;readerContent.classList.remove('has-image','is-folder');
  document.querySelector('#doc-type').textContent='VERIFICACIÓN FINAL · ARCHIVO CENTRAL';
  document.querySelector('#doc-title').textContent='Cerrando expediente…';
  document.querySelector('#doc-body').innerHTML=`<section class="final-verification" aria-live="polite"><header><p class="system-line">PROTOCOLO DE CIERRE · PROJECT JAPAN</p><h3>Cerrando<br><em>expediente.</em></h3></header><div class="final-integrity"><span>INTEGRIDAD DE LA LÍNEA TEMPORAL</span><strong id="final-percentage">0 %</strong><div><i id="final-progress"></i></div></div><ol><li id="final-check-1"><span></span>Coherencia narrativa</li><li id="final-check-2"><span></span>Integridad documental</li><li id="final-check-3"><span></span>Secuencia temporal</li><li id="final-check-4"><span></span>Archivo complementario AC-01 · 11/11</li></ol><section id="final-closed" class="final-closed" hidden><p>VERIFICACIÓN COMPLETADA</p><h4>EXPEDIENTE<br>CERRADO</h4><span>KTB-EXP-2026-JP-00184</span></section></section>`;
  const bar=document.querySelector('#final-progress'),percentage=document.querySelector('#final-percentage'),closed=document.querySelector('#final-closed');
  if(resumeCompleted){
    [1,2,3,4].forEach(step=>document.querySelector(`#final-check-${step}`)?.classList.add('is-complete'));
    bar.style.width='100%';percentage.textContent='100 %';closed.hidden=false;closed.classList.add('is-visible');
    setFinalFlowAction('summary','Ver acta de cierre →',showFinaleMessage,true);
    return;
  }
  [1,2,3,4].forEach((step,index)=>setTimeout(()=>{
    if(!viewer.open)return;
    document.querySelector(`#final-check-${step}`)?.classList.add('is-complete');
    const value=(index+1)*25;bar.style.width=`${value}%`;percentage.textContent=`${value} %`;
  },350+index*520));
  setTimeout(()=>{
    if(!viewer.open)return;
    closed.hidden=false;requestAnimationFrame(()=>closed.classList.add('is-visible'));
    void patchState({completed:false,finalFlowStage:'summary'});
    setFinalFlowAction('summary','Ver acta de cierre →',showFinaleMessage,true);
  },2650);
}
function showFinaleMessage(){
  void patchState({completed:false,finalFlowStage:'complete'});
  document.querySelector('#doc-type').textContent='KIZUNA TRAVEL BUREAU · ACTA DE CIERRE';
  document.querySelector('#doc-title').textContent='PROJECT JAPAN · Expediente archivado';
  document.querySelector('#doc-body').innerHTML=`<section class="final-message"><header><p class="system-line">ESTADO DEL EXPEDIENTE</p><h3>La consulta ha<br><em>terminado.</em></h3></header><dl><div><dt>DOCUMENTOS</dt><dd>71 de 71</dd></div><div><dt>INTEGRIDAD</dt><dd>100 %</dd></div><div><dt>AUTORIZACIÓN</dt><dd>NIVEL VIII</dd></div><div><dt>ESTADO</dt><dd>ARCHIVADO</dd></div></dl><div class="final-message-copy"><p>Durante las últimas semanas has recorrido un expediente que nunca debió existir.</p><p>Has leído documentos escritos antes de ser creados y has seguido el rastro de recuerdos que todavía no habían sucedido.</p><p>Y, aun así, has llegado exactamente al lugar al que debías llegar.</p><p>Gracias por confiar en nosotros. Ha sido un honor acompañarte durante esta expedición.</p></div><footer><strong>KIZUNA TRAVEL BUREAU</strong><span>DIVISIÓN DE ARCHIVOS TEMPORALES</span></footer></section>`;
  setFinalFlowAction('complete','Completar archivo →',()=>{viewer.close();render();setTimeout(showFinalFileAlert,180)},true);
}
function resumeFinalFlow(){
  const stage=getFinalFlowStage();
  active='KTB-014';
  if(!viewer.open)viewer.showModal();
  if(stage==='complete')showFinaleMessage();
  else startFinale(stage==='summary');
}
function showFinalLogo(){document.querySelector('#doc-type').textContent='';document.querySelector('#doc-title').textContent='KIZUNA';document.querySelector('#doc-body').innerHTML='<img style="display:block;width:130px;margin:0 auto 18px;border-radius:50%" src="../assets/kizuna-logo-official.png" alt="Kizuna Travel Bureau"><p style="text-align:center;font-size:20px">TRAVEL BUREAU</p><p style="text-align:center;margin-top:70px">Porque los mejores recuerdos nunca pertenecieron a un expediente. Siempre te pertenecieron a ti.</p>'}
document.querySelector('#gate-consent').onchange=event=>document.querySelector('#gate-continue').disabled=!event.target.checked;document.querySelector('#gate-continue').onclick=()=>{patchState({legalAccepted:true});gate.hidden=true;dash.hidden=false;render()};document.querySelector('#access-form').onsubmit=event=>{event.preventDefault();const username=document.querySelector('#username').value.trim().toLowerCase(),password=document.querySelector('#password').value;if(username!=='jose.cuadrado'||password!=='kizuna2026')message.textContent='No se han podido verificar las credenciales de acceso.';else openDashboard()};document.querySelector('#exit').onclick=()=>{location.href='../index.html'};readerCloseButton.onclick=async()=>{if(viewer.classList.contains('is-reader-fullscreen')||document.fullscreenElement===viewer)await exitReaderFullscreen();else viewer.close()};mark.onclick=()=>{const done=read();if(!done.includes(active)){done.push(active);save(done)}if(active.startsWith('AR03-')){if(ar03Complete())openAr03();else if(active==='AR03-CARTA')openAr03Mosaic('temples');else openAr03Mosaic(active.startsWith('AR03-C-')?'cities':'temples');return}const parent=fileFolder(active);if(parent){openFolder(parent);return}if(active.startsWith('KTB-')){const id=active;syncKtb(id,()=>{if(id==='KTB-014')startFinale();else{viewer.close();render()}});return}viewer.close();render()};next.onclick=()=>{const index=sequence.indexOf(active);if(index<sequence.length-1&&allowed(sequence[index+1]))openDoc(sequence[index+1])};

document.querySelector('#gate-continue').onclick=async()=>{
  await patchState({legalAccepted:true,legalAcceptedAt:new Date().toISOString(),legalVersion:Number(getState().legalVersion||1)});
  await recordActivity('legal_terms_accepted',null,{version:Number(getState().legalVersion||1)});
  gate.hidden=true;dash.hidden=false;render();maybeStartExpedientTour();
};

// Panel reservado para cuentas con el rol seguro app_metadata.role = admin.
const adminPanel=document.createElement('main');
adminPanel.id='admin-dashboard';
adminPanel.hidden=true;
adminPanel.className='admin-dashboard';
adminPanel.innerHTML=`<aside class="admin-rail"><div class="admin-brand"><img src="../assets/kizuna-logo-official.png" alt="Kizuna"><div><span>DIVISIÓN DE ARCHIVOS TEMPORALES</span><strong>Administración</strong></div></div><nav class="admin-sidebar" aria-label="Secciones de administración"><button type="button" class="active" data-admin-view="users"><span>01</span>Usuarios</button><button type="button" data-admin-view="mailbox"><span>02</span>Buzón <b id="admin-mailbox-badge" hidden>0</b></button><button type="button" data-admin-view="media"><span>03</span>Media</button><button type="button" data-admin-view="blog"><span>04</span>Blog</button></nav><button id="admin-exit">Cerrar sesión <span>→</span></button></aside><section class="admin-content"><div class="admin-views"><section id="admin-users-view" class="admin-view"><p class="system-line">ACCESO ADMINISTRATIVO · REGISTROS DE DESTINATARIOS</p><h1>Gestión de<br><em>expedientes.</em></h1><p class="admin-intro">Crea nuevos accesos o consulta y corrige los expedientes existentes.</p><div class="admin-user-tabs" role="tablist" aria-label="Gestión de usuarios"><button type="button" class="active" role="tab" aria-selected="true" aria-controls="admin-user-create-tab" data-user-tab="create"><span>01</span>Crear nuevo usuario</button><button type="button" role="tab" aria-selected="false" aria-controls="admin-user-manage-tab" data-user-tab="manage"><span>02</span>Consultar y editar usuarios</button></div><section id="admin-user-create-tab" class="admin-user-tab-panel" role="tabpanel"></section><section id="admin-user-manage-tab" class="admin-user-tab-panel" role="tabpanel" hidden><p class="admin-user-panel-intro">Selecciona un destinatario para consultar y corregir su progreso documental, identidad y actividad.</p><div class="admin-layout"><aside><label>DESTINATARIOS<select id="admin-user-list"><option value="">Cargando registros…</option></select></label></aside><section id="admin-editor" hidden></section></div></section></section><section id="admin-mailbox-view" class="admin-view" hidden><div class="admin-mailbox-heading"><div><p class="system-line">MENSAJES · FORMULARIO PÚBLICO</p><h1>Buzón de<br><em>mensajes.</em></h1><p id="admin-mailbox-summary" class="admin-intro">Cargando mensajes…</p></div><button id="admin-mailbox-refresh" type="button">↻ Actualizar</button></div><div id="admin-mailbox-list" class="admin-mailbox-list"></div></section><section id="admin-media-view" class="admin-view" hidden><p class="system-line">MEDIA · SUPABASE STORAGE</p><h1>Biblioteca de<br><em>imágenes.</em></h1><p class="admin-intro">Importa la carpeta assets completa o sustituye una imagen conservando su ruta pública.</p><div class="admin-media-actions"><label class="admin-media-upload">Importar carpeta assets<input id="admin-media-folder" type="file" accept="image/*" webkitdirectory multiple></label><button id="admin-media-refresh" type="button">Actualizar biblioteca</button></div><p id="admin-media-status" role="status">Preparado para conectar con el bucket kizuna-assets.</p><div id="admin-media-grid" class="admin-media-grid"></div></section><section id="admin-blog-view" class="admin-view" hidden><p class="system-line">CUADERNO DE VIAJE · CONTENIDO PÚBLICO</p><h1>Gestión del<br><em>blog.</em></h1><p class="admin-intro">Crea, edita, ordena y publica los artículos que aparecen en la web.</p><div class="admin-blog-layout"><form id="admin-blog-form"><input type="hidden" name="id"><input type="hidden" name="slug"><p class="system-line" id="admin-blog-form-title">NUEVO ARTÍCULO</p><label>Título<input name="title" required maxlength="180"></label><label>Categoría<input name="category" required maxlength="60" placeholder="GUÍA, CULTURA, SABORES…"></label><label>Resumen<textarea name="excerpt" required maxlength="500" rows="3"></textarea></label><label>Texto completo<textarea name="content" required maxlength="20000" rows="12"></textarea></label><div class="admin-blog-options"><label>Orden<input name="sort_order" type="number" value="0" step="1"></label><label class="admin-blog-published"><input name="is_published" type="checkbox" checked> Publicado</label></div><div class="admin-blog-form-actions"><button>Guardar artículo</button><button id="admin-blog-cancel" type="button" hidden>Cancelar edición</button></div><span id="admin-blog-status" role="status"></span></form><section><div class="admin-blog-list-heading"><p class="system-line">ARTÍCULOS EXISTENTES</p><button id="admin-blog-refresh" type="button">↻ Actualizar</button></div><div id="admin-blog-list"></div></section></div></section></div></section>`;
document.body.appendChild(adminPanel);
const adminUserRefreshButton=document.createElement('button');
adminUserRefreshButton.id='admin-user-refresh';adminUserRefreshButton.type='button';adminUserRefreshButton.disabled=true;adminUserRefreshButton.textContent='↻ Actualizar usuario';
document.querySelector('#admin-user-manage-tab .admin-layout>aside').appendChild(adminUserRefreshButton);

const adminEventsNav=document.createElement('button');
adminEventsNav.type='button';adminEventsNav.dataset.adminView='events';adminEventsNav.innerHTML='<span>05</span>Eventos';
document.querySelector('.admin-sidebar').appendChild(adminEventsNav);
const adminEventsView=document.createElement('section');
adminEventsView.id='admin-events-view';adminEventsView.className='admin-view';adminEventsView.hidden=true;
adminEventsView.innerHTML=`<p class="system-line">AGENDA KIZUNA · EVENTOS EN JAPÓN</p><h1>Gestión de<br><em>eventos.</em></h1><p class="admin-intro">Crea encuentros, controla su aforo y consulta cuántas personas se han apuntado.</p><div class="admin-events-layout"><form id="admin-event-form"><input type="hidden" name="id"><p class="system-line" id="admin-event-form-title">NUEVO EVENTO</p><label>Título<input name="title" required maxlength="180"></label><label>Descripción<textarea name="description" required maxlength="1000" rows="4"></textarea></label><label>Lugar<input name="location" required maxlength="180"></label><div class="admin-event-fields"><label>Fecha y hora en Japón<input name="starts_at" type="datetime-local" required></label><label>Plazas totales<input name="capacity" type="number" min="1" max="10000" required value="20"></label><label>Orden<input name="sort_order" type="number" step="1" value="0"></label></div><label class="admin-event-published"><input name="is_published" type="checkbox" checked> Publicado en la web</label><div class="admin-event-form-actions"><button>Guardar evento</button><button id="admin-event-cancel" type="button" hidden>Cancelar edición</button></div><span id="admin-event-status" role="status"></span></form><section><div class="admin-event-list-heading"><p class="system-line">EVENTOS EXISTENTES</p><button id="admin-event-refresh" type="button">↻ Actualizar</button></div><div id="admin-event-list"></div></section></div>`;
document.querySelector('.admin-views').appendChild(adminEventsView);

const adminShopNav=document.createElement('button');
adminShopNav.type='button';adminShopNav.dataset.adminView='shop';adminShopNav.innerHTML='<span>06</span>Tienda';
document.querySelector('.admin-sidebar').appendChild(adminShopNav);
const adminShopView=document.createElement('section');
adminShopView.id='admin-shop-view';adminShopView.className='admin-view';adminShopView.hidden=true;
adminShopView.innerHTML=`<p class="system-line">TIENDA KIZUNA · CATÁLOGO SIMULADO</p><h1>Gestión de<br><em>productos.</em></h1><p class="admin-intro">Configura el catálogo público. La tienda no procesa pagos, reservas ni pedidos reales.</p><aside class="admin-shop-warning"><strong>ENTORNO DE DEMOSTRACIÓN</strong> Todos los precios y existencias son informativos.</aside><div class="admin-shop-layout"><form id="admin-shop-form"><input type="hidden" name="id"><p class="system-line" id="admin-shop-form-title">NUEVO PRODUCTO</p><label>Nombre<input name="name" required maxlength="180"></label><label>Categoría<select name="category" required><option value="museos">Museos</option><option value="templos">Templos</option><option value="parques">Parques de atracciones</option><option value="transporte">Metro y tren</option><option value="merchandising">Merchandising KIZUNA</option></select></label><label>Descripción<textarea name="description" required maxlength="1000" rows="4"></textarea></label><div class="admin-shop-fields"><label>Precio simulado (€)<input name="price" type="number" min="0" step="0.01" required value="0"></label><label>Stock<input name="stock" type="number" min="0" step="1" required value="0"></label><label>Orden<input name="sort_order" type="number" step="1" value="0"></label></div><label>Imagen · URL o ruta pública<input name="image_url" maxlength="1000" placeholder="assets/imagen.png o https://…"></label><label>Etiqueta<input name="badge" maxlength="60" placeholder="NOVEDAD, 72 HORAS…"></label><label class="admin-shop-active"><input name="is_active" type="checkbox" checked> Visible en la tienda</label><div class="admin-shop-form-actions"><button>Guardar producto</button><button id="admin-shop-cancel" type="button" hidden>Cancelar edición</button></div><span id="admin-shop-status" role="status"></span></form><section><div class="admin-shop-list-heading"><div><p class="system-line">PRODUCTOS EXISTENTES</p><span id="admin-shop-count"></span></div><button id="admin-shop-refresh" type="button">↻ Actualizar</button></div><div class="admin-shop-filters"><label>Buscar producto<input id="admin-shop-search" type="search" placeholder="Nombre, etiqueta o descripción"></label><label>Categoría<select id="admin-shop-category"><option value="all">Todas</option><option value="museos">Museos</option><option value="templos">Templos</option><option value="parques">Parques</option><option value="transporte">Transporte</option><option value="merchandising">Merchandising</option></select></label><label>Visibilidad<select id="admin-shop-visibility"><option value="all">Todos</option><option value="visible">Visibles</option><option value="hidden">Ocultos</option></select></label></div><div id="admin-shop-list"></div></section></div>`;
document.querySelector('.admin-views').appendChild(adminShopView);

const adminCommunicationsNav=document.createElement('button');
adminCommunicationsNav.type='button';adminCommunicationsNav.dataset.adminView='communications';adminCommunicationsNav.innerHTML='<span>07</span>Comunicaciones';
document.querySelector('.admin-sidebar').appendChild(adminCommunicationsNav);
const adminCommunicationsView=document.createElement('section');
adminCommunicationsView.id='admin-communications-view';adminCommunicationsView.className='admin-view';adminCommunicationsView.hidden=true;
adminCommunicationsView.innerHTML=`<p class="system-line">ARCHIVO CENTRAL · AVISOS AUTOMÁTICOS</p><h1>Gestión de<br><em>comunicaciones.</em></h1><p class="admin-intro">Decide qué acciones del destinatario generan un aviso por correo. Las lecturas siempre se registran aunque el correo esté desactivado.</p><aside class="admin-communications-note"><strong>CORREO DE DESTINO</strong><span>Se utiliza la dirección configurada en el secreto ACTIVITY_NOTIFICATION_EMAIL.</span></aside><section class="admin-communications-card"><header><div><p class="system-line">PREFERENCIAS DE AVISO</p><h2>Actividad del expediente</h2></div><div class="admin-communications-actions"><button id="admin-communications-enable" type="button">Activar todos</button><button id="admin-communications-disable" type="button">Desactivar todos</button></div></header><div class="admin-communications-toolbar"><label>Buscar aviso<input id="admin-communications-search" type="search" placeholder="KTB-001, Alberto, documento final…"></label><label>Mostrar<select id="admin-communications-filter"><option value="all">Todos</option><option value="enabled">Activados</option><option value="disabled">Desactivados</option></select></label></div><div id="admin-communications-list"><p>Cargando preferencias…</p></div><footer><span id="admin-communications-status" role="status"></span><button id="admin-communications-save" type="button">Guardar preferencias</button></footer></section>`;
document.querySelector('.admin-views').appendChild(adminCommunicationsView);

const adminViews={users:document.querySelector('#admin-users-view'),mailbox:document.querySelector('#admin-mailbox-view'),media:document.querySelector('#admin-media-view'),blog:document.querySelector('#admin-blog-view'),events:adminEventsView,shop:adminShopView,communications:adminCommunicationsView};
const adminViewTitles={users:['USUARIOS','Gestión de expedientes'],mailbox:['BUZÓN','Mensajes recibidos'],media:['MEDIA','Biblioteca de imágenes'],blog:['BLOG','Gestión de artículos'],events:['EVENTOS','Gestión de eventos'],shop:['TIENDA','Catálogo simulado'],communications:['COMUNICACIONES','Avisos de actividad']};
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
  if(button.dataset.userTab==='manage')document.querySelector('#admin-editor [data-editor-tab="summary"]')?.click();
});
document.querySelectorAll('.admin-sidebar button').forEach(button=>button.onclick=()=>{
  document.querySelectorAll('.admin-sidebar button').forEach(item=>item.classList.toggle('active',item===button));
  Object.entries(adminViews).forEach(([name,view])=>view.hidden=name!==button.dataset.adminView);
  if(button.dataset.adminView==='mailbox')loadAdminMessages();
  if(button.dataset.adminView==='media')loadMediaLibrary();
  if(button.dataset.adminView==='blog')loadAdminArticles();
  if(button.dataset.adminView==='events')loadAdminEvents();
  if(button.dataset.adminView==='shop')loadAdminProducts();
  if(button.dataset.adminView==='communications')loadAdminCommunications();
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

const adminShopForm=document.querySelector('#admin-shop-form');
const adminShopList=document.querySelector('#admin-shop-list');
const adminShopStatus=document.querySelector('#admin-shop-status');
const adminShopSearch=document.querySelector('#admin-shop-search');
const adminShopCategory=document.querySelector('#admin-shop-category');
const adminShopVisibility=document.querySelector('#admin-shop-visibility');
const adminShopCount=document.querySelector('#admin-shop-count');
let adminProducts=[];
const adminShopCategories={museos:'MUSEOS',templos:'TEMPLOS',parques:'PARQUES',transporte:'TRANSPORTE',merchandising:'MERCHANDISING'};
const resetAdminShopForm=()=>{
  adminShopForm.reset();adminShopForm.elements.id.value='';adminShopForm.elements.price.value='0';adminShopForm.elements.stock.value='0';adminShopForm.elements.sort_order.value='0';adminShopForm.elements.is_active.checked=true;
  document.querySelector('#admin-shop-form-title').textContent='NUEVO PRODUCTO';document.querySelector('#admin-shop-cancel').hidden=true;adminShopStatus.textContent='';
};
const editAdminProduct=product=>{
  Object.entries(product).forEach(([key,value])=>{if(adminShopForm.elements[key]&&key!=='is_active')adminShopForm.elements[key].value=value??''});
  adminShopForm.elements.is_active.checked=product.is_active;document.querySelector('#admin-shop-form-title').textContent='EDITANDO PRODUCTO';document.querySelector('#admin-shop-cancel').hidden=false;adminShopForm.scrollIntoView({behavior:'smooth',block:'start'});
};
const deleteAdminProduct=async product=>{
  if(!confirm(`¿Eliminar definitivamente «${product.name}» del catálogo?`))return;
  const {error}=await supabaseClient.from('shop_products').delete().eq('id',product.id);
  if(error){alert('No se ha podido eliminar el producto.');console.error(error);return}
  if(adminShopForm.elements.id.value===product.id)resetAdminShopForm();await loadAdminProducts();
};
const createAdminProductCard=product=>{
  const card=document.createElement('article');card.className=`admin-shop-card ${product.is_active?'is-active':'is-hidden'}`;
  const image=document.createElement('img');image.src=product.image_url?product.image_url.startsWith('http')?product.image_url:`../${product.image_url.replace(/^\.\.\//,'').replace(/^\//,'')}`:'../assets/kizuna-logo-official.png';image.alt='';
  const body=document.createElement('div');const meta=document.createElement('p');meta.className='admin-shop-card-meta';meta.textContent=`${adminShopCategories[product.category]||product.category} · ORDEN ${product.sort_order} · ${product.is_active?'VISIBLE':'OCULTO'}`;
  const title=document.createElement('h2');title.textContent=product.name;const description=document.createElement('p');description.textContent=product.description;
  const figures=document.createElement('strong');figures.className='admin-shop-figures';figures.textContent=`${Number(product.price).toLocaleString('es-ES',{style:'currency',currency:'EUR'})} · ${product.stock} unidades`;
  const actions=document.createElement('div');actions.className='admin-shop-card-actions';const edit=document.createElement('button');edit.type='button';edit.textContent='Editar';edit.onclick=()=>editAdminProduct(product);const remove=document.createElement('button');remove.type='button';remove.className='danger';remove.textContent='Eliminar';remove.onclick=()=>deleteAdminProduct(product);
  actions.append(edit,remove);body.append(meta,title,description,figures,actions);card.append(image,body);return card;
};
const renderAdminProductList=()=>{
  const query=adminShopSearch.value.trim().toLowerCase(),category=adminShopCategory.value,visibility=adminShopVisibility.value;
  const visible=adminProducts.filter(product=>{
    const matchesText=`${product.name} ${product.description} ${product.badge}`.toLowerCase().includes(query);
    const matchesCategory=category==='all'||product.category===category;
    const matchesVisibility=visibility==='all'||(visibility==='visible'&&product.is_active)||(visibility==='hidden'&&!product.is_active);
    return matchesText&&matchesCategory&&matchesVisibility;
  });
  adminShopCount.textContent=`${visible.length} de ${adminProducts.length} productos`;
  adminShopList.replaceChildren(...visible.map(createAdminProductCard));
  if(!visible.length)adminShopList.innerHTML=`<p class="admin-shop-empty">${adminProducts.length?'No hay productos que coincidan con los filtros.':'Todavía no hay productos. Crea el primero desde el formulario.'}</p>`;
};
const loadAdminProducts=async()=>{
  if(!supabaseClient||adminViews.shop.hidden)return;
  adminShopList.innerHTML='<p class="admin-shop-empty">Cargando catálogo…</p>';
  const {data,error}=await supabaseClient.from('shop_products').select('id,name,category,description,price,stock,image_url,badge,is_active,sort_order').order('sort_order',{ascending:true}).order('created_at',{ascending:false});
  if(error){adminShopList.innerHTML='<p class="admin-shop-empty">No se puede recuperar el catálogo. Ejecuta primero supabase-shop.sql.</p>';console.error(error);return}
  adminProducts=data||[];renderAdminProductList();
};
adminShopForm.onsubmit=async event=>{
  event.preventDefault();const button=adminShopForm.querySelector('.admin-shop-form-actions button'),values=Object.fromEntries(new FormData(adminShopForm)),id=values.id;
  const payload={name:values.name.trim(),category:values.category,description:values.description.trim(),price:Number(values.price),stock:Number(values.stock),image_url:values.image_url.trim(),badge:values.badge.trim().toUpperCase(),sort_order:Number(values.sort_order)||0,is_active:adminShopForm.elements.is_active.checked,updated_at:new Date().toISOString()};
  adminShopStatus.textContent=id?'Guardando cambios…':'Creando producto…';button.disabled=true;
  try{const result=id?await supabaseClient.from('shop_products').update(payload).eq('id',id):await supabaseClient.from('shop_products').insert(payload);if(result.error)throw result.error;resetAdminShopForm();await loadAdminProducts();adminShopStatus.textContent='Producto guardado correctamente.';setTimeout(()=>adminShopStatus.textContent='',1800)}
  catch(error){console.error(error);adminShopStatus.textContent=`No se ha podido guardar: ${error.message}`}
  finally{button.disabled=false}
};
document.querySelector('#admin-shop-cancel').onclick=resetAdminShopForm;
document.querySelector('#admin-shop-refresh').onclick=loadAdminProducts;
[adminShopSearch,adminShopCategory,adminShopVisibility].forEach(control=>control.addEventListener(control.tagName==='INPUT'?'input':'change',renderAdminProductList));

const isAdmin=user=>user?.app_metadata?.role==='admin';
const safeState=state=>({read:[],mailRead:0,finalFileSeen:false,finalAlertShown:false,completed:false,finalFlowStage:'',legalAccepted:false,legalAcceptedAt:null,legalVersion:1,onboardingCompleted:false,onboardingCompletedAt:null,onboardingVersion:1,...(state||{})});
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
    const nextState={...current,read:selected,completed:closing?current.completed:false,finalFlowStage:closing?(current.completed?'closed':current.finalFlowStage||'verification'):'',finalAlertShown:closing?current.finalAlertShown:false,finalFileSeen:closing?current.finalFileSeen:false};
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
      const title=item.event_type==='login'?'Inicio de sesión verificado':item.event_type==='logout'?'Cierre de sesión':item.event_type==='legal_terms_accepted'?`Bases legales aceptadas · versión ${item.details?.version||1}`:item.event_type==='legal_terms_reset'?`Nueva versión de bases legales · versión ${item.details?.version||1}`:item.event_type==='comic_page_read'?`Registro ilustrado · ${item.details?.read||'?'} / ${item.details?.total||11} páginas leídas`:item.event_type==='supplementary_file_consulted'?'Archivo final consultado':item.event_type==='expedient_reset'?'Expediente reiniciado por administración':item.details?.source?.startsWith('recovered_file')?`Archivo recuperado confirmado · ${item.document_id||'Documento'}`:`Lectura confirmada · ${item.document_id||'Documento'}`;
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

const adminCommunicationEntries=()=>[
  ...progressKeys.map(id=>({key:`document:${id}`,code:id,title:adminRecordTitle(id),group:id.startsWith('KTB-')?'Secuencia principal':'Archivos recuperados'})),
  {key:'special:final-opened',code:'FINAL-01',title:'Apertura del documento final',group:'Acciones especiales'},
  {key:'special:alberto-opened',code:'ALBERTO',title:'Apertura del mensaje de Alberto',group:'Acciones especiales'},
];
let adminCommunicationPreferences=new Map();
const updateAdminCommunicationGroupCounts=()=>{
  document.querySelectorAll('[data-communication-group-count]').forEach(target=>{const group=target.dataset.communicationGroupCount,items=adminCommunicationEntries().filter(entry=>entry.group===group),enabled=items.filter(entry=>adminCommunicationPreferences.get(entry.key)===true).length;target.textContent=`${enabled} de ${items.length} activos`});
};
const renderAdminCommunications=(preservePosition=false)=>{
  const target=document.querySelector('#admin-communications-list');if(!target)return;
  const listScroll=target.scrollTop,pageX=window.scrollX,pageY=window.scrollY;
  const query=String(document.querySelector('#admin-communications-search')?.value||'').trim().toLowerCase();
  const filter=document.querySelector('#admin-communications-filter')?.value||'all';
  const entries=adminCommunicationEntries().filter(entry=>{const enabled=adminCommunicationPreferences.get(entry.key)===true;return(!query||`${entry.code} ${entry.title} ${entry.group}`.toLowerCase().includes(query))&&(filter==='all'||(filter==='enabled'&&enabled)||(filter==='disabled'&&!enabled))});
  const groups=['Secuencia principal','Archivos recuperados','Acciones especiales'];
  target.innerHTML=groups.map(group=>{const items=entries.filter(entry=>entry.group===group);if(!items.length)return'';const allItems=adminCommunicationEntries().filter(entry=>entry.group===group),enabledCount=allItems.filter(entry=>adminCommunicationPreferences.get(entry.key)===true).length;return `<section class="admin-communication-group"><header><div><span>${group}</span><strong data-communication-group-count="${group}">${enabledCount} de ${allItems.length} activos</strong></div><nav><button type="button" data-communication-group-action="enable" data-communication-group="${group}">Activar grupo</button><button type="button" data-communication-group-action="disable" data-communication-group="${group}">Desactivar grupo</button></nav></header><div>${items.map(entry=>{const enabled=adminCommunicationPreferences.get(entry.key)===true;return `<label class="admin-communication-row ${enabled?'is-enabled':''}" data-communication-search="${adminEditorEscape(`${entry.code} ${entry.title}`.toLowerCase())}"><span class="admin-communication-code">${adminEditorEscape(entry.code)}</span><span><strong>${adminEditorEscape(entry.title)}</strong><small>${enabled?'Se enviará un correo':'Sin aviso por correo'}</small></span><input type="checkbox" data-communication-key="${adminEditorEscape(entry.key)}" ${enabled?'checked':''}><i aria-hidden="true"></i></label>`}).join('')}</div></section>`}).join('')||'<p class="admin-communications-empty">No hay avisos que coincidan con el filtro.</p>';
  target.querySelectorAll('[data-communication-key]').forEach(input=>input.onchange=()=>{adminCommunicationPreferences.set(input.dataset.communicationKey,input.checked);const activeFilter=document.querySelector('#admin-communications-filter')?.value||'all';if(activeFilter!=='all'){renderAdminCommunications(true);return}const row=input.closest('.admin-communication-row');row?.classList.toggle('is-enabled',input.checked);const description=row?.querySelector('small');if(description)description.textContent=input.checked?'Se enviará un correo':'Sin aviso por correo';updateAdminCommunicationGroupCounts()});
  target.querySelectorAll('[data-communication-group-action]').forEach(button=>button.onclick=()=>{const enabled=button.dataset.communicationGroupAction==='enable';adminCommunicationEntries().filter(entry=>entry.group===button.dataset.communicationGroup).forEach(entry=>adminCommunicationPreferences.set(entry.key,enabled));renderAdminCommunications(true)});
  if(preservePosition)requestAnimationFrame(()=>{target.scrollTop=listScroll;window.scrollTo(pageX,pageY)});
};
const loadAdminCommunications=async()=>{
  const target=document.querySelector('#admin-communications-list'),status=document.querySelector('#admin-communications-status');if(!target||!supabaseClient)return;
  target.innerHTML='<p>Cargando preferencias…</p>';status.textContent='';
  const {data,error}=await supabaseClient.from('expedient_communication_preferences').select('event_key,enabled');
  if(error){console.error(error);target.innerHTML='<p>No se han podido recuperar las preferencias. Ejecuta primero <strong>supabase-communication-preferences.sql</strong>.</p>';return}
  adminCommunicationPreferences=new Map((data||[]).map(item=>[item.event_key,item.enabled===true]));
  renderAdminCommunications();
};
document.querySelector('#admin-communications-search').oninput=renderAdminCommunications;
document.querySelector('#admin-communications-filter').onchange=renderAdminCommunications;
document.querySelector('#admin-communications-enable').onclick=()=>{adminCommunicationEntries().forEach(entry=>adminCommunicationPreferences.set(entry.key,true));renderAdminCommunications(true)};
document.querySelector('#admin-communications-disable').onclick=()=>{adminCommunicationEntries().forEach(entry=>adminCommunicationPreferences.set(entry.key,false));renderAdminCommunications(true)};
document.querySelector('#admin-communications-save').onclick=async()=>{
  const button=document.querySelector('#admin-communications-save'),status=document.querySelector('#admin-communications-status');button.disabled=true;status.textContent='Guardando preferencias…';
  try{
    const {data:{user}}=await supabaseClient.auth.getUser();
    const rows=adminCommunicationEntries().map(entry=>({event_key:entry.key,enabled:adminCommunicationPreferences.get(entry.key)===true,updated_at:new Date().toISOString(),updated_by:user?.id||null}));
    const {error}=await supabaseClient.from('expedient_communication_preferences').upsert(rows,{onConflict:'event_key'});if(error)throw error;
    status.textContent='Preferencias guardadas correctamente.';
  }catch(error){console.error(error);status.textContent='No se han podido guardar las preferencias.'}finally{button.disabled=false}
};

const renderAdminEditor=(profile,state,initialTab='summary')=>{
  const editor=document.querySelector('#admin-editor'),current=safeState(state);
  const requestedTab=['summary','documents','activity','purchases','settings'].includes(initialTab)?initialTab:'summary';
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
  editor.innerHTML=`<header class="admin-user-profile"><div><p class="system-line">DESTINATARIO SELECCIONADO</p><h2>${displayName}</h2><p>${email}</p></div><dl><div><dt>Expediente</dt><dd>KTB-EXP-2026-JP-00184</dd><span class="admin-user-badge ${isActive?'active':'inactive'}">${isActive?'CUENTA ACTIVA':'CUENTA DESACTIVADA'}</span></div><div><dt>Documentos</dt><dd>${reviewed} de ${total}</dd></div><div><dt>Progreso</dt><dd>${integrity} %</dd></div><div><dt>Última actividad</dt><dd id="admin-last-activity">Consultando…</dd></div></dl></header><nav class="admin-editor-tabs" role="tablist"><button type="button" class="active" data-editor-tab="summary">Resumen</button><button type="button" data-editor-tab="documents">Documentos</button><button type="button" data-editor-tab="activity">Actividad</button><button type="button" data-editor-tab="purchases">Productos comprados</button><button type="button" data-editor-tab="settings">Ajustes</button></nav><div class="admin-user-body"><div class="admin-user-main"><section class="admin-editor-panel" data-editor-panel="summary"><p class="system-line">RESUMEN DEL EXPEDIENTE</p><h3>Estado general</h3><div class="admin-overview-grid"><article><strong>${reviewed}</strong><span>Registros confirmados</span></article><article><strong>${total-reviewed}</strong><span>Registros pendientes</span></article><article><strong>${accessLevel}</strong><span>Nivel de acceso</span></article><article><strong>${integrity} %</strong><span>Integridad documental</span></article></div></section><section class="admin-editor-panel" data-editor-panel="documents" hidden><div class="admin-document-toolbar"><div class="admin-document-filters"><button type="button" class="active" data-record-filter="all">Todos</button><button type="button" data-record-filter="read">Leídos</button><button type="button" data-record-filter="pending">Pendientes</button></div><label><span>Buscar documento</span><input id="admin-document-search" type="search" placeholder="Buscar documento"></label></div><form id="admin-progress-form"><div class="admin-document-grid">${documents}</div><p class="admin-note">Al desmarcar KTB-014 se reabre el expediente y se restaura el aviso final para una nueva revisión.</p></form><details class="admin-identity-details"><summary>Identidad y acceso</summary><form id="admin-identity-form"><label>Nombre y apellidos<input name="displayName" required maxlength="80" value="${displayName}"></label><div><span>Estado de la cuenta</span><button type="button" id="admin-toggle-user" class="admin-account-toggle ${isActive?'active':''}" aria-pressed="${isActive}"><i></i>${isActive?'Cuenta activa':'Cuenta desactivada'}</button></div><button>Guardar identidad</button><span id="admin-identity-status" role="status"></span></form></details></section><section class="admin-editor-panel" data-editor-panel="activity" hidden><div id="admin-activity-log"><p class="system-line">REGISTRO DE ACTIVIDAD</p><h3>Actividad del expediente</h3><p>Cargando actividad…</p></div></section><section class="admin-editor-panel" data-editor-panel="purchases" hidden><div id="admin-purchases"><p class="system-line">TIENDA KIZUNA</p><h3>Productos comprados</h3><p>Cargando pedidos simulados…</p></div></section><section class="admin-editor-panel" data-editor-panel="settings" hidden><p class="system-line">AJUSTES DEL DESTINATARIO</p><h3>Acceso y seguridad</h3><p>Gestiona la identidad, el acceso y las acciones permanentes de este expediente.</p><button type="button" class="admin-open-identity">Editar identidad y acceso</button></section></div><aside class="admin-user-side"><section class="admin-progress-card"><p class="system-line">PROGRESO DEL EXPEDIENTE</p><strong>${integrity} %</strong><div><i style="width:${integrity}%"></i></div><dl><div><dt>${reviewed}</dt><dd>Documentos leídos</dd></div><div><dt>${total-reviewed}</dt><dd>Documentos pendientes</dd></div></dl><p>NIVEL DE ACCESO ACTUAL<br><b>${accessLevel}</b></p><button type="button" id="admin-save-progress">Guardar cambios</button><span id="admin-save-status" role="status"></span></section><section class="admin-activity-preview"><p class="system-line">ACTIVIDAD RECIENTE</p><div id="admin-activity-preview"><p>Cargando actividad…</p></div><button type="button" id="admin-view-all-activity">Ver actividad completa →</button></section><section class="admin-danger-zone"><p class="system-line">ZONA DE SEGURIDAD</p><p>Estas acciones afectan al acceso o al progreso guardado.</p><button type="button" id="admin-reset-progress">Limpiar expediente</button><button type="button" id="admin-side-toggle-user">${isActive?'Desactivar acceso':'Reactivar acceso'}</button><span id="admin-reset-status" role="status"></span></section></aside></div>`;

  const documentsPanel=editor.querySelector('[data-editor-panel="documents"]'),settingsPanel=editor.querySelector('[data-editor-panel="settings"]');
  const identityDetails=editor.querySelector('.admin-identity-details'),dangerZone=editor.querySelector('.admin-danger-zone');
  identityDetails.open=true;settingsPanel.append(identityDetails,dangerZone);
  const identityEmailLabel=document.createElement('label');
  identityEmailLabel.innerHTML=`Correo electrónico de acceso<input name="email" type="email" autocomplete="email" required value="${email}"><small>El destinatario utilizará este correo la próxima vez que inicie sesión.</small>`;
  identityDetails.querySelector('input[name="displayName"]').closest('label').after(identityEmailLabel);
  const legalAccepted=Boolean(current.legalAccepted),legalVersion=Number(current.legalVersion||1);
  const legalAcceptedDate=current.legalAcceptedAt&&!Number.isNaN(Date.parse(current.legalAcceptedAt))?new Date(current.legalAcceptedAt).toLocaleString('es-ES',{dateStyle:'medium',timeStyle:'short'}):null;
  const legalSettings=document.createElement('section');
  legalSettings.className='admin-message-settings admin-legal-settings';
  legalSettings.innerHTML=`<p class="system-line">BASES LEGALES · VERSIÓN ${legalVersion}</p><h4>Condiciones de acceso</h4><p class="admin-legal-state ${legalAccepted?'accepted':'pending'}"><strong>${legalAccepted?'ACEPTADAS':'PENDIENTES DE ACEPTACIÓN'}</strong>${legalAcceptedDate?`<span>${adminEditorEscape(legalAcceptedDate)}</span>`:''}</p><p>${legalAccepted?'El destinatario no volverá a ver el aviso mientras esta versión siga vigente.':'El aviso legal se mostrará antes de permitir el próximo acceso al expediente.'}</p><button type="button" id="admin-renew-legal" ${legalAccepted?'':'disabled'}>Crear nueva versión</button><span id="admin-legal-status" role="status"></span>`;
  settingsPanel.insertBefore(legalSettings,dangerZone);
  const onboardingCompleted=Boolean(current.onboardingCompleted),onboardingCompletedDate=current.onboardingCompletedAt&&!Number.isNaN(Date.parse(current.onboardingCompletedAt))?new Date(current.onboardingCompletedAt).toLocaleString('es-ES',{dateStyle:'medium',timeStyle:'short'}):null;
  const onboardingSettings=document.createElement('section');
  onboardingSettings.className='admin-message-settings admin-onboarding-settings';
  onboardingSettings.innerHTML=`<p class="system-line">GUÍA INICIAL · VERSIÓN ${Number(current.onboardingVersion||1)}</p><h4>Recorrido del expediente</h4><p class="admin-legal-state ${onboardingCompleted?'accepted':'pending'}"><strong>${onboardingCompleted?'GUÍA COMPLETADA':'PENDIENTE DE MOSTRAR'}</strong>${onboardingCompletedDate?`<span>${adminEditorEscape(onboardingCompletedDate)}</span>`:''}</p><p>${onboardingCompleted?'El recorrido no volverá a aparecer automáticamente. Puedes prepararlo para el próximo acceso.':'La guía se mostrará cuando el destinatario vuelva a entrar en su expediente.'}</p><button type="button" id="admin-reset-onboarding" ${onboardingCompleted?'':'disabled'}>Mostrar guía de nuevo</button><span id="admin-onboarding-status" role="status"></span>`;
  settingsPanel.insertBefore(onboardingSettings,dangerZone);
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
  activateTab(requestedTab);
  const viewAllActivity=document.querySelector('#admin-view-all-activity');if(viewAllActivity)viewAllActivity.onclick=()=>activateTab('activity');
  document.querySelector('.admin-open-identity').onclick=()=>{activateTab('settings');const details=document.querySelector('.admin-identity-details');details.open=true;details.scrollIntoView({behavior:'smooth',block:'center'})};
  let recordFilter='all';
  const filterRecords=()=>{const query=document.querySelector('#admin-document-search').value.trim().toLowerCase();editor.querySelectorAll('.admin-document-row').forEach(row=>row.hidden=(recordFilter!=='all'&&row.dataset.status!==recordFilter)||!row.dataset.search.includes(query))};
  editor.querySelectorAll('[data-record-filter]').forEach(button=>button.onclick=()=>{recordFilter=button.dataset.recordFilter;editor.querySelectorAll('[data-record-filter]').forEach(item=>item.classList.toggle('active',item===button));filterRecords()});
  document.querySelector('#admin-document-search').oninput=filterRecords;
  editor.querySelectorAll('.admin-document-row input').forEach(input=>input.onchange=()=>{const row=input.closest('.admin-document-row');row.dataset.status=input.checked?'read':'pending';row.querySelector('.admin-document-state').textContent=input.checked?'LEÍDO':'PENDIENTE';row.querySelector('.admin-document-state').classList.toggle('is-read',input.checked);row.querySelector('.admin-document-date').textContent=input.checked?'Sin guardar':'—';filterRecords()});

  const saveProgress=async()=>{const status=document.querySelector('#admin-save-status'),button=document.querySelector('#admin-save-progress');const records=[...editor.querySelectorAll('input[name="records"]:checked')].map(input=>input.value),closing=records.includes('KTB-014'),wasCompleted=Boolean(current.completed),closingStage=closing?(wasCompleted?'closed':current.finalFlowStage||'verification'):'';const nextState={...current,read:records,completed:closing&&closingStage==='closed',finalFlowStage:closingStage,albertoMessageRead:closing&&wasCompleted?Boolean(current.albertoMessageRead):false,albertoResponseAccepted:closing&&wasCompleted?Boolean(current.albertoResponseAccepted):false,finalAlertShown:closing?current.finalAlertShown:false,finalFileSeen:closing?current.finalFileSeen:false};status.textContent='Guardando…';button.disabled=true;const {error}=await supabaseClient.from('expedient_progress').upsert({user_id:profile.id,state:nextState,updated_at:new Date().toISOString()});if(error){status.textContent='No se pudieron guardar los cambios.';console.error(error);button.disabled=false;return}renderAdminEditor(profile,nextState)};
  document.querySelector('#admin-save-progress').onclick=saveProgress;
  const identityForm=document.querySelector('#admin-identity-form');
  identityForm.onsubmit=async event=>{
    event.preventDefault();
    const status=document.querySelector('#admin-identity-status'),button=identityForm.querySelector('button:not([type="button"])'),formData=new FormData(identityForm);
    const newName=String(formData.get('displayName')||'').trim(),newEmail=String(formData.get('email')||'').trim().toLowerCase();
    const emailChanged=newEmail!==String(profile.email||'').trim().toLowerCase();
    if(emailChanged&&!confirm(`¿Cambiar el correo de acceso de ${profile.email} a ${newEmail}? El correo anterior dejará de servir para iniciar sesión.`))return;
    status.textContent='Actualizando identidad y acceso…';button.disabled=true;
    try{
      const {data,error}=await supabaseClient.functions.invoke('create-expedient-user',{body:{action:'update-profile',userId:profile.id,displayName:newName,email:newEmail}});
      if(error)throw error;
      profile.display_name=data?.displayName||newName;profile.email=data?.email||newEmail;
      const option=document.querySelector(`#admin-user-list option[value="${profile.id}"]`);if(option)option.textContent=`${profile.display_name||profile.email} · ${profile.email}`;
      renderAdminEditor(profile,current);
    }catch(error){console.error(error);status.textContent=await functionErrorMessage(error);button.disabled=false}
  };
  const toggleAccess=async()=>{const nextActive=!isActive;if(!confirm(nextActive?'¿Reactivar el acceso de este destinatario?':'¿Desactivar el acceso de este destinatario? No podrá iniciar sesión hasta que lo reactives.'))return;const buttons=[document.querySelector('#admin-toggle-user'),document.querySelector('#admin-side-toggle-user')];buttons.forEach(button=>button.disabled=true);try{const {data,error}=await supabaseClient.functions.invoke('create-expedient-user',{body:{action:'set-active',userId:profile.id,active:nextActive}});if(error)throw error;profile.is_active=data?.isActive===undefined?nextActive:data.isActive;renderAdminEditor(profile,current)}catch(error){console.error(error);buttons.forEach(button=>button.disabled=false);document.querySelector('#admin-identity-status').textContent=await functionErrorMessage(error)}};
  document.querySelector('#admin-toggle-user').onclick=toggleAccess;document.querySelector('#admin-side-toggle-user').onclick=toggleAccess;
  document.querySelector('#admin-reset-alberto').onclick=async()=>{const button=document.querySelector('#admin-reset-alberto'),status=document.querySelector('#admin-alberto-status');if(!confirm(`¿Volver a mostrar el mensaje y la decisión final a ${profile.display_name||profile.email}?`))return;button.disabled=true;status.textContent='Restaurando mensaje…';const nextState={...current,completed:true,finalFlowStage:'closed',albertoMessageRead:false,albertoResponseAccepted:false,albertoResponse:null,albertoRespondedAt:null,acceptanceEmailSentAt:null,acceptanceEmailId:null};const {error}=await supabaseClient.from('expedient_progress').upsert({user_id:profile.id,state:nextState,updated_at:new Date().toISOString()});if(error){console.error(error);status.textContent='No se ha podido restaurar el mensaje.';button.disabled=false;return}renderAdminEditor(profile,nextState)};
  document.querySelector('#admin-renew-legal').onclick=async()=>{
    const button=document.querySelector('#admin-renew-legal'),status=document.querySelector('#admin-legal-status');
    if(!confirm(`¿Crear una nueva versión de las bases para ${profile.display_name||profile.email}? Tendrá que aceptarlas de nuevo antes de acceder al expediente.`))return;
    button.disabled=true;status.textContent='Creando nueva versión…';
    const nextVersion=legalVersion+1,nextState={...current,legalAccepted:false,legalAcceptedAt:null,legalVersion:nextVersion,legalResetAt:new Date().toISOString()};
    const {error}=await supabaseClient.from('expedient_progress').upsert({user_id:profile.id,state:nextState,updated_at:new Date().toISOString()});
    if(error){console.error(error);status.textContent='No se ha podido crear la nueva versión.';button.disabled=false;return}
    const {error:activityError}=await supabaseClient.from('expedient_activity_log').insert({user_id:profile.id,event_type:'legal_terms_reset',document_id:null,details:{version:nextVersion,source:'administration'}});
    if(activityError)console.warn('La versión se actualizó, pero no pudo registrarse en la actividad.',activityError);
    renderAdminEditor(profile,nextState);
  };
  document.querySelector('#admin-reset-onboarding').onclick=async()=>{
    const button=document.querySelector('#admin-reset-onboarding'),status=document.querySelector('#admin-onboarding-status');
    if(!confirm(`¿Volver a mostrar la guía inicial a ${profile.display_name||profile.email} en su próximo acceso?`))return;
    button.disabled=true;status.textContent='Preparando la guía…';
    const nextState={...current,onboardingCompleted:false,onboardingCompletedAt:null,onboardingResult:null,onboardingResetAt:new Date().toISOString(),onboardingVersion:Number(current.onboardingVersion||1)};
    const {error}=await supabaseClient.from('expedient_progress').upsert({user_id:profile.id,state:nextState,updated_at:new Date().toISOString()});
    if(error){console.error(error);status.textContent='No se ha podido reactivar la guía.';button.disabled=false;return}
    const {error:activityError}=await supabaseClient.from('expedient_activity_log').insert({user_id:profile.id,event_type:'onboarding_reset',document_id:null,details:{version:Number(current.onboardingVersion||1),source:'administration'}});
    if(activityError)console.warn('La guía se reactivó, pero no pudo registrarse en la actividad.',activityError);
    renderAdminEditor(profile,nextState,'settings');
  };
  document.querySelector('#admin-reset-progress').onclick=async()=>{const button=document.querySelector('#admin-reset-progress'),status=document.querySelector('#admin-reset-status');if(!confirm(`¿Limpiar por completo el expediente de ${profile.display_name||profile.email}? Esta acción no se puede deshacer.`))return;button.disabled=true;status.textContent='Limpiando expediente…';try{const {data,error}=await supabaseClient.functions.invoke('create-expedient-user',{body:{action:'reset-progress',userId:profile.id}});if(error)throw error;renderAdminEditor(profile,data?.state||safeState())}catch(error){console.error(error);status.textContent=await functionErrorMessage(error);button.disabled=false}};
  renderAdminActivity(profile.id);
  renderAdminPurchases(profile.id);
};

const renderAdminPurchases=async userId=>{
  const target=document.querySelector('#admin-purchases');if(!target)return;
  try{
    const {data,error}=await supabaseClient.from('shop_orders').select('reference,country,items,item_count,total,status,created_at').eq('user_id',userId).order('created_at',{ascending:false});
    if(error)throw error;const orders=data||[];
    if(!orders.length){target.innerHTML='<p class="system-line">TIENDA KIZUNA</p><h3>Productos comprados</h3><p class="admin-purchases-empty">Este destinatario todavía no ha registrado pedidos simulados.</p>';return}
    const cards=orders.map(order=>{const items=Array.isArray(order.items)?order.items:[];return `<article class="admin-purchase-card"><header><div><p>${adminEditorEscape(order.reference)}</p><strong>${new Date(order.created_at).toLocaleString('es-ES',{dateStyle:'medium',timeStyle:'short'})}</strong></div><span>${adminEditorEscape(order.status)}</span></header><ul>${items.map(item=>`<li><div><strong>${adminEditorEscape(item.name)}</strong><small>${adminEditorEscape(adminShopCategories[item.category]||item.category||'PRODUCTO')}</small></div><span>${Number(item.quantity)||0} × ${Number(item.unit_price||0).toLocaleString('es-ES',{style:'currency',currency:'EUR'})}</span></li>`).join('')}</ul><footer><span>${order.item_count} productos · ${adminEditorEscape(order.country)}</span><strong>${Number(order.total).toLocaleString('es-ES',{style:'currency',currency:'EUR'})}</strong></footer></article>`}).join('');
    target.innerHTML=`<p class="system-line">TIENDA KIZUNA</p><div class="admin-purchases-heading"><div><h3>Productos comprados</h3><p>${orders.length} pedidos simulados registrados</p></div><strong>${orders.reduce((sum,order)=>sum+Number(order.total),0).toLocaleString('es-ES',{style:'currency',currency:'EUR'})}</strong></div><div class="admin-purchases-list">${cards}</div>`;
  }catch(error){console.error(error);target.innerHTML='<p class="system-line">TIENDA KIZUNA</p><h3>Productos comprados</h3><p class="admin-purchases-empty">No se pueden recuperar los pedidos. Ejecuta supabase-shop-orders.sql en Supabase.</p>'}
};

const renderAdminActivity=async userId=>{
  const full=document.querySelector('#admin-activity-log'),preview=document.querySelector('#admin-activity-preview'),last=document.querySelector('#admin-last-activity');if(!full)return;
  try{const {data,error}=await supabaseClient.from('expedient_activity_log').select('event_type,document_id,details,created_at').eq('user_id',userId).order('created_at',{ascending:false});if(error)throw error;const items=data||[];if(last)last.textContent=items[0]?new Date(items[0].created_at).toLocaleDateString('es-ES'):'Sin actividad';
    const albertoResponses={japon:'Sí. Nos vamos a Japón.',ramen:'Acepto... pero quiero mucho ramen.',claro:'¿De verdad pensabas que iba a decir que no?'};
    const activityTitle=item=>item.details?.activity_kind==='alberto_message_opened'?'Carta de Alberto abierta':item.details?.activity_kind==='alberto_response_submitted'?`Respuesta a la carta de Alberto · ${albertoResponses[item.details?.response]||'Respuesta registrada'}`:item.event_type==='login'?'Inicio de sesión verificado':item.event_type==='logout'?'Cierre de sesión':item.event_type==='legal_terms_accepted'?`Bases legales aceptadas · versión ${item.details?.version||1}`:item.event_type==='legal_terms_reset'?`Nueva versión de bases legales · versión ${item.details?.version||1}`:item.event_type==='onboarding_completed'?'Guía inicial completada':item.event_type==='onboarding_skipped'?'Guía inicial omitida':item.event_type==='onboarding_reset'?'Guía inicial reactivada por administración':item.event_type==='comic_page_read'?`Registro ilustrado · ${item.details?.read||'?'} / ${item.details?.total||11} páginas`:item.event_type==='supplementary_file_consulted'?'Archivo final consultado':item.event_type==='expedient_reset'?'Expediente reiniciado por administración':item.details?.source?.startsWith('recovered_file')?`Archivo recuperado · ${item.document_id||'Documento'}`:`Lectura confirmada · ${item.document_id||'Documento'}`;
    const row=item=>`<li><time>${new Date(item.created_at).toLocaleString('es-ES',{dateStyle:'short',timeStyle:'short'})}</time><strong>${adminEditorEscape(activityTitle(item))}</strong></li>`;
    if(!items.length){full.innerHTML='<p class="system-line">REGISTRO DE ACTIVIDAD</p><h3>Actividad del expediente</h3><p>Aún no hay actividad registrada para este destinatario.</p>';if(preview)preview.innerHTML='<p>Sin actividad registrada.</p>';return}
    full.innerHTML=`<p class="system-line">REGISTRO DE ACTIVIDAD</p><h3>Actividad del expediente</h3><p class="admin-activity-count">${items.length} registros</p><ol class="admin-activity-list">${items.map(row).join('')}</ol>`;if(preview)preview.innerHTML=`<ol class="admin-activity-list compact">${items.slice(0,3).map(row).join('')}</ol>`;
    const dates=new Map();items.filter(item=>item.document_id).forEach(item=>{if(!dates.has(item.document_id))dates.set(item.document_id,new Date(item.created_at).toLocaleDateString('es-ES'))});dates.forEach((date,id)=>{const target=document.querySelector(`.admin-document-row[data-document-id="${id}"] .admin-document-date`);if(target)target.textContent=date});
  }catch(error){console.error(error);if(last)last.textContent='No disponible';full.innerHTML='<p>No se ha podido recuperar la actividad.</p>';if(preview)preview.innerHTML='<p>Actividad no disponible.</p>'}
};

const openAdminDashboard=async()=>{
  access.hidden=true;
  adminAccess.hidden=true;
  loading.hidden=true;
  adminPanel.hidden=false;
  refreshMailboxBadge();
  connectMailboxRealtime();
  const select=document.querySelector('#admin-user-list');
  if(select.closest('label')?.firstChild)select.closest('label').firstChild.nodeValue='BUSCAR DESTINATARIO';
  select.disabled=true;select.innerHTML='<option value="">Cargando destinatarios…</option>';
  const {data,error}=await supabaseClient.from('expedient_profiles').select('id,email,display_name,is_active').order('email');
  if(error){select.innerHTML='<option value="">No se pudo cargar el directorio</option>';console.error(error);return}
  let profiles=data.filter(profile=>profile.id!==currentUser.id);
  select.disabled=false;
  select.innerHTML='<option value="">Selecciona un destinatario</option>'+profiles.map(profile=>`<option value="${profile.id}">${profile.display_name||profile.email} · ${profile.email}</option>`).join('');
  const loadSelectedAdminUser=async refreshing=>{
    const userId=select.value;
    const requestedTab=refreshing?document.querySelector('#admin-editor [data-editor-tab].active')?.dataset.editorTab||'summary':'summary';
    adminUserRefreshButton.disabled=!userId;
    if(!userId){document.querySelector('#admin-editor').hidden=true;return}
    const originalLabel=adminUserRefreshButton.textContent;
    if(refreshing){adminUserRefreshButton.disabled=true;adminUserRefreshButton.textContent='Actualizando…'}
    try{
      const [{data:profile,error:profileError},{data:progress,error:progressError}]=await Promise.all([
        supabaseClient.from('expedient_profiles').select('id,email,display_name,is_active').eq('id',userId).maybeSingle(),
        supabaseClient.from('expedient_progress').select('state').eq('user_id',userId).maybeSingle()
      ]);
      if(profileError)throw profileError;if(progressError)throw progressError;if(!profile)throw new Error('El destinatario ya no está disponible.');
      profiles=profiles.map(item=>item.id===profile.id?profile:item);
      const option=select.querySelector(`option[value="${profile.id}"]`);if(option)option.textContent=`${profile.display_name||profile.email} · ${profile.email}`;
      renderAdminEditor(profile,progress?.state,requestedTab);
      if(refreshing)adminUserRefreshButton.textContent='Actualizado ✓';
    }catch(error){console.error(error);if(refreshing)adminUserRefreshButton.textContent='Error al actualizar'}finally{
      adminUserRefreshButton.disabled=false;
      if(refreshing)setTimeout(()=>{adminUserRefreshButton.textContent=originalLabel},1300);
    }
  };
  select.onchange=()=>loadSelectedAdminUser(false);
  adminUserRefreshButton.onclick=()=>loadSelectedAdminUser(true);
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
      if(getState().legalAccepted){gate.hidden=true;dash.hidden=false;render();maybeStartExpedientTour()}
      else{gate.hidden=false;dash.hidden=true}
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
