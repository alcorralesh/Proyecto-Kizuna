export const apps = [
  {id:'timeline',code:'AR-06-01',title:'Cronología',subtitle:'Ubicaciones',icon:'⌖',integrity:42,color:'#3d6fa7'},
  {id:'routes',code:'AR-06-02',title:'Actividad',subtitle:'Rutas GPS',icon:'⌁',integrity:37,color:'#bb6d22'},
  {id:'gallery',code:'AR-06-03',title:'Galería',subtitle:'Miniaturas',icon:'▧',integrity:38,color:'#8e563b'},
  {id:'whatsapp',code:'AR-06-04',title:'WhatsApp',subtitle:'Conversación',icon:'◔',integrity:74,color:'#178a6b'},
  {id:'search',code:'AR-06-05',title:'Chrome',subtitle:'Búsquedas',icon:'◎',integrity:72,color:'#4373a7'},
  {id:'health',code:'AR-06-06',title:'Salud',subtitle:'Estadísticas',icon:'♥',integrity:68,color:'#6d9c52'},
  {id:'lost',code:'AR-06-07',title:'Mis archivos',subtitle:'Irrecuperables',icon:'⊠',integrity:68,color:'#9b3630'}
];

export const locations = [
  {time:'07:11',place:'Tokyo Station',detail:'Chiyoda, Tokio · Precisión alta',x:77,y:16,type:'pin'},
  {time:'08:12',place:'Akihabara',detail:'Permanencia: 47 min · Precisión alta',x:70,y:27,type:'pin'},
  {time:'09:41',place:'Shinkansen',detail:'Tokio → Kioto · Velocidad media: 239 km/h',x:59,y:42,type:'train'},
  {time:'12:08',place:'Kyoto Station',detail:'Ubicación registrada · Precisión alta',x:46,y:55,type:'pin'},
  {time:'12:32',place:'Kiyomizu-dera',detail:'Permanencia: 1 h 18 min · Precisión media',x:56,y:62,type:'pin'},
  {time:'14:05',place:'████████',detail:'Datos dañados · Error de lectura',x:49,y:70,type:'damage'},
  {time:'16:47',place:'Fushimi Inari Taisha',detail:'Permanencia: 1 h 02 min · Precisión media',x:39,y:78,type:'pin'},
  {time:'18:21',place:'████████',detail:'Trayecto desconocido · Datos incompletos',x:31,y:84,type:'damage'},
  {time:'21:58',place:'Hotel',detail:'Nakagyo, Kioto · Precisión alta',x:24,y:90,type:'pin'},
  {time:'22:15',place:'████████',detail:'Fin del registro visible · Resto no recuperable',x:16,y:94,type:'damage'}
];

export const routes = [
  {name:'Tokio · exploración',place:'TOKIO',routeCode:'RUTA 01',integrity:62,steps:'18.732',distance:'13,4 km',duration:'3 h 21 min',loss:'Se han perdido 2 segmentos de ruta.',color:'#357956',points:'7,67 17,45 28,51 39,37 50,60 61,53 71,66 82,49 94,59',mapPoints:'7,72 17,54 28,58 39,43 50,50 61,38 71,48 82,30 94,36',damageFrom:6},
  {name:'Kioto · templos',place:'KIOTO',routeCode:'RUTA 02',integrity:41,steps:'26.541',distance:'18,7 km',duration:'5 h 02 min',loss:'Pérdida de datos en zona montañosa.',color:'#c76a1d',points:'7,61 18,51 29,67 40,38 51,54 61,44 69,81 79,49 89,42 96,66',mapPoints:'7,68 18,57 29,64 40,38 51,47 61,42 69,73 79,46 89,39 96,61',damageFrom:5},
  {name:'Fushimi Inari',place:'FUSHIMI INARI',routeCode:'RUTA 03',integrity:37,steps:'31.842',distance:'22,6 km',duration:'6 h 18 min',loss:'Gran parte del trayecto fue recuperado parcialmente.',color:'#9f2f28',points:'7,81 18,63 28,29 39,62 49,70 59,45 71,43 82,35 94,27',mapPoints:'7,77 18,60 28,31 39,58 49,68 59,44 71,42 82,33 94,25',damageFrom:4},
  {name:'Nara Park',place:'NARA PARK',routeCode:'RUTA 04',integrity:22,steps:'9.614',distance:'6,8 km',duration:'1 h 45 min',loss:'No se ha podido recuperar el desnivel de esta ruta.',color:'#87413a',points:'7,61 18,66 27,42 39,64 50,70 62,57 74,47 84,66 94,52',mapPoints:'7,62 18,68 27,43 39,63 50,69 62,55 74,46 84,65 94,51',damageFrom:3}
];

export const galleryItems = [
  {name:'IMG_8421.JPG',src:'./assets/gallery/01-tokyo-tower.webp',state:'complete',date:'29/08/2025 · 19:42',location:'Tokio · Minato',detail:'Metadatos y miniatura recuperados.'},
  {name:'IMG_8422.JPG',src:'./assets/gallery/02-miyajima.webp',state:'complete',date:'30/08/2025 · 17:18',location:'Miyajima · Hatsukaichi',detail:'Coordenadas parciales recuperadas.'},
  {name:'IMG_8423.JPG',src:'./assets/gallery/03-kyoto-street.webp',state:'complete',date:'02/09/2025 · 18:31',location:'Kioto · Higashiyama',detail:'Metadatos y miniatura recuperados.'},
  {name:'IMG_8424.JPG',src:'./assets/gallery/04-ramen.webp',state:'complete',date:'05/09/2025 · 21:06',location:'Tokio · Shinjuku',detail:'Ubicación aproximada por caché.'},
  {name:'IMG_8425.JPG',src:'./assets/gallery/05-bamboo.webp',state:'damaged',date:'07/09/2025 · 10:22',location:'Kioto · Arashiyama',detail:'Sectores cromáticos sobrescritos.'},
  {name:'IMG_8426.JPG',src:'./assets/gallery/06-onsen.webp',state:'complete',date:'08/09/2025 · 20:14',location:'Hakone · Kanagawa',detail:'Metadatos y miniatura recuperados.'},
  {name:'IMG_8427.JPG',src:'./assets/gallery/07-osaka-night.webp',state:'complete',date:'12/09/2025 · 22:09',location:'Osaka · Dotonbori',detail:'Coordenadas parciales recuperadas.'},
  {name:'IMG_8428.JPG',src:'./assets/gallery/08-sushi.webp',state:'damaged',date:'13/09/2025 · 13:47',location:'Osaka · Chuo',detail:'Tres bloques de imagen no recuperables.'},
  {name:'IMG_8429.JPG',src:'./assets/gallery/09-himeji.webp',state:'complete',date:'15/09/2025 · 11:34',location:'Himeji · Hyogo',detail:'Metadatos y miniatura recuperados.'},
  {name:'IMG_8430.JPG',src:'',state:'lost',date:'16/09/2025 · 08:17',location:'Ubicación desconocida',detail:'Entrada conservada; contenido ilegible.'},
  {name:'IMG_8431.JPG',src:'./assets/gallery/10-kinkakuji.webp',state:'complete',date:'17/09/2025 · 16:02',location:'Kioto · Kita',detail:'Metadatos y miniatura recuperados.'},
  {name:'IMG_8432.JPG',src:'./assets/gallery/11-kyoto-rain.webp',state:'damaged',date:'18/09/2025 · 19:26',location:'Kioto · Gion',detail:'Cabecera incompleta y ruido digital.'},
  {name:'IMG_8433.JPG',src:'./assets/gallery/12-fushimi-inari.webp',state:'complete',date:'19/09/2025 · 07:09',location:'Kioto · Fushimi',detail:'Coordenadas parciales recuperadas.'},
  {name:'IMG_8434.JPG',src:'',state:'lost',date:'20/09/2025 · 16:44',location:'Ubicación desconocida',detail:'Archivo original no localizado.'},
  {name:'IMG_8435.JPG',src:'',state:'lost',date:'22/09/2025 · 19:59',location:'Ubicación desconocida',detail:'Sectores ilegibles en memoria.'},
  {name:'IMG_8436.JPG',src:'',state:'lost',date:'23/09/2025 · 21:47',location:'Ubicación desconocida',detail:'Índice dañado; miniatura no recuperable.'}
];

export const searches = [
  ['29/08 · 20:15','mejores destinos en Japón'],['29/08 · 20:17','viaje a Japón consejos'],
  ['30/08 · 11:03','mejor época para ir a Japón'],['30/08 · 11:05','clima Japón septiembre'],
  ['02/09 · 21:27','maletas 23kg cabina'],['02/09 · 21:28','qué llevar en la maleta a Japón'],
  ['02/09 · 21:31','adaptador enchufe Japón'],['02/09 · 21:33','tarjetas eSIM Japón'],
  ['02/09 · 21:35','suica card o pasmo'],['02/09 · 21:36','jr pass merece la pena'],
  ['03/09 · 10:12','moverse en bicicleta en Japón'],['03/09 · 10:18','rutas en bicicleta Kioto'],
  ['03/09 · 10:24','mapas ciclistas Japón'],['03/09 · 10:30','cuántos km se puede hacer en bici al día'],
  ['05/09 · 19:44','ramen Tokio mejores'],['05/09 · 19:47','ramen Kioto'],
  ['05/09 · 19:49','tipos de ramen Japón'],['05/09 · 19:53','cerveza japonesa marcas'],
  ['05/09 · 20:03','onsen tatuajes permitido'],['05/09 · 20:06','ryokan con onsen privado'],
  ['07/09 · 17:22','templos imprescindibles Japón'],['07/09 · 17:24','Fushimi Inari horario'],
  ['07/09 · 17:29','templo Senso-ji'],['07/09 · 17:30','Nara qué ver'],
  ['07/09 · 17:31','ciervos Nara'],['07/09 · 17:32','Hiroshima qué ver'],
  ['07/09 · 17:33','Miyajima torii flotante'],['07/09 · 17:34','castillo de Osaka'],
  ['07/09 · 17:36','monte Fuji desde Tokio'],['07/09 · 17:37','Hakone onsen'],
  ['09/09 · 22:11','hotel cápsula Tokio opiniones'],['09/09 · 22:15','ryokan Hakone'],
  ['12/09 · 18:40','pocket wifi Japón opiniones'],['12/09 · 18:44','mejores tarjetas sin comisiones'],
  ['14/09 · 21:02','festivales en Japón septiembre'],['14/09 · 21:04','fuegos artificiales Japón']
];

export const lostFiles = [
  ['IRR-001','IMG_20250903_1742.jpg','Imagen','WhatsApp','2,1 MB','Sectores dañados'],
  ['IRR-002','VID_20250907_1128.mp4','Vídeo','WhatsApp','28,4 MB','Corrupción de datos'],
  ['IRR-003','AUD_20250907_1130.m4a','Audio','WhatsApp','312 KB','Archivo fragmentado'],
  ['IRR-004','IMG_20250908_0933.jpg','Imagen','Galería','1,7 MB','Sobrescritura parcial'],
  ['IRR-005','VID_20250912_1843.mp4','Vídeo','WhatsApp','16,8 MB','Índice dañado'],
  ['IRR-006','IMG_20250914_2030.jpg','Imagen','WhatsApp','2,3 MB','Sectores ilegibles'],
  ['IRR-007','Itinerario_completo.pdf','Documento','WhatsApp','1,2 MB','Archivo corrupto'],
  ['IRR-008','IMG_20250915_2218.jpg','Imagen','WhatsApp','1,9 MB','Sobrescritura parcial'],
  ['IRR-009','AUD_20250916_0807.m4a','Audio','WhatsApp','245 KB','Cabecera dañada'],
  ['IRR-010','VID_20250918_1312.mp4','Vídeo','Galería','34,2 MB','Corrupción de datos'],
  ['IRR-011','IMG_20250920_1644.jpg','Imagen','WhatsApp','1,6 MB','Sectores ilegibles'],
  ['IRR-012','Reservas_hoteles.pdf','Documento','WhatsApp','890 KB','Archivo corrupto'],
  ['IRR-013','AUD_20250921_1015.m4a','Audio','WhatsApp','198 KB','Archivo fragmentado'],
  ['IRR-014','IMG_20250922_1959.jpg','Imagen','Galería','2,0 MB','Sobrescritura parcial'],
  ['IRR-015','VID_20250923_2147.mp4','Vídeo','WhatsApp','21,6 MB','Índice dañado']
];
