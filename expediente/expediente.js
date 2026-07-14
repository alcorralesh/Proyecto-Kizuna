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
const localState=()=>({read:JSON.parse(localStorage.getItem('kizuna-read')||'[]'),mailRead:Number(localStorage.getItem('kizuna-mail-read')||0),finalFileSeen:localStorage.getItem('kizuna-final-file-seen')==='true',completed:localStorage.getItem('kizuna-complete')==='true',comicReadPages:JSON.parse(localStorage.getItem('kizuna-comic-read-pages')||'[]')});
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
const patchState=changes=>{if(remoteState){remoteState={...remoteState,...changes};persistRemote();return}const state={...localState(),...changes};localStorage.setItem('kizuna-read',JSON.stringify(state.read));localStorage.setItem('kizuna-mail-read',String(state.mailRead));localStorage.setItem('kizuna-final-file-seen',String(state.finalFileSeen));localStorage.setItem('kizuna-complete',String(state.completed));localStorage.setItem('kizuna-comic-read-pages',JSON.stringify(state.comicReadPages||[]))};
const save=items=>patchState({read:items});
const getSupabase=async()=>{if(supabaseClient)return supabaseClient;if(!window.supabase){if(!supabaseScript){supabaseScript=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';script.onload=resolve;script.onerror=reject;document.head.appendChild(script)})}await supabaseScript}supabaseClient=window.supabase.createClient(supabaseUrl,supabaseKey);return supabaseClient};
const loadRemoteProgress=async user=>{currentUser=user;const client=await getSupabase();const [{data,error},{data:profile,error:profileError}]=await Promise.all([client.from('expedient_progress').select('state').eq('user_id',user.id).maybeSingle(),client.from('expedient_profiles').select('display_name,email,is_active').eq('id',user.id).maybeSingle()]);if(error)throw error;if(profileError)console.warn('No se pudo leer el nombre del perfil.',profileError);if(profile?.is_active===false){await client.auth.signOut();throw new Error('Este acceso ha sido desactivado por la División de Archivos Temporales.')}currentDisplayName=profile?.display_name||user.user_metadata?.display_name||user.email?.split('@')[0]||'Destinatario autorizado';updateRecipientName();if(data?.state){remoteState={read:[],mailRead:0,finalFileSeen:false,completed:false,comicReadPages:[],...data.state};return}remoteState=localState();await persistRemote()};
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
    const done=read(),reviewed=progressKeys.filter(id=>done.includes(id)).length;
    const integrity=Math.round(reviewed/progressKeys.length*100);
    const ktbReviewed=done.filter(id=>id.startsWith('KTB-'));
    const lastDocument=ktbReviewed.at(-1)||'Sin documentos confirmados';
    access.hidden=true;
    loading.hidden=false;
    const log=document.querySelector('#auth-log');
    log.innerHTML=`<p>Comprobando expediente…</p><div style="height:8px;background:#d3c8b4"><i id="auth-progress" style="display:block;width:0;height:100%;background:#7e1b19;transition:width 1.3s ease"></i></div><p>Registros confirmados: <strong>${reviewed} de ${progressKeys.length}</strong></p><p>Última consulta: <strong>${lastDocument}</strong></p><p>Integridad documental: <strong>${integrity} %</strong></p>`;
    setTimeout(()=>document.querySelector('#auth-progress').style.width=`${integrity}%`,80);
    setTimeout(()=>{loading.hidden=true;dash.hidden=false;render()},2300);
  };
  mark.onclick=async()=>{
    const done=read(),alreadyRead=done.includes(active);
    if(!alreadyRead){done.push(active);save(done)}
    if(!alreadyRead&&active.startsWith('AR'))await recordActivity('document_confirmed',active,{source:'recovered_file'});
    if(active.startsWith('AR03-')){if(ar03Complete())openAr03();else if(active==='AR03-CARTA')openAr03Mosaic('temples');else openAr03Mosaic(active.startsWith('AR03-C-')?'cities':'temples');return}
    const parent=fileFolder(active);
    if(parent){openFolder(parent);return}
    if(active.startsWith('KTB-')){
      if(alreadyRead){viewer.close();render();return}
      const id=active;
      await recordActivity('document_confirmed',id,{source:'recipient_consultation'});
      syncKtb(id,()=>{if(id==='KTB-014'){localStorage.setItem('kizuna-complete','true');startFinale()}else{viewer.close();render()}});
      return;
    }
    viewer.close();render();
  };
},0);
const progressKeys=[...Array.from({length:14},(_,i)=>`KTB-${String(i+1).padStart(3,'0')}`),...Object.values(folders).flatMap(folder=>folder.files.map(file=>file.id)),'AR03-CARTA',...ar03Cities.map((_,i)=>`AR03-C-${i}`),...ar03Temples.map((_,i)=>`AR03-T-${i}`),...ar01Tickets.map(ticket=>ticket.id),'AR06-PROTOCOL'];
const name=id=>isFolder(id)?`Carpeta ${id} · ${folderDetails[id][0]}`:`Expediente ${id}`;const gate=document.querySelector('#gate'),access=document.querySelector('#access'),loading=document.querySelector('#auth-loading'),dash=document.querySelector('#dashboard'),message=document.querySelector('#access-message'),viewer=document.querySelector('#viewer'),mark=document.querySelector('#mark-read'),next=document.querySelector('#next-doc');let active='';
const imageToolsStyle=document.createElement('style');imageToolsStyle.textContent=`.image-inspector{position:relative;max-height:64vh;overflow:auto;background:#1b211f;border:1px solid #8b887d;cursor:grab;touch-action:pan-x pan-y}.image-inspector:active{cursor:grabbing}.image-inspector img{max-width:none!important;margin:0!important}.image-tools{display:flex;align-items:center;gap:6px;margin:10px 0 20px}.image-tools button{border:1px solid #7e1b19;background:#f7edda;color:#7e1b19;padding:7px 9px;font:10px var(--mono);cursor:pointer}.image-tools button:hover{background:#7e1b19;color:#fff}.image-inspector:fullscreen{max-height:none;width:100%;height:100%;padding:20px;background:#171d1b;display:flex;align-items:center;justify-content:center}.image-inspector:fullscreen img{max-height:100%;width:auto!important;height:auto}@media(max-width:700px){.image-inspector{max-height:58vh}.image-tools{flex-wrap:wrap}}`;document.head.appendChild(imageToolsStyle);
const enhanceDocumentImages=()=>{document.querySelectorAll('#doc-body > img:not([data-inspected])').forEach(img=>{img.dataset.inspected='true';let scale=1;const frame=document.createElement('div'),tools=document.createElement('div');frame.className='image-inspector';tools.className='image-tools';img.replaceWith(frame);frame.appendChild(img);img.style.width='100%';img.style.height='auto';img.style.display='block';tools.innerHTML='<button type="button" data-action="out">−</button><button type="button" data-action="fit">Ajustar · 100 %</button><button type="button" data-action="in">+</button><button type="button" data-action="full">Pantalla completa</button><span style="margin-left:auto;font:9px var(--mono);color:#7e1b19">Arrastra para recorrer</span>';frame.after(tools);const update=()=>{img.style.width=`${scale*100}%`;tools.querySelector('[data-action="fit"]').textContent=`Ajustar · ${Math.round(scale*100)} %`};tools.onclick=event=>{const action=event.target.dataset.action;if(!action)return;if(action==='in'){scale=Math.min(3,scale+.25);update()}if(action==='out'){scale=Math.max(1,scale-.25);update()}if(action==='fit'){scale=1;update();frame.scrollTo({left:0,top:0,behavior:'smooth'})}if(action==='full'){if(document.fullscreenElement)document.exitFullscreen();else frame.requestFullscreen?.()}};let dragging=false,startX=0,startY=0,scrollX=0,scrollY=0;frame.addEventListener('pointerdown',event=>{if(scale===1)return;dragging=true;startX=event.clientX;startY=event.clientY;scrollX=frame.scrollLeft;scrollY=frame.scrollTop;frame.setPointerCapture(event.pointerId)});frame.addEventListener('pointermove',event=>{if(!dragging)return;frame.scrollLeft=scrollX-(event.clientX-startX);frame.scrollTop=scrollY-(event.clientY-startY)});frame.addEventListener('pointerup',()=>dragging=false);frame.addEventListener('pointercancel',()=>dragging=false);frame.addEventListener('wheel',event=>{if(!event.ctrlKey)return;event.preventDefault();scale=Math.min(3,Math.max(1,scale+(event.deltaY<0?.15:-.15)));update()},{passive:false})})};
const documentImageObserver=new MutationObserver(()=>enhanceDocumentImages());documentImageObserver.observe(document.querySelector('#doc-body'),{childList:true});document.addEventListener('keydown',event=>{if(!viewer.open)return;if(event.key==='ArrowLeft'){const previous=document.querySelector('#comic-prev');if(previous&&!previous.disabled){event.preventDefault();previous.click()}}if(event.key==='ArrowRight'){const nextPage=document.querySelector('#comic-next');if(nextPage&&!nextPage.disabled){event.preventDefault();nextPage.click()}}});
const allowed=id=>{const index=sequence.indexOf(id);return index===0||read().includes(sequence[index-1])};const roman=value=>{const table=[[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let result='';for(const [number,symbol] of table){while(value>=number){result+=symbol;value-=number}}return result};
const mailboxButton=document.createElement('button'),mailbox=document.createElement('aside');mailboxButton.id='mailbox-toggle';mailboxButton.type='button';mailboxButton.textContent='Buzón';mailboxButton.style.cssText='border:1px solid #7e1b19;background:#f6f0e2;color:#7e1b19;padding:10px;font:9px var(--mono);cursor:pointer';mailbox.id='mailbox';mailbox.style.cssText='display:none;position:fixed;right:5vw;top:82px;z-index:30;width:min(450px,calc(100vw - 32px));max-height:72vh;overflow:auto;background:#f6f0e2;color:#202726;border:1px solid #8b887d;box-shadow:12px 14px 30px #0004;padding:22px';document.querySelector('.header-actions')?.prepend(mailboxButton);dash.appendChild(mailbox);
const mailboxMessages=()=>{const done=read(),items=[];for(let i=1;i<=14;i++){const id=`KTB-${String(i).padStart(3,'0')}`;if(!done.includes(id))continue;items.push({id:id,subject:`Lectura confirmada · ${id}`,body:`La consulta del documento ${id} ha sido registrada correctamente. La secuencia autorizada ha sido actualizada.`,order:i})}if(done.includes('KTB-003'))items.push({id:'AC-01',subject:'Archivo complementario localizado',body:'Durante la reconstrucción del expediente se ha localizado el Archivo Complementario AC-01. Su contenido permanece en proceso de clasificación.',order:3.2});if(done.includes('KTB-006'))items.push({id:'AR-01',subject:'Acceso a Archivo Recuperado 01',body:'La documentación operativa ha quedado disponible para su consulta conforme al protocolo de custodia.',order:6.2});if(done.includes('KTB-011'))items.push({id:'AR-06',subject:'Acceso a datos recuperados',body:'Se ha autorizado la consulta de los datos recuperados del dispositivo asociado al expediente.',order:11.2});if(done.includes('KTB-014'))items.push({id:'KTB-014-FINAL',subject:'Expediente archivado',body:'La consulta ha finalizado. El expediente PROJECT JAPAN ha sido archivado con integridad documental preservada.',order:14.2});if(done.includes('AR01-BILLETES'))items.push({id:'AR01-BILLETES',subject:'Registros de transporte verificados',body:'Todos los billetes recuperados de AR-01 han sido confirmados y archivados.',order:6.5});if(ar03Complete())items.push({id:'AR03',subject:'Registros geográficos completados',body:'Las guías de ciudades y las entradas de templos han sido incorporadas al expediente.',order:8.5});if(done.includes('KTB-014'))items.push({id:'FINAL-01',subject:'ATENCIÓN · Archivo localizado',body:'Se ha localizado un archivo durante la verificación final del expediente. Clasificación: No catalogado. Estado: Pendiente de revisión.',order:100,urgent:true});return items.sort((a,b)=>b.order-a.order)};
const renderMailbox=()=>{const items=mailboxMessages(),seen=Number(localStorage.getItem('kizuna-mail-read')||0),unread=Math.max(0,items.length-seen);mailboxButton.textContent=`Buzón${unread?` · ${unread}`:''}`;mailbox.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #b4ae9f;padding-bottom:14px"><div><p style="margin:0;color:#7e1b19;font:10px var(--mono);letter-spacing:.1em">SISTEMA DE NOTIFICACIONES</p><h3 style="margin:6px 0 0;font:31px var(--serif)">Buzón del expediente</h3></div><button id="mailbox-close" style="border:0;background:none;font:25px var(--serif);color:#7e1b19;cursor:pointer">×</button></div><p style="font:10px/1.6 var(--mono)">${items.length} comunicaciones registradas · más recientes primero</p>${items.map((item,index)=>`<details style="border-top:1px solid ${item.urgent?'#7e1b19':'#c5bdaa'};padding:13px 0;${item.urgent?'background:#f4dfd5;margin:0 -10px;padding:15px 10px;border-left:4px solid #7e1b19':''}"><summary style="cursor:pointer;list-style:none;font:600 13px var(--serif)"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${item.urgent||index<unread?'#7e1b19':'#9a998f'};margin-right:8px"></span>${item.subject}<small style="display:block;margin:5px 0 0 16px;font:9px var(--mono);color:#7e1b19">DIVISIÓN DE ARCHIVOS TEMPORALES · ${item.id}</small></summary><p style="margin:12px 0 0 16px;font:12px/1.65 var(--mono)">${item.body}</p>${item.id==='FINAL-01'?'<button id="final-file-from-mail" style="margin:10px 0 0 16px;background:#7e1b19;color:#fff;border:0;padding:10px 13px;font:9px var(--mono);cursor:pointer">Consultar archivo</button>':''}</details>`).join('')||'<p>No hay comunicaciones registradas.</p>'}`;document.querySelector('#mailbox-close').onclick=()=>mailbox.style.display='none';const finalButton=document.querySelector('#final-file-from-mail');if(finalButton)finalButton.onclick=async()=>{mailbox.style.display='none';await markFinalFileConsulted('mailbox');openFinalLocatedFile()}};
mailboxButton.onclick=()=>{const opening=mailbox.style.display==='none';if(opening){renderMailbox();mailbox.style.display='block';localStorage.setItem('kizuna-mail-read',mailboxMessages().length);renderMailbox();updateMailboxIndicator()}else mailbox.style.display='none'};
const updateMailboxIndicator=()=>{const unread=Math.max(0,mailboxMessages().length-Number(localStorage.getItem('kizuna-mail-read')||0));mailboxButton.textContent=`Buzón${unread?` · ${unread} nuevo${unread===1?'':'s'}`:''}`;mailboxButton.style.background=unread?'#7e1b19':'#f6f0e2';mailboxButton.style.color=unread?'#fff':'#7e1b19';mailboxButton.style.boxShadow=unread?'0 0 0 4px #7e1b1930':'none'};
const privateStyle=document.createElement('style');privateStyle.textContent=`.dashboard>header{position:sticky;top:0;z-index:40;padding:12px 5vw;background:#f6f0e2!important;isolation:isolate;box-shadow:0 1px 0 #b4ae9f}.dashboard>header .access-brand img{width:52px;height:52px}.case-head{position:sticky;top:76px;z-index:30;padding:28px 10vw!important;min-height:164px;align-items:center;background:#e6dac2!important;isolation:isolate;box-shadow:0 8px 16px #8f80661c}.case-head h1{font-size:54px}.case-head .system-line{margin:0 0 10px}.case-head .case-id{margin:9px 0 0;font-size:9px}.case-head dl{gap:32px}.case-list{position:relative;z-index:1;padding-top:42px}.header-actions{display:flex;align-items:center;gap:18px}.header-actions .sync-clock{margin:0}@media(max-width:750px){.case-head{top:76px;padding:22px 7vw!important;min-height:0}.case-head h1{font-size:44px}.case-head dl{margin-top:22px}.header-actions{gap:8px}.sync-clock{display:none!important}}`;document.head.appendChild(privateStyle);setInterval(()=>{if(!dash.hidden)updateMailboxIndicator()},600);updateMailboxIndicator();
function openFinalLocatedFile(){active='FINAL-01';next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES / VERIFICACIÓN FINAL';document.querySelector('#doc-title').textContent='Archivo localizado';document.querySelector('#doc-body').innerHTML=`<p style="color:#7e1b19;letter-spacing:.1em;font-size:12px"><strong>ARCHIVO NO CATALOGADO · USO INTERNO</strong></p><p>Se ha localizado un archivo durante la verificación final del expediente.</p><p><strong>Clasificación:</strong> No catalogado<br><strong>Estado:</strong> Pendiente de revisión</p><img src="../assets/documents/FINAL-01-email-interno.png" alt="Correo interno recuperado de José" style="display:block;width:100%;height:auto;border:1px solid #8b887d;margin-top:24px"><button id="final-file-close" style="margin-top:22px">Volver al expediente</button>`;if(!viewer.open)viewer.showModal();document.querySelector('#final-file-close').onclick=()=>viewer.close()}
function showFinalFileAlert(){if(!read().includes('KTB-014')||localStorage.getItem('kizuna-final-file-seen')||viewer.open||document.querySelector('#final-file-alert'))return;const alert=document.createElement('section');alert.id='final-file-alert';alert.style.cssText='position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:#17211ddd;color:#f6f0e2';alert.innerHTML='<div style="width:min(530px,88vw);padding:46px;background:#efe4cf;color:#202726;border:2px solid #7e1b19;box-shadow:14px 16px 0 #0005"><p style="margin:0 0 18px;color:#7e1b19;font:10px var(--mono);letter-spacing:.12em">ATENCIÓN REQUERIDA · VERIFICACIÓN FINAL</p><h2 style="font:600 47px/.92 var(--serif);margin:0">Se ha localizado<br>un <em style="color:#7e1b19">archivo.</em></h2><p style="font:14px/1.7 var(--mono);margin:28px 0">Durante la verificación final del expediente se ha detectado un registro no catalogado.</p><p style="font:11px/1.8 var(--mono)">CLASIFICACIÓN: NO CATALOGADO<br>ESTADO: PENDIENTE DE REVISIÓN</p><button id="final-file-alert-open" style="margin-top:22px;background:#7e1b19;color:#fff;border:0;padding:15px 18px;font:10px var(--mono);cursor:pointer">Consultar archivo →</button></div>';document.body.appendChild(alert);document.querySelector('#final-file-alert-open').onclick=()=>{alert.remove();localStorage.setItem('kizuna-final-file-seen','true');openFinalLocatedFile()}}
function openDashboard(){access.hidden=true;loading.hidden=false;const log=document.querySelector('#auth-log');log.innerHTML='<p>Comprobando expediente…</p><div style="height:8px;background:#d3c8b4"><i id="auth-progress" style="display:block;width:0;height:100%;background:#7e1b19;transition:width 1.7s ease"></i></div><p>Sincronizando registros…</p><p>Integridad documental: <strong>100 %</strong></p>';setTimeout(()=>document.querySelector('#auth-progress').style.width='100%',80);setTimeout(()=>{loading.hidden=true;dash.hidden=false;render()},2100)}
function updateCompletionHeader(done){const head=document.querySelector('.case-head'),old=document.querySelector('#completion-record');if(old)old.remove();if(!done.includes('KTB-014')){head.style.setProperty('padding-bottom','28px','important');head.style.minHeight='164px';return}head.style.position='relative';head.style.setProperty('padding-bottom','155px','important');head.style.minHeight='320px';const record=document.createElement('section');record.id='completion-record';record.style.cssText='position:absolute;left:10vw;right:10vw;bottom:32px;border-top:1px solid #9b8870;padding-top:18px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:14px 20px;color:#7e1b19;font:10px/1.8 "DM Mono",monospace;letter-spacing:.03em';record.innerHTML=`<span>PROJECT JAPAN<br><strong style="font-size:12px">✔ FINALIZADO · EXPEDIENTE ARCHIVADO</strong></span><span>DESTINATARIO<br><strong style="font-size:12px">JOSÉ CUADRADO</strong></span><span>FECHA DE ARCHIVO<br><strong style="font-size:12px">${new Date().toLocaleDateString('es-ES')}</strong></span><span>INTEGRIDAD<br><strong style="font-size:12px">100 %</strong></span>`;head.appendChild(record)}
function render(){const done=read(),visible=sequence.filter(id=>!nestedKtb.has(id)),completed=progressKeys.filter(id=>done.includes(id)).length,integrity=Math.round(completed/progressKeys.length*100),ktbRead=done.filter(id=>id.startsWith('KTB-')).length,level=Math.max(1,ktbRead-5),comicPages=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`).filter(id=>done.includes(id)).length,supplementary=done.includes('KTB-003')?`<article class="document complementary"><span class="doc-no">○ AC-01</span><h3>ARCHIVO COMPLEMENTARIO<br>AC-01</h3><p><strong>Estado:</strong> Recuperado<br><strong>Tipo:</strong> Registro ilustrado<br><strong>Origen:</strong> No catalogado<br><strong>Relación:</strong> Pendiente de clasificación<br><strong>Páginas recuperadas:</strong> ${comicPages} / 11</p><button data-id="AC-01">CONSULTAR</button></article>`:'';document.querySelector('#integrity').textContent=`${integrity} %`;document.querySelector('#integrity-fill').style.width=`${integrity}%`;document.querySelector('#authorization').textContent=`Nivel ${roman(level)}`;document.querySelector('#case-status').textContent=done.includes('KTB-014')?'Expediente completado':'En proceso';updateCompletionHeader(done);document.querySelector('#documents').innerHTML=visible.map(id=>{const ok=allowed(id),seen=done.includes(id),label=isFolder(id)?'Abrir carpeta':'Abrir documento';return `<article class="document ${ok?'':'locked'}"><span class="doc-no">${seen?'✓ ':ok?'○ ':'⌕ '}${id}</span><h3>${name(id)}</h3><p>${seen?'LECTURA CONFIRMADA':ok?'DISPONIBLE PARA CONSULTA':'AUTORIZACIÓN PENDIENTE'}</p><button data-id="${id}" ${ok?'':'disabled'}>${ok?label:'Acceso restringido'}</button></article>`}).join('')+supplementary;document.querySelectorAll('.document button:not([disabled])').forEach(button=>button.onclick=()=>openDoc(button.dataset.id))}
function textFor(id){if(id==='AC-01')return ['Archivo complementario AC-01','Estado: Recuperado. Tipo: Registro ilustrado. Origen: No catalogado.','La relación de este registro con la expedición permanece pendiente de clasificación.'];if(id==='KTB-014')return ['Cierre de expediente','La secuencia ha sido completada. Los recuerdos han sido preservados y la línea temporal mantiene una integridad del 100 %.','No se requieren más intervenciones.'];if(isFolder(id))return [`${id} · ${folderDetails[id][0]}`,folderDetails[id][1],'Archivo recuperado parcialmente. El contenido debe consultarse respetando el orden de la secuencia temporal.'];return [`Expediente ${id}`,'Registro validado por la División de Archivos Temporales. Este documento forma parte de una secuencia personal de continuidad.','La lectura atenta de cada página ayuda a que las historias importantes sucedan exactamente como deben.']}
function openFolder(folderId){active=folderId;next.style.display='none';document.querySelector('#doc-type').textContent='CARPETA DE ARCHIVOS RECUPERADOS / ACCESO AUTORIZADO';document.querySelector('#doc-title').textContent=`${folderId} · ${folders[folderId].title}`;const done=read(),files=folders[folderId].files;const list=files.map((file,index)=>{const unlocked=index===0||done.includes(files[index-1].id),seen=done.includes(file.id);return `<p><button class="folder-file" data-file="${file.id}" ${unlocked?'':'disabled'}>${seen?'✓ ':unlocked?'→ ':'⌕ '}${file.title}</button></p>`}).join('');const complete=files.every(file=>done.includes(file.id)),update=folders[folderId].update;document.querySelector('#doc-body').innerHTML=`<p>Documentos internos recuperados. Deben leerse en el orden indicado.</p>${list}${complete?`<p><button id="folder-update">Abrir ${update} · Actualización del expediente</button></p>`:`<p><em>La actualización permanecerá sellada hasta completar la carpeta.</em></p>`}`;mark.style.display='none';if(!viewer.open)viewer.showModal();document.querySelectorAll('.folder-file:not([disabled])').forEach(button=>button.onclick=()=>openFolderFile(folderId,button.dataset.file));const updateButton=document.querySelector('#folder-update');if(updateButton)updateButton.onclick=()=>openDoc(update)}
function openFolderFile(folderId,fileId){const file=folders[folderId].files.find(item=>item.id===fileId);active=fileId;next.style.display='none';mark.style.display='inline-block';mark.textContent=read().includes(fileId)?'Lectura confirmada':'Confirmar lectura';document.querySelector('#doc-type').textContent=`${folderId} / DOCUMENTO INTERNO`;document.querySelector('#doc-title').textContent=file.title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="../assets/documents/${folderId}/${file.src}" alt="${file.title}">`}
function openFolderFile(folderId,fileId){const file=folders[folderId].files.find(item=>item.id===fileId);if(file.mosaic==='tickets'){openTicketMosaic();return}active=fileId;next.style.display='none';mark.style.display='inline-block';mark.textContent=read().includes(fileId)?'Lectura confirmada':'Confirmar lectura';document.querySelector('#doc-type').textContent=`${folderId} / DOCUMENTO INTERNO`;document.querySelector('#doc-title').textContent=file.title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="../assets/documents/${folderId}/${file.src}" alt="${file.title}">`}
function openTicketMosaic(){active='AR01-BILLETES';next.style.display='none';mark.style.display='none';const done=read(),seen=ar01Tickets.filter(ticket=>done.includes(ticket.id)).length,complete=seen===ar01Tickets.length;document.querySelector('#doc-type').textContent='AR-01 / BILLETES DE TRANSPORTE';document.querySelector('#doc-title').textContent='Billetes recuperados';document.querySelector('#doc-body').innerHTML=`<p>Registros de transporte recuperados · ${seen}/${ar01Tickets.length} consultados.</p><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">${ar01Tickets.map(ticket=>{const readTicket=done.includes(ticket.id);return `<button class="ticket-card" data-ticket="${ticket.id}" style="position:relative;border:2px solid ${readTicket?'#6b863e':'#9b8d78'};background:#f7efdf;padding:7px;text-align:left"><img src="../assets/documents/AR-01/Billetes/${ticket.src}" alt="${ticket.title}" style="display:block;width:100%;height:130px;object-fit:cover;object-position:center;opacity:${readTicket?'.72':'1'}"><span style="position:absolute;right:6px;top:6px;background:${readTicket?'#355d37':'#7e1b19'};color:#fff;padding:4px 6px;font:9px monospace">${readTicket?'✓ LEÍDO':'BILLETE'}</span><span style="display:block;margin-top:7px;font:11px var(--mono)">${ticket.title}</span></button>`}).join('')}</div><p style="margin-top:22px"><button id="ticket-confirm-all">Confirmar lectura de todos los billetes</button> <button id="ticket-back">← Volver a AR-01</button></p>${complete?'<p><strong>Billetes de transporte verificados.</strong></p>':''}`;if(!viewer.open)viewer.showModal();document.querySelectorAll('.ticket-card').forEach(button=>button.onclick=()=>{const ticket=ar01Tickets.find(item=>item.id===button.dataset.ticket);openTicketItem(ticket)});document.querySelector('#ticket-confirm-all').onclick=async()=>{const records=read(),newIds=ar01Tickets.filter(ticket=>!records.includes(ticket.id)).map(ticket=>ticket.id);newIds.forEach(id=>records.push(id));if(!records.includes('AR01-BILLETES'))records.push('AR01-BILLETES');save(records);await Promise.all(newIds.map(id=>recordActivity('document_confirmed',id,{source:'recovered_file_bulk'})));openFolder('AR-01')};document.querySelector('#ticket-back').onclick=()=>openFolder('AR-01')}
function openTicketItem(ticket){active=ticket.id;next.style.display='none';mark.style.display='inline-block';mark.textContent=read().includes(ticket.id)?'Lectura confirmada':'Confirmar lectura';mark.dataset.returnTo='tickets';document.querySelector('#doc-type').textContent='AR-01 / BILLETE RECUPERADO';document.querySelector('#doc-title').textContent=ticket.title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="../assets/documents/AR-01/Billetes/${ticket.src}" alt="${ticket.title}">`;if(!viewer.open)viewer.showModal()}
function ar03Complete(){const keys=['AR03-CARTA',...ar03Cities.map((_,i)=>`AR03-C-${i}`),...ar03Temples.map((_,i)=>`AR03-T-${i}`)];return keys.every(key=>read().includes(key))}
function openAr03(){active='AR-03';next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='AR-03 / REGISTROS GEOGRÁFICOS';document.querySelector('#doc-title').textContent='Archivo Recuperado 03';const done=read(),citiesDone=ar03Cities.filter((_,i)=>done.includes(`AR03-C-${i}`)).length,templesDone=ar03Temples.filter((_,i)=>done.includes(`AR03-T-${i}`)).length,letterDone=done.includes('AR03-CARTA'),ready=ar03Complete();document.querySelector('#doc-body').innerHTML=`<p>Seleccione una subcarpeta para consultar sus registros.</p><p><button id="ar03-cities">Guías de ciudades · ${citiesDone}/${ar03Cities.length}</button></p><p><button id="ar03-temples">Entradas de templos · ${letterDone?'Carta ✓ · ':''}${templesDone}/${ar03Temples.length}</button></p>${ready?'<p><button id="ar03-update">Abrir KTB-009 · Actualización del expediente</button></p>':'<p><em>KTB-009 permanecerá sellado hasta consultar todos los registros.</em></p>'}`;if(!viewer.open)viewer.showModal();document.querySelector('#ar03-cities').onclick=()=>openAr03Mosaic('cities');document.querySelector('#ar03-temples').onclick=()=>{if(!read().includes('AR03-CARTA'))openAr03Item('AR03-CARTA','Carta de presentación','../assets/documents/AR-03/Templos/000-Carta.png');else openAr03Mosaic('temples')};const update=document.querySelector('#ar03-update');if(update)update.onclick=()=>openDoc('KTB-009')}
function openAr03Mosaic(type){active=`AR03-${type}`;next.style.display='none';mark.style.display='none';const items=type==='cities'?ar03Cities:ar03Temples,key=type==='cities'?'C':'T',folder=type==='cities'?'Ciudades':'Templos',done=read(),count=items.filter((_,i)=>done.includes(`AR03-${key}-${i}`)).length;document.querySelector('#doc-type').textContent=`AR-03 / ARCHIVO VISUAL · ${count}/${items.length} CONSULTADOS`;document.querySelector('#doc-title').textContent=type==='cities'?'Guías de ciudades':'Entradas de templos';const cards=items.map((file,index)=>{const seen=done.includes(`AR03-${key}-${index}`);return `<button class="ar03-card" data-file="${file}" data-index="${index}" style="position:relative;padding:0;border:2px solid ${seen?'#6b863e':'#9b8d78'};background:#f5ead5;cursor:pointer"><img style="display:block;width:100%;height:120px;object-fit:cover;opacity:${seen?'.72':'1'}" src="../assets/documents/AR-03/${folder}/${file}" alt="${file}"><span style="position:absolute;right:6px;top:6px;background:${seen?'#355d37':'#7e1b19'};color:#fff;padding:4px 6px;font:9px monospace">${seen?'✓ LEÍDO':`${String(index+1).padStart(2,'0')}`}</span></button>`}).join('');document.querySelector('#doc-body').innerHTML=`<p><strong>${count} de ${items.length} registros confirmados.</strong></p><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">${cards}</div><p><button id="ar03-confirm-all">Confirmar lectura de todas las fichas</button> <button id="ar03-back">← Volver a AR-03</button></p>`;document.querySelectorAll('.ar03-card').forEach(button=>button.onclick=()=>openAr03Item(`AR03-${key}-${button.dataset.index}`,button.dataset.file,`../assets/documents/AR-03/${folder}/${button.dataset.file}`,type));document.querySelector('#ar03-confirm-all').onclick=async()=>{const records=read(),newIds=[];items.forEach((_,index)=>{const record=`AR03-${key}-${index}`;if(!records.includes(record)){records.push(record);newIds.push(record)}});save(records);await Promise.all(newIds.map(id=>recordActivity('document_confirmed',id,{source:'recovered_file_bulk'})));openAr03()};document.querySelector('#ar03-back').onclick=openAr03}
function openAr03Item(id,title,src,type){active=id;next.style.display='none';mark.style.display='inline-block';mark.textContent=read().includes(id)?'Lectura confirmada':'Confirmar lectura';document.querySelector('#doc-type').textContent='AR-03 / REGISTRO AMPLIADO';document.querySelector('#doc-title').textContent=title;document.querySelector('#doc-body').innerHTML=`<img style="display:block;width:100%;height:auto" src="${src}" alt="${title}">`;mark.dataset.returnTo=type||'temples'}
function openAr06Protocol(){active='AR06-PROTOCOL';next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES / PROTOCOLO 06';document.querySelector('#doc-title').textContent='Autorización de acceso';document.querySelector('#doc-body').innerHTML=`<p><strong>Advertencia al destinatario autorizado</strong></p><p>Los archivos que va a consultar no forman parte de la documentación preparada originalmente para la expedición. Corresponden a una extracción parcial realizada sobre un dispositivo móvil asociado al destinatario.</p><p>Estos registros pueden presentar errores, fragmentos incompletos o alteraciones derivadas del proceso de recuperación. La División recomienda consultar los documentos en el orden establecido.</p><p>Se ha verificado que ha completado la lectura de:</p><p>✓ KTB-001<br>✓ KTB-002<br>✓ KTB-003<br>✓ KTB-004<br>✓ KTB-005</p><p><strong>Acceso autorizado al Archivo Recuperado 06.</strong><br>Integridad estimada del conjunto: <strong>68 %</strong></p><label style="display:block;margin:24px 0"><input id="ar06-confirm" type="checkbox"> Confirmo que deseo continuar.</label><button id="ar06-start" disabled>Acceder a los archivos recuperados</button><p style="font-size:10px;opacity:.7;margin-top:32px">Una vez iniciado el análisis de los archivos recuperados, no será posible volver al estado anterior del expediente.</p>`;if(!viewer.open)viewer.showModal();const checkbox=document.querySelector('#ar06-confirm'),start=document.querySelector('#ar06-start');checkbox.onchange=()=>start.disabled=!checkbox.checked;start.onclick=()=>startAr06Recovery()}
function startAr06Recovery(){document.querySelector('#doc-title').textContent='Recuperando archivos…';document.querySelector('#doc-body').innerHTML='<p id="recovery-log">Verificando autorización…</p>';const lines=['✔ Nivel de acceso IV validado','Localizando dispositivo…','Recuperando archivos…','Reconstruyendo metadatos…','Integridad del conjunto: 68 %','Acceso concedido.'];let index=0;const timer=setInterval(()=>{const log=document.querySelector('#recovery-log');log.innerHTML+=`<br>${lines[index++]}`;if(index===lines.length){clearInterval(timer);setTimeout(()=>{const done=read();if(!done.includes('AR06-PROTOCOL')){done.push('AR06-PROTOCOL');save(done);void recordActivity('document_confirmed','AR06-PROTOCOL',{source:'recovered_file_protocol'})}openFolder('AR-06')},500)}},420)}
function recoveryScreen(id){active=id;next.style.display='none';mark.style.display='none';document.querySelector('.stamp').style.display='none';document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES';document.querySelector('#doc-title').textContent='Recuperando documento…';const integrity=Math.floor(Math.random()*101);const bar=(label,id)=>`<p style="margin:25px 0 8px">${label} <strong id="${id}-value">0 %</strong></p><div style="height:9px;background:#d3c8b4;border:1px solid #8b887d"><i id="${id}" style="display:block;width:0;height:100%;background:#7e1b19;transition:width .55s ease"></i></div>`;document.querySelector('#doc-body').innerHTML=`<p style="position:absolute;top:32px;right:38px;margin:0;font-size:10px;letter-spacing:.12em;text-align:right;color:#7e1b19">SERVIDOR<br><strong>TOKYO NODE 03</strong></p><p>Solicitud de recuperación recibida…</p>${bar('Comprobando autorización…','auth-bar')}${bar('Verificando integridad del archivo…','integrity-bar')}${bar('Reconstruyendo metadatos…','metadata-bar')}<p id="recovery-ready" style="margin-top:28px"></p>`;if(!viewer.open)viewer.showModal();const setBar=(barId,value)=>{document.querySelector(`#${barId}`).style.width=`${value}%`;document.querySelector(`#${barId}-value`).textContent=`${value} %`};setTimeout(()=>setBar('auth-bar',100),120);setTimeout(()=>setBar('integrity-bar',integrity),650);setTimeout(()=>setBar('metadata-bar',100),1150);setTimeout(()=>{document.querySelector('#recovery-ready').textContent='Documento recuperado.';setTimeout(()=>{document.querySelector('#recovery-ready').innerHTML='Nivel de autorización verificado.<br><strong>Apertura autorizada.</strong>';setTimeout(()=>{document.querySelector('.stamp').style.display='block';showDoc(id)},500)},420)},1800)}
function showDoc(id){if(id==='AR-06'&&!read().includes('AR06-PROTOCOL')){openAr06Protocol();return}if(id==='AR-03'){openAr03();return}if(folders[id]){openFolder(id);return}active=id;next.style.display='inline-block';mark.style.display='inline-block';const [title,...paras]=textFor(id);document.querySelector('#doc-type').textContent=isFolder(id)?'CARPETA DE ARCHIVOS RECUPERADOS / ACCESO AUTORIZADO':'DIVISIÓN DE ARCHIVOS TEMPORALES / ACCESO AUTORIZADO';document.querySelector('#doc-title').textContent=documentImages.has(id)?'Documento recuperado':title;document.querySelector('#doc-body').innerHTML=documentImages.has(id)?`<img style="display:block;width:100%;height:auto" src="../assets/documents/${id}.png" alt="Documento ${id}">`:paras.map(text=>`<p>${text}</p>`).join('')+(id==='KTB-014'?'<p><strong>EXPEDIENTE CERRADO<br>ARCHIVADO DEFINITIVAMENTE</strong></p>':'');mark.textContent=read().includes(id)?'Lectura confirmada':isFolder(id)?'Cerrar carpeta y autorizar siguiente fase':'Confirmar lectura';if(!viewer.open)viewer.showModal()}
function openDoc(id){const paper=document.querySelector('.paper'),body=document.querySelector('#doc-body');if(id!=='AC-01'){paper.style.width='';paper.style.maxWidth='';paper.style.padding='';body.style.maxWidth='';body.style.margin=''}if(id==='AC-01'){openAcInfo();return}if(id.startsWith('KTB-')&&!read().includes(id)){recoveryScreen(id);return}showDoc(id)}
function openAcInfo(){active='AC-01';next.style.display='none';mark.style.display='none';const pages=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`).filter(id=>read().includes(id)).length;document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES';document.querySelector('#doc-title').textContent='ARCHIVO COMPLEMENTARIO AC-01';document.querySelector('#doc-body').innerHTML=`<p style="color:#7e1b19;letter-spacing:.1em;font-size:12px"><strong>REGISTRO ILUSTRADO RECUPERADO</strong></p><section style="margin:28px 0;padding:22px;border:1px solid #8b887d;background:#f6eddd"><p><strong>Clasificación:</strong> No determinada<br><strong>Integridad:</strong> <span style="color:#356a41">100 %</span><br><strong>Páginas disponibles:</strong> ${pages} / 11</p><p><strong>Observación:</strong></p><p>Durante la reconstrucción del expediente se ha localizado un documento ilustrado que no figura en el inventario original.</p><p>Su contenido parece guardar relación con el expediente, aunque su procedencia no ha podido verificarse.</p></section>${pages?'<button id="ac-open-record">Abrir registro</button>':'<p style="color:#7e1b19"><strong>Registro en reconstrucción.</strong><br>La primera página se recuperará al confirmar el siguiente documento KTB.</p>'}`;if(!viewer.open)viewer.showModal();const open=document.querySelector('#ac-open-record');if(open)open.onclick=()=>openComicViewer(1)}
function openComicViewer(page){const pages=Array.from({length:11},(_,i)=>`KTB-${String(i+4).padStart(3,'0')}`).filter(id=>read().includes(id)).length;if(!pages){openAcInfo();return}page=Math.min(Math.max(1,page),pages);active='AC-01';next.style.display='none';mark.style.display='none';const paper=document.querySelector('.paper'),body=document.querySelector('#doc-body');paper.style.width='min(1120px,calc(100% - 34px))';paper.style.maxWidth='1120px';paper.style.padding='42px';body.style.maxWidth='900px';body.style.margin='0 auto';document.querySelector('#doc-type').textContent='KIZUNA · DIVISIÓN DE ARCHIVOS TEMPORALES';document.querySelector('#doc-title').textContent='ARCHIVO COMPLEMENTARIO AC-01';document.querySelector('#doc-body').innerHTML=`<p style="margin-bottom:20px;color:#7e1b19;font-size:12px">El contenido de este archivo no ha podido situarse con precisión dentro de la línea temporal del expediente.</p><img src="../assets/documents/AC-01/Pagina-${page}.png" alt="Página ${page} del registro ilustrado" style="display:block;width:100%;height:auto;border:1px solid #8b887d"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px"><button id="comic-prev" ${page===1?'disabled':''}>← Página anterior</button><strong style="font:12px var(--mono)">PÁGINA ${page} / ${pages}<br><span style="font-size:9px;color:#7e1b19">${pages} DE 11 RECUPERADAS</span></strong><button id="comic-next" ${page===pages?'disabled':''}>Página siguiente →</button></div><button id="comic-back" style="margin-top:18px;background:#7e1b19;color:#fff;border:0;padding:14px 18px;font:11px var(--mono);cursor:pointer">Regresar al expediente</button>`;document.querySelector('#comic-prev').onclick=()=>openComicViewer(page-1);document.querySelector('#comic-next').onclick=()=>openComicViewer(page+1);document.querySelector('#comic-back').onclick=()=>{paper.style.width='';paper.style.maxWidth='';paper.style.padding='';body.style.maxWidth='';body.style.margin='';viewer.close()};if(!viewer.open)viewer.showModal()}
function syncKtb(id,onComplete){next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='DIVISIÓN DE ARCHIVOS TEMPORALES';document.querySelector('#doc-title').textContent=id==='KTB-003'?'Hallazgo asociado…':'Actualizando expediente…';if(id!=='KTB-003'){const accessNotice=id==='KTB-006'?'<p><strong>Acceso concedido · Archivo Recuperado 01.</strong></p>':id==='KTB-011'?'<p><strong>Acceso concedido · Datos recuperados del dispositivo.</strong></p>':'';document.querySelector('#doc-body').innerHTML=`<p>Sincronizando progreso…</p><p><strong>Lectura confirmada · ${id}.</strong></p><p>Expediente ${id} registrado.</p>${accessNotice}<p>Nuevo nivel de autorización concedido.</p><p id="sync-complete">Actualización completada.</p>`;setTimeout(onComplete,2100);return}document.querySelector('#doc-body').innerHTML=`<p>Sincronizando progreso…</p><p><strong>Lectura confirmada · KTB-003.</strong></p><p>Expediente KTB-003 registrado.</p><section style="margin:32px 0;padding:22px;border:2px solid #7e1b19;background:#f7edda;box-shadow:7px 7px 0 #7e1b1940"><p style="margin:0 0 13px;color:#7e1b19;font-size:11px;letter-spacing:.12em">BUSCANDO MATERIAL ASOCIADO… <strong id="ac-progress-value">0 %</strong></p><div style="height:12px;background:#d3c8b4;border:1px solid #7e1b19"><i id="ac-progress" style="display:block;width:0;height:100%;background:#7e1b19;transition:width 1.1s ease"></i></div><p id="ac-result" style="margin:18px 0 0;font-size:19px;color:#7e1b19"></p></section><p>Nuevo nivel de autorización concedido.</p><p>Actualización completada.</p>`;setTimeout(()=>{document.querySelector('#ac-progress').style.width='100%';document.querySelector('#ac-progress-value').textContent='100 %'},180);setTimeout(()=>{document.querySelector('#ac-result').innerHTML='<strong>1 archivo nuevo localizado.</strong><br><span style="font-size:12px">ARCHIVO COMPLEMENTARIO AC-01 · RECUPERADO</span>'},1350);setTimeout(onComplete,2400)}
function startFinale(){next.style.display='none';mark.style.display='none';document.querySelector('#doc-type').textContent='KIZUNA / VALIDACIÓN FINAL';document.querySelector('#doc-title').textContent='Verificando expediente…';document.querySelector('#doc-body').innerHTML='<p id="final-log">Integridad de la línea temporal<br>████████████████████<br><strong>100 %</strong></p>';const lines=['Comprobando coherencia narrativa…<br>✔ Sin incidencias','Comprobando integridad documental…<br>✔ Sin incidencias','Validando secuencia temporal…<br>✔ Confirmada','Archivando expediente…','<strong style="font-size:28px;color:#7e1b19">EXPEDIENTE CERRADO</strong>'];let i=0;const timer=setInterval(()=>{document.querySelector('#final-log').innerHTML+=`<br><br>${lines[i++]}`;if(i===lines.length){clearInterval(timer);setTimeout(showFinaleMessage,700)}},520)}
function showFinaleMessage(){document.querySelector('#doc-type').textContent='KIZUNA TRAVEL BUREAU';document.querySelector('#doc-title').textContent='PROJECT JAPAN';document.querySelector('#doc-body').innerHTML=`<p><strong>Estado del expediente</strong><br>COMPLETADO</p><p>Durante las últimas semanas has recorrido un expediente que nunca debió existir.</p><p>Has leído documentos escritos antes de ser creados. Has seguido el rastro de recuerdos que todavía no habían sucedido.</p><p>Y, aun así…</p><p>Has llegado exactamente al lugar al que debías llegar.</p><p>Gracias por confiar en nosotros.</p><p>Ha sido un honor acompañarte durante esta expedición.</p><p><strong>KIZUNA TRAVEL BUREAU</strong></p><button id="final-continue">Continuar</button>`;document.querySelector('#final-continue').onclick=()=>{viewer.close();render();setTimeout(showFinalFileAlert,180)}}
function showFinalLogo(){document.querySelector('#doc-type').textContent='';document.querySelector('#doc-title').textContent='KIZUNA';document.querySelector('#doc-body').innerHTML='<img style="display:block;width:130px;margin:0 auto 18px;border-radius:50%" src="../assets/kizuna-logo-official.png" alt="Kizuna Travel Bureau"><p style="text-align:center;font-size:20px">TRAVEL BUREAU</p><p style="text-align:center;margin-top:70px">Porque los mejores recuerdos nunca pertenecieron a un expediente. Siempre te pertenecieron a ti.</p>'}
document.querySelector('#gate-consent').onchange=event=>document.querySelector('#gate-continue').disabled=!event.target.checked;document.querySelector('#gate-continue').onclick=()=>{gate.hidden=true;access.hidden=false;document.querySelector('#username').focus()};document.querySelector('#access-form').onsubmit=event=>{event.preventDefault();const username=document.querySelector('#username').value.trim().toLowerCase(),password=document.querySelector('#password').value;if(username!=='jose.cuadrado'||password!=='kizuna2026')message.textContent='No se han podido verificar las credenciales de acceso.';else openDashboard()};document.querySelector('#exit').onclick=()=>{location.href='../index.html'};document.querySelector('.close').onclick=()=>viewer.close();mark.onclick=()=>{const done=read();if(!done.includes(active)){done.push(active);save(done)}if(active.startsWith('AR03-')){if(ar03Complete())openAr03();else if(active==='AR03-CARTA')openAr03Mosaic('temples');else openAr03Mosaic(active.startsWith('AR03-C-')?'cities':'temples');return}const parent=fileFolder(active);if(parent){openFolder(parent);return}if(active.startsWith('KTB-')){const id=active;syncKtb(id,()=>{if(id==='KTB-014'){localStorage.setItem('kizuna-complete','true');startFinale()}else{viewer.close();render()}});return}viewer.close();render()};next.onclick=()=>{const index=sequence.indexOf(active);if(index<sequence.length-1&&allowed(sequence[index+1]))openDoc(sequence[index+1])};

// Panel reservado para cuentas con el rol seguro app_metadata.role = admin.
const adminPanel=document.createElement('main');
adminPanel.id='admin-dashboard';
adminPanel.hidden=true;
adminPanel.className='admin-dashboard';
adminPanel.innerHTML=`<aside class="admin-rail"><div class="admin-brand"><img src="../assets/kizuna-logo-official.png" alt="Kizuna"><div><span>DIVISIÓN DE ARCHIVOS TEMPORALES</span><strong>Administración</strong></div></div><nav class="admin-sidebar" aria-label="Secciones de administración"><button type="button" class="active" data-admin-view="users"><span>01</span>Usuarios</button><button type="button" data-admin-view="mailbox"><span>02</span>Buzón</button><button type="button" data-admin-view="media"><span>03</span>Media</button></nav><button id="admin-exit">Cerrar sesión <span>→</span></button></aside><section class="admin-content"><div class="admin-views"><section id="admin-users-view" class="admin-view"><p class="system-line">ACCESO ADMINISTRATIVO · REGISTROS DE DESTINATARIOS</p><h1>Gestión de<br><em>expedientes.</em></h1><p class="admin-intro">Selecciona un destinatario para consultar y corregir su progreso documental.</p><div class="admin-layout"><aside><label>DESTINATARIOS<select id="admin-user-list"><option value="">Cargando registros…</option></select></label></aside><section id="admin-editor" hidden></section></div></section><section id="admin-mailbox-view" class="admin-view admin-placeholder" hidden><p class="system-line">BUZÓN</p><h1>Próximamente.</h1></section><section id="admin-media-view" class="admin-view admin-placeholder" hidden><p class="system-line">MEDIA</p><h1>Próximamente.</h1></section></div></section>`;
document.body.appendChild(adminPanel);

const adminViews={users:document.querySelector('#admin-users-view'),mailbox:document.querySelector('#admin-mailbox-view'),media:document.querySelector('#admin-media-view')};
document.querySelectorAll('.admin-sidebar button').forEach(button=>button.onclick=()=>{
  document.querySelectorAll('.admin-sidebar button').forEach(item=>item.classList.toggle('active',item===button));
  Object.entries(adminViews).forEach(([name,view])=>view.hidden=name!==button.dataset.adminView);
});

const isAdmin=user=>user?.app_metadata?.role==='admin';
const safeState=state=>({read:[],mailRead:0,finalFileSeen:false,finalAlertShown:false,completed:false,...(state||{})});
const adminExit=async()=>{try{if(supabaseClient)await supabaseClient.auth.signOut()}finally{currentUser=null;remoteState=null;adminPanel.hidden=true;location.href='../index.html'}};
document.querySelector('#admin-exit').onclick=adminExit;

// El alta de destinatarios se solicita a una Edge Function. La clave de
// administración nunca viaja al navegador ni queda incluida en esta web.
const adminCreateButton=document.createElement('button');
adminCreateButton.id='admin-create-user';
adminCreateButton.type='button';
adminCreateButton.textContent='Crear destinatario';
document.querySelector('#admin-exit').before(adminCreateButton);

// La creación queda al final de la gestión para que la cabecera se reserve
// exclusivamente para la sesión administrativa.
const adminCreateSection=document.createElement('section');
adminCreateSection.className='admin-create-section';
adminCreateSection.innerHTML='<p class="system-line">NUEVO DESTINATARIO</p><h2>Crear una nueva<br><em>expedición.</em></h2><p>Genera un acceso para un nuevo destinatario del expediente.</p>';
adminCreateButton.remove();
adminCreateSection.appendChild(adminCreateButton);
document.querySelector('#admin-users-view').appendChild(adminCreateSection);

const createUserModal=document.createElement('div');
createUserModal.id='admin-create-user-modal';
createUserModal.className='admin-modal';
createUserModal.hidden=true;
createUserModal.innerHTML=`<div class="admin-modal-card" role="dialog" aria-modal="true" aria-labelledby="admin-create-title"><button class="admin-modal-close" type="button" aria-label="Cerrar">×</button><p class="system-line">NUEVO DESTINATARIO · ACCESO CONTROLADO</p><h2 id="admin-create-title">Crear<br><em>expediente.</em></h2><p>Introduce los datos de acceso que recibirá el nuevo destinatario.</p><form id="admin-create-user-form"><label>Nombre visible<input name="displayName" type="text" autocomplete="name" required maxlength="80" placeholder="Nombre y apellidos"></label><label>Correo electrónico<input name="email" type="email" autocomplete="email" required placeholder="nombre@correo.com"></label><label>Contraseña temporal<input name="password" type="password" autocomplete="new-password" required minlength="8" placeholder="Mínimo 8 caracteres"></label><button>Crear usuario</button><span id="admin-create-user-status" role="status"></span></form></div>`;
document.body.appendChild(createUserModal);

const closeCreateUserModal=()=>{createUserModal.hidden=true;document.querySelector('#admin-create-user-form').reset();document.querySelector('#admin-create-user-status').textContent=''};
const functionErrorMessage=async error=>{
  try{
    const details=await error?.context?.clone().json();
    if(details?.error)return details.error;
  }catch(_){/* La respuesta puede no ser JSON. */}
  return error?.message||'No se ha podido completar la operación.';
};
adminCreateButton.onclick=()=>{createUserModal.hidden=false;setTimeout(()=>createUserModal.querySelector('input').focus(),0)};
createUserModal.querySelector('.admin-modal-close').onclick=closeCreateUserModal;
createUserModal.addEventListener('click',event=>{if(event.target===createUserModal)closeCreateUserModal()});
createUserModal.querySelector('#admin-create-user-form').onsubmit=async event=>{
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
    setTimeout(closeCreateUserModal,1300);
  }catch(error){
    console.error(error);
    status.textContent=await functionErrorMessage(error);
  }finally{button.disabled=false}
};

const renderAdminEditor=(profile,state)=>{
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

const renderAdminActivity=async userId=>{
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

const openAdminDashboard=async()=>{
  access.hidden=true;
  loading.hidden=false;
  const log=document.querySelector('#auth-log');
  log.innerHTML='<p>Verificando permisos administrativos…</p><div style="height:8px;background:#d3c8b4"><i id="auth-progress" style="display:block;width:0;height:100%;background:#7e1b19;transition:width .8s ease"></i></div><p>Localizando expedientes autorizados…</p>';
  setTimeout(()=>document.querySelector('#auth-progress').style.width='100%',60);
  const {data,error}=await supabaseClient.from('expedient_profiles').select('id,email,display_name,is_active').order('email');
  loading.hidden=true;
  if(error){access.hidden=false;message.textContent='No se ha podido cargar el directorio de expedientes.';console.error(error);return}
  adminPanel.hidden=false;
  const select=document.querySelector('#admin-user-list');
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
  const currentSubmit=form.onsubmit;
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
      currentUser=data.user;
      if(isAdmin(data.user)){message.textContent='';await openAdminDashboard();return}
      await loadRemoteProgress(data.user);
      message.textContent='';
      openDashboard();
    }catch(error){message.textContent='No se han podido verificar las credenciales de acceso.';console.error(error)}finally{submit.disabled=false}
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
  paper.style.width='min(1120px,calc(100% - 34px))';
  paper.style.maxWidth='1120px';
  paper.style.padding='42px';
  body.style.maxWidth='900px';
  body.style.margin='0 auto';
  document.querySelector('#doc-type').textContent='KIZUNA · DIVISIÓN DE ARCHIVOS TEMPORALES';
  document.querySelector('#doc-title').textContent='ARCHIVO COMPLEMENTARIO AC-01';
  body.innerHTML=`<p style="margin-bottom:20px;color:#7e1b19;font-size:12px">El contenido de este archivo no ha podido situarse con precisión dentro de la línea temporal del expediente.</p><img src="../assets/documents/AC-01/Pagina-${page}.png" alt="Página ${page} del registro ilustrado" style="display:block;width:100%;height:auto;border:1px solid #8b887d"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px"><button id="comic-prev" ${page===1?'disabled':''}>← Página anterior</button><strong style="font:12px var(--mono)">PÁGINA ${page} / ${availablePages}<br><span style="font-size:9px;color:#7e1b19">${availablePages} DE 11 RECUPERADAS</span></strong><button id="comic-next" ${page===availablePages?'disabled':''}>Página siguiente →</button></div><button id="comic-back" style="margin-top:18px;background:#7e1b19;color:#fff;border:0;padding:14px 18px;font:11px var(--mono);cursor:pointer">Regresar al expediente</button>`;
  document.querySelector('#comic-prev').onclick=()=>openComicViewer(page-1);
  document.querySelector('#comic-next').onclick=()=>openComicViewer(page+1);
  document.querySelector('#comic-back').onclick=()=>{
    paper.style.width='';paper.style.maxWidth='';paper.style.padding='';
    body.style.maxWidth='';body.style.margin='';viewer.close();
  };
  if(!viewer.open)viewer.showModal();
}
