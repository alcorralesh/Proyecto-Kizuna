/* KIZUNA · cierre cinematográfico y registro temporal ALT-00. */
window.KizunaFinale=(()=>{
  'use strict';

  const PAGE_TOTAL=10;
  const wait=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
  const pageName=page=>`Pagina-${String(page).padStart(2,'0')}.png`;
  const reducedMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const layerNavigation=window.KizunaLayerNavigation||(window.KizunaLayerNavigation=(()=>{
    const layers=[];
    let suppressNextPop=false;
    const stateFor=layer=>({
      ...(history.state&&typeof history.state==='object'?history.state:{}),
      kizunaLayer:{token:layer.token,scope:layer.scope,type:layer.type}
    });
    const run=callback=>{try{const result=callback?.();if(result?.catch)result.catch(error=>console.warn('No se pudo cerrar la capa de navegación.',error))}catch(error){console.warn('No se pudo cerrar la capa de navegación.',error)}};
    window.addEventListener('popstate',()=>{
      if(suppressNextPop){suppressNextPop=false;return}
      const layer=layers.pop();
      if(layer)run(layer.onBack);
    });
    return {
      push(scope,type,onBack){
        const layer={scope,type,onBack,token:`${scope}:${type}:${Date.now()}:${Math.random().toString(36).slice(2)}`};
        layers.push(layer);
        history.pushState(stateFor(layer),'',location.href);
        return layer.token;
      },
      back(token){
        const top=layers.at(-1);
        if(!top||top.token!==token)return false;
        history.back();
        return true;
      },
      discard(token){
        const top=layers.at(-1);
        if(!top||top.token!==token)return false;
        layers.pop();
        suppressNextPop=true;
        history.back();
        return true;
      },
      discardScope(scope){
        let count=0;
        for(let index=layers.length-1;index>=0&&layers[index].scope===scope;index--)count++;
        if(!count)return false;
        layers.splice(layers.length-count,count);
        suppressNextPop=true;
        history.go(-count);
        return true;
      },
      isTop(token){return layers.at(-1)?.token===token}
    };
  })());
  // Reducir movimiento elimina transiciones, pero nunca debe eliminar el
  // tiempo que necesita una persona para leer cada pantalla.
  const delay=milliseconds=>wait(milliseconds);
  let activeOverlay=null;

  const removeActive=()=>{
    document.querySelector('#alt00-viewer')?.remove();
    activeOverlay?.remove();
    activeOverlay=null;
    document.body.classList.remove('alberto-overlay-open','kizuna-finale-open');
  };

  const typeText=async(element,text,speed=24)=>{
    element.textContent='';
    if(reducedMotion()){
      element.textContent=text;
      return;
    }
    for(const character of text){
      if(!element.isConnected)return;
      element.textContent+=character;
      await wait(speed);
    }
  };

  const openComic=(options={})=>{
    const {
      assetBase='',
      startPage=1,
      preview=false,
      onSecretState=()=>{},
      onClose=()=>{}
    }=options;
    document.querySelector('#alt00-viewer')?.remove();
    const viewer=document.createElement('section');
    viewer.id='alt00-viewer';
    viewer.setAttribute('role','dialog');
    viewer.setAttribute('aria-modal','true');
    viewer.setAttribute('aria-labelledby','alt00-title');
    viewer.innerHTML=`
      <header class="alt00-reader-head">
        <div class="alt00-reader-identity">
          <span>PROTOCOLO OMEGA · ACCESO RESTRINGIDO</span>
          <h2 id="alt00-title">Expediente Alternativo 001</h2>
        </div>
        <div class="alt00-reader-counter"><span>PÁGINA</span><strong>01 / ${PAGE_TOTAL}</strong></div>
        <nav class="alt00-reader-tools" aria-label="Controles de visualización">
          <button type="button" data-alt00-action="out" aria-label="Reducir zoom">−</button>
          <output>100 %</output>
          <button type="button" data-alt00-action="in" aria-label="Aumentar zoom">+</button>
          <button type="button" data-alt00-action="fit">Ajustar</button>
          <button type="button" data-alt00-action="full" aria-label="Pantalla completa">⛶</button>
        </nav>
        <button class="alt00-reader-close" type="button" aria-label="Cerrar registro">×</button>
      </header>
      <main class="alt00-reader-stage">
        <div class="alt00-reader-scan" aria-hidden="true"></div>
        <figure>
          <img alt="ALT-00 · página 1 de ${PAGE_TOTAL}">
          <figcaption>REGISTRO TEMPORAL Ω-13 · LÍNEA NO AUTORIZADA</figcaption>
        </figure>
      </main>
      <footer class="alt00-reader-foot">
        <button class="alt00-page-prev" type="button">← Anterior</button>
        <nav class="alt00-page-strip" aria-label="Páginas del registro"></nav>
        <button class="alt00-page-next" type="button">Siguiente →</button>
        <button class="alt00-reader-exit" type="button">${assetBase==='../'?'Volver al expediente':'Cerrar registro'}</button>
      </footer>
      <p class="alt00-preview-note" ${preview?'':'hidden'}>VISTA DE PRUEBA · NO MODIFICA EL EXPEDIENTE</p>`;
    document.body.appendChild(viewer);
    document.body.classList.add('alberto-overlay-open','kizuna-finale-open');
    const image=viewer.querySelector('img');
    const stage=viewer.querySelector('.alt00-reader-stage');
    const figure=viewer.querySelector('figure');
    const counter=viewer.querySelector('.alt00-reader-counter strong');
    const previous=viewer.querySelector('.alt00-page-prev');
    const next=viewer.querySelector('.alt00-page-next');
    const zoomOutput=viewer.querySelector('.alt00-reader-tools output');
    const zoomOut=viewer.querySelector('[data-alt00-action="out"]');
    const zoomIn=viewer.querySelector('[data-alt00-action="in"]');
    const zoomFit=viewer.querySelector('[data-alt00-action="fit"]');
    const fullscreen=viewer.querySelector('[data-alt00-action="full"]');
    const strip=viewer.querySelector('.alt00-page-strip');
    const closeControl=viewer.querySelector('.alt00-reader-close');
    const exitControl=viewer.querySelector('.alt00-reader-exit');
    let page=Math.min(PAGE_TOTAL,Math.max(1,Number(startPage)||1));
    let scale=1,fitScale=1,pinchStart=null,moved=false;
    const pointers=new Map();
    let fullscreenChange=()=>{};
    let resizeTimer=0;
    let stateQueue=Promise.resolve();
    const navigationScope=`alt00-reader:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    let comicLayerToken=null,fullscreenLayerToken=null,closing=false;

    strip.innerHTML=Array.from({length:PAGE_TOTAL},(_,index)=>`<button type="button" data-alt00-page="${index+1}" aria-label="Ir a la página ${index+1}"><span>${String(index+1).padStart(2,'0')}</span></button>`).join('');
    const notify=(kind,extra={})=>{
      if(preview)return;
      stateQueue=stateQueue
        .then(()=>onSecretState({kind,page,...extra}))
        .catch(error=>console.warn('No se pudo guardar el estado de ALT-00.',error));
    };
    const clampScale=value=>Math.min(3.5,Math.max(fitScale,value));
    const updateZoom=()=>{
      if(!image.naturalWidth)return;
      const width=Math.round(image.naturalWidth*scale);
      image.style.width=`${width}px`;
      image.style.maxWidth='none';
      image.style.maxHeight='none';
      figure.style.width=`${width}px`;
      figure.style.maxWidth='none';
      zoomOutput.textContent=`${Math.round(scale/fitScale*100)} %`;
      viewer.classList.toggle('is-zoomed',scale>fitScale*1.03);
      zoomOut.disabled=scale<=fitScale*1.01;
    };
    const setScale=(value,clientX=stage.getBoundingClientRect().left+stage.clientWidth/2,clientY=stage.getBoundingClientRect().top+stage.clientHeight/2)=>{
      if(!image.naturalWidth)return;
      const previousScale=scale,nextScale=clampScale(value),rect=stage.getBoundingClientRect();
      const focusX=stage.scrollLeft+clientX-rect.left,focusY=stage.scrollTop+clientY-rect.top;
      scale=nextScale;
      updateZoom();
      stage.scrollLeft=focusX*(nextScale/previousScale)-(clientX-rect.left);
      stage.scrollTop=focusY*(nextScale/previousScale)-(clientY-rect.top);
    };
    const fit=()=>{
      if(!image.naturalWidth)return;
      const mobile=matchMedia('(max-width:700px)').matches;
      const widthScale=Math.max(.1,(stage.clientWidth-(mobile?12:36))/image.naturalWidth);
      const heightScale=Math.max(.1,(stage.clientHeight-(mobile?16:36))/image.naturalHeight);
      fitScale=mobile?widthScale:Math.min(1,widthScale,heightScale);
      scale=fitScale;
      updateZoom();
      stage.scrollTo({top:0,left:0});
    };
    const paint=nextPage=>{
      page=Math.min(PAGE_TOTAL,Math.max(1,nextPage));
      viewer.classList.remove('is-page-ready');
      image.src=`${assetBase}assets/documents/ALT-00/${pageName(page)}`;
      image.alt=`ALT-00 · página ${page} de ${PAGE_TOTAL}`;
      counter.textContent=`${String(page).padStart(2,'0')} / ${PAGE_TOTAL}`;
      previous.disabled=page===1;
      next.disabled=page===PAGE_TOTAL;
      next.textContent='Siguiente →';
      strip.querySelectorAll('button').forEach(button=>{
        const selected=Number(button.dataset.alt00Page)===page;
        button.classList.toggle('active',selected);
        button.setAttribute('aria-current',selected?'page':'false');
      });
      strip.querySelector(`[data-alt00-page="${page}"]`)?.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'nearest',inline:'center'});
      stage.scrollTo({top:0,left:0});
      [page-1,page+1].filter(value=>value>=1&&value<=PAGE_TOTAL).forEach(value=>{const preload=new Image();preload.src=`${assetBase}assets/documents/ALT-00/${pageName(value)}`});
      notify(page===PAGE_TOTAL?'completed':'page');
    };
    const performClose=()=>{
      if(closing)return;
      closing=true;
      document.removeEventListener('keydown',keyboard);
      document.removeEventListener('fullscreenchange',fullscreenChange);
      window.removeEventListener('resize',resize);
      clearTimeout(resizeTimer);
      viewer.classList.add('is-closing');
      setTimeout(()=>{
        viewer.remove();
        if(!document.querySelector('.kizuna-cinematic-finale,#alt00-viewer')){
          document.body.classList.remove('alberto-overlay-open','kizuna-finale-open');
        }
        onClose();
      },reducedMotion()?0:230);
    };
    const close=()=>{
      if(comicLayerToken&&layerNavigation.back(comicLayerToken))return;
      performClose();
    };
    image.onload=()=>{fit();viewer.classList.add('is-page-ready')};
    previous.onclick=()=>paint(page-1);
    next.onclick=()=>paint(page+1);
    exitControl.onclick=close;
    strip.querySelectorAll('button').forEach(button=>button.onclick=()=>paint(Number(button.dataset.alt00Page)));
    zoomOut.onclick=()=>setScale(scale/1.25);
    zoomIn.onclick=()=>setScale(scale*1.25);
    zoomFit.onclick=fit;
    const setImmersive=active=>{
      viewer.classList.toggle('is-immersive',active);
      fullscreen.classList.toggle('active',active);
      fullscreen.setAttribute('aria-pressed',String(active));
      closeControl.setAttribute('aria-label',active?'Salir del modo de lectura inmersiva':'Cerrar registro');
      setTimeout(fit,50);
    };
    const exitDisplayMode=async()=>{
      if(document.fullscreenElement===viewer)await document.exitFullscreen();
      else if(viewer.classList.contains('is-immersive'))setImmersive(false);
    };
    const exitDisplayModeFromHistory=async()=>{
      fullscreenLayerToken=null;
      await exitDisplayMode();
    };
    const ensureFullscreenLayer=()=>{
      if(!fullscreenLayerToken)fullscreenLayerToken=layerNavigation.push(navigationScope,'fullscreen',exitDisplayModeFromHistory);
    };
    const enterDisplayMode=async()=>{
      if(viewer.requestFullscreen){
        try{
          await viewer.requestFullscreen();
          if(document.fullscreenElement===viewer){ensureFullscreenLayer();return}
        }catch(error){console.warn('Pantalla completa nativa no disponible; se activa el modo inmersivo.',error)}
      }
      setImmersive(true);
      ensureFullscreenLayer();
    };
    const leaveDisplayMode=async()=>{
      if(fullscreenLayerToken&&layerNavigation.back(fullscreenLayerToken))return;
      await exitDisplayMode();
    };
    closeControl.onclick=async()=>{
      if(document.fullscreenElement===viewer||viewer.classList.contains('is-immersive'))await leaveDisplayMode();
      else close();
    };
    fullscreen.onclick=async()=>{
      if(document.fullscreenElement===viewer||viewer.classList.contains('is-immersive')){await leaveDisplayMode();return}
      await enterDisplayMode();
    };
    fullscreenChange=()=>{
      const active=document.fullscreenElement===viewer;
      if(active)ensureFullscreenLayer();
      else if(fullscreenLayerToken){
        const token=fullscreenLayerToken;
        fullscreenLayerToken=null;
        layerNavigation.discard(token);
      }
      fullscreen.classList.toggle('active',active);
      fullscreen.setAttribute('aria-pressed',String(active));
      closeControl.setAttribute('aria-label',active?'Salir del modo de lectura inmersiva':'Cerrar registro');
      setTimeout(fit,50);
    };
    document.addEventListener('fullscreenchange',fullscreenChange);
    const resize=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(fit,120)};
    window.addEventListener('resize',resize);
    stage.addEventListener('wheel',event=>{if(!event.ctrlKey)return;event.preventDefault();setScale(scale*(event.deltaY<0?1.16:.86),event.clientX,event.clientY)},{passive:false});
    const pointerDistance=points=>Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);
    const pointerCenter=points=>({x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2});
    stage.addEventListener('pointerdown',event=>{
      const point={x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,scrollX:stage.scrollLeft,scrollY:stage.scrollTop};
      pointers.set(event.pointerId,point);moved=false;stage.setPointerCapture?.(event.pointerId);
      if(pointers.size===2){const points=[...pointers.values()].slice(0,2);pinchStart={distance:Math.max(1,pointerDistance(points)),scale};viewer.classList.add('is-pinching')}
    });
    stage.addEventListener('pointermove',event=>{
      const point=pointers.get(event.pointerId);if(!point)return;
      point.x=event.clientX;point.y=event.clientY;
      const points=[...pointers.values()].slice(0,2);
      if(points.length===2&&pinchStart){
        event.preventDefault();moved=true;const center=pointerCenter(points);
        setScale(pinchStart.scale*pointerDistance(points)/pinchStart.distance,center.x,center.y);
      }else{
        const dx=event.clientX-point.startX,dy=event.clientY-point.startY;
        if(Math.hypot(dx,dy)>5)moved=true;
        if(moved){event.preventDefault();stage.scrollLeft=point.scrollX-dx;stage.scrollTop=point.scrollY-dy}
      }
    });
    const releasePointer=event=>{
      const point=pointers.get(event.pointerId);
      if(point&&pointers.size===1&&scale<=fitScale*1.03){
        const horizontal=event.clientX-point.startX,vertical=event.clientY-point.startY;
        if(Math.abs(horizontal)>85&&Math.abs(horizontal)>Math.abs(vertical)*1.5){
          if(horizontal<0&&page<PAGE_TOTAL)paint(page+1);
          if(horizontal>0&&page>1)paint(page-1);
        }
      }
      pointers.delete(event.pointerId);pinchStart=null;viewer.classList.remove('is-pinching');
    };
    stage.addEventListener('pointerup',releasePointer);
    stage.addEventListener('pointercancel',releasePointer);
    const keyboard=event=>{
      if(!viewer.isConnected){document.removeEventListener('keydown',keyboard);return}
      if(event.key==='ArrowRight'&&page<PAGE_TOTAL)paint(page+1);
      if(event.key==='ArrowLeft'&&page>1)paint(page-1);
      if(event.key==='Escape'){
        if(document.fullscreenElement===viewer||viewer.classList.contains('is-immersive'))void leaveDisplayMode();
        else close();
      }
    };
    document.addEventListener('keydown',keyboard);
    comicLayerToken=layerNavigation.push(navigationScope,'comic',()=>{
      comicLayerToken=null;
      performClose();
    });
    notify('discovered');
    paint(page);
    requestAnimationFrame(()=>viewer.classList.add('is-visible'));
    return viewer;
  };

  const showCredits=async(overlay,options)=>{
    const main=overlay.querySelector('main');
    const skip=overlay.querySelector('.kizuna-finale-skip');
    if(skip)skip.hidden=true;
    main.innerHTML=`
      <section class="alt00-credits" aria-label="Créditos del expediente">
        <header><span>CIERRE DEL EXPEDIENTE</span><i></i><strong>KIZUNA</strong></header>
        <div class="alt00-credit-reel">
          <p>EXPEDIENTE</p><h2>KTB-EXP-2026-JP-00184</h2>
          <p>DESTINATARIO</p><h3>JOSÉ CUADRADO</h3>
          <p>DOCUMENTOS RECUPERADOS</p><strong>20 DE 20</strong>
          <p>ARCHIVOS COMPLEMENTARIOS</p><strong>AC-01 · REGISTRO ILUSTRADO</strong>
          <p>ESTADO FINAL</p><strong>EXPEDICIÓN CONFIRMADA</strong>
          <button class="alt00-credit-anomaly" type="button">
            <small>REGISTRO DESCARTADO</small>
            <b>ALT-00 · EXPEDICIÓN RECHAZADA</b>
            <span>ABRIR ANOMALÍA →</span>
          </button>
          <p class="alt00-credit-end">ARCHIVO CENTRAL · REGISTRO CERRADO</p>
        </div>
        <footer>
          <span>Algunos registros no forman parte de la versión oficial.</span>
          <button class="alt00-finale-exit" type="button">Volver a KIZUNA</button>
        </footer>
      </section>`;
    const credits=main.querySelector('.alt00-credits');
    const anomaly=main.querySelector('.alt00-credit-anomaly');
    const exit=main.querySelector('.alt00-finale-exit');
    let opened=false;
    const closeFinale=()=>{
      if(options.requestFinaleClose){options.requestFinaleClose();return}
      overlay.classList.add('is-closing');
      setTimeout(()=>{removeActive();options.onClose?.()},reducedMotion()?0:300);
    };
    exit.onclick=closeFinale;
    anomaly.onclick=()=>{
      if(opened)return;
      opened=true;
      credits.classList.add('is-accessing');
      setTimeout(()=>{
        openComic({
          ...options,
          startPage:options.lastPage||1,
          onClose:()=>{
            credits.classList.remove('is-accessing');
            exit.textContent='Cerrar experiencia';
          }
        });
      },reducedMotion()?0:620);
    };
    requestAnimationFrame(()=>credits.classList.add('is-running'));
    await delay(3900);
    if(!credits.isConnected||opened)return;
    if(!options.preview){
      try{
        await options.onSecretState?.({kind:'discovered',page:Math.max(1,Number(options.lastPage)||1)});
      }catch(error){
        console.warn('No se pudo registrar la detección de ALT-00.',error);
      }
    }
    if(!credits.isConnected||opened)return;
    anomaly.classList.add('is-detected');
    // La anomalía debe seguir siendo descubrible aunque el sistema solicite
    // reducir movimiento: se eliminan animaciones, no el tiempo de lectura.
    await wait(options.preview?30000:7000);
    if(!credits.isConnected||opened)return;
    if(credits.isConnected)exit.classList.add('is-visible');
  };

  const previewResponseOutcome=(options={})=>{
    const settings={assetBase:'../',displayName:'José Cuadrado',...options};
    removeActive();
    const overlay=document.createElement('section');
    overlay.id='alt00-response-preview';
    overlay.className='kizuna-cinematic-finale';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-labelledby','alt00-response-title');
    overlay.innerHTML=`
      <p class="kizuna-finale-preview">VISTA DE PRUEBA · NO SE GUARDARÁ NINGÚN CAMBIO</p>
      <article class="alt00-response-stage">
        <header>
          <div><img src="${settings.assetBase}assets/kizuna-logo-official.png" alt=""><span>DIVISIÓN DE ARCHIVOS TEMPORALES<small>COMITÉ KIZUNA · RESPUESTA PERSONAL</small></span></div>
          <b>DECISIÓN REGISTRADA</b>
          <button type="button" class="alt00-response-close" aria-label="Cerrar vista previa">×</button>
        </header>
        <main>
          <section class="alt00-response-decision">
            <p class="alt00-response-kicker">LÍNEA TEMPORAL ELEGIDA</p>
            <h1 id="alt00-response-title">Tu decisión<br><em>queda confirmada.</em></h1>
            <p class="alt00-response-copy">La respuesta personal ha sido incorporada al expediente archivado. No se requieren nuevas verificaciones.</p>
            <dl>
              <div><dt>Destinatario</dt><dd>${String(settings.displayName).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]))}</dd></div>
              <div><dt>Respuesta</dt><dd>ACEPTADA</dd></div>
              <div><dt>Estado</dt><dd>LÍNEA TEMPORAL CONFIRMADA</dd></div>
            </dl>
            <blockquote>La historia continúa.</blockquote>
          </section>
          <section class="alt00-response-anomaly" aria-live="polite">
            <div class="alt00-response-signal" aria-hidden="true"><i></i><span>SEÑAL RESIDUAL DETECTADA</span></div>
            <div class="alt00-response-file">
              <p>ANEXO RETROSPECTIVO AUTORIZADO</p>
              <h2><span>PROTOCOLO OMEGA</span>ALT‑00</h2>
              <h3>Línea temporal descartada</h3>
              <p>El Comité KIZUNA ha liberado una simulación vinculada a la decisión que no fue elegida.</p>
              <dl><div><dt>Clasificación</dt><dd>EXPEDIENTE ALTERNATIVO</dd></div><div><dt>Contenido</dt><dd>10 PÁGINAS DISPONIBLES</dd></div></dl>
              <button type="button" class="alt00-response-open">Consultar la otra posibilidad <b>→</b></button>
            </div>
          </section>
        </main>
        <footer>
          <span>Este registro no pertenece a la línea temporal autorizada.</span>
          <button type="button" class="alt00-response-exit">Cerrar y volver a Administración</button>
        </footer>
      </article>`;
    document.body.appendChild(overlay);
    document.body.classList.add('alberto-overlay-open','kizuna-finale-open');
    activeOverlay=overlay;
    const stage=overlay.querySelector('.alt00-response-stage');
    const anomaly=overlay.querySelector('.alt00-response-anomaly');
    const reveal=()=>{
      if(!overlay.isConnected||anomaly.classList.contains('is-revealed'))return;
      stage.classList.add('is-interference');
      setTimeout(()=>{
        anomaly.classList.add('is-revealed');
        stage.classList.remove('is-interference');
      },reducedMotion()?0:520);
    };
    const close=()=>{overlay.classList.add('is-closing');setTimeout(removeActive,reducedMotion()?0:260)};
    overlay.querySelector('.alt00-response-close').onclick=close;
    overlay.querySelector('.alt00-response-exit').onclick=close;
    overlay.querySelector('.alt00-response-open').onclick=()=>{
      openComic({
        assetBase:settings.assetBase,
        startPage:1,
        preview:true,
        onClose:()=>stage.classList.add('is-returned')
      });
    };
    requestAnimationFrame(()=>stage.classList.add('is-visible'));
    setTimeout(reveal,reducedMotion()?900:2700);
    return overlay;
  };

  const play=async(options={})=>{
    const settings={
      assetBase:'',
      preview:false,
      lastPage:1,
      onSecretState:()=>{},
      onClose:()=>{},
      ...options
    };
    removeActive();
    const overlay=document.createElement('section');
    overlay.id='alberto-finale';
    overlay.className='kizuna-cinematic-finale';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label',settings.preview?'Prueba del final':'Final de la experiencia');
    overlay.innerHTML=`
      <button class="kizuna-finale-skip" type="button">Saltar al cierre</button>
      <p class="kizuna-finale-preview" ${settings.preview?'':'hidden'}>VISTA DE PRUEBA · NO SE GUARDARÁ NINGÚN CAMBIO</p>
      <main>
        <div id="alberto-terminal"></div>
        <section id="alberto-expedient-state" hidden>
          <p>EXPEDIENTE JP-2026-001</p>
          <div><span>Estado anterior:</span><strong id="alberto-old-state">PLANIFICADO</strong></div>
          <div><span>Estado actual:</span><strong id="alberto-new-state"></strong></div>
        </section>
        <div id="alberto-confirmed-stamp" hidden>EXPEDICIÓN CONFIRMADA</div>
        <div id="alberto-last-phrase"></div>
        <img id="alberto-finale-logo" src="${settings.assetBase}assets/kizuna-logo-official.png" alt="KIZUNA" hidden>
        <div id="alberto-system-note"></div>
      </main>`;
    document.body.appendChild(overlay);
    activeOverlay=overlay;
    document.body.classList.add('alberto-overlay-open','kizuna-finale-open');
    const finaleNavigationScope=`kizuna-finale:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    let finaleLayerToken=null,finaleClosing=false;
    const performFinaleClose=()=>{
      if(finaleClosing)return;
      finaleClosing=true;
      overlay.classList.add('is-closing');
      setTimeout(()=>{removeActive();settings.onClose?.()},reducedMotion()?0:300);
    };
    settings.requestFinaleClose=()=>{
      if(finaleLayerToken&&layerNavigation.back(finaleLayerToken))return;
      performFinaleClose();
    };
    finaleLayerToken=layerNavigation.push(finaleNavigationScope,'finale',()=>{
      finaleLayerToken=null;
      performFinaleClose();
    });
    const terminal=overlay.querySelector('#alberto-terminal');
    const state=overlay.querySelector('#alberto-expedient-state');
    const oldState=overlay.querySelector('#alberto-old-state');
    const newState=overlay.querySelector('#alberto-new-state');
    const stamp=overlay.querySelector('#alberto-confirmed-stamp');
    const phrase=overlay.querySelector('#alberto-last-phrase');
    const logo=overlay.querySelector('#alberto-finale-logo');
    const note=overlay.querySelector('#alberto-system-note');
    let skipped=false;
    overlay.querySelector('.kizuna-finale-skip').onclick=event=>{
      if(skipped)return;
      skipped=true;
      event.currentTarget.hidden=true;
      showCredits(overlay,settings);
    };
    await delay(500);
    if(skipped)return overlay;
    await typeText(terminal,'Procesando respuesta...');
    await delay(900);
    terminal.textContent+='\n\nRespuesta registrada.';
    await delay(1100);
    terminal.textContent+='\n\nActualizando estado del expediente...';
    await delay(1500);
    if(skipped)return overlay;
    terminal.hidden=true;state.hidden=false;
    await delay(600);oldState.classList.add('is-erased');
    await delay(650);newState.textContent='ACEPTADO';newState.classList.add('is-visible');
    await delay(1000);stamp.hidden=false;requestAnimationFrame(()=>stamp.classList.add('is-visible'));
    await delay(1900);
    if(skipped)return overlay;
    state.hidden=true;stamp.hidden=true;
    await typeText(phrase,'Porque los mejores recuerdos...',38);
    await delay(900);phrase.textContent+='\n...todavía están por escribirse.';
    await delay(2600);logo.hidden=false;requestAnimationFrame(()=>logo.classList.add('is-visible'));
    await delay(1900);
    await typeText(note,'Registro interno actualizado.\n\nEl destinatario ha aceptado la expedición.\n\nNo se requieren más intervenciones.',16);
    await delay(4200);
    if(skipped)return overlay;
    note.classList.add('is-changing');
    await delay(380);
    note.textContent='Buen viaje.';
    note.classList.remove('is-changing');
    note.classList.add('is-farewell');
    await delay(2600);
    if(!skipped)showCredits(overlay,settings);
    return overlay;
  };

  return{play,openComic,previewResponseOutcome,close:removeActive};
})();
