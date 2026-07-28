export const itinerary={
  duration:22000,
  stops:{
    madrid:{
      name:'Madrid',
      japanese:'MAD · ESPAÑA',
      sequence:'ORIGEN DE LA EXPEDICIÓN',
      stage:'Salida internacional',
      transport:'Avión',
      copy:'La expedición comienza en Madrid. Desde aquí se abre el corredor internacional que conecta el punto de origen con el Archivo Central de Tokio.'
    },
    tokio:{
      name:'Tokio',
      japanese:'東京 · TOKYO',
      sequence:'DESTINO 01 · PRIMERA ESCALA',
      stage:'Llegada a Japón',
      transport:'Avión · Tren urbano',
      copy:'Tokio es la puerta de entrada: una ciudad de contrastes, santuarios silenciosos, cruces que no se detienen y noches que parecen no terminar.',
      guide:'../guides/tokio/index.html'
    },
    kioto:{
      name:'Kioto',
      japanese:'京都 · KYOTO',
      sequence:'DESTINO 02 · TRADICIÓN',
      stage:'Segunda etapa',
      transport:'Shinkansen',
      copy:'El recorrido continúa hacia Kioto. Templos, callejones de madera y una forma de entender el tiempo que invita a caminar sin prisa.',
      guide:'../guides/kioto/index.html'
    }
  },
  phases:{
    flight:{start:0,end:.43,label:'TRAYECTO INTERNACIONAL',route:'MADRID → TOKIO'},
    transition:{start:.43,end:.55,label:'APROXIMACIÓN A JAPÓN',route:'ARCHIVO CARTOGRÁFICO · TOKIO'},
    train:{start:.55,end:1,label:'CORREDOR TŌKAIDŌ',route:'TOKIO → KIOTO · SHINKANSEN'}
  }
};
