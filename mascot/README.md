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

La primera aparición normal se activa al recorrer el 30 % de la portada y
espera a que el desplazamiento se estabilice. Puede producirse una segunda
aparición despierta en una sección posterior diferente, con un intervalo mínimo
de 40 segundos y sin repetir inmediatamente la misma frase. Después, cuando el
usuario alcanza el pie de página, Mau vuelve a aparecer dormido.

Las frases se eligen en memoria según la sección visible. El componente no
consulta la sesión, el progreso del expediente, almacenamiento local ni Supabase.

Para probar las escenas inmediatamente:

- Mensaje: `index.html?mau=1`.
- Mau dormido: `index.html?mau=sleep`.

La pata/medalla de Mau funciona como un pequeño easter egg accesible mediante
toque, ratón o teclado. Las respuestas se configuran en `mau-config.js`.
