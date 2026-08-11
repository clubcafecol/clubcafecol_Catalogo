/* ═══════════════════════════════════════════════════════════════════════
   CLUBCAFECOL — script.js
   i18n · nav · catálogo · carrito · checkout WhatsApp · quiz · modal ·
   hero video · analítica
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var CFG      = window.CCC_CONFIG || {};
var SKUS     = window.CCC_SKUS || [];
var BUNDLES  = window.CCC_BUNDLES || [];
var WA_NUM   = CFG.WA_NUM || '573154510390';
var FREE     = CFG.ENVIO_GRATIS || 85000;
var LS_CART  = 'ccc_cart_v1';
var LS_LANG  = 'ccc_lang_v1';

var FORMATOS = [
  {k:'drip_10g', l:'Drip 10g',  tazas:1},
  {k:'250g',     l:'250 g',     tazas:16},
  {k:'340g',     l:'340 g',     tazas:22},
  {k:'500g',     l:'500 g',     tazas:33},
  {k:'2500g',    l:'2,5 kg',    tazas:166}
];

var MOLIENDAS = window.CCC_MOLIENDAS || [
  {v:'grano',    l:'Grano entero'},
  {v:'espresso', l:'Espresso'},
  {v:'v60',      l:'V60 / filtro'},
  {v:'prensa',   l:'Prensa francesa'},
  {v:'aeropress',l:'Aeropress'},
  {v:'moka',     l:'Moka / greca'},
  {v:'goteo',    l:'Cafetera de goteo'}
];

/* ── utilidades ────────────────────────────────────────────────────── */
var $  = function (s, c) { return (c || document).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

function cop(n) { return '$' + Math.round(n).toLocaleString('es-CO'); }

/* ── moneda ────────────────────────────────────────────────────────── */
var USD_COP = window.CCC_USD_COP || 3125;
function usd(n) {
  var v = n / USD_COP;
  return 'US$ ' + (v < 20 ? v.toFixed(2) : Math.round(v).toLocaleString('en-US'));
}
/* Se cobra siempre en COP; en otros idiomas se añade la equivalencia. */
function precio(n) { return curLang === 'es' ? cop(n) : cop(n) + ' COP'; }
function precioUsd(n) { return curLang === 'es' ? '' : '≈ ' + usd(n); }
function fmtLabel(k) { for (var i=0;i<FORMATOS.length;i++) if (FORMATOS[i].k===k) return FORMATOS[i].l; return k; }
function fmtTazas(k) { for (var i=0;i<FORMATOS.length;i++) if (FORMATOS[i].k===k) return FORMATOS[i].tazas; return 1; }
function molLabel(v) { for (var i=0;i<MOLIENDAS.length;i++) if (MOLIENDAS[i].v===v) return MOLIENDAS[i].l; return v; }
function skuById(id) { for (var i=0;i<SKUS.length;i++) if (SKUS[i].id===id) return SKUS[i]; return null; }

/* ── analítica ─────────────────────────────────────────────────────── */
function track(name, params) {
  params = params || {};
  try {
    window.dataLayer && window.dataLayer.push(Object.assign({event:name}, params));
    if (window.gtag && CFG.GA4_ID) gtag('event', name, params);
    if (window.fbq && CFG.META_ID) {
      var map = {add_to_cart:'AddToCart', begin_checkout:'InitiateCheckout',
                 view_item:'ViewContent', generate_lead:'Lead', contact:'Contact',
                 search:'Search', subscribe:'Subscribe'};
      if (map[name]) fbq('track', map[name], {
        content_name: params.item_name || params.content_name || '',
        content_ids:  params.item_id ? [params.item_id] : undefined,
        content_type: 'product',
        value: params.value || 0, currency: 'COP'
      });
      else fbq('trackCustom', name, params);
    }
  } catch (e) { /* la analítica nunca debe romper la tienda */ }
}

/* ── toast ─────────────────────────────────────────────────────────── */
var toastT;
function toast(msg) {
  var el = $('#toast'); if (!el) return;
  el.textContent = msg; el.classList.add('is-on');
  clearTimeout(toastT);
  toastT = setTimeout(function () { el.classList.remove('is-on'); }, 2600);
}

/* ═══════════════════════════════════════════════════════════════════
   1 · i18n
   ═══════════════════════════════════════════════════════════════════ */
var I18N = window.CCC_I18N || {};
var BASE = {};          // textos originales en español
var curLang = 'es';

function snapshotBase() {
  $$('[data-i18n]').forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    if (!(k in BASE)) BASE[k] = el.innerHTML;
  });
}

function applyLang(code) {
  var dict = I18N[code] || {};
  $$('[data-i18n]').forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    var val = (code === 'es') ? BASE[k] : (dict[k] !== undefined ? dict[k] : BASE[k]);
    if (val !== undefined) el.innerHTML = val;
  });
  var rtl = dict._dir === 'rtl';
  document.documentElement.lang = code;
  document.documentElement.dir  = rtl ? 'rtl' : 'ltr';
  document.body.classList.toggle('is-rtl', rtl);
  var cur = $('#langCur'); if (cur) cur.textContent = code.toUpperCase();
  $$('.lang__op').forEach(function (b) { b.classList.toggle('is-on', b.dataset.lang === code); });
  curLang = code;
  try { localStorage.setItem(LS_LANG, code); } catch (e) {}
  applyCurrency();
  renderWaQuick();
  renderCart();   // el carrito se re-renderiza con los textos nuevos
  track('change_language', {language: code});
}

/* En español se muestra COP a secas; en otros idiomas se añade la
   equivalencia aproximada en USD bajo cada precio. */
function applyCurrency() {
  var esES = curLang === 'es';
  $$('.card').forEach(function (card) {
    var out = $('[data-price-out]', card); if (!out) return;
    var act = $('.fmt.is-active', card) || $('.fmt', card);
    var p = +act.dataset.precio;
    var extra = $('.card__usd', card);
    if (esES) { if (extra) extra.remove(); return; }
    if (!extra) {
      extra = document.createElement('div');
      extra.className = 'card__usd';
      out.parentNode.appendChild(extra);
    }
    extra.textContent = '≈ ' + usd(p) + ' USD';
  });
  var note = $('#curNote');
  if (note) note.textContent = esES
    ? 'Precios en pesos colombianos (COP)'
    : t('cat.moneda', 'Prices in Colombian pesos (COP) · USD shown as approximate reference');
}

function initLang() {
  snapshotBase();
  var saved = null;
  try { saved = localStorage.getItem(LS_LANG); } catch (e) {}
  var nav = (navigator.language || 'es').toLowerCase().split('-')[0];
  var start = saved || (I18N[nav] ? nav : 'es');
  if (start !== 'es') applyLang(start); else applyLang('es');

  var btn = $('#langBtn'), menu = $('#langMenu'), wrap = $('#lang');
  if (!btn) return;
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = wrap.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('.lang__op').forEach(function (b) {
    b.addEventListener('click', function () {
      applyLang(b.dataset.lang);
      wrap.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) { wrap.classList.remove('is-open'); btn.setAttribute('aria-expanded','false'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { wrap.classList.remove('is-open'); btn.setAttribute('aria-expanded','false'); }
  });
}

function t(key, fallbackEs) {
  var d = I18N[curLang] || {};
  if (curLang !== 'es' && d[key] !== undefined) return d[key].replace(/<[^>]+>/g, '');
  return fallbackEs;
}

/* ═══════════════════════════════════════════════════════════════════
   2 · NAVEGACIÓN
   ═══════════════════════════════════════════════════════════════════ */
function initNav() {
  var nav = $('#nav'), burger = $('#burger'), mob = $('#navMobile');
  var last = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    last = y;
  }, {passive: true});

  if (burger) {
    burger.addEventListener('click', function () {
      var open = mob.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', mob).forEach(function (a) {
      a.addEventListener('click', function () {
        mob.classList.remove('is-open'); burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 74, behavior: 'smooth'});
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   3 · HERO VIDEO — autoplay robusto en desktop Y móvil
   ═══════════════════════════════════════════════════════════════════ */
function initHeroVideo() {
  var wrap = $('#heroVideo');
  if (!wrap) return;
  var srcs = ['assets/videos/video-01.mp4','assets/videos/video-02.mp4',
              'assets/videos/video-03.mp4','assets/videos/video-04.mp4'];
  var layers = $$('.hero__vid', wrap);
  if (!layers.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wrap.classList.add('is-static'); return;
  }

  var ok = 0, fail = 0, active = 0, idx = 0, timer = null;

  /* iOS y Android exigen estas tres propiedades por JS, no solo por atributo */
  function prime(v) {
    v.muted = true;            // imprescindible: sin esto iOS bloquea el autoplay
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.loop = true;
  }

  function attempt(v) {
    prime(v);
    var p = v.play();
    if (p && p.catch) p.catch(function () { pending = true; });
  }

  var pending = false;
  layers.forEach(function (v, i) {
    prime(v);
    v.addEventListener('loadeddata', function () { ok++; wrap.classList.add('is-live'); }, {once:true});
    v.addEventListener('error', function () {
      fail++;
      if (fail >= layers.length) { wrap.classList.add('is-static'); clearInterval(timer); }
    });
    v.src = srcs[i % srcs.length];
    v.load();
    attempt(v);
  });

  /* Si el navegador bloqueó el autoplay, arrancamos al primer gesto del usuario */
  ['touchstart','click','scroll','keydown'].forEach(function (ev) {
    window.addEventListener(ev, function once() {
      layers.forEach(function (v) { if (v.paused) attempt(v); });
      ['touchstart','click','scroll','keydown'].forEach(function (e2) {
        window.removeEventListener(e2, once);
      });
    }, {passive:true, once:false});
  });

  /* Rotación con cross-fade */
  timer = setInterval(function () {
    if (document.hidden || fail >= layers.length) return;
    var next = (active + 1) % layers.length;
    idx = (idx + 1) % srcs.length;
    var v = layers[next];
    v.src = srcs[idx];
    v.load(); attempt(v);
    layers[active].classList.remove('is-active');
    v.classList.add('is-active');
    active = next;
  }, 8000);

  document.addEventListener('visibilitychange', function () {
    layers.forEach(function (v) { document.hidden ? v.pause() : attempt(v); });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   4 · CATÁLOGO: filtros, orden, selector de formato
   ═══════════════════════════════════════════════════════════════════ */
function initCatalogo() {
  var grid = $('#grid'); if (!grid) return;
  var cards = $$('.card', grid);
  var orden = cards.slice();

  /* -- selector de formato dentro de cada tarjeta -- */
  $$('.fmt', grid).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.card');
      $$('.fmt', card).forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var precio = +btn.dataset.precio;
      var tazas  = fmtTazas(btn.dataset.fmt);
      $('[data-price-out]', card).textContent = cop(precio);
      $('[data-unit-out]',  card).textContent = btn.dataset.label;
      $('[data-taza-out]',  card).textContent = '≈ ' + cop(precio / tazas) + ' / taza';
      applyCurrency();
    });
  });

  /* -- pestañas de colección -- */
  $$('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('.tab').forEach(function (t2) { t2.classList.remove('is-active'); });
      tab.classList.add('is-active');
      abrirTodo();
      var col = tab.dataset.col;
      cards.forEach(function (c) {
        c.classList.toggle('is-hidden', !(col === 'all' || c.dataset.col === col));
      });
      track('filter_catalog', {collection: col});
    });
  });

  /* -- ordenamiento -- */
  var sel = $('#sortSel');
  if (sel) sel.addEventListener('change', function () {
    abrirTodo();
    var v = sel.value, arr = orden.slice();
    if (v === 'valor')       arr.sort(function (a,b) { return b.dataset.valor - a.dataset.valor; });
    else if (v === 'sca')    arr.sort(function (a,b) { return b.dataset.sca - a.dataset.sca || a.dataset.precio - b.dataset.precio; });
    else if (v === 'precio-asc')  arr.sort(function (a,b) { return a.dataset.precio - b.dataset.precio; });
    else if (v === 'precio-desc') arr.sort(function (a,b) { return b.dataset.precio - a.dataset.precio; });
    else arr.sort(function (a,b) {
      /* Recomendados: premiados primero, luego mejor valor */
      var pa = +a.dataset.premio, pb = +b.dataset.premio;
      if (pa !== pb) return pb - pa;
      return b.dataset.valor - a.dataset.valor;
    });
    arr.forEach(function (c) { grid.appendChild(c); });
    track('sort_catalog', {sort: v});
  });

  /* -- añadir al carrito desde la tarjeta, con la molienda ya elegida -- */
  $$('[data-add]', grid).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.card');
      var s = SKUS[+btn.dataset.add];
      var act = $('.fmt.is-active', card) || $('.fmt', card);
      var mol = $('[data-mol-sel]', card);
      addToCart(s.id, act.dataset.fmt, 1, mol ? mol.value : 'grano');
      btn.classList.add('is-done');
      setTimeout(function () { btn.classList.remove('is-done'); }, 900);
    });
  });

  /* -- los drips vienen listos: se oculta el selector de molienda -- */
  $$('.card', grid).forEach(function (card) {
    var sel = $('[data-mol-sel]', card);
    if (!sel) return;
    var wrap = sel.closest('.card__opt');
    $$('.fmt', card).forEach(function (b) {
      b.addEventListener('click', function () {
        wrap.style.display = b.dataset.fmt === 'drip_10g' ? 'none' : '';
      });
    });
  });

  /* -- vista curada: 8 lotes primero, los 21 bajo demanda -- */
  var verTodos = $('#verTodos');
  if (verTodos) verTodos.addEventListener('click', function () {
    grid.classList.add('show-all');
    $('#moreWrap').style.display = 'none';
    var msg = $('#curadaMsg'); if (msg) msg.style.display = 'none';
    track('expand_catalog', {from: 8, to: SKUS.length});
  });

  /* Filtrar o reordenar implica ver el catálogo completo */
  function abrirTodo() {
    if (!grid.classList.contains('show-all')) {
      grid.classList.add('show-all');
      var mw = $('#moreWrap'); if (mw) mw.style.display = 'none';
      var msg = $('#curadaMsg'); if (msg) msg.style.display = 'none';
    }
  }

  /* -- abrir modal -- */
  $$('[data-open]', grid).forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(+btn.dataset.open); });
  });
  $$('[data-open-sku]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var i = SKUS.findIndex(function (s) { return s.id === a.dataset.openSku; });
      if (i >= 0) openModal(i);
    });
  });

  /* -- WhatsApp directo: registrar evento -- */
  $$('[data-wa-direct]').forEach(function (a) {
    a.addEventListener('click', function () {
      track('contact', {method:'whatsapp_directo', item_name:a.dataset.waDirect});
    });
  });

  /* -- deep link #SKU -- */
  if (location.hash && location.hash.length > 1) {
    var i = SKUS.findIndex(function (s) { return '#' + s.id === location.hash; });
    if (i >= 0) setTimeout(function () { openModal(i); }, 400);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   5 · MODAL DE PRODUCTO
   ═══════════════════════════════════════════════════════════════════ */
var mdlIdx = 0, mdlFmt = '250g';

function openModal(i) {
  var s = SKUS[i]; if (!s) return;
  mdlIdx = i; mdlFmt = '250g';

  var mm = $('#mdlMol');
  if (mm && !mm.options.length) {
    mm.innerHTML = MOLIENDAS.map(function (m) {
      return '<option value="' + m.v + '">' + m.l + '</option>';
    }).join('');
  }
  if (mm) mm.closest('.mdl__mol').style.display = '';

  $('#mdlImg').src = s.img + '.jpg';
  $('#mdlImg').alt = 'Etiqueta del café ' + s.nombre;
  $('#mdlName').textContent = s.nombre;
  $('#mdlVar').textContent  = s.varietal + ' · ' + s.proceso + ' · ' + s.msnm + ' msnm';

  var COLS = {origen:'Origen', temporada:'Temporada', premio:'Premio Nacional', reserva:'Reserva'};
  var b = ['<span class="bdg bdg--col bdg--' + s.col + '">' + COLS[s.col] + '</span>'];
  if (s.sca)     b.push('<span class="bdg bdg--sca">SCA ' + s.sca + '</span>');
  if (s.premio)  b.push('<span class="bdg bdg--premio">🏆 ' + s.premio + '</span>');
  if (s.exotico) b.push('<span class="bdg bdg--exotico">✦ Varietal raro</span>');
  if (s.deca)    b.push('<span class="bdg bdg--deca">Bajo en cafeína</span>');
  $('#mdlBadges').innerHTML = b.join('');

  $('#mdlNotas').innerHTML = s.notas.map(function (n) { return '<span>' + n + '</span>'; }).join('');

  $('#mdlSpecs').innerHTML =
    '<div><dt>Varietal</dt><dd>' + s.varietal + '</dd></div>' +
    '<div><dt>Proceso</dt><dd>' + s.proceso + '</dd></div>' +
    '<div><dt>Origen</dt><dd>' + s.origen + '</dd></div>' +
    '<div><dt>Altura</dt><dd>' + s.msnm + ' msnm</dd></div>' +
    '<div><dt>Cuerpo</dt><dd>' + s.cuerpo + '</dd></div>' +
    (s.sca ? '<div><dt>Puntaje SCA</dt><dd>' + s.sca + ' / 100</dd></div>' : '');

  $('#mdlPrices').innerHTML = FORMATOS.map(function (f) {
    var p = s.precios[f.k];
    return '<button type="button" class="mprice' + (f.k === '250g' ? ' is-active' : '') + '" data-fmt="' + f.k + '">' +
           '<span class="mprice__g">' + f.l + '</span>' +
           '<span class="mprice__p">' + cop(p) + '</span>' +
           '<span class="mprice__t">' + cop(p / f.tazas) + ' / taza</span></button>';
  }).join('');

  $$('.mprice', $('#mdlPrices')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.mprice').forEach(function (x) { x.classList.remove('is-active'); });
      btn.classList.add('is-active');
      mdlFmt = btn.dataset.fmt;
      var mw = $('#mdlMol');
      if (mw) mw.closest('.mdl__mol').style.display = (mdlFmt === 'drip_10g') ? 'none' : '';
      syncMdlWa(s);
    });
  });

  syncMdlWa(s);
  $('#mdl').classList.add('is-open');
  $('#mdl').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  track('view_item', {item_id: s.id, item_name: s.nombre, value: s.precios['250g'], currency: 'COP'});
}

function syncMdlWa(s) {
  var mm = $('#mdlMol');
  var molTxt = (mdlFmt === 'drip_10g') ? 'sobre listo para usar'
             : molLabel(mm && mm.value ? mm.value : 'grano');
  var txt = 'Hola CLUBCAFECOL, quiero pedir ' + s.nombre + ' en ' + fmtLabel(mdlFmt) +
            ' (' + cop(s.precios[mdlFmt]) + '), molienda: ' + molTxt +
            '. Mi ciudad es ____. ¿Me confirman disponibilidad y total con envío?';
  $('#mdlWa').href = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(txt);
}

function closeModal() {
  $('#mdl').classList.remove('is-open');
  $('#mdl').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initModal() {
  $('#mdlClose').addEventListener('click', closeModal);
  $('#mdlScrim').addEventListener('click', closeModal);
  var mm0 = $('#mdlMol');
  if (mm0) mm0.addEventListener('change', function () { syncMdlWa(SKUS[mdlIdx]); });
  $('#mdlAdd').addEventListener('click', function () {
    var mm = $('#mdlMol');
    addToCart(SKUS[mdlIdx].id, mdlFmt, 1, mm ? mm.value : 'grano');
    closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('#mdl').classList.contains('is-open')) closeModal();
  });
}

/* ═══════════════════════════════════════════════════════════════════
   6 · CARRITO
   ═══════════════════════════════════════════════════════════════════ */
var cart = [];

function loadCart() {
  try { cart = JSON.parse(localStorage.getItem(LS_CART)) || []; } catch (e) { cart = []; }
  if (!Array.isArray(cart)) cart = [];
}
function saveCart() {
  try { localStorage.setItem(LS_CART, JSON.stringify(cart)); } catch (e) {}
}

function addToCart(skuId, fmt, qty, mol) {
  var s = skuById(skuId); if (!s) return;
  mol = (fmt === 'drip_10g') ? 'listo' : (mol || 'grano');
  var found = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].sku === skuId && cart[i].fmt === fmt && cart[i].mol === mol && !cart[i].bundle) {
      found = cart[i]; break;
    }
  }
  if (found) found.qty += qty;
  else cart.push({sku: skuId, fmt: fmt, qty: qty, mol: mol});
  saveCart(); renderCart(); openCart();
  toast(s.nombre + ' · ' + fmtLabel(fmt) + (mol !== 'listo' ? ' · ' + molLabel(mol) : ''));
  track('add_to_cart', {item_id: skuId, item_name: s.nombre, item_variant: fmtLabel(fmt),
                        grind: mol, value: s.precios[fmt], currency: 'COP', quantity: qty});
}

function addBundle(id, nombre, precio) {
  var found = null;
  for (var i = 0; i < cart.length; i++) if (cart[i].bundle === id) { found = cart[i]; break; }
  if (found) found.qty += 1;
  else cart.push({bundle: id, nombre: nombre, precio: precio, qty: 1, mol: 'grano'});
  saveCart(); renderCart(); openCart();
  toast(nombre + ' → ' + t('cart.title', 'tu pedido'));
  track('add_to_cart', {item_id: id, item_name: nombre, value: precio, currency: 'COP', quantity: 1});
}

function cartSubtotal() {
  return cart.reduce(function (a, it) {
    if (it.bundle) return a + it.precio * it.qty;
    var s = skuById(it.sku); return a + (s ? s.precios[it.fmt] * it.qty : 0);
  }, 0);
}
function cartCount() { return cart.reduce(function (a, it) { return a + it.qty; }, 0); }

function renderCart() {
  var wrap = $('#cartItems'), empty = $('#cartEmpty'), foot = $('#cartFoot');
  if (!wrap) return;
  var n = cartCount();
  var badge = $('#cartCount');
  badge.textContent = n; badge.hidden = n === 0;

  var addMore = $('#cartAddMore');
  if (!cart.length) {
    wrap.innerHTML = ''; empty.hidden = false; foot.hidden = true;
    if (addMore) addMore.hidden = true;
    $('#cartShip').innerHTML = ''; return;
  }
  empty.hidden = true; foot.hidden = false;
  if (addMore) addMore.hidden = false;

  wrap.innerHTML = cart.map(function (it, i) {
    if (it.bundle) {
      return '<div class="ci">' +
        '<div class="ci__img ci__img--kit">🎁</div>' +
        '<div class="ci__body"><h4>' + it.nombre + '</h4>' +
        '<p class="ci__meta">Kit · ' + cop(it.precio) + '</p>' +
        '<div class="ci__row"><div class="qty">' +
        '<button type="button" data-dec="' + i + '" aria-label="Quitar uno">−</button>' +
        '<span>' + it.qty + '</span>' +
        '<button type="button" data-inc="' + i + '" aria-label="Añadir uno">+</button></div>' +
        '<b>' + cop(it.precio * it.qty) + '</b></div></div>' +
        '<button type="button" class="ci__x" data-del="' + i + '" aria-label="Eliminar">×</button></div>';
    }
    var s = skuById(it.sku); if (!s) return '';
    var p = s.precios[it.fmt];
    var molSel = it.fmt === 'drip_10g'
      ? '<span class="ci__fix">Sobre listo para usar</span>'
      : '<select class="ci__mol" data-mol="' + i + '" aria-label="Molienda para ' + s.nombre + '">' +
        MOLIENDAS.map(function (m) {
          return '<option value="' + m.v + '"' + (m.v === it.mol ? ' selected' : '') + '>' + m.l + '</option>';
        }).join('') + '</select>';
    return '<div class="ci">' +
      '<div class="ci__img"><img src="' + s.img + '.jpg" alt="" width="60" height="113" loading="lazy"></div>' +
      '<div class="ci__body"><h4>' + s.nombre + '</h4>' +
      '<p class="ci__meta">' + fmtLabel(it.fmt) + ' · ' + cop(p) + (s.sca ? ' · SCA ' + s.sca : '') + '</p>' +
      molSel +
      '<div class="ci__row"><div class="qty">' +
      '<button type="button" data-dec="' + i + '" aria-label="Quitar uno">−</button>' +
      '<span>' + it.qty + '</span>' +
      '<button type="button" data-inc="' + i + '" aria-label="Añadir uno">+</button></div>' +
      '<b>' + cop(p * it.qty) + '</b></div></div>' +
      '<button type="button" class="ci__x" data-del="' + i + '" aria-label="Eliminar">×</button></div>';
  }).join('');

  /* handlers */
  $$('[data-inc]', wrap).forEach(function (b) { b.onclick = function () { cart[+b.dataset.inc].qty++; saveCart(); renderCart(); }; });
  $$('[data-dec]', wrap).forEach(function (b) { b.onclick = function () {
    var i = +b.dataset.dec; cart[i].qty--; if (cart[i].qty <= 0) cart.splice(i, 1); saveCart(); renderCart(); }; });
  $$('[data-del]', wrap).forEach(function (b) { b.onclick = function () {
    cart.splice(+b.dataset.del, 1); saveCart(); renderCart(); }; });
  $$('[data-mol]', wrap).forEach(function (s2) { s2.onchange = function () {
    cart[+s2.dataset.mol].mol = s2.value; saveCart(); }; });

  /* totales y barra de envío gratis */
  var sub = cartSubtotal();
  var falta = Math.max(0, FREE - sub);
  var pct = Math.min(100, Math.round(sub / FREE * 100));
  $('#cartShip').innerHTML = falta > 0
    ? '<div class="ship"><p>Te faltan <b>' + cop(falta) + '</b> para el envío gratis</p>' +
      '<div class="ship__bar"><i style="width:' + pct + '%"></i></div></div>'
    : '<div class="ship is-free"><p>✓ ¡Tienes envío gratis!</p><div class="ship__bar"><i style="width:100%"></i></div></div>';

  $('#cartSub').textContent   = cop(sub);
  $('#cartShipTxt').textContent = falta > 0 ? t('cart.quote', 'Se cotiza') : t('cart.free', 'Gratis');
  $('#cartTotal').textContent = cop(sub) + (curLang === 'es' ? '' : ' COP');
  var u = $('#cartTotalUsd');
  if (u) u.textContent = curLang === 'es' ? '' : '≈ ' + usd(sub) + ' USD';
}

function openCart() {
  $('#cart').classList.add('is-open');
  $('#cart').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  $('#cart').classList.remove('is-open');
  $('#cart').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ── CHECKOUT: un solo mensaje de WhatsApp con todo el pedido ──────── */
function checkout() {
  if (!cart.length) return;
  var sub    = cartSubtotal();
  var ciudad = ($('#cartCity').value || '').trim();
  var dir    = ($('#cartAddr') ? $('#cartAddr').value : '').trim();
  var nota   = ($('#cartNote').value || '').trim();
  var falta  = Math.max(0, FREE - sub);

  var L = [];
  L.push('*NUEVO PEDIDO · CLUBCAFECOL*');
  L.push('');
  cart.forEach(function (it, i) {
    if (it.bundle) {
      L.push((i + 1) + '. *' + it.nombre + '* (kit)');
      L.push('   Cantidad: ' + it.qty + '  ·  ' + cop(it.precio * it.qty));
    } else {
      var s = skuById(it.sku); if (!s) return;
      L.push((i + 1) + '. *' + s.nombre + '* — ' + fmtLabel(it.fmt));
      L.push('   ' + s.varietal + ' · ' + s.proceso + (s.sca ? ' · SCA ' + s.sca : ''));
      L.push('   Molienda: ' + (it.fmt === 'drip_10g' ? 'sobre listo' : molLabel(it.mol)));
      L.push('   Cantidad: ' + it.qty + '  ·  ' + cop(s.precios[it.fmt] * it.qty));
    }
    L.push('');
  });
  L.push('────────────────');
  L.push('*Subtotal: ' + cop(sub) + ' COP*' + (curLang === 'es' ? '' : '  (≈ ' + usd(sub) + ' USD)'));
  L.push(falta > 0
    ? 'Envío: por cotizar (faltan ' + cop(falta) + ' para envío gratis)'
    : 'Envío: *GRATIS* ✅');
  L.push('');
  if (ciudad) L.push('📍 Ciudad: ' + ciudad);
  if (dir)    L.push('🏠 Dirección: ' + dir);
  if (nota)   L.push('📝 Nota: ' + nota);
  L.push('');
  L.push('Quedo atento(a) a la confirmación de disponibilidad, el total final con envío y el medio de pago. ¡Gracias!');

  var url = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(L.join('\n'));
  track('begin_checkout', {value: sub, currency: 'COP', num_items: cartCount(),
                           items: cart.map(function (it) { return it.bundle || (it.sku + '|' + it.fmt); }).join(',')});
  window.open(url, '_blank', 'noopener');
}

function initCart() {
  loadCart(); renderCart();
  $('#cartBtn').addEventListener('click', function () { openCart(); track('view_cart', {value: cartSubtotal()}); });
  $('#cartClose').addEventListener('click', closeCart);
  $('#cartScrim').addEventListener('click', closeCart);
  function irAlCatalogo() {
    closeCart();
    var el = $('#catalogo');
    if (el) window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 74, behavior: 'smooth'});
  }
  $('#cartGo').addEventListener('click', irAlCatalogo);
  var more = $('#cartMore');
  if (more) more.addEventListener('click', function () {
    irAlCatalogo();
    track('add_more_from_cart', {items: cartCount(), value: cartSubtotal()});
  });
  $('#cartCheckout').addEventListener('click', checkout);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('#cart').classList.contains('is-open')) closeCart();
  });
  $$('[data-add-bundle]').forEach(function (b) {
    b.addEventListener('click', function () {
      addBundle(b.dataset.addBundle, b.dataset.nombre, +b.dataset.precio);
    });
  });
  $$('[data-sub]').forEach(function (a) {
    a.addEventListener('click', function () {
      track('subscribe', {item_name: 'Club ' + a.dataset.sub, value: +a.dataset.valor, currency: 'COP'});
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   7 · QUIZ — motor de recomendación
   ═══════════════════════════════════════════════════════════════════ */
function initQuiz() {
  var qz = $('#qz'); if (!qz) return;
  var ans = {}, total = $$('.qz__step', qz).length - 1;

  function show(step) {
    $$('.qz__step', qz).forEach(function (s) { s.classList.remove('is-active'); });
    var el = qz.querySelector('[data-step="' + step + '"]');
    if (el) el.classList.add('is-active');
    var pct = step === 99 ? 100 : Math.round(step / total * 100);
    $('#qzBar').style.width = pct + '%';
  }

  $$('.qz__op', qz).forEach(function (btn) {
    btn.addEventListener('click', function () {
      ans[btn.dataset.q] = btn.dataset.v;
      var cur = +btn.closest('.qz__step').dataset.step;
      if (cur + 1 < total) show(cur + 1);
      else { recomendar(ans); show(99); }
    });
  });

  $('#qzReset').addEventListener('click', function () { ans = {}; show(0); });

  function recomendar(a) {
    var DULCE   = ['chocolate','panela','nuez','caramelo','miel','galleta','manjar','caña','dulce','coco','vainilla'];
    var FRUTAL  = ['frut','vino','sandía','mora','maracuyá','gulupa','uchuva','uva','lichi','durazno','melón','frambuesa','tamarindo','arándan','cítrico'];
    var FLORAL  = ['floral','jazmín','té','limoncillo','toronja','romero','albahaca'];

    var scored = SKUS.map(function (s) {
      var n = s.notas.join(' ').toLowerCase();
      var hit = function (arr) { return arr.reduce(function (c, w) { return c + (n.indexOf(w) >= 0 ? 1 : 0); }, 0); };
      var sc = 0;

      if (a.perfil === 'dulce')   sc += hit(DULCE) * 3;
      if (a.perfil === 'frutal')  sc += hit(FRUTAL) * 3;
      if (a.perfil === 'floral')  sc += hit(FLORAL) * 3;
      if (a.perfil === 'intenso') sc += (s.premio ? 6 : 0) + (/espirituoso|cofermentado|400/i.test(s.proceso) ? 4 : 0);

      if (a.metodo === 'espresso') sc += /Alto|Medio-alto|Cremoso/.test(s.cuerpo) ? 4 : 0;
      if (a.metodo === 'filtro')   sc += /Ligero/.test(s.cuerpo) ? 4 : 0;
      if (a.metodo === 'prensa')   sc += /Medio|Alto|Cremoso/.test(s.cuerpo) ? 3 : 0;
      if (a.metodo === 'goteo')    sc += hit(DULCE) * 2 + (/Lavado|Natural$/.test(s.proceso) ? 2 : 0);

      if (a.nivel === 'nuevo')   sc += (s.col === 'origen' ? 6 : s.col === 'temporada' ? 3 : -2);
      if (a.nivel === 'medio')   sc += (s.col === 'temporada' ? 5 : s.col === 'premio' ? 3 : 1);
      if (a.nivel === 'experto') sc += (s.col === 'premio' ? 5 : s.col === 'reserva' ? 5 : 0) + (s.exotico ? 3 : 0);

      var p = s.precios['250g'];
      if (a.presupuesto === 'bajo')  sc += p <= 50000 ? 8 : (p <= 60000 ? 1 : -12);
      if (a.presupuesto === 'medio') sc += (p > 40000 && p <= 95000) ? 7 : -5;
      if (a.presupuesto === 'alto')  sc += (s.sca || 82) - 82 + (s.premio ? 5 : 0);

      sc += (s.sca || 82) * 0.15 + s.valor * 0.12;
      return {s: s, sc: sc};
    }).sort(function (x, y) { return y.sc - x.sc; });

    var top = scored.slice(0, 2);
    var razones = {
      dulce:'perfiles dulces de chocolate y panela', frutal:'perfiles frutales y vinosos',
      floral:'perfiles florales y delicados', intenso:'perfiles intensos y complejos'
    };
    var mets = {espresso:'espresso', filtro:'V60 o filtro', prensa:'prensa francesa', goteo:'cafetera de goteo'};

    $('#qzOut').innerHTML =
      '<p class="qz__why">Buscas <b>' + (razones[a.perfil] || 'un buen café') + '</b> para preparar en <b>' +
      (mets[a.metodo] || 'tu método habitual') + '</b>. Estos dos son los que mejor encajan:</p>' +
      '<div class="qz__cards">' + top.map(function (r, i) {
        var s = r.s;
        return '<div class="qzc' + (i === 0 ? ' is-top' : '') + '">' +
          (i === 0 ? '<span class="qzc__tag">Tu mejor opción</span>' : '<span class="qzc__tag qzc__tag--alt">Alternativa</span>') +
          '<img src="' + s.img + '.jpg" alt="' + s.nombre + '" width="120" height="226" loading="lazy">' +
          '<h4>' + s.nombre + '</h4>' +
          '<p class="qzc__var">' + s.varietal + ' · ' + s.proceso + (s.sca ? ' · SCA ' + s.sca : '') + '</p>' +
          '<p class="qzc__notas">' + s.notas.join(' · ') + '</p>' +
          '<p class="qzc__price">' + cop(s.precios['250g']) + ' <span>/ 250 g · ' + cop(s.taza) + ' por taza</span></p>' +
          '<button type="button" class="btn btn--gold btn--block" data-qz-add="' + s.id + '">Agregar al carrito</button>' +
          '</div>';
      }).join('') + '</div>';

    $$('[data-qz-add]').forEach(function (b) {
      b.addEventListener('click', function () { addToCart(b.dataset.qzAdd, '250g', 1, 'grano'); });
    });

    qzTop = top[0].s;
    track('quiz_complete', {metodo: a.metodo, perfil: a.perfil, nivel: a.nivel,
                            presupuesto: a.presupuesto, recomendado: top[0].s.id});
  }

  /* -- compartir el resultado: Instagram y estado de WhatsApp -- */
  var qzTop = null;

  function textoShare() {
    var url = location.origin + location.pathname + '#quiz';
    return 'Hice el test de CLUBCAFECOL y mi café es ' + qzTop.nombre +
           ' (' + qzTop.varietal + (qzTop.sca ? ', SCA ' + qzTop.sca : '') + '). ' +
           '¿Cuál es el tuyo? ☕ ' + url;
  }

  var share = $('#qzShare');
  if (share) share.addEventListener('click', function () {
    if (!qzTop) return;
    var txt = textoShare();
    track('share', {method: 'instagram_stories', item_id: qzTop.id});
    if (navigator.share) {
      navigator.share({title: 'Mi café es ' + qzTop.nombre, text: txt}).catch(function () {});
      return;
    }
    /* Sin API de compartir: copiamos el texto y abrimos Instagram */
    var done = function () {
      toast(t('qz.copied', 'Texto copiado. Pégalo en tu historia y etiquétanos.'));
      setTimeout(function () {
        window.open('https://instagram.com/clubcafecol', '_blank', 'noopener');
      }, 900);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, done);
    } else done();
  });

  var shareWa = $('#qzShareWa');
  if (shareWa) shareWa.addEventListener('click', function () {
    if (!qzTop) return;
    track('share', {method: 'whatsapp_status', item_id: qzTop.id});
    window.open('https://wa.me/?text=' + encodeURIComponent(textoShare()), '_blank', 'noopener');
  });
}

/* ═══════════════════════════════════════════════════════════════════
   8 · CAPTURA DE CORREO (PDF)
   ═══════════════════════════════════════════════════════════════════ */
function initEmail() {
  var form = $('#dlForm'); if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('#dlEmail').value.trim();
    var ok    = $('#dlOk').checked;
    var msg   = $('#dlMsg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      msg.textContent = 'Revisa el correo: no parece válido.'; msg.className = 'dl__msg is-err'; return;
    }
    if (!ok) {
      msg.textContent = 'Necesitamos tu autorización para enviarte el catálogo.'; msg.className = 'dl__msg is-err'; return;
    }
    track('generate_lead', {method: 'catalogo_pdf', email_domain: email.split('@')[1]});
    msg.innerHTML = '✓ Listo. Abrimos WhatsApp para enviarte el catálogo y tu cupón de bienvenida.';
    msg.className = 'dl__msg is-ok';

    /* Sin backend: el lead se entrega por WhatsApp y el PDF se descarga al instante.
       Cuando conectes un ESP (Klaviyo/Mailchimp), sustituye este bloque por el POST a su API. */
    var txt = 'Hola CLUBCAFECOL, quiero recibir el catálogo 2026 en PDF y el cupón de bienvenida. ' +
              'Mi correo es: ' + email;
    setTimeout(function () {
      window.open('https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
      var a = document.createElement('a');
      a.href = 'assets/pdf/Catalogo_CLUBCAFECOL_2026_B2C.pdf';
      a.download = ''; document.body.appendChild(a); a.click(); a.remove();
    }, 600);
    form.reset();
  });
}

/* ═══════════════════════════════════════════════════════════════════
   8b · POP-UP DE INTENCIÓN DE SALIDA (catálogo + cupón 10 %)
   ═══════════════════════════════════════════════════════════════════ */
function initExit() {
  var box = $('#exit'); if (!box) return;
  var LS = 'ccc_exit_v1';
  var yaVisto = false;
  try { yaVisto = !!localStorage.getItem(LS); } catch (e) {}
  if (yaVisto) return;

  var abierto = false, armado = false;
  setTimeout(function () { armado = true; }, 15000);   // no molestar al entrar

  function marcar() { try { localStorage.setItem(LS, Date.now()); } catch (e) {} }
  function abrir(via) {
    if (abierto || !armado || $('#cart').classList.contains('is-open')) return;
    abierto = true;
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    marcar();
    track('exit_intent_shown', {trigger: via});
  }
  function cerrar() {
    abierto = false;
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
  }

  /* Escritorio: el cursor sale por el borde superior */
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 4) abrir('mouseout');
  });
  /* Móvil: scroll rápido hacia arriba tras haber recorrido la página */
  var lastY = window.scrollY, maxY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    maxY = Math.max(maxY, y);
    if (maxY > 1200 && lastY - y > 90) abrir('scroll_up');
    lastY = y;
  }, {passive: true});

  $('#exitClose').addEventListener('click', cerrar);
  $('#exitNo').addEventListener('click', cerrar);
  $('#exitScrim').addEventListener('click', cerrar);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && abierto) cerrar(); });

  $('#exitForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('#exitEmail').value.trim(), msg = $('#exitMsg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      msg.textContent = 'Revisa el correo: no parece válido.'; msg.className = 'exit__msg is-err'; return;
    }
    if (!$('#exitOk').checked) {
      msg.textContent = 'Necesitamos tu autorización para escribirte.'; msg.className = 'exit__msg is-err'; return;
    }
    track('generate_lead', {method: 'exit_intent', email_domain: email.split('@')[1]});
    msg.textContent = '✓ Listo. Abrimos WhatsApp para enviarte el catálogo y tu cupón.';
    msg.className = 'exit__msg is-ok';
    var txt = 'Hola CLUBCAFECOL, quiero el catálogo 2026 en PDF y mi cupón del 10 % de bienvenida. ' +
              'Mi correo es: ' + email;
    setTimeout(function () {
      window.open('https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
      var a = document.createElement('a');
      a.href = 'assets/pdf/Catalogo_CLUBCAFECOL_2026_B2C.pdf';
      a.download = ''; document.body.appendChild(a); a.click(); a.remove();
      cerrar();
    }, 700);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   9 · WHATSAPP FLOTANTE
   ═══════════════════════════════════════════════════════════════════ */
/* Accesos rápidos del bot, en el idioma activo. Las claves viven en
   i18n.js bajo _wa; si un idioma no las trae, se usa el español. */
var WA_ICONS = ['🎯', '🛒', '🏆', '🎁', '🏬', '📦'];
var WA_ES = [
  {l:'No sé cuál elegir, asesórenme',
   t:'Hola CLUBCAFECOL, no sé cuál café elegir. Preparo el café en ____ y me gustan los sabores ____. ¿Qué me recomiendan?'},
  {l:'Quiero hacer un pedido ya',
   t:'Hola CLUBCAFECOL, quiero hacer un pedido. Me interesa ____ en presentación de ____. Mi ciudad es ____. ¿Me confirman total con envío?'},
  {l:'Quiero los cafés premiados',
   t:'Hola CLUBCAFECOL, me interesan los cafés de la colección Premio Nacional (Corona, Bourbon Pasión, Postre de Galleta). ¿Cuáles tienen disponibles y a qué precio?'},
  {l:'Es un regalo, ayúdenme a elegir',
   t:'Hola CLUBCAFECOL, quiero regalar café de especialidad y busco algo memorable. Mi presupuesto es aprox. ____. ¿Qué me sugieren?'},
  {l:'Tengo una cafetería o empresa',
   t:'Hola CLUBCAFECOL, represento una cafetería/empresa y quiero cotizar al por mayor. Consumimos aprox. ____ kg al mes. ¿Me pasan lista de precios B2B?'},
  {l:'Consultar envío a mi ciudad',
   t:'Hola CLUBCAFECOL, quiero saber costo y tiempo de envío a ____. ¿Hacen envío a esa ciudad?'}
];

function renderWaQuick() {
  var quick = $('#waQuick'); if (!quick) return;
  var d = I18N[curLang] || {};
  var msgs = (d._wa && d._wa.length === WA_ES.length) ? d._wa : WA_ES;
  quick.innerHTML = msgs.map(function (m, i) {
    return '<a class="wa__q" href="https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(m.t) +
           '" target="_blank" rel="noopener" data-q="' + WA_ES[i].l + '">' +
           '<span class="wa__q-i">' + WA_ICONS[i] + '</span><span>' + m.l +
           '</span><span class="wa__q-a">›</span></a>';
  }).join('');
  $$('.wa__q', quick).forEach(function (a) {
    a.addEventListener('click', function () {
      track('contact', {method: 'whatsapp_bot', intent: a.dataset.q, language: curLang});
    });
  });
}

function initWA() {
  var wrap = $('#wa'), launcher = $('#waLauncher'), panel = $('#waPanel');
  if (!wrap) return;
  renderWaQuick();

  function open()  { panel.setAttribute('aria-hidden','false'); wrap.classList.add('is-open'); launcher.setAttribute('aria-expanded','true'); }
  function close() { panel.setAttribute('aria-hidden','true');  wrap.classList.remove('is-open'); launcher.setAttribute('aria-expanded','false'); }

  launcher.addEventListener('click', function (e) {
    e.stopPropagation();
    panel.getAttribute('aria-hidden') === 'false' ? close() : open();
  });
  $('#waClose').addEventListener('click', close);
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  setTimeout(function () { wrap.classList.add('is-hint'); }, 6000);
  setTimeout(function () { wrap.classList.remove('is-hint'); }, 14000);
}

/* ═══════════════════════════════════════════════════════════════════
   9b · VIDEO DE ORIGEN (embed de Instagram, carga diferida)
   ═══════════════════════════════════════════════════════════════════ */
function initOrigenVideo() {
  var wrap = $('#igWrap'); if (!wrap) return;
  var cargado = false;

  function cargar() {
    if (cargado) return;
    cargado = true;
    /* Si el script ya está en la página, solo reprocesamos */
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
      return;
    }
    var sc = document.createElement('script');
    sc.async = true;
    sc.src = 'https://www.instagram.com/embed.js';
    sc.onload = function () {
      if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
      track('view_origin_video', {source: 'instagram'});
    };
    /* Si Instagram no carga (bloqueador, red, post retirado) se queda el
       respaldo con el enlace directo: la sección nunca aparece vacía. */
    sc.onerror = function () { wrap.classList.add('is-fallback'); };
    document.body.appendChild(sc);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { cargar(); io.disconnect(); } });
    }, {rootMargin: '300px'});
    io.observe(wrap);
  } else {
    cargar();
  }

  $$('.igfall').forEach(function (a) {
    a.addEventListener('click', function () {
      track('view_origin_video', {source: 'instagram_link'});
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   10 · REVELADO AL HACER SCROLL
   ═══════════════════════════════════════════════════════════════════ */
function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, {threshold: 0.08, rootMargin: '0px 0px -40px 0px'});
  $$('.card, .pilar, .club__card, .bdl, .tst, .trofeo').forEach(function (el) {
    el.classList.add('rv'); io.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   ARRANQUE
   ═══════════════════════════════════════════════════════════════════ */
function boot() {
  initLang();
  initNav();
  initCatalogo();
  initModal();
  initCart();
  initQuiz();
  initEmail();
  initExit();
  initWA();
  initOrigenVideo();
  initReveal();
  requestAnimationFrame(initHeroVideo);
  track('page_view', {page_title: document.title});
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
