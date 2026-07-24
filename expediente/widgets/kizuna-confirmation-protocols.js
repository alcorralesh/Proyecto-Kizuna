(() => {
  'use strict';

  const DOCUMENTS = {
    'KTB-001': { kind: 'accession', title: 'Apertura del expediente maestro', result: 'SECUENCIA INICIADA', objective: 'Incorpora la ficha recuperada al primer cajón del expediente.' },
    'KTB-002': { kind: 'consent', title: 'Registro de conformidad', result: 'CONDICIONES ACEPTADAS' },
    'KTB-003': { kind: 'correspondence', title: 'Custodia de correspondencia', result: 'CARTA CUSTODIADA', objective: 'Pliega la carta y protégela en la funda sellada.' },
    'KTB-004': { kind: 'album', title: 'Incorporación al álbum', result: 'FOTOGRAFÍA CATALOGADA', objective: 'Monta la fotografía recuperada en su página de archivo.' },
    'KTB-005': { kind: 'compare', title: 'Cotejo documental', result: 'COPIA VERIFICADA', objective: 'Desplaza la mesa de luz hasta hacer coincidir ambas copias.' },
    'KTB-006': { kind: 'signature', title: 'Autorización de consulta', result: 'AUTORIZACIÓN FIRMADA' },
    'KTB-007': { kind: 'timeline', title: 'Aplicación de actualización', result: 'VERSIÓN ACTUALIZADA', objective: 'Conecta el cartucho recuperado al nodo temporal vigente.' },
    'KTB-008': { kind: 'cipher', title: 'Integración del bloque cifrado', result: 'BLOQUE INTEGRADO', objective: 'Reconstruye la clave visible en los fragmentos del registro.' },
    'KTB-009': { kind: 'chronology', title: 'Ordenación cronológica', result: 'CRONOLOGÍA REGISTRADA', objective: 'Sitúa el paquete documental en el año autorizado.' },
    'KTB-010': { kind: 'integrity', title: 'Certificación de integridad', result: 'INTEGRIDAD CERTIFICADA', objective: 'Comprueba las cuatro zonas antes de certificar el documento.' },
    'KTB-011': { kind: 'classify', title: 'Clasificación documental', result: 'DOCUMENTO AUTORIZADO', objective: 'Selecciona la bandeja que corresponde al expediente activo.' },
    'KTB-012': { kind: 'datepress', title: 'Cierre del acta de reanudación', result: 'ACTA FECHADA', objective: 'Introduce el acta y acciona la fechadora mecánica.' },
    'KTB-013': { kind: 'validation', title: 'Validación del análisis', result: 'ANÁLISIS BLOQUEADO' }
  };

  const css = `
    :host{display:block;width:100%;--red:#9b211d;--gold:#d8ba62;--green:#75a06b;--cream:#eee1c5;--ink:#07130f;font-family:"DM Mono",monospace;color:var(--cream)}
    *{box-sizing:border-box}button,input{font:inherit}button{color:inherit}button:focus-visible,input:focus-visible,[tabindex]:focus-visible{outline:2px solid var(--gold);outline-offset:4px}
    .console{position:relative;min-height:460px;overflow:hidden;border:1px solid #53675e;background:radial-gradient(circle at 82% 12%,#d8ba6218,transparent 25%),linear-gradient(145deg,#10251e,#06110d);box-shadow:inset 0 0 65px #0009,0 20px 42px #0008}
    .console:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.13;background-image:linear-gradient(#fff1 1px,transparent 1px),linear-gradient(90deg,#fff1 1px,transparent 1px);background-size:42px 42px}
    header{position:relative;z-index:4;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:17px 22px;border-bottom:1px solid #50635a;background:#07130fe8}
    .eyebrow{display:block;color:var(--gold);font-size:8px;letter-spacing:.16em}.heading{margin:5px 0 0;font:600 clamp(23px,3vw,37px)/1 "EB Garamond",serif}.node{text-align:right;color:#8fa097;font-size:8px;letter-spacing:.12em}.node b{display:block;margin-top:5px;color:var(--gold);font-size:12px}
    .stage{position:relative;z-index:2;min-height:345px;display:grid;place-items:center;padding:20px 25px 50px}.readout{position:absolute;z-index:8;left:20px;right:20px;bottom:14px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:13px;color:#91a299;font-size:8px;letter-spacing:.11em}.track{height:5px;background:#263930}.fill{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--red),var(--gold));box-shadow:0 0 13px #d8ba6277}.percent{color:var(--gold)}
    .paper{position:relative;border:1px solid #b9a477;background:linear-gradient(135deg,#f4e7cb,#d8c198);color:#14211c;box-shadow:0 17px 30px #0008}.paper:before{content:"";position:absolute;inset:9px;border:1px solid #9b211d3d;pointer-events:none}.paper-code{color:var(--red);font-size:8px;letter-spacing:.14em}.paper h3{font:600 27px/1.05 "EB Garamond",serif}.lines{height:1px;margin-top:14px;background:#8c8069;box-shadow:0 13px #a79a7e,0 26px #a79a7e,0 39px #a79a7e}
    .success{visibility:hidden;position:absolute;z-index:30;inset:0;display:grid;place-items:center;background:#06110ded;text-align:center;opacity:0}.success-mark{position:relative;display:grid;place-items:center;width:150px;height:150px;margin:auto;border:3px double var(--gold);border-radius:50%;color:#f1d982;box-shadow:0 0 0 9px #9b211d33,0 0 45px #d8ba6266;rotate:-8deg}.success-mark:after{content:"";position:absolute;inset:11px;border:1px dashed var(--gold);border-radius:50%}.success-mark b{max-width:112px;font-size:14px;line-height:1.2}.success strong{display:block;margin-top:21px;font:600 35px "EB Garamond",serif}.success small{display:block;margin-top:7px;color:var(--gold);font-size:8px;letter-spacing:.16em}
    .instruction{color:#96a69d;font-size:8px;letter-spacing:.12em;text-align:center}

    /* 001 · ficha de alta */
    .accession{width:min(720px,100%);display:grid;grid-template-columns:240px 1fr;align-items:center;gap:38px}.index-card{position:relative;min-height:205px;padding:25px;border:1px solid var(--gold);background:linear-gradient(145deg,#17362b,#091610);box-shadow:0 16px 27px #0008;cursor:grab;touch-action:none;user-select:none}.index-card:before{content:"";position:absolute;inset:10px;border:1px dashed #d8ba6277}.index-card b{display:block;margin:32px 0 14px;font:600 29px "EB Garamond",serif}.index-card span{color:var(--gold);font-size:8px;letter-spacing:.12em}.master-file{position:relative;min-height:270px;padding:22px;border:1px solid #60746a;background:linear-gradient(#183027,#07130f);box-shadow:inset 0 0 35px #000,0 15px 30px #0008}.master-file:before,.master-file:after{content:"";display:block;height:66px;margin-bottom:14px;border:1px solid #4d6258;background:#091812;box-shadow:inset 0 0 14px #000}.master-file .slot{position:absolute;left:12%;right:12%;top:43%;height:27px;border:2px solid var(--gold);background:#020504;box-shadow:0 0 17px #d8ba6244}.master-file strong{position:absolute;left:0;right:0;bottom:21px;text-align:center;color:var(--gold);font-size:9px;letter-spacing:.15em}.master-file.is-ready{box-shadow:inset 0 0 35px #000,0 0 32px #d8ba6277}

    /* 002 · cláusulas */
    .consent{width:min(720px,100%);display:grid;grid-template-columns:1.1fr .9fr;gap:18px}.clauses{min-height:260px;padding:28px}.clauses h3{margin:13px 0 20px}.clause-list{display:grid;gap:12px}.clause-list span{display:flex;gap:9px;font-size:9px}.clause-list i{width:7px;height:7px;margin-top:2px;border-radius:50%;background:var(--red)}.consent-panel{display:grid;align-content:center;gap:13px;padding:22px;border:1px solid #53675e;background:#081711}.consent-panel label{display:flex;align-items:center;gap:11px;padding:12px;border:1px solid #40554b;font-size:8px;line-height:1.5;cursor:pointer}.consent-panel input{width:20px;height:20px;accent-color:var(--red)}.action{min-height:52px;border:1px solid var(--gold);background:#8e211c;color:#fff;cursor:pointer}.action:disabled{border-color:#465950;background:#14241e;color:#65776e;cursor:not-allowed}

    /* 003 · carta, funda y cordón */
    .correspondence{width:min(720px,100%);display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:30px}.letter{justify-self:center;width:230px;min-height:270px;padding:25px;cursor:grab;touch-action:none;user-select:none}.letter h3{margin:27px 0 14px}.letter .fold{position:absolute;left:0;right:0;bottom:0;height:0;background:#c7ae7e;transition:height .35s}.letter.is-folded{min-height:165px}.letter.is-folded .fold{height:48%}.sleeve{position:relative;min-height:270px;border:1px solid #65776e;background:linear-gradient(145deg,#162e25,#081510);box-shadow:inset 0 0 30px #000}.sleeve:before{content:"";position:absolute;left:12%;right:12%;top:17%;height:18px;border:2px solid var(--gold);background:#020504}.sleeve .cord{position:absolute;left:13%;right:13%;top:58%;height:3px;background:var(--red);box-shadow:0 18px var(--red);opacity:.35}.sleeve strong{position:absolute;left:0;right:0;bottom:24px;text-align:center;color:var(--gold);font-size:9px;letter-spacing:.14em}.sleeve.is-ready{box-shadow:inset 0 0 30px #000,0 0 28px #d8ba6266}.fold-note{position:absolute;left:0;right:0;bottom:16px;text-align:center;color:#91a299;font-size:8px}

    /* 004 · álbum */
    .album{width:min(740px,100%);display:grid;grid-template-columns:235px 1fr;align-items:center;gap:34px}.photo{position:relative;width:225px;padding:10px 10px 30px;border:1px solid #d2c09c;background:#eee0c5;color:#16221d;box-shadow:0 15px 27px #0008;cursor:grab;touch-action:none;user-select:none}.photo img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;filter:sepia(.22)}.photo b{display:block;margin-top:10px;font:600 18px "EB Garamond",serif;text-align:center}.album-page{position:relative;min-height:280px;padding:22px;border:1px solid #b7a376;background:linear-gradient(135deg,#e8d8b8,#c8ad78);color:#17221d;box-shadow:0 15px 28px #0008}.album-page:before{content:"";position:absolute;left:18px;top:0;bottom:0;width:9px;border-left:2px solid #7c633b;border-right:2px solid #7c633b}.album-page h3{margin:5px 0 20px 30px}.photo-slot{position:absolute;left:20%;right:12%;top:28%;bottom:18%;display:grid;place-items:center;border:2px dashed #8f7448;background:#f2e5cc77;color:#806d4d;font-size:9px}.album-page.is-ready .photo-slot{border-color:var(--red);box-shadow:0 0 21px #9b211d44}

    /* 005 · transparencias */
    .compare{width:min(730px,100%);display:grid;grid-template-columns:1fr 180px;gap:22px}.compare-view{position:relative;min-height:285px;overflow:hidden;border:1px solid #5d7167;background:#07130f}.compare-view img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.compare-view .copy{clip-path:inset(0 calc(100% - var(--reveal,0%)) 0 0);filter:contrast(1.1) saturate(.8)}.compare-view .scan-line{position:absolute;left:var(--reveal,0%);top:0;bottom:0;width:2px;background:var(--gold);box-shadow:0 0 16px var(--gold)}.compare-control{display:grid;align-content:center;gap:16px;padding:20px;border:1px solid #52665c;background:#081711}.compare-control input{width:100%;accent-color:var(--red)}.compare-control output{font-size:28px;color:var(--gold);text-align:center}.compare-control small{text-align:center;color:#91a299;font-size:8px}

    /* 006 · firma */
    .signature{width:min(720px,100%);display:grid;grid-template-columns:1fr 185px;gap:20px}.sign-sheet{min-height:285px;padding:28px}.sign-sheet h3{margin:13px 0 22px}.sign-sheet canvas{display:block;width:100%;height:125px;border-bottom:2px solid #6d604e;touch-action:none}.sign-sheet b{display:block;margin-top:8px;color:#7f715d;font-size:7px;letter-spacing:.14em}.sign-controls{display:grid;align-content:center;gap:12px}.date-window{padding:14px;border:1px solid #52665c;background:#0a1914;color:var(--gold);font-size:9px;text-align:center}.sign-controls small{color:#91a299;font-size:8px;line-height:1.5}

    /* 007 · línea temporal */
    .timeline{width:min(740px,100%);display:grid;grid-template-columns:190px 1fr;align-items:center;gap:37px}.update-module{position:relative;width:180px;height:145px;border:1px solid var(--gold);background:linear-gradient(145deg,#17362b,#081510);box-shadow:0 15px 26px #0008;cursor:grab;touch-action:none}.update-module:before{content:"";position:absolute;inset:11px;border:1px dashed #d8ba6277}.update-module b{display:block;margin-top:40px;color:var(--gold);font-size:24px}.update-module span{display:block;margin-top:8px;font-size:8px}.timeline-track{position:relative;min-height:250px;border:1px solid #52665c;background:#081711}.timeline-track:before{content:"";position:absolute;left:9%;right:9%;top:49%;height:2px;background:#60736a}.timeline-track i{position:absolute;top:calc(49% - 12px);width:25px;height:25px;border:2px solid #72877c;border-radius:50%;background:#081711}.timeline-track i:nth-child(1){left:12%}.timeline-track i:nth-child(2){left:42%}.timeline-track i:nth-child(3){right:12%;border-color:var(--gold);box-shadow:0 0 16px #d8ba6266}.timeline-track strong{position:absolute;left:0;right:0;bottom:25px;text-align:center;color:var(--gold);font-size:9px;letter-spacing:.13em}.timeline-track.is-ready{box-shadow:0 0 30px #d8ba6255}

    /* 008 · código y bloque */
    .cipher{width:min(720px,100%);display:grid;grid-template-columns:1fr 1fr;gap:18px}.cipher-core{position:relative;min-height:280px;display:grid;place-items:center;border:1px solid #52665c;background:radial-gradient(circle,#193b30,#06110d 63%)}.cipher-core:before,.cipher-core:after{content:"";position:absolute;border:1px dashed #d8ba6288;border-radius:50%;animation:spin 12s linear infinite}.cipher-core:before{width:210px;height:210px}.cipher-core:after{width:148px;height:148px;animation-direction:reverse}.cipher-core .socket{width:76px;height:76px;border:2px solid var(--gold);rotate:45deg;background:#07130f;box-shadow:0 0 23px #d8ba6244}.cipher-core strong{position:absolute;bottom:21px;color:var(--gold);font-size:8px}.keypad{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding:16px;border:1px solid #52665c;background:#07130f}.display{grid-column:1/-1;padding:14px;border:1px solid #52665c;background:#10261e;text-align:center;font-size:24px;letter-spacing:.18em}.keypad button{min-height:42px;border:1px solid #52665c;background:#0c1d17;cursor:pointer}.keypad button:hover{border-color:var(--gold)}.keypad button[data-key="OK"]{background:#8e211c}.cipher-block{visibility:hidden;position:absolute;width:62px;height:62px;border:2px solid var(--gold);background:#9b211d;rotate:45deg;opacity:0}

    /* 009 · cronología */
    .chronology{position:relative;width:min(735px,100%);padding-top:110px}.date-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}.date-card{position:relative;min-height:150px;padding:20px;border:1px solid #52665c;background:#0b1b15;text-align:left}.date-card b{display:block;color:var(--gold);font-size:16px}.date-card span{display:block;margin-top:24px;font:600 19px "EB Garamond",serif}.date-card.target{border:2px dashed var(--gold);background:#152a22}.chrono-packet{position:absolute;z-index:4;left:calc(50% - 72px);top:0;width:145px;min-height:92px;padding:17px;border:1px solid var(--gold);background:#8f211c;box-shadow:0 12px 22px #0008;cursor:grab;touch-action:none}.chronology .hint{margin-top:18px;color:#91a299;font-size:8px;text-align:center}

    /* 010 · escáner de integridad */
    .integrity{width:min(720px,100%);display:grid;grid-template-columns:1fr 175px;gap:20px}.integrity-doc{min-height:285px;padding:27px;overflow:hidden}.integrity-doc h3{margin:13px 0 18px}.integrity-doc .scan{position:absolute;left:0;right:0;top:8%;height:3px;background:#6fc26b;box-shadow:0 0 16px #6fc26b}.integrity-doc .green-stamp{position:absolute;right:28px;bottom:23px;display:grid;place-items:center;width:100px;height:100px;border:4px double #3e7f45;border-radius:50%;color:#3e7f45;font-size:9px;text-align:center;opacity:0;rotate:-9deg}.integrity-control{display:grid;align-content:center;gap:15px;padding:19px;border:1px solid #52665c;background:#081711}.integrity-control input{accent-color:#6fc26b}.integrity-control output{color:#78b976;font-size:27px;text-align:center}.integrity-control small{font-size:8px;color:#91a299;text-align:center}

    /* 011 · clasificación */
    .classify{width:min(740px,100%);display:grid;grid-template-columns:190px 1fr;align-items:center;gap:28px}.classify-card{min-height:195px;padding:23px}.classify-card h3{margin:28px 0 12px}.trays{display:grid;gap:10px}.tray{min-height:62px;padding:13px 17px;border:1px solid #52665c;background:#0a1a14;text-align:left;cursor:pointer}.tray b{display:block;font-size:10px}.tray small{display:block;margin-top:5px;color:#91a299;font-size:7px}.tray.correct{border-color:var(--gold);box-shadow:inset 4px 0 var(--gold)}.tray.is-wrong{animation:shake .28s}.tray.is-chosen{background:#18392c;box-shadow:0 0 22px #75a06b55}

    /* 012 · fechadora */
    .datepress{width:min(725px,100%);display:grid;grid-template-columns:225px 1fr;align-items:center;gap:32px}.act{min-height:250px;padding:24px;cursor:grab;touch-action:none}.act h3{margin:28px 0 12px}.press{position:relative;min-height:275px;border:1px solid #52665c;background:linear-gradient(#193128,#07130f);box-shadow:inset 0 0 30px #000}.press .mouth{position:absolute;left:12%;right:12%;bottom:20%;height:62px;border:2px solid var(--gold);background:#020504}.press .head{position:absolute;left:24%;right:24%;top:13%;height:92px;border:2px solid #a98b47;border-radius:8px;background:linear-gradient(#962a22,#40100d);box-shadow:0 12px 20px #0008}.press .head:after{content:"FECHADORA CENTRAL";position:absolute;left:0;right:0;bottom:12px;text-align:center;color:#f0d27a;font-size:8px}.press button{position:absolute;right:12%;top:13%;width:55px;height:92px;border:1px solid var(--gold);background:#10231c;cursor:pointer}.press button:disabled{opacity:.35}.press.is-ready{box-shadow:inset 0 0 30px #000,0 0 27px #d8ba6266}

    /* 013 · panel de validación */
    .validation{width:min(730px,100%);display:grid;grid-template-columns:1fr 210px;gap:20px}.meters{display:grid;gap:10px}.meter{display:grid;grid-template-columns:1fr 74px;align-items:center;gap:15px;min-height:67px;padding:14px 17px;border:1px solid #52665c;background:#0a1a14}.meter span{font-size:9px}.meter button{height:35px;border:1px solid #60746a;background:#07130f;cursor:pointer}.meter button:after{content:"PENDIENTE";font-size:7px}.meter.is-set{border-color:#75a06b;background:#142a20}.meter.is-set button{border-color:#75a06b;color:#a9ce99}.meter.is-set button:after{content:"FIJADO"}.lock-panel{display:grid;place-items:center;padding:18px;border:1px solid #52665c;background:radial-gradient(circle,#17382c,#07130f)}.lock{position:relative;width:140px;height:140px;border:2px solid var(--gold);border-radius:50%;background:#0a1914;cursor:pointer;touch-action:none}.lock:before{content:"";position:absolute;inset:13px;border:1px dashed var(--gold);border-radius:50%}.lock i{position:absolute;left:50%;top:13px;width:3px;height:54px;background:var(--red);transform-origin:50% 57px}.lock b{position:absolute;inset:0;display:grid;place-items:center;color:var(--gold);font-size:9px}.lock:disabled{opacity:.35;cursor:not-allowed}.lock-panel small{color:#91a299;font-size:7px;text-align:center}

    /* Segunda generación · objetos físicos del Archivo Central */
    .place-action{position:absolute;z-index:5;left:18px;right:18px;bottom:14px;min-height:46px;border:1px solid var(--gold);background:#8f211c;color:#fff;font-size:8px;letter-spacing:.1em;cursor:pointer}.place-action:hover:not(:disabled){background:#ad2d25}.place-action:disabled{opacity:.38;cursor:not-allowed}

    .accession{grid-template-columns:255px 1fr;gap:28px}.index-card{min-height:274px;padding:17px;background:linear-gradient(145deg,#ede0c3,#c5ab79);color:#16221d;transform:rotate(-1.2deg)}.index-card:before{border-color:#9b211d55}.index-card .artifact-tag{position:relative;z-index:2;color:#8f211c}.index-card figure{position:relative;height:142px;margin:14px 0 12px;overflow:hidden;border:1px solid #8c7958;background:#e7d6b5}.index-card img{width:100%;height:100%;object-fit:cover;object-position:top;filter:sepia(.35) contrast(.94)}.index-card b{position:relative;z-index:2;margin:0 0 6px;font-size:25px}.index-card>span:last-child{position:relative;z-index:2;color:#65583f}.master-file{min-height:286px;padding:18px;background:linear-gradient(145deg,#1d3129,#07110e);border:1px solid #6e7f76}.master-file:before,.master-file:after{display:none}.drawer-label{display:flex;align-items:center;justify-content:space-between;padding:11px 13px;border:1px solid #4d6258;background:#091812}.drawer-label small{color:#91a299;font-size:7px}.drawer-label b{color:var(--gold);font-size:11px}.master-file .slot{top:87px;height:37px;border-width:3px;background:linear-gradient(#000,#14251e);box-shadow:inset 0 8px 13px #000,0 0 18px #d8ba6233}.file-tabs{display:flex;justify-content:center;gap:5px;margin-top:96px}.file-tabs span{padding:8px 10px;border:1px solid #43574e;background:#10221b;color:#879890;font-size:6px}.master-file>strong{bottom:67px}.master-file.is-ready .slot{border-color:#f0d57d;box-shadow:inset 0 8px 13px #000,0 0 26px #d8ba6288}

    .correspondence{grid-template-columns:270px 1fr;gap:26px}.letter{width:250px;min-height:278px;padding:16px 18px;background:linear-gradient(135deg,#f1e5cc,#d2bd94);transform:rotate(-1.5deg)}.letter figure{height:150px;margin:12px 0 10px;overflow:hidden;border:1px solid #a38f68}.letter img{width:100%;height:100%;object-fit:cover;object-position:top;filter:sepia(.25)}.letter h3{margin:0;font-size:22px}.letter.is-folded{min-height:170px}.letter.is-folded figure{height:64px}.sleeve{min-height:280px;border-color:#8c7445;background:radial-gradient(circle at 50% 42%,#243f34,#08140f 70%);box-shadow:inset 0 0 0 8px #ffffff05,inset 0 0 45px #000,0 18px 30px #0008}.sleeve:before{top:22%;height:24px}.sleeve-window{position:absolute;top:65px;left:50%;display:grid;place-items:center;width:92px;height:92px;border:2px double var(--gold);border-radius:50%;transform:translateX(-50%);color:var(--gold)}.sleeve-window span{font:600 20px "EB Garamond",serif}.sleeve-window b{font-size:9px}.sleeve .cord{top:58%;opacity:.7}.wax-seal{position:absolute;left:50%;top:55%;display:grid;place-items:center;width:42px;height:42px;border:3px double #efb2a6;border-radius:50%;background:#8f211c;color:#f0d7b0;font-style:normal;transform:translate(-50%,-50%);box-shadow:0 5px 12px #0008}.sleeve strong{bottom:70px}.fold-note{bottom:9px}

    .album{grid-template-columns:245px 1fr;gap:28px}.photo{width:230px;padding:10px 10px 28px;transform:rotate(-2deg)}.photo img{aspect-ratio:4/3;object-position:top}.photo b{margin-top:7px}.photo small{display:block;margin-top:4px;color:#796b52;font-size:6px;text-align:center}.album-page{min-height:292px;padding:22px 24px 70px;background:linear-gradient(135deg,#e8d4ac,#b89458);box-shadow:inset 0 0 0 8px #70532822,0 18px 30px #0008}.album-page:before{left:24px;width:12px}.album-binding{position:absolute;left:7px;top:18px;bottom:18px;width:19px;background:repeating-linear-gradient(#6e542d 0 8px,#c19c5f 8px 12px)}.album-code{display:block;margin-left:25px;color:#7e1b19;font-size:7px;letter-spacing:.12em}.album-page h3{margin:8px 0 13px 25px;font-size:27px}.photo-slot{left:20%;right:10%;top:29%;bottom:25%;align-content:center;gap:7px;border-color:#7e6035;background:#f2e5cc55}.photo-slot i{display:block;width:42px;height:32px;border:1px solid #8f7448;box-shadow:-9px -7px 0 -7px #8f7448,9px 7px 0 -7px #8f7448}.photo-slot span{font-size:9px}.photo-slot small{font-size:6px}

    .compare{grid-template-columns:minmax(0,1fr) 210px;gap:16px}.compare-view{min-height:300px;border-color:#71837a;background:linear-gradient(90deg,#ffffff08 1px,transparent 1px),linear-gradient(#ffffff08 1px,transparent 1px),#07130f;background-size:22px 22px}.compare-view:after{content:"MESA DE LUZ · KTB-005";position:absolute;left:12px;bottom:9px;color:#d8ba62;font-size:6px;letter-spacing:.14em}.compare-view img{inset:24px 34px;width:calc(100% - 68px);height:calc(100% - 48px);object-fit:cover;object-position:top;box-shadow:0 0 28px #d9c28c28}.compare-label{position:absolute;z-index:5;top:9px;padding:5px 8px;background:#07130fe6;color:#c9d3cd;font-size:6px;letter-spacing:.1em}.original-label{left:9px}.copy-label{right:9px;color:var(--gold)}.compare-view .scan-line{z-index:4;left:calc(24px + (100% - 48px)*var(--reveal,0%)/100);top:16px;bottom:16px}.compare-view .scan-line b{position:absolute;left:-6px;top:50%;width:14px;height:44px;border:1px solid var(--gold);background:#10251e;transform:translateY(-50%)}.registration-marks i{position:absolute;width:13px;height:13px;border-color:#e8d797;border-style:solid;opacity:.75}.registration-marks i:nth-child(1){left:18px;top:18px;border-width:1px 0 0 1px}.registration-marks i:nth-child(2){right:18px;top:18px;border-width:1px 1px 0 0}.registration-marks i:nth-child(3){left:18px;bottom:18px;border-width:0 0 1px 1px}.registration-marks i:nth-child(4){right:18px;bottom:18px;border-width:0 1px 1px 0}.compare-control{gap:11px;padding:16px;background:linear-gradient(145deg,#11261e,#07130f)}.control-light{justify-self:center;width:12px;height:12px;border-radius:50%;background:#8f211c;box-shadow:0 0 13px #c5473c}.compare-control output{font-size:38px}.compare-control input{min-height:30px}.compare-control p{margin:0;color:#91a299;font-size:7px;line-height:1.5;text-align:center}

    .timeline{grid-template-columns:205px 1fr;gap:25px}.update-module{width:195px;height:178px;padding:18px;border-width:2px;background:linear-gradient(145deg,#223d32,#07130f);box-shadow:inset 0 0 0 7px #ffffff05,0 18px 28px #0008}.update-module:before{inset:12px;border-style:solid}.module-leds{display:flex!important;gap:5px!important;margin:0!important}.module-leds i{width:8px;height:8px;border-radius:50%;background:#7e1b19;box-shadow:0 0 7px #d94b40}.update-module b{margin-top:24px;font-size:29px}.update-module em{display:block;margin-top:13px;color:#83968c;font-size:6px;font-style:normal}.timeline-track{min-height:280px;padding:18px;background:linear-gradient(90deg,#ffffff08 1px,transparent 1px),#071711;background-size:28px 100%}.timeline-track:before,.timeline-track>i{display:none}.timeline-screen{display:flex;align-items:center;justify-content:space-between;padding:12px;border:1px solid #43594f;background:#0e241b}.timeline-screen small{color:#91a299;font-size:6px}.timeline-screen b{color:var(--gold);font-size:18px}.timeline-rail{position:absolute;left:10%;right:10%;top:47%;height:5px;background:#40574d;box-shadow:0 0 0 1px #182c24}.timeline-rail>i{position:absolute;top:-12px;display:grid;place-items:center;width:29px;height:29px;border:2px solid #6c8176;border-radius:50%;background:#071711}.timeline-rail>i:nth-child(1){left:0}.timeline-rail>i:nth-child(2){left:45%}.timeline-rail>i:nth-child(3){right:0;border-color:var(--gold);box-shadow:0 0 16px #d8ba6255}.timeline-rail span{position:absolute;top:34px;color:#899a91;font-size:6px;font-style:normal}.timeline-track>strong{bottom:70px}.timeline-track.is-ready .timeline-rail>i:nth-child(3){background:#8f211c}

    .chronology{padding-top:104px}.chrono-packet{left:calc(50% - 79px);width:158px;min-height:96px;padding:14px;border-width:2px;background:linear-gradient(145deg,#a12c25,#52110e);text-align:left}.chrono-packet small,.chrono-packet span{display:block;font-size:6px;letter-spacing:.1em}.chrono-packet b{display:block;margin:7px 0;font-size:21px}.chrono-packet i{position:absolute;right:12px;bottom:11px;width:24px;height:24px;border:1px solid #f2c179;rotate:45deg}.chrono-rail{position:absolute;left:4%;right:4%;top:169px;height:3px;background:#51675d}.chrono-rail i{position:absolute;left:50%;top:-5px;width:13px;height:13px;border-radius:50%;background:var(--gold);transform:translateX(-50%);box-shadow:0 0 15px var(--gold)}.date-cards{gap:10px}.date-card{min-height:158px;padding:18px;background:linear-gradient(145deg,#11271f,#08130f)}.date-card:before{content:"";position:absolute;left:50%;top:-12px;width:20px;height:20px;border:2px solid #61776c;border-radius:50%;background:#07130f;transform:translateX(-50%)}.date-card small{color:#84968d;font-size:6px}.date-card b{margin-top:10px;font-size:22px}.date-card span{margin-top:17px}.date-card.target{border-color:var(--gold);background:linear-gradient(145deg,#213b30,#0a1813)}.date-card.target:before{border-color:var(--gold);box-shadow:0 0 13px #d8ba6266}.date-card .place-action{left:12px;right:12px;bottom:10px;min-height:40px}.chronology .hint{margin-top:14px}

    .classify{grid-template-columns:230px 1fr;gap:24px}.classify-card{min-height:275px;padding:15px}.classify-card figure{height:128px;margin:12px 0 10px;overflow:hidden;border:1px solid #aa9875}.classify-card img{width:100%;height:100%;object-fit:cover;object-position:top;filter:sepia(.35)}.classify-card h3{margin:10px 0;font-size:23px}.classification-status{display:inline-block;padding:6px 8px;border:1px solid #9b211d;color:#9b211d;font-size:6px}.trays{gap:8px}.trays>p{margin:0 0 2px;color:#91a299;font-size:7px;letter-spacing:.12em}.tray{grid-template-columns:32px 16px 1fr;grid-template-rows:auto auto;align-items:center;column-gap:10px;min-height:70px;padding:10px 14px;background:linear-gradient(145deg,#10241c,#07130f)}.tray>span{grid-row:1/3;color:var(--gold);font-size:17px}.tray>i{grid-row:1/3;width:13px;height:28px;border:1px solid #5e7469;border-radius:8px 8px 2px 2px}.tray b,.tray small{grid-column:3}.tray b{font-size:9px}.tray small{margin:2px 0 0}.tray.correct{box-shadow:inset 4px 0 var(--gold),0 0 0 1px #d8ba6228}.tray.is-chosen{background:linear-gradient(145deg,#254537,#10251d)}

    .datepress{grid-template-columns:245px 1fr;gap:25px}.act{min-height:276px;padding:15px;transform:rotate(-1deg)}.act figure{height:138px;margin:12px 0 10px;overflow:hidden;border:1px solid #a8946d}.act img{width:100%;height:100%;object-fit:cover;object-position:top;filter:sepia(.3)}.act h3{margin:10px 0;font-size:24px}.act-date{display:inline-block;padding:5px 8px;border:1px solid #9b211d;color:#9b211d;font-size:7px}.press{min-height:290px;background:linear-gradient(145deg,#22362d,#07110e);box-shadow:inset 0 0 0 8px #ffffff05,inset 0 0 35px #000,0 18px 30px #0008}.press .head{left:19%;right:19%;top:18px;height:72px}.press .head:after{display:none}.press-top>span{position:absolute;left:0;right:0;top:42px;z-index:2;color:#f0d27a;font-size:6px;text-align:center;pointer-events:none}.press-top>span b{font-size:9px}.press .mouth{left:10%;right:10%;bottom:80px;height:57px}.press .mouth span{display:block;margin-top:70px;color:#91a299;font-size:6px;font-style:normal;text-align:center}.press-status{position:absolute;left:16px;right:16px;top:105px;display:flex;align-items:center;gap:8px;padding:8px;border:1px solid #41564c;background:#091812}.press-status i{width:8px;height:8px;border-radius:50%;background:#8f211c}.press-status span{color:#92a39a;font-size:6px}.press-insert,.press-stamp{position:absolute;top:auto!important;bottom:14px;width:auto!important;height:auto!important;min-height:46px;border:1px solid var(--gold);cursor:pointer}.press-insert{left:16px;right:51%;background:#10231c;color:var(--gold)}.press-stamp{left:51%;right:16px;background:#8f211c!important;color:#fff}.press-stamp b{font-size:14px}.press-stamp:disabled{background:#14241e!important;color:#65776e}.press.is-loaded .press-status i{background:#75a06b;box-shadow:0 0 9px #75a06b}.press.is-loaded .press-status span{color:#b8d4ac}

    /* Mecánicas únicas · ninguna depende de arrastrar el documento */
    .index-card,.letter,.photo,.update-module,.chrono-packet,.act{cursor:default;touch-action:auto;user-select:auto}
    .drawer-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px}.drawer-choices button{min-height:92px;padding:10px 6px;border:1px solid #43574e;background:linear-gradient(#172c24,#09150f);color:#91a299;font-size:7px;cursor:pointer}.drawer-choices button span{display:block;margin-bottom:9px;color:var(--gold);font-size:22px}.drawer-choices button.is-selected{border-color:var(--gold);background:#274538;color:#fff;box-shadow:0 0 18px #d8ba6244}.drawer-choices button.is-error{animation:shake .28s;border-color:#b64a41}.drawer-status{margin:13px 0 0;color:#91a299;font-size:7px;text-align:center}.drawer-confirm{position:absolute;left:18px;right:18px;bottom:14px;min-height:46px;border:1px solid var(--gold);background:#8f211c;color:#fff;cursor:pointer}.drawer-confirm:disabled{border-color:#465950;background:#14241e;color:#65776e}

    .fold-station{padding:17px}.fold-station:before{display:none}.fold-diagram{position:relative;height:100px;border:1px solid #52665c;background:linear-gradient(135deg,#162d24,#07130f)}.fold-diagram:before{content:"";position:absolute;left:50%;top:15px;width:72px;height:64px;border:1px solid #d8ba6277;background:#e7d7b722;transform:translateX(-50%)}.fold-diagram>i{position:absolute;z-index:2;width:42px;height:2px;background:#697e73;transition:.25s}.fold-diagram>i:nth-child(1){left:calc(50% - 21px);top:58px}.fold-diagram>i:nth-child(2){left:calc(50% - 48px);top:44px;transform:rotate(90deg)}.fold-diagram>i:nth-child(3){left:calc(50% + 6px);top:44px;transform:rotate(90deg)}.fold-diagram>i.is-complete{background:var(--gold);box-shadow:0 0 10px var(--gold)}.fold-diagram span{position:absolute;left:0;right:0;bottom:6px;color:#91a299;font-size:6px;text-align:center}.fold-controls{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:10px 0}.fold-controls button{min-height:52px;border:1px solid #50645a;background:#0c1d17;color:#91a299;font-size:7px;cursor:pointer}.fold-controls button span{display:block;margin-bottom:4px;color:var(--gold)}.fold-controls button.is-complete{border-color:#75a06b;background:#18382b;color:#fff}.fold-controls button.is-error{animation:shake .28s;border-color:#b64a41}.seal-letter{display:grid;grid-template-columns:38px 1fr;align-items:center;width:100%;min-height:56px;border:1px solid var(--gold);background:#8f211c;color:#fff;cursor:pointer}.seal-letter:disabled{border-color:#465950;background:#14241e;color:#65776e}.seal-letter i{display:grid;place-items:center;width:34px;height:34px;border:2px double currentColor;border-radius:50%;font-style:normal}.seal-letter span{font-size:7px;letter-spacing:.08em}.seal-letter.is-holding{box-shadow:inset 0 -5px #d8ba62}.letter[data-fold="1"]{transform:scale(.96) rotate(-1deg)}.letter[data-fold="2"]{transform:scale(.91) rotate(1deg)}.letter[data-fold="3"]{transform:scale(.84);filter:sepia(.2)}

    .photo-slot{display:block;overflow:visible;background:#f2e5cc77}.photo-slot>img{position:absolute;inset:9px;width:calc(100% - 18px);height:calc(100% - 18px);object-fit:cover;object-position:top;filter:sepia(.25);opacity:.9}.photo-slot>button{position:absolute;z-index:3;width:40px;height:40px;border:0;background:transparent;cursor:pointer}.photo-slot>button:before,.photo-slot>button:after{content:"";position:absolute;background:#7b633c;transition:.2s}.photo-slot>button:before{width:22px;height:5px}.photo-slot>button:after{width:5px;height:22px}.photo-slot>button:nth-of-type(1){left:-5px;top:-5px}.photo-slot>button:nth-of-type(2){right:-5px;top:-5px;transform:scaleX(-1)}.photo-slot>button:nth-of-type(3){left:-5px;bottom:-5px;transform:scaleY(-1)}.photo-slot>button:nth-of-type(4){right:-5px;bottom:-5px;transform:scale(-1)}.photo-slot>button.is-fixed:before,.photo-slot>button.is-fixed:after{background:#8f211c;box-shadow:0 0 7px #8f211c55}.photo-slot>span{position:absolute;z-index:2;left:0;right:0;bottom:-20px;color:#6b5738;font-size:7px;text-align:center}.album-confirm{position:absolute;left:18px;right:18px;bottom:14px;min-height:46px;border:1px solid #7e1b19;background:#8f211c;color:#fff;cursor:pointer}.album-confirm:disabled{border-color:#8b744c;background:#b9a477;color:#6b5a3c}

    .circuit-nodes{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:26px 5% 0}.circuit-nodes svg{position:absolute;z-index:0;left:0;right:0;top:0;width:100%;height:70px}.circuit-nodes path{fill:none;stroke:#4f645a;stroke-width:3}.circuit-nodes button{position:relative;z-index:2;min-height:82px;border:1px solid #52665c;background:#091812;color:#91a299;cursor:pointer}.circuit-nodes button i{display:block;width:22px;height:22px;margin:0 auto 8px;border:2px solid #6a8075;border-radius:50%;background:#07130f}.circuit-nodes button span{font-size:7px}.circuit-nodes button.is-active{border-color:#75a06b;color:#fff}.circuit-nodes button.is-active i{border-color:#9ed18d;background:#75a06b;box-shadow:0 0 16px #75a06b}.circuit-nodes button.is-error{animation:shake .28s;border-color:#b64a41}.timeline-track>strong{bottom:68px}.timeline-confirm{position:absolute;left:18px;right:18px;bottom:14px;min-height:46px;border:1px solid var(--gold);background:#8f211c;color:#fff;cursor:pointer}.timeline-confirm:disabled{border-color:#465950;background:#14241e;color:#65776e}

    .chronology{display:grid;grid-template-columns:170px 1fr;grid-template-areas:"packet selector" "scale scale" "confirm confirm" "hint hint";align-items:center;gap:13px;padding-top:0}.chrono-packet{position:relative;grid-area:packet;left:auto;top:auto;width:170px;min-height:112px}.chrono-selector{grid-area:selector;display:grid;grid-template-columns:52px 1fr 52px;align-items:stretch;gap:8px}.chrono-selector>button{border:1px solid var(--gold);background:#10231c;color:var(--gold);font-size:25px;cursor:pointer}.year-window{position:relative;display:grid;place-items:center;min-height:112px;border:1px solid #52665c;background:radial-gradient(circle,#17362b,#07130f)}.year-window span{font-size:6px;color:#91a299}.year-window output{color:#d1b96d;font-size:35px}.year-window output.is-correct{color:#a8d397;text-shadow:0 0 15px #75a06b}.year-window i{position:absolute;left:10px;right:10px;bottom:9px;height:3px;background:#4d6258}.year-scale{position:relative;grid-area:scale;display:flex;justify-content:space-between;padding-top:15px;color:#91a299;font-size:7px}.year-scale:before{content:"";position:absolute;left:0;right:0;top:4px;height:2px;background:#51675d}.year-scale i{position:absolute;left:0;top:-1px;width:12px;height:12px;border-radius:50%;background:var(--gold);transform:translateX(-50%);transition:left .25s;box-shadow:0 0 12px var(--gold)}.chronology-confirm{grid-area:confirm;min-height:48px;border:1px solid var(--gold);background:#8f211c;color:#fff;cursor:pointer}.chronology-confirm:disabled{border-color:#465950;background:#14241e;color:#65776e}.chronology .hint{grid-area:hint;margin:0}

    .press-stamp.is-holding{box-shadow:inset 0 -6px #d8ba62,0 0 17px #d8ba6244}

    /* Base renovada · objetivo visible y controles táctiles */
    .objective{max-width:560px;margin:7px 0 0;color:#b8c3bd;font-size:9px;line-height:1.45;letter-spacing:.04em}
    .sleeve strong{bottom:68px}.custody-action{position:absolute;left:13%;right:13%;bottom:15px;min-height:46px;border:1px solid var(--gold);background:#8e211c;color:#fff;cursor:pointer}.custody-action:disabled{border-color:#465950;background:#14241e;color:#65776e}
    .cipher-clue{position:absolute;z-index:2;top:20px;left:18px;right:18px;display:flex;justify-content:center;gap:8px}.cipher-clue span{display:grid;place-items:center;width:42px;height:36px;border:1px solid #d8ba6270;background:#07130fd9;color:var(--gold);font-size:18px;transform:rotate(var(--tilt))}
    .keypad button{min-height:46px}
    .integrity{grid-template-columns:1fr 210px}.integrity-doc .scan{transition:top .28s ease}.scan-points{display:grid;grid-template-columns:1fr 1fr;gap:7px}.scan-points button{min-height:46px;border:1px solid #52665c;background:#0c1d17;color:#9ba9a2;cursor:pointer}.scan-points button.is-done{border-color:#75a06b;background:#18392c;color:#c7e0bc}.scan-points button.is-error{animation:shake .28s}
    @keyframes spin{to{rotate:360deg}}@keyframes shake{25%{translate:-6px}50%{translate:6px}75%{translate:-3px}}
    @media(max-width:680px){.console{min-height:0}header{padding:8px 10px}.eyebrow{font-size:6px}header h2{margin-top:2px;font-size:20px}.node{display:none}.stage{min-height:0;padding:8px 8px 34px}.accession,.consent,.correspondence,.album,.compare,.signature,.timeline,.cipher,.classify,.datepress,.validation{grid-template-columns:1fr;gap:8px}.index-card,.letter,.photo,.update-module,.classify-card,.act{justify-self:center}.index-card{width:180px;min-height:112px;padding:14px}.index-card b{margin:18px 0 8px;font-size:22px}.master-file{min-height:142px;padding:12px}.master-file:before,.master-file:after{height:31px;margin-bottom:8px}.clauses{min-height:150px;padding:13px}.clauses h3{margin:7px 0 10px}.clause-list{gap:6px}.consent-panel{gap:7px;padding:10px}.consent-panel label{padding:7px}.sleeve{min-height:135px}.letter{width:160px;min-height:125px;padding:15px}.letter h3{margin:14px 0 8px}.album{gap:7px}.photo{width:145px;padding:7px 7px 19px}.album-page{min-height:145px;padding:12px}.compare-view{min-height:160px}.compare-control{grid-template-columns:1fr auto;padding:9px;gap:7px}.signature{gap:7px}.sign-sheet{min-height:160px;padding:13px}.sign-sheet h3{margin:7px 0 9px}.sign-sheet canvas{height:75px}.timeline{grid-template-columns:110px 1fr;gap:8px}.update-module{width:105px;height:90px}.update-module b{margin-top:22px;font-size:17px}.timeline-track{min-height:135px}.cipher{grid-template-columns:1fr 1fr}.cipher-core{min-height:145px}.cipher-core:before{width:120px;height:120px}.cipher-core:after{width:82px;height:82px}.keypad{gap:4px;padding:7px}.keypad button{min-height:29px}.display{padding:7px;font-size:16px}.chronology{padding-top:0}.date-cards{grid-template-columns:repeat(3,1fr);gap:5px}.date-card{min-height:70px;padding:8px}.date-card span{margin-top:9px;font-size:13px}.chrono-packet{position:relative;left:auto;top:auto;width:100%;margin-bottom:6px}.integrity{grid-template-columns:1fr}.integrity-doc{min-height:160px}.classify{grid-template-columns:135px 1fr}.classify-card{width:130px;min-height:105px;padding:12px}.datepress{grid-template-columns:130px 1fr;gap:8px}.act{width:125px;min-height:110px;padding:12px}.act h3{margin:13px 0 7px}.press{min-height:145px}.press .head{height:55px}.press button{height:55px}.validation{grid-template-columns:1fr 115px;gap:7px}.meter{min-height:44px;padding:7px}.lock{width:92px;height:92px}.lock i{height:34px;transform-origin:50% 37px}.success-mark{width:100px;height:100px}.success strong{margin-top:10px;font-size:26px}.readout{left:9px;right:9px;bottom:9px;grid-template-columns:1fr auto}}
    @media(max-width:680px){
      header{padding:10px 12px}header>div{min-width:0}.eyebrow{font-size:7px}.heading{overflow-wrap:anywhere}.objective{margin-top:5px;font-size:10px;line-height:1.35}.stage{padding:10px 10px 42px}
      .place-action{min-height:48px;font-size:9px}
      .accession{grid-template-columns:1fr;gap:10px}.index-card{width:100%;min-height:180px;padding:12px}.index-card figure{height:84px;margin:9px 0}.index-card b{font-size:21px}.master-file{min-height:205px;padding:11px 11px 62px}.drawer-choices{gap:5px;margin-top:10px}.drawer-choices button{min-height:72px}.drawer-choices button span{font-size:18px}.drawer-status{font-size:8px}
      .correspondence{grid-template-columns:1fr;gap:10px}.letter{width:100%;min-height:184px;padding:12px}.letter figure{height:86px;margin:8px 0}.letter h3{font-size:20px}.sleeve{min-height:250px}.fold-station{padding:10px}.fold-diagram{height:82px}.fold-diagram:before{top:8px;height:55px}.fold-controls button{min-height:48px}.seal-letter{min-height:52px}.fold-note{position:relative;bottom:auto;margin:0;font-size:9px;line-height:1.4}
      .album{grid-template-columns:1fr;gap:10px}.photo{width:165px;padding:7px 7px 20px}.photo b{font-size:16px}.album-page{min-height:195px;padding:14px 16px 64px}.album-binding{top:10px;bottom:10px}.album-code{margin-left:20px}.album-page h3{margin:5px 0 8px 20px;font-size:22px}.photo-slot{top:31%;bottom:31%;left:20%;right:8%}
      .compare{grid-template-columns:1fr;gap:8px}.compare-view{min-height:205px}.compare-view img{inset:18px 25px;width:calc(100% - 50px);height:calc(100% - 36px)}.compare-control{grid-template-columns:1fr auto;padding:10px;gap:8px}.compare-control .control-light,.compare-control small,.compare-control p,.compare-control input,.compare-control .action{grid-column:1/-1}.compare-control output{font-size:30px}.compare-control .action{min-height:48px}
      .timeline{grid-template-columns:1fr;gap:9px}.update-module{justify-self:center;width:170px;height:125px;padding:13px}.update-module b{margin-top:13px;font-size:24px}.update-module em{margin-top:7px}.timeline-track{min-height:225px;padding:10px}.timeline-screen{padding:8px}.circuit-nodes{gap:7px;margin:13px 0 0}.circuit-nodes button{min-height:72px}.timeline-track>strong{bottom:62px}
      .cipher{grid-template-columns:1fr;gap:8px}.cipher-core{min-height:160px}.cipher-core:before{width:112px;height:112px}.cipher-core:after{width:76px;height:76px}.cipher-clue{top:10px}.cipher-core strong{bottom:10px}.keypad{gap:6px;padding:8px}.keypad button{min-height:46px;font-size:12px}.display{padding:9px;font-size:18px}
      .chronology{grid-template-columns:1fr;grid-template-areas:"packet" "selector" "scale" "confirm" "hint";gap:9px;padding-top:0}.chrono-packet{position:relative;left:auto;top:auto;width:100%;min-height:76px;margin:0}.chrono-selector{grid-template-columns:50px 1fr 50px}.year-window{min-height:90px}.year-window output{font-size:29px}.chronology .hint{font-size:9px;line-height:1.4}
      .integrity{grid-template-columns:1fr}.integrity-control{grid-template-columns:1fr auto;align-items:center;padding:10px}.integrity-control small{grid-column:1/-1;font-size:9px;line-height:1.45}.integrity-control input{grid-column:1/-1;min-height:30px}.scan-points{grid-column:1/-1;grid-template-columns:repeat(4,1fr)}.scan-points button{min-height:48px}
      .classify{grid-template-columns:1fr;gap:9px}.classify-card{width:100%;min-height:182px;padding:10px}.classify-card figure{height:76px;margin:7px 0}.classify-card h3{margin:6px 0;font-size:19px}.trays{gap:6px}.trays>p{font-size:8px}.tray{min-height:58px;padding:8px 10px}.tray small{font-size:8px}
      .datepress{grid-template-columns:1fr;gap:9px}.act{width:100%;min-height:185px;padding:10px}.act figure{height:80px;margin:7px 0}.act h3{margin:6px 0;font-size:20px}.press{min-height:225px}.press .head{height:56px}.press-top>span{top:32px}.press-status{top:82px}.press .mouth{bottom:70px;height:40px}.press .mouth span{margin-top:48px}.press-insert,.press-stamp{min-height:48px;font-size:8px}
      .success-mark{width:110px;height:110px}.success small{font-size:9px;line-height:1.5}
    }
    @media(max-height:620px) and (orientation:landscape){.console{min-height:410px}.stage{min-height:305px;padding-top:10px}.accession,.consent,.correspondence,.album,.compare,.signature,.timeline,.cipher,.classify,.datepress,.validation{grid-template-columns:1fr 1fr}.master-file,.clauses,.sleeve,.album-page,.compare-view,.sign-sheet,.timeline-track,.cipher-core,.press{min-height:210px}.success-mark{width:105px;height:105px}.objective{font-size:8px}.cipher-core{min-height:210px}.scan-points{grid-template-columns:repeat(4,1fr)}}
    @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
  `;

  class KizunaConfirmationProtocol extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.done = false;
      this.progress = 0;
    }

    connectedCallback() {
      this.documentId = this.getAttribute('document-id') || 'KTB-001';
      this.data = DOCUMENTS[this.documentId] || DOCUMENTS['KTB-001'];
      this.render();
      this.bind();
    }

    render() {
      this.shadowRoot.innerHTML = `<style>${css}</style>
        <section class="console">
          <header><div><span class="eyebrow">REGISTRO DE LECTURA · ${this.documentId}</span><h2 class="heading">${this.data.title}</h2>${this.data.objective ? `<p class="objective">${this.data.objective}</p>` : ''}</div><div class="node">ARCHIVO CENTRAL<b>${this.documentId.slice(-3)} / CONFIRM</b></div></header>
          <div class="stage">${this.scene()}</div>
          <div class="readout"><i class="track"><b class="fill"></b></i><span class="percent">0%</span></div>
          <div class="success"><div><div class="success-mark"><b>${this.data.result}</b></div><strong>Protocolo completado</strong><small>SINCRONIZANDO ${this.documentId} CON EL ARCHIVO CENTRAL</small></div></div>
        </section>`;
    }

    scene() {
      const id = this.documentId;
      switch (this.data.kind) {
        case 'accession': return `<div class="accession"><article class="index-card"><span class="artifact-tag">FICHA DE ALTA · ${id}</span><figure><img src="../assets/documents/KTB-001.png" alt="Vista previa del documento KTB-001"></figure><b>Expediente recuperado</b><span>CLAVE DE ARCHIVO · CAJÓN 01</span></article><section class="master-file"><div class="drawer-label"><small>ARCHIVO CENTRAL</small><b>SELECCIONAR CAJÓN</b></div><div class="drawer-choices"><button type="button" data-drawer="03"><span>03</span>MEMORIA</button><button type="button" data-drawer="02"><span>02</span>VIAJE</button><button type="button" data-drawer="01"><span>01</span>IDENTIDAD</button></div><p class="drawer-status">LOCALIZA EL CAJÓN INDICADO EN LA FICHA</p><button class="drawer-confirm" type="button" disabled>ACTIVAR EXPEDIENTE</button></section></div>`;
        case 'consent': return `<div class="consent"><article class="paper clauses"><span class="paper-code">KTB/CUSTODIA/02</span><h3>Condiciones de consulta</h3><div class="clause-list"><span><i></i>Uso exclusivo del destinatario autorizado.</span><span><i></i>Custodia documental y trazabilidad.</span><span><i></i>Registro de actividad en el Archivo Central.</span></div></article><section class="consent-panel">${['IDENTIDAD VERIFICADA','CUSTODIA ACEPTADA','REGISTRO AUTORIZADO'].map((text,index)=>`<label><input type="checkbox" data-clause="${index}">${text}</label>`).join('')}<button class="action" type="button" disabled>REGISTRAR CONFORMIDAD</button></section></div>`;
        case 'correspondence': return `<div class="correspondence"><article class="paper letter"><span class="paper-code">CORRESPONDENCIA · ${id}</span><figure><img src="../assets/documents/KTB-003.png" alt="Vista previa de la carta recuperada"></figure><h3>Carta personal recuperada</h3><i class="fold"></i></article><section class="sleeve fold-station"><div class="fold-diagram"><i data-fold-mark="1"></i><i data-fold-mark="2"></i><i data-fold-mark="3"></i><span>SECUENCIA DE PLEGADO</span></div><div class="fold-controls"><button type="button" data-fold-step="1"><span>01</span>BASE</button><button type="button" data-fold-step="2"><span>02</span>LATERAL</button><button type="button" data-fold-step="3"><span>03</span>CIERRE</button></div><button class="seal-letter" type="button" disabled><i>絆</i><span>MANTENER PARA SELLAR</span></button></section><p class="fold-note">COMPLETA LOS TRES PLIEGUES EN ORDEN Y MANTÉN EL SELLO</p></div>`;
        case 'album': return `<div class="album"><article class="photo"><img src="../assets/documents/KTB-004.png" alt="Fotografía recuperada KTB-004"><b>Registro ${id}</b><small>POSITIVO RECUPERADO · 04</small></article><section class="album-page"><div class="album-binding" aria-hidden="true"></div><span class="album-code">PROJECT JAPAN · VOLUMEN I</span><h3>Álbum de la expedición</h3><div class="photo-slot"><img src="../assets/documents/KTB-004.png" alt=""><button type="button" data-photo-corner="1" aria-label="Fijar esquina superior izquierda"></button><button type="button" data-photo-corner="2" aria-label="Fijar esquina superior derecha"></button><button type="button" data-photo-corner="3" aria-label="Fijar esquina inferior izquierda"></button><button type="button" data-photo-corner="4" aria-label="Fijar esquina inferior derecha"></button><span>MONTAJE 04</span></div><button class="album-confirm" type="button" disabled>CATALOGAR FOTOGRAFÍA</button></section></div>`;
        case 'compare': return `<div class="compare"><section class="compare-view"><span class="compare-label original-label">ORIGINAL</span><span class="compare-label copy-label">COPIA DIGITAL</span><img src="../assets/documents/KTB-005.png" alt="Documento original"><img class="copy" src="../assets/documents/KTB-005.png" alt="Copia digital"><i class="scan-line"><b></b></i><div class="registration-marks"><i></i><i></i><i></i><i></i></div></section><section class="compare-control"><span class="control-light" aria-hidden="true"></span><small>MESA DE LUZ · SUPERPOSICIÓN</small><output>0%</output><input type="range" min="0" max="100" value="0" aria-label="Nivel de superposición"><p>Desplaza hasta alinear bordes, sellos y numeración.</p><button class="action" type="button" disabled>CONFIRMAR COINCIDENCIA</button></section></div>`;
        case 'signature': return `<div class="signature"><article class="paper sign-sheet"><span class="paper-code">${id} · DOCUMENTO OFICIAL</span><h3>Autorización de consulta</h3><canvas width="720" height="180" aria-label="Área de firma"></canvas><b>FIRMA DEL DESTINATARIO AUTORIZADO</b></article><section class="sign-controls"><div class="date-window">FECHA · REGISTRO AUTOMÁTICO</div><small>Dibuja una firma suficientemente extensa.</small><button class="action" type="button" disabled>IMPRIMIR AUTORIZACIÓN</button></section></div>`;
        case 'timeline': return `<div class="timeline"><section class="update-module"><span class="module-leds"><i></i><i></i><i></i></span><b>UPDATE</b><span>${id} · VERSIÓN 2.6</span><em>ARCHIVE CARTRIDGE</em></section><section class="timeline-track"><div class="timeline-screen"><small>PROTOCOLO DE ENLACE</small><b>0 / 3</b></div><div class="circuit-nodes"><button type="button" data-circuit-node="1"><i></i><span>ORIGEN</span></button><button type="button" data-circuit-node="2"><i></i><span>PUENTE</span></button><button type="button" data-circuit-node="3"><i></i><span>ACTUAL</span></button><svg viewBox="0 0 300 70" aria-hidden="true"><path d="M42 35H150H258"/></svg></div><strong>ACTIVA LOS NODOS EN ORDEN</strong><button class="timeline-confirm" type="button" disabled>APLICAR ACTUALIZACIÓN</button></section></div>`;
        case 'cipher': return `<div class="cipher"><section class="cipher-core"><div class="cipher-clue" aria-label="Clave recuperada 7 0 6"><span style="--tilt:-4deg">7</span><span style="--tilt:3deg">0</span><span style="--tilt:-2deg">6</span></div><i class="socket"></i><i class="cipher-block"></i><strong>NÚCLEO DE INTEGRACIÓN</strong></section><section class="keypad"><output class="display" aria-live="polite">_ _ _</output>${[1,2,3,4,5,6,7,8,9,'CLR',0,'OK'].map(key=>`<button type="button" data-key="${key}" aria-label="${key === 'CLR' ? 'Borrar clave' : key === 'OK' ? 'Validar clave' : `Introducir ${key}`}">${key}</button>`).join('')}</section></div>`;
        case 'chronology': return `<div class="chronology"><section class="chrono-packet"><small>PAQUETE TEMPORAL</small><b>${id}</b><span>ACTUALIZACIÓN</span><i></i></section><div class="chrono-selector"><button type="button" data-year-move="-1" aria-label="Año anterior">−</button><div class="year-window"><span>POSICIÓN TEMPORAL</span><output>2024</output><i></i></div><button type="button" data-year-move="1" aria-label="Año siguiente">+</button></div><div class="year-scale"><span>2024</span><span>2026</span><span>2028</span><i></i></div><button class="chronology-confirm" type="button" disabled>REGISTRAR EN 2026</button><p class="hint">AJUSTA EL SELECTOR HASTA EL AÑO AUTORIZADO</p></div>`;
        case 'integrity': return `<div class="integrity"><article class="paper integrity-doc"><span class="paper-code">CONTROL DE INTEGRIDAD · ${id}</span><h3>Informe restaurado</h3><div class="lines"></div><i class="scan"></i><span class="green-stamp">ÍNTEGRO<br>100%</span></article><section class="integrity-control"><small>RECORRE EL DOCUMENTO O COMPRUEBA LAS ZONAS EN ORDEN</small><input type="range" min="0" max="100" value="0" aria-label="Recorrido del escáner"><output>0%</output><div class="scan-points">${[1,2,3,4].map(point=>`<button type="button" data-scan-point="${point}" aria-label="Comprobar zona ${point}">ZONA ${point}</button>`).join('')}</div></section></div>`;
        case 'classify': return `<div class="classify"><article class="paper classify-card"><span class="paper-code">${id} · FICHA DE CLASIFICACIÓN</span><figure><img src="../assets/documents/KTB-011.png" alt="Vista previa del documento KTB-011"></figure><h3>Actualización recuperada</h3><span class="classification-status">CLASIFICACIÓN PENDIENTE</span></article><section class="trays"><p>SELECCIONA BANDEJA DE DESTINO</p><button class="tray correct" type="button"><span>01</span><i></i><b>AUTORIZADO</b><small>Coincidencia con expediente activo</small></button><button class="tray" type="button"><span>02</span><i></i><b>EN REVISIÓN</b><small>Requiere verificación adicional</small></button><button class="tray" type="button"><span>03</span><i></i><b>SIN VÍNCULO</b><small>No pertenece a esta secuencia</small></button></section></div>`;
        case 'datepress': return `<div class="datepress"><article class="paper act"><span class="paper-code">ACTA · ${id}</span><figure><img src="../assets/documents/KTB-012.png" alt="Vista previa del acta KTB-012"></figure><h3>Acta de reanudación</h3><span class="act-date">24 JUL 2026</span></article><section class="press"><div class="press-top"><i class="head"></i><span>FECHADORA<br><b>CENTRAL</b></span></div><i class="mouth"><span>INSERTAR ACTA</span></i><div class="press-status"><i></i><span>ESPERANDO DOCUMENTO</span></div><button class="press-insert" type="button">INTRODUCIR ACTA</button><button class="press-stamp" type="button" disabled aria-label="Mantener pulsado para accionar la fechadora">MANTENER <b>↓</b></button></section></div>`;
        default: return `<div class="validation"><section class="meters">${['COHERENCIA NARRATIVA','INTEGRIDAD DOCUMENTAL','RIESGO TEMPORAL'].map(text=>`<article class="meter"><span>${text}</span><button type="button" aria-label="Fijar ${text}"></button></article>`).join('')}</section><section class="lock-panel"><button class="lock" type="button" disabled><i></i><b>BLOQUEAR</b></button><small>FIJA LOS TRES INDICADORES Y GIRA EL BLOQUEO</small></section></div>`;
      }
    }

    paint(value) {
      this.progress = Math.max(0, Math.min(100, Math.round(value)));
      this.shadowRoot.querySelector('.fill').style.width = `${this.progress}%`;
      this.shadowRoot.querySelector('.percent').textContent = `${this.progress}%`;
      this.dispatchEvent(new CustomEvent('kizuna:progress', { detail: { value: this.progress }, bubbles: true, composed: true }));
    }

    complete() {
      if (this.done) return;
      this.done = true;
      this.paint(100);
      const success = this.shadowRoot.querySelector('.success');
      const finish = () => setTimeout(() => this.dispatchEvent(new CustomEvent('kizuna:complete', { bubbles: true, composed: true })), 950);
      if (window.gsap) {
        gsap.fromTo(success, { autoAlpha: 0 }, { autoAlpha: 1, duration: .35, onComplete: () => {
          gsap.fromTo(this.shadowRoot.querySelector('.success-mark'), { scale: 1.7, rotation: -24, opacity: 0 }, { scale: 1, rotation: -8, opacity: 1, duration: .55, ease: 'back.out(2)', onComplete: finish });
        }});
      } else {
        success.style.visibility = 'visible'; success.style.opacity = 1; finish();
      }
    }

    bind() {
      const handlers = {
        accession: () => this.bindAccession(),
        consent: () => this.bindConsent(),
        correspondence: () => this.bindCorrespondence(),
        album: () => this.bindAlbum(),
        compare: () => this.bindRange('.compare-control input', '.compare-control output', value => this.shadowRoot.querySelector('.compare-view').style.setProperty('--reveal', `${value}%`), true),
        signature: () => this.bindSignature(),
        timeline: () => this.bindTimeline(),
        cipher: () => this.bindCipher(),
        chronology: () => this.bindChronology(),
        integrity: () => this.bindIntegrity(),
        classify: () => this.bindClassify(),
        datepress: () => this.bindDatepress(),
        validation: () => this.bindValidation()
      };
      handlers[this.data.kind]?.();
    }

    bindAccession() {
      const choices = [...this.shadowRoot.querySelectorAll('[data-drawer]')];
      const confirm = this.shadowRoot.querySelector('.drawer-confirm');
      const status = this.shadowRoot.querySelector('.drawer-status');
      choices.forEach(choice => choice.onclick = () => {
        if (this.done) return;
        choices.forEach(item => item.classList.remove('is-selected', 'is-error'));
        if (choice.dataset.drawer !== '01') {
          choice.classList.add('is-error');
          status.textContent = `CAJÓN ${choice.dataset.drawer} · CLAVE NO COINCIDENTE`;
          this.paint(18);
          return;
        }
        choice.classList.add('is-selected');
        status.textContent = 'CAJÓN 01 LOCALIZADO · EXPEDIENTE PREPARADO';
        confirm.disabled = false;
        this.paint(62);
      });
      confirm.onclick = () => this.complete();
    }

    bindAlbum() {
      const corners = [...this.shadowRoot.querySelectorAll('[data-photo-corner]')];
      const confirm = this.shadowRoot.querySelector('.album-confirm');
      corners.forEach(corner => corner.onclick = () => {
        if (corner.classList.contains('is-fixed') || this.done) return;
        corner.classList.add('is-fixed');
        const fixed = corners.filter(item => item.classList.contains('is-fixed')).length;
        this.paint(fixed * 21);
        confirm.disabled = fixed !== corners.length;
      });
      confirm.onclick = () => this.complete();
    }

    bindTimeline() {
      const nodes = [...this.shadowRoot.querySelectorAll('[data-circuit-node]')];
      const screen = this.shadowRoot.querySelector('.timeline-screen b');
      const confirm = this.shadowRoot.querySelector('.timeline-confirm');
      let expected = 1;
      nodes.forEach(node => node.onclick = () => {
        if (node.classList.contains('is-active') || this.done) return;
        const order = Number(node.dataset.circuitNode);
        if (order !== expected) {
          node.classList.add('is-error');
          screen.textContent = `ERROR · NODO ${String(expected).padStart(2, '0')}`;
          setTimeout(() => node.classList.remove('is-error'), 350);
          return;
        }
        node.classList.add('is-active');
        expected += 1;
        screen.textContent = `${order} / 3`;
        this.paint(order * 25);
        if (order === 3) {
          screen.textContent = 'ENLACE PREPARADO';
          confirm.disabled = false;
        }
      });
      confirm.onclick = () => this.complete();
    }

    bindChronology() {
      const output = this.shadowRoot.querySelector('.year-window output');
      const marker = this.shadowRoot.querySelector('.year-scale i');
      const confirm = this.shadowRoot.querySelector('.chronology-confirm');
      let year = 2024;
      const paintYear = () => {
        output.textContent = year;
        marker.style.left = `${(year - 2024) / 4 * 100}%`;
        const correct = year === 2026;
        output.classList.toggle('is-correct', correct);
        confirm.disabled = !correct;
        this.paint(correct ? 78 : Math.max(12, (year - 2024) / 4 * 48));
      };
      this.shadowRoot.querySelectorAll('[data-year-move]').forEach(button => button.onclick = () => {
        year = Math.max(2024, Math.min(2028, year + Number(button.dataset.yearMove)));
        paintYear();
      });
      confirm.onclick = () => this.complete();
      paintYear();
    }

    bindConsent() {
      const checks = [...this.shadowRoot.querySelectorAll('[data-clause]')], button = this.shadowRoot.querySelector('.action');
      const update = () => { const count = checks.filter(input => input.checked).length; this.paint(count * 22); button.disabled = count !== checks.length; };
      checks.forEach(input => input.onchange = update);
      button.onclick = () => this.complete();
    }

    bindCorrespondence() {
      const letter = this.shadowRoot.querySelector('.letter');
      const steps = [...this.shadowRoot.querySelectorAll('[data-fold-step]')];
      const seal = this.shadowRoot.querySelector('.seal-letter');
      let expected = 1, timer = 0, frame = 0, started = 0;
      steps.forEach(step => step.onclick = () => {
        const order = Number(step.dataset.foldStep);
        if (order !== expected || this.done) {
          if (order !== expected) {
            step.classList.add('is-error');
            setTimeout(() => step.classList.remove('is-error'), 320);
          }
          return;
        }
        step.classList.add('is-complete');
        letter.dataset.fold = order;
        this.shadowRoot.querySelector(`[data-fold-mark="${order}"]`)?.classList.add('is-complete');
        this.paint(order * 22);
        expected += 1;
        if (order === 3) seal.disabled = false;
      });
      const stop = () => {
        clearTimeout(timer);
        cancelAnimationFrame(frame);
        seal.classList.remove('is-holding');
        if (!this.done && expected === 4) this.paint(66);
      };
      const tick = now => {
        if (!started) started = now;
        const value = Math.min(100, 66 + (now - started) / 22);
        this.paint(value);
        if (value < 100) frame = requestAnimationFrame(tick);
      };
      seal.onpointerdown = event => {
        if (seal.disabled || this.done) return;
        event.preventDefault();
        started = 0;
        seal.classList.add('is-holding');
        frame = requestAnimationFrame(tick);
        timer = setTimeout(() => this.complete(), 760);
      };
      seal.onpointerup = seal.onpointercancel = seal.onpointerleave = stop;
      seal.onkeydown = event => {
        if (!seal.disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          this.complete();
        }
      };
    }

    bindRange(inputSelector, outputSelector, paintExtra, requireButton = false) {
      const input = this.shadowRoot.querySelector(inputSelector), output = this.shadowRoot.querySelector(outputSelector), button = this.shadowRoot.querySelector('.action');
      input.oninput = () => { const value = Number(input.value); output.textContent = `${value}%`; this.paint(value * .88); paintExtra?.(value); if (button) button.disabled = value < 94; else if (value >= 98) this.complete(); };
      if (requireButton && button) button.onclick = () => this.complete();
    }

    bindSignature() {
      const canvas = this.shadowRoot.querySelector('canvas'), button = this.shadowRoot.querySelector('.action'), context = canvas.getContext('2d');
      let drawing = false, last = [0, 0], distance = 0;
      context.strokeStyle = '#8f211c'; context.lineWidth = 5; context.lineCap = 'round';
      const point = event => { const rect = canvas.getBoundingClientRect(); return [(event.clientX - rect.left) * canvas.width / rect.width, (event.clientY - rect.top) * canvas.height / rect.height]; };
      canvas.onpointerdown = event => { event.preventDefault(); drawing = true; last = point(event); canvas.setPointerCapture?.(event.pointerId); };
      canvas.onpointermove = event => { if (!drawing) return; const next = point(event); context.beginPath(); context.moveTo(...last); context.lineTo(...next); context.stroke(); distance += Math.hypot(next[0] - last[0], next[1] - last[1]); last = next; this.paint(Math.min(74, distance / 4)); button.disabled = distance < 190; };
      canvas.onpointerup = canvas.onpointercancel = () => drawing = false;
      button.onclick = () => this.complete();
    }

    bindCipher() {
      let value = ''; const display = this.shadowRoot.querySelector('.display'), block = this.shadowRoot.querySelector('.cipher-block'), core = this.shadowRoot.querySelector('.cipher-core');
      this.shadowRoot.querySelectorAll('[data-key]').forEach(button => button.onclick = () => {
        const key = button.dataset.key;
        if (key === 'CLR') value = '';
        else if (key === 'OK') {
          if (value === '706') {
            block.style.visibility = 'visible';
            if (window.gsap) gsap.fromTo(block, { autoAlpha: 0, scale: 1.8, x: 120 }, { autoAlpha: 1, scale: 1, x: 0, duration: .6, ease: 'back.out(1.6)', onComplete: () => this.complete() });
            else this.complete();
          } else { value = ''; display.animate([{ transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'none' }], { duration: 230 }); }
        } else if (value.length < 3) value += key;
        display.textContent = (value + '___').slice(0, 3).split('').join(' '); this.paint(value.length / 3 * 86);
      });
    }

    bindIntegrity() {
      const input = this.shadowRoot.querySelector('.integrity-control input'), output = this.shadowRoot.querySelector('.integrity-control output'), scan = this.shadowRoot.querySelector('.scan'), stamp = this.shadowRoot.querySelector('.green-stamp');
      const points = [...this.shadowRoot.querySelectorAll('[data-scan-point]')];
      let completedPoints = 0;
      const apply = value => {
        if (this.done) return;
        input.value = value;
        output.textContent = `${value}%`;
        scan.style.top = `${8 + value * .75}%`;
        this.paint(value);
        points.forEach((point, index) => point.classList.toggle('is-done', value >= (index + 1) * 25));
        completedPoints = Math.floor(value / 25);
        if (value >= 99) {
          stamp.style.opacity = 1;
          setTimeout(() => this.complete(), 350);
        }
      };
      input.oninput = () => apply(Number(input.value));
      points.forEach((point, index) => point.onclick = () => {
        if (index > completedPoints) {
          point.classList.add('is-error');
          setTimeout(() => point.classList.remove('is-error'), 320);
          return;
        }
        apply((index + 1) * 25);
      });
    }

    bindClassify() {
      const trays = [...this.shadowRoot.querySelectorAll('.tray')];
      trays.forEach(tray => tray.onclick = () => {
        if (tray.classList.contains('correct')) { tray.classList.add('is-chosen'); this.complete(); }
        else { tray.classList.add('is-wrong'); setTimeout(() => tray.classList.remove('is-wrong'), 320); this.paint(24); }
      });
    }

    bindDatepress() {
      const press = this.shadowRoot.querySelector('.press');
      const source = this.shadowRoot.querySelector('.act');
      const insertButton = this.shadowRoot.querySelector('.press-insert');
      const stampButton = this.shadowRoot.querySelector('.press-stamp');
      const status = this.shadowRoot.querySelector('.press-status span');
      let inserted = false, timer = 0, frame = 0, started = 0;
      const preparePress = () => {
        if (inserted) return;
        inserted = true;
        press.classList.add('is-loaded');
        insertButton.disabled = true;
        stampButton.disabled = false;
        status.textContent = 'ACTA CARGADA · FECHADORA PREPARADA';
        this.paint(55);
      };
      insertButton.onclick = () => {
        if (insertButton.disabled || this.done) return;
        preparePress();
        if (window.gsap) gsap.to(source, { y: 35, scale: .82, opacity: .35, duration: .45, ease: 'power2.in' });
      };
      const stop = () => {
        clearTimeout(timer);
        cancelAnimationFrame(frame);
        stampButton.classList.remove('is-holding');
        if (!this.done && inserted) this.paint(55);
      };
      const tick = now => {
        if (!started) started = now;
        const value = Math.min(100, 55 + (now - started) / 18);
        this.paint(value);
        if (value < 100) frame = requestAnimationFrame(tick);
      };
      stampButton.onpointerdown = event => {
        if (stampButton.disabled || this.done) return;
        event.preventDefault();
        started = 0;
        stampButton.classList.add('is-holding');
        status.textContent = 'APLICANDO FECHA · MANTÉN LA PRESIÓN';
        frame = requestAnimationFrame(tick);
        timer = setTimeout(() => {
          const head = this.shadowRoot.querySelector('.head');
          if (window.gsap) gsap.timeline().to(head, { y: 70, duration: .16, ease: 'power2.in' }).to(head, { y: 0, duration: .32, ease: 'back.out(2)', onComplete: () => this.complete() });
          else this.complete();
        }, 850);
      };
      stampButton.onpointerup = stampButton.onpointercancel = stampButton.onpointerleave = stop;
      stampButton.onkeydown = event => {
        if (stampButton.disabled || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        const head = this.shadowRoot.querySelector('.head');
        if (window.gsap) gsap.timeline().to(head, { y: 70, duration: .16, ease: 'power2.in' }).to(head, { y: 0, duration: .32, ease: 'back.out(2)', onComplete: () => this.complete() });
        else this.complete();
      };
    }

    bindValidation() {
      const meters = [...this.shadowRoot.querySelectorAll('.meter')], lock = this.shadowRoot.querySelector('.lock');
      meters.forEach(meter => meter.querySelector('button').onclick = () => { meter.classList.toggle('is-set'); const count = meters.filter(item => item.classList.contains('is-set')).length; this.paint(count * 22); lock.disabled = count !== meters.length; });
      let active = false, last = 0, rotation = 0;
      const angle = event => { const rect = lock.getBoundingClientRect(); return Math.atan2(event.clientY - rect.top - rect.height / 2, event.clientX - rect.left - rect.width / 2) * 180 / Math.PI; };
      lock.onpointerdown = event => { if (lock.disabled) return; event.preventDefault(); active = true; last = angle(event); lock.setPointerCapture?.(event.pointerId); };
      lock.onpointermove = event => { if (!active) return; const next = angle(event); let delta = next - last; if (delta > 180) delta -= 360; if (delta < -180) delta += 360; rotation = Math.max(0, rotation + delta); last = next; lock.style.transform = `rotate(${rotation}deg)`; this.paint(Math.min(98, 66 + rotation / 3)); if (rotation >= 95) { active = false; this.complete(); } };
      lock.onpointerup = lock.onpointercancel = () => active = false;
      lock.onkeydown = event => { if (!lock.disabled && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); this.complete(); } };
    }
  }

  if (!customElements.get('kizuna-confirmation-protocol')) customElements.define('kizuna-confirmation-protocol', KizunaConfirmationProtocol);
})();
