(()=>{
  const root=document.querySelector('[data-events-list]');
  if(!root)return;
  const fallbackEvents=[
    {id:'fallback-hanabi',title:'Festival de fuegos artificiales de Sumida',description:'Una noche junto al río para contemplar uno de los hanabi más emblemáticos de Tokio.',location:'Parque Sumida · Tokio',starts_at:'2026-09-12T19:00:00+09:00',capacity:40,registered_count:8},
    {id:'fallback-te',title:'Ceremonia de té al amanecer',description:'Una introducción íntima al chanoyu en un jardín tradicional de Kioto.',location:'Distrito de Higashiyama · Kioto',starts_at:'2026-09-26T08:30:00+09:00',capacity:12,registered_count:3},
    {id:'fallback-momiji',title:'Ruta de otoño entre templos',description:'Paseo guiado para descubrir los primeros colores del momiji y su historia.',location:'Arashiyama · Kioto',starts_at:'2026-10-17T09:00:00+09:00',capacity:24,registered_count:5}
  ];
  let events=fallbackEvents;
  const getClient=async()=>{
    if(window.getKizunaBlogSupabase)return window.getKizunaBlogSupabase();
    if(!window.supabase)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';script.onload=resolve;script.onerror=reject;document.head.appendChild(script)});
    return window.supabase.createClient('https://vcwqkideizdrhzpbghkj.supabase.co','sb_publishable_h3pjxT8UPZkYqRhLskVdlA_m-ulI4EF');
  };
  const dateParts=value=>{
    const date=new Date(value);
    return {day:new Intl.DateTimeFormat('es-ES',{day:'2-digit',timeZone:'Asia/Tokyo'}).format(date),month:new Intl.DateTimeFormat('es-ES',{month:'short',timeZone:'Asia/Tokyo'}).format(date).replace('.','').toUpperCase(),full:new Intl.DateTimeFormat('es-ES',{dateStyle:'long',timeStyle:'short',timeZone:'Asia/Tokyo'}).format(date)};
  };
  const escapeIcs=value=>String(value).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const icsDate=date=>new Date(date).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const addToCalendar=event=>{
    const start=new Date(event.starts_at),end=new Date(start.getTime()+2*60*60*1000);
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//KIZUNA Travel Bureau//Eventos//ES','BEGIN:VEVENT',`UID:${event.id}@kizunatravelbureau.com`,`DTSTAMP:${icsDate(new Date())}`,`DTSTART:${icsDate(start)}`,`DTEND:${icsDate(end)}`,`SUMMARY:${escapeIcs(event.title)}`,`DESCRIPTION:${escapeIcs(event.description)}`,`LOCATION:${escapeIcs(event.location)}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));link.download=`kizuna-${String(event.title).toLowerCase().replace(/[^a-z0-9]+/g,'-')}.ics`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  };
  const dialog=document.createElement('dialog');
  dialog.className='event-signup';
  dialog.innerHTML='<article><button type="button" class="event-signup-close" aria-label="Cerrar inscripción">×</button><p class="event-signup-label">INSCRIPCIÓN</p><h2></h2><p class="event-signup-help">Solo necesitamos tres datos. No tendrás que crear una cuenta.</p><form><div><label>Nombre<input name="firstName" required maxlength="80" autocomplete="given-name"></label><label>Apellidos<input name="lastName" required maxlength="120" autocomplete="family-name"></label></div><label>Fecha de nacimiento<input name="birthDate" type="date" required autocomplete="bday"></label><label class="event-consent"><input name="consent" type="checkbox" required> Acepto el uso de estos datos únicamente para gestionar mi participación en el evento.</label><button type="submit">Confirmar inscripción</button><p class="event-signup-status" role="status"></p></form></article>';
  document.body.appendChild(dialog);
  dialog.querySelector('.event-signup-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  let selectedEvent=null;
  const openSignup=event=>{selectedEvent=event;dialog.querySelector('h2').textContent=event.title;dialog.querySelector('form').reset();dialog.querySelector('.event-signup-status').textContent='';dialog.showModal()};
  dialog.querySelector('form').onsubmit=async submitEvent=>{
    submitEvent.preventDefault();
    const form=submitEvent.currentTarget,button=form.querySelector('button[type="submit"]'),status=form.querySelector('.event-signup-status'),values=Object.fromEntries(new FormData(form));
    status.textContent='Confirmando tu plaza…';button.disabled=true;
    try{
      const supabase=await getClient();
      const {error}=await supabase.rpc('register_for_event',{p_event_id:selectedEvent.id,p_first_name:values.firstName.trim(),p_last_name:values.lastName.trim(),p_birth_date:values.birthDate});
      if(error)throw error;
      status.textContent='Inscripción confirmada. Tu plaza está reservada.';setTimeout(()=>{dialog.close();loadEvents()},1500);
    }catch(error){console.error(error);status.textContent=error.message?.includes('No quedan plazas')?'No quedan plazas disponibles para este evento.':'No se ha podido completar la inscripción. Inténtalo de nuevo.'}
    finally{button.disabled=false}
  };
  const createCard=event=>{
    const date=dateParts(event.starts_at),available=Math.max(0,event.capacity-event.registered_count);
    const card=document.createElement('article');card.className='public-event-card';
    const time=document.createElement('time');time.dateTime=event.starts_at;
    const day=document.createElement('strong');day.textContent=date.day;
    const month=document.createElement('span');month.textContent=date.month;time.append(day,month);
    const copy=document.createElement('div');copy.className='public-event-copy';
    const title=document.createElement('h3');title.textContent=event.title;
    const description=document.createElement('p');description.textContent=event.description;
    const places=document.createElement('strong');places.textContent=`${available} plaza${available===1?'':'s'} disponible${available===1?'':'s'} de ${event.capacity}`;copy.append(title,description,places);
    const place=document.createElement('p');place.className='public-event-place';place.append(`⌖ ${event.location}`,document.createElement('br'));
    const fullDate=document.createElement('span');fullDate.textContent=`${date.full} · hora de Japón`;place.appendChild(fullDate);
    const calendar=document.createElement('button');calendar.type='button';calendar.className='event-calendar';calendar.textContent='+ Añadir al calendario';calendar.onclick=()=>addToCalendar(event);
    const signup=document.createElement('button');signup.type='button';signup.className='event-register';signup.textContent=available?'Quiero apuntarme →':'Aforo completo';signup.disabled=!available;signup.onclick=()=>openSignup(event);
    const actions=document.createElement('div');actions.className='public-event-actions';actions.append(calendar,signup);card.append(time,copy,place,actions);return card;
  };
  const render=items=>{events=items;root.replaceChildren(...items.map(createCard));if(!items.length){const empty=document.createElement('p');empty.className='events-empty';empty.textContent='No hay próximos eventos publicados.';root.appendChild(empty)}};
  const loadEvents=async()=>{
    render(fallbackEvents);
    try{
      const supabase=await getClient();
      const {data,error}=await supabase.from('events').select('id,title,description,location,starts_at,capacity,registered_count,sort_order').eq('is_published',true).gte('starts_at',new Date().toISOString()).order('sort_order',{ascending:true}).order('starts_at',{ascending:true});
      if(error)throw error;render(data||[]);
    }catch(error){console.warn('Los eventos usan datos locales hasta configurar Supabase.',error)}
  };
  loadEvents();
})();
