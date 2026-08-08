/* KIZUNA PWA · instalación, conexión y actualizaciones controladas.
   Conserva sólo una clave técnica del terminal; nunca datos del expediente. */
(()=>{
  'use strict';

  const script=document.currentScript;
  if(!script)return;
  const baseUrl=new URL('./',script.src);
  const analyticsExcluded=['/expediente/','/conversacion/','/dispositivo-recuperado/','/mapa-viaje/','/offline.html'].some(path=>location.pathname.includes(path));
  if(location.hostname==='alcorralesh.github.io'&&!analyticsExcluded&&!document.querySelector('script[data-cf-beacon]')){
    const beacon=document.createElement('script');
    beacon.type='module';
    beacon.src='https://static.cloudflareinsights.com/beacon.min.js';
    beacon.setAttribute('data-cf-beacon',JSON.stringify({token:'e4762af1fb8843e981cc1cd0e9792ddd'}));
    document.head.appendChild(beacon);
  }
  const privateArea=location.pathname.includes('/expediente/');
  const publicHome=location.pathname.replace(/index\.html$/,'').replace(/\/+$/,'/')===baseUrl.pathname.replace(/\/+$/,'/');
  const standalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
  const syncStandaloneClass=()=>document.documentElement.classList.toggle('kizuna-pwa-standalone',standalone());
  syncStandaloneClass();
  window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change',syncStandaloneClass);
  window.addEventListener('pageshow',syncStandaloneClass);
  const isIos=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const isAndroid=()=>/android/i.test(navigator.userAgent);
  const blockedPushInstructions=()=>{
    if(isIos())return 'Abre Ajustes de iOS → Notificaciones → KIZUNA y permite las notificaciones. Después vuelve aquí para registrar de nuevo este terminal.';
    if(isAndroid())return 'Abre Ajustes de Android → Aplicaciones → KIZUNA → Notificaciones y permite los avisos. Después vuelve aquí para registrar de nuevo este terminal.';
    return 'Abre la configuración de este sitio en el navegador, permite las notificaciones y vuelve aquí para registrar de nuevo este terminal.';
  };
  const isBusy=()=>Boolean(
    document.querySelector('dialog[open],#alt00-viewer,.kizuna-cinematic-finale,.kizuna-early-access')||
    document.body.classList.contains('alberto-overlay-open')||
    document.body.classList.contains('kizuna-finale-open')
  );

  const stylesheet=document.createElement('link');
  stylesheet.rel='stylesheet';
  stylesheet.href=new URL('pwa.css?v=20260808-push-channel01',baseUrl).href;
  document.head.appendChild(stylesheet);

  let installEvent=null;
  let registration=null;
  let waitingWorker=null;
  let updateTimer=0;
  let refreshing=false;
  let pendingUpdate=false;
  let updateRequested=false;
  let installCollapseTimer=0;
  let pushClient=null;
  let pushUserId=null;
  let pushActivityRecorder=null;
  let pushClientKey=null;
  let pushDeviceIdentityPromise=null;

  const pushTerminalClientKey=()=>{
    if(pushClientKey)return pushClientKey;
    try{
      const storageKey='kizuna.push-terminal-key.v1';
      pushClientKey=localStorage.getItem(storageKey);
      if(!pushClientKey){
        pushClientKey=crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(storageKey,pushClientKey);
      }
    }catch(_error){
      pushClientKey=crypto.randomUUID?.()||null;
    }
    return pushClientKey;
  };

  const pushTerminalPlatform=()=>isIos()?'ios':isAndroid()?'android':'web';
  const pushTerminalIdentity=()=>{
    if(pushDeviceIdentityPromise)return pushDeviceIdentityPromise;
    pushDeviceIdentityPromise=(async()=>{
      const platform=pushTerminalPlatform();
      const ua=String(navigator.userAgent||'');
      let model='';
      let mobile=/mobile/i.test(ua);
      try{
        if(navigator.userAgentData?.getHighEntropyValues){
          const values=await navigator.userAgentData.getHighEntropyValues(['model']);
          model=String(values?.model||'').trim();
          mobile=Boolean(navigator.userAgentData.mobile);
        }
      }catch(_error){}
      if(!model){
        const samsung=ua.match(/;\s*(SM-[A-Z0-9-]+)\s*(?:Build|[;)])/i);
        if(samsung)model=samsung[1].toUpperCase();
      }
      const ipad=isIos()&&(/ipad/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1));
      const iphone=isIos()&&!ipad;
      const deviceClass=ipad?'tablet':iphone?'phone':platform==='android'?(mobile?'phone':'tablet'):'computer';
      const label=ipad?'iPad':iphone?'iPhone':platform==='android'?(model||`Dispositivo Android`):/mac/i.test(ua)?'Mac':/windows/i.test(ua)?'Ordenador Windows':'Navegador web';
      const screenWidth=Math.min(Number(screen.width)||0,Number(screen.height)||0);
      const screenHeight=Math.max(Number(screen.width)||0,Number(screen.height)||0);
      const signatureParts=[
        'kizuna-terminal-v2',platform,deviceClass,model.toLowerCase(),
        `${screenWidth}x${screenHeight}`,String(Number(devicePixelRatio||1).toFixed(2)),
        String(navigator.maxTouchPoints||0),String(navigator.hardwareConcurrency||0),
        String(navigator.deviceMemory||0),navigator.language||'',
        Intl.DateTimeFormat().resolvedOptions().timeZone||''
      ];
      let signature=null;
      try{
        const bytes=new TextEncoder().encode(signatureParts.join('|'));
        const digest=await crypto.subtle.digest('SHA-256',bytes);
        signature=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
      }catch(_error){}
      return{platform,model:model||null,deviceClass,label,signature};
    })();
    return pushDeviceIdentityPromise;
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
        <p>Se abrirá como una aplicación independiente. Tu progreso permanecerá vinculado de forma segura al Archivo Central.</p>
        <button type="button" class="kizuna-pwa-sheet-close">Entendido</button>
      </div>`;
    sheet.addEventListener('click',event=>{
      if(event.target===sheet||event.target.closest('.kizuna-pwa-sheet-close'))sheet.remove();
    });
    document.body.appendChild(sheet);
    sheet.querySelector('.kizuna-pwa-sheet-close').focus();
  };

  const install=async()=>{
    const siteHeader=document.querySelector('.site-header');
    if(siteHeader?.classList.contains('open'))siteHeader.querySelector('.menu-toggle')?.click();
    if(isIos()){showIosInstructions();return}
    if(!installEvent)return;
    installEvent.prompt();
    await installEvent.userChoice;
    installEvent=null;
    clearTimeout(installCollapseTimer);
    removeElement('.kizuna-pwa-install');
  };

  const showInstall=()=>{
    if(privateArea||standalone()||document.querySelector('.kizuna-pwa-install'))return;
    if(!isIos()&&!installEvent)return;
    const notice=document.createElement('aside');
    notice.className=`kizuna-pwa-install ${publicHome?'is-expanded':'is-compact'}`;
    notice.setAttribute('aria-label','Instalar KIZUNA como aplicación');
    notice.innerHTML=`
      <button type="button" class="kizuna-pwa-install-main" data-pwa-install>
        <span class="kizuna-pwa-install-mark" aria-hidden="true">K</span>
        <span class="kizuna-pwa-install-copy">
          <small>ACCESO DIRECTO · KIZUNA</small>
          <strong>Guarda KIZUNA en tu pantalla</strong>
          <em>Un acceso directo a los destinos, historias y recuerdos que has reunido.</em>
        </span>
        <span class="kizuna-pwa-install-action">Instalar <b>→</b></span>
      </button>
      <button type="button" class="kizuna-pwa-install-collapse" aria-label="Reducir aviso de instalación">×</button>`;
    notice.querySelector('[data-pwa-install]').addEventListener('click',install);
    const collapseButton=notice.querySelector('.kizuna-pwa-install-collapse');
    const collapseInstallNotice=()=>{
      notice.classList.remove('is-expanded');
      notice.classList.add('is-compact');
      collapseButton.setAttribute('aria-label','Cerrar aviso de instalación');
    };
    collapseButton.hidden=false;
    collapseButton.setAttribute('aria-label',publicHome?'Reducir aviso de instalación':'Cerrar aviso de instalación');
    collapseButton.addEventListener('click',()=>{
      clearTimeout(installCollapseTimer);
      if(notice.classList.contains('is-compact')){
        notice.remove();
        return;
      }
      collapseInstallNotice();
    });
    document.body.appendChild(notice);
    if(!publicHome)return;
    const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
    installCollapseTimer=setTimeout(()=>{
      if(!notice.isConnected)return;
      collapseInstallNotice();
    },reduced?9000:7000);
  };

  const base64UrlBytes=value=>{
    const padding='='.repeat((4-value.length%4)%4);
    const binary=atob((value+padding).replace(/-/g,'+').replace(/_/g,'/'));
    return Uint8Array.from(binary,character=>character.charCodeAt(0));
  };

  const syncPushTerminalState=async subscription=>{
    if(!pushClient||!pushUserId)return null;
    const permission=Notification.permission==='granted'?'granted':Notification.permission==='denied'?'denied':'unknown';
    const {data,error}=await pushClient.rpc('sync_expedient_push_terminal_state',{
      push_endpoint:subscription?.endpoint||null,
      push_client_key:pushTerminalClientKey(),
      push_permission:permission,
      push_has_subscription:Boolean(subscription)
    });
    if(error)throw error;
    return data;
  };

  const savePushSubscription=async subscription=>{
    if(!pushClient||!pushUserId||!subscription)return;
    const serialized=subscription.toJSON();
    const identity=await pushTerminalIdentity();
    const extended=await pushClient.rpc('register_expedient_push_subscription_v2',{
      push_endpoint:subscription.endpoint,
      push_p256dh:serialized.keys?.p256dh,
      push_auth:serialized.keys?.auth,
      push_user_agent:navigator.userAgent,
      push_platform:identity.platform,
      push_client_key:pushTerminalClientKey(),
      push_device_signature:identity.signature,
      push_device_label:identity.label,
      push_device_model:identity.model,
      push_device_class:identity.deviceClass
    });
    if(extended.error){
      const unavailable=['PGRST202','42883'].includes(extended.error.code)||/register_expedient_push_subscription_v2|function.+does not exist/i.test(extended.error.message||'');
      if(!unavailable)throw extended.error;
      const {error}=await pushClient.rpc('register_expedient_push_subscription',{
        push_endpoint:subscription.endpoint,
        push_p256dh:serialized.keys?.p256dh,
        push_auth:serialized.keys?.auth,
        push_user_agent:navigator.userAgent,
        push_platform:identity.platform
      });
      if(error)throw error;
    }
    await syncPushTerminalState(subscription);
  };

  const savePushPreference=async preference=>{
    if(!pushClient||!pushUserId)return;
    const {error}=await pushClient.rpc('set_expedient_push_preference',{
      preference_status:preference
    });
    if(error)throw error;
  };

  const recordPushActivity=async(activityKind,details={})=>{
    if(typeof pushActivityRecorder!=='function')return null;
    try{
      return await pushActivityRecorder(activityKind,details);
    }catch(error){
      console.warn('No se pudo registrar la decisión sobre las notificaciones.',error);
      return null;
    }
  };

  const enablePush=async status=>{
    if(!pushClient||!pushUserId)throw new Error('Inicia sesión para activar los avisos.');
    const permission=await Notification.requestPermission();
    if(permission!=='granted')throw new Error('El permiso de notificaciones no está concedido.');
    if(!registration)await register();
    const currentRegistration=registration||await navigator.serviceWorker.ready;
    let subscription=await currentRegistration.pushManager.getSubscription();
    if(!subscription){
      const {data,error}=await pushClient.functions.invoke('send-expedient-push',{body:{action:'public-key'}});
      if(error||!data?.publicKey)throw error||new Error('Web Push no está configurado.');
      subscription=await currentRegistration.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:base64UrlBytes(data.publicKey)
      });
    }
    await savePushSubscription(subscription);
    await savePushPreference('granted');
    if(status)status.textContent='Notificaciones activadas en este dispositivo ✓';
    return subscription;
  };

  const showPushConsentResult=(notice,granted,onSettled)=>{
    notice.classList.add('is-result',granted?'is-authorized':'is-unavailable');
    notice.innerHTML=`<div class="kizuna-push-consent-card">
      <header><span>DIVISIÓN DE ARCHIVOS TEMPORALES</span><b>${granted?'CANAL SEGURO':'CANAL LOCAL'}</b></header>
      <div class="kizuna-push-consent-result">
        <p>ESTADO</p>
        <h2 id="kizuna-push-consent-title"><i aria-hidden="true">${granted?'●':'○'}</i> ${granted?'Terminal registrado':'Canal no disponible'}</h2>
        ${granted
          ?'<strong>Canal Seguro establecido.</strong><p>Las futuras comunicaciones podrán entregarse<br>aunque el expediente permanezca cerrado.</p>'
          :'<p>Podrás consultar toda la información desde<br>el expediente, aunque algunas comunicaciones<br>extraordinarias podrían no entregarse en el<br>momento previsto.</p>'}
      </div>
      <button type="button" data-push-close>Continuar al expediente <span>→</span></button>
    </div>`;
    notice.querySelector('[data-push-close]').onclick=()=>closePushConsent(notice,onSettled,granted?'authorized':'declined');
  };

  const closePushConsent=(notice,onSettled,result)=>{
    notice.classList.remove('is-visible');
    document.documentElement.classList.remove('kizuna-push-modal-open');
    setTimeout(()=>{
      notice.remove();
      onSettled?.({status:result});
    },240);
  };

  const pushState=async()=>{
    if(!('Notification'in window)||!('PushManager'in window)||!('serviceWorker'in navigator)){
      return{state:'unavailable',label:'Canal no disponible'};
    }
    if(isIos()&&!standalone())return{state:'installation_required',label:'Instala KIZUNA para autorizarlo'};
    if(Notification.permission==='denied')return{state:'blocked',label:'Autorización bloqueada'};
    if(Notification.permission!=='granted')return{state:'pending',label:'Terminal no registrado'};
    try{
      if(!registration)await register();
      const currentRegistration=registration||await navigator.serviceWorker.ready;
      const subscription=await currentRegistration.pushManager.getSubscription();
      return subscription
        ?{state:'authorized',label:'Terminal autorizado'}
        :{state:'pending',label:'Canal pendiente de sincronización'};
    }catch(_error){
      return{state:'unavailable',label:'Canal no disponible'};
    }
  };

  const announcePushState=async()=>{
    const state=await pushState();
    document.dispatchEvent(new CustomEvent('kizuna:push-state',{detail:state}));
    return state;
  };

  const showBlockedPushProtocol=()=>{
    document.querySelector('.kizuna-push-consent')?.remove();
    const notice=document.createElement('aside');
    notice.className='kizuna-push-consent is-result is-unavailable';
    notice.setAttribute('role','dialog');
    notice.setAttribute('aria-modal','true');
    notice.setAttribute('aria-labelledby','kizuna-push-consent-title');
    notice.innerHTML=`<div class="kizuna-push-consent-card">
      <header><span>DIVISIÓN DE ARCHIVOS TEMPORALES</span><b>AUTORIZACIÓN · AT-03</b></header>
      <div class="kizuna-push-consent-result">
        <p>CANAL DE COMUNICACIONES</p>
        <h2 id="kizuna-push-consent-title"><i aria-hidden="true">○</i> Autorización bloqueada</h2>
        <strong>No se puede establecer el Canal Seguro.</strong>
        <p>${blockedPushInstructions()}</p>
      </div>
      <button type="button" data-push-close>Volver al expediente</button>
    </div>`;
    notice.querySelector('[data-push-close]').onclick=()=>closePushConsent(notice,null,'blocked');
    document.body.appendChild(notice);
    document.documentElement.classList.add('kizuna-push-modal-open');
    requestAnimationFrame(()=>notice.classList.add('is-visible'));
  };

  const openPushProtocol=async()=>{
    if(document.querySelector('.kizuna-push-consent'))return null;
    if(!('Notification'in window)||!('PushManager'in window)||!('serviceWorker'in navigator)){
      showBlockedPushProtocol();
      return announcePushState();
    }
    if(isIos()&&!standalone()){
      showIosInstructions();
      return announcePushState();
    }
    if(Notification.permission==='denied'){
      showBlockedPushProtocol();
      return announcePushState();
    }
    if(Notification.permission==='default'){
      const result=await showPushConsent();
      await announcePushState();
      return result;
    }
    const notice=document.createElement('aside');
    notice.className='kizuna-push-consent';
    notice.setAttribute('role','dialog');
    notice.setAttribute('aria-modal','true');
    document.body.appendChild(notice);
    document.documentElement.classList.add('kizuna-push-modal-open');
    requestAnimationFrame(()=>notice.classList.add('is-visible'));
    try{
      await enablePush();
      await recordPushActivity('push_channel_authorized',{permission:Notification.permission,source:'manual_protocol'});
      showPushConsentResult(notice,true,()=>announcePushState());
    }catch(error){
      notice.remove();
      document.documentElement.classList.remove('kizuna-push-modal-open');
      showBlockedPushProtocol();
      await announcePushState();
      console.warn('No se pudo restablecer el Canal Seguro.',error);
    }
    return pushState();
  };

  const showPushConsent=()=>new Promise(resolve=>{
    if(document.querySelector('.kizuna-push-consent,.kizuna-pwa-install')||standalone()===false&&isIos()){
      resolve({status:'not_shown'});
      return;
    }
    if(!('Notification'in window)||!('PushManager'in window)||Notification.permission!=='default'){
      resolve({status:'not_required'});
      return;
    }
    const notice=document.createElement('aside');
    notice.className='kizuna-push-consent';
    notice.setAttribute('role','dialog');
    notice.setAttribute('aria-modal','true');
    notice.setAttribute('aria-labelledby','kizuna-push-consent-title');
    notice.innerHTML=`<div class="kizuna-push-consent-card">
      <header><span>DIVISIÓN DE ARCHIVOS TEMPORALES</span><b>AUTORIZACIÓN · AT-03</b></header>
      <div class="kizuna-push-consent-body">
        <p class="kizuna-push-consent-kicker">AUTORIZACIÓN EXCEPCIONAL</p>
        <h2 id="kizuna-push-consent-title">Registrar este dispositivo como<br><em>Terminal Autorizado.</em></h2>
        <div class="kizuna-push-consent-copy">
          <p>La liberación anticipada del expediente ha obligado a habilitar métodos de comunicación que inicialmente no estaban previstos.</p>
          <p>Para mantener el contacto durante el resto de la investigación es necesario registrar este dispositivo como <strong>Terminal Autorizado</strong>.</p>
          <p>Una vez autorizado, KIZUNA podrá enviarte comunicaciones urgentes cuando sea necesario, incluso si el expediente permanece cerrado.</p>
        </div>
        <div class="kizuna-push-consent-terminal"><span aria-hidden="true">◉</span><div><small>DISPOSITIVO ACTUAL</small><strong>Esperando autorización del destinatario</strong></div></div>
        <em class="kizuna-push-consent-status" role="status"></em>
      </div>
      <footer><button type="button" data-push-later>Continuar sin canal</button><button type="button" data-push-enable>Autorizar terminal <span>→</span></button></footer>
    </div>`;
    notice.querySelector('[data-push-later]').onclick=async event=>{
      event.currentTarget.disabled=true;
      try{
        await savePushPreference('declined');
        await recordPushActivity('push_channel_declined',{permission:Notification.permission});
      }
      catch(error){console.warn('No se pudo registrar la preferencia de notificaciones.',error)}
      showPushConsentResult(notice,false,resolve);
    };
    notice.querySelector('[data-push-enable]').onclick=async event=>{
      const button=event.currentTarget,status=notice.querySelector('.kizuna-push-consent-status');
      button.disabled=true;status.textContent='Solicitando permiso…';
      try{
        await enablePush(status);
        await recordPushActivity('push_channel_authorized',{permission:Notification.permission});
        showPushConsentResult(notice,true,resolve);
      }catch(error){
        if(Notification.permission==='denied'){
          try{
            await savePushPreference('declined');
            await recordPushActivity('push_channel_declined',{permission:Notification.permission});
          }catch(preferenceError){console.warn('No se pudo registrar la preferencia de notificaciones.',preferenceError)}
          showPushConsentResult(notice,false,resolve);
          return;
        }
        status.textContent=error?.message||'No se pudieron activar los avisos.';
        button.disabled=false;
      }
    };
    document.body.appendChild(notice);
    document.documentElement.classList.add('kizuna-push-modal-open');
    requestAnimationFrame(()=>notice.classList.add('is-visible'));
  });

  const connectPushInternal=async options=>{
    pushClient=options?.client||null;
    pushUserId=options?.userId||null;
    pushActivityRecorder=options?.recordActivity||null;
    if(!pushClient||!pushUserId||!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window))return null;
    if(isIos()&&!standalone())return null;
    if(!registration)await register();
    const currentRegistration=registration||await navigator.serviceWorker.ready;
    const subscription=await currentRegistration.pushManager.getSubscription();
    await syncPushTerminalState(subscription).catch(error=>console.warn('No se pudo registrar la señal del terminal.',error));
    const {data:preference,error:preferenceError}=await pushClient
      .from('expedient_push_preferences')
      .select('status')
      .eq('user_id',pushUserId)
      .maybeSingle();
    if(preferenceError)console.warn('No se pudo consultar la preferencia de notificaciones.',preferenceError);
    if(preference?.status==='declined'&&Notification.permission==='default')return null;
    if(Notification.permission==='granted'){
      if(subscription){
        await Promise.all([
          savePushSubscription(subscription),
          savePushPreference('granted')
        ]).catch(error=>console.warn('No se pudo sincronizar la suscripción push.',error));
        return subscription;
      }
      return enablePush().catch(error=>{
        console.warn('No se pudo recuperar la suscripción push.',error);
        return null;
      });
    }
    if(Notification.permission==='denied'){
      return null;
    }
    await new Promise(resolve=>setTimeout(resolve,1400));
    while(isBusy())await new Promise(resolve=>setTimeout(resolve,250));
    return showPushConsent();
  };

  const connectPush=async options=>{
    let result=null;
    try{
      result=await connectPushInternal(options);
      return result;
    }finally{
      options?.onSettled?.(result);
      document.dispatchEvent(new CustomEvent('kizuna:push-flow-settled',{detail:result||{status:'unavailable'}}));
      void announcePushState();
    }
  };

  const refreshPushTerminalState=async()=>{
    if(!pushClient||!pushUserId||!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window))return;
    if(isIos()&&!standalone())return;
    try{
      if(!registration)await register();
      const currentRegistration=registration||await navigator.serviceWorker.ready;
      const subscription=await currentRegistration.pushManager.getSubscription();
      if(Notification.permission==='granted'&&subscription)await savePushSubscription(subscription);
      else await syncPushTerminalState(subscription);
      void announcePushState();
    }catch(error){
      console.warn('No se pudo actualizar el estado del terminal.',error);
    }
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
        <span>El Archivo Central ha recibido una actualización. Aplícala para continuar con la versión más reciente de KIZUNA.</span>
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
        {scope:baseUrl.pathname,updateViaCache:'none'}
      );
      watchRegistration(registration);
      await registration.update().catch(()=>{});
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
  window.addEventListener('appinstalled',()=>{
    clearTimeout(installCollapseTimer);
    removeElement('.kizuna-pwa-install');
  });
  window.addEventListener('online',showConnectionState);
  window.addEventListener('offline',showConnectionState);
  document.addEventListener('visibilitychange',()=>{
    checkForUpdates();
    if(document.visibilityState==='visible')void refreshPushTerminalState();
  });
  window.addEventListener('pageshow',()=>void refreshPushTerminalState());
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
    connectPush,
    enablePush,
    getPushStatus:pushState,
    openPushProtocol,
    checkForUpdates,
    cachePolicy:'static-public-only'
  };
  if(window.KizunaPendingPushConnection){
    const pending=window.KizunaPendingPushConnection;
    delete window.KizunaPendingPushConnection;
    void connectPush(pending);
  }
})();
