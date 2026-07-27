import { MAU_CONFIG } from './mau-config.js?v=20260727-mau04';

const ASSETS = Object.freeze({
  peek: new URL('./assets/sprites/mau-peek.webp', import.meta.url).href,
  guide: new URL('./assets/sprites/mau-guide.webp', import.meta.url).href,
  leave: new URL('./assets/sprites/mau-leave.webp', import.meta.url).href
});

const wait = duration => new Promise(resolve => window.setTimeout(resolve, duration));

class KizunaMau extends HTMLElement {
  #scene;
  #character;
  #bubble;
  #closeButton;
  #started = false;
  #closing = false;
  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  #abortController = new AbortController();
  #layoutObserver;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('./mau.css?v=20260727-mau04', import.meta.url).href;

    this.#scene = document.createElement('section');
    this.#scene.className = 'scene';
    this.#scene.setAttribute('aria-label', 'Mau, mascota de KIZUNA');
    this.#scene.innerHTML = `
      <img class="character" alt="" aria-hidden="true" draggable="false">
      <aside class="bubble" role="status" aria-live="polite" hidden>
        <button class="close" type="button" aria-label="Cerrar mensaje de Mau">×</button>
        <small class="eyebrow"></small>
        <span class="message"></span>
      </aside>`;

    shadow.append(stylesheet, this.#scene);
    this.#character = this.#scene.querySelector('.character');
    this.#bubble = this.#scene.querySelector('.bubble');
    this.#closeButton = this.#scene.querySelector('.close');
    this.#bubble.querySelector('.eyebrow').textContent = MAU_CONFIG.message.eyebrow;
    this.#bubble.querySelector('.message').textContent = MAU_CONFIG.message.text;
  }

  connectedCallback() {
    this.hidden = true;
    this.#closeButton.addEventListener('click', () => this.close(), {
      signal: this.#abortController.signal
    });
    for (const source of Object.values(ASSETS)) {
      const image = new Image();
      image.src = source;
    }
    this.#layoutObserver = new MutationObserver(() => this.#syncExternalLayout());
    this.#layoutObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class']
    });
    this.#syncExternalLayout();
  }

  disconnectedCallback() {
    this.#abortController.abort();
    this.#layoutObserver?.disconnect();
  }

  async show() {
    if (this.#started || !MAU_CONFIG.enabled) return;
    this.#started = true;
    this.hidden = false;

    if (this.#reducedMotion) {
      this.#setPose('guide', 'is-guiding');
      this.#showBubble();
      return;
    }

    this.#setPose('peek', 'is-peeking');
    await wait(MAU_CONFIG.timings.peek);
    if (this.#closing) return;

    this.#scene.className = 'scene is-changing';
    await wait(MAU_CONFIG.timings.transition);
    if (this.#closing) return;

    this.#setPose('guide', 'is-guiding');
    this.#showBubble();
    await wait(MAU_CONFIG.timings.message);
    if (!this.#closing) await this.close();
  }

  async close() {
    if (this.#closing || this.hidden) return;
    this.#closing = true;
    this.#bubble.classList.remove('is-visible');
    this.#bubble.setAttribute('aria-hidden', 'true');

    if (this.#reducedMotion) {
      this.hidden = true;
      return;
    }

    this.#setPose('leave', 'is-leaving');
    await wait(MAU_CONFIG.timings.leave);
    this.hidden = true;
  }

  #setPose(name, stateClass) {
    this.#scene.className = `scene ${stateClass}`;
    this.#character.src = ASSETS[name];
  }

  #showBubble() {
    this.#bubble.hidden = false;
    this.#bubble.removeAttribute('aria-hidden');
    requestAnimationFrame(() => this.#bubble.classList.add('is-visible'));
  }

  #syncExternalLayout() {
    this.toggleAttribute(
      'data-install-visible',
      Boolean(document.querySelector('.kizuna-pwa-install.is-compact'))
    );
  }
}

if (!customElements.get('kizuna-mau')) {
  customElements.define('kizuna-mau', KizunaMau);
}

const pageIsBusy = () => Boolean(document.querySelector(
  'dialog[open], .recipient-message-notice.visible, .kizuna-pwa-sheet, ' +
  '.kizuna-pwa-update, .kizuna-pwa-install.is-expanded, ' +
  '.kizuna-push-consent.is-visible, #alt00-viewer'
));

const scrollProgress = () => {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  return distance <= 0 ? 1 : window.scrollY / distance;
};

const startMau = element => {
  if (pageIsBusy()) return false;
  void element.show();
  return true;
};

const startWhenAvailable = element => {
  const attempt = () => {
    if (!element.isConnected || element.hidden === false || startMau(element)) return;
    window.setTimeout(attempt, 400);
  };
  attempt();
};

const mountMau = () => {
  if (!MAU_CONFIG.enabled || document.querySelector('kizuna-mau')) return;
  const mascot = document.createElement('kizuna-mau');
  document.body.appendChild(mascot);

  const testMode = new URLSearchParams(location.search).get(MAU_CONFIG.testParameter) === '1';
  if (testMode) {
    window.setTimeout(() => startWhenAvailable(mascot), 500);
    return;
  }

  const onScroll = () => {
    if (scrollProgress() < MAU_CONFIG.triggerProgress) return;
    window.removeEventListener('scroll', onScroll);
    const remainingDelay = Math.max(0, MAU_CONFIG.minimumPageAge - performance.now());
    window.setTimeout(() => startWhenAvailable(mascot), remainingDelay);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountMau, { once: true });
} else {
  mountMau();
}
