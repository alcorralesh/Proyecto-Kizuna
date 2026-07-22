(()=>{
  const bucket='kizuna-assets';
  const publicBase='https://vcwqkideizdrhzpbghkj.supabase.co/storage/v1/object/public/'+bucket;
  const manifestPath='_meta/asset-versions.json';
  const versions={};
  let manifestReady=null;

  const normalizePath=path=>String(path||'').replace(/\\/g,'/').replace(/^.*?assets\//,'').replace(/^\/+/, '');
  const encodePath=path=>normalizePath(path).split('/').map(encodeURIComponent).join('/');
  const variantPath=(path,variant)=>{
    const clean=normalizePath(path),dot=clean.lastIndexOf('.'),base=dot>clean.lastIndexOf('/')?clean.slice(0,dot):clean;
    return `_optimized/${variant}/${base}.webp`;
  };
  const entryFor=path=>versions[normalizePath(path)]||null;
  const assetUrl=(path,variant='original')=>{
    const clean=normalizePath(path),entry=entryFor(clean);
    const storedPath=variant!=='original'&&entry?.[variant]?entry[variant]:clean;
    const version=entry?.version?`?v=${encodeURIComponent(entry.version)}`:'';
    return `${publicBase}/${encodePath(storedPath)}${version}`;
  };

  const loadManifest=()=>manifestReady||(manifestReady=fetch(`${publicBase}/${encodePath(manifestPath)}?t=${Date.now()}`,{cache:'no-store'})
    .then(response=>response.ok?response.json():{})
    .then(data=>Object.assign(versions,data?.assets||data||{}))
    .catch(()=>versions));

  const preferredVariant=img=>img.dataset.storageVariant||(
    img.closest('.ticket-card,.visual-archive-card,.admin-media-grid')?'thumb':
    'reader'
  );

  const moveImageToStorage=img=>{
    const source=img.getAttribute('src');
    if(!source||source.startsWith(publicBase)||img.dataset.storageManaged==='true')return;
    const match=source.replace(/\\/g,'/').match(/(?:^|\/)assets\/(.+)$/);
    if(!match)return;
    const path=normalizePath(match[1]),entry=entryFor(path);

    // Until an optimized/versioned copy exists, GitHub Pages serves the local
    // asset. This prevents the old multi-megabyte originals consuming Storage.
    if(!entry)return;

    const variant=preferredVariant(img);
    img.dataset.storageManaged='true';
    img.dataset.localAsset=source;
    img.decoding='async';
    if(variant==='thumb'){
      img.loading='lazy';
      img.fetchPriority='low';
    }

    const originalUrl=assetUrl(path,'original');
    let triedOriginal=variant==='original';
    img.addEventListener('error',()=>{
      if(!triedOriginal){
        triedOriginal=true;
        img.src=originalUrl;
        return;
      }
      if(img.dataset.storageFallback!=='true'){
        img.dataset.storageFallback='true';
        img.src=img.dataset.localAsset;
      }
    });
    img.src=assetUrl(path,variant);
  };

  const scan=root=>{
    if(root.nodeType===1&&root.matches?.('img[src]'))moveImageToStorage(root);
    root.querySelectorAll?.('img[src]').forEach(moveImageToStorage);
  };

  const start=async()=>{
    await loadManifest();
    scan(document);
    new MutationObserver(changes=>changes.forEach(change=>{
      if(change.type==='attributes')moveImageToStorage(change.target);
      change.addedNodes.forEach(scan);
    })).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});

    const hero=document.querySelector('.hero-image');
    if(hero&&entryFor('kyoto-hero.png')){
      const preview=new Image();
      preview.onload=()=>hero.style.backgroundImage=`linear-gradient(90deg,rgba(14,28,30,.68) 0%,rgba(14,28,30,.32) 42%,rgba(14,28,30,.05)),url('${assetUrl('kyoto-hero.png','reader')}')`;
      preview.src=assetUrl('kyoto-hero.png','reader');
    }
  };

  const refreshManifest=async()=>{
    manifestReady=null;
    Object.keys(versions).forEach(key=>delete versions[key]);
    await loadManifest();
    scan(document);
    return versions;
  };

  window.kizunaAssetUrl=assetUrl;
  window.kizunaStorage={bucket,publicBase,assetUrl,variantPath,entryFor,loadManifest,refreshManifest,scan};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
