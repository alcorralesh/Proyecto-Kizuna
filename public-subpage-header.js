(()=>{
  const header=document.querySelector('[data-kizuna-subpage-header]');
  if(!header)return;
  const rootUrl=new URL(header.dataset.root||'./',location.href);
  const sessionRoot=header.querySelector('[data-kizuna-subpage-session]');
  if(!sessionRoot)return;
  const escape=value=>String(value??'').replace(/[&<>'"]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
  const asset=name=>new URL(`assets/header-icons/${name}.svg`,rootUrl).href;
  const controlIcon=(name,fallback)=>`<span class="kizuna-subpage-control-icon" aria-hidden="true"><img src="${asset(name)}" alt="" onerror="this.remove();this.parentElement.textContent='${fallback}'"></span>`;
  const accessHref=new URL('expediente/index.html',rootUrl).href;
  const renderLoggedOut=()=>{
    sessionRoot.className='kizuna-subpage-session';
    sessionRoot.innerHTML=`<a class="kizuna-subpage-control kizuna-subpage-access" href="${accessHref}">${controlIcon('expedient','E')}<span class="kizuna-subpage-control-label">Acceso al expediente</span></a>`;
  };
  const getClient=async()=>{
    if(window.KizunaSubpageSupabase)return window.KizunaSubpageSupabase;
    if(window.getKizunaPublicSupabase){window.KizunaSubpageSupabase=await window.getKizunaPublicSupabase();return window.KizunaSubpageSupabase}
    if(window.getKizunaBlogSupabase){window.KizunaSubpageSupabase=await window.getKizunaBlogSupabase();return window.KizunaSubpageSupabase}
    if(!window.supabase){
      window.KizunaSubpageSupabaseLoader ||= new Promise((resolve,reject)=>{
        const script=document.createElement('script');
        script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload=resolve;
        script.onerror=reject;
        document.head.appendChild(script);
      });
      await window.KizunaSubpageSupabaseLoader;
    }
    window.KizunaSubpageSupabase=window.supabase.createClient('https://vcwqkideizdrhzpbghkj.supabase.co','sb_publishable_h3pjxT8UPZkYqRhLskVdlA_m-ulI4EF');
    return window.KizunaSubpageSupabase;
  };
  const closePanel=()=>{
    const trigger=sessionRoot.querySelector('[data-subpage-session-toggle]');
    const panel=sessionRoot.querySelector('[data-subpage-session-panel]');
    sessionRoot.classList.remove('is-open');
    if(trigger)trigger.setAttribute('aria-expanded','false');
    if(panel)panel.hidden=true;
  };
  const renderLoggedIn=(client,user,profile)=>{
    const admin=user?.app_metadata?.role==='admin';
    const displayName=admin?'Administración':profile?.display_name||user.user_metadata?.display_name||user.email?.split('@')[0]||'Usuario autorizado';
    const destination=new URL(admin?'expediente/index.html?admin=1':'expediente/index.html?archive=1',rootUrl).href;
    const shortLabel=admin?'Administración':'Expediente';
    const destinationLabel=admin?'Volver al panel de administración':'Volver al expediente';
    sessionRoot.className='kizuna-subpage-session active';
    sessionRoot.innerHTML=`<button class="kizuna-subpage-control" type="button" data-subpage-session-toggle aria-expanded="false" aria-controls="kizuna-subpage-session-panel">${controlIcon('expedient','E')}<span class="kizuna-subpage-control-label">${shortLabel}</span></button><aside class="kizuna-subpage-session-panel" id="kizuna-subpage-session-panel" data-subpage-session-panel hidden><header><small>${admin?'SESIÓN ADMINISTRATIVA':'DESTINATARIO AUTORIZADO'}</small><strong>${escape(displayName)}</strong></header><a class="kizuna-subpage-panel-action is-primary" href="${destination}">${controlIcon('expedient','E')}<span><small>${admin?'GESTIÓN INTERNA':'ARCHIVO CENTRAL'}</small><b>${destinationLabel}</b></span></a><button class="kizuna-subpage-panel-action" type="button" data-subpage-sign-out>${controlIcon('exit','→')}<span><small>SESIÓN ACTIVA</small><b>Cerrar sesión</b></span></button></aside>`;
    const trigger=sessionRoot.querySelector('[data-subpage-session-toggle]');
    const panel=sessionRoot.querySelector('[data-subpage-session-panel]');
    trigger.onclick=()=>{
      const open=panel.hidden;
      closePanel();
      if(open){sessionRoot.classList.add('is-open');trigger.setAttribute('aria-expanded','true');panel.hidden=false}
    };
    sessionRoot.querySelector('[data-subpage-sign-out]').onclick=async()=>{
      await client.auth.signOut();
      location.reload();
    };
  };
  const syncSession=async()=>{
    renderLoggedOut();
    try{
      const client=await getClient();
      const {data:{session}}=await client.auth.getSession();
      if(!session)return;
      let profile=null;
      if(session.user?.app_metadata?.role!=='admin'){
        const result=await client.from('expedient_profiles').select('display_name').eq('id',session.user.id).maybeSingle();
        if(result.error)console.warn('No se pudo recuperar el nombre del destinatario.',result.error);
        profile=result.data;
      }
      renderLoggedIn(client,session.user,profile);
    }catch(error){
      console.warn('No se pudo comprobar la sesión de KIZUNA.',error);
      renderLoggedOut();
    }
  };
  document.addEventListener('click',event=>{if(!sessionRoot.contains(event.target))closePanel()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closePanel()});
  const updateShadow=()=>header.classList.toggle('is-scrolled',window.scrollY>8);
  window.addEventListener('scroll',updateShadow,{passive:true});
  updateShadow();
  void syncSession();
})();
