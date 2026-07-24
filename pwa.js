/* KIZUNA PWA · instalación, conexión y actualizaciones controladas.
   No usa localStorage ni conserva datos del expediente. */
(()=>{
  'use strict';

  const script=document.currentScript;
  if(!script)return;
  const baseUrl=new URL('./',script.src);
  const privateArea=location.pathname.includes('/expediente/');
  const standalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
  const isIos=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const isBusy=()=>Boolean(
    document.querySelector('dialog[open],#alt00-viewer,.kizuna-cinematic-finale')||
    document.body.classList.contains('alberto-overlay-open')||
    document.body.classList.contains('kizuna-finale-open')
  );

  const stylesheet=document.createElement('link');
  stylesheet.rel='stylesheet';
  stylesheet.href=new URL('pwa.css?v=20260724-pwa01',baseUrl).href;
  document.head.appendChild(stylesheet);

  let installEvent=null;
  let registration=null;
  let waitingWorker=null;
  let updateTimer=0;
  let refreshing=false;
  let pendingUpdate=false;
  let updateRequested=false;

  const makeButton=(label,className)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className=className;
    button.textContent=label;
    return button;
  };

  const removeElement=selector=>document.querySelector(selector)?.remove();

  const showConnectionState=()=>{
    removeElement('.kizuna-pwa-connection');
    if(navigator.onLine)return;
    const notice=document.createElement('aside');
    notice.className='kizuna-pwa-connection';
    notice.setAttribute('role','status');
    notice.innerHTML='<strong>SIN CONEXIÓN</strong><span>La consulta y el progreso del expediente necesitan conexión con el Archivo Central.</span>';
    document.body.appendChild(notice);
  };

  const showIosInstructions=()=>{
    removeElement('.kizuna-pwa-sheet');
    const sheet=document.createElement('section');
    sheet.className='kizuna-pwa-sheet';
    sheet.setAttribute('role','dialog');
    sheet.setAttribute('aria-modal','true');
    sheet.setAttribute('aria-labelledby','kizuna-install-title');
    sheet.innerHTML=`
      <div class="kizuna-pwa-sheet-card">
        <p class="kizuna-pwa-kicker">ACCESO DIRECTO · KIZUNA</p>
        <h2 id="kizuna-install-title">Instalar en el iPhone</h2>
        <ol>
          <li>Pulsa el botón <strong>Compartir</strong> del navegador.</li>
          <li>Selecciona <strong>Añadir a pantalla de inicio</strong>.</li>
          <li>Confirma con <strong>Añadir</strong>.</li>
        </ol>
        <p>Se abrirá como una aplicación independiente. El progreso seguirá guardándose únicamente en Supabase.</p>
        <button type="button" class="kizuna-pwa-sheet-close">Entendido</button>
      </div>`;
    sheet.addEventListener('click',event=>{
      if(event.target===sheet||event.target.closest('.kizuna-pwa-sheet-close'))sheet.remove();
    });
    document.body.appendChild(sheet);
    sheet.querySelector('.kizuna-pwa-sheet-close').focus();
  };

  const install=async()=>{
    if(isIos()){showIosInstructions();return}
    if(!installEvent)return;
    installEvent.prompt();
    await installEvent.userChoice;
    installEvent=null;
    removeElement('.kizuna-pwa-install');
  };

  const showInstall=()=>{
    if(privateArea||standalone()||document.querySelector('.kizuna-pwa-install'))return;
    if(!isIos()&&!installEvent)return;
    const button=makeButton('Instalar KIZUNA','kizuna-pwa-install');
    button.setAttribute('aria-label','Instalar KIZUNA como aplicación');
    button.addEventListener('click',install);
    document.body.appendChild(button);
  };

  const applyUpdate=()=>{
    if(!waitingWorker)return;
    if(isBusy()){
      pendingUpdate=true;
      updateRequested=true;
      const text=document.querySelector('.kizuna-pwa-update span');
      if(text)text.textContent='La actualización se aplicará al cerrar el documento actual.';
      return;
    }
    refreshing=true;
    waitingWorker.postMessage({type:'SKIP_WAITING'});
  };

  const showUpdate=worker=>{
    waitingWorker=worker;
    if(isBusy()){pendingUpdate=true;return}
    if(document.querySelector('.kizuna-pwa-update'))return;
    const notice=document.createElement('aside');
    notice.className='kizuna-pwa-update';
    notice.setAttribute('role','status');
    notice.innerHTML=`
      <div>
        <strong>ACTUALIZACIÓN DEL SISTEMA</strong>
        <span>Hay una nueva versión de la interfaz de KIZUNA disponible.</span>
      </div>
      <button type="button" data-pwa-later>Ahora no</button>
      <button type="button" data-pwa-update>Actualizar</button>`;
    notice.querySelector('[data-pwa-later]').addEventListener('click',()=>notice.remove());
    notice.querySelector('[data-pwa-update]').addEventListener('click',applyUpdate);
    document.body.appendChild(notice);
  };

  const offerPendingUpdate=()=>{
    if(pendingUpdate&&!isBusy()&&waitingWorker){
      pendingUpdate=false;
      if(updateRequested)applyUpdate();
      else showUpdate(waitingWorker);
    }
  };

  const watchRegistration=current=>{
    if(current.waiting)showUpdate(current.waiting);
    current.addEventListener('updatefound',()=>{
      const worker=current.installing;
      if(!worker)return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdate(worker);
      });
    });
  };

  const checkForUpdates=()=>{
    if(document.visibilityState==='visible')registration?.update().catch(()=>{});
  };

  const register=async()=>{
    if(!('serviceWorker'in navigator)||!window.isSecureContext)return;
    try{
      registration=await navigator.serviceWorker.register(
        new URL('service-worker.js',baseUrl),
        {scope:baseUrl.pathname}
      );
      watchRegistration(registration);
      updateTimer=window.setInterval(checkForUpdates,60*60*1000);
    }catch(error){
      console.warn('No se pudo activar el modo aplicación de KIZUNA.',error);
    }
  };

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    installEvent=event;
    showInstall();
  });
  window.addEventListener('appinstalled',()=>removeElement('.kizuna-pwa-install'));
  window.addEventListener('online',showConnectionState);
  window.addEventListener('offline',showConnectionState);
  document.addEventListener('visibilitychange',checkForUpdates);
  navigator.serviceWorker?.addEventListener('controllerchange',()=>{
    if(refreshing)location.reload();
  });

  document.addEventListener('DOMContentLoaded',()=>{
    showConnectionState();
    window.setTimeout(showInstall,1800);
    window.setInterval(offerPendingUpdate,1500);
    register();
  },{once:true});

  window.KizunaPWA={
    get registration(){return registration},
    get waiting(){return waitingWorker},
    install,
    checkForUpdates,
    cachePolicy:'static-public-only'
  };
})();
