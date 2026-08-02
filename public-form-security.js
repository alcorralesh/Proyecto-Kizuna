/* KIZUNA · protección común para formularios públicos.
   Introduce aquí la clave pública de Turnstile cuando se cree el widget.
   El secreto TURNSTILE_SECRET se configura exclusivamente en Supabase. */
(()=>{
  'use strict';
  if(window.KizunaPublicFormSecurity)return;
  const TURNSTILE_SITE_KEY='0x4AAAAAAEEd9I8KknCIsfOB';
  const widgets=new WeakMap();
  let turnstileLoader=null;

  const addTrap=form=>{
    if(form.querySelector('[name="website"]'))return;
    const trap=document.createElement('label');
    trap.className='public-form-trap';
    trap.style.cssText='position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
    trap.setAttribute('aria-hidden','true');
    trap.innerHTML='No rellenar este campo<input name="website" tabindex="-1" autocomplete="off">';
    form.appendChild(trap);
  };

  const loadTurnstile=()=>{
    if(!TURNSTILE_SITE_KEY)return Promise.resolve(false);
    if(window.turnstile)return Promise.resolve(true);
    if(window.KizunaTurnstileLoader)return window.KizunaTurnstileLoader;
    if(!turnstileLoader)turnstileLoader=new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async=true;script.defer=true;
      script.onload=()=>resolve(true);
      script.onerror=()=>reject(new Error('No se pudo cargar la verificación antispam.'));
      document.head.appendChild(script);
    });
    window.KizunaTurnstileLoader=turnstileLoader;
    return turnstileLoader;
  };

  const prepare=async(form,action)=>{
    if(!form)return;
    addTrap(form);
    form.dataset.publicFormStartedAt=String(Date.now());
    form.dataset.publicFormAction=action;
    if(!TURNSTILE_SITE_KEY)return;
    await loadTurnstile();
    if(widgets.has(form))return;
    const container=document.createElement('div');
    container.className='public-form-turnstile';
    container.style.margin='0 0 14px';
    const submit=form.querySelector('[type="submit"],button');
    if(submit)submit.before(container);else form.appendChild(container);
    const state={id:null,token:'',resolve:null,pending:null,invalid:false,container};
    state.id=window.turnstile.render(container,{
      sitekey:TURNSTILE_SITE_KEY,
      action,
      execution:'execute',
      appearance:'interaction-only',
      size:'flexible',
      callback:token=>{state.token=token;state.invalid=false;state.resolve?.(token);state.resolve=null},
      'expired-callback':()=>{state.token=''},
      'error-callback':()=>{state.invalid=true;state.resolve?.('');state.resolve=null},
    });
    widgets.set(form,state);
  };

  const tokenFor=async form=>{
    if(!TURNSTILE_SITE_KEY)return '';
    await prepare(form,form.dataset.publicFormAction||'public_form');
    const state=widgets.get(form);
    if(state?.token)return state.token;
    if(state?.pending)return state.pending;
    state.pending=new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>{state.resolve=null;state.invalid=true;reject(new Error('La verificación ha tardado demasiado. Inténtalo de nuevo.'))},45000);
      state.resolve=token=>{clearTimeout(timeout);token?resolve(token):reject(new Error('No se ha podido completar la verificación antispam.'))};
      try{window.turnstile.execute(state.container)}catch(error){clearTimeout(timeout);state.resolve=null;state.invalid=true;reject(error)}
    }).finally(()=>{state.pending=null});
    return state.pending;
  };

  const payloadFor=async(form,fields={})=>({
    ...fields,
    website:String(form.elements.website?.value||''),
    startedAt:Number(form.dataset.publicFormStartedAt)||Date.now(),
    turnstileToken:await tokenFor(form),
  });

  const reset=form=>{
    form.dataset.publicFormStartedAt=String(Date.now());
    const state=widgets.get(form);
    if(!state)return;
    state.token='';state.resolve=null;state.pending=null;
    if(state.invalid){state.container.remove();widgets.delete(form);void prepare(form,form.dataset.publicFormAction||'public_form');return}
    try{window.turnstile?.reset(state.id)}catch{state.container.remove();widgets.delete(form);void prepare(form,form.dataset.publicFormAction||'public_form')}
  };

  window.KizunaPublicFormSecurity={prepare,payloadFor,reset,turnstileConfigured:Boolean(TURNSTILE_SITE_KEY)};
})();
