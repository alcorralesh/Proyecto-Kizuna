import {itinerary} from './itinerary.js';

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const map=$('#route-map');
const stage=$('#map-stage');
const world=$('#world-scene');
const japan=$('#japan-scene');
const flightPath=$('#flight-progress');
const trainPath=$('#train-progress');
const plane=$('#plane');
const train=$('#train');
const progressBar=$('#journey-progress');
const phaseLabel=$('#phase-label');
const routeLabel=$('#route-label');
const toggleButton=$('#toggle-route');
const speedButton=$('#speed-route');
const mau=$('#mau-navigator');
const mauMessage=$('#mau-message');
const panel=$('#stop-panel');

let progress=0;
let playing=false;
let speed=1;
let previousTime=performance.now();
let frame=0;
let mauMoment='';
let camera={x:0,y:0,w:1200,h:720};
let drag=null;
let experienceStarted=false;
let cameraTouched=false;
let framedScene='world';

const routePoint=(path,vehicle,value)=>{
  const length=path.getTotalLength();
  const point=path.getPointAtLength(length*clamp(value,0,1));
  const next=path.getPointAtLength(length*clamp(value+.004,0,1));
  const angle=Math.atan2(next.y-point.y,next.x-point.x)*180/Math.PI;
  vehicle.setAttribute('transform',`translate(${point.x} ${point.y}) rotate(${angle})`);
  return point;
};

const localProgress=(value,start,end)=>clamp((value-start)/(end-start),0,1);
const reveal=(selector,visible)=>$(selector)?.classList.toggle('is-revealed',visible);

function frameScene(scene,focusX=600){
  const rect=stage.getBoundingClientRect();
  const aspect=rect.width/Math.max(rect.height,1);
  if(scene==='japan'){
    let height=aspect<1?720:500;
    let width=height*aspect;
    if(width>1200){width=1200;height=width/aspect}
    camera={
      x:clamp(735-width/2,0,1200-width),
      y:clamp(440-height/2,0,720-height),
      w:width,
      h:height
    };
  }else if(aspect<1.1){
    const height=720;
    const width=height*aspect;
    camera={
      x:clamp(focusX-width/2,0,1200-width),
      y:0,
      w:width,
      h:height
    };
  }else{
    camera={x:0,y:0,w:1200,h:720};
  }
  framedScene=scene;
  applyCamera();
}

function setMau(message,key){
  if(mauMoment===key)return;
  mauMoment=key;
  mauMessage.textContent=message;
  mau.classList.remove('is-speaking');
  requestAnimationFrame(()=>mau.classList.add('is-speaking'));
}

function updateTimeline(value){
  const items=$$('.journey-timeline li');
  items.forEach((item,index)=>{
    const moment=Number(item.dataset.moment);
    item.classList.toggle('is-active',value>=moment-(index===2?.025:0));
    item.classList.toggle('is-current',index===0?value<.48:index===1?value>=.48&&value<.97:value>=.97);
  });
}

function render(value){
  progress=clamp(value,0,1);
  const {flight,transition,train:trainPhase}=itinerary.phases;
  const flightValue=localProgress(progress,flight.start,flight.end);
  const transitionValue=localProgress(progress,transition.start,transition.end);
  const trainValue=localProgress(progress,trainPhase.start,trainPhase.end);

  flightPath.style.strokeDashoffset=String(100-flightValue*100);
  trainPath.style.strokeDashoffset=String(100-trainValue*100);
  const flightPosition=routePoint(flightPath,plane,flightValue);
  routePoint(trainPath,train,trainValue);

  world.style.opacity=String(1-transitionValue);
  world.style.transform=`scale(${1+transitionValue*.08})`;
  japan.style.opacity=String(transitionValue);
  japan.style.transform=`scale(${1.08-transitionValue*.08})`;
  world.style.pointerEvents=transitionValue>.5?'none':'auto';
  japan.style.pointerEvents=transitionValue>.5?'auto':'none';

  if(!cameraTouched){
    if(transitionValue>.52&&framedScene!=='japan')frameScene('japan');
    if(transitionValue<.2){
      const portrait=stage.getBoundingClientRect().width/stage.getBoundingClientRect().height<1.1;
      if(framedScene!=='world'||portrait)frameScene('world',flightPosition.x);
    }
  }

  reveal('#madrid-art',experienceStarted);
  reveal('#tokio-world-art',experienceStarted&&flightValue>.9);
  reveal('#tokio-japan-art',experienceStarted&&transitionValue>.34);
  reveal('#kioto-art',experienceStarted&&trainValue>.88);

  if(progress<transition.start){
    phaseLabel.textContent=flight.label;
    routeLabel.textContent=flight.route;
    setMau(progress>.29?'Tokio está al otro lado de esta línea. No la pierdas de vista.':'Todo itinerario empieza con una línea. Vamos a dibujarla.','flight-'+(progress>.29));
  }else if(progress<transition.end){
    phaseLabel.textContent=transition.label;
    routeLabel.textContent=transition.route;
    setMau('Señal japonesa localizada. Cambiando la escala del mapa.','arrival');
  }else{
    phaseLabel.textContent=trainPhase.label;
    routeLabel.textContent=trainPhase.route;
    setMau(progress>.9?'Kioto localizada. Alberto insistió en que no llegáramos tarde.':'El Shinkansen no espera. Por suerte, este mapa sí.','train-'+(progress>.9));
  }

  progressBar.style.width=`${progress*100}%`;
  updateTimeline(progress);
  if(progress>=1){
    playing=false;
    toggleButton.innerHTML='▶ <span>REPRODUCIR DE NUEVO</span>';
  }
}

function animate(now){
  const elapsed=Math.min(80,now-previousTime);
  previousTime=now;
  if(playing){
    progress+=elapsed*speed/itinerary.duration;
    render(progress);
  }
  frame=requestAnimationFrame(animate);
}

function setPlaying(value){
  playing=value;
  previousTime=performance.now();
  toggleButton.innerHTML=playing?'Ⅱ <span>PAUSAR RUTA</span>':'▶ <span>CONTINUAR RUTA</span>';
}

function startExperience(){
  experienceStarted=true;
  document.body.classList.remove('route-intro-active');
  $('#route-intro').classList.add('is-dismissed');
  mau.classList.add('is-visible','is-speaking');
  render(progress);
  setPlaying(true);
  setTimeout(()=>$('#route-intro').hidden=true,900);
}

function showStop(key){
  const stop=itinerary.stops[key];
  if(!stop)return;
  $('#stop-sequence').textContent=stop.sequence;
  $('#stop-name').textContent=stop.name;
  $('#stop-japanese').textContent=stop.japanese;
  $('#stop-stage').textContent=stop.stage;
  $('#stop-transport').textContent=stop.transport;
  $('#stop-copy').textContent=stop.copy;
  const guide=$('#stop-guide');
  guide.hidden=!stop.guide;
  if(stop.guide)guide.href=stop.guide;
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden','false');
  setPlaying(false);
}

function closeStop(){
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden','true');
}

$$('.city-node').forEach(node=>{
  const open=()=>showStop(node.dataset.stop);
  node.addEventListener('click',open);
  node.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();open()}
  });
});

$('.stop-panel-close').addEventListener('click',closeStop);
toggleButton.addEventListener('click',()=>{
  if(progress>=1){progress=0;render(0)}
  setPlaying(!playing);
});
$('#replay-route').addEventListener('click',()=>{closeStop();cameraTouched=false;frameScene('world');render(0);setPlaying(true)});
$('#start-route').addEventListener('click',startExperience);
speedButton.addEventListener('click',()=>{
  speed=speed===1?1.5:speed===1.5?2:1;
  speedButton.firstChild.textContent=`${speed}× `;
});

$$('.journey-timeline li').forEach(item=>item.querySelector('button').addEventListener('click',()=>{
  closeStop();
  render(Number(item.dataset.moment));
  setPlaying(false);
}));

function applyCamera(){
  map.setAttribute('viewBox',`${camera.x} ${camera.y} ${camera.w} ${camera.h}`);
}

function zoom(factor,originX=.5,originY=.5){
  const nextW=clamp(camera.w*factor,520,1200);
  const nextH=nextW*.6;
  camera.x=clamp(camera.x+(camera.w-nextW)*originX,0,1200-nextW);
  camera.y=clamp(camera.y+(camera.h-nextH)*originY,0,720-nextH);
  camera.w=nextW;
  camera.h=nextH;
  applyCamera();
}

$('#zoom-in').addEventListener('click',()=>{cameraTouched=true;zoom(.78)});
$('#zoom-out').addEventListener('click',()=>{cameraTouched=true;zoom(1.28)});
$('#zoom-reset').addEventListener('click',()=>{cameraTouched=false;frameScene(progress>=itinerary.phases.transition.end?'japan':'world')});
stage.addEventListener('wheel',event=>{
  event.preventDefault();
  cameraTouched=true;
  const rect=stage.getBoundingClientRect();
  zoom(event.deltaY>0?1.12:.88,(event.clientX-rect.left)/rect.width,(event.clientY-rect.top)/rect.height);
},{passive:false});
stage.addEventListener('pointerdown',event=>{
  if(event.target.closest('button,.city-node,.mau-navigator'))return;
  cameraTouched=true;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY,cameraX:camera.x,cameraY:camera.y};
  stage.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  const rect=stage.getBoundingClientRect();
  camera.x=clamp(drag.cameraX-(event.clientX-drag.x)*camera.w/rect.width,0,1200-camera.w);
  camera.y=clamp(drag.cameraY-(event.clientY-drag.y)*camera.h/rect.height,0,720-camera.h);
  applyCamera();
});
stage.addEventListener('pointerup',()=>drag=null);
stage.addEventListener('pointercancel',()=>drag=null);

render(0);
setPlaying(playing);
frame=requestAnimationFrame(animate);
addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
