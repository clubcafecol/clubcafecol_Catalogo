/* ============================================================
   CLUBCAFECOL — script.js
   Nav · Tabs · Modal · Cursor · WA Bot · Video Hero · i18n
   ============================================================ */

/* ── DATOS 21 SKUs (para modal) ───────────────────────────── */
const SKUS = [
  // COLECCIÓN ORIGEN
  { nombre:'RAÍZ PITALITO',         coleccion:'origen',    perfil:'Chocolate, Panela, Nuez',              proceso:'Lavado',          finca:'Pitalito, Huila',  altura:'1.650 MSNM', precio:'Desde $30.900' },
  { nombre:'PANELA DORADA',          coleccion:'origen',    perfil:'Caña, Miel, Cítrico, Melón',           proceso:'Natural',         finca:'Pitalito, Huila',  altura:'1.700 MSNM', precio:'Desde $41.900', sca:'SCA 85' },
  // COLECCIÓN TEMPORADA
  { nombre:'MANDARINA ROSADA',       coleccion:'temporada', perfil:'Mandarina, Rosa, Miel',                proceso:'Honey',           finca:'Acevedo, Huila',   altura:'1.680 MSNM', precio:'250g $45.900',  sca:'SCA 86' },
  { nombre:'BOSQUE DE ROMERO',       coleccion:'temporada', perfil:'Romero, Hierbas, Frutos rojos',        proceso:'Lavado',          finca:'Acevedo, Huila',   altura:'1.650 MSNM', precio:'250g $45.900',  sca:'SCA 86' },
  { nombre:'GIGANTE DULCE',          coleccion:'temporada', perfil:'Frutas tropicales, Dulce, Cuerpo alto', proceso:'Natural',        finca:'Pitalito, Huila',  altura:'1.680 MSNM', precio:'250g $45.900',  sca:'SCA 85' },
  { nombre:'VINO DE MONTAÑA',        coleccion:'temporada', perfil:'Vino, Uva, Panela',                    proceso:'Natural',         finca:'Acevedo, Huila',   altura:'1.700 MSNM', precio:'250g $45.900',  sca:'SCA 87' },
  { nombre:'JAZMÍN',                 coleccion:'temporada', perfil:'Jazmín, Bergamota, Té verde',          proceso:'Lavado',          finca:'Acevedo, Huila',   altura:'1.750 MSNM', precio:'250g $55.900',  sca:'SCA 86' },
  { nombre:'PIMIENTA SUAVE',         coleccion:'temporada', perfil:'Pimienta, Especias, Chocolate',        proceso:'Semilavado',      finca:'Pitalito, Huila',  altura:'1.660 MSNM', precio:'250g $55.900',  sca:'SCA 86' },
  { nombre:'TÉ SALVAJE',             coleccion:'temporada', perfil:'Té negro, Floral, Cítrico',            proceso:'Semilavado',      finca:'Acevedo, Huila',   altura:'1.720 MSNM', precio:'250g $58.900',  sca:'SCA 86' },
  // COLECCIÓN PREMIO NACIONAL
  { nombre:'TRÓPICO',                coleccion:'premio',    perfil:'Maracuyá, Piña, Ron',                  proceso:'Espirituoso',     finca:'Acevedo, Huila',   altura:'1.750 MSNM', precio:'250g $80.900',  sca:'SCA 88' },
  { nombre:'BOURBON SANDÍA',         coleccion:'premio',    perfil:'Sandía, Fresa, Frutas rojas',          proceso:'Natural',         finca:'Pitalito, Huila',  altura:'1.700 MSNM', precio:'250g $80.900',  sca:'SCA 87' },
  { nombre:'MANJAR BLANCO',          coleccion:'premio',    perfil:'Manjar, Vainilla, Caramelo',           proceso:'Espirituoso',     finca:'Acevedo, Huila',   altura:'1.730 MSNM', precio:'250g $80.900',  sca:'SCA 88' },
  { nombre:'ARÁNDANOS',              coleccion:'premio',    perfil:'Arándano, Mora, Frutos del bosque',    proceso:'Natural',         finca:'Acevedo, Huila',   altura:'1.760 MSNM', precio:'250g $80.900',  sca:'SCA 88' },
  { nombre:'ANCESTRAL FRUTAL',       coleccion:'premio',    perfil:'Frutas exóticas, Florales, Complejo',  proceso:'Espirituoso',     finca:'Pitalito, Huila',  altura:'1.680 MSNM', precio:'250g $81.900',  sca:'SCA 86' },
  { nombre:'POSTRE DE GALLETA',      coleccion:'premio',    perfil:'Galleta, Chocolate, Nuez',             proceso:'Natural coferm.', finca:'Acevedo, Huila',   altura:'1.720 MSNM', precio:'250g $82.900',  sca:'SCA 89' },
  { nombre:'PASIÓN 400',             coleccion:'premio',    perfil:'Pasión, Fermentado complejo, Tropical', proceso:'Natural 400h',   finca:'Huila, Colombia',  altura:'1.750 MSNM', precio:'250g $95.000',  sca:'SCA 89' },
  { nombre:'CORONA',                 coleccion:'premio',    perfil:'Bergamota, Jazmín, Melocotón',         proceso:'Espirituoso',     finca:'Acevedo, Huila',   altura:'1.780 MSNM', precio:'250g $115.000', sca:'SCA 89' },
  // COLECCIÓN RESERVA
  { nombre:'MORA DE NIEBLA',         coleccion:'reserva',   perfil:'Mora, Frutas del bosque, Floral',      proceso:'Lavado',          finca:'Pitalito, Huila',  altura:'1.700 MSNM', precio:'250g $92.900',  sca:'SCA 87' },
  { nombre:'SERENO',                 coleccion:'reserva',   perfil:'Suave, Floral, Bajo cafeína',          proceso:'Lavado',          finca:'Acevedo, Huila',   altura:'1.720 MSNM', precio:'250g $92.900',  sca:'SCA 87' },
  { nombre:'MORA DE NIEBLA RESERVA', coleccion:'reserva',   perfil:'Mora intensa, Vino tinto, Frambuesa',  proceso:'Natural',         finca:'Pitalito, Huila',  altura:'1.700 MSNM', precio:'250g $130.000', sca:'SCA 87' },
  { nombre:'SERENO RESERVA',         coleccion:'reserva',   perfil:'Dulce suave, Frutas blancas, Bajo cafeína', proceso:'Natural',  finca:'Acevedo, Huila',   altura:'1.720 MSNM', precio:'250g $130.000', sca:'SCA 87' },
];

const WA_NUM = '573154510390';

/* ── NAV SCROLL ──────────────────────────────────────────────*/
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── BURGER MENU ─────────────────────────────────────────────*/
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  burger.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
});
function closeMobile() {
  mobileMenu.classList.remove('open');
  burger.textContent = '☰';
}
document.addEventListener('click', e => {
  if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) closeMobile();
});

/* ── COLECCIONES TABS + FILTER ───────────────────────────────*/
const tabs  = document.querySelectorAll('.col-tab');
const cards = document.querySelectorAll('.producto-card');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const col = tab.dataset.col;
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    cards.forEach(card => {
      if (col === 'all' || card.dataset.col === col) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn .3s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── SMOOTH NAV LINKS ────────────────────────────────────────*/
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── FADE-IN ON SCROLL ───────────────────────────────────────*/
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.producto-card, .valor-card, .club-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  fadeObserver.observe(el);
});

/* cursor removed per brand update */

/* ── MODAL DE DETALLE ────────────────────────────────────────*/
(function initModal() {
  const modal      = document.getElementById('modal');
  const backdrop   = document.getElementById('modalBackdrop');
  const closeBtn   = document.getElementById('modalClose');
  const badgeEl    = document.getElementById('modalBadge');
  const nameEl     = document.getElementById('modalName');
  const subEl      = document.getElementById('modalSub');
  const perfilEl   = document.getElementById('modalPerfil');
  const procesoEl  = document.getElementById('modalProceso');
  const fermentEl  = document.getElementById('modalFerment');
  const fincaEl    = document.getElementById('modalFinca');
  const alturaEl   = document.getElementById('modalAltura');
  const precioEl   = document.getElementById('modalPrecio');
  const waBtnEl    = document.getElementById('modalWaBtn');
  if (!modal) return;

  function openModal(idx) {
    const s = SKUS[idx];
    if (!s) return;
    badgeEl.textContent     = { origen:'Origen', temporada:'Temporada', premio:'Premio Nacional', reserva:'Reserva' }[s.coleccion] || s.coleccion;
    badgeEl.className       = 'modal-badge ' + s.coleccion;
    nameEl.textContent      = s.nombre;
    subEl.textContent       = s.sca ? '⭐ ' + s.sca : '';
    perfilEl.textContent    = s.perfil;
    procesoEl.textContent   = s.proceso;
    fermentEl.textContent   = s.ferment;
    fincaEl.textContent     = s.finca;
    alturaEl.textContent    = s.altura;
    precioEl.textContent    = s.precio;
    const msg = encodeURIComponent('Hola, quiero ' + s.nombre + ' de CLUBCAFECOL ☕ ¿Podría darme más información?');
    waBtnEl.href = 'https://wa.me/' + WA_NUM + '?text=' + msg;
    if (waBtnEl) waBtnEl.textContent = document.documentElement.lang === 'en' ? '☕ Order this coffee on WhatsApp' : '☕ Pedir este café por WhatsApp';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // "ver más" buttons
  document.querySelectorAll('.btn-ver-mas').forEach(btn => {
    btn.addEventListener('click', () => openModal(parseInt(btn.dataset.sku, 10)));
  });
  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ── HERO VIDEO CAROUSEL ─────────────────────────────────────*/
(function initHeroCarousel() {
  const videos = [
    'assets/videos/video-01.mp4',
    'assets/videos/video-02.mp4',
    'assets/videos/video-03.mp4',
    'assets/videos/video-04.mp4'
  ];
  const SLIDE_MS = 7000;
  const wrap = document.getElementById('heroVideo');
  if (!wrap || !videos.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { wrap.style.display = 'none'; return; }
  if (navigator.connection && navigator.connection.saveData) { wrap.style.display = 'none'; return; }

  const layers = wrap.querySelectorAll('.hero-video-layer');
  let active = 0, idx = 0;
  layers[0].src = videos[0];
  if (videos.length > 1) layers[1].src = videos[1 % videos.length];
  layers[0].play().catch(() => { wrap.style.display = 'none'; });
  layers[1].play().catch(() => {});
  layers.forEach(v => v.addEventListener('error', () => { v.style.display = 'none'; }));
  setInterval(() => {
    const next = (active + 1) % 2;
    idx = (idx + 1) % videos.length;
    layers[next].src = videos[(idx + 1) % videos.length];
    layers[next].play().catch(() => {});
    layers[active].classList.remove('is-active');
    layers[next].classList.add('is-active');
    active = next;
  }, SLIDE_MS);
  document.addEventListener('visibilitychange', () => {
    layers.forEach(v => document.hidden ? v.pause() : v.play().catch(() => {}));
  });
})();

/* ── WHATSAPP FLOATING PANEL ─────────────────────────────────*/
(function initWhatsApp() {
  const launcher = document.getElementById('waLauncher');
  const panel    = document.getElementById('waPanel');
  const closeBtn = document.getElementById('waClose');
  const quickEl  = document.getElementById('waQuick');
  const wrap     = document.getElementById('wa');
  if (!launcher || !panel || !quickEl) return;

  const msgs = [
    { icon:'☕', label:'Quiero conocer el catálogo 2026',   text:'¡Hola CLUBCAFECOL! Acabo de explorar su catálogo 2026 y me encantaría conocer cuáles variedades tienen disponibles ahora. ¿Me pueden orientar?' },
    { icon:'🛒', label:'Quiero hacer un pedido',             text:'¡Hola! Estoy listo para hacer un pedido de café de especialidad. ¿Me cuentan cómo es el proceso, formas de pago y tiempos de entrega?' },
    { icon:'🎁', label:'Busco un regalo especial de café',   text:'¡Hola! Estoy buscando regalar café de especialidad y quiero algo memorable. ¿Me ayudan a elegir la variedad ideal?' },
    { icon:'🏬', label:'Tengo una cafetería / negocio',      text:'¡Hola! Represento una cafetería y me interesa conocer sus opciones para venta al por mayor de café de especialidad.' },
    { icon:'💬', label:'Soy nuevo, asesórenme',              text:'¡Hola! Estoy iniciando en el café de especialidad. ¿Me ayudan a saber por dónde empezar y qué variedad recomienden primero?' }
  ];

  msgs.forEach(m => {
    const a = document.createElement('a');
    a.className = 'wa__quick-btn';
    a.href = `https://wa.me/${WA_NUM}?text=${encodeURIComponent(m.text)}`;
    a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = `<span class="wa__quick-btn-icon">${m.icon}</span><span class="wa__quick-btn-text">${m.label}</span><span class="wa__quick-btn-arrow">›</span>`;
    quickEl.appendChild(a);
  });

  const openPanel  = () => { panel.setAttribute('aria-hidden','false'); launcher.setAttribute('aria-expanded','true'); wrap.classList.add('is-open'); };
  const closePanel = () => { panel.setAttribute('aria-hidden','true');  launcher.setAttribute('aria-expanded','false'); wrap.classList.remove('is-open'); };
  const toggle     = () => panel.getAttribute('aria-hidden') === 'false' ? closePanel() : openPanel();

  launcher.addEventListener('click', toggle);
  if (launcher) launcher.addEventListener('touchend', e => { e.preventDefault(); toggle(); });
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') closePanel(); });
  document.addEventListener('click', e => { if (panel.getAttribute('aria-hidden') === 'true') return; if (!wrap.contains(e.target)) closePanel(); });
})();

/* ── COFFEE BOT — cambio de mood ─────────────────────────────*/
(function initCoffeeBot() {
  const wa       = document.getElementById('wa');
  const bot      = document.getElementById('waBot');
  const launcher = document.getElementById('waLauncher');
  if (!wa || !bot) return;

  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let currentMood = 'neutral';
  const setMood = m => { if (m !== currentMood) { currentMood = m; bot.dataset.mood = m; } };

  if (hasMouse) {
    const NEAR = 100, FAR = 400;
    window.addEventListener('mousemove', e => {
      const r = wa.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      if (dist < NEAR) setMood('happy');
      else if (dist > FAR) setMood('angry');
      else setMood('neutral');
    }, { passive: true });
    setTimeout(() => { if (currentMood === 'neutral') setMood('angry'); }, 800);
  } else {
    let happyTimer;
    setTimeout(() => setMood('angry'), 1200);
    const triggerHappy = () => {
      setMood('happy');
      clearTimeout(happyTimer);
      happyTimer = setTimeout(() => setMood('angry'), 3500);
    };
    document.addEventListener('touchstart', triggerHappy, { passive: true });
    window.addEventListener('scroll', triggerHappy, { passive: true });
    setInterval(() => {
      if (currentMood === 'angry') {
        setMood('neutral');
        setTimeout(() => { if (currentMood === 'neutral') setMood('angry'); }, 700);
      }
    }, 6000);
    bot.addEventListener('click', e => {
      e.stopPropagation();
      setMood('happy');
      clearTimeout(happyTimer);
      if (launcher) launcher.click();
    });
  }
})();

/* ── i18n — detección automática ES / EN ─────────────────────*/
(function initI18n() {
  const translations = {
    en: {
      'nav.brand':'CLUBCAFECOL','nav.colecciones':'Collections','nav.catalogo':'Catalog',
      'nav.club':'Club','nav.pdf':'PDF','nav.cta':'Order now ☕','nav.mobileCta':'☕ Order on WhatsApp',
      'hero.pre':'Colombia · Roasted to order',
      'hero.title':'Your favorite coffee.<br><em>Delivered to your door.</em>',
      'hero.sub':'21 specialty varieties from southern Colombia.<br>From $30,900 · Free shipping from $85,000',
      'hero.cta1':'☕ Order on WhatsApp','hero.cta2':'View catalog',
      'hero.stat1n':'21','hero.stat1l':'varieties','hero.stat2n':'1650+','hero.stat2l':'MASL',
      'hero.stat3n':'SCA','hero.stat3l':'Certified','hero.stat4n':'24h','hero.stat4l':'dispatch',
      'ig.badge':'LIVE','ig.pre':'Follow us ·','ig.title':'Discover our origin','ig.tag':'@clubcafecol · live',
      'ben.kicker':'Why choose us','ben.title':'A <em>premium</em> experience from start to finish',
      'ben.t1':'Selected origin','ben.d1':'Beans grown above 1,500 MASL on the finest farms in Colombia;',
      'ben.t2':'Roasted to order','ben.d2':'Roasted in small batches the same day as your order.',
      'ben.t3':'Free grinding','ben.d3':'Choose your ideal grind — espresso, filter, press — at no extra charge.',
      'ben.t4':'Fast delivery','ben.d4':'Vacuum-sealed right after roasting. Bogotá 24-48h, rest of country 2-5 days.',
      'cat.kicker':'The collections','cat.title':'Four worlds<br><em>of flavor</em>',
      'tab.all':'All','tab.origen':'Origin','tab.temporada':'Season','tab.premio':'National Award','tab.reserva':'Reserve',
      'cat.helpText':"Don't know which to choose? We advise you for free.",'cat.helpCta':'Talk to us →',
      'club.kicker':'Monthly subscription','club.title':'Season Club','club.sub':'Receive a different coffee each month. Curated for your level.',
      'dl.kicker':'Full catalog','dl.title':'Take the catalog<br><em>in your pocket</em>',
      'dl.text':'21 varieties in high resolution. Sensory profiles, origins, and the story behind each cup. Ready to share.',
      'dl.btn':'⬇ Download PDF 2026','dl.wa':'Order on WhatsApp',
      'ft.tag':'Your coffee community<br>Bogotá · Colombia','ft.catalogo':'Catalog',
      'ft.origen':'Origin Collection','ft.temporada':'Season Collection','ft.premio':'National Award','ft.reserva':'Limited Reserve',
      'ft.club':'Club','ft.contacto':'Contact',
      'ft.rights':'© 2026 CLUBCAFECOL · NIT 901731658 · All rights reserved',
      'ft.sig':'Free shipping from $85,000 · Free grinding',
      'wa.status':'We usually reply within minutes',
      'wa.greeting':'Hi! ☕ Thanks for stopping by. Tell us what you need and we\'ll advise you in minutes.',
      'wa.label':'Order here!','bot.bubble':'Take me! ❤️'
    }
  };

  const lang = (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  document.documentElement.lang = lang;
  if (lang === 'es') return;

  const dict = translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
})();
