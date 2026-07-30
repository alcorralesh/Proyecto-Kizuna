# Contrato de integración de AR-06

La experiencia completa vive en:

`/dispositivo-recuperado/index.html`

Para integrarla dentro del visor del expediente, sin la ficha exterior:

`/dispositivo-recuperado/index.html?embedded=1`

También admite abrir una evidencia concreta:

`/dispositivo-recuperado/index.html?app=timeline`

Ambos parámetros se pueden combinar:

`/dispositivo-recuperado/index.html?embedded=1&app=timeline`

Aplicaciones disponibles:

- `timeline` — AR-06-01
- `routes` — AR-06-02
- `gallery` — AR-06-03
- `whatsapp` — AR-06-04
- `search` — AR-06-05
- `health` — AR-06-06
- `lost` — AR-06-07
- `ktb` — KTB-012

## Aislamiento

- No usa Supabase.
- No usa `localStorage` ni `sessionStorage`.
- El estado de revisión sólo vive en memoria y se pierde al cerrar o recargar.
- No confirma lecturas ni altera el progreso del expediente.

## Sustitución futura de la carpeta

La tarjeta AR-06 sólo tendrá que abrir la URL con `embedded=1` en el visor actual.
El progreso de la carpeta seguirá dependiendo del flujo existente y no de esta
simulación. De este modo, sustituir las imágenes actuales no obliga a cambiar
ninguna regla de lectura, desbloqueo o persistencia.
