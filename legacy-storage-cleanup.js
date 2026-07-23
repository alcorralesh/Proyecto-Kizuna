// Migración de versiones anteriores: elimina únicamente datos que la
// aplicación guardaba antes de trasladar el progreso a Supabase.
(()=>{
  const obsoleteKeys=[
    'kizuna-read',
    'kizuna-mail-read',
    'kizuna-final-file-seen',
    'kizuna-final-alert-shown',
    'kizuna-complete',
    'kizuna-final-flow-stage',
    'kizuna-alberto-message-read',
    'kizuna-alberto-response-accepted',
    'kizuna-alberto-response',
    'kizuna-alberto-responded-at',
    'kizuna-acceptance-email-sent-at',
    'kizuna-acceptance-email-id',
    'kizuna-comic-read-pages',
    'kizuna-legal-accepted',
    'kizuna-legal-accepted-at',
    'kizuna-legal-version',
    'kizuna-loading-seen',
    'kizuna-onboarding-completed',
    'kizuna-onboarding-completed-at',
    'kizuna-onboarding-version',
    'kizuna-seen-unlocks',
    'kizuna-sound-preferences-v1',
    'kizuna-demo-cart'
  ];
  try{
    obsoleteKeys.forEach(key=>window.localStorage.removeItem(key));
  }catch(error){
    console.warn('No se pudieron eliminar los datos locales obsoletos de KIZUNA.',error);
  }
})();
