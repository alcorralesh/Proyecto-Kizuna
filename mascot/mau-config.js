export const MAU_CONFIG = Object.freeze({
  enabled: true,
  triggerProgress: 0.35,
  minimumPageAge: 8000,
  testParameter: 'mau',
  timings: Object.freeze({
    peek: 1700,
    transition: 260,
    message: 7600,
    leave: 1100,
    footerPause: 900,
    sleep: 8200,
    sleepFade: 900,
    interactionHold: 4400
  }),
  message: Object.freeze({
    text: 'Solo estaba comprobando que esta línea temporal siguiera en su sitio.'
  }),
  interaction: Object.freeze({
    awake: Object.freeze([
      '¿Sí? Estoy trabajando.',
      'No deberías haberme visto.',
      'Todo parece estable… de momento.'
    ]),
    sleeping: '…cinco minutos más.'
  })
});
