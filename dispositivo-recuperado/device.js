import {apps,locations,routes,galleryItems,searches,lostFiles} from './evidence-data.js?v=20260730-device-dock01';

const $=selector=>document.querySelector(selector);
const query=new URLSearchParams(location.search);
if(query.has('embedded')){
  document.body.classList.add('is-embedded');
}
const screen=$('#device-screen');
const home=$('#home-screen');
const appView=$('#app-view');
const recentsView=$('#recents-view');
const appContent=$('#app-content');
const reviewed=new Set();
const recent=[];
const systemApps=[
  {id:'mail',code:'SISTEMA · MENSAJES',title:'Correo',subtitle:'Enviados',icon:'✉',color:'#315b84',state:'RECUPERADO'},
  {id:'music',code:'SISTEMA · AUDIO',title:'Música',subtitle:'Playlist',icon:'♪',color:'#923f54',state:'ENLACE'},
  {id:'phone',code:'SISTEMA · TELEFONÍA',title:'Teléfono',subtitle:'Alberto',icon:'☎',color:'#31785b',state:'SIN SEÑAL'},
  {id:'settings',code:'SISTEMA · ANDROID 12',title:'Ajustes',subtitle:'SM-G991B',icon:'⚙',color:'#56636b',state:'SISTEMA'}
];
const residualApp={id:'residual',code:'APLICACIÓN RECONSTRUIDA',title:'Desconocida',subtitle:'Definición pendiente',icon:'◇',color:'#9e302d',state:'NUEVA'};
let currentApp=null;
let galleryActiveIndex=-1;
let galleryTouchStartX=0;
let residualRevealed=false;
let callTimers=[];

const iconForType={Imagen:'▧',Vídeo:'▷',Audio:'♩',Documento:'▤'};
const healthBars=[31,34,29,25,28,40,31,37,34,33,27,31,29,41,36,33,45,50,47,42,38,32,18,46,49,34,31,27];

function appButton(app){
  return `<button class="app-button" data-open-app="${app.id}" style="--app-color:${app.color}" type="button">
    <span>${app.icon}</span><b>${app.title}</b><small>${app.subtitle}</small>
  </button>`;
}

$('#app-grid').innerHTML=apps.map(appButton).join('')+appButton({...residualApp,hidden:true});
const residualButton=$('[data-open-app="residual"]');
residualButton.hidden=true;
residualButton.classList.add('residual-app');
$('#system-dock').innerHTML=systemApps.map(app=>`<button data-open-app="${app.id}" style="--dock-color:${app.color}" type="button"><span>${app.icon}</span><small>${app.title}</small></button>`).join('');

function setClock(){
  $('#device-clock').textContent=new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit'}).format(new Date());
}
setClock();
setInterval(setClock,30000);

function updateProgress(){
  $('#review-count').textContent=reviewed.size;
  if(reviewed.size===apps.length&&!residualRevealed){
    residualRevealed=true;
    residualButton.hidden=false;
    residualButton.classList.add('is-revealed');
    showToast('Se ha reconstruido una aplicación no identificada.');
  }
}

function clearCallTimers(){
  callTimers.forEach(timer=>clearTimeout(timer));
  callTimers=[];
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
  if(id==='ktb') return openKtb(fromHistory);
  clearCallTimers();
  const app=appMeta(id);
  if(!app) return showHome();
  if(id==='residual'&&!residualRevealed){
    showToast('La aplicación todavía no ha podido reconstruirse.');
    return showHome();
  }
  currentApp=id;
  if(apps.some(item=>item.id===id)) reviewed.add(id);
  if(!recent.includes(id)) recent.unshift(id);
  if(recent.length>5) recent.pop();
  updateProgress();
  home.hidden=true;
  recentsView.hidden=true;
  appView.hidden=false;
  appView.style.setProperty('--app-color',app.color);
  $('#app-header-icon').textContent=app.icon;
  $('#app-header-icon').style.background=app.color;
  $('#app-code').textContent=app.code;
  $('#app-title').textContent=app.title;
  $('#app-integrity').textContent=Number.isFinite(app.integrity)?`${app.integrity} %`:app.state;
  if(id==='whatsapp'){
    appContent.innerHTML='<iframe class="whatsapp-frame" title="Conversación recuperada con José" src="../conversacion/index.html?embedded=1"></iframe>';
  }else{
    appContent.innerHTML=renderApp(id);
    bindAppInteractions(id);
  }
  appContent.scrollTop=0;
  if(!fromHistory) syncUrl(id);
}

function showHome({fromHistory=false}={}){
  clearCallTimers();
  currentApp=null;
  appView.hidden=true;
  recentsView.hidden=true;
  home.hidden=false;
  if(!fromHistory) syncUrl('home');
}

function showRecents(){
  home.hidden=true;appView.hidden=true;recentsView.hidden=false;
  $('#recents-list').innerHTML=recent.length?recent.map(id=>{
    const app=appMeta(id)||{id:'ktb',title:'KIZUNA',subtitle:'Acta de reanudación',icon:'✦',color:'#8c742e'};
    return `<button class="recent-card" data-open-app="${id}" style="--recent-color:${app.color}" type="button">
      <span>${app.icon}</span><strong>${app.title}</strong><small>${app.subtitle}</small>
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
    <header class="system-hero"><p>CARPETA LOCAL · 1 ELEMENTO</p><h2>Enviados</h2><span>Mensajes recuperados parcialmente</span></header>
    <button class="mail-row" data-open-mail type="button">
      <span>JC</span><div><strong>Comité KIZUNA</strong><b>Sobre la expedición</b><small>24 sep · 22:14</small></div><i>›</i>
    </button>
    <section class="mail-corrupt" id="mail-corrupt" hidden>
      <header><button data-close-mail type="button">‹</button><div><p>DE: José</p><strong>Sobre la expedición</strong><span>PARA: COMITÉ KIZUNA</span></div></header>
      <div class="corrupt-body"><i>!</i><h3>Contenido no recuperable.</h3><p>La cabecera del mensaje se conserva, pero el cuerpo fue sobrescrito antes de la extracción.</p><code>ERR_BODY_FRAGMENT · 0x06A1</code></div>
    </section>
  </article>`;
}

function renderMusic(){
  return `<article class="system-page music-app">
    <header class="system-hero"><p>LISTA RECUPERADA · ENLACE EXTERNO</p><h2>Música</h2><span>Selección guardada para el viaje</span></header>
    <section class="album-card">
      <div class="album-art"><span>日本</span><i></i></div>
      <p>PLAYLIST DE JOSÉ</p><h3>Project Japan</h3><span>Reproducción externa · YouTube</span>
      <div class="music-wave" aria-hidden="true">${Array.from({length:24},(_,i)=>`<i style="--h:${18+(i*17)%64}%"></i>`).join('')}</div>
      <button class="music-preview" data-music-toggle type="button"><span>▶</span><b>PREVISUALIZAR INTERFAZ</b></button>
      <a href="https://www.youtube.com/watch?v=5XBYEQYBUdA&list=RD5XBYEQYBUdA&start_radio=1" target="_blank" rel="noopener">ABRIR PLAYLIST EN YOUTUBE ↗</a>
    </section>
  </article>`;
}

function renderPhone(){
  return `<article class="system-page phone-app">
    <header class="system-hero"><p>REGISTRO DE CONTACTOS</p><h2>Teléfono</h2><span>Red móvil no disponible</span></header>
    <section class="contact-card" id="contact-card">
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
    <p class="settings-footnote">Los cambios realizados en esta simulación no se conservan.</p>
  </article>`;
}

function renderResidual(){
  return `<article class="system-page residual-page">
    <div class="residual-symbol">◇</div><p>APLICACIÓN RECONSTRUIDA</p><h2>Identidad pendiente.</h2>
    <span>Se han localizado fragmentos ejecutables después de revisar las siete evidencias del dispositivo.</span>
    <div><i></i><b>DEFINICIÓN PENDIENTE</b><small>Este espacio queda preparado para la siguiente fase de diseño.</small></div>
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
  return `<section class="app-page" style="padding:0">
    <div class="chrome-top">
      ${heading('AR-06-05','Historial de Chrome','127 resultados · 103 únicos')}
      <label class="chrome-search"><span>⌕</span><input id="history-filter" placeholder="Buscar en el historial" autocomplete="off"></label>
    </div>
    <div class="history-list" id="history-list">${searchRows(searches)}</div>
  </section>`;
}
function searchRows(rows){
  return rows.length?rows.map(([time,text])=>`<div class="history-row"><time>${time}</time><i>G</i><span>${text}</span><b>☆</b></div>`).join(''):'<p class="history-empty">No se encontraron coincidencias.</p>';
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
  $('#app-header-icon').textContent='✦';$('#app-header-icon').style.background='#8c742e';
  $('#app-code').textContent='KTB-012';$('#app-title').textContent='KIZUNA';$('#app-integrity').textContent='SEGURO';
  if(reviewed.size<apps.length){
    appContent.innerHTML=`<section class="acta-lock"><div class="lock-card"><span>⌁</span><h2>Acta protegida.</h2><p>La reanudación sólo puede consultarse cuando todas las evidencias extraídas hayan sido examinadas durante esta sesión.</p><div class="review-checklist">${apps.map(app=>`<div><span>${app.code} · ${app.title}</span><b>${reviewed.has(app.id)?'REVISADA':'PENDIENTE'}</b></div>`).join('')}</div><p>${reviewed.size} DE ${apps.length} EVIDENCIAS REVISADAS</p></div></section>`;
  }else{
    appContent.innerHTML=`<article class="acta"><span class="code">KTB-012</span><span class="seal">ARCHIVO<br>TEMPORAL</span><h2>Acta de reanudación del expediente</h2><h3>ARCHIVO KIZUNA // DIVISIÓN DE ARCHIVOS TEMPORALES</h3><p>Estimado Jose:</p><p>La consulta de la totalidad de los <b>ARCHIVOS RECUPERADOS</b> ha concluido correctamente. La información contenida en dichos archivos ha sido incorporada al contexto operativo y validada por los sistemas de KIZUNA.</p><p>El nivel de comprensión requerido para continuar con el expediente ha sido alcanzado.</p><div class="acta-grid"><div><small>ESTADO ANTERIOR</small><b>INTERRUMPIDO</b><small>durante la revisión</small></div><div><small>ESTADO ACTUAL</small><b>REANUDADO</b><small>acceso autorizado</small></div></div><p>Se autoriza la reanudación del expediente PROJECT JAPAN. El destinatario queda habilitado para continuar a partir del siguiente documento:</p><h3>KTB-013 · ANÁLISIS DE RIESGO TEMPORAL</h3><blockquote>«El camino no se ve, se recuerda.»</blockquote><button id="close-acta" type="button">VOLVER AL DISPOSITIVO</button></article>`;
  }
  if(!fromHistory)syncUrl('ktb');
  $('#close-acta')?.addEventListener('click',showHome);
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
    const message=$('#mail-corrupt');
    $('[data-open-mail]')?.addEventListener('click',()=>{message.hidden=false});
    $('[data-close-mail]')?.addEventListener('click',()=>{message.hidden=true});
  }
  if(id==='music'){
    $('[data-music-toggle]')?.addEventListener('click',event=>{
      const playing=event.currentTarget.closest('.album-card').classList.toggle('is-playing');
      event.currentTarget.querySelector('span').textContent=playing?'Ⅱ':'▶';
      event.currentTarget.querySelector('b').textContent=playing?'DETENER PREVISUALIZACIÓN':'PREVISUALIZAR INTERFAZ';
    });
  }
  if(id==='phone'){
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
}

function goBack(){
  clearCallTimers();
  const modal=appContent.querySelector('.photo-modal:not([hidden]),.failure-modal:not([hidden])');
  if(modal){modal.hidden=true;return}
  if(!recentsView.hidden){showHome();return}
  if(currentApp){showHome();return}
}

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-open-app]');if(button)launch(button.dataset.openApp);
});
$('#app-back').addEventListener('click',goBack);
$('#android-back').addEventListener('click',goBack);
$('#android-home').addEventListener('click',showHome);
$('#android-recents').addEventListener('click',showRecents);
window.addEventListener('popstate',event=>{const id=event.state?.app||new URL(location.href).searchParams.get('app');id&&id!=='home'?launch(id,{fromHistory:true}):showHome({fromHistory:true})});

const initial=query.get('app');
if(initial)launch(initial,{fromHistory:true});
updateProgress();
