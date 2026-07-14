(()=>{
  const fallbackArticles=[
    {id:'shinkansen',category:'GUÍA',title:'Cómo viajar en Shinkansen',excerpt:'Todo lo que necesitas saber antes de subir al tren más puntual del mundo.',content:'Viajar en Shinkansen es una de las formas más cómodas de recorrer Japón. Conviene reservar los trayectos principales con antelación, llegar al andén unos minutos antes y comprobar el número de vagón indicado en el billete.\n\nEl equipaje pequeño puede colocarse sobre el asiento. Para maletas de gran tamaño, algunos trenes requieren reservar un espacio específico. Durante el trayecto se agradece hablar en voz baja y evitar llamadas telefónicas en el vagón.\n\nNo olvides mirar por la ventanilla: en los días despejados, el trayecto entre Tokio y Kioto ofrece una vista inolvidable del monte Fuji.'},
    {id:'etiqueta',category:'CULTURA',title:'La etiqueta en Japón, sin complicaciones',excerpt:'Pequeños gestos que abren puertas y muestran respeto.',content:'La cortesía japonesa se apoya en gestos sencillos. Saludar con una ligera inclinación, respetar las filas y mantener un tono de voz moderado son buenas formas de empezar.\n\nEn casas, alojamientos tradicionales y algunos restaurantes tendrás que quitarte los zapatos. Observa siempre lo que hacen quienes te reciben y utiliza las zapatillas que te ofrezcan.\n\nNo hace falta conocer todas las normas. Mostrar atención, agradecer y actuar con calma transmite el respeto necesario en casi cualquier situación.'},
    {id:'sabores',category:'SABORES',title:'Qué comer en Japón: una primera ruta',excerpt:'De un ramen nocturno a un desayuno inolvidable en el mercado.',content:'Una primera ruta gastronómica puede comenzar con un desayuno en un mercado local: pescado a la parrilla, arroz, sopa de miso y encurtidos. Al mediodía, un bol de donburi o una bandeja de sushi permiten probar distintos sabores sin detener el viaje.\n\nPor la noche llega el momento del ramen, el yakitori o una pequeña izakaya. Las especialidades cambian en cada región, así que merece la pena preguntar por el plato de la casa.\n\nDeja también espacio para lo inesperado: una pastelería de barrio, un puesto junto a un templo o una bebida encontrada en una máquina pueden convertirse en el recuerdo más vivo del día.'}
  ];
  const root=document.querySelector('[data-blog-mode]');
  if(!root)return;
  const list=root.querySelector('[data-blog-list]');
  const mode=root.dataset.blogMode;
  const supabaseUrl='https://vcwqkideizdrhzpbghkj.supabase.co';
  const supabaseKey='sb_publishable_h3pjxT8UPZkYqRhLskVdlA_m-ulI4EF';
  let client=null;
  const getClient=async()=>{
    if(window.getKizunaPublicSupabase)return window.getKizunaPublicSupabase();
    if(client)return client;
    if(!window.supabase)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';script.onload=resolve;script.onerror=reject;document.head.appendChild(script)});
    client=window.supabase.createClient(supabaseUrl,supabaseKey);
    return client;
  };
  window.getKizunaBlogSupabase=getClient;
  const popup=document.createElement('dialog');
  popup.className='blog-reader';
  popup.innerHTML='<article><button type="button" class="blog-reader-close" aria-label="Cerrar artículo">×</button><p class="blog-reader-category"></p><h2></h2><div class="blog-reader-content"></div></article>';
  document.body.appendChild(popup);
  popup.querySelector('.blog-reader-close').onclick=()=>popup.close();
  popup.addEventListener('click',event=>{if(event.target===popup)popup.close()});
  const openArticle=article=>{
    popup.querySelector('.blog-reader-category').textContent=article.category;
    popup.querySelector('h2').textContent=article.title;
    const content=popup.querySelector('.blog-reader-content');
    content.replaceChildren(...String(article.content||article.excerpt).split(/\n\s*\n/).map(text=>{const p=document.createElement('p');p.textContent=text;return p}));
    popup.showModal();
  };
  const createCard=article=>{
    const card=document.createElement('article');
    const category=document.createElement('span');category.textContent=article.category;
    const title=document.createElement('h3');title.textContent=article.title;
    const excerpt=document.createElement('p');excerpt.textContent=article.excerpt;
    const button=document.createElement('button');button.type='button';button.className='journal-read';button.innerHTML='Leer <b>→</b>';button.onclick=()=>openArticle(article);
    card.append(category,title,excerpt,button);return card;
  };
  const render=articles=>{
    const visible=mode==='home'?articles.slice(0,3):articles;
    list.replaceChildren(...visible.map(createCard));
    if(!visible.length){const empty=document.createElement('p');empty.className='blog-empty';empty.textContent='Todavía no hay artículos publicados.';list.appendChild(empty)}
  };
  const load=async()=>{
    render(fallbackArticles);
    try{
      const supabase=await getClient();
      const {data,error}=await supabase.from('blog_articles').select('id,category,title,excerpt,content,published_at,sort_order').eq('is_published',true).order('sort_order',{ascending:true}).order('published_at',{ascending:false});
      if(error)throw error;
      render(data||[]);
    }catch(error){console.warn('El blog usa los artículos locales hasta configurar Supabase.',error)}
  };
  load();
})();
