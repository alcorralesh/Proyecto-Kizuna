# Mau

Recursos aislados de la mascota de la web pública de KIZUNA.

## Identidad visual

- Gato de inspiración bobtail japonés.
- Estética anime contemporánea y adulta.
- Pelaje carbón con marcas atigradas marrones y zonas crema.
- Ojos ámbar.
- Pañuelo burdeos.
- Medalla de latón con un torii.

La referencia aprobada se conserva en `design/mau-concept-anime-v2.png`.

## Recursos

Los PNG de `assets/sprites/` son los maestros transparentes. Los WebP son
las versiones optimizadas que cargará la web.

- `mau-peek`: Mau se asoma desde el borde de la página.
- `mau-guide`: pose principal para mostrar un mensaje.
- `mau-leave`: salida de la escena.
- `mau-sleep`: apariciones nocturnas.

## Integración

La mascota se monta como el componente independiente `<kizuna-mau>`:

- `mau.js`: componente, secuencia y activación.
- `mau.css`: estilos encapsulados dentro del Shadow DOM.
- `mau-config.js`: texto, tiempos y porcentaje de activación.

La aparición normal se activa al recorrer el 35 % de la portada. Para probarla
inmediatamente se puede abrir `index.html?mau=1`.
