(()=>{
  const bucket='kizuna-assets';
  const publicBase='https://vcwqkideizdrhzpbghkj.supabase.co/storage/v1/object/public/'+bucket;
  const encodePath=path=>String(path).replace(/\\/g,'/').replace(/^.*?assets\//,'').replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
  const assetUrl=path=>`${publicBase}/${encodePath(path)}`;

  const moveImageToStorage=img=>{
    const source=img.getAttribute('src');
    if(!source||source.startsWith(publicBase)||img.dataset.storageFallback==='true')return;
    const match=source.replace(/\\/g,'/').match(/(?:^|\/)assets\/(.+)$/);
    if(!match)return;
    img.dataset.localAsset=source;
    img.addEventListener('error',()=>{
      if(img.dataset.storageFallback==='true')return;
      img.dataset.storageFallback='true';
      img.src=img.dataset.localAsset;
    },{once:true});
    img.src=assetUrl(match[1]);
  };

  const scan=root=>{
    if(root.nodeType===1&&root.matches?.('img[src]'))moveImageToStorage(root);
    root.querySelectorAll?.('img[src]').forEach(moveImageToStorage);
  };

  const start=()=>{
    scan(document);
    new MutationObserver(changes=>changes.forEach(change=>{
      if(change.type==='attributes')moveImageToStorage(change.target);
      change.addedNodes.forEach(scan);
    })).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
    const hero=document.querySelector('.hero-image');
    if(hero){
      const preview=new Image();
      preview.onload=()=>hero.style.backgroundImage=`linear-gradient(90deg,rgba(14,28,30,.68) 0%,rgba(14,28,30,.32) 42%,rgba(14,28,30,.05)),url('${assetUrl('kyoto-hero.png')}')`;
      preview.src=assetUrl('kyoto-hero.png');
    }
  };

  window.kizunaAssetUrl=assetUrl;
  window.kizunaStorage={bucket,publicBase,assetUrl,scan};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
