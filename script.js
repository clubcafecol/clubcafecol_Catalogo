/* =========================================================
   CLUB DEL CAFÉ — script.js
   Variety data, card rendering, modal, scroll effects
   ========================================================= */

const varieties = [
  {
    slug: 'blend-castillo',
    name: 'Blend Castillo',
    sub: 'Caturra y Colombia',
    profile: 'Panela, chocolate, acidez cítrica, cuerpo medio, caña',
    process: 'Lavado',
    fermentation: '48 horas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'papayo',
    name: 'Papayo',
    sub: 'Variedad emblemática del Huila',
    profile: 'Romero, aromático, maderas finas, acidez media, cuerpo medio, durazno, té negro',
    process: 'Lavado',
    fermentation: '60 horas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'tabi-natural',
    name: 'Tabi Natural',
    sub: 'Proceso natural extendido',
    profile: 'Cacao, chocolate, licor, acidez media alta, cuerpo medio, vino, aromático',
    process: 'Natural',
    fermentation: '120 horas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'geisha',
    name: 'Geisha',
    sub: 'Variedad de origen panameño',
    profile: 'Limoncillo, jazmín, acidez cítrica, cuerpo medio bajo, panela, chocolate, cidrón',
    process: 'Lavado',
    fermentation: '48 horas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'bourbon-rojo-top-roast',
    name: 'Bourbon Rojo Top Roast',
    sub: 'Fermentación de larga duración',
    profile: 'Sandía, tamarindo, acidez alta brillante, cuerpo medio alto, licor, cacao',
    process: 'Natural',
    fermentation: '400 horas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'landrace',
    name: 'Landrace',
    sub: 'Fermentación en biorreactor',
    profile: 'Flor de Jamaica, arándanos, vino cuerpo medio, frambuesa, albahaca',
    process: 'Natural',
    fermentation: '80 horas en biorreactor',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'geisha-top-roast',
    name: 'Geisha Top Roast',
    sub: 'Maceración con hierbas y frutas',
    profile: 'Limón, jazmín, galleta, uva, frambuesa, cuerpo medio',
    process: 'Espirituoso',
    fermentation: 'Maceración hierbas y frutas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'bourbon-aji',
    name: 'Bourbon Ají',
    sub: 'Perfil especiado, semi lavado',
    profile: 'Pimienta, maderas finas, avinado, almendra, cítrico',
    process: 'Semi lavado',
    fermentation: '96 horas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'bourbon-sandia',
    name: 'Bourbon Sandía',
    sub: 'Notas frutales luminosas',
    profile: 'Sandía, miel de panela, acidez cítrica brillante',
    process: 'Natural',
    fermentation: '120 horas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'natural-passion',
    name: 'Natural Passion',
    sub: 'Proceso espirituoso',
    profile: 'Maracuyá, gulupa, acidez media, cuerpo jugoso',
    process: 'Espirituoso',
    fermentation: '120 horas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'bourbon-galleta',
    name: 'Bourbon Galleta',
    sub: 'Dulzor cremoso, perfil clásico',
    profile: 'Chocolate, notas cítricas, almendras, acidez y cuerpo jugoso',
    process: 'Espirituoso',
    fermentation: '120 horas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'bourbon-sidra',
    name: 'Bourbon Sidra',
    sub: 'Variedad mutación de Bourbon',
    profile: 'Limón, jazmín, galleta, uva, frambuesa, cuerpo medio',
    process: 'Espirituoso',
    fermentation: '120 horas',
    origin: 'Pitalito, Huila',
    altitude: '1650 MSNM'
  },
  {
    slug: 'wush-wush',
    name: 'Wush Wush',
    sub: 'Origen etíope, expresión cremosa',
    profile: 'Dulce y aromático. Té verde, cítrico y floral, cuerpo cremoso, acidez baja, delicado',
    process: 'Semi lavado',
    fermentation: '96 horas',
    origin: 'Pitalito, Huila',
    altitude: '1750 MSNM'
  },
  {
    slug: 'moka',
    name: 'Moka',
    sub: 'Origen Acevedo, frutos rojos',
    profile: 'Chocolate, dulzor y acidez brillante, mora silvestre y frutos rojos',
    process: 'Natural',
    fermentation: '120 horas',
    origin: 'Acevedo, Huila',
    altitude: '1650 MSNM'
  }
];

/* ----------------- Render cards ----------------- */
const grid = document.getElementById('catalogGrid');

const pad = n => String(n).padStart(2, '0');

const cards = varieties.map((v, i) => {
  const card = document.createElement('button');
  card.className = 'card';
  card.dataset.slug = v.slug;
  card.innerHTML = `
    <div class="card__media">
      <img class="card__img" src="assets/variedades/${v.slug}.jpg" alt="${v.name}" loading="lazy" />
      <div class="card__overlay">
        <div class="card__profile">
          <strong>Perfil sensorial</strong>
          ${v.profile}
        </div>
      </div>
      <div class="card__view" aria-hidden="true">+</div>
    </div>
    <span class="card__index">N.º ${pad(i + 1)} — ${v.process}</span>
    <h3 class="card__name">${v.name}</h3>
    <p class="card__sub">${v.sub}</p>
    <div class="card__tags">
      <span>${v.fermentation}</span>
      <span>${v.altitude}</span>
    </div>
  `;
  card.addEventListener('click', () => openModal(i));
  return card;
});

cards.forEach(c => grid.appendChild(c));

/* ----------------- Modal ----------------- */
const modal       = document.getElementById('modal');
const modalImg    = document.getElementById('modalImg');
const modalIndex  = document.getElementById('modalIndex');
const modalName   = document.getElementById('modalName');
const modalSub    = document.getElementById('modalSub');
const modalProfile  = document.getElementById('modalProfile');
const modalProcess  = document.getElementById('modalProcess');
const modalFerment  = document.getElementById('modalFerment');
const modalOrigin   = document.getElementById('modalOrigin');
const modalAltitude = document.getElementById('modalAltitude');

function openModal (i) {
  const v = varieties[i];
  modalImg.src = `assets/variedades/${v.slug}.jpg`;
  modalImg.alt = v.name;
  modalIndex.textContent  = `N.º ${pad(i + 1)} · Catálogo 2026`;
  modalName.textContent   = v.name;
  modalSub.textContent    = v.sub;
  modalProfile.textContent  = v.profile;
  modalProcess.textContent  = v.process;
  modalFerment.textContent  = v.fermentation;
  modalOrigin.textContent   = v.origin;
  modalAltitude.textContent = v.altitude;

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal () {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ----------------- Scroll reveal ----------------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(grid.children).indexOf(entry.target);
      entry.target.style.transitionDelay = `${(idx % 4) * 90}ms`;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

cards.forEach(c => io.observe(c));

/* ----------------- Nav theme switch ----------------- */
const nav = document.querySelector('.nav');
const hero = document.querySelector('.hero');
const heroIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    nav.classList.toggle('is-light', !e.isIntersecting);
  });
}, { threshold: 0.05 });
heroIO.observe(hero);

/* ----------------- Custom cursor ----------------- */
const cursor = document.getElementById('cursor');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

/* ----------------- Hero video carousel -----------------
   Add or remove files from the `videos` array. Files live in
   assets/videos/ — keep them ~5-10 MB max each for performance.
   The carousel cross-fades between layers and pauses on mobile
   data-saver / reduced-motion preferences.
-------------------------------------------------------- */
const videos = [
  'assets/videos/video-01.mp4',
  'assets/videos/video-02.mp4',
  'assets/videos/video-03.mp4',
  'assets/videos/video-04.mp4'
];

const SLIDE_MS = 7000; // time each video stays visible

(function initHeroCarousel () {
  const wrap = document.getElementById('heroVideo');
  if (!wrap || !videos.length) return;

  // Bail out gracefully if data-saver is on or user prefers reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData     = navigator.connection && navigator.connection.saveData;
  if (reduceMotion || saveData) {
    wrap.style.display = 'none';
    return;
  }

  const layers = wrap.querySelectorAll('.hero__video-layer');
  let active = 0;
  let idx = 0;

  // Load first two videos
  layers[0].src = videos[0];
  if (videos.length > 1) layers[1].src = videos[1 % videos.length];

  // Attempt autoplay; if blocked, hide the carousel and let the gradient show
  layers[0].play().catch(() => {
    wrap.style.display = 'none';
  });
  layers[1].play().catch(() => {});

  // If a video fails to load, skip it
  layers.forEach(v => v.addEventListener('error', () => {
    v.style.display = 'none';
  }));

  // Crossfade loop
  setInterval(() => {
    const next = (active + 1) % 2;
    idx = (idx + 1) % videos.length;

    // Pre-load next clip into the inactive layer
    const nextSrc = videos[(idx + 1) % videos.length];
    layers[next].src = nextSrc;
    layers[next].play().catch(() => {});

    // Swap active class
    layers[active].classList.remove('is-active');
    layers[next].classList.add('is-active');
    active = next;
  }, SLIDE_MS);

  // Pause when tab hidden to save resources
  document.addEventListener('visibilitychange', () => {
    layers.forEach(v => document.hidden ? v.pause() : v.play().catch(()=>{}));
  });
})();
/* ============================================================
   WHATSAPP FLOATING BUTTON
   ============================================================ */

const WA_NUMBER = '573154510390'; // +57 315 451 0390  (sin + ni espacios)

const WA_MESSAGES = [
  {
    icon: '☕',
    label: 'Quiero conocer el catálogo 2026',
    text: '¡Hola Club del Café! Acabo de explorar su catálogo 2026 y me encantaría conocer cuáles de las 14 variedades tienen disponibles ahora mismo. ¿Me pueden orientar?'
  },
  {
    icon: '🛒',
    label: 'Quiero hacer un pedido',
    text: '¡Hola! Estoy listo para hacer un pedido de café de especialidad. ¿Me cuentan cómo es el proceso, formas de pago y tiempos de entrega?'
  },
  {
    icon: '🎁',
    label: 'Busco un regalo de café especial',
    text: '¡Hola! Estoy buscando regalar café de especialidad y quiero algo memorable. ¿Me ayudan a elegir la variedad ideal según el perfil del que lo recibirá?'
  },
  {
    icon: '🏬',
    label: 'Tengo una cafetería / negocio',
    text: '¡Hola! Represento una cafetería/negocio y me interesa conocer sus opciones para venta al por mayor de café de especialidad. ¿Podemos conversar?'
  },
  {
    icon: '💬',
    label: 'Soy nuevo, asesórenme',
    text: '¡Hola! Estoy iniciando en el mundo del café de especialidad y me gustaría que me asesoraran sobre por dónde empezar y qué variedad recomiendan probar primero.'
  }
];

(function initWhatsApp () {
  const launcher = document.getElementById('waLauncher');
  const panel    = document.getElementById('waPanel');
  const closeBtn = document.getElementById('waClose');
  const quickEl  = document.getElementById('waQuick');
  const wrap     = document.getElementById('wa');
  if (!launcher || !panel || !quickEl) return;

  WA_MESSAGES.forEach(m => {
    const a = document.createElement('a');
    a.className = 'wa__quick-btn';
    a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(m.text)}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `
      <span class="wa__quick-btn-icon">${m.icon}</span>
      <span class="wa__quick-btn-text">${m.label}</span>
      <span class="wa__quick-btn-arrow" aria-hidden="true">›</span>
    `;
    quickEl.appendChild(a);
  });

  const open  = () => { panel.setAttribute('aria-hidden', 'false'); launcher.setAttribute('aria-expanded', 'true');  wrap.classList.add('is-open'); };
  const close = () => { panel.setAttribute('aria-hidden', 'true');  launcher.setAttribute('aria-expanded', 'false'); wrap.classList.remove('is-open'); };
  const toggle = () => panel.getAttribute('aria-hidden') === 'false' ? close() : open();

  launcher.addEventListener('click', toggle);
  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') close();
  });

  document.addEventListener('click', e => {
    if (panel.getAttribute('aria-hidden') === 'true') return;
    if (!wrap.contains(e.target)) close();
  });  
})();
/* ============================================================
   COFFEE BOT — mood detection (desktop + mobile)
   ============================================================ */
(function initCoffeeBot () {
  const wa       = document.getElementById('wa');
  const bot      = document.getElementById('waBot');
  const launcher = document.getElementById('waLauncher');
  if (!wa || !bot) return;

  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let currentMood = 'neutral';

  const setMood = (m) => {
    if (m !== currentMood) {
      currentMood = m;
      bot.dataset.mood = m;
    }
  };

  if (hasMouse) {
    /* ----- DESKTOP: distancia del cursor ----- */
    const NEAR = 170;
    const FAR  = 380;

    window.addEventListener('mousemove', e => {
      const rect = wa.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

      if      (dist < NEAR) setMood('happy');
      else if (dist > FAR)  setMood('angry');
      else                  setMood('neutral');
    }, { passive: true });

    setTimeout(() => { if (currentMood === 'neutral') setMood('angry'); }, 800);

  } else {
    /* ----- MOBILE: interacciones táctiles ----- */
    let happyTimer;

    // Empieza enojado al cargar (llama la atención)
    setTimeout(() => setMood('angry'), 1200);

    // Cualquier toque o scroll lo pone feliz por unos segundos
    const triggerHappy = () => {
      setMood('happy');
      clearTimeout(happyTimer);
      happyTimer = setTimeout(() => setMood('angry'), 3500);
    };

    document.addEventListener('touchstart', triggerHappy, { passive: true });
    window.addEventListener('scroll',       triggerHappy, { passive: true });

    // Cada 6s parpadea entre enojado → neutral → enojado (mantiene atención)
    setInterval(() => {
      if (currentMood === 'angry') {
        setMood('neutral');
        setTimeout(() => { if (currentMood === 'neutral') setMood('angry'); }, 700);
      }
    }, 6000);

    // Tap directo en el bot → abre el chat de WhatsApp
    bot.addEventListener('click', e => {
      e.stopPropagation();
      setMood('happy');
      clearTimeout(happyTimer);
      if (launcher) launcher.click();
    });
  }
})();
