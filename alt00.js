/* KIZUNA · cierre cinematográfico y registro temporal ALT-00. */
window.KizunaFinale=(()=>{
  'use strict';

  const PAGE_TOTAL=10;
  const wait=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
  const pageName=page=>`Pagina-${String(page).padStart(2,'0')}.png`;
  const reducedMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const delay=milliseconds=>wait(reducedMotion()?Math.min(90,milliseconds*.08):milliseconds);
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
        <button class="alt00-reader-zoom" type="button">Ampliar</button>
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
      </footer>
      <p class="alt00-preview-note" ${preview?'':'hidden'}>VISTA DE PRUEBA · NO MODIFICA EL EXPEDIENTE</p>`;
    document.body.appendChild(viewer);
    document.body.classList.add('alberto-overlay-open','kizuna-finale-open');
    const image=viewer.querySelector('img');
    const stage=viewer.querySelector('.alt00-reader-stage');
    const counter=viewer.querySelector('.alt00-reader-counter strong');
    const previous=viewer.querySelector('.alt00-page-prev');
    const next=viewer.querySelector('.alt00-page-next');
    const zoom=viewer.querySelector('.alt00-reader-zoom');
    const strip=viewer.querySelector('.alt00-page-strip');
    let page=Math.min(PAGE_TOTAL,Math.max(1,Number(startPage)||1));
    let pointerStart=null;
    let stateQueue=Promise.resolve();

    strip.innerHTML=Array.from({length:PAGE_TOTAL},(_,index)=>`<button type="button" data-alt00-page="${index+1}" aria-label="Ir a la página ${index+1}"><span>${String(index+1).padStart(2,'0')}</span></button>`).join('');
    const notify=(kind,extra={})=>{
      if(preview)return;
      stateQueue=stateQueue
        .then(()=>onSecretState({kind,page,...extra}))
        .catch(error=>console.warn('No se pudo guardar el estado de ALT-00.',error));
    };
    const paint=nextPage=>{
      page=Math.min(PAGE_TOTAL,Math.max(1,nextPage));
      viewer.classList.remove('is-page-ready');
      image.src=`${assetBase}assets/documents/ALT-00/${pageName(page)}`;
      image.alt=`ALT-00 · página ${page} de ${PAGE_TOTAL}`;
      counter.textContent=`${String(page).padStart(2,'0')} / ${PAGE_TOTAL}`;
      previous.disabled=page===1;
      next.textContent=page===PAGE_TOTAL?'Cerrar registro':'Siguiente →';
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
    const close=()=>{
      document.removeEventListener('keydown',keyboard);
      viewer.classList.add('is-closing');
      setTimeout(()=>{viewer.remove();onClose()},reducedMotion()?0:230);
    };
    image.onload=()=>viewer.classList.add('is-page-ready');
    previous.onclick=()=>paint(page-1);
    next.onclick=()=>page===PAGE_TOTAL?close():paint(page+1);
    strip.querySelectorAll('button').forEach(button=>button.onclick=()=>paint(Number(button.dataset.alt00Page)));
    viewer.querySelector('.alt00-reader-close').onclick=close;
    zoom.onclick=()=>{const expanded=viewer.classList.toggle('is-zoomed');zoom.textContent=expanded?'Ajustar':'Ampliar';stage.scrollTo({top:0,left:0})};
    stage.addEventListener('pointerdown',event=>{pointerStart={x:event.clientX,y:event.clientY};stage.setPointerCapture?.(event.pointerId)});
    stage.addEventListener('pointerup',event=>{
      if(!pointerStart)return;
      const horizontal=event.clientX-pointerStart.x,vertical=event.clientY-pointerStart.y;
      pointerStart=null;
      if(Math.abs(horizontal)>70&&Math.abs(horizontal)>Math.abs(vertical)*1.4){
        if(horizontal<0&&page<PAGE_TOTAL)paint(page+1);
        if(horizontal>0&&page>1)paint(page-1);
      }
    });
    const keyboard=event=>{
      if(!viewer.isConnected){document.removeEventListener('keydown',keyboard);return}
      if(event.key==='ArrowRight'&&page<PAGE_TOTAL)paint(page+1);
      if(event.key==='ArrowLeft'&&page>1)paint(page-1);
      if(event.key==='Escape')close();
    };
    document.addEventListener('keydown',keyboard);
    notify('discovered');
    paint(page);
    requestAnimationFrame(()=>viewer.classList.add('is-visible'));
    return viewer;
  };

  const showCredits=async(overlay,options)=>{
    const main=overlay.querySelector('main');
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
    anomaly.classList.add('is-detected');
    // La anomalía debe seguir siendo descubrible aunque el sistema solicite
    // reducir movimiento: se eliminan animaciones, no el tiempo de lectura.
    await wait(options.preview?30000:7000);
    if(!credits.isConnected||opened)return;
    anomaly.classList.remove('is-detected');
    anomaly.classList.add('is-erased');
    await delay(1300);
    if(credits.isConnected)exit.classList.add('is-visible');
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
    await delay(520);
    terminal.textContent+='\n\nRespuesta registrada.';
    await delay(620);
    terminal.textContent+='\n\nActualizando estado del expediente...';
    await delay(900);
    if(skipped)return overlay;
    terminal.hidden=true;state.hidden=false;
    await delay(600);oldState.classList.add('is-erased');
    await delay(650);newState.textContent='ACEPTADO';newState.classList.add('is-visible');
    await delay(850);stamp.hidden=false;requestAnimationFrame(()=>stamp.classList.add('is-visible'));
    await delay(1150);
    if(skipped)return overlay;
    state.hidden=true;stamp.hidden=true;
    await typeText(phrase,'Porque los mejores recuerdos...',38);
    await delay(650);phrase.textContent+='\n...todavía están por escribirse.';
    await delay(900);logo.hidden=false;requestAnimationFrame(()=>logo.classList.add('is-visible'));
    await delay(1200);
    await typeText(note,'Registro interno actualizado.\n\nEl destinatario ha aceptado la expedición.\n\nNo se requieren más intervenciones.',16);
    await delay(1350);
    if(skipped)return overlay;
    note.classList.add('is-changing');
    await delay(380);
    note.textContent='Buen viaje.';
    note.classList.remove('is-changing');
    note.classList.add('is-farewell');
    await delay(1500);
    if(!skipped)showCredits(overlay,settings);
    return overlay;
  };

  return{play,openComic,close:removeActive};
})();
