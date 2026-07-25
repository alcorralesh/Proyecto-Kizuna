/* KIZUNA PWA · caché segura de interfaz pública.
   Nunca almacena progreso, respuestas autenticadas ni archivos del expediente. */
'use strict';

const VERSION='20260725-mobile-next-card01';
const STATIC_CACHE=`kizuna-static-${VERSION}`;
const PAGE_CACHE=`kizuna-pages-${VERSION}`;
const KIZUNA_CACHE_PREFIXES=['kizuna-static-','kizuna-pages-'];
const CORE_ASSETS=[
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './pwa.js',
  './pwa.css',
  './styles.css',
  './recipient-messages.css',
  './recipient-messages.js',
  './script.js',
  './assets/kizuna-logo-official.png',
  './assets/kizuna-app-icon-192.png',
  './assets/kizuna-app-icon-512.png',
  './assets/kizuna-app-icon-maskable-512.png'
];
const PRIVATE_PATHS=[
  'expediente/',
  'assets/documents/',
  'assets/audio/'
];
const SERVER_PATH_MARKERS=[
  '/rest/v1/',
  '/auth/v1/',
  '/functions/v1/',
  '/storage/v1/',
  '/realtime/v1/'
];

const scopeUrl=()=>new URL(self.registration.scope);
const relativePath=url=>{
  const scope=scopeUrl();
  return decodeURIComponent(url.pathname.slice(scope.pathname.length)).replace(/^\/+/,'');
};
const isPrivatePath=path=>PRIVATE_PATHS.some(prefix=>path===prefix.slice(0,-1)||path.startsWith(prefix));
const isServerRequest=url=>SERVER_PATH_MARKERS.some(marker=>url.pathname.includes(marker));
const hasCredentials=request=>request.headers.has('authorization')||request.headers.has('apikey');
const isCacheableResponse=response=>
  response &&
  response.ok &&
  response.type==='basic' &&
  !/no-store/i.test(response.headers.get('cache-control')||'');
const offlineResponse=async()=>(
  await caches.match(new URL('./offline.html',scopeUrl()).href)
)||new Response('KIZUNA necesita conexión para continuar.',{
  status:503,
  headers:{'Content-Type':'text/plain; charset=utf-8'}
});

const fetchAndCache=async(request,cacheName)=>{
  const response=await fetch(request);
  if(isCacheableResponse(response)){
    const cache=await caches.open(cacheName);
    await cache.put(request,response.clone());
  }
  return response;
};

const networkFirst=async(request)=>{
  try{return await fetchAndCache(request,PAGE_CACHE)}
  catch(_error){return (await caches.match(request))||offlineResponse()}
};

const staleWhileRevalidate=async(request,event)=>{
  const cached=await caches.match(request);
  const refresh=fetchAndCache(request,STATIC_CACHE).catch(()=>null);
  if(cached){event.waitUntil(refresh);return cached}
  return (await refresh)||offlineResponse();
};

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(STATIC_CACHE);
    for(const asset of CORE_ASSETS){
      const url=new URL(asset,scopeUrl()).href;
      try{
        const response=await fetch(new Request(url,{cache:'reload'}));
        if(isCacheableResponse(response))await cache.put(url,response);
      }catch(error){
        console.warn(`No se pudo preparar ${asset} para uso sin conexión.`,error);
      }
    }
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.map(name=>{
      const belongsToKizuna=KIZUNA_CACHE_PREFIXES.some(prefix=>name.startsWith(prefix));
      return belongsToKizuna&&name!==STATIC_CACHE&&name!==PAGE_CACHE
        ?caches.delete(name)
        :Promise.resolve(false);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin||isServerRequest(url)||hasCredentials(request))return;

  const path=relativePath(url);
  if(isPrivatePath(path)){
    if(request.mode==='navigate'){
      event.respondWith(fetch(request).catch(offlineResponse));
    }
    return;
  }

  if(request.mode==='navigate'){
    event.respondWith(networkFirst(request));
    return;
  }

  if(['style','script','image','font'].includes(request.destination)){
    event.respondWith(staleWhileRevalidate(request,event));
  }
});

