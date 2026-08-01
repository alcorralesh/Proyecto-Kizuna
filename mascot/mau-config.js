const MAU_CONFIG = Object.freeze({
  enabled: true,
  triggerProgress: 0.3,
  minimumPageAge: 8000,
  maxAwakeAppearances: 2,
  specialGestureChance: 0.5,
  repeatCooldown: 40000,
  scrollSettle: 1400,
  testParameter: 'mau',
  timings: Object.freeze({
    peek: 1700,
    transition: 260,
    message: 7600,
    leave: 1100,
    footerPause: 900,
    sleep: 8200,
    sleepFade: 900,
    interactionHold: 4400,
    blinkMin: 3200,
    blinkMax: 6200,
    blinkFrame: 135,
    reactionFrame: 165,
    waveFrame: 180,
    wakeFrame: 320,
    wakeHold: 620,
    albertoDelayMin: 1600,
    albertoDelayMax: 2800,
    albertoFrame: 420,
    albertoHold: 700
  }),
  dialogue: Object.freeze({
    albertoChance: 0.3,
    residualChance: 0.5,
    contextualChance: 0.7,
    specialGestureMessage: 'Alberto pidió que vigilara especialmente esta visita.',
    general: Object.freeze([
      'Solo estaba comprobando que esta línea temporal siguiera en su sitio.',
      'Todo parece estar donde debería.',
      'No todos los caminos importantes aparecen en el itinerario.',
      'Algunos recuerdos empiezan mucho antes del viaje.',
      'Japón cambia cuando dejas de mirar el mapa.',
      'Sigue adelante. Yo vigilaré desde aquí.'
    ]),
    contextual: Object.freeze({
      inicio: Object.freeze([
        'Todo viaje empieza con una decisión.',
        'Tokio cambia cuando cae la noche.'
      ]),
      nosotros: Object.freeze([
        'Algunos recuerdos empiezan mucho antes del viaje.',
        'Lo importante no siempre aparece en el itinerario.'
      ]),
      japan: Object.freeze([
        'Ocho destinos. Ninguno está ahí por casualidad.',
        'El itinerario parece estable… por ahora.'
      ]),
      sensaciones: Object.freeze([
        'Los recuerdos importantes rara vez avisan.',
        'Hay momentos que empiezan a existir antes de suceder.'
      ]),
      blog: Object.freeze([
        'He revisado estas notas. Casi todas.',
        'Las notas al margen suelen contar la mejor parte.'
      ]),
      eventos: Object.freeze([
        'Hay noches que conviene no perderse.',
        'Algunos encuentros sólo ocurren una vez.'
      ]),
      contacto: Object.freeze([
        'No todos los viajes empiezan con un billete.',
        'A veces basta con decidir que quieres ir.'
      ])
    }),
    residual: Object.freeze([
      'El expediente no empieza donde tú crees.',
      'Algunos archivos recuerdan quién los abrió.',
      'No todas las páginas pertenecen a esta línea temporal.',
      'Hay decisiones que dejan documentos detrás.',
      'La versión oficial nunca contiene toda la historia.',
      'No deberías conocer todavía ese número.',
      'He visto la respuesta que no elegiste.',
      'Ciertos registros sólo aparecen después del cierre.',
      'Una carpeta puede estar vacía y seguir guardando algo.',
      'No todas las líneas temporales terminan archivadas.',
      'Hay un documento que todavía no sabe que existe.',
      'Lo que fue descartado no siempre desaparece.',
      'KIZUNA no archiva aquello que podría volver a ocurrir.',
      'Algunos recuerdos llegaron antes que sus propietarios.',
      'El último documento no siempre es el final.'
    ]),
    alberto: Object.freeze([
      'Alberto dijo que no tocara nada. Técnicamente, yo sólo estoy mirando.',
      'Alberto dejó este itinerario revisado dos veces. Yo lo revisé una tercera.',
      'Hay una nota de Alberto en este archivo. Todavía no deberías verla.',
      'Alberto sabía que acabarías llegando hasta aquí.',
      'No todos estos recuerdos pertenecen a Jose. Algunos empezaron con Alberto.',
      'Alberto insistió en conservar esta versión de los acontecimientos.',
      'Si encuentras una página fuera de lugar, dile a Alberto que yo no fui.',
      'Hay algo que Alberto decidió no incluir en la versión oficial.',
      'Alberto preparó el viaje. KIZUNA se ocupó de que ocurriera.',
      'He visto lo que Alberto guardó bajo “sorpresa”. No pienso contártelo.',
      'Esta línea temporal tiene la firma de Alberto por todas partes.',
      'Alberto confió en que llegarías al final. Yo también.'
    ])
  }),
  albertoFlow: Object.freeze({
    messagePrompt: 'Jose… Alberto ha dejado algo importante para ti. No hay prisa, pero creo que deberías verlo.',
    physicalPrompt: 'Ahora toca salir un momento de la pantalla. Busca el sobre que guardas en tu carpeta.',
    responseReminder: 'Alberto ya ha dicho lo que necesitaba decir. Ahora la decisión es tuya.',
    decision: 'Piénsalo con calma. Esta decisión cerrará el expediente.',
    deferredNotice: 'Está bien. La carta seguirá aquí cuando quieras volver.',
    letterClosed: 'Está bien, Jose. Aún no has respondido. La carta seguirá esperándote cuando quieras volver.',
    farewell: 'Ya está, Jose. Algunas historias terminan… y otras empiezan justo aquí.'
  }),
  mapFlow: Object.freeze([
    'Madrid registrada. El resto del itinerario permanece oculto.',
    'Tokio recuperada. Ahora sí empieza el mapa de Japón.',
    'Nikko localizada. Incluso yo sé que aquí toca caminar en silencio.',
    'Yokohama recuperada. El puerto siempre sabe cuándo llega alguien.',
    'Kamakura localizada. El Gran Buda ya nos había visto venir.',
    'Hakone recuperada. Si aparece el Fuji, Alberto dirá que lo tenía previsto.',
    'Kioto localizada. Alberto insistió en que no llegáramos tarde.',
    'Nara recuperada. Los ciervos ya estaban esperando.',
    'Osaka localizada. He verificado el itinerario y también el takoyaki.',
    'Hiroshima recuperada. Esta parte del mapa se recorre despacio.',
    'Miyajima localizada. La marea confirma el final del recorrido.'
  ]),
  interaction: Object.freeze({
    awake: Object.freeze([
      '¿Sí? Estoy trabajando.',
      'No deberías haberme visto.',
      'Todo parece estable… de momento.',
      'Intento concentrarme.',
      'La medalla no hace nada. Creo.',
      'No toques eso otra vez.',
      'Estoy vigilando el itinerario.',
      'Tú sigue leyendo. Yo me encargo del resto.'
    ]),
    sleeping: Object.freeze([
      '…cinco minutos más.',
      'No estoy dormido. Estoy comprobando otra línea temporal.',
      'Despiértame si aparece otra anomalía.',
      'Zzz… expediente… zzz…'
    ])
  })
});

globalThis.KIZUNA_MAU_CONFIG = MAU_CONFIG;
