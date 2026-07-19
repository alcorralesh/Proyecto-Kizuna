(() => {
  'use strict';

  if (customElements.get('kizuna-auth-reader')) return;

  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host{display:block;--ink:#d9cfb5;--cream:#eee4ca;--red:#a82822;--gold:#d6b85d;--green:#73a47b;--panel:#081913;color:var(--ink);font-family:"DM Mono",monospace}
      *{box-sizing:border-box}
      .console{position:relative;overflow:hidden;min-height:430px;border:1px solid #567066;background:
        linear-gradient(rgba(214,184,93,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(214,184,93,.045) 1px,transparent 1px),
        radial-gradient(circle at 78% 22%,rgba(214,184,93,.12),transparent 26%),#071711;background-size:38px 38px,38px 38px,auto,auto;box-shadow:inset 0 0 0 7px rgba(4,14,11,.7),0 22px 50px rgba(0,0,0,.25)}
      .console::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(100deg,transparent 38%,rgba(255,255,255,.035) 50%,transparent 62%);transform:translateX(-100%);animation:sweep 5s linear infinite}
      header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 24px;border-bottom:1px solid #41574f;background:rgba(4,17,13,.76)}
      .eyebrow,.status-label{display:block;color:var(--gold);font-size:10px;letter-spacing:.18em;text-transform:uppercase}
      h2{margin:6px 0 0;color:var(--cream);font:600 clamp(22px,3vw,36px)/1 "EB Garamond",serif}
      .node{text-align:right;color:#8ea299;font-size:10px;line-height:1.6}.node b{display:block;color:var(--cream);font-size:13px;letter-spacing:.08em}
      .workspace{position:relative;display:grid;grid-template-columns:minmax(230px,.82fr) minmax(310px,1.18fr);align-items:center;gap:clamp(26px,6vw,86px);min-height:304px;padding:32px clamp(28px,5vw,70px) 52px}
      .workspace::after{content:"";position:absolute;left:25%;right:24%;top:50%;height:2px;background:linear-gradient(90deg,var(--gold),rgba(214,184,93,.16));box-shadow:0 0 12px rgba(214,184,93,.35);z-index:0}
      .card-wrap{position:relative;z-index:4;width:min(100%,315px);justify-self:center;cursor:grab;touch-action:none;user-select:none;filter:drop-shadow(0 18px 15px rgba(0,0,0,.38));will-change:transform}
      .card-wrap:active{cursor:grabbing}.card-wrap:focus-visible{outline:3px solid var(--gold);outline-offset:5px}
      .card-wrap svg,.reader svg{display:block;width:100%;height:auto}
      .reader{position:relative;z-index:2;width:min(100%,410px);justify-self:center;filter:drop-shadow(0 20px 20px rgba(0,0,0,.44))}
      .reader-glow{position:absolute;inset:22% 12%;border-radius:50%;background:rgba(214,184,93,.08);filter:blur(22px);transition:.3s}
      .progress{position:absolute;left:24px;right:24px;bottom:18px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;font-size:9px;letter-spacing:.12em;color:#91a69d}
      .track{height:4px;background:#233a32;overflow:hidden}.fill{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--gold),var(--red));box-shadow:0 0 12px var(--gold)}
      .percent{min-width:36px;color:var(--gold);font-weight:700}
      .reader.is-hover .reader-glow{background:rgba(214,184,93,.24)}
      .reader.is-valid .reader-glow{background:rgba(115,164,123,.36)}
      .reader.is-valid [data-led="ready"]{fill:#73a47b;filter:drop-shadow(0 0 5px #73a47b)}
      .reader.is-valid [data-screen]{fill:#153b27}.reader.is-valid [data-status]{fill:#b9e29e}
      .success{position:absolute;inset:0;z-index:8;display:grid;place-items:center;pointer-events:none;background:rgba(4,16,12,.88);opacity:0;visibility:hidden}
      .success>div{text-align:center}.success svg{width:92px;filter:drop-shadow(0 0 20px rgba(214,184,93,.4))}
      .success strong{display:block;margin-top:14px;color:var(--cream);font:600 28px "EB Garamond",serif}.success span{display:block;margin-top:7px;color:var(--green);font-size:10px;letter-spacing:.18em}
      .console.is-complete .success{visibility:visible}
      @keyframes sweep{to{transform:translateX(100%)}}
      @media (max-width:620px){
        .console{min-height:0}header{padding:9px 12px}.eyebrow{font-size:7px}h2{margin-top:3px;font-size:23px}.node{display:none}
        .workspace{grid-template-columns:1fr;grid-template-rows:132px 158px;gap:5px;min-height:330px;padding:9px 18px 37px}
        .workspace::after{left:50%;right:auto;top:37%;width:2px;height:22%;background:linear-gradient(var(--gold),rgba(214,184,93,.15))}
        .card-wrap{width:min(60vw,205px)}.reader{width:min(76vw,272px)}
        .progress{left:12px;right:12px;bottom:10px;gap:8px}.progress>span:first-child{display:none}
      }
      @media (prefers-reduced-motion:reduce){.console::before{animation:none}}
    </style>
    <section class="console" aria-label="Lector de credenciales KIZUNA">
      <header>
        <div><span class="eyebrow">Protocolo de acceso · KTB-006</span><h2>Validación de credencial</h2></div>
        <div class="node">NODO AUTORIZADO<b>TOKYO-AUTH-06</b></div>
      </header>
      <div class="workspace">
        <div class="card-wrap" role="button" tabindex="0" aria-label="Arrastra la credencial hasta el lector">
          <svg viewBox="0 0 420 250" role="img" aria-label="Tarjeta de autorización KIZUNA">
            <defs><linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f4ead1"/><stop offset="1" stop-color="#d9c9a5"/></linearGradient><pattern id="lines" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0 16L16 0" stroke="#8f1d1a" stroke-opacity=".06"/></pattern></defs>
            <rect x="5" y="5" width="410" height="240" rx="8" fill="url(#card)" stroke="#b49457" stroke-width="2"/>
            <rect x="13" y="13" width="394" height="224" rx="4" fill="url(#lines)" stroke="#8f1d1a" stroke-opacity=".45"/>
            <path d="M42 44h92M42 50h68" stroke="#8f1d1a"/><text x="42" y="34" fill="#8f1d1a" font-size="12" font-family="monospace" letter-spacing="3">KIZUNA</text>
            <g transform="translate(42 74)" fill="none" stroke="#8f1d1a" stroke-width="5"><path d="M0 4h74M11 4v13h52V4M18 17v52M56 17v52M10 30h54"/><path d="M7 69h60" stroke-width="3"/></g>
            <rect x="157" y="72" width="62" height="49" rx="7" fill="#d8b85e" stroke="#7d6526"/><path d="M157 89h62M178 72v49M198 72v49" stroke="#7d6526"/>
            <text x="157" y="147" fill="#26332d" font-size="10" font-family="monospace" letter-spacing="2">AUTORIZACIÓN TEMPORAL</text>
            <text x="157" y="172" fill="#101b17" font-size="20" font-family="serif" font-weight="700">DESTINATARIO AUTORIZADO</text>
            <text x="157" y="194" fill="#8f1d1a" font-size="11" font-family="monospace">KTB-006 · NIVEL VI</text>
            <g fill="#1a2722"><rect x="42" y="207" width="3" height="18"/><rect x="49" y="207" width="7" height="18"/><rect x="60" y="207" width="2" height="18"/><rect x="67" y="207" width="5" height="18"/><rect x="77" y="207" width="2" height="18"/><rect x="83" y="207" width="9" height="18"/><rect x="97" y="207" width="3" height="18"/><rect x="106" y="207" width="6" height="18"/></g>
            <text x="310" y="220" fill="#8f1d1a" font-size="10" font-family="monospace">JP-AUTH-006</text>
          </svg>
        </div>
        <div class="reader" aria-label="Lector de autorización">
          <span class="reader-glow"></span>
          <svg viewBox="0 0 520 300" role="img">
            <defs><linearGradient id="metal" x1="0" x2="1"><stop stop-color="#172c25"/><stop offset=".5" stop-color="#2c443b"/><stop offset="1" stop-color="#10221c"/></linearGradient></defs>
            <path d="M35 30h450l20 30v205H15V60z" fill="url(#metal)" stroke="#71877e" stroke-width="2"/>
            <path d="M72 70h376l20 34-20 34H72l-20-34z" fill="#020907" stroke="#c5a84f" stroke-width="3"/>
            <rect x="102" y="91" width="316" height="26" rx="8" fill="#000" stroke="#5f6b66"/>
            <path d="M116 104h286" stroke="#d6b85d" stroke-width="2" stroke-dasharray="6 9"/>
            <rect x="82" y="166" width="356" height="62" rx="4" data-screen fill="#071a13" stroke="#587065"/>
            <text x="108" y="188" fill="#7f968c" font-size="10" font-family="monospace" letter-spacing="2">KIZUNA ACCESS READER</text>
            <text x="108" y="213" data-status fill="#d6b85d" font-size="17" font-family="monospace">ESPERANDO CREDENCIAL</text>
            <circle cx="461" cy="197" r="9" data-led="ready" fill="#a82822"/><circle cx="461" cy="225" r="5" fill="#d6b85d"/>
            <path d="M34 250h452" stroke="#70847c"/><text x="80" y="275" fill="#91a59c" font-size="10" font-family="monospace">ISO 7816 · SECURE TEMPORAL LINK</text>
          </svg>
        </div>
      </div>
      <div class="progress"><span>DESLIZA LA CREDENCIAL HASTA LA RANURA</span><i class="track"><b class="fill"></b></i><span class="percent">0%</span></div>
      <div class="success" aria-live="polite"><div><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#d6b85d"/><path d="M27 52l15 15 32-36" fill="none" stroke="#73a47b" stroke-width="7"/></svg><strong>Credencial validada</strong><span>ACCESO TEMPORAL CONCEDIDO</span></div></div>
    </section>`;

  class KizunaAuthReader extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode:'open'}).append(template.content.cloneNode(true));
      this.complete = false;
      this.dragging = false;
      this.offset = {x:0,y:0};
      this.position = {x:0,y:0};
    }

    connectedCallback() {
      this.card = this.shadowRoot.querySelector('.card-wrap');
      this.reader = this.shadowRoot.querySelector('.reader');
      this.console = this.shadowRoot.querySelector('.console');
      this.fill = this.shadowRoot.querySelector('.fill');
      this.percent = this.shadowRoot.querySelector('.percent');
      this.card.addEventListener('pointerdown', this.onDown);
      this.card.addEventListener('pointermove', this.onMove);
      this.card.addEventListener('pointerup', this.onUp);
      this.card.addEventListener('pointercancel', this.onUp);
      this.card.addEventListener('keydown', this.onKey);
      this.animateIn();
    }

    disconnectedCallback() {
      this.card?.removeEventListener('pointerdown', this.onDown);
      this.card?.removeEventListener('pointermove', this.onMove);
      this.card?.removeEventListener('pointerup', this.onUp);
      this.card?.removeEventListener('pointercancel', this.onUp);
      this.card?.removeEventListener('keydown', this.onKey);
    }

    motion(target, vars) {
      if (window.gsap) return window.gsap.to(target, vars);
      const {duration=.45, ease='ease-out', ...styles}=vars;
      const keyframes = {};
      Object.entries(styles).forEach(([key,value]) => {
        if (key === 'x') keyframes.transform = `translate3d(${value}px,0,0)`;
        else if (key !== 'onComplete') keyframes[key] = value;
      });
      const animation = target.animate(keyframes,{duration:duration*1000,easing:ease==='power2.out'?'cubic-bezier(.22,.61,.36,1)':ease,fill:'forwards'});
      animation.onfinish = vars.onComplete || null;
      return animation;
    }

    animateIn() {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      if (window.gsap) {
        window.gsap.from(this.card,{x:-36,autoAlpha:0,duration:.65,ease:'power2.out'});
        window.gsap.from(this.reader,{x:42,autoAlpha:0,duration:.65,delay:.12,ease:'power2.out'});
      } else {
        this.card.animate([{transform:'translateX(-36px)',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:650,easing:'ease-out'});
        this.reader.animate([{transform:'translateX(42px)',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:650,delay:120,easing:'ease-out'});
      }
    }

    onDown = event => {
      if (this.complete) return;
      event.preventDefault();
      this.dragging = true;
      this.offset.x = event.clientX - this.position.x;
      this.offset.y = event.clientY - this.position.y;
      this.card.setPointerCapture?.(event.pointerId);
    };

    onMove = event => {
      if (!this.dragging || this.complete) return;
      event.preventDefault();
      this.position.x = event.clientX - this.offset.x;
      this.position.y = event.clientY - this.offset.y;
      this.card.style.transform = `translate3d(${this.position.x}px,${this.position.y}px,0)`;
      const cardRect = this.card.getBoundingClientRect();
      const readerRect = this.reader.getBoundingClientRect();
      const horizontal = Math.max(0,Math.min(1,(cardRect.right-readerRect.left)/(Math.min(cardRect.width,readerRect.width)*.72)));
      const vertical = Math.max(0,Math.min(1,(cardRect.bottom-readerRect.top)/(Math.min(cardRect.height,readerRect.height)*.72)));
      const progress = innerWidth <= 620 ? vertical : horizontal;
      this.paintProgress(progress);
      const overlaps = cardRect.left < readerRect.right && cardRect.right > readerRect.left && cardRect.top < readerRect.bottom && cardRect.bottom > readerRect.top;
      this.reader.classList.toggle('is-hover',overlaps);
    };

    onUp = () => {
      if (!this.dragging || this.complete) return;
      this.dragging = false;
      const cardRect = this.card.getBoundingClientRect();
      const readerRect = this.reader.getBoundingClientRect();
      const overlaps = cardRect.left < readerRect.right && cardRect.right > readerRect.left && cardRect.top < readerRect.bottom && cardRect.bottom > readerRect.top;
      if (overlaps) this.validate();
      else this.resetCard();
    };

    onKey = event => {
      if ((event.key === 'Enter' || event.key === ' ') && !this.complete) {
        event.preventDefault();
        this.validate();
      }
    };

    paintProgress(value) {
      const percentage = Math.round(value*100);
      this.fill.style.width = `${percentage}%`;
      this.percent.textContent = `${percentage}%`;
      this.dispatchEvent(new CustomEvent('kizuna:progress',{detail:{value:percentage},bubbles:true,composed:true}));
    }

    resetCard() {
      this.reader.classList.remove('is-hover');
      this.position = {x:0,y:0};
      this.paintProgress(0);
      if (window.gsap) window.gsap.to(this.card,{x:0,y:0,duration:.38,ease:'power2.out',clearProps:'transform'});
      else this.card.animate([{transform:this.card.style.transform},{transform:'translate3d(0,0,0)'}],{duration:380,easing:'ease-out'}).onfinish=()=>this.card.style.transform='';
    }

    validate() {
      if (this.complete) return;
      this.complete = true;
      this.dragging = false;
      const cardRect = this.card.getBoundingClientRect();
      const readerRect = this.reader.getBoundingClientRect();
      const dx = readerRect.left + readerRect.width/2 - (cardRect.left + cardRect.width/2);
      const dy = readerRect.top + readerRect.height*.34 - (cardRect.top + cardRect.height/2);
      this.reader.classList.remove('is-hover');
      this.paintProgress(100);
      const done = () => {
        this.reader.classList.add('is-valid');
        this.console.classList.add('is-complete');
        const success = this.shadowRoot.querySelector('.success');
        if (window.gsap) window.gsap.to(success,{autoAlpha:1,duration:.32,ease:'power2.out'});
        else success.animate([{opacity:0},{opacity:1}],{duration:320,fill:'forwards'});
        setTimeout(() => this.dispatchEvent(new CustomEvent('kizuna:complete',{bubbles:true,composed:true})),850);
      };
      if (window.gsap) window.gsap.to(this.card,{x:`+=${dx}`,y:`+=${dy}`,scale:.64,autoAlpha:.15,duration:.55,ease:'power2.inOut',onComplete:done});
      else {
        const animation=this.card.animate([{transform:this.card.style.transform,opacity:1},{transform:`translate3d(${this.position.x+dx}px,${this.position.y+dy}px,0) scale(.64)`,opacity:.15}],{duration:550,easing:'ease-in-out',fill:'forwards'});
        animation.onfinish=done;
      }
    }
  }

  customElements.define('kizuna-auth-reader',KizunaAuthReader);
})();
