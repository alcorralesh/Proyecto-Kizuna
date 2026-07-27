import { MAU_CONFIG } from './mau-config.js?v=20260727-mau07';

const ASSETS = Object.freeze({
  peek: new URL('./assets/sprites/mau-peek.webp', import.meta.url).href,
  guide: new URL('./assets/sprites/mau-guide.webp', import.meta.url).href,
  leave: new URL('./assets/sprites/mau-leave.webp', import.meta.url).href,
  sleep: new URL('./assets/sprites/mau-sleep.webp', import.meta.url).href
});

const wait = duration => new Promise(resolve => window.setTimeout(resolve, duration));

class KizunaMau extends HTMLElement {
  #scene;
  #character;
  #bubble;
  #closeButton;
  #interactionButton;
  #started = false;
  #sleepStarted = false;
  #closing = false;
  #activeScene = null;
  #messageDeadline = 0;
  #sleepDeadline = 0;
  #lastResponse = -1;
  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  #abortController = new AbortController();
  #layoutObserver;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('./mau.css?v=20260727-mau07', import.meta.url).href;

    this.#scene = document.createElement('section');
    this.#scene.className = 'scene';
    this.#scene.setAttribute('aria-label', 'Mau, mascota de KIZUNA');
    this.#scene.innerHTML = `
      <img class="character" alt="" aria-hidden="true" draggable="false">
      <button class="interact" type="button" aria-label="Saludar a Mau"></button>
      <aside class="bubble" role="status" aria-live="polite" hidden>
        <button class="close" type="button" aria-label="Cerrar mensaje de Mau">×</button>
        <span class="message"></span>
      </aside>`;

    shadow.append(stylesheet, this.#scene);
    this.#character = this.#scene.querySelector('.character');
    this.#bubble = this.#scene.querySelector('.bubble');
    this.#closeButton = this.#scene.querySelector('.close');
    this.#interactionButton = this.#scene.querySelector('.interact');
    this.#bubble.querySelector('.message').textContent = MAU_CONFIG.message.text;
  }

  connectedCallback() {
    this.hidden = true;
    this.#closeButton.addEventListener('click', () => this.close(), {
      signal: this.#abortController.signal
    });
    this.#interactionButton.addEventListener('click', () => this.#react(), {
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
    this.#activeScene = 'message';
    this.#closing = false;
    this.#setMessage(MAU_CONFIG.message.text);
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
    this.#messageDeadline = performance.now() + MAU_CONFIG.timings.message;
    await this.#waitForSceneDeadline('message');
    if (!this.#closing) await this.close();
  }

  async showSleep() {
    if (this.#sleepStarted || !this.hidden || !MAU_CONFIG.enabled) return;
    this.#sleepStarted = true;
    this.#activeScene = 'sleep';
    this.#closing = false;
    this.#bubble.hidden = true;
    this.#bubble.classList.remove('is-visible');
    this.#setPose('sleep', 'is-sleeping');
    this.hidden = false;

    this.#sleepDeadline = performance.now() + MAU_CONFIG.timings.sleep;
    await this.#waitForSceneDeadline('sleep');
    if (this.#activeScene !== 'sleep' || this.#closing) return;

    this.#hideBubble();
    if (!this.#reducedMotion) {
      this.#scene.className = 'scene is-sleep-fading';
      await wait(MAU_CONFIG.timings.sleepFade);
    }
    this.#finishScene('sleep');
  }

  async close() {
    if (this.#closing || this.hidden) return;
    const completedScene = this.#activeScene || 'message';
    this.#closing = true;
    this.#hideBubble();

    if (this.#reducedMotion) {
      this.#finishScene(completedScene);
      return;
    }

    this.#setPose('leave', 'is-leaving');
    await wait(MAU_CONFIG.timings.leave);
    this.#finishScene(completedScene);
  }

  #finishScene(sceneName) {
    this.hidden = true;
    this.#activeScene = null;
    this.#closing = false;
    this.dispatchEvent(new CustomEvent('mau-scene-complete', {
      detail: { scene: sceneName }
    }));
  }

  #setPose(name, stateClass) {
    this.#scene.className = `scene ${stateClass}`;
    this.#character.src = ASSETS[name];
    this.#interactionButton.setAttribute(
      'aria-label',
      name === 'sleep' ? 'Despertar suavemente a Mau' : 'Saludar a Mau'
    );
  }

  #setMessage(text) {
    this.#bubble.querySelector('.message').textContent = text;
  }

  #showBubble() {
    this.#bubble.hidden = false;
    this.#bubble.removeAttribute('aria-hidden');
    requestAnimationFrame(() => this.#bubble.classList.add('is-visible'));
  }

  #hideBubble() {
    this.#bubble.classList.remove('is-visible');
    this.#bubble.setAttribute('aria-hidden', 'true');
  }

  #react() {
    if (this.hidden || this.#closing || !this.#activeScene) return;
    this.#scene.classList.remove('is-reacting');
    requestAnimationFrame(() => this.#scene.classList.add('is-reacting'));
    window.setTimeout(() => this.#scene.classList.remove('is-reacting'), 650);

    if (this.#activeScene === 'sleep') {
      this.#setMessage(MAU_CONFIG.interaction.sleeping);
      this.#sleepDeadline = Math.max(
        this.#sleepDeadline,
        performance.now() + MAU_CONFIG.timings.interactionHold
      );
    } else {
      const responses = MAU_CONFIG.interaction.awake;
      let responseIndex = Math.floor(Math.random() * responses.length);
      if (responses.length > 1 && responseIndex === this.#lastResponse) {
        responseIndex = (responseIndex + 1) % responses.length;
      }
      this.#lastResponse = responseIndex;
      this.#setMessage(responses[responseIndex]);
      this.#messageDeadline = Math.max(
        this.#messageDeadline,
        performance.now() + MAU_CONFIG.timings.interactionHold
      );
    }
    this.#showBubble();
  }

  async #waitForSceneDeadline(sceneName) {
    while (this.#activeScene === sceneName && !this.#closing) {
      const deadline = sceneName === 'sleep' ? this.#sleepDeadline : this.#messageDeadline;
      const remaining = deadline - performance.now();
      if (remaining <= 0) return;
      await wait(Math.min(remaining, 400));
    }
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

const startMau = (element, scene = 'message') => {
  if (pageIsBusy()) return false;
  if (scene === 'sleep') {
    void element.showSleep();
  } else {
    void element.show();
  }
  return true;
};

const startWhenAvailable = (element, scene = 'message') => {
  const attempt = () => {
    if (!element.isConnected) return;
    if (element.hidden === false || !startMau(element, scene)) {
      window.setTimeout(attempt, 400);
    }
  };
  attempt();
};

const armFooterSleep = element => {
  const footer = document.querySelector('footer');
  if (!footer || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    window.setTimeout(
      () => startWhenAvailable(element, 'sleep'),
      MAU_CONFIG.timings.footerPause
    );
  }, { threshold: 0.35 });

  observer.observe(footer);
};

const listenForSecondScene = element => {
  const onComplete = event => {
    if (event.detail?.scene !== 'message') return;
    element.removeEventListener('mau-scene-complete', onComplete);
    armFooterSleep(element);
  };
  element.addEventListener('mau-scene-complete', onComplete);
};

const startTestScene = (element, testMode) => {
  if (testMode === 'sleep') {
    window.setTimeout(() => startWhenAvailable(element, 'sleep'), 500);
    return true;
  }
  if (testMode === '1') {
    window.setTimeout(() => startWhenAvailable(element), 500);
    return true;
  }
  return false;
};

const startMessageAtScrollPoint = element => {
  const onScroll = () => {
    if (scrollProgress() < MAU_CONFIG.triggerProgress) return;
    window.removeEventListener('scroll', onScroll);
    const remainingDelay = Math.max(0, MAU_CONFIG.minimumPageAge - performance.now());
    window.setTimeout(() => startWhenAvailable(element), remainingDelay);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

const mountMau = () => {
  if (!MAU_CONFIG.enabled || document.querySelector('kizuna-mau')) return;
  const mascot = document.createElement('kizuna-mau');
  document.body.appendChild(mascot);
  listenForSecondScene(mascot);

  const testMode = new URLSearchParams(location.search).get(MAU_CONFIG.testParameter);
  if (startTestScene(mascot, testMode)) return;
  startMessageAtScrollPoint(mascot);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountMau, { once: true });
} else {
  mountMau();
}
