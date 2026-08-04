import {apps,locations,routes,galleryItems,searches,lostFiles} from './evidence-data.js?v=20260730-device-icons01';

const $=selector=>document.querySelector(selector);
const query=new URLSearchParams(location.search);
const embedded=query.has('embedded')&&window.parent!==window;
const adminPreview=query.get('admin')==='1';
const supabaseUrl='https://vcwqkideizdrhzpbghkj.supabase.co';
const supabaseKey='sb_publishable_h3pjxT8UPZkYqRhLskVdlA_m-ulI4EF';

function renderDeviceAccessGate({denied=false}={}){
  if(denied){
    document.body.className='device-access-denied';
    document.body.innerHTML=`<main class="device-access-gate is-denied" role="main">
      <img src="../assets/kizuna-logo-official.png" alt="KIZUNA">
      <p>DIVISIÓN DE ARCHIVOS TEMPORALES · CONTROL DE ACCESO</p>
      <h1>Acceso no autorizado.</h1>
      <span>Este dispositivo debe consultarse desde el expediente AR-06.</span>
      <a href="../expediente/index.html">Volver al Archivo Central <b>→</b></a>
    </main>`;
    return;
  }
  document.body.insertAdjacentHTML('beforeend',`<aside class="device-access-gate is-checking" id="device-access-gate" role="status" aria-live="polite">
    <img src="../assets/kizuna-logo-official.png" alt="">
    <p>AR-06 · DISPOSITIVO RECUPERADO</p>
    <h1>Validando autorización…</h1>
    <span>Esperando confirmación del Archivo Central.</span>
  </aside>`);
}

async function verifyAdminPreview(){
  try{
    if(!window.supabase)await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload=resolve;
      script.onerror=reject;
      document.head.appendChild(script);
    });
    const client=window.supabase.createClient(supabaseUrl,supabaseKey);
    const {data:{session}}=await client.auth.getSession();
    return session?.user?.app_metadata?.role==='admin';
  }catch(error){
    console.warn('No se pudo validar el acceso administrativo al dispositivo.',error);
    return false;
  }
}

const accessGranted=embedded||(adminPreview&&await verifyAdminPreview());
if(!accessGranted){
  renderDeviceAccessGate({denied:true});
}else{
  if(embedded){
    document.body.classList.add('is-embedded');
    renderDeviceAccessGate();
  }else document.body.classList.remove('device-access-pending');
const screen=$('#device-screen');
const home=$('#home-screen');
const appView=$('#app-view');
const recentsView=$('#recents-view');
const appContent=$('#app-content');
const reviewed=new Set();
const recent=[];
const systemApps=[
  {id:'mail',code:'SISTEMA · MENSAJES',title:'Correo',subtitle:'1 mensaje recuperado',icon:'✉',color:'#315b84',state:'RECUPERADO'},
  {id:'music',code:'SISTEMA · AUDIO',title:'Música',subtitle:'Playlist',icon:'♪',color:'#923f54',state:'ENLACE'},
  {id:'phone',code:'SISTEMA · TELEFONÍA',title:'Teléfono',subtitle:'Alberto',icon:'☎',color:'#31785b',state:'SIN SEÑAL'},
  {id:'settings',code:'SISTEMA · ANDROID 12',title:'Ajustes',subtitle:'SM-G991B',icon:'⚙',color:'#56636b',state:'SISTEMA'}
];
const residualApp={id:'residual',code:'MÓDULO RECUPERADO',title:'Recuerdos',subtitle:'Sin remitente',icon:'◇',color:'#9e302d',state:'ANOMALÍA'};
let currentApp=null;
let galleryActiveIndex=-1;
let galleryTouchStartX=0;
let residualRevealed=false;
let residualConsumed=false;
let anomalyState='idle';
let anomalyTimers=[];
let callTimers=[];
let homeEntrancePlayed=false;
let progressHydrated=!embedded;
let initialBooted=false;
let progressFallbackTimer=0;

const iconDrawings={
  timeline:'<path d="M12 21c4-4.4 6-7.5 6-10.1a6 6 0 1 0-12 0C6 13.5 8 16.6 12 21Z"/><circle cx="12" cy="10.7" r="2.1"/><path class="icon-accent" d="M4.4 20.4h15.2"/>',
  routes:'<path d="M6.2 18.8c2.1-2.8 3.2-5.3 3.3-7.6.2-2.9 1.5-5 3.9-6.2"/><path d="m10.7 6.4 2.7-1.4-.2 3"/><circle cx="6.1" cy="19" r="2"/><circle class="icon-accent" cx="16.9" cy="5.1" r="2"/><path d="M13.2 16.7c1.9-.2 3.2.6 4.5 2.2"/>',
  gallery:'<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="16.8" cy="8.3" r="1.6"/><path d="m5.7 17 4.2-4.6 3.1 3 2.2-2.2 3.1 3.8"/><path class="icon-accent" d="M7.2 3v3M16.8 18v3"/>',
  whatsapp:'<path d="M5.2 17.8 4 21l3.6-1.1a8 8 0 1 0-2.4-2.1Z"/><path d="M8.3 8.4c.7 3.3 2.5 5.2 5.7 6.4l1.5-1.7-2.4-1.2-1 1c-1.1-.6-1.9-1.4-2.4-2.5l.9-1-1.1-2.2-1.2 1.2Z"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.2"/><path d="m15 15 5 5"/><path class="icon-accent" d="M5.2 10.5h10.6M10.5 4.3c2.1 2.2 2.1 10.2 0 12.4"/>',
  health:'<path d="M12 20S4.2 15.5 4.2 9.4A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.8 2.2C19.8 15.5 12 20 12 20Z"/><path class="icon-accent" d="M7.3 12h2.1l1.2-2.4 2.1 4.8 1.2-2.4h2.6"/>',
  lost:'<path d="M3.5 7.2h6l1.8 2h9.2v9.3a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7.2Z"/><path d="M3.5 7.2V5.4a2 2 0 0 1 2-2h4l1.7 1.8h5.3"/><path class="icon-accent" d="m9.2 12.2 5.6 5.6m0-5.6-5.6 5.6"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4.6 7 7.4 6 7.4-6"/><path class="icon-accent" d="m4.7 17 4.7-4.2m9.9 4.2-4.7-4.2"/>',
  music:'<path d="M9 18V7.3L19 5v10.2"/><path d="m9 10.5 10-2.3"/><ellipse cx="6.5" cy="18.2" rx="2.6" ry="2"/><ellipse class="icon-accent" cx="16.5" cy="15.4" rx="2.6" ry="2"/>',
  phone:'<path d="M7.1 3.8h3l1.5 4.4-2 1.8c1.1 2.3 2.1 3.3 4.4 4.4l1.8-2 4.4 1.5v3c0 2-1.7 3.3-3.7 3.1C9.8 19.2 4.8 14.2 4 7.5c-.2-2 1.1-3.7 3.1-3.7Z"/><path class="icon-accent" d="M14.7 4.6c2.5.4 4.3 2.2 4.7 4.7"/>',
  settings:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.1m0 14.2v2.1M2.8 12h2.1m14.2 0h2.1M5.5 5.5 7 7m10 10 1.5 1.5m0-13L17 7M7 17l-1.5 1.5"/><circle class="icon-accent" cx="12" cy="12" r="7.1"/>',
  residual:'<path d="m12 3 7.5 5.2v7.6L12 21l-7.5-5.2V8.2L12 3Z"/><path d="m8.3 9.7 3.7-2.2 3.7 2.2v4.6L12 16.5l-3.7-2.2V9.7Z"/><path class="icon-accent" d="M12 3v4.5m7.5.7-3.8 1.5m3.8 6.1-3.8-1.5M12 21v-4.5m-7.5-.7 3.8-1.5m-3.8-6.1 3.8 1.5"/>',
  ktb:'<path d="M6 3.5h9l3 3v14H6v-17Z"/><path d="M15 3.5v4h3"/><path d="M9 11h6m-6 3h6m-6 3h4"/><path class="icon-accent" d="M3.5 7.5v13H15"/>'
};

function appIcon(id){
  return `<svg class="kizuna-app-glyph" viewBox="0 0 24 24" aria-hidden="true">${iconDrawings[id]||iconDrawings.residual}</svg>`;
}

function syncDeviceViewport(){
  const viewportHeight=window.visualViewport?.height||window.innerHeight;
  document.documentElement.style.setProperty('--device-viewport-height',`${Math.round(viewportHeight)}px`);
}

const iconForType={Imagen:'▧',Vídeo:'▷',Audio:'♩',Documento:'▤'};
const healthBars=[31,34,29,25,28,40,31,37,34,33,27,31,29,41,36,33,45,50,47,42,38,32,18,46,49,34,31,27];

function appButton(app,index=0){
  return `<button class="app-button" data-open-app="${app.id}" style="--app-color:${app.color};--icon-order:${index}" type="button">
    <span class="app-icon-shell">${appIcon(app.id)}</span><b>${app.title}</b><small>${app.subtitle}</small>
  </button>`;
}

$('#app-grid').innerHTML=apps.map((app,index)=>appButton(app,index)).join('')+appButton({...residualApp,hidden:true},apps.length);
const residualButton=$('[data-open-app="residual"]');
residualButton.hidden=true;
residualButton.classList.add('residual-app');
$('#system-dock').innerHTML=systemApps.map((app,index)=>`<button data-open-app="${app.id}" style="--dock-color:${app.color};--icon-order:${apps.length+index}" type="button"><span class="app-icon-shell">${appIcon(app.id)}</span><small>${app.title}</small></button>`).join('');

function playHomeEntrance(){
  if(homeEntrancePlayed||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  homeEntrancePlayed=true;
  home.classList.remove('is-icon-entering');
  requestAnimationFrame(()=>requestAnimationFrame(()=>home.classList.add('is-icon-entering')));
  window.setTimeout(()=>home.classList.remove('is-icon-entering'),1700);
}

function setClock(){
  $('#device-clock').textContent=new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit'}).format(new Date());
}
setClock();
setInterval(setClock,30000);

function currentModuleState(){
  if(residualConsumed)return 'consumed';
  if(residualRevealed)return 'available';
  return 'locked';
}

function updateProgress({emit=true}={}){
  const reviewCount=$('#review-count');
  if(reviewCount) reviewCount.textContent=reviewed.size;
  document.querySelectorAll('#app-grid .app-button[data-open-app]').forEach(button=>{
    const isReviewed=reviewed.has(button.dataset.openApp);
    button.classList.toggle('is-reviewed',isReviewed);
    button.querySelector('.app-icon-shell')?.setAttribute('aria-label',isReviewed?'Evidencia consultada':'Evidencia pendiente');
  });
  const complete=reviewed.size===apps.length;
  if(emit&&progressHydrated&&embedded){
    window.parent.postMessage({
      type:'kizuna:recovered-device-progress',
      reviewed:reviewed.size,
      total:apps.length,
      complete,
      reviewedIds:[...reviewed],
      moduleState:currentModuleState()
    },location.origin);
  }
  return complete;
}

function showEvidenceProgress(){
  const count=reviewed.size;
  showToast(`${count} de ${apps.length} evidencias consultadas.`,{
    title:'EXTRACCIÓN EN CURSO',
    icon:String(count||apps.length)
  });
}

function clearCallTimers(){
  callTimers.forEach(timer=>clearTimeout(timer));
  callTimers=[];
}

function clearAnomalyTimers(){
  anomalyTimers.forEach(timer=>clearTimeout(timer));
  anomalyTimers=[];
}

function anomalyLater(callback,delay){
  const timer=setTimeout(callback,delay);
  anomalyTimers.push(timer);
  return timer;
}

function appMeta(id){
  return apps.find(item=>item.id===id)||systemApps.find(item=>item.id===id)||(id==='residual'?residualApp:null);
}

function syncUrl(id){
  const url=new URL(location.href);
  if(id&&id!=='home') url.searchParams.set('app',id); else url.searchParams.delete('app');
  history.replaceState({app:id||'home'},'',url);
}

function launch(id,{fromHistory=false}={}){
  if(['pending','scanning','dialog'].includes(anomalyState))return;
  if(id==='ktb') return openKtb(fromHistory);
  clearCallTimers();
  const app=appMeta(id);
  if(!app) return showHome();
  if(id==='residual'&&(!residualRevealed||residualConsumed)){
    showToast('La aplicación todavía no ha podido reconstruirse.');
    return showHome();
  }
  currentApp=id;
  const isEvidence=apps.some(item=>item.id===id);
  const isNewEvidence=isEvidence&&!reviewed.has(id);
  if(isEvidence) reviewed.add(id);
  if(!recent.includes(id)) recent.unshift(id);
  if(recent.length>5) recent.pop();
  const allEvidenceReviewed=updateProgress();
  home.hidden=true;
  recentsView.hidden=true;
  appView.hidden=false;
  appView.classList.toggle('is-memory-module',id==='residual');
  appView.style.setProperty('--app-color',app.color);
  $('#app-header-icon').innerHTML=appIcon(app.id);
  $('#app-header-icon').style.background=app.color;
  $('#app-code').textContent=app.code;
  $('#app-title').textContent=app.title;
  $('#app-integrity').textContent=Number.isFinite(app.integrity)?`${app.integrity} %`:app.state;
  if(id==='whatsapp'){
    appContent.innerHTML='<iframe class="whatsapp-frame" title="Conversaciones recuperadas con Alberto" src="../conversacion/index.html?embedded=1&v=20260802-whatsapp-chat-list02"></iframe>';
  }else{
    appContent.innerHTML=renderApp(id);
    bindAppInteractions(id);
  }
  appContent.scrollTop=0;
  if(!fromHistory) syncUrl(id);
  if(isNewEvidence){
    setTimeout(()=>showEvidenceProgress(),500);
    if(allEvidenceReviewed&&anomalyState==='idle'){
      anomalyState='pending';
      anomalyLater(()=>{
        $('#toast').classList.remove('show');
        showHome();
        beginRecoveryAnomaly();
      },2300);
    }
  }
}

function showHome({fromHistory=false}={}){
  clearCallTimers();
  currentApp=null;
  appView.hidden=true;
  appView.classList.remove('is-memory-module');
  recentsView.hidden=true;
  home.hidden=false;
  playHomeEntrance();
  if(!fromHistory) syncUrl('home');
}

function showRecents(){
  if(['pending','scanning','dialog'].includes(anomalyState)||(currentApp==='residual'&&anomalyState==='running'))return;
  home.hidden=true;appView.hidden=true;recentsView.hidden=false;
  const visibleRecent=recent.filter(id=>id!=='residual'||!residualConsumed);
  $('#recents-list').innerHTML=visibleRecent.length?visibleRecent.map(id=>{
    const app=appMeta(id)||{id:'ktb',title:'KIZUNA',subtitle:'Acta de reanudación',icon:'✦',color:'#8c742e'};
    return `<button class="recent-card" data-open-app="${id}" style="--recent-color:${app.color}" type="button">
      <span>${appIcon(app.id||id)}</span><strong>${app.title}</strong><small>${app.subtitle}</small>
    </button>`;
  }).join(''):'<p class="history-empty">No hay aplicaciones recientes.</p>';
}

function renderApp(id){
  return ({
    timeline:renderTimeline(),
    routes:renderRoutes(),
    gallery:renderGallery(),
    search:renderSearch(),
    health:renderHealth(),
    lost:renderLost(),
    mail:renderMail(),
    music:renderMusic(),
    phone:renderPhone(),
    settings:renderSettings(),
    residual:renderResidual()
  })[id]||'';
}

function renderMail(){
  return `<article class="system-page mail-app">
    <section class="mail-screen mail-home" data-mail-screen="home">
      <header class="system-hero"><p>CUENTA LOCAL · JOSÉ</p><h2>Correo</h2><span>1 mensaje recuperado de la memoria del dispositivo</span></header>
      <button class="mail-compose" type="button" disabled title="Función no disponible en la copia forense"><span>＋</span><b>Redactar</b><small>NO DISPONIBLE</small></button>
      <nav class="mail-folder-list" aria-label="Carpetas de correo">
        <button data-mail-folder="inbox" type="button"><span aria-hidden="true">▣</span><div><strong>Recibidos</strong><small>Índice de entrada dañado</small></div><b>!</b><i>›</i></button>
        <button type="button" disabled><span aria-hidden="true">☆</span><div><strong>Destacados</strong><small>No recuperados</small></div><b>—</b></button>
        <button data-mail-folder="sent" type="button"><span aria-hidden="true">↗</span><div><strong>Enviados</strong><small>1 mensaje recuperado</small></div><b>1</b><i>›</i></button>
        <button type="button" disabled><span aria-hidden="true">◇</span><div><strong>Borradores</strong><small>No recuperados</small></div><b>—</b></button>
        <button type="button" disabled><span aria-hidden="true">!</span><div><strong>Spam</strong><small>No recuperado</small></div><b>—</b></button>
        <button type="button" disabled><span aria-hidden="true">♲</span><div><strong>Papelera</strong><small>No recuperada</small></div><b>—</b></button>
      </nav>
      <p class="mail-forensic-note">COPIA FORENSE · Las funciones de escritura, envío y eliminación permanecen bloqueadas.</p>
    </section>
    <section class="mail-screen mail-folder" data-mail-screen="inbox" hidden>
      <header class="mail-view-header"><button data-mail-back="home" type="button" aria-label="Volver a las carpetas">‹</button><div><p>BANDEJA LOCAL</p><strong>Recibidos</strong><span>0 mensajes recuperados</span></div></header>
      <div class="mail-empty"><i>!</i><h3>No se pudieron reconstruir los mensajes recibidos.</h3><p>El índice de entrada y sus contenidos fueron sobrescritos antes de la extracción.</p><code>ERR_INBOX_INDEX · DATOS NO RECUPERABLES</code></div>
    </section>
    <section class="mail-screen mail-folder" data-mail-screen="sent" hidden>
      <header class="mail-view-header"><button data-mail-back="home" type="button" aria-label="Volver a las carpetas">‹</button><div><p>CARPETA LOCAL · 1 ELEMENTO</p><strong>Enviados</strong><span>Mensajes recuperados parcialmente</span></div></header>
      <button class="mail-row" data-open-mail type="button">
        <span>KT</span><div><strong>KIZUNA Travel Bureau</strong><b>Solicitud de intervención – Expediente personal (confidencial)</b><small>Para: contacto@kizunatravel.jp · 7 ene 2027 · 22:11</small></div><i>›</i>
      </button>
    </section>
    <section class="mail-screen mail-message" data-mail-screen="message" hidden>
      <header class="mail-view-header mail-message-header"><button data-mail-back="sent" type="button" aria-label="Volver a enviados">‹</button><div><p>DE: José</p><strong>Solicitud de intervención – Expediente personal (confidencial)</strong><span>PARA: contacto@kizunatravel.jp · 7 de enero de 2027, 22:11</span></div></header>
      <div class="corrupt-body"><i>!</i><h3>Contenido no recuperable.</h3><p>La cabecera del mensaje se conserva, pero el cuerpo fue sobrescrito antes de la extracción.</p><code>ERR_BODY_FRAGMENT · 0x06A1</code></div>
    </section>
  </article>`;
}

function renderMusic(){
  return `<article class="system-page music-app">
    <header class="system-hero"><p>LISTA RECUPERADA · REPRODUCTOR AUTORIZADO</p><h2>Música</h2><span>Selección guardada para el viaje</span></header>
    <section class="album-card">
      <div class="album-art"><span>日本</span><i></i></div>
      <p>PLAYLIST DE JOSÉ</p><h3>Project Japan</h3><span>Reproducción integrada · YouTube</span>
      <div class="music-wave" aria-hidden="true">${Array.from({length:24},(_,i)=>`<i style="--h:${18+(i*17)%64}%"></i>`).join('')}</div>
      <div class="music-player" data-music-player hidden></div>
      <p class="music-player-note" data-music-note hidden>Si el audio no comienza, pulsa ▶ en el reproductor.</p>
      <button class="music-preview" data-music-toggle type="button"><span>▶</span><b>REPRODUCIR PLAYLIST</b></button>
      <a href="https://www.youtube.com/watch?v=5XBYEQYBUdA&list=RD5XBYEQYBUdA&start_radio=1" target="_blank" rel="noopener">ABRIR PLAYLIST EN YOUTUBE ↗</a>
    </section>
  </article>`;
}

function renderPhone(){
  return `<article class="system-page phone-app">
    <header class="system-hero"><p>COPIA FORENSE · TELEFONÍA</p><h2>Teléfono</h2><span>Red móvil no disponible</span></header>
    <nav class="phone-tabs" aria-label="Secciones del teléfono">
      <button class="active" data-phone-tab="calls" type="button"><span>↗</span>Llamadas</button>
      <button data-phone-tab="contacts" type="button"><span>♙</span>Contactos</button>
    </nav>
    <section class="phone-panel calls-panel" data-phone-panel="calls">
      <header><div><p>HISTORIAL PARCIAL</p><h3>Llamadas recientes</h3></div><span>Identidades dañadas</span></header>
      <div class="call-log" aria-label="Registro de llamadas no recuperable">
        <button type="button" disabled><i class="missed">↙</i><div><strong>Llamada perdida</strong><small>Identidad no recuperable</small></div><span>REGISTRO PARCIAL</span></button>
        <button type="button" disabled><i class="outgoing">↗</i><div><strong>Llamada saliente</strong><small>Destinatario no recuperable</small></div><span>REGISTRO PARCIAL</span></button>
        <button type="button" disabled><i class="missed">↙</i><div><strong>Llamada perdida</strong><small>Identidad no recuperable</small></div><span>REGISTRO PARCIAL</span></button>
        <button type="button" disabled><i class="outgoing">↗</i><div><strong>Llamada saliente</strong><small>Destinatario no recuperable</small></div><span>REGISTRO PARCIAL</span></button>
      </div>
      <p class="phone-forensic-note">Los números, nombres y marcas temporales asociados no pudieron reconstruirse.</p>
    </section>
    <section class="phone-panel contacts-panel" data-phone-panel="contacts" hidden>
      <header><div><p>AGENDA LOCAL</p><h3>Contactos</h3></div><span>1 disponible</span></header>
      <div class="contact-list">
        <button data-open-contact type="button"><span class="recovered-contact-avatar">A</span><div><strong>Alberto</strong><small>Contacto recuperado · Móvil</small></div><b>☎</b><i>›</i></button>
        <button type="button" disabled><span class="hidden-contact-avatar">••</span><div><strong>Contacto oculto</strong><small>Datos no recuperables</small></div><b>—</b></button>
        <button type="button" disabled><span class="hidden-contact-avatar">••</span><div><strong>Contacto oculto</strong><small>Datos no recuperables</small></div><b>—</b></button>
        <button type="button" disabled><span class="hidden-contact-avatar">••</span><div><strong>Contacto oculto</strong><small>Datos no recuperables</small></div><b>—</b></button>
      </div>
    </section>
    <section class="contact-card" id="contact-card" hidden>
      <button class="contact-card-back" data-close-contact type="button" aria-label="Volver a contactos">‹</button>
      <div class="contact-avatar">A</div><p>CONTACTO RECUPERADO</p><h3>Alberto</h3><span>Móvil · Favorito</span>
      <button data-start-call type="button"><i>☎</i><b>LLAMAR</b></button>
    </section>
    <section class="call-screen" id="call-screen" hidden>
      <div class="call-avatar">A</div><p id="call-status">LLAMANDO…</p><h3>Alberto</h3><span id="call-time">00:00</span>
      <div class="call-actions"><button type="button">◉<small>Altavoz</small></button><button type="button">⌁<small>Silenciar</small></button></div>
      <button class="hang-call" data-hang-call type="button">⌕</button>
    </section>
  </article>`;
}

function renderSettings(){
  return `<article class="system-page settings-app">
    <header class="settings-device"><div>SM</div><p>DISPOSITIVO CLONADO</p><h2>SM-G991B</h2><span>Android 12 · extracción parcial</span></header>
    <section class="settings-health"><div><span>72%</span><small>BATERÍA</small></div><div><span>68%</span><small>DATOS</small></div><div><span>128 GB</span><small>ALMACENAMIENTO</small></div></section>
    <div class="settings-list">
      <button type="button"><span>⌁</span><div><b>Conexiones</b><small>Sin red · Wi-Fi desconectado</small></div><i>›</i></button>
      <button type="button"><span>▣</span><div><b>Almacenamiento</b><small>Fragmentos recuperados de la memoria interna</small></div><i>›</i></button>
      <button type="button"><span>◐</span><div><b>Batería y cuidado</b><small>Estado previo a la pérdida del dispositivo</small></div><i>›</i></button>
      <button type="button"><span>i</span><div><b>Acerca del teléfono</b><small>Galaxy S21 · SM-G991B · Android 12</small></div><i>›</i></button>
    </div>
    <p class="settings-footnote">Esta es una copia forense de solo lectura. Ningún cambio realizado aquí alterará el dispositivo recuperado.</p>
  </article>`;
}

function renderResidual(){
  return `<article class="memory-module" id="memory-module">
    <section class="memory-boot" id="memory-boot">
      <span class="memory-signal"></span>
      <p id="memory-boot-line">Inicializando...</p>
      <div class="memory-integrity" id="memory-integrity" hidden><span>Integridad:</span><strong>17 %</strong><i><b></b></i></div>
    </section>
    <section class="memory-chat" id="memory-chat" hidden>
      <header><span class="memory-avatar">∅</span><div><strong>Sin remitente</strong><small>canal recuperado</small></div></header>
      <div class="memory-messages" id="memory-messages"></div>
      <footer id="memory-actions"><button data-memory-continue type="button">Continuar</button></footer>
    </section>
    <section class="memory-finished" id="memory-finished" hidden>
      <span class="memory-signal is-closed"></span>
      <p>Canal cerrado.</p>
      <small>No quedan más fragmentos recuperables en este recuerdo.</small>
      <button data-memory-close type="button">Cerrar</button>
    </section>
  </article>`;
}

function heading(code,title,status){
  return `<div class="section-heading"><div><p>${code} · EXTRACCIÓN PARCIAL</p><h2>${title}</h2></div><span>${status}</span></div>`;
}

function renderTimeline(){
  const recoveredSegments=locations.slice(0,-1).map((item,index)=>{
    const next=locations[index+1];
    const damaged=item.type==='damage'||next.type==='damage';
    return `<line class="${damaged?'damaged':'recovered'}" x1="${item.x}" y1="${item.y}" x2="${next.x}" y2="${next.y}"/>`;
  }).join('');
  return `<article class="app-page timeline-app">
    <header class="timeline-hero">
      <div><p>AR-06-01 · EXTRACCIÓN PARCIAL</p><h2>Historial de ubicaciones</h2><span>Registro reconstruido del dispositivo SM-G991B</span></div>
      <div class="recovery-score"><strong>42%</strong><span>RECUPERADO</span></div>
    </header>
    <div class="timeline-workspace">
      <section class="route-map-card" aria-label="Vista de ruta recuperada">
        <div class="route-map-toolbar">
          <div><span>VISTA DE RUTA</span><b>RECUPERACIÓN PARCIAL</b></div>
          <div class="map-legend" aria-label="Leyenda">
            <span class="recovered">Registro</span><span class="damaged">Daño</span>
          </div>
        </div>
        <div class="location-map" id="location-map">
          <svg class="location-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${recoveredSegments}</svg>
          <span class="map-city city-tokyo">TOKIO</span><span class="map-city city-kyoto">KIOTO</span>
          ${locations.map((item,index)=>`<button class="location-marker ${item.type} ${index===0?'active':''}" data-location="${index}" style="--x:${item.x}%;--y:${item.y}%" type="button" aria-label="${item.time}, ${item.place}"><span>${index+1}</span></button>`).join('')}
        </div>
        <article class="location-detail" id="location-detail" aria-live="polite">
          ${locationDetail(locations[0],0)}
        </article>
      </section>
      <aside class="timeline-panel">
        <div class="time-rail-heading"><span>LÍNEA TEMPORAL</span><b>07:11 — 22:15</b></div>
        <div class="time-rail" id="time-rail">
          ${locations.map((item,index)=>`<button class="${item.type} ${index===0?'active':''}" data-location="${index}" type="button"><time>${item.time}</time><i></i><span>${item.type==='damage'?'DATOS DAÑADOS':item.place}</span></button>`).join('')}
        </div>
        <button class="timeline-toggle" id="timeline-toggle" type="button" aria-expanded="false">VER CRONOLOGÍA COMPLETA <span>＋</span></button>
        <ol class="timeline-list" id="timeline-list" hidden>
          ${locations.map((item,index)=>`<li><button class="${item.type} ${index===0?'active':''}" data-location="${index}" type="button"><time>${item.time}</time><span><strong>${item.place}</strong><small>${item.detail}</small></span></button></li>`).join('')}
        </ol>
        <details class="analyst-report" id="analyst-report">
          <summary><span>INFORME DE EXTRACCIÓN</span><strong>7 ubicaciones completas · 3 trayectos parciales</strong><i>＋</i></summary>
          <div>
            <p>Se estima que el <b>58 % del historial total</b> no pudo extraerse debido a la corrupción de los datos. Las interrupciones coinciden con desplazamientos que el dispositivo no logró conservar.</p>
            <footer><span>ANÁLISIS KIZUNA</span><b>INTEGRIDAD 42 %</b><i>絆</i></footer>
          </div>
        </details>
      </aside>
    </div>
  </article>`;
}

function locationDetail(item,index){
  const state=item.type==='damage'?'REGISTRO DAÑADO':item.type==='train'?'TRAYECTO RECUPERADO':'UBICACIÓN RECUPERADA';
  const icon=item.type==='damage'?'!':item.type==='train'?'▰':'⌖';
  return `<span class="location-detail-icon ${item.type}">${icon}</span><div><p>${state} · REGISTRO ${String(index+1).padStart(2,'0')}</p><h3>${item.place}</h3><span>${item.time} · ${item.detail}</span></div>`;
}

function renderRoutes(){
  return `<article class="app-page routes-app">
    <header class="routes-hero">
      <div><p>AR-06-02 · EXTRACCIÓN PARCIAL</p><h2>Actividad recuperada</h2><span>Rutas GPS caminadas · SM-G991B</span></div>
      <div class="routes-score"><strong>37%</strong><span>INTEGRIDAD</span></div>
    </header>
    <nav class="route-switcher" aria-label="Rutas recuperadas">
      ${routes.map((route,index)=>`<button class="${index===0?'active':''}" data-route="${index}" type="button"><span>${String(index+1).padStart(2,'0')}</span><b>${route.name}</b><small>${route.integrity}%</small></button>`).join('')}
    </nav>
    <div id="route-detail" class="route-detail-host">${routeDetail(routes[0],0)}</div>
    <section class="route-recovery-summary" aria-label="Resumen de recuperación">
      <div><b>0</b><small>COMPLETAS</small></div><div><b>4</b><small>PARCIALES</small></div><div><b>17</b><small>SEGMENTOS PERDIDOS</small></div><div><b>63%</b><small>DATOS PERDIDOS</small></div>
    </section>
    <details class="routes-analyst-report" id="routes-analyst-report">
      <summary><span>NOTA DEL ANALISTA</span><strong>La señal GPS presenta discontinuidades.</strong><i>＋</i></summary>
      <div>
        <p>La integridad de las rutas puede variar dependiendo de la señal GPS y del estado de los registros en el momento de la pérdida del dispositivo.</p>
        <dl><div><dt>FUENTE</dt><dd>Google Fit · Actividad física</dd></div><div><dt>ESTADO</dt><dd>RECUPERACIÓN PARCIAL</dd></div></dl>
        <footer><span>ANÁLISIS KIZUNA</span><b>AR-06-02</b><i>絆</i></footer>
      </div>
    </details>
  </article>`;
}
function routeSegments(route){
  const points=route.mapPoints.split(' ');
  return points.slice(0,-1).map((point,index)=>{
    const damaged=index>=route.damageFrom;
    return `<line class="${damaged?'damaged':'recovered'}" x1="${point.split(',')[0]}" y1="${point.split(',')[1]}" x2="${points[index+1].split(',')[0]}" y2="${points[index+1].split(',')[1]}"/>`;
  }).join('');
}
function routeDetail(route,index){
  const polygon=`0,100 ${route.points} 100,100`;
  const markers=route.mapPoints.split(' ').map((point,markerIndex)=>{
    const [x,y]=point.split(',');
    const damaged=markerIndex>route.damageFrom;
    return `<i class="${damaged?'damaged':''}" style="--x:${x}%;--y:${y}%">${markerIndex===0?'A':markerIndex===route.mapPoints.split(' ').length-1?'B':''}</i>`;
  }).join('');
  return `<section class="route-experience" style="--route-color:${route.color}">
    <header class="route-title">
      <div><p>${route.routeCode} · REGISTRO GPS</p><h3>${route.place}</h3></div>
      <span><b>${route.integrity}%</b> recuperado</span>
    </header>
    <div class="route-workspace">
      <section class="activity-map" aria-label="Trazado recuperado de ${route.name}">
        <div class="activity-map-toolbar"><span>VISTA DE RUTA</span><b>RECUPERACIÓN PARCIAL</b></div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${routeSegments(route)}</svg>
        <span class="route-place-watermark">${route.place}</span>
        <div class="route-map-markers">${markers}</div>
        <div class="route-map-legend"><span>TRAZADO</span><span>DAÑO</span></div>
      </section>
      <aside class="route-data">
        <div class="route-stats">
          <div><span>♟</span><b>${route.steps}</b><small>PASOS</small></div>
          <div><span>⌁</span><b>${route.distance}</b><small>DISTANCIA</small></div>
          <div><span>◷</span><b>${route.duration}</b><small>TIEMPO TOTAL</small></div>
        </div>
        <section class="elevation-card ${index===3?'unavailable':''}">
          <header><span>PERFIL DE DESNIVEL</span><b>${index===3?'NO RECUPERADO':'DATOS APROXIMADOS'}</b></header>
          ${index===3?'<div class="elevation-missing"><i>!</i><strong>DATOS INSUFICIENTES</strong></div>':`<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon class="elevation" points="${polygon}"/><polyline points="${route.points}"/></svg>`}
        </section>
        <div class="route-system-note"><span>NOTA DEL SISTEMA</span><p>${route.loss}</p></div>
      </aside>
    </div>
  </section>`;
}

function renderGallery(){
  return `<article class="gallery-app">
    <header class="gallery-hero">
      <div>
        <p>AR-06-03 · ALMACENAMIENTO INTERNO</p>
        <h2>Galería recuperada.</h2>
        <span>Miniaturas extraídas de la caché del dispositivo SM-G991B.</span>
      </div>
      <div class="gallery-integrity"><strong>38<small>%</small></strong><span>INTEGRIDAD</span></div>
    </header>
    <div class="gallery-recovery">
      <div><b>45</b><small>ENCONTRADAS</small></div>
      <div class="complete"><b>20</b><small>COMPLETAS</small></div>
      <div class="damaged"><b>13</b><small>DAÑADAS</small></div>
      <div class="lost"><b>12</b><small>PERDIDAS</small></div>
    </div>
    <div class="gallery-toolbar">
      <div class="gallery-filters" role="group" aria-label="Filtrar miniaturas">
        <button class="active" data-gallery-filter="all" type="button">TODAS</button>
        <button data-gallery-filter="complete" type="button">ÍNTEGRAS</button>
        <button data-gallery-filter="damaged" type="button">DAÑADAS</button>
        <button data-gallery-filter="lost" type="button">PERDIDAS</button>
      </div>
      <span id="gallery-result-count">${galleryItems.length} fragmentos visibles</span>
    </div>
    <div class="gallery-grid" id="gallery-grid">${galleryItems.map(galleryCard).join('')}</div>
    <details class="gallery-report">
      <summary><span>INFORME DEL ANALISTA</span><strong>Origen y alcance de la recuperación</strong><i>＋</i></summary>
      <div>
        <p>La corrupción observada parece deberse a fallos de almacenamiento y sobrescritura de datos. Las imágenes completas proceden de miniaturas conservadas por el sistema; no garantizan que el archivo original siga disponible.</p>
        <dl>
          <div><dt>RUTA DE ORIGEN</dt><dd>/storage/emulated/0/DCIM/Camera/</dd></div>
          <div><dt>PROCESO</dt><dd>Extracción parcial · caché de Galería</dd></div>
          <div><dt>MUESTRA VISIBLE</dt><dd>${galleryItems.length} de 45 registros indexados</dd></div>
          <div><dt>ESTADO</dt><dd>Parcialmente recuperado</dd></div>
        </dl>
      </div>
    </details>
    <div class="photo-modal" id="photo-modal" hidden></div>
  </article>`;
}

function galleryStateLabel(state){
  return state==='complete'?'RECUPERADA':state==='damaged'?'DAÑADA':'NO RECUPERABLE';
}

function galleryCard(item,index){
  return `<button class="gallery-card ${item.state}" data-photo="${index}" data-gallery-state="${item.state}" type="button">
    <div class="photo">${item.src?`<img src="${item.src}" alt="${item.location}" loading="lazy">`:''}<span class="gallery-index">${String(index+1).padStart(2,'0')}</span></div>
    <div class="gallery-card-copy"><p>${item.name}</p><small>${item.location}</small></div>
    <span class="gallery-status">${galleryStateLabel(item.state)}</span>
  </button>`;
}

function renderSearch(){
  return `<section class="app-page chrome-app" style="padding:0">
    <div class="chrome-top">
      ${heading('AR-06-05','Historial de Chrome','127 resultados · 103 únicos')}
      <label class="chrome-search"><span>⌕</span><input id="history-filter" placeholder="Buscar en el historial" autocomplete="off"></label>
    </div>
    <div class="history-list" id="history-list">${searchRows(searches)}</div>
    <section class="chrome-results-view" id="chrome-results-view" hidden></section>
  </section>`;
}
function searchRows(rows){
  return rows.length?rows.map(([time,text])=>`<button class="history-row" data-history-query="${escapeMarkup(text)}" type="button"><time>${time}</time><i>G</i><span>${escapeMarkup(text)}</span><b>☆</b></button>`).join(''):'<p class="history-empty">No se encontraron coincidencias.</p>';
}

function escapeMarkup(value){
  return String(value).replace(/[&<>"']/g,character=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[character]);
}

const reconstructedSearchCatalog=[
  {
    match:/ramen|cerveza|comida|mercado|izakaya|sushi/i,
    results:[
      ['www.japan-guide.com / gastronomia','Gastronomía japonesa: platos y lugares que merece la pena probar','Una introducción a los sabores de Japón, desde el ramen regional hasta los mercados y pequeños izakaya.'],
      ['matcha-jp.com / food','Dónde comer como un local durante un viaje por Japón','Barrios, horarios y recomendaciones para encontrar restaurantes sin perderse entre tantas opciones.'],
      ['tokyocheapo.com / food','Guía práctica para comer bien en Japón','Opciones asequibles, normas básicas y consejos para pedir incluso cuando la carta no está traducida.']
    ]
  },
  {
    match:/bici|bicicleta|ciclista|carril/i,
    results:[
      ['www.japan.travel / ciclismo','Viajar en bicicleta por Japón','Rutas urbanas y paisajísticas, normas de circulación y lugares donde alquilar una bicicleta.'],
      ['cyclekyoto.com / rutas','Rutas recomendadas en bicicleta por Kioto','Recorridos junto al río y conexiones tranquilas entre templos, barrios y bosques.'],
      ['tokyobike.com / guide','Moverse en bicicleta por Tokio','Aparcamiento, seguridad y consejos para circular por una de las ciudades más grandes del mundo.']
    ]
  },
  {
    match:/hotel|ryokan|cápsula|capsula|alojamiento/i,
    results:[
      ['www.japan.travel / alojamiento','Dónde alojarse en Japón','Diferencias entre hoteles, ryokan, minshuku y alojamientos cápsula.'],
      ['www.japan-guide.com / ryokan','Cómo es dormir en un ryokan japonés','Tatami, futón, cena kaiseki y las normas que conviene conocer antes de llegar.'],
      ['booking.example / japon','Alojamientos recomendados por zonas','Comparativa orientativa de barrios, conexiones y tipos de estancia para preparar la ruta.']
    ]
  },
  {
    match:/templo|fushimi|senso|kinkaku|kiyomizu|nara|ciervo|hiroshima|miyajima|hakone|fuji|osaka/i,
    results:[
      ['www.japan.travel / destinos','Lugares imprescindibles de Japón','Información para visitar templos, santuarios, parques y enclaves históricos del país.'],
      ['www.japan-guide.com / itinerarios','Cómo organizar una ruta entre Tokio, Kioto y los alrededores','Tiempos de visita, transporte y recomendaciones para combinar los principales destinos.'],
      ['matcha-jp.com / cultura','Tradición, naturaleza y patrimonio japonés','Una selección de lugares para descubrir Japón más allá de sus grandes ciudades.']
    ]
  },
  {
    match:/suica|pasmo|jr pass|shinkansen|tren|transporte|moverse|vuelo|cabina|maleta|equipaje/i,
    results:[
      ['www.japan.travel / transporte','Cómo moverse por Japón','Trenes, tarjetas de transporte, reservas y consejos prácticos para enlazar ciudades.'],
      ['www.japan-guide.com / rail','Shinkansen y trenes japoneses: guía de uso','Tipos de servicio, equipaje, asientos reservados y cómo localizar el vagón correcto.'],
      ['tokyocheapo.com / transport','Suica, Pasmo y billetes de transporte','Qué tarjeta elegir, cómo recargarla y en qué medios de transporte puede utilizarse.']
    ]
  }
];

function reconstructedResults(query){
  const category=reconstructedSearchCatalog.find(item=>item.match.test(query));
  if(category)return category.results;
  return [
    ['www.japan.travel / es','Viaje a Japón: información oficial para preparar la visita',`Información y recomendaciones relacionadas con «${query}» para organizar un viaje por Japón.`],
    ['www.japan-guide.com','Guía de Japón: destinos, transporte y cultura','Consejos detallados, itinerarios y datos prácticos para descubrir el país.'],
    ['matcha-jp.com / es','Ideas para conocer el Japón cotidiano','Lugares, costumbres y experiencias para preparar una ruta con calma.']
  ];
}

function renderSearchResults(query){
  const safeQuery=escapeMarkup(query);
  return `<div class="chrome-browser-bar">
      <button data-close-search-results type="button" aria-label="Volver al historial">‹</button>
      <form class="chrome-query-form" id="chrome-query-form">
        <span>G</span><input id="chrome-query" value="${safeQuery}" aria-label="Consulta">
        <button type="submit" aria-label="Buscar">⌕</button>
      </form>
    </div>
    <div class="google-results">
      <div class="google-brand" aria-label="Google"><b>G</b><b>o</b><b>o</b><b>g</b><b>l</b><b>e</b></div>
      <nav><span class="active">Todo</span><span>Imágenes</span><span>Maps</span><span>Noticias</span></nav>
      <p class="result-count">Aproximadamente 127 resultados recuperados</p>
      <h2>${safeQuery}</h2>
      ${reconstructedResults(query).map(([url,title,description])=>`<article class="google-result">
        <small>${url}</small>
        <h3>${title}</h3>
        <p>${description}</p>
      </article>`).join('')}
      <aside class="recovery-search-note"><b>EXTRACCIÓN PARCIAL</b><span>Los resultados han sido reconstruidos desde la caché del dispositivo. Algunos enlaces originales ya no están disponibles.</span></aside>
    </div>`;
}

function openSearchResults(query){
  const view=$('#chrome-results-view');
  if(!view||!query.trim())return;
  view.innerHTML=renderSearchResults(query.trim());
  view.hidden=false;
  view.scrollTop=0;
  view.querySelector('#chrome-query-form').addEventListener('submit',event=>{
    event.preventDefault();
    openSearchResults(view.querySelector('#chrome-query').value);
  });
  view.querySelector('[data-close-search-results]').addEventListener('click',closeSearchResults);
}

function closeSearchResults(){
  const view=$('#chrome-results-view');
  if(view)view.hidden=true;
}

function renderHealth(){
  return `<section class="app-page" style="padding:0">
    <div class="health-layout">
      <header class="health-hero"><p>AR-06-06 · SAMSUNG HEALTH</p><strong>642.718</strong><span>pasos recuperados · 29/08–24/09/2025</span></header>
      <div class="metric-grid">
        <article class="metric"><p>Distancia total</p><b>458,7 km</b></article>
        <article class="metric"><p>Calorías activas</p><b>31.482</b></article>
        <article class="metric"><p>Tiempo activo</p><b>81 h 47</b></article>
        <article class="metric"><p>Promedio diario</p><b>26.780</b></article>
      </div>
      <div class="chart-stack">
        <article class="chart-card"><h3>Evolución diaria de pasos</h3><div class="bars">${healthBars.map(value=>`<i style="height:${value/50*100}%"></i>`).join('')}</div></article>
        <article class="chart-card split"><div class="donut"></div><div class="legend"><span style="--dot:#67a052">Caminar 72 %</span><span style="--dot:#3577a6">Ciclismo 13 %</span><span style="--dot:#d58731">Entrenamiento 9 %</span><span style="--dot:#806294">Otros 6 %</span></div></article>
        <article class="chart-card"><h3>Actividades destacadas</h3><ul class="activities">
          <li><b>Fushimi Inari · caminata larga</b><small>18,74 km · 29.386 pasos · 4 h 12 min</small></li>
          <li><b>Arashiyama · ruta en bicicleta</b><small>31,62 km · 2 h 08 min</small></li>
          <li><b>Tokio · Shinjuku–Asakusa</b><small>22,11 km · 33.912 pasos · 5 h 03 min</small></li>
          <li><b>Monte Fuji · subida</b><small>16,38 km · 27.441 pasos · 6 h 27 min</small></li>
        </ul></article>
      </div>
    </div>
  </section>`;
}

function renderLost(){
  return `<article class="app-page">
    ${heading('AR-06-07','Archivos irrecuperables','37 archivos · 29 % del total')}
    <div class="lost-summary"><div><b>15</b><small>IMÁGENES</small></div><div><b>7</b><small>VÍDEOS</small></div><div><b>6</b><small>AUDIOS</small></div><div><b>9</b><small>DOCUMENTOS</small></div></div>
    <div class="file-toolbar"><span>Memoria interna / Tarjeta SD</span><select id="file-filter"><option value="">Todos</option><option>Imagen</option><option>Vídeo</option><option>Audio</option><option>Documento</option></select></div>
    <div class="file-list" id="file-list">${fileRows(lostFiles)}</div>
    <div class="failure-modal" id="failure-modal" hidden></div>
  </article>`;
}
function fileRows(rows){
  return rows.map(row=>`<button class="file-row" data-file="${lostFiles.indexOf(row)}" type="button"><span class="type-icon">${iconForType[row[2]]}</span><span><strong>${row[1]}</strong><small>${row[0]} · ${row[3]} · ${row[4]}</small></span><em>×</em></button>`).join('');
}

function openKtb(fromHistory=false){
  currentApp='ktb';if(!recent.includes('ktb'))recent.unshift('ktb');
  home.hidden=true;recentsView.hidden=true;appView.hidden=false;
  $('#app-header-icon').innerHTML=appIcon('ktb');$('#app-header-icon').style.background='#8c742e';
  $('#app-code').textContent='KTB-012';$('#app-title').textContent='KIZUNA';$('#app-integrity').textContent='SEGURO';
  if(reviewed.size<apps.length){
    appContent.innerHTML=`<section class="acta-lock"><div class="lock-card"><span>⌁</span><h2>Acta protegida.</h2><p>La reanudación sólo puede consultarse cuando todas las evidencias extraídas hayan sido examinadas.</p><div class="review-checklist">${apps.map(app=>`<div><span>${app.code} · ${app.title}</span><b>${reviewed.has(app.id)?'REVISADA':'PENDIENTE'}</b></div>`).join('')}</div><p>${reviewed.size} DE ${apps.length} EVIDENCIAS REVISADAS</p></div></section>`;
  }else{
    appContent.innerHTML=`<article class="acta"><span class="code">KTB-012</span><span class="seal">ARCHIVO<br>TEMPORAL</span><h2>Acta de reanudación del expediente</h2><h3>ARCHIVO KIZUNA // DIVISIÓN DE ARCHIVOS TEMPORALES</h3><p>Estimado Jose:</p><p>La consulta de la totalidad de los <b>ARCHIVOS RECUPERADOS</b> ha concluido correctamente. La información contenida en dichos archivos ha sido incorporada a la reconstrucción del expediente y validada por los sistemas de KIZUNA.</p><p>El nivel de comprensión requerido para continuar con el expediente ha sido alcanzado.</p><div class="acta-grid"><div><small>ESTADO ANTERIOR</small><b>INTERRUMPIDO</b><small>durante la revisión</small></div><div><small>ESTADO ACTUAL</small><b>REANUDADO</b><small>acceso autorizado</small></div></div><p>Se autoriza la reanudación del expediente PROJECT JAPAN. El destinatario queda habilitado para continuar a partir del siguiente documento:</p><h3>KTB-013 · ANÁLISIS DE RIESGO TEMPORAL</h3><blockquote>«El camino no se ve, se recuerda.»</blockquote><button id="close-acta" type="button">VOLVER AL DISPOSITIVO</button></article>`;
  }
  if(!fromHistory)syncUrl('ktb');
  $('#close-acta')?.addEventListener('click',showHome);
}

function recoveryDialogMarkup(stage,progress=12){
  if(stage==='scan')return `<p class="recovery-kicker">SISTEMA DE RECUPERACIÓN KIZUNA</p>
    <h2>Analizando integridad del dispositivo...</h2>
    <div class="recovery-progress"><i><b style="width:${progress}%"></b></i><strong>${progress} %</strong></div>`;
  if(stage==='detected')return `<p class="recovery-kicker">SISTEMA DE RECUPERACIÓN KIZUNA</p>
    <span class="recovery-warning">!</span><h2>Anomalía detectada.</h2>
    <p>Se ha localizado un módulo que no figura en el índice del dispositivo recuperado.</p>
    <button data-anomaly-action="analyze" type="button">Analizar</button>`;
  return `<p class="recovery-kicker">INFORME DE INTEGRIDAD</p>
    <span class="recovery-safe">✓</span><h2>Módulo estable.</h2>
    <p>El módulo no presenta riesgo para la integridad del expediente.</p>
    <p>Se recomienda documentar su contenido antes de continuar.</p>
    <button data-anomaly-action="open" type="button">Abrir módulo</button>`;
}

function beginRecoveryAnomaly(){
  if(anomalyState!=='pending')return;
  const overlay=$('#recovery-anomaly');
  const dialog=$('#recovery-dialog');
  anomalyLater(()=>{
    anomalyState='scanning';
    screen.classList.add('is-recovery-frozen');
    overlay.hidden=false;
    overlay.classList.add('is-visible');
    let step=0;
    const values=[12,41,73,100];
    const advance=()=>{
      dialog.innerHTML=recoveryDialogMarkup('scan',values[step]);
      step++;
      if(step<values.length)anomalyLater(advance,330);
      else anomalyLater(()=>{
        overlay.classList.remove('is-visible');
        anomalyLater(()=>{
          dialog.innerHTML=recoveryDialogMarkup('detected');
          overlay.classList.add('is-visible');
          anomalyState='dialog';
        },1000);
      },430);
    };
    advance();
  },2000);
}

function revealResidualModule(){
  const overlay=$('#recovery-anomaly');
  overlay.classList.remove('is-visible');
  anomalyLater(()=>{
    overlay.hidden=true;
    screen.classList.remove('is-recovery-frozen');
    residualRevealed=true;
    anomalyState='ready';
    residualButton.hidden=false;
    residualButton.classList.remove('is-revealed');
    requestAnimationFrame(()=>residualButton.classList.add('is-revealed'));
    updateProgress();
  },260);
}

function addMemoryMessage(text,{accent=false}={}){
  const list=$('#memory-messages');
  if(!list)return;
  const row=document.createElement('p');
  row.className=`memory-message${accent?' is-anomaly':''}`;
  row.textContent=text;
  list.append(row);
  requestAnimationFrame(()=>row.classList.add('is-visible'));
  list.scrollTo({top:list.scrollHeight,behavior:'smooth'});
}

function startMemoryModule(){
  const boot=$('#memory-boot');
  const line=$('#memory-boot-line');
  const integrity=$('#memory-integrity');
  if(!boot||!line)return;
  anomalyState='running';
  const bootLines=['Inicializando...','Canal recuperado.','Restaurando conversación...'];
  let index=0;
  const nextBootLine=()=>{
    line.classList.remove('is-visible');
    anomalyLater(()=>{
      line.textContent=bootLines[index++];
      line.classList.add('is-visible');
      if(index<bootLines.length)anomalyLater(nextBootLine,820);
      else anomalyLater(()=>{
        integrity.hidden=false;
        requestAnimationFrame(()=>integrity.classList.add('is-visible'));
        anomalyLater(()=>{
          boot.classList.add('is-complete');
          anomalyLater(()=>{
            boot.hidden=true;
            const chat=$('#memory-chat');
            chat.hidden=false;
            requestAnimationFrame(()=>chat.classList.add('is-visible'));
            addMemoryMessage('Si estás leyendo esto...');
          },420);
        },1200);
      },820);
    },180);
  };
  nextBootLine();
}

const memorySequence=[
  '...es porque has conseguido llegar hasta aquí.',
  'Eso significa que has revisado todas las aplicaciones del dispositivo.',
  'Perfecto.',
  'Entonces todo está ocurriendo exactamente igual que la primera vez.',
  'Si entiendes esta frase ahora...',
  'Todavía es demasiado pronto.',
  'Si no la entiendes...',
  'Es exactamente lo que esperaba.',
  'No puedo decirte quién soy.',
  'Ni puedo explicarte por qué este mensaje está aquí.',
  'Si lo hiciera...',
  'Alteraría el propósito del expediente.',
  'Sigue leyendo.',
  'Confía en KIZUNA.',
  'Cuando llegues al final...',
  'Comprenderás por qué tenía que encontrarte aquí.',
  'Hasta entonces...',
  'Gracias por volver.'
];

function playMemoryConversation(){
  $('#memory-actions').hidden=true;
  let index=0;
  const next=()=>{
    const list=$('#memory-messages');
    if(!list)return;
    const typing=document.createElement('p');
    typing.className='memory-typing';
    typing.innerHTML='<i></i><i></i><i></i>';
    list.append(typing);
    list.scrollTo({top:list.scrollHeight,behavior:'smooth'});
    anomalyLater(()=>{
      typing.remove();
      const text=memorySequence[index++];
      addMemoryMessage(text,{accent:text.includes('primera vez')||text==='Gracias por volver.'});
      if(index<memorySequence.length)anomalyLater(next,text.length>60?1300:920);
      else anomalyLater(finishMemoryConversation,1800);
    },580);
  };
  next();
}

function finishMemoryConversation(){
  const chat=$('#memory-chat');
  chat.classList.remove('is-visible');
  anomalyLater(()=>{
    chat.hidden=true;
    const finished=$('#memory-finished');
    finished.hidden=false;
    requestAnimationFrame(()=>finished.classList.add('is-visible'));
  },520);
}

function consumeResidualModule(){
  residualConsumed=true;
  residualRevealed=false;
  anomalyState='consumed';
  residualButton.hidden=true;
  residualButton.classList.remove('is-revealed');
  updateProgress();
  const recentIndex=recent.indexOf('residual');
  if(recentIndex>=0)recent.splice(recentIndex,1);
  clearAnomalyTimers();
  showHome();
}

function showToast(message,{title='Sistema del dispositivo',icon='i'}={}){
  const toast=$('#toast');
  $('#toast-title').textContent=title;
  $('#toast-message').textContent=message;
  $('#toast-icon').textContent=icon;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>toast.classList.remove('show'),3200);
}

function bindAppInteractions(id){
  if(id==='mail'){
    const showMailScreen=name=>document.querySelectorAll('[data-mail-screen]').forEach(section=>{section.hidden=section.dataset.mailScreen!==name});
    document.querySelectorAll('[data-mail-folder]').forEach(button=>button.addEventListener('click',()=>showMailScreen(button.dataset.mailFolder)));
    document.querySelectorAll('[data-mail-back]').forEach(button=>button.addEventListener('click',()=>showMailScreen(button.dataset.mailBack)));
    $('[data-open-mail]')?.addEventListener('click',()=>showMailScreen('message'));
  }
  if(id==='music'){
    $('[data-music-toggle]')?.addEventListener('click',event=>{
      const card=event.currentTarget.closest('.album-card');
      const player=card.querySelector('[data-music-player]');
      const note=card.querySelector('[data-music-note]');
      const playing=card.classList.toggle('is-playing');
      if(playing){
        player.hidden=false;
        note.hidden=false;
        player.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/5XBYEQYBUdA?autoplay=1&playsinline=1&rel=0&list=RD5XBYEQYBUdA" title="Playlist Project Japan" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
      }else{
        player.innerHTML='';
        player.hidden=true;
        note.hidden=true;
      }
      event.currentTarget.querySelector('span').textContent=playing?'×':'▶';
      event.currentTarget.querySelector('b').textContent=playing?'CERRAR REPRODUCTOR':'REPRODUCIR PLAYLIST';
    });
  }
  if(id==='phone'){
    const showPhonePanel=name=>{
      document.querySelectorAll('[data-phone-panel]').forEach(panel=>{panel.hidden=panel.dataset.phonePanel!==name});
      document.querySelectorAll('[data-phone-tab]').forEach(button=>button.classList.toggle('active',button.dataset.phoneTab===name));
      $('#contact-card').hidden=true;
    };
    document.querySelectorAll('[data-phone-tab]').forEach(button=>button.addEventListener('click',()=>showPhonePanel(button.dataset.phoneTab)));
    $('[data-open-contact]')?.addEventListener('click',()=>{document.querySelectorAll('[data-phone-panel]').forEach(panel=>{panel.hidden=true});$('#contact-card').hidden=false});
    $('[data-close-contact]')?.addEventListener('click',()=>showPhonePanel('contacts'));
    const finishCall=(message='LLAMADA FINALIZADA')=>{
      clearCallTimers();
      $('#call-status').textContent=message;
      $('#call-time').textContent='00:00';
      callTimers.push(setTimeout(()=>{
        $('#call-screen').hidden=true;
        $('#contact-card').hidden=false;
      },1100));
    };
    $('[data-start-call]')?.addEventListener('click',()=>{
      $('#contact-card').hidden=true;
      $('#call-screen').hidden=false;
      $('#call-status').textContent='LLAMANDO…';
      $('#call-time').textContent='00:00';
      callTimers.push(
        setTimeout(()=>{$('#call-status').textContent='CONECTANDO CANAL…';$('#call-time').textContent='00:02'},1600),
        setTimeout(()=>{$('#call-status').textContent='SIN RESPUESTA';$('#call-time').textContent='00:05'},4300),
        setTimeout(()=>finishCall('LLAMADA FINALIZADA · SIN RESPUESTA'),5900)
      );
    });
    $('[data-hang-call]')?.addEventListener('click',()=>finishCall());
  }
  if(id==='settings'){
    appContent.querySelectorAll('.settings-list button').forEach(button=>button.addEventListener('click',()=>{
      button.classList.toggle('is-open');
      const title=button.querySelector('b');
      const detail=button.querySelector('small');
      const icon=button.querySelector(':scope > span');
      showToast(detail.textContent,{title:title.textContent,icon:icon.textContent});
    }));
  }
  if(id==='timeline'){
    appContent.addEventListener('click',event=>{
      const target=event.target.closest('[data-location]');if(!target)return;
      const index=Number(target.dataset.location);const item=locations[index];
      appContent.querySelectorAll('[data-location]').forEach(el=>el.classList.toggle('active',Number(el.dataset.location)===index));
      $('#location-detail').innerHTML=locationDetail(item,index);
      appContent.querySelector(`.timeline-list [data-location="${index}"]`)?.scrollIntoView({block:'nearest',behavior:'smooth'});
      if(item.type==='damage'&&index>=locations.length-3)$('#analyst-report').open=true;
    });
    $('#timeline-toggle')?.addEventListener('click',event=>{
      const list=$('#timeline-list');const expanded=list.hidden;
      list.hidden=!expanded;event.currentTarget.setAttribute('aria-expanded',String(expanded));
      event.currentTarget.innerHTML=`${expanded?'OCULTAR':'VER'} CRONOLOGÍA COMPLETA <span>${expanded?'−':'＋'}</span>`;
    });
  }
  if(id==='routes'){
    appContent.addEventListener('click',event=>{
      const button=event.target.closest('[data-route]');if(!button)return;
      const index=Number(button.dataset.route);appContent.querySelectorAll('[data-route]').forEach(el=>el.classList.toggle('active',el===button));
      $('#route-detail').innerHTML=routeDetail(routes[index],index);
      if(index===routes.length-1)$('#routes-analyst-report').open=true;
    });
  }
  if(id==='gallery'){
    const modal=$('#photo-modal');
    const showPhoto=index=>{
      const item=galleryItems[index];
      if(!item)return;
      galleryActiveIndex=index;
      modal.hidden=false;
      modal.innerHTML=`<section class="gallery-viewer ${item.state}" role="dialog" aria-modal="true" aria-label="${item.name}" tabindex="-1">
        <header>
          <div><span>${String(index+1).padStart(2,'0')} / ${galleryItems.length}</span><strong>${item.name}</strong></div>
          <button data-close-modal type="button" aria-label="Cerrar visor">×</button>
        </header>
        <div class="gallery-viewer-image">
          ${item.src?`<img src="${item.src}" alt="${item.location}">`:'<div class="gallery-lost-frame"><i>×</i><strong>ERROR DE LECTURA</strong><span>El contenido visual no pudo reconstruirse.</span></div>'}
          <button data-gallery-prev type="button" aria-label="Imagen anterior">‹</button>
          <button data-gallery-next type="button" aria-label="Imagen siguiente">›</button>
        </div>
        <footer>
          <div class="viewer-state"><span>${galleryStateLabel(item.state)}</span><b>${item.state==='complete'?'ÍNDICE VERIFICADO':item.state==='damaged'?'RECUPERACIÓN PARCIAL':'REGISTRO SIN CONTENIDO'}</b></div>
          <dl>
            <div><dt>FECHA</dt><dd>${item.date}</dd></div>
            <div><dt>UBICACIÓN</dt><dd>${item.location}</dd></div>
          </dl>
          <p>${item.detail}</p>
        </footer>
      </section>`;
      modal.querySelector('.gallery-viewer').focus();
    };
    const stepPhoto=direction=>showPhoto((galleryActiveIndex+direction+galleryItems.length)%galleryItems.length);
    appContent.querySelectorAll('[data-gallery-filter]').forEach(button=>button.addEventListener('click',()=>{
      const filter=button.dataset.galleryFilter;
      appContent.querySelectorAll('[data-gallery-filter]').forEach(item=>item.classList.toggle('active',item===button));
      let visible=0;
      appContent.querySelectorAll('[data-gallery-state]').forEach(card=>{
        const show=filter==='all'||card.dataset.galleryState===filter;
        card.hidden=!show;
        if(show)visible++;
      });
      $('#gallery-result-count').textContent=`${visible} fragmentos visibles`;
    }));
    appContent.addEventListener('click',event=>{
      if(event.target.closest('[data-close-modal]')){modal.hidden=true;return}
      if(event.target.closest('[data-gallery-prev]')){stepPhoto(-1);return}
      if(event.target.closest('[data-gallery-next]')){stepPhoto(1);return}
      const card=event.target.closest('[data-photo]');
      if(card)showPhoto(Number(card.dataset.photo));
    });
    modal.addEventListener('click',event=>{if(event.target===modal)modal.hidden=true});
    modal.addEventListener('touchstart',event=>{galleryTouchStartX=event.changedTouches[0].clientX},{passive:true});
    modal.addEventListener('touchend',event=>{
      const distance=event.changedTouches[0].clientX-galleryTouchStartX;
      if(Math.abs(distance)>55)stepPhoto(distance<0?1:-1);
    },{passive:true});
    modal.addEventListener('keydown',event=>{
      if(event.key==='Escape')modal.hidden=true;
      if(event.key==='ArrowLeft')stepPhoto(-1);
      if(event.key==='ArrowRight')stepPhoto(1);
    });
  }
  if(id==='search'){
    $('#history-filter').addEventListener('input',event=>{
      const value=event.target.value.trim().toLocaleLowerCase('es');$('#history-list').innerHTML=searchRows(searches.filter(row=>row[1].toLocaleLowerCase('es').includes(value)));
    });
    $('#history-filter').addEventListener('keydown',event=>{
      if(event.key==='Enter'){
        event.preventDefault();
        openSearchResults(event.target.value);
      }
    });
    $('#history-list').addEventListener('click',event=>{
      const row=event.target.closest('[data-history-query]');
      if(row)openSearchResults(row.dataset.historyQuery);
    });
  }
  if(id==='lost'){
    $('#file-filter').addEventListener('change',event=>{$('#file-list').innerHTML=fileRows(event.target.value?lostFiles.filter(row=>row[2]===event.target.value):lostFiles)});
    appContent.addEventListener('click',event=>{
      const row=event.target.closest('[data-file]');if(!row)return;
      const file=lostFiles[Number(row.dataset.file)];const modal=$('#failure-modal');modal.hidden=false;
      modal.innerHTML=`<div class="modal-card"><h3>Recuperación imposible.</h3><p>${file[0]} · ${file[1]}</p><p>CAUSA PROBABLE: ${file[5]}. Se requiere una autorización de nivel 4 o superior para intentar una recuperación avanzada.</p><button type="button" data-close-modal>CERRAR INFORME</button></div>`;
      modal.querySelector('[data-close-modal]').onclick=()=>modal.hidden=true;
    });
  }
  if(id==='residual'){
    startMemoryModule();
    appContent.addEventListener('click',event=>{
      if(event.target.closest('[data-memory-continue]'))playMemoryConversation();
      if(event.target.closest('[data-memory-close]'))consumeResidualModule();
    });
  }
}

function goBack(){
  if(currentApp==='residual'&&anomalyState==='running')return;
  clearCallTimers();
  const searchResults=appContent.querySelector('.chrome-results-view:not([hidden])');
  if(searchResults){closeSearchResults();return}
  const modal=appContent.querySelector('.photo-modal:not([hidden]),.failure-modal:not([hidden])');
  if(modal){modal.hidden=true;return}
  if(!recentsView.hidden){showHome();return}
  if(currentApp){showHome();return}
}

document.addEventListener('click',event=>{
  const anomalyAction=event.target.closest('[data-anomaly-action]')?.dataset.anomalyAction;
  if(anomalyAction==='analyze'){
    $('#recovery-dialog').innerHTML=recoveryDialogMarkup('safe');
    return;
  }
  if(anomalyAction==='open'){
    revealResidualModule();
    return;
  }
  const button=event.target.closest('[data-open-app]');if(button)launch(button.dataset.openApp);
});
$('#app-back').addEventListener('click',goBack);
$('#android-back').addEventListener('click',goBack);
$('#android-home').addEventListener('click',()=>{
  if(currentApp==='residual'&&anomalyState==='running')return;
  showHome();
});
$('#android-recents').addEventListener('click',showRecents);
window.addEventListener('popstate',event=>{const id=event.state?.app||new URL(location.href).searchParams.get('app');id&&id!=='home'?launch(id,{fromHistory:true}):showHome({fromHistory:true})});

function bootRecoveredDevice(){
  if(initialBooted)return;
  initialBooted=true;
  const initial=query.get('app');
  if(initial)launch(initial,{fromHistory:true});
  else{
    playHomeEntrance();
    setTimeout(()=>showEvidenceProgress(),850);
  }
  if(reviewed.size===apps.length&&anomalyState==='idle'){
    anomalyState='pending';
    anomalyLater(()=>{
      $('#toast').classList.remove('show');
      showHome();
      beginRecoveryAnomaly();
    },2300);
  }
}

function applyRecoveredDeviceState(payload={}){
  clearTimeout(progressFallbackTimer);
  const inFlightState=['pending','scanning','dialog'].includes(anomalyState)?anomalyState:null;
  const validIds=new Set(apps.map(app=>app.id));
  const incoming=Array.isArray(payload.reviewedIds)?payload.reviewedIds:[];
  [...reviewed,...incoming].filter(id=>validIds.has(id)).forEach(id=>reviewed.add(id));
  const stateRank={locked:0,available:1,consumed:2};
  const incomingState=stateRank[payload.moduleState]===undefined?'locked':payload.moduleState;
  const moduleState=reviewed.size===apps.length&&stateRank[incomingState]>=stateRank[currentModuleState()]?incomingState:currentModuleState();
  residualConsumed=moduleState==='consumed';
  residualRevealed=moduleState==='available';
  anomalyState=residualConsumed?'consumed':residualRevealed?'ready':inFlightState||'idle';
  residualButton.hidden=!residualRevealed;
  residualButton.classList.toggle('is-revealed',residualRevealed);
  progressHydrated=true;
  document.body.classList.remove('device-access-pending');
  $('#device-access-gate')?.remove();
  updateProgress({emit:false});
  bootRecoveredDevice();
  if(initialBooted&&reviewed.size===apps.length&&anomalyState==='idle'){
    anomalyState='pending';
    anomalyLater(()=>{
      $('#toast').classList.remove('show');
      showHome();
      beginRecoveryAnomaly();
    },2300);
  }
}

window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='kizuna:recovered-device-state')return;
  applyRecoveredDeviceState(event.data);
});

if(embedded){
  window.parent.postMessage({type:'kizuna:recovered-device-ready'},location.origin);
  progressFallbackTimer=setTimeout(()=>{
    const gate=$('#device-access-gate');
    if(!gate)return;
    gate.classList.add('is-delayed');
    gate.querySelector('h1').textContent='Autorización pendiente.';
    gate.querySelector('span').textContent='Abre el dispositivo desde la tarjeta AR-06 del expediente.';
  },6000);
}else{
  bootRecoveredDevice();
  updateProgress({emit:false});
}
syncDeviceViewport();
window.addEventListener('resize',syncDeviceViewport,{passive:true});
window.visualViewport?.addEventListener('resize',syncDeviceViewport,{passive:true});
}
