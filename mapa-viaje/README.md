# Cartografía de la expedición

Prototipo aislado del mapa interactivo de PROJECT JAPAN.

## Acceso

La experiencia sólo es accesible mediante su URL directa:

`/mapa-viaje/index.html`

No está enlazada desde la web pública, el expediente ni la administración.

## Primer recorrido

1. Madrid → Tokio · avión.
2. Transición desde la escala internacional al mapa de Japón.
3. Tokio → Kioto · Shinkansen.

Los datos editables del recorrido están en `itinerary.js`. La página no
consulta Supabase, no almacena progreso y no modifica la sesión del expediente.
