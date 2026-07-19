(() => {
  'use strict';

  const DOCUMENTS = {
    'KTB-001': { kind: 'accession', title: 'Apertura del expediente maestro', result: 'SECUENCIA INICIADA' },
    'KTB-002': { kind: 'consent', title: 'Registro de conformidad', result: 'CONDICIONES ACEPTADAS' },
    'KTB-003': { kind: 'correspondence', title: 'Custodia de correspondencia', result: 'CARTA CUSTODIADA' },
    'KTB-004': { kind: 'album', title: 'Incorporación al álbum', result: 'FOTOGRAFÍA CATALOGADA' },
    'KTB-005': { kind: 'compare', title: 'Cotejo documental', result: 'COPIA VERIFICADA' },
    'KTB-006': { kind: 'signature', title: 'Autorización de consulta', result: 'AUTORIZACIÓN FIRMADA' },
    'KTB-007': { kind: 'timeline', title: 'Aplicación de actualización', result: 'VERSIÓN ACTUALIZADA' },
    'KTB-008': { kind: 'cipher', title: 'Integración del bloque cifrado', result: 'BLOQUE INTEGRADO' },
    'KTB-009': { kind: 'chronology', title: 'Ordenación cronológica', result: 'CRONOLOGÍA REGISTRADA' },
    'KTB-010': { kind: 'integrity', title: 'Certificación de integridad', result: 'INTEGRIDAD CERTIFICADA' },
    'KTB-011': { kind: 'classify', title: 'Clasificación documental', result: 'DOCUMENTO AUTORIZADO' },
    'KTB-012': { kind: 'datepress', title: 'Cierre del acta de reanudación', result: 'ACTA FECHADA' },
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

    @keyframes spin{to{rotate:360deg}}@keyframes shake{25%{translate:-6px}50%{translate:6px}75%{translate:-3px}}
    @media(max-width:680px){.console{min-height:0}header{padding:8px 10px}.eyebrow{font-size:6px}header h2{margin-top:2px;font-size:20px}.node{display:none}.stage{min-height:0;padding:8px 8px 34px}.accession,.consent,.correspondence,.album,.compare,.signature,.timeline,.cipher,.classify,.datepress,.validation{grid-template-columns:1fr;gap:8px}.index-card,.letter,.photo,.update-module,.classify-card,.act{justify-self:center}.index-card{width:180px;min-height:112px;padding:14px}.index-card b{margin:18px 0 8px;font-size:22px}.master-file{min-height:142px;padding:12px}.master-file:before,.master-file:after{height:31px;margin-bottom:8px}.clauses{min-height:150px;padding:13px}.clauses h3{margin:7px 0 10px}.clause-list{gap:6px}.consent-panel{gap:7px;padding:10px}.consent-panel label{padding:7px}.sleeve{min-height:135px}.letter{width:160px;min-height:125px;padding:15px}.letter h3{margin:14px 0 8px}.album{gap:7px}.photo{width:145px;padding:7px 7px 19px}.album-page{min-height:145px;padding:12px}.compare-view{min-height:160px}.compare-control{grid-template-columns:1fr auto;padding:9px;gap:7px}.signature{gap:7px}.sign-sheet{min-height:160px;padding:13px}.sign-sheet h3{margin:7px 0 9px}.sign-sheet canvas{height:75px}.timeline{grid-template-columns:110px 1fr;gap:8px}.update-module{width:105px;height:90px}.update-module b{margin-top:22px;font-size:17px}.timeline-track{min-height:135px}.cipher{grid-template-columns:1fr 1fr}.cipher-core{min-height:145px}.cipher-core:before{width:120px;height:120px}.cipher-core:after{width:82px;height:82px}.keypad{gap:4px;padding:7px}.keypad button{min-height:29px}.display{padding:7px;font-size:16px}.chronology{padding-top:0}.date-cards{grid-template-columns:repeat(3,1fr);gap:5px}.date-card{min-height:70px;padding:8px}.date-card span{margin-top:9px;font-size:13px}.chrono-packet{position:relative;left:auto;top:auto;width:100%;margin-bottom:6px}.integrity{grid-template-columns:1fr}.integrity-doc{min-height:160px}.classify{grid-template-columns:135px 1fr}.classify-card{width:130px;min-height:105px;padding:12px}.datepress{grid-template-columns:130px 1fr;gap:8px}.act{width:125px;min-height:110px;padding:12px}.act h3{margin:13px 0 7px}.press{min-height:145px}.press .head{height:55px}.press button{height:55px}.validation{grid-template-columns:1fr 115px;gap:7px}.meter{min-height:44px;padding:7px}.lock{width:92px;height:92px}.lock i{height:34px;transform-origin:50% 37px}.success-mark{width:100px;height:100px}.success strong{margin-top:10px;font-size:26px}.readout{left:9px;right:9px;bottom:9px;grid-template-columns:1fr auto}}
    @media(max-height:620px) and (orientation:landscape){.console{min-height:410px}.stage{min-height:305px;padding-top:10px}.accession,.consent,.correspondence,.album,.compare,.signature,.timeline,.cipher,.classify,.datepress,.validation{grid-template-columns:1fr 1fr}.master-file,.clauses,.sleeve,.album-page,.compare-view,.sign-sheet,.timeline-track,.cipher-core,.press{min-height:210px}.success-mark{width:105px;height:105px}}
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
          <header><div><span class="eyebrow">REGISTRO DE LECTURA · ${this.documentId}</span><h2 class="heading">${this.data.title}</h2></div><div class="node">ARCHIVO CENTRAL<b>${this.documentId.slice(-3)} / CONFIRM</b></div></header>
          <div class="stage">${this.scene()}</div>
          <div class="readout"><i class="track"><b class="fill"></b></i><span class="percent">0%</span></div>
          <div class="success"><div><div class="success-mark"><b>${this.data.result}</b></div><strong>Lectura registrada</strong><small>${this.documentId} · ARCHIVO CENTRAL</small></div></div>
        </section>`;
    }

    scene() {
      const id = this.documentId;
      switch (this.data.kind) {
        case 'accession': return `<div class="accession"><article class="index-card" tabindex="0"><span>FICHA DE ALTA · ${id}</span><b>Expediente recuperado</b><span>DESTINATARIO AUTORIZADO</span></article><section class="master-file"><i class="slot"></i><strong>EXPEDIENTE MAESTRO · RANURA 01</strong></section></div>`;
        case 'consent': return `<div class="consent"><article class="paper clauses"><span class="paper-code">KTB/CUSTODIA/02</span><h3>Condiciones de consulta</h3><div class="clause-list"><span><i></i>Uso exclusivo del destinatario autorizado.</span><span><i></i>Custodia documental y trazabilidad.</span><span><i></i>Registro de actividad en el Archivo Central.</span></div></article><section class="consent-panel">${['IDENTIDAD VERIFICADA','CUSTODIA ACEPTADA','REGISTRO AUTORIZADO'].map((text,index)=>`<label><input type="checkbox" data-clause="${index}">${text}</label>`).join('')}<button class="action" type="button" disabled>REGISTRAR CONFORMIDAD</button></section></div>`;
        case 'correspondence': return `<div class="correspondence"><article class="paper letter" tabindex="0"><span class="paper-code">CORRESPONDENCIA · ${id}</span><h3>Carta personal recuperada</h3><div class="lines"></div><i class="fold"></i></article><section class="sleeve"><i class="cord"></i><strong>FUNDA DE CUSTODIA</strong></section><p class="fold-note">PULSA LA CARTA PARA DOBLARLA Y DESPUÉS ARRASTRA HASTA LA FUNDA</p></div>`;
        case 'album': return `<div class="album"><article class="photo" tabindex="0"><img src="../assets/kyoto-hero.png" alt="Fotografía recuperada de Japón"><b>Registro ${id}</b></article><section class="album-page"><h3>Álbum de la expedición</h3><div class="photo-slot">HUECO 04 · COLOCAR FOTOGRAFÍA</div></section></div>`;
        case 'compare': return `<div class="compare"><section class="compare-view"><img src="../assets/documents/KTB-005.png" alt="Documento original"><img class="copy" src="../assets/documents/KTB-005.png" alt="Copia digital"><i class="scan-line"></i></section><section class="compare-control"><small>SUPERPONER ORIGINAL Y COPIA</small><input type="range" min="0" max="100" value="0" aria-label="Nivel de superposición"><output>0%</output><button class="action" type="button" disabled>VALIDAR COINCIDENCIA</button></section></div>`;
        case 'signature': return `<div class="signature"><article class="paper sign-sheet"><span class="paper-code">${id} · DOCUMENTO OFICIAL</span><h3>Autorización de consulta</h3><canvas width="720" height="180" aria-label="Área de firma"></canvas><b>FIRMA DEL DESTINATARIO AUTORIZADO</b></article><section class="sign-controls"><div class="date-window">FECHA · REGISTRO AUTOMÁTICO</div><small>Dibuja una firma suficientemente extensa.</small><button class="action" type="button" disabled>IMPRIMIR AUTORIZACIÓN</button></section></div>`;
        case 'timeline': return `<div class="timeline"><button class="update-module" type="button"><b>UPDATE</b><span>${id} · VERSIÓN 2.6</span></button><section class="timeline-track"><i></i><i></i><i></i><strong>DESTINO · VERSIÓN ACTUAL</strong></section></div>`;
        case 'cipher': return `<div class="cipher"><section class="cipher-core"><i class="socket"></i><i class="cipher-block"></i><strong>NÚCLEO DE INTEGRACIÓN</strong></section><section class="keypad"><output class="display">_ _ _</output>${[1,2,3,4,5,6,7,8,9,'CLR',0,'OK'].map(key=>`<button type="button" data-key="${key}">${key}</button>`).join('')}</section></div>`;
        case 'chronology': return `<div class="chronology"><button class="chrono-packet" type="button">${id}<br>ACTUALIZACIÓN</button><div class="date-cards"><article class="date-card"><b>2024</b><span>Archivo inicial</span></article><article class="date-card target"><b>2026</b><span>POSICIÓN AUTORIZADA</span></article><article class="date-card"><b>2028</b><span>Registro futuro</span></article></div><p class="hint">ARRASTRA LA ACTUALIZACIÓN HASTA SU POSICIÓN TEMPORAL</p></div>`;
        case 'integrity': return `<div class="integrity"><article class="paper integrity-doc"><span class="paper-code">CONTROL DE INTEGRIDAD · ${id}</span><h3>Informe restaurado</h3><div class="lines"></div><i class="scan"></i><span class="green-stamp">ÍNTEGRO<br>100%</span></article><section class="integrity-control"><small>DESPLAZA EL ESCÁNER POR TODO EL DOCUMENTO</small><input type="range" min="0" max="100" value="0" aria-label="Recorrido del escáner"><output>0%</output></section></div>`;
        case 'classify': return `<div class="classify"><article class="paper classify-card"><span class="paper-code">${id}</span><h3>Actualización recuperada</h3><div class="lines"></div></article><section class="trays"><button class="tray correct" type="button"><b>AUTORIZADO</b><small>Coincidencia de expediente confirmada</small></button><button class="tray" type="button"><b>PENDIENTE</b><small>Requiere revisión adicional</small></button><button class="tray" type="button"><b>DESCARTADO</b><small>Sin relación documental</small></button></section></div>`;
        case 'datepress': return `<div class="datepress"><article class="paper act" tabindex="0"><span class="paper-code">ACTA · ${id}</span><h3>Reanudación del sistema</h3><div class="lines"></div></article><section class="press"><i class="head"></i><i class="mouth"></i><button type="button" disabled aria-label="Accionar fechadora">↓</button></section></div>`;
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
        accession: () => this.bindDrag('.index-card', '.master-file'),
        consent: () => this.bindConsent(),
        correspondence: () => this.bindCorrespondence(),
        album: () => this.bindDrag('.photo', '.album-page'),
        compare: () => this.bindRange('.compare-control input', '.compare-control output', value => this.shadowRoot.querySelector('.compare-view').style.setProperty('--reveal', `${value}%`), true),
        signature: () => this.bindSignature(),
        timeline: () => this.bindDrag('.update-module', '.timeline-track'),
        cipher: () => this.bindCipher(),
        chronology: () => this.bindDrag('.chrono-packet', '.date-card.target'),
        integrity: () => this.bindIntegrity(),
        classify: () => this.bindClassify(),
        datepress: () => this.bindDatepress(),
        validation: () => this.bindValidation()
      };
      handlers[this.data.kind]?.();
    }

    bindDrag(sourceSelector, targetSelector, onDrop) {
      const source = this.shadowRoot.querySelector(sourceSelector);
      const target = this.shadowRoot.querySelector(targetSelector);
      let active = false, x = 0, y = 0, startX = 0, startY = 0;
      const reset = () => {
        x = 0; y = 0; target.classList.remove('is-ready');
        if (window.gsap) gsap.to(source, { x: 0, y: 0, rotation: 0, scale: 1, duration: .35, ease: 'power2.out' });
        else source.style.transform = '';
      };
      const overlaps = () => { const a = source.getBoundingClientRect(), b = target.getBoundingClientRect(); return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; };
      source.onpointerdown = event => { if (this.done) return; event.preventDefault(); active = true; startX = event.clientX - x; startY = event.clientY - y; source.setPointerCapture?.(event.pointerId); };
      source.onpointermove = event => { if (!active) return; event.preventDefault(); x = event.clientX - startX; y = event.clientY - startY; source.style.transform = `translate(${x}px,${y}px) rotate(${x / 22}deg)`; target.classList.toggle('is-ready', overlaps()); this.paint(Math.min(86, (Math.abs(x) + Math.abs(y)) / 4)); };
      source.onpointerup = source.onpointercancel = () => {
        if (!active) return; active = false;
        if (!overlaps()) return reset();
        this.paint(100); onDrop?.();
        const a = source.getBoundingClientRect(), b = target.getBoundingClientRect();
        if (window.gsap) gsap.to(source, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: .25, rotation: 0, opacity: 0, duration: .55, ease: 'power2.in', onComplete: () => this.complete() });
        else this.complete();
      };
      source.onkeydown = event => { if ((event.key === 'Enter' || event.key === ' ') && !this.done) { event.preventDefault(); this.complete(); } };
    }

    bindConsent() {
      const checks = [...this.shadowRoot.querySelectorAll('[data-clause]')], button = this.shadowRoot.querySelector('.action');
      const update = () => { const count = checks.filter(input => input.checked).length; this.paint(count * 22); button.disabled = count !== checks.length; };
      checks.forEach(input => input.onchange = update);
      button.onclick = () => this.complete();
    }

    bindCorrespondence() {
      const letter = this.shadowRoot.querySelector('.letter'); let folded = false;
      const fold = () => { if (folded) return; folded = true; letter.classList.add('is-folded'); this.paint(35); };
      letter.onclick = fold; letter.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fold(); } };
      this.bindDrag('.letter', '.sleeve', () => this.paint(100));
      const dragPointerDown = letter.onpointerdown;
      letter.onpointerdown = event => { if (!folded) { event.preventDefault(); fold(); return; } dragPointerDown(event); };
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
      input.oninput = () => { const value = Number(input.value); output.textContent = `${value}%`; scan.style.top = `${8 + value * .75}%`; this.paint(value); if (value >= 99) { stamp.style.opacity = 1; setTimeout(() => this.complete(), 350); } };
    }

    bindClassify() {
      const trays = [...this.shadowRoot.querySelectorAll('.tray')];
      trays.forEach(tray => tray.onclick = () => {
        if (tray.classList.contains('correct')) { tray.classList.add('is-chosen'); this.complete(); }
        else { tray.classList.add('is-wrong'); setTimeout(() => tray.classList.remove('is-wrong'), 320); this.paint(24); }
      });
    }

    bindDatepress() {
      const button = this.shadowRoot.querySelector('.press button');
      this.bindDrag('.act', '.press', () => { button.disabled = false; this.paint(75); });
      button.onclick = () => {
        if (button.disabled) return;
        const head = this.shadowRoot.querySelector('.head');
        if (window.gsap) gsap.timeline().to(head, { y: 70, duration: .16, ease: 'power2.in' }).to(head, { y: 0, duration: .32, ease: 'back.out(2)', onComplete: () => this.complete() });
        else this.complete();
      };
      /* bindDrag completa por defecto; para este protocolo interceptamos la primera culminación. */
      const originalComplete = this.complete.bind(this); let inserted = false;
      this.complete = () => { if (!inserted) { inserted = true; button.disabled = false; this.paint(76); return; } originalComplete(); };
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
