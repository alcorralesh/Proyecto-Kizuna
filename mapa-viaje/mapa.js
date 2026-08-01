import {itinerary} from './itinerary.js?v=20260729-story-map14';
import '../mascot/mau-config.js?v=20260801-alt00-share01';

const MAU_CONFIG=globalThis.KIZUNA_MAU_CONFIG;

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const stops=['madrid','tokio','nikko','yokohama','kamakura','hakone','kioto','nara','osaka','hiroshima','miyajima'];
const messages=MAU_CONFIG.mapFlow;
const timelineCopy=['Origen','Llegada','Excursión','Puerto','Templos','Monte Fuji','Shinkansen','Tren regional','Sabores','Memoria','Ferry'];

let currentStep=0;
let highestStep=0;

function buildMobileAtlas(){
  const route=$('#mobile-route');
  route.innerHTML=stops.map((key,index)=>{
    const stop=itinerary.stops[key];
    const number=String(index).padStart(2,'0');
    return `
      <li class="mobile-route-stop ${index%2?'is-right':'is-left'}" data-step="${index}">
        <span class="mobile-route-node" aria-hidden="true">${number}</span>
        <button type="button" data-mobile-stop="${key}" aria-label="Consultar ${stop.name}" ${index?'disabled':''}>
          <img src="assets/cities/${key}-vignette.webp" alt="">
          <span>
            <small>${stop.sequence}</small>
            <strong>${stop.name}</strong>
            <em>${timelineCopy[index]}</em>
          </span>
        </button>
      </li>`;
  }).join('');

  $$('.mobile-route-stop button').forEach(button=>{
    button.addEventListener('click',()=>{
      const item=button.closest('.mobile-route-stop');
      currentStep=Number(item.dataset.step);
      render();
      showStop(button.dataset.mobileStop);
    });
  });
}

function setMau(message){
  const mau=$('#mau-navigator');
  $('#mau-message').textContent=message;
  mau.classList.remove('is-speaking');
  requestAnimationFrame(()=>mau.classList.add('is-speaking'));
  const mobileMau=$('#mobile-mau');
  $('#mau-message-mobile').textContent=message;
  mobileMau.classList.remove('is-speaking');
  requestAnimationFrame(()=>mobileMau.classList.add('is-speaking'));
}

function render(){
  $$('.map-stop').forEach(node=>{
    const step=Number(node.dataset.step);
    const discovered=step<=highestStep;
    node.classList.toggle('is-discovered',discovered);
    node.classList.toggle('is-current',step===currentStep);
    node.disabled=!discovered;
  });

  $$('.route-segment').forEach(path=>{
    path.classList.toggle('is-discovered',Number(path.dataset.route)<=highestStep);
  });

  $$('.mobile-route-stop').forEach(item=>{
    const step=Number(item.dataset.step);
    const discovered=step<=highestStep;
    item.classList.toggle('is-discovered',discovered);
    item.classList.toggle('is-current',step===currentStep);
    item.querySelector('button').disabled=!discovered;
  });

  $$('.journey-timeline li').forEach((item,index)=>{
    const discovered=index<=highestStep;
    item.classList.toggle('is-discovered',discovered);
    item.classList.toggle('is-current',index===currentStep);
    const button=item.querySelector('button');
    button.disabled=!discovered;
    item.querySelector('small').textContent=discovered?timelineCopy[index]:'Oculto';
  });

  $('#previous-stop').disabled=currentStep===0;
  const next=$('#next-stop');
  next.disabled=currentStep===stops.length-1;
  next.innerHTML=highestStep<stops.length-1&&currentStep===highestStep
    ?'REVELAR SIGUIENTE <span>→</span>'
    :'SIGUIENTE <span>→</span>';
  $('#discovery-count').textContent=`${highestStep+1} de ${stops.length} destinos recuperados`;
  $('#journey-progress').style.width=`${(highestStep/(stops.length-1))*100}%`;
  setMau(messages[currentStep]);
}

function selectStep(step,{reveal=false}={}){
  const next=Math.max(0,Math.min(stops.length-1,step));
  if(reveal&&next>highestStep)highestStep=next;
  if(next>highestStep)return;
  currentStep=next;
  closeStop();
  render();
}

function showStop(key){
  const stop=itinerary.stops[key];
  if(!stop)return;
  $('#stop-sequence').textContent=stop.sequence;
  $('#stop-name').textContent=stop.name;
  $('#stop-japanese').textContent=stop.japanese;
  $('#stop-image').src=`assets/cities/${key}-vignette.webp`;
  $('#stop-image').alt=`Ilustración de ${stop.name}`;
  $('#stop-stage').textContent=stop.stage;
  $('#stop-transport').textContent=stop.transport;
  $('#stop-copy').textContent=stop.copy;
  $('#stop-panel').classList.add('is-open');
  $('#stop-panel').setAttribute('aria-hidden','false');
}

function closeStop(){
  $('#stop-panel').classList.remove('is-open');
  $('#stop-panel').setAttribute('aria-hidden','true');
}

function centerCurrentOnSmallScreen(){
  if(innerWidth<=700){
    const stop=$(`.mobile-route-stop[data-step="${currentStep}"]`);
    stop?.scrollIntoView({behavior:'smooth',inline:'nearest',block:'center'});
  }
  const timelineItem=$(`.journey-timeline li[data-step="${currentStep}"]`);
  timelineItem?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
}

$('#start-route').addEventListener('click',()=>{
  $('#start-route').blur();
  document.body.classList.remove('route-intro-active');
  $('#route-intro').classList.add('is-dismissed');
  $('.map-shell').scrollTop=0;
  requestAnimationFrame(()=>$('.map-shell').scrollTop=0);
  setTimeout(()=>$('#route-intro').hidden=true,700);
  render();
});

$('#next-stop').addEventListener('click',()=>{
  const next=currentStep+1;
  selectStep(next,{reveal:next===highestStep+1});
  centerCurrentOnSmallScreen();
});

$('#previous-stop').addEventListener('click',()=>{
  selectStep(currentStep-1);
  centerCurrentOnSmallScreen();
});

$('#reset-route').addEventListener('click',()=>{
  currentStep=0;
  highestStep=0;
  closeStop();
  render();
  $('#map-scroll').scrollTo({left:0,behavior:'smooth'});
  $('#mobile-atlas').scrollTo({top:0,behavior:'smooth'});
});

$$('.map-stop').forEach(node=>{
  node.addEventListener('click',()=>{
    currentStep=Number(node.dataset.step);
    render();
    showStop(node.dataset.stop);
  });
});

$$('.journey-timeline li').forEach(item=>{
  item.querySelector('button').addEventListener('click',()=>{
    selectStep(Number(item.dataset.step));
    centerCurrentOnSmallScreen();
  });
});

$('.stop-panel-close').addEventListener('click',closeStop);
addEventListener('keydown',event=>{
  if(event.key==='Escape')closeStop();
  if(event.key==='ArrowRight'&&!$('#next-stop').disabled)$('#next-stop').click();
  if(event.key==='ArrowLeft'&&!$('#previous-stop').disabled)$('#previous-stop').click();
});

buildMobileAtlas();
render();
