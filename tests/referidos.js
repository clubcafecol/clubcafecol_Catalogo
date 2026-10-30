/* CLUBCAFECOL — pruebas del programa de referidos (?ref=)
   Uso: cd tests && node referidos.js */
const {JSDOM} = require('jsdom');
const fs = require('fs');
const path = require('path');
const D = path.resolve(__dirname, '..');
const ok = [], fail = [], errs = [];
const t = (n, c) => (c ? ok : fail).push(n);
const SRC = {
  html: fs.readFileSync(path.join(D, 'index.html'), 'utf8'),
  i18n: fs.readFileSync(path.join(D, 'i18n.js'), 'utf8'),
  js: fs.readFileSync(path.join(D, 'script.js'), 'utf8')
};

function mount(query, opts) {
  opts = opts || {};
  const dom = new JSDOM(SRC.html, {
    runScripts: 'outside-only', pretendToBeVisual: true,
    url: 'https://clubcafecol.github.io/clubcafecol_Catalogo/' + query
  });
  const w = dom.window;
  w.matchMedia = () => ({matches: false, addEventListener() {}, removeEventListener() {}});
  w.scrollTo = () => {};
  w.open = u => { w.__o = u; return null; };
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  w.HTMLMediaElement.prototype.load = () => {};
  w.HTMLMediaElement.prototype.pause = () => {};
  w.IntersectionObserver = class { constructor(cb) { this.cb = cb; } observe(el) { this.cb([{isIntersecting: true, target: el}], this); } disconnect() {} unobserve() {} };
  w.onerror = m => errs.push('onerror: ' + m);
  w.__posts = [];
  w.fetch = (u, o) => { w.__posts.push({u, body: JSON.parse(o.body)}); return Promise.resolve(); };
  [...w.document.querySelectorAll('script:not([src])')].forEach(s => {
    if (s.type !== 'application/ld+json') { try { w.eval(s.textContent); } catch (e) { errs.push(e.message); } }
  });
  w.CCC_CONFIG.REF.endpoint = opts.endpoint === undefined ? 'https://example.test/exec' : opts.endpoint;
  if (opts.skus) w.CCC_CONFIG.REF.skus = opts.skus;
  if (opts.pre) w.localStorage.setItem('ccc_ref_v1', opts.pre);
  for (const s of [SRC.i18n, SRC.js]) { try { w.eval(s); } catch (e) { errs.push(e.message); } }
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  const $ = (s, c) => (c || w.document).querySelector(s);
  const $$ = (s, c) => [...(c || w.document).querySelectorAll(s)];
  const click = el => el.dispatchEvent(new w.Event('click', {bubbles: true}));
  const add = (sku, fmt, n) => {
    const card = $('.card[data-sku="' + sku + '"]');
    click($$('.fmt', card).find(b => b.dataset.fmt === fmt) || $('.fmt', card));
    for (let i = 0; i < (n || 1); i++) click($('[data-add]', card));
  };
  const msg = () => decodeURIComponent(((w.__o || '').split('?text=')[1] || ''));
  return {w, $, $$, click, add, msg};
}

/* ── A · con enlace de referido ─────────────────────────────────── */
let m = mount('?ref=ERIKPUE-001#referidos');
t('aviso visible con el código', !m.$('#refBar').hidden && /ERIKPUE-001/.test(m.$('#refBar').textContent) && /15%/.test(m.$('#refBar').textContent));
t('campo de WhatsApp visible', !m.$('#cartWaWrap').hidden);
t('el código se guarda en el navegador', JSON.parse(m.w.localStorage.getItem('ccc_ref_v1')).c === 'ERIKPUE-001');
t('la visita se envía al CRM una vez', m.w.__posts.filter(p => p.body.t === 'visit' && p.body.ref === 'ERIKPUE-001').length === 1);
const waLink = m.$$('a.btn--wa-icon')[0];
t('los enlaces fijos de WhatsApp llevan el código', /ERIKPUE-001/.test(decodeURIComponent(waLink.href)));
t('el enlace de pedir referido no se etiqueta', !/ERIKPUE/.test(decodeURIComponent(m.$('.refer a.btn--gold').href)));

m.add('ORI-002', '250g', 2); m.add('PRE-008', '250g', 1);
t('subtotal = $198.800', /198[.,]800/.test(m.$('#cartSub').textContent));
t('descuento 15% = $29.820', /29[.,]820/.test(m.$('#cartRefVal').textContent) && !m.$('#cartRefRow').hidden);
t('total = $168.980', /168[.,]980/.test(m.$('#cartTotal').textContent));

m.w.__o = null; m.$('#cartWa').value = '123';
m.click(m.$('#cartCheckout'));
t('sin WhatsApp válido no se envía el pedido', !m.w.__o);
t('sin WhatsApp válido el código sigue activo', JSON.parse(m.w.localStorage.getItem('ccc_ref_v1')).used === false);

m.$('#cartWa').value = '300 123 4567';
m.click(m.$('#cartCheckout'));
const mm = m.msg();
t('el pedido lleva el código', /Código de referido: ERIKPUE-001/.test(mm));
t('el pedido lleva el WhatsApp normalizado', /573001234567/.test(mm));
t('el pedido lleva el ID W-AAMMDD-XXXX', /Pedido: W-\d{6}-[A-Z2-9]{4}/.test(mm));
t('el pedido muestra el descuento y el total', /29[.,]820/.test(mm) && /168[.,]980/.test(mm) && /sujeto a verificación/.test(mm));
const ord = m.w.__posts.find(p => p.body.t === 'order');
t('el pedido se envía al CRM', !!ord && ord.body.ref === 'ERIKPUE-001' && ord.body.wa === '573001234567');
t('el CRM recibe subtotal, descuento y total', ord.body.sub === 198800 && ord.body.disc === 29820 && ord.body.total === 168980);
t('el ID del CRM coincide con el del mensaje', mm.includes(ord.body.id));
t('el CRM recibe los ítems', ord.body.items.length === 2 && ord.body.items[0].q === 2);
t('tras enviar, el descuento se apaga', m.$('#refBar').hidden && m.$('#cartRefRow').hidden && m.$('#cartWaWrap').hidden);
t('el mismo enlace no reactiva el descuento', (() => { const x = mount('?ref=ERIKPUE-001', {pre: m.w.localStorage.getItem('ccc_ref_v1')}); return x.$('#refBar').hidden; })());

/* ── B · sin referido / inválido ────────────────────────────────── */
m = mount('');
t('sin ?ref= no hay aviso ni campo ni fila', m.$('#refBar').hidden && m.$('#cartWaWrap').hidden && m.$('#cartRefRow').hidden);
m.add('ORI-002', '250g', 1); m.$('#cartAddr').value = 'Bogotá'; m.click(m.$('#cartCheckout'));
t('sin ?ref= el pedido sale como siempre', /^https:\/\/wa\.me\/573154510390/.test(m.w.__o) && !/referid/i.test(m.msg()));
t('sin ?ref= no se envía nada al CRM', m.w.__posts.length === 0);
m = mount('?ref=%3Cscript%3E');
t('código con formato inválido se ignora', m.$('#refBar').hidden && !m.w.localStorage.getItem('ccc_ref_v1'));
m = mount('?ref=erikpue-001');
t('minúsculas se aceptan y se normalizan', !m.$('#refBar').hidden && /ERIKPUE-001/.test(m.$('#refBar').textContent));
m = mount('?ref=ERIKPUE-001', {endpoint: ''});
t('sin endpoint configurado no hay fetch', m.w.__posts.length === 0 && !m.$('#refBar').hidden);

/* ── C · lista de cafés elegibles ───────────────────────────────── */
m = mount('?ref=ERIKPUE-001', {skus: ['TEM-001']});
m.add('ORI-002', '250g', 1);
t('café fuera de la lista no recibe 15%', m.$('#cartRefRow').hidden && /41[.,]900/.test(m.$('#cartTotal').textContent));
m.add('TEM-001', '250g', 1);
t('café en la lista sí: 15% de $45.900 = $6.885', /6[.,]885/.test(m.$('#cartRefVal').textContent));

/* ── D · caducidad e idioma ─────────────────────────────────────── */
m = mount('', {pre: JSON.stringify({c: 'ERIKPUE-001', ts: Date.now() - 61 * 864e5, used: false})});
t('el código caduca a los 60 días', m.$('#refBar').hidden);
m = mount('?ref=ERIKPUE-001');
m.click(m.$$('.lang__op').find(b => b.dataset.lang === 'en'));
t('el aviso se traduce al inglés', /off your first order/.test(m.$('#refBar').textContent));
t('rf.sub ya no promete 800 puntos en ningún idioma', !/800/.test(SRC.i18n.match(/'rf\.sub':'[^']*'/g).join(' ')));
t('programa de puntos: descuentos solo en origen', (SRC.html.match(/descuento permanente en referencias de origen/g) || []).length === 2);

/* ── E · Origen y exclusiones ───────────────────────────────────── */
m = mount('?ref=ERIKPUE-001');
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
m = mount('');
m.add('ORI-002', '250g', 1);
t('el carrito tiene el campo de código', !!m.$('#cartRefCode') && !!m.$('#cartRefApply'));
t('sin código no hay descuento', m.$('#cartRefRow').hidden);
m.$('#cartRefCode').value = 'abc'; m.click(m.$('#cartRefApply'));
t('código inválido muestra error y no activa nada', m.$('#cartRefMsg').classList.contains('is-bad') && m.$('#refBar').hidden && m.$('#cartRefRow').hidden);
m.$('#cartRefCode').value = '<script>-001'; m.click(m.$('#cartRefApply'));
t('código con HTML se rechaza', m.$('#refBar').hidden && m.w.localStorage.getItem('ccc_ref_v1') === null);
m.$('#cartRefCode').value = ' erikpue-001 '; m.click(m.$('#cartRefApply'));
t('código válido (minúsculas y espacios) activa el aviso', !m.$('#refBar').hidden && /ERIKPUE-001/.test(m.$('#refBar').textContent));
t('código manual aplica el 15%', !m.$('#cartRefRow').hidden && /6[.,]285/.test(m.$('#cartRefVal').textContent));
t('código manual se guarda 60 días', JSON.parse(m.w.localStorage.getItem('ccc_ref_v1')).c === 'ERIKPUE-001');
t('código manual pide el WhatsApp', !m.$('#cartWaWrap').hidden);
t('código manual registra la visita en el CRM', m.w.__posts.some(p => p.body.t === 'visit' && p.body.ref === 'ERIKPUE-001' && p.body.p === 'carrito-manual'));
m.$('#cartAddr').value = 'Bogotá'; m.$('#cartWa').value = '3001234567'; m.click(m.$('#cartCheckout'));
t('el mensaje de WhatsApp lleva el código manual', /Código de referido: ERIKPUE-001/.test(m.msg()));
t('el pedido llega al CRM con el código manual', m.w.__posts.some(p => p.body.t === 'order' && p.body.ref === 'ERIKPUE-001'));
m.$('#cartRefCode').value = 'ERIKPUE-001'; m.click(m.$('#cartRefApply'));
t('un código ya usado no se reactiva', m.$('#refBar').hidden && m.$('#cartRefMsg').classList.contains('is-bad'));
m = mount('?ref=ERIKPUE-001');
m.add('ORI-002', '250g', 1);
t('con enlace, el campo muestra el código', m.$('#cartRefCode').value === 'ERIKPUE-001');
m.$('#cartRefCode').value = ''; m.click(m.$('#cartRefApply'));
t('vaciar el campo quita el descuento', m.$('#refBar').hidden && m.$('#cartRefRow').hidden);

console.log('\n\x1b[32m✓ APROBADAS: ' + ok.length + '\x1b[0m');
ok.forEach(x => console.log('   ✓ ' + x));
if (fail.length) { console.log('\n\x1b[31m✗ FALLIDAS: ' + fail.length + '\x1b[0m'); fail.forEach(x => console.log('   ✗ ' + x)); }
if (errs.length) { console.log('\n\x1b[31mERRORES JS:\x1b[0m'); errs.forEach(e => console.log('   ' + e)); }
process.exit(fail.length || errs.length ? 1 : 0);
