import { MAU_CONFIG } from './mau-config.js?v=20260727-mau17';

const ASSETS = Object.freeze({
  peek: new URL('./assets/sprites/mau-peek.webp', import.meta.url).href,
  guide: new URL('./assets/sprites/mau-guide.webp', import.meta.url).href,
  leave: new URL('./assets/sprites/mau-leave.webp', import.meta.url).href,
  sleep: new URL('./assets/sprites/mau-sleep.webp', import.meta.url).href
});

const sequenceUrls = (name, count) => Object.freeze(
  Array.from(
    { length: count },
    (_unused, index) => new URL(
      `./assets/sprites/animations/mau-${name}-${String(index + 1).padStart(2, '0')}.webp`,
      import.meta.url
    ).href
  )
);

const FRAME_SEQUENCES = Object.freeze({
  blink: sequenceUrls('blink', 3),
  reaction: sequenceUrls('reaction', 4),
  wave: sequenceUrls('wave', 3),
  wake: sequenceUrls('wake', 2)
});

const wait = duration => new Promise(resolve => window.setTimeout(resolve, duration));
const SECTION_IDS = Object.freeze(Object.keys(MAU_CONFIG.dialogue.contextual));

const visibleSectionId = () => {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  let visibleId = SECTION_IDS[0] || 'inicio';
  let greatestIntersection = -1;

  for (const id of SECTION_IDS) {
    const section = document.getElementById(id);
    if (!section) continue;
    const rect = section.getBoundingClientRect();
    const intersection = Math.max(
      0,
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
    );
    if (intersection > greatestIntersection) {
      greatestIntersection = intersection;
      visibleId = id;
    }
  }
  return visibleId;
};

class KizunaMau extends HTMLElement {
  #scene;
  #character;
  #bubble;
  #closeButton;
  #interactionButton;
  #awakeAppearances = 0;
  #sleepStarted = false;
  #closing = false;
  #activeScene = null;
  #messageDeadline = 0;
  #sleepDeadline = 0;
  #lastResponse = -1;
  #lastAutomaticMessage = '';
  #currentSection = null;
  #messageStartedAt = 0;
  #ambientTimer = 0;
  #frameSequenceToken = 0;
  #awakeGesture = 0;
  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  #abortController = new AbortController();
  #layoutObserver;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('./mau.css?v=20260727-mau17', import.meta.url).href;

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
    this.#bubble.querySelector('.message').textContent = MAU_CONFIG.dialogue.general[0];
  }

  connectedCallback() {
    this.hidden = true;
    this.#closeButton.addEventListener('click', () => this.close(), {
      signal: this.#abortController.signal
    });
    this.#interactionButton.addEventListener('click', event => {
      this.#react();
      if (event.detail > 0) this.#interactionButton.blur();
    }, {
      signal: this.#abortController.signal
    });
    const sources = [
      ...Object.values(ASSETS),
      ...Object.values(FRAME_SEQUENCES).flat()
    ];
    for (const source of sources) {
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
    if (
      !this.hidden ||
      this.#awakeAppearances >= MAU_CONFIG.maxAwakeAppearances ||
      !MAU_CONFIG.enabled
    ) return;
    this.#awakeAppearances += 1;
    this.#activeScene = 'message';
    this.#closing = false;
    this.#currentSection = visibleSectionId();
    this.#messageStartedAt = performance.now();
    this.#setMessage(this.#selectAutomaticMessage(this.#currentSection));
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
    this.#scheduleAmbientBlink();
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
    this.#cancelFrameAnimation();
    this.hidden = true;
    this.#activeScene = null;
    this.#closing = false;
    this.dispatchEvent(new CustomEvent('mau-scene-complete', {
      detail: {
        scene: sceneName,
        section: this.#currentSection,
        awakeAppearance: this.#awakeAppearances,
        startedAt: this.#messageStartedAt
      }
    }));
  }

  #setPose(name, stateClass) {
    this.#cancelFrameAnimation();
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

  #selectAutomaticMessage(section) {
    const roll = Math.random();
    if (roll < MAU_CONFIG.dialogue.albertoChance) {
      return this.#rememberAutomaticMessage(
        this.#pickRandom(MAU_CONFIG.dialogue.alberto, this.#lastAutomaticMessage)
      );
    }
    if (roll < MAU_CONFIG.dialogue.albertoChance + MAU_CONFIG.dialogue.residualChance) {
      return this.#rememberAutomaticMessage(
        this.#pickRandom(MAU_CONFIG.dialogue.residual, this.#lastAutomaticMessage)
      );
    }

    const contextual = MAU_CONFIG.dialogue.contextual[section] || [];
    const pool = contextual.length && Math.random() < 0.7
      ? contextual
      : MAU_CONFIG.dialogue.general;
    return this.#rememberAutomaticMessage(
      this.#pickRandom(pool, this.#lastAutomaticMessage)
    );
  }

  #rememberAutomaticMessage(message) {
    this.#lastAutomaticMessage = message;
    return message;
  }

  #pickRandom(pool, excluded = '') {
    const available = pool.length > 1
      ? pool.filter(message => message !== excluded)
      : pool;
    return available[Math.floor(Math.random() * available.length)];
  }

  #showBubble() {
    this.#bubble.hidden = false;
    this.#bubble.removeAttribute('aria-hidden');
    requestAnimationFrame(() => this.#bubble.classList.add('is-visible'));
  }

  #hideBubble() {
    this.#bubble.classList.remove('is-visible');
    this.#bubble.setAttribute('aria-hidden', 'true');
    this.#scene.classList.remove('has-reply');
  }

  #react() {
    if (this.hidden || this.#closing || !this.#activeScene) return;
    this.#scene.classList.remove('is-reacting');
    this.#scene.classList.add('has-reply');
    requestAnimationFrame(() => this.#scene.classList.add('is-reacting'));
    window.setTimeout(() => this.#scene.classList.remove('is-reacting'), 650);

    if (this.#activeScene === 'sleep') {
      if (!this.#reducedMotion) {
        void this.#playFrameSequence(
          'wake',
          'sleep',
          MAU_CONFIG.timings.wakeFrame,
          MAU_CONFIG.timings.wakeHold
        );
      }
      this.#setMessage(this.#pickRandom(MAU_CONFIG.interaction.sleeping));
      this.#sleepDeadline = Math.max(
        this.#sleepDeadline,
        performance.now() + MAU_CONFIG.timings.interactionHold
      );
    } else {
      if (!this.#reducedMotion) {
        const gesture = this.#awakeGesture % 2 === 0 ? 'reaction' : 'wave';
        this.#awakeGesture += 1;
        void this.#playFrameSequence(
          gesture,
          'guide',
          gesture === 'wave'
            ? MAU_CONFIG.timings.waveFrame
            : MAU_CONFIG.timings.reactionFrame
        );
      }
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

  #cancelFrameAnimation() {
    window.clearTimeout(this.#ambientTimer);
    this.#ambientTimer = 0;
    this.#frameSequenceToken += 1;
    this.#scene.classList.remove('is-frame-playing');
  }

  async #playFrameSequence(name, returnPose, frameDuration, finalHold = 0) {
    const frames = FRAME_SEQUENCES[name];
    if (!frames?.length || this.#reducedMotion || this.hidden || this.#closing) return;

    window.clearTimeout(this.#ambientTimer);
    this.#ambientTimer = 0;
    const token = ++this.#frameSequenceToken;
    this.#scene.classList.add('is-frame-playing');

    for (const source of frames) {
      if (token !== this.#frameSequenceToken || this.hidden || this.#closing) return;
      this.#character.src = source;
      await wait(frameDuration);
    }

    if (finalHold) await wait(finalHold);
    if (token !== this.#frameSequenceToken || this.hidden || this.#closing) return;

    this.#character.src = ASSETS[returnPose];
    this.#scene.classList.remove('is-frame-playing');
    if (returnPose === 'guide') this.#scheduleAmbientBlink();
  }

  #scheduleAmbientBlink() {
    if (
      this.#reducedMotion ||
      this.#activeScene !== 'message' ||
      this.hidden ||
      this.#closing
    ) return;

    window.clearTimeout(this.#ambientTimer);
    const range = MAU_CONFIG.timings.blinkMax - MAU_CONFIG.timings.blinkMin;
    const delay = MAU_CONFIG.timings.blinkMin + Math.random() * range;
    this.#ambientTimer = window.setTimeout(async () => {
      await this.#playFrameSequence(
        'blink',
        'guide',
        MAU_CONFIG.timings.blinkFrame
      );
    }, delay);
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

const armSecondMessage = (element, firstScene) => {
  const firstIndex = SECTION_IDS.indexOf(firstScene.section);
  const hasLaterSection = firstIndex >= 0 && firstIndex < SECTION_IDS.length - 1;
  if (!hasLaterSection) {
    armFooterSleep(element);
    return;
  }

  const earliestStart = firstScene.startedAt + MAU_CONFIG.repeatCooldown;
  let settleTimer = 0;
  let cooldownTimer = 0;
  let completed = false;

  const cleanup = () => {
    completed = true;
    window.clearTimeout(settleTimer);
    window.clearTimeout(cooldownTimer);
    window.removeEventListener('scroll', scheduleCheck);
  };

  const attempt = () => {
    if (completed) return;
    const remainingCooldown = earliestStart - performance.now();
    if (remainingCooldown > 0) {
      window.clearTimeout(cooldownTimer);
      cooldownTimer = window.setTimeout(scheduleCheck, remainingCooldown);
      return;
    }

    const currentSection = visibleSectionId();
    if (SECTION_IDS.indexOf(currentSection) <= firstIndex) return;
    cleanup();
    startWhenAvailable(element);
  };

  const scheduleCheck = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(attempt, MAU_CONFIG.scrollSettle);
  };

  window.addEventListener('scroll', scheduleCheck, { passive: true });
  scheduleCheck();
};

const coordinateScenes = element => {
  const onComplete = event => {
    if (event.detail?.scene !== 'message') return;
    if (event.detail.awakeAppearance < MAU_CONFIG.maxAwakeAppearances) {
      armSecondMessage(element, event.detail);
      return;
    }
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
  let settleTimer = 0;
  let triggerTimer = 0;
  let armed = false;
  let started = false;

  const startAfterSettle = () => {
    window.clearTimeout(settleTimer);
    window.clearTimeout(triggerTimer);
    settleTimer = window.setTimeout(() => {
      const remainingDelay = Math.max(
        0,
        MAU_CONFIG.minimumPageAge - performance.now()
      );
      triggerTimer = window.setTimeout(() => {
        if (started) return;
        started = true;
        window.removeEventListener('scroll', onScroll);
        startWhenAvailable(element);
      }, remainingDelay);
    }, MAU_CONFIG.scrollSettle);
  };

  const onScroll = () => {
    if (!armed && scrollProgress() >= MAU_CONFIG.triggerProgress) {
      armed = true;
    }
    if (!armed) return;
    startAfterSettle();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

const mountMau = () => {
  if (!MAU_CONFIG.enabled || document.querySelector('kizuna-mau')) return;
  const mascot = document.createElement('kizuna-mau');
  document.body.appendChild(mascot);
  coordinateScenes(mascot);

  const testMode = new URLSearchParams(location.search).get(MAU_CONFIG.testParameter);
  if (startTestScene(mascot, testMode)) return;
  startMessageAtScrollPoint(mascot);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountMau, { once: true });
} else {
  mountMau();
}
