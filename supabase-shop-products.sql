-- Catálogo ampliado para una instalación existente de la tienda KIZUNA.
-- Ejecuta este archivo en Supabase > SQL Editor.

insert into public.shop_products
  (name, category, description, price, stock, image_url, badge, sort_order)
values
  ('Museo Nacional de Tokio','museos','Entrada simulada para recorrer las colecciones de arte y patrimonio japonés de Ueno.',6.50,70,'../assets/guides/tokio.png','UENO',80),
  ('Museo Edo-Tokyo al Aire Libre','museos','Acceso ficticio a edificios históricos que reconstruyen la vida cotidiana del antiguo Tokio.',5.00,45,'../assets/documents/AR-03/Ciudades/01-Tokyo.png','ARQUITECTURA',90),
  ('Museo del Ferrocarril · Saitama','museos','Entrada simulada para descubrir la historia ferroviaria de Japón y sus primeros Shinkansen.',8.00,55,'../assets/sensations/shinkansen.png','FERROCARRIL',100),
  ('Museo de Arte Adachi','museos','Visita simulada a su colección de pintura japonesa y a uno de los jardines más reconocidos del país.',14.00,28,'../assets/sensations/tea.png','JARDÍN JAPONÉS',110),
  ('Fushimi Inari Taisha · Kioto','templos','Pase cultural ficticio con guía digital para recorrer los senderos de torii de Inari.',3.50,100,'../assets/documents/AR-03/Templos/001-Fushimi Inari.png','SENDA DE TORII',120),
  ('Kinkaku-ji · Pabellón Dorado','templos','Entrada simulada al templo dorado y sus jardines históricos en Kioto.',4.50,85,'../assets/documents/AR-03/Templos/003-Kinkaku ji.png','KIOTO',130),
  ('Sensō-ji · Asakusa','templos','Visita cultural ficticia con guía de audio por el templo más antiguo de Tokio.',3.00,110,'../assets/documents/AR-03/Templos/006-Senso ji.png','ASAKUSA',140),
  ('Tōdai-ji · Nara','templos','Acceso simulado al Gran Buda, el salón Daibutsuden y el entorno histórico de Nara.',5.00,75,'../assets/documents/AR-03/Templos/004-Todai ji.png','GRAN BUDA',150),
  ('Tokyo DisneySea','parques','Pase ficticio de un día para explorar los puertos y atracciones de Tokyo DisneySea.',58.00,22,'../assets/documents/AR-03/Ciudades/01-Tokyo.png','1 DÍA',160),
  ('Fuji-Q Highland','parques','Entrada simulada al parque de atracciones situado junto al monte Fuji.',43.00,30,'../assets/guides/hakone.png','VISTAS AL FUJI',170),
  ('Sanrio Puroland','parques','Acceso ficticio de un día al parque cubierto de Sanrio en Tama.',32.00,35,'../assets/sensations/memory.png','PARQUE CUBIERTO',180),
  ('Hakone Freepass · 2 días','transporte','Bono simulado para trenes, autobuses, teleférico y barco en la región de Hakone.',36.00,65,'../assets/documents/AR-01/Billetes/BilleteHakone.png','2 DÍAS',190),
  ('Kansai Railway Pass · 3 días','transporte','Pase ficticio para desplazamientos seleccionados por Osaka, Kioto, Nara y Kobe.',42.00,60,'../assets/documents/AR-01/Billetes/BilleteOsaka.png','3 DÍAS',200),
  ('Tarjeta Suica KIZUNA','transporte','Tarjeta de transporte simulada con saldo ficticio inicial para moverse por Tokio.',15.00,95,'../assets/documents/AR-01/Billetes/BilleteOdaiba.png','SALDO INICIAL',210),
  ('Pin esmaltado KIZUNA','merchandising','Insignia metálica con el torii y el sello rojo de KIZUNA Travel Bureau.',9.00,75,'../assets/kizuna-logo-official.png','SERIE 01',220),
  ('Bolsa de viaje KIZUNA','merchandising','Bolsa de algodón color marfil con la identidad de la División de Archivos Temporales.',16.00,45,'../assets/kizuna-logo-official.png','ALGODÓN',230),
  ('Taza Archivo Central','merchandising','Taza de cerámica con sello de archivo recuperado y numeración de expediente.',13.50,38,'../assets/kizuna-logo-official.png','ARCHIVO CENTRAL',240),
  ('Lámina Project Japan','merchandising','Lámina decorativa ficticia inspirada en el recorrido de Project Japan.',12.00,50,'../assets/kyoto-hero.png','A3',250)
on conflict (name) do update set
  category = excluded.category,
  description = excluded.description,
  price = excluded.price,
  stock = excluded.stock,
  image_url = excluded.image_url,
  badge = excluded.badge,
  sort_order = excluded.sort_order;
