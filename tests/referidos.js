/* CLUBCAFECOL — pruebas del programa de referidos y de la base (Supabase)
   Uso: cd tests && node referidos.js */
const {JSDOM} = require('jsdom');
const fs = require('fs');
const path = require('path');
const D = path.resolve(__dirname, '..');
const ok = [], fail = [], errs = [];
const t = (n, c) => (c ? ok : fail).push(n);
// Solo microtareas: un setTimeout en el arranque vuelve a enlazar los botones y duplica los clics
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
const SRC = {
  html: fs.readFileSync(path.join(D, 'index.html'), 'utf8'),
  i18n: fs.readFileSync(path.join(D, 'i18n.js'), 'utf8'),
  js: fs.readFileSync(path.join(D, 'script.js'), 'utf8')
};

/* Respuestas simuladas de Supabase: la base real valida; aquí comprobamos el cliente */
function respuesta(u, body, opts) {
  if (/\/rest\/v1\/opiniones/.test(u)) {
    return [{nombre: 'Ana P.', ciudad: 'Cali', calificacion: 5, texto: 'Texto aprobado de prueba para la web'}];
  }
  const fn = (String(u).match(/rpc\/(\w+)/) || [])[1];
  if (fn === 'codigo_valido') return !(body && body.p_codigo === 'FAKE-001');
  if (fn === 'crear_pedido') return opts.pedidoFalla ? Promise.reject(new Error('caida')) : 'W-261030-TE57';
  return {registrar_visita: true, crear_opinion: 1}[fn] ?? [];
}

async function mount(query, opts) {
  opts = opts || {};
  const dom = new JSDOM(SRC.html, {
    runScripts: 'outside-only', pretendToBeVisual: true,
    url: 'https://clubcafecol.github.io/clubcafecol_Catalogo/' + query
  });
  const w = dom.window;
  w.matchMedia = () => ({matches: false, addEventListener() {}, removeEventListener() {}});
  w.scrollTo = () => {};
  w.open = u => {
    if (u && u !== 'about:blank') w.__o = u;
    return {location: {set href(v) { w.__o = v; }}, opener: null};
  };
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  w.HTMLMediaElement.prototype.load = () => {};
  w.HTMLMediaElement.prototype.pause = () => {};
  w.IntersectionObserver = class { constructor(cb) { this.cb = cb; } observe(el) { this.cb([{isIntersecting: true, target: el}], this); } disconnect() {} unobserve() {} };
  w.onerror = m => errs.push('onerror: ' + m);
  w.__posts = [];
  w.fetch = (u, o) => {
    if (opts.offline) return Promise.reject(new Error('sin conexión'));
    const body = o && o.body ? JSON.parse(o.body) : null;
    w.__posts.push({u, body});
    const r = respuesta(u, body, opts);
    const pr = r && typeof r.then === 'function' ? r : Promise.resolve(r);
    return pr.then(v => {
      const txt = JSON.stringify(v === undefined ? [] : v);
      return {ok: true, status: 200, json: () => Promise.resolve(JSON.parse(txt)), text: () => Promise.resolve(txt)};
    }, e => { throw e; });
  };
  [...w.document.querySelectorAll('script:not([src])')].forEach(s => {
    if (s.type !== 'application/ld+json') { try { w.eval(s.textContent); } catch (e) { errs.push(e.message); } }
  });
  if (opts.sinBackend) w.CCC_CONFIG.SB = {url: '', key: ''};
  if (opts.skus) w.CCC_CONFIG.REF.skus = opts.skus;
  if (opts.pre) w.localStorage.setItem('ccc_ref_v1', opts.pre);
  for (const s of [SRC.i18n, SRC.js]) { try { w.eval(s); } catch (e) { errs.push(e.message); } }
  // boot() se engancha a DOMContentLoaded al evaluar; dejamos que JSDOM lo dispare una sola vez
  if (w.document.readyState === 'loading') await new Promise(r => w.document.addEventListener('DOMContentLoaded', r, {once: true}));
  await flush();
  const $ = (s, c) => (c || w.document).querySelector(s);
  const $$ = (s, c) => [...(c || w.document).querySelectorAll(s)];
  const click = el => el.dispatchEvent(new w.Event('click', {bubbles: true}));
  const add = (sku, fmt, n) => {
    const card = $('.card[data-sku="' + sku + '"]');
    click($$('.fmt', card).find(b => b.dataset.fmt === fmt) || $('.fmt', card));
    for (let i = 0; i < (n || 1); i++) click($('[data-add]', card));
  };
  const msg = () => decodeURIComponent(((w.__o || '').split('?text=')[1] || ''));
  const posts = (fn) => w.__posts.filter(p => p.u.indexOf('/rpc/' + fn) !== -1);
  return {w, $, $$, click, add, msg, posts};
}

(async () => {
  /* ── A · con enlace de referido ─────────────────────────────────── */
  let m = await mount('?ref=ERIKPUE-001#referidos');
  t('aviso visible con el código', !m.$('#refBar').hidden && /ERIKPUE-001/.test(m.$('#refBar').textContent) && /15%/.test(m.$('#refBar').textContent));
  t('campo de WhatsApp visible', !m.$('#cartWaWrap').hidden);
  t('el código se guarda en el navegador', JSON.parse(m.w.localStorage.getItem('ccc_ref_v1')).c === 'ERIKPUE-001');
  t('la visita se registra en la base una vez', m.posts('registrar_visita').filter(p => p.body.p_codigo === 'ERIKPUE-001').length === 1);
  const waLink = m.$$('a.btn--wa-icon')[0];
  t('los enlaces fijos de WhatsApp llevan el código', /ERIKPUE-001/.test(decodeURIComponent(waLink.href)));
  t('el enlace de pedir referido no se etiqueta', !/ERIKPUE/.test(decodeURIComponent(m.$('.refer a.btn--gold').href)));

  m.add('ORI-002', '250g', 2); m.add('PRE-008', '250g', 1);
  t('subtotal = $198.800', /198[.,]800/.test(m.$('#cartSub').textContent));
  t('descuento 15% = $29.820', /29[.,]820/.test(m.$('#cartRefVal').textContent) && !m.$('#cartRefRow').hidden);
  t('total = $168.980', /168[.,]980/.test(m.$('#cartTotal').textContent));

  m.w.__o = null; m.$('#cartWa').value = '123';
  m.click(m.$('#cartCheckout')); await flush();
  t('sin WhatsApp válido no se envía el pedido', !m.w.__o && m.posts('crear_pedido').length === 0);
  t('sin WhatsApp válido el código sigue activo', JSON.parse(m.w.localStorage.getItem('ccc_ref_v1')).used === false);

  m.$('#cartWa').value = '300 123 4567';
  m.click(m.$('#cartCheckout')); await flush();
  const mm = m.msg();
  t('el pedido lleva el código', /Código de referido: ERIKPUE-001/.test(mm));
  t('el pedido lleva el WhatsApp normalizado', /573001234567/.test(mm));
  t('el pedido lleva el ID devuelto por la base', /Pedido: W-261030-TE57/.test(mm));
  t('el pedido muestra el descuento y el total', /29[.,]820/.test(mm) && /168[.,]980/.test(mm) && /sujeto a verificación/.test(mm));
  const ped = m.posts('crear_pedido')[0];
  t('el pedido se guarda en la base', !!ped);
  t('la base recibe código, WhatsApp y montos', !!ped && ped.body.p_codigo === 'ERIKPUE-001' && ped.body.p_whatsapp === '573001234567'
    && ped.body.p_subtotal === 198800 && ped.body.p_descuento === 29820 && ped.body.p_total === 168980);
  t('la base recibe el subtotal elegible (sin kits)', !!ped && ped.body.p_subtotal_elegible === 198800);
  t('el ID de la base coincide con el del mensaje', mm.includes('W-261030-TE57'));
  t('la base recibe los ítems con cantidad y precio', !!ped && ped.body.p_items.length === 2 && ped.body.p_items[0].q === 2 && ped.body.p_items[0].p > 0);
  t('tras enviar, el descuento se apaga', m.$('#refBar').hidden && m.$('#cartRefRow').hidden && m.$('#cartWaWrap').hidden);
  t('el mismo enlace no reactiva el descuento', (await mount('?ref=ERIKPUE-001', {pre: m.w.localStorage.getItem('ccc_ref_v1')}))
    .$('#refBar').hidden);

  /* ── B · sin referido / inválido / sin conexión ─────────────────── */
  m = await mount('');
  t('sin ?ref= no hay aviso ni campo ni fila', m.$('#refBar').hidden && m.$('#cartWaWrap').hidden && m.$('#cartRefRow').hidden);
  m.add('ORI-002', '250g', 1); m.$('#cartAddr').value = 'Bogotá';
  m.click(m.$('#cartCheckout')); await flush();
  t('sin ?ref= el pedido sale como siempre', /^https:\/\/wa\.me\/573154510390/.test(m.w.__o) && !/referid/i.test(m.msg()));
  t('sin ?ref= el pedido se guarda sin código', m.posts('crear_pedido').length === 1 && m.posts('crear_pedido')[0].body.p_codigo === null);
  m = await mount('?ref=%3Cscript%3E');
  t('código con formato inválido se ignora', m.$('#refBar').hidden && !m.w.localStorage.getItem('ccc_ref_v1'));
  m = await mount('?ref=erikpue-001');
  t('minúsculas se aceptan y se normalizan', !m.$('#refBar').hidden && /ERIKPUE-001/.test(m.$('#refBar').textContent));
  m = await mount('?ref=ERIKPUE-001', {sinBackend: true});
  t('sin configuración de base no hay llamadas', m.w.__posts.length === 0 && !m.$('#refBar').hidden);
  m = await mount('?ref=ERIKPUE-001', {offline: true});
  t('sin conexión el aviso del código igual aparece', !m.$('#refBar').hidden);

  /* ── C · lista de cafés elegibles ───────────────────────────────── */
  m = await mount('?ref=ERIKPUE-001', {skus: ['TEM-001']});
  m.add('ORI-002', '250g', 1);
  t('café fuera de la lista no recibe 15%', m.$('#cartRefRow').hidden && /41[.,]900/.test(m.$('#cartTotal').textContent));
  m.add('TEM-001', '250g', 1);
  t('café en la lista sí: 15% de $45.900 = $6.885', /6[.,]885/.test(m.$('#cartRefVal').textContent));

  /* ── D · caducidad e idioma ─────────────────────────────────────── */
  m = await mount('', {pre: JSON.stringify({c: 'ERIKPUE-001', ts: Date.now() - 61 * 864e5, used: false})});
  t('el código caduca a los 60 días', m.$('#refBar').hidden);
  m = await mount('?ref=ERIKPUE-001');
  m.click(m.$$('.lang__op').find(b => b.dataset.lang === 'en'));
  t('el aviso se traduce al inglés', /off your first order/.test(m.$('#refBar').textContent));
  t('rf.sub ya no promete 800 puntos en ningún idioma', !/800/.test(SRC.i18n.match(/'rf\.sub':'[^']*'/g).join(' ')));
  t('programa de puntos: descuentos solo en origen', (SRC.html.match(/descuento permanente en referencias de origen/g) || []).length === 2);

  /* ── E · Origen y exclusiones ───────────────────────────────────── */
  m = await mount('?ref=ERIKPUE-001');
  m.add('ORI-002', '250g', 1);
  const base = m.$('#cartRefVal').textContent;
  const bdl = m.$$('[data-add-bundle="BDL-001"]')[0];
  t('el botón del kit existe', !!bdl);
  if (bdl) { m.click(bdl); }
  t('un kit en el carrito no suma al descuento', !bdl || m.$('#cartRefVal').textContent === base);
  t('la web aclara que la bolsa es de Origen', /de una referencia de Origen/.test(SRC.html) && /from the Origen collection/.test(m.$('.refer').textContent));
  t('la web aclara que kits, experiencias y suscripciones no entran', /Kits y experiencias y las suscripciones mensuales no entran en el programa de referidos/.test(SRC.html) && /monthly subscriptions are not part of the referral programme/.test(m.$('.refer').textContent));
  t('rf.excl existe en los 9 idiomas', (SRC.i18n.match(/'rf\.excl':/g) || []).length === 9 && /rf\.excl/.test(SRC.html));
  t('rf.sub menciona Origen en los 9 idiomas', (SRC.i18n.match(/'rf\.sub':'(?:[^'\\]|\\.)*Origen(?:[^'\\]|\\.)*'/g) || []).length === 9);

  /* ── F · código escrito a mano en el carrito ────────────────────── */
  m = await mount('');
  m.add('ORI-002', '250g', 1);
  t('el carrito tiene el campo de código', !!m.$('#cartRefCode') && !!m.$('#cartRefApply'));
  t('sin código no hay descuento', m.$('#cartRefRow').hidden);
  m.$('#cartRefCode').value = 'abc'; m.click(m.$('#cartRefApply')); await flush();
  t('código con formato inválido muestra error y no activa nada', m.$('#cartRefMsg').classList.contains('is-bad') && m.$('#refBar').hidden && m.$('#cartRefRow').hidden);
  m.$('#cartRefCode').value = 'FAKE-001'; m.click(m.$('#cartRefApply')); await flush();
  t('código que no existe en la base se rechaza', m.$('#cartRefMsg').classList.contains('is-bad') && m.$('#refBar').hidden && m.$('#cartRefRow').hidden);
  m.$('#cartRefCode').value = '<script>-001'; m.click(m.$('#cartRefApply')); await flush();
  t('código con HTML se rechaza', m.$('#refBar').hidden && m.w.localStorage.getItem('ccc_ref_v1') === null);
  m.$('#cartRefCode').value = ' erikpue-001 '; m.click(m.$('#cartRefApply')); await flush();
  t('código válido (minúsculas y espacios) activa el aviso', !m.$('#refBar').hidden && /ERIKPUE-001/.test(m.$('#refBar').textContent));
  t('código manual aplica el 15%', !m.$('#cartRefRow').hidden && /6[.,]285/.test(m.$('#cartRefVal').textContent));
  t('código manual se guarda 60 días', JSON.parse(m.w.localStorage.getItem('ccc_ref_v1')).c === 'ERIKPUE-001');
  t('código manual pide el WhatsApp', !m.$('#cartWaWrap').hidden);
  t('código manual registra la visita en la base', m.posts('registrar_visita').some(p => p.body.p_codigo === 'ERIKPUE-001' && p.body.p_pagina === 'carrito-manual'));
  m.$('#cartAddr').value = 'Bogotá'; m.$('#cartWa').value = '3001234567';
  m.click(m.$('#cartCheckout')); await flush();
  t('el mensaje de WhatsApp lleva el código manual', /Código de referido: ERIKPUE-001/.test(m.msg()));
  t('el pedido llega a la base con el código manual', m.posts('crear_pedido').some(p => p.body.p_codigo === 'ERIKPUE-001'));
  m.$('#cartRefCode').value = 'ERIKPUE-001'; m.click(m.$('#cartRefApply')); await flush();
  t('un código ya usado no se reactiva', m.$('#refBar').hidden && m.$('#cartRefMsg').classList.contains('is-bad'));

  m = await mount('?ref=ERIKPUE-001');
  m.add('ORI-002', '250g', 1);
  t('con enlace, el campo muestra el código', m.$('#cartRefCode').value === 'ERIKPUE-001');
  m.$('#cartRefCode').value = ''; m.click(m.$('#cartRefApply')); await flush();
  t('vaciar el campo quita el descuento', m.$('#refBar').hidden && m.$('#cartRefRow').hidden);

  m = await mount('', {offline: true});
  m.add('ORI-002', '250g', 1);
  m.$('#cartRefCode').value = 'ERIKPUE-001'; m.click(m.$('#cartRefApply')); await flush();
  t('sin conexión el código manual igual se aplica', !m.$('#cartRefRow').hidden);

  /* ── G · pedido sin conexión: se abre WhatsApp igual ────────────── */
  m = await mount('?ref=ERIKPUE-001', {pedidoFalla: true});
  m.add('ORI-002', '250g', 1); m.$('#cartWa').value = '3001234567';
  m.click(m.$('#cartCheckout')); await flush();
  t('si la base falla el pedido igual abre WhatsApp', /^https:\/\/wa\.me\/573154510390/.test(m.w.__o));
  t('si la base falla el mensaje lleva un ID local', /Pedido: W-\d{6}-[A-Z2-9]{4}/.test(m.msg()));

  /* ── H · opiniones: se guardan en la base y las aprobadas se muestran ── */
  m = await mount('');
  await flush();
  const fijas = m.$$('.testi__grid .tst').length;
  t('las opiniones aprobadas se muestran tras las fijas', m.$$('.testi__grid .tst').some(f => /Texto aprobado de prueba/.test(f.textContent)) && fijas >= 10);
  const llenar = (mm, extra) => {
    const f = mm.$('#opFormEl'), c = n => f.querySelector('[name="' + n + '"]');
    c('nombre').value = 'Laura'; c('ciudad').value = 'Bogotá'; c('contacto').value = 'laura@example.com';
    c('texto').value = 'Un café excelente, muy limpio y con buen aroma en taza.';
    f.querySelector('input[name="rating"][value="5"]').checked = true;
    c('ok').checked = true;
    if (extra) extra(c);
    f.dispatchEvent(new mm.w.Event('submit', {cancelable: true, bubbles: true}));
  };
  llenar(m); await flush();
  const op = m.posts('crear_opinion')[0];
  t('la opinión se guarda en la base como pendiente', !!op && op.body.p_contacto === 'laura@example.com' && op.body.p_calificacion === 5 && op.body.p_autorizo === true);
  t('el cliente ve que quedó en revisión', /quedó en revisión/.test(m.$('#opMsg').textContent) && !m.w.__o);
  m = await mount('');
  llenar(m, c => { c('web').value = 'bot'; }); await flush();
  t('el campo trampa bloquea el envío', m.posts('crear_opinion').length === 0);
  m = await mount('', {offline: true});
  llenar(m); await new Promise(r => setTimeout(r, 700));
  t('sin conexión la opinión sale por WhatsApp para no perderla', /^https:\/\/wa\.me\/573154510390/.test(m.w.__o) && /Laura/.test(m.msg()));

  console.log('\n\x1b[32m✓ APROBADAS: ' + ok.length + '\x1b[0m');
  ok.forEach(x => console.log('   ✓ ' + x));
  if (fail.length) { console.log('\n\x1b[31m✗ FALLIDAS: ' + fail.length + '\x1b[0m'); fail.forEach(x => console.log('   ✗ ' + x)); }
  if (errs.length) { console.log('\n\x1b[31mERRORES JS:\x1b[0m'); errs.forEach(e => console.log('   ' + e)); }
  process.exit(fail.length || errs.length ? 1 : 0);
})();
