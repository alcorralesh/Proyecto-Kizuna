const $=selector=>document.querySelector(selector);
if(new URLSearchParams(location.search).has('embedded')){
  document.body.classList.add('is-embedded');
}
const messages=$('#messages');
const typingTemplate=$('#typing-template');
const phone=$('.phone');
const chatListView=$('.chat-list-view');
const chatHeader=$('.chat-header');
const composer=$('#composer');
// El material original estaba orientado desde el teléfono de Alberto. Este
// clon pertenece a José, por lo que se invierte cada lado de la conversación.
const joseDeviceSide=side=>side==='incoming'?'outgoing':'incoming';

const threads=[
  {
    id:'cumpleanos',short:'Cumpleaños',title:'Conversación 01 · Cumpleaños',date:'29 de agosto de 2026',
    items:[
      m('incoming','¡Feliz cumpleaños, crack! 🎉🎂','19:42'),
      m('outgoing','Gracias tío! 😂','19:43'),
      m('outgoing','42 ya...','19:43'),
      m('incoming','Jajaja sí... qué rápido pasa 😅','19:43'),
      m('incoming','¿Qué toca este año? ¿Libro? 🤭','19:45'),
      m('outgoing','Este año quería regalarte algo diferente.','19:58'),
      m('incoming','Ajá... dime, dime 👀','19:58'),
      m('outgoing','¿Te acuerdas de los billetes de avión que me tocaron en el sorteo de Northgate?','20:00'),
      m('incoming','¡Cómo olvidarlo! 🍀✈️','20:00'),
      m('incoming','Tremenda suerte tuviste.','20:00'),
      m('outgoing','Pues quiero usarlos contigo.','20:02'),
      m('outgoing','Nos vamos a Japón. 🇯🇵','20:03',{reaction:'😳'}),
      gif('incoming','assets/pikachu-sorprendido.gif','20:08'),
      m('incoming','¿Lo dices en serio? 😳','20:08'),
      m('outgoing','Muy en serio.','20:09'),
      m('outgoing','Los vuelos ya los tengo.\nY el alojamiento corre por mi cuenta.\nEse es tu regalo de cumpleaños. 🎁','20:10'),
      m('incoming','Pero Alberto... es muchísimo.','20:11'),
      m('outgoing','No. Es un viaje que quiero hacer contigo.','20:11'),
      m('incoming','No sé qué decir... 🥹','20:12'),
      m('outgoing','Di que sí. Lo demás ya lo organizamos 💪','20:13'),
      m('incoming','Vale. ❤️','20:14',{reaction:'❤️'}),
      missing('Mensaje no recuperado','20:17'),
      partial('Último mensaje parcialmente irrecuperable','Solo se ha podido recuperar una palabra:','recuerdos','20:21')
    ]
  },
  {
    id:'preparativos',short:'Preparativos',title:'Conversación 02 · Preparativos',date:'2 de septiembre de 2026',
    items:[
      m('incoming','Ya me estoy empezando a hacer a la idea 😅','21:15'),
      m('outgoing','Ahora ya sí, no hay marcha atrás 😂','21:16'),
      m('incoming','Estoy mirando maletas...\n¿Qué me recomiendas?','21:17'),
      m('outgoing','Cómoda y ligera.','21:18'),
      m('outgoing','Y deja hueco para la vuelta,\nque vas a traer cosas seguro 😂','21:18'),
      m('incoming','Eso por descontado 😎','21:19'),
      m('incoming','Oye, una duda...','21:20'),
      m('incoming','¿Allí podremos movernos\nen bici en algunos sitios?','21:20'),
      m('outgoing','SÍ! En varias ciudades hay bici pública\ny merece mucho la pena.\nTengo apuntadas algunas rutas 🚲','21:21'),
      m('incoming','Genial! Me encanta.','21:22'),
      m('outgoing','Pero prepárate para andar...\nmucho 😂','21:22'),
      m('incoming','Ya me veo haciendo 30.000 pasos\ndiarios fácil jajaja','21:23'),
      m('outgoing','No vas desencaminado... 😅','21:23'),
      gif('incoming','assets/jeremy-renner-celebra.gif','21:24'),
      missing('4 mensajes no recuperados','21:30')
    ]
  },
  {
    id:'planes',short:'Qué hacer',title:'Conversación 03 · Qué queremos hacer',date:'7 de septiembre de 2026',
    items:[
      m('incoming','Yo solo tengo una prioridad.','18:47'),
      m('outgoing','Dime 😂','18:48'),
      m('incoming','Ramen.','18:48'),
      m('incoming','Mucho ramen. 🍜🍜🍜🍜','18:48'),
      m('outgoing','Eso está en el plan desde el día 1 jajaja','18:49'),
      m('incoming','Y cerveza japonesa. 🍺🍺','18:49'),
      m('outgoing','Por supuesto.','18:50'),
      m('outgoing','Vamos a probar de todo!','18:50'),
      m('incoming','Y templos! Quiero ver los más importantes.','18:51'),
      m('outgoing','Todos los que podamos.','18:51'),
      m('incoming','Fushimi Inari no puede faltar.','18:52'),
      m('outgoing','Ese es obligatorio.\nVa a ser brutal.','18:52'),
      gif('incoming','assets/grogu-te.gif','18:53'),
      missing('5 mensajes no recuperados','19:02')
    ]
  },
  {
    id:'itinerario',short:'Itinerario',title:'Conversación 04 · Itinerario',date:'14 de septiembre de 2026',
    items:[
      m('incoming','¿Cómo queda al final la ruta?','20:32'),
      m('outgoing','Te cuento lo que tengo pensado 🤭','20:33'),
      m('outgoing','Tokio','20:33'),
      m('outgoing','Kyoto','20:33'),
      redacted('outgoing','20:33'),
      m('outgoing','Nara','20:33'),
      redacted('outgoing','20:34'),
      m('outgoing','Hakone','20:34'),
      m('incoming','😲😲😲 vaya viaje...','20:35'),
      m('incoming','Alguna sorpresa más me imagino 👀','20:35'),
      m('outgoing','Siempre guardo alguna 😉','20:36'),
      m('outgoing','Ya la descubrirás allí.','20:36'),
      gif('incoming','assets/homer-arbusto.gif','20:37'),
      missing('3 mensajes no recuperados','20:45')
    ]
  },
  {
    id:'cuenta-atras',short:'Cuenta atrás',title:'Conversación 05 · Cuenta atrás',date:'24 de septiembre de 2026',
    items:[
      m('incoming','Quedan 4 días... 😳','22:08'),
      m('incoming','Todavía no me lo creo.','22:08'),
      m('outgoing','Yo tampoco jajaja','22:09'),
      m('incoming','He empezado a hacer la maleta\n... creo que llevo de todo 😂','22:10'),
      m('outgoing','Lleva menos y compra allí 😂','22:10'),
      m('incoming','Difícil misión...','22:11'),
      m('outgoing','Pasaporte, cargadores, adaptador,\nropa cómoda y ganas. Lo demás se compra.','22:11'),
      m('incoming','¡Qué ganas tenemos ya!','22:12'),
      m('outgoing','Va a ser inolvidable.','22:13',{reaction:'❤️'}),
      m('incoming','Gracias, de verdad. ❤️','22:13'),
      m('outgoing','Ya me darás las gracias cuando\nestemos con un ramen en Tokio 😂🍜','22:14'),
      m('incoming','Trato hecho! 🤝','22:14'),
      damagedAudio('Mensaje de voz (00:18)','Archivo dañado. No se ha podido recuperar.','22:15'),
      missing('2 mensajes no recuperados','22:17')
    ]
  }
];

function m(side,text,time,extra={}){const deviceSide=joseDeviceSide(side);return {kind:'message',side:deviceSide,text,time,ticks:deviceSide==='outgoing'?'read':null,...extra}}
function gif(side,src,time,caption=''){const deviceSide=joseDeviceSide(side);return {kind:'message',side:deviceSide,gif:src,time,caption,ticks:deviceSide==='outgoing'?'read':null,corrupted:caption.includes('parcialmente')}}
function missing(text,time){return {kind:'missing',text,time}}
function partial(label,text,word,time){return {kind:'partial',label,text,word,time}}
function redacted(side,time){const deviceSide=joseDeviceSide(side);return {kind:'message',side:deviceSide,redacted:true,time,ticks:deviceSide==='outgoing'?'read':null}}
function damagedAudio(title,text,time){return {kind:'damagedAudio',title,text,time}}

let activeThread=-1;
const viewedThreads=new Set();
let generation=0;
let paused=false;
let speed=1;
let waitResolver=null;
const playbackTiming={
  messagePause:620,
  recoveredEventPause:850,
  typingBase:880,
  typingPerCharacter:12,
  typingMaximum:1750
};

const wait=duration=>new Promise(resolve=>{
  let elapsed=0;
  let last=performance.now();
  const step=now=>{
    if(paused){
      waitResolver=()=>{
        last=performance.now();
        requestAnimationFrame(step);
      };
      return;
    }
    elapsed+=(now-last)*speed;
    last=now;
    if(elapsed>=duration){waitResolver=null;resolve();return}
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
});

function previewFor(thread){
  const item=thread.items.at(-1);
  if(item.kind==='message')return item.text?.split('\n')[0]||item.caption||'GIF recuperado';
  if(item.kind==='missing')return item.text;
  if(item.kind==='partial')return 'Registro parcialmente recuperado';
  if(item.kind==='damagedAudio')return item.title;
  return 'Conversación recuperada';
}

function renderChatList(){
  const list=$('#chat-list');
  list.innerHTML='';
  threads.forEach((thread,index)=>{
    const lastItem=thread.items.at(-1);
    const button=document.createElement('button');
    button.type='button';
    button.className=`chat-list-item${viewedThreads.has(index)?' is-viewed':''}`;
    button.dataset.index=index;
    button.innerHTML=`
      <img src="../assets/hero/hakone-fuji-dawn.webp" alt="">
      <span class="chat-list-copy">
        <span><strong>Alberto</strong><time>${lastItem.time||''}</time></span>
        <b>${thread.short}</b>
        <small>${previewFor(thread)}</small>
      </span>
      <i aria-label="${viewedThreads.has(index)?'Conversación consultada':'Conversación pendiente'}">${viewedThreads.has(index)?'✓':'›'}</i>`;
    button.addEventListener('click',()=>selectThread(index));
    list.append(button);
  });
}

function showChatList(){
  clearThread();
  activeThread=-1;
  phone.classList.remove('is-chat-view');
  phone.classList.add('is-list-view');
  chatListView.hidden=false;
  chatHeader.hidden=true;
  messages.hidden=true;
  composer.hidden=true;
  $('#demo-title').textContent='Selecciona una conversación';
  renderChatList();
}

function meta(message){
  const ticks=message.ticks
    ?`<span class="ticks ${message.ticks==='read'?'read':''}" aria-label="${message.ticks==='read'?'Leído':'Enviado'}">✓✓</span>`
    :'';
  return `<span class="message-meta"><time>${message.time||''}</time>${ticks}</span>`;
}

function bubbleContent(message){
  if(message.redacted)return `<p><span class="redaction" aria-label="Contenido irrecuperable"></span></p>${meta(message)}`;
  if(message.gif){
    return `<div class="media-frame"><img src="${message.gif}" alt="${message.caption}"><span class="gif-badge">GIF</span></div>
      ${message.caption?`<p class="media-caption">${message.caption}</p>`:''}${meta(message)}`;
  }
  return `<p>${message.text}</p>${meta(message)}`;
}

function addItem(item){
  if(item.kind==='missing'){
    const node=document.createElement('div');
    node.className='system-event danger';
    node.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 8 8 8m0-8-8 8"/></svg><span>${item.text}</span><time>${item.time}</time>`;
    messages.append(node);
    scrollToLatest();
    return;
  }
  if(item.kind==='partial'){
    const node=document.createElement('div');
    node.className='partial-card';
    node.innerHTML=`<small>${item.label} · ${item.time}</small><p>${item.text}<br>······ <span class="partial-word">${item.word}</span> ······</p>`;
    messages.append(node);
    scrollToLatest();
    return;
  }
  if(item.kind==='damagedAudio'){
    const node=document.createElement('div');
    node.className='damaged-card';
    node.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0m-6 6v4m-4 0h8"/></svg><small>ARCHIVO NO RECUPERABLE · ${item.time}</small><p><strong>${item.title}</strong>${item.text}</p>`;
    messages.append(node);
    scrollToLatest();
    return;
  }
  const row=document.createElement('div');
  row.className=`message-row ${item.side}`;
  const bubble=document.createElement('div');
  bubble.className=`bubble ${item.gif?'media-bubble':''} ${item.corrupted?'is-corrupted':''}`;
  bubble.innerHTML=bubbleContent(item);
  if(item.reaction)bubble.insertAdjacentHTML('beforeend',`<span class="reaction" aria-label="Reacción ${item.reaction}">${item.reaction}</span>`);
  row.append(bubble);
  messages.append(row);
  scrollToLatest();
}

function scrollToLatest(){
  requestAnimationFrame(()=>messages.scrollTo({top:messages.scrollHeight,behavior:'smooth'}));
}

async function showTyping(duration,run){
  messages.append(typingTemplate.content.cloneNode(true));
  $('#contact-status').textContent='escribiendo…';
  scrollToLatest();
  await wait(duration);
  if(run!==generation)return;
  messages.querySelector('.typing-row:last-of-type')?.remove();
  $('#contact-status').textContent='en línea';
}

async function play(){
  if(activeThread<0)return;
  const run=++generation;
  paused=false;
  $('#toggle-playback').textContent='PAUSAR';
  const thread=threads[activeThread];
  for(const item of thread.items){
    const incoming=item.kind==='message'&&item.side==='incoming';
    await wait(item.kind==='message'
      ?playbackTiming.messagePause
      :playbackTiming.recoveredEventPause
    );
    if(run!==generation)return;
    if(incoming){
      const contentLength=(item.text||item.caption||'').length;
      await showTyping(
        Math.min(
          playbackTiming.typingBase+(contentLength*playbackTiming.typingPerCharacter),
          playbackTiming.typingMaximum
        ),
        run
      );
    }
    if(run!==generation)return;
    addItem(item);
  }
  $('#contact-status').textContent=`últ. vez el ${thread.date.replace(' de 2026','')}`;
  $('#toggle-playback').textContent='REPRODUCIR';
}

function clearThread(){
  generation++;
  paused=false;
  waitResolver=null;
  messages.querySelectorAll('.message-row,.system-event,.partial-card,.damaged-card').forEach(node=>node.remove());
  messages.scrollTop=0;
  $('#contact-status').textContent='en línea';
}

function selectThread(index){
  if(index<0||index>=threads.length)return;
  activeThread=index;
  viewedThreads.add(index);
  clearThread();
  phone.classList.remove('is-list-view');
  phone.classList.add('is-chat-view');
  chatListView.hidden=true;
  chatHeader.hidden=false;
  messages.hidden=false;
  composer.hidden=false;
  const thread=threads[activeThread];
  $('#thread-date').textContent=thread.date.toUpperCase();
  $('#thread-date').dateTime=`2026-${['08-29','09-02','09-07','09-14','09-24'][activeThread]}`;
  $('#demo-title').textContent=thread.title;
  play();
}

function restart(){
  if(activeThread<0)return;
  clearThread();
  play();
}

$('#toggle-playback').addEventListener('click',()=>{
  if($('#toggle-playback').textContent==='REPRODUCIR'){restart();return}
  paused=!paused;
  $('#toggle-playback').textContent=paused?'CONTINUAR':'PAUSAR';
  if(!paused&&waitResolver){const resume=waitResolver;waitResolver=null;resume()}
});
$('#restart-chat').addEventListener('click',restart);
$('#playback-speed').addEventListener('change',event=>speed=Number(event.target.value)||1);
$('.back-button').addEventListener('click',showChatList);
$('.list-back-button').addEventListener('click',()=>{
  if(history.length>1)history.back();
  else location.href='../dispositivo-recuperado/index.html';
});

$('#composer').addEventListener('submit',event=>{
  event.preventDefault();
});

const clock=()=>$('#device-time').textContent=new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
clock();
setInterval(clock,30000);
showChatList();
