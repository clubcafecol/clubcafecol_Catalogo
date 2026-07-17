/* =========================================================
   CLUB DEL CAFÉ — script.js
   Variety data, card rendering, modal, scroll effects
   ========================================================= */

const varieties = [
  { slug: 'blend-castillo',
    es: { name:'Blend Castillo', sub:'Caturra y Colombia', profile:'Panela, chocolate, acidez cítrica, cuerpo medio, caña', process:'Lavado', fermentation:'48 horas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Castillo Blend', sub:'Caturra & Colombia', profile:'Panela, chocolate, citric acidity, medium body, sugarcane', process:'Washed', fermentation:'48 hours', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'papayo',
    es: { name:'Papayo', sub:'Variedad emblemática del Huila', profile:'Romero, aromático, maderas finas, acidez media, cuerpo medio, durazno, té negro', process:'Lavado', fermentation:'60 horas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Papayo', sub:'Signature variety from Huila', profile:'Rosemary, aromatic, fine woods, medium acidity, medium body, peach, black tea', process:'Washed', fermentation:'60 hours', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'tabi-natural',
    es: { name:'Tabi Natural', sub:'Proceso natural extendido', profile:'Cacao, chocolate, licor, acidez media alta, cuerpo medio, vino, aromático', process:'Natural', fermentation:'120 horas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Natural Tabi', sub:'Extended natural process', profile:'Cocoa, chocolate, liquor, medium-high acidity, medium body, wine, aromatic', process:'Natural', fermentation:'120 hours', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'geisha',
    es: { name:'Geisha', sub:'Variedad de origen panameño', profile:'Limoncillo, jazmín, acidez cítrica, cuerpo medio bajo, panela, chocolate, cidrón', process:'Lavado', fermentation:'48 horas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Geisha', sub:'Variety of Panamanian origin', profile:'Lemongrass, jasmine, citric acidity, medium-low body, panela, chocolate, lemon verbena', process:'Washed', fermentation:'48 hours', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'bourbon-rojo-top-roast',
    es: { name:'Bourbon Rojo Top Roast', sub:'Fermentación de larga duración', profile:'Sandía, tamarindo, acidez alta brillante, cuerpo medio alto, licor, cacao', process:'Natural', fermentation:'400 horas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Red Bourbon Top Roast', sub:'Long-duration fermentation', profile:'Watermelon, tamarind, bright high acidity, medium-high body, liquor, cocoa', process:'Natural', fermentation:'400 hours', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'landrace',
    es: { name:'Landrace', sub:'Fermentación en biorreactor', profile:'Flor de Jamaica, arándanos, vino cuerpo medio, frambuesa, albahaca', process:'Natural', fermentation:'80 horas en biorreactor', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Landrace', sub:'Bioreactor fermentation', profile:'Hibiscus, blueberries, wine medium body, raspberry, basil', process:'Natural', fermentation:'80 hours in bioreactor', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'geisha-top-roast',
    es: { name:'Geisha Top Roast', sub:'Maceración con hierbas y frutas', profile:'Limón, jazmín, galleta, uva, frambuesa, cuerpo medio', process:'Espirituoso', fermentation:'Maceración hierbas y frutas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Geisha Top Roast', sub:'Maceration with herbs and fruits', profile:'Lemon, jasmine, cookie, grape, raspberry, medium body', process:'Spirituous', fermentation:'Herb & fruit maceration', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'bourbon-aji',
    es: { name:'Bourbon Ají', sub:'Perfil especiado, semi lavado', profile:'Pimienta, maderas finas, avinado, almendra, cítrico', process:'Semi lavado', fermentation:'96 horas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Chili Bourbon', sub:'Spiced profile, semi-washed', profile:'Pepper, fine woods, winey, almond, citrus', process:'Semi-washed', fermentation:'96 hours', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'bourbon-sandia',
    es: { name:'Bourbon Sandía', sub:'Notas frutales luminosas', profile:'Sandía, miel de panela, acidez cítrica brillante', process:'Natural', fermentation:'120 horas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Watermelon Bourbon', sub:'Bright fruity notes', profile:'Watermelon, panela honey, bright citric acidity', process:'Natural', fermentation:'120 hours', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'natural-passion',
    es: { name:'Natural Passion', sub:'Proceso espirituoso', profile:'Maracuyá, gulupa, acidez media, cuerpo jugoso', process:'Espirituoso', fermentation:'120 horas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Natural Passion', sub:'Spirituous process', profile:'Passion fruit, purple passion fruit, medium acidity, juicy body', process:'Spirituous', fermentation:'120 hours', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'bourbon-galleta',
    es: { name:'Bourbon Galleta', sub:'Dulzor cremoso, perfil clásico', profile:'Chocolate, notas cítricas, almendras, acidez y cuerpo jugoso', process:'Espirituoso', fermentation:'120 horas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Cookie Bourbon', sub:'Creamy sweetness, classic profile', profile:'Chocolate, citric notes, almonds, juicy acidity and body', process:'Spirituous', fermentation:'120 hours', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'bourbon-sidra',
    es: { name:'Bourbon Sidra', sub:'Variedad mutación de Bourbon', profile:'Limón, jazmín, galleta, uva, frambuesa, cuerpo medio', process:'Espirituoso', fermentation:'120 horas', origin:'Pitalito, Huila', altitude:'1650 MSNM' },
    en: { name:'Cider Bourbon', sub:'Bourbon mutation variety', profile:'Lemon, jasmine, cookie, grape, raspberry, medium body', process:'Spirituous', fermentation:'120 hours', origin:'Pitalito, Huila', altitude:'1650 MASL' } },

  { slug: 'wush-wush',
    es: { name:'Wush Wush', sub:'Origen etíope, expresión cremosa', profile:'Dulce y aromático. Té verde, cítrico y floral, cuerpo cremoso, acidez baja, delicado', process:'Semi lavado', fermentation:'96 horas', origin:'Pitalito, Huila', altitude:'1750 MSNM' },
    en: { name:'Wush Wush', sub:'Ethiopian origin, creamy expression', profile:'Sweet and aromatic. Green tea, citric and floral, creamy body, low acidity, delicate', process:'Semi-washed', fermentation:'96 hours', origin:'Pitalito, Huila', altitude:'1750 MASL' } },

  { slug: 'moka',
    es: { name:'Moka', sub:'Origen Acevedo, frutos rojos', profile:'Chocolate, dulzor y acidez brillante, mora silvestre y frutos rojos', process:'Natural', fermentation:'120 horas', origin:'Acevedo, Huila', altitude:'1650 MSNM' },
    en: { name:'Mocha', sub:'Acevedo origin, red fruits', profile:'Chocolate, sweetness and bright acidity, wild blackberry and red fruits', process:'Natural', fermentation:'120 hours', origin:'Acevedo, Huila', altitude:'1650 MASL' } }
];

/* Idioma activo del catálogo (detectado del navegador) */
const CAT_LANG = ((navigator.language || 'es').toLowerCase().startsWith('en')) ? 'en' : 'es';

const cards = varieties.map((v, i) => {
  const t = v[CAT_LANG]; // textos en el idioma activo
  const card = document.createElement('button');
  card.className = 'card';
  card.dataset.slug = v.slug;

  const profileLabel = CAT_LANG === 'en' ? 'Sensory profile' : 'Perfil sensorial';

  card.innerHTML = `
    <div class="card__media">
      <img class="card__img" src="assets/variedades/${v.slug}.jpg" alt="${t.name}" loading="lazy" />
      <div class="card__overlay">
        <div class="card__profile">
          <strong>${profileLabel}</strong>
          ${t.profile}
        </div>
      </div>
      <div class="card__view" aria-hidden="true">+</div>
    </div>
    <span class="card__index">N.º ${pad(i + 1)} — ${t.process}</span>
    <h3 class="card__name">${t.name}</h3>
    <p class="card__sub">${t.sub}</p>
    <div class="card__tags">
      <span>${t.fermentation}</span>
      <span>${t.altitude}</span>
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
  const t = v[CAT_LANG];

  const catalogWord = CAT_LANG === 'en' ? 'Catalog' : 'Catálogo';

  modalImg.src = `assets/variedades/${v.slug}.jpg`;
  modalImg.alt = t.name;
  modalIndex.textContent  = `N.º ${pad(i + 1)} · ${catalogWord} 2026`;
  modalName.textContent   = t.name;
  modalSub.textContent    = t.sub;
  modalProfile.textContent  = t.profile;
  modalProcess.textContent  = t.process;
  modalFerment.textContent  = t.fermentation;
  modalOrigin.textContent   = t.origin;
  modalAltitude.textContent = t.altitude;

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

const WA_MESSAGES_ALL = {
  es: [
    { icon:'☕', label:'Quiero conocer el catálogo 2026', text:'¡Hola Club del Café! Acabo de explorar su catálogo 2026 y me encantaría conocer cuáles de las 14 variedades tienen disponibles ahora mismo. ¿Me pueden orientar?' },
    { icon:'🛒', label:'Quiero hacer un pedido', text:'¡Hola! Estoy listo para hacer un pedido de café de especialidad. ¿Me cuentan cómo es el proceso, formas de pago y tiempos de entrega?' },
    { icon:'🎁', label:'Busco un regalo de café especial', text:'¡Hola! Estoy buscando regalar café de especialidad y quiero algo memorable. ¿Me ayudan a elegir la variedad ideal según el perfil del que lo recibirá?' },
    { icon:'🏬', label:'Tengo una cafetería / negocio', text:'¡Hola! Represento una cafetería/negocio y me interesa conocer sus opciones para venta al por mayor de café de especialidad. ¿Podemos conversar?' },
    { icon:'💬', label:'Soy nuevo, asesórenme', text:'¡Hola! Estoy iniciando en el mundo del café de especialidad y me gustaría que me asesoraran sobre por dónde empezar y qué variedad recomiendan probar primero.' }
  ],
  en: [
    { icon:'☕', label:'I want to see the 2026 catalog', text:'Hi Club del Café! I just explored your 2026 catalog and I\'d love to know which of the 14 varieties you have available right now. Could you guide me?' },
    { icon:'🛒', label:'I want to place an order', text:'Hi! I\'m ready to place a specialty coffee order. Could you tell me about the process, payment methods and delivery times?' },
    { icon:'🎁', label:'Looking for a special coffee gift', text:'Hi! I\'m looking to gift specialty coffee and want something memorable. Can you help me pick the ideal variety based on the recipient\'s taste?' },
    { icon:'🏬', label:'I have a café / business', text:'Hi! I represent a café/business and I\'m interested in your wholesale options for specialty coffee. Can we talk?' },
    { icon:'💬', label:'I\'m new, guide me', text:'Hi! I\'m just getting started in the world of specialty coffee and I\'d love some guidance on where to begin and which variety you recommend trying first.' }
  ]
};

const WA_MESSAGES = WA_MESSAGES_ALL[((navigator.language || 'es').toLowerCase().startsWith('en')) ? 'en' : 'es'];

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
    const NEAR = 100;
    const FAR  = 400;

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
/* ============================================================
   i18n — Detección automática de idioma (ES / EN)
   Español por defecto. Inglés solo si el navegador está en EN.
   ============================================================ */
(function initI18n () {
  const translations = {
    en: {
      // Nav
      'nav.origen':    'Origin',
      'nav.catalogo':  'Catalog',
      'nav.descargar': 'Download',
      'nav.contacto':  'Contact',
      // Hero
      'hero.eyebrow':  '— 2026 Catalog · Specialty Edition —',
      'hero.title1':   'My Favorite Coffee.',
      'hero.title2':   'One Click From My Cup.',
      'hero.lede':     'Specialty coffees grown, processed and curated in southern Colombia. A 2026 collection made for those who seek, in every cup, a precise story of origin, fermentation and time.',
      'hero.cta1':     'Explore the catalog',
      'hero.cta2':     'Download PDF',
      'hero.meta1':    'varieties',
      'hero.meta2':    'MASL average',
      'hero.meta3':    'Colombia',
      // Instagram panel
      'ig.badge':      'LIVE',
      'ig.pre':        'Click here ·',
      'ig.title':      'Discover our origin',
      'ig.tag':        '@clubcafecol · live',
      // Benefits
      'ben.kicker':    '01 — Why choose us',
      'ben.lead':      'A <em>premium</em> experience from start to finish.',
      'ben.text':      'We care for every detail of the process — from the bean to your cup — so you enjoy an unforgettable experience. Origin, roast, sustainability and delivery: four pillars behind every reference in the catalog.',
      'ben.t1':        'Selected origin',
      'ben.d1':        'Beans grown above 1,500 MASL on the finest farms in Huila.',
      'ben.t2':        'Artisan roast',
      'ben.d2':        'Roasted in small batches to maximize aroma, body and flavor.',
      'ben.t3':        '100% sustainable',
      'ben.d3':        'We work directly with producers under fair trade and green practices.',
      'ben.t4':        'Fast delivery',
      'ben.d4':        'Vacuum-sealed right after roasting and shipped to your door.',
      // Catalog
      'cat.kicker':    '02 — The varieties',
      'cat.title':     'How to choose your coffee?',
      'cat.sub':       'Hover over each reference to see its sensory profile and discover which one best suits your taste.',
      // Download
      'dl.kicker':     '03 — Download',
      'dl.title':      'Take the full catalog',
      'dl.text':       'An editorial PDF with all 14 labels in high resolution, ready to print or share.',
      'dl.btn':        'Download catalog (PDF)',
      // Modal
      'modal.profile': 'Profile',
      'modal.process': 'Process',
      'modal.ferment': 'Fermentation',
      'modal.origin':  'Origin',
      'modal.altitude':'Altitude',
      // WhatsApp
      'wa.status':     'We usually reply within minutes',
      'wa.greeting':   'Hi! ☕ Thanks for stopping by. Tell us what you\'re looking for and we\'ll help you in minutes. Pick the message that best fits your needs:',
      'wa.label':      'Order here!',
      // Coffee bot
      'bot.bubble':    'Take me! ❤️',
      // Footer
      'ft.tag':        'Your coffee community',
      'ft.contacto':   'Contact',
      'ft.catalogo':   'Catalog',
      'ft.variedades': 'The 14 varieties',
      'ft.descargar':  'Download PDF',
      'ft.origen':     'Origin',
      'ft.rights':     '© 2026 Club del Café · All rights reserved',
      'ft.sig':        'Specialty catalog — 2026 Edition'
    }
  };

  const browserLang = (navigator.language || navigator.userLanguage || 'es').toLowerCase();
  const lang = browserLang.startsWith('en') ? 'en' : 'es';

  if (lang === 'es') {
    document.documentElement.lang = 'es';
    return;
  }

  const dict = translations[lang];
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });
})();
/* Kicker "01 — Por qué elegirnos" legible sobre fondo navy */
.benefits .kicker {
  color: var(--gold-soft, #D9C28A);
  opacity: 0.9;
}

/* Rayitas del eyebrow a juego */
.benefits__dash {
  background: var(--gold, #C9A961);
  opacity: 0.7;
}