(() => {
  'use strict';

  const hero = document.querySelector('.hero');
  const imageStage = hero?.querySelector('.hero-image');
  const caption = hero?.querySelector('.hero-caption');
  if (!hero || !imageStage || !caption) return;

  const slides = [
    {
      src: 'assets/kyoto-hero.png',
      caption: 'KIOTO · PRIMERA LUZ',
      position: '58% center'
    },
    {
      src: 'assets/hero/tokyo-blue-hour.webp',
      caption: 'TOKIO · DESPUÉS DE LA LLUVIA',
      position: '62% center'
    },
    {
      src: 'assets/hero/hakone-fuji-dawn.webp',
      caption: 'HAKONE · PRIMERA LUZ',
      position: '62% center'
    },
    {
      src: 'assets/hero/miyajima-sunset.webp',
      caption: 'MIYAJIMA · ÚLTIMA MAREA',
      position: '64% center'
    },
    {
      src: 'assets/hero/nara-lanterns-dawn.webp',
      caption: 'NARA · SENDERO DE FAROLES',
      position: '66% center'
    },
    {
      src: 'assets/hero/kanazawa-rain.webp',
      caption: 'KANAZAWA · LLUVIA AL ANOCHECER',
      position: '66% center'
    }
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const initialIndex = Math.floor(Math.random() * slides.length);
  const slideElements = slides.map((slide, index) => {
    const element = document.createElement('div');
    element.className = 'hero-carousel-slide';
    element.style.backgroundImage = `url("${slide.src}")`;
    element.style.backgroundPosition = slide.position;
    element.setAttribute('aria-hidden', 'true');
    if (index === initialIndex) {
      element.classList.add('is-active');
      element.setAttribute('aria-hidden', 'false');
    }
    imageStage.appendChild(element);
    return element;
  });

  const controls = document.createElement('div');
  controls.className = 'hero-carousel-controls';
  controls.setAttribute('aria-label', 'Imágenes destacadas de Japón');
  controls.innerHTML = `
    <button class="hero-carousel-arrow" type="button" data-carousel-direction="-1" aria-label="Imagen anterior">←</button>
    <div class="hero-carousel-dots" role="group" aria-label="Seleccionar imagen"></div>
    <button class="hero-carousel-arrow" type="button" data-carousel-direction="1" aria-label="Imagen siguiente">→</button>
  `;
  hero.appendChild(controls);

  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-carousel-dot';
    dot.setAttribute('aria-label', `Mostrar ${slide.caption.toLocaleLowerCase('es')}`);
    dot.setAttribute('aria-current', index === initialIndex ? 'true' : 'false');
    controls.querySelector('.hero-carousel-dots').appendChild(dot);
    return dot;
  });

  const announcement = document.createElement('span');
  announcement.className = 'hero-carousel-announcement';
  announcement.setAttribute('aria-live', 'polite');
  hero.appendChild(announcement);

  imageStage.dataset.heroCarousel = 'true';
  caption.textContent = slides[initialIndex].caption;

  let activeIndex = initialIndex;
  let timer = 0;
  let interactionPaused = false;

  const preload = slide => {
    const image = new Image();
    image.decoding = 'async';
    image.src = slide.src;
  };
  slides.forEach((slide, index) => {
    if (index !== initialIndex) preload(slide);
  });

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = 0;
  };

  const start = () => {
    stop();
    if (reducedMotion.matches || interactionPaused || document.hidden) return;
    timer = window.setInterval(() => show(activeIndex + 1, false), 8000);
  };

  const show = (requestedIndex, announce = true) => {
    const nextIndex = (requestedIndex + slides.length) % slides.length;
    if (nextIndex === activeIndex) return;

    slideElements[activeIndex].classList.remove('is-active');
    slideElements[activeIndex].setAttribute('aria-hidden', 'true');
    dots[activeIndex].setAttribute('aria-current', 'false');

    activeIndex = nextIndex;
    slideElements[activeIndex].classList.add('is-active');
    slideElements[activeIndex].setAttribute('aria-hidden', 'false');
    dots[activeIndex].setAttribute('aria-current', 'true');
    caption.classList.remove('is-changing');
    void caption.offsetWidth;
    caption.textContent = slides[activeIndex].caption;
    caption.classList.add('is-changing');
    if (announce) announcement.textContent = slides[activeIndex].caption;
  };

  controls.addEventListener('click', event => {
    const arrow = event.target.closest('[data-carousel-direction]');
    const dot = event.target.closest('.hero-carousel-dot');
    if (arrow) show(activeIndex + Number(arrow.dataset.carouselDirection));
    if (dot) show(dots.indexOf(dot));
    start();
  });

  controls.addEventListener('mouseenter', () => {
    interactionPaused = true;
    stop();
  });
  controls.addEventListener('mouseleave', () => {
    interactionPaused = false;
    start();
  });
  hero.addEventListener('focusin', stop);
  hero.addEventListener('focusout', event => {
    if (!hero.contains(event.relatedTarget)) start();
  });
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener?.('change', start);

  start();
})();
