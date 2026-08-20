/* ═══════════════════════════════════════════════════════════════════════
   CLUBCAFECOL — suite de regresión
   Monta index.html en jsdom, ejecuta el sitio completo y comprueba
   comportamiento real: catálogo, carrito, idiomas, quiz y CSS crítico.

   Uso:
     cd tests && npm i jsdom && node suite.js
   ═══════════════════════════════════════════════════════════════════════ */
const {JSDOM} = require('jsdom');
const fs = require('fs');
const path = require('path');

const D = path.resolve(__dirname, '..');
const errs = [], ok = [], fail = [];
const t = (n, c) => (c ? ok : fail).push(n);

const dom = new JSDOM(fs.readFileSync(path.join(D, 'index.html'), 'utf8'), {
  runScripts: 'outside-only', pretendToBeVisual: true,
  url: 'https://clubcafecol.github.io/clubcafecol_Catalogo/'
});
const w = dom.window;
w.matchMedia = () => ({matches: false, addEventListener() {}, removeEventListener() {}});
w.scrollTo = () => {};
w.open = u => { w.__o = u; return null; };
w.HTMLMediaElement.prototype.play = () => Promise.resolve();
w.HTMLMediaElement.prototype.load = () => {};
w.HTMLMediaElement.prototype.pause = () => {};
w.IntersectionObserver = class {
  constructor(cb) { this.cb = cb; }
  observe(el) { this.cb([{isIntersecting: true, target: el}], this); }
  disconnect() {} unobserve() {}
};
w.onerror = m => errs.push('onerror: ' + m);

[...w.document.querySelectorAll('script:not([src])')].forEach(s => {
  if (s.type !== 'application/ld+json') {
    try { w.eval(s.textContent); } catch (e) { errs.push('inline: ' + e.message); }
  }
});
for (const f of ['i18n.js', 'script.js']) {
  try { w.eval(fs.readFileSync(path.join(D, f), 'utf8')); }
  catch (e) { errs.push(f + ': ' + e.message); }
}
w.document.dispatchEvent(new w.Event('DOMContentLoaded'));

const $  = (s, c) => (c || w.document).querySelector(s);
const $$ = (s, c) => [...(c || w.document).querySelectorAll(s)];
const click = el => el.dispatchEvent(new w.Event('click', {bubbles: true}));
const lang  = c => click($$('.lang__op').find(b => b.dataset.lang === c));

const css  = fs.readFileSync(path.join(D, 'styles.css'), 'utf8');
const html = fs.readFileSync(path.join(D, 'index.html'), 'utf8');
const mob  = css.slice(css.indexOf('@media (max-width:760px)'), css.indexOf('@media (max-width:420px)'));
const xs   = css.slice(css.indexOf('@media (max-width:420px)'));
lang('es');

/* ── 1 · estructura del catálogo ─────────────────────────────────── */
t('21 variedades', $$('.card').length === 21);
t('21 imágenes de etiqueta', $$('.card__media img').length === 21);
t('105 opciones de formato', $$('.card .fmt').length === 105);
t('8 variedades destacadas', $$('.card[data-dest="1"]').length === 8);
t('10 idiomas', $$('.lang__op').length === 10);
t('3 kits activos', $$('.bdl').length === 3);
t('3 planes de Club', $$('.club__card').length === 3);
t('4 niveles de puntos', $$('.lv').length === 4);
t('6 variedades en "los más pedidos"', $$('.raro').length === 6);
t('sin tarjetas de campeón a pantalla completa', !$('.trofeo'));
t('el campeón conserva su medalla', /Campeón Nacional/.test($('.raros').textContent));
t('titular "Los más pedidos"', /Los más pedidos/.test($('#trofeos h2').textContent));
t('el nav ya no dice "Premiados"', !/Premiados/.test($('.nav').textContent));
t('el botón del catador usa el degradado', $('[data-i18n="cat.helpCta"]').classList.contains('btn--hot'));
t('la ñapa tiene bloque propio', $$('.napasec .napa').length === 1);
t('la ñapa no se repite en el programa de puntos', $$('.lealtad .napa').length === 0);
t('sin sección de pilares', !$('.pilares'));
t('sin tabla de relación calidad-precio', !$('.valorsec'));
t('5 regiones de cultivo', $$('.origen__reg li').length === 5);

/* ── 2 · terminología ────────────────────────────────────────────── */
const visible = [...w.document.body.querySelectorAll('*')]
  .filter(e => !['SCRIPT', 'STYLE'].includes(e.tagName))
  .map(e => [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' '))
  .join(' ');
t('sin "lotes" en texto visible', !/\blotes\b/i.test(visible));
t('sin "varietal" en texto visible', !/varietal/i.test(visible));
t('badge "Variedad exclusiva"', /Variedad exclusiva/.test(visible));

/* ── 3 · carrito de punta a punta ────────────────────────────────── */
const c = $('.card[data-sku="ORI-002"]');
c.querySelector('[data-mol-sel]').value = 'prensa';
click(c.querySelector('[data-add]'));
t('agregar abre el carrito', $('#cart').classList.contains('is-open'));
t('el mensaje de vacío queda oculto', $('#cartEmpty').hasAttribute('hidden'));
t('el nombre del producto se ve', /PANELA DORADA/.test($('#cartItems').textContent));
t('la molienda viaja desde la ficha', /Prensa francesa/.test($('#cartItems').textContent));
t('campo único de ciudad y dirección', !!$('#cartAddr') && !$('#cartCity'));
t('botón "Agregar más" visible', !$('#cartAddMore').hasAttribute('hidden'));
$('#cartAddr').value = 'Cali · Cra 5 #10-20';
click($('#cartCheckout'));
const msg = decodeURIComponent(((w.__o || '').split('?text=')[1] || ''));
t('el pedido sale en un solo mensaje', (w.__o || '').startsWith('https://wa.me/573154510390'));
t('el pedido incluye entrega y molienda', /Cali · Cra 5 #10-20/.test(msg) && /Prensa francesa/.test(msg));
click($('#cartItems [data-del="0"]'));
t('al vaciar se restablece el estado', !$('#cartEmpty').hasAttribute('hidden') && $('#cartFoot').hasAttribute('hidden'));

/* ── 4 · quiz y compartir ────────────────────────────────────────── */
const pick = (q, v) => click($$('.qz__op').find(b => b.dataset.q === q && b.dataset.v === v));
pick('metodo', 'filtro'); pick('perfil', 'floral'); pick('nivel', 'experto'); pick('presupuesto', 'alto');
t('el quiz recomienda dos variedades', $$('.qzc').length === 2);
t('promoción con 3 pasos', $$('.qzpromo__pasos li').length === 3);
t('solo se comparte por Instagram', !!$('#qzShare') && !$('#qzShareWa'));

/* ── 5 · idiomas ─────────────────────────────────────────────────── */
const h1es = $('h1').textContent;
lang('de');
t('alemán traduce el titular', $('h1').textContent !== h1es);
t('alemán traduce "los más pedidos"', /meistgekauften/.test($('#trofeos h2').textContent));
t('alemán traduce los accesos de WhatsApp', /Ich möchte bestellen/.test($('#waQuick').textContent));
t('otros idiomas muestran equivalencia en USD', $$('.card__usd').length > 0);
lang('ar');
t('árabe activa RTL', w.document.documentElement.dir === 'rtl');
lang('es');
t('volver a español restaura el titular', $('h1').textContent === h1es);
t('español no muestra USD', $$('.card__usd').length === 0);

/* ── 6 · CSS crítico ─────────────────────────────────────────────── */
t('[hidden] gana a cualquier display', /\[hidden\]\{display:none!important\}/.test(css));
t('html recorta el desbordamiento sin romper sticky', /html\{overflow-x:clip\}/.test(css));
t('el carrito tiene un solo eje de scroll', /\.cart__scroll\{[^}]*min-height:0;overflow-y:auto/.test(css));
t('los flotantes no capturan clics de fondo', /\.wa\{[^}]*pointer-events:none/.test(css));
t('flotantes con respaldo físico de posición', /\.wa\{position:fixed;bottom:22px;right:22px/.test(css));
t('menú de idiomas anclado al nav en móvil', /\.lang\{position:static\}/.test(mob));
t('la marca del nav puede encogerse', /\.nav__brand\{[^}]*min-width:0;flex-shrink:1/.test(css));
t('bajo 420 px se oculta el texto de marca', /\.nav__brand span\{display:none\}/.test(xs));

/* ── 7 · llamada de atención de los CTA ──────────────────────────── */
t('CTA dorado del hero con pulso', $('[data-i18n="hero.cta1"]').classList.contains('btn--pulso'));
t('CTA "Ayúdame a elegir" con degradado animado', $('[data-i18n="hero.cta2"]').classList.contains('btn--hot'));
t('el CTA del nav queda quieto', !$('.nav__cta').classList.contains('btn--pulso'));
t('"Ver todas" del catálogo también destaca', $('#verTodos').classList.contains('btn--hot'));
['aro', 'respira', 'meneo', 'gradfluye', 'brillo'].forEach(k =>
  t('animación "' + k + '" definida', new RegExp('@keyframes ' + k + '\\{').test(css)));
t('el meneo descansa el 84 % del ciclo', /0%,84%,100%\{transform:rotate\(0\)\}/.test(css));
t('la respiración descansa el 70 % del ciclo', /0%,70%,100%\{transform:none\}/.test(css));
t('el aro no bloquea el clic', /\.btn--pulso::after\{[^}]*z-index:-1/.test(css));
t('se pausa al pasar el cursor', /animation-play-state:paused/.test(css));
t('respeta prefers-reduced-motion', /@media \(prefers-reduced-motion:reduce\)/.test(css));
t('aún no silenciado al cargar', !w.document.body.classList.contains('cta-visto'));
click($('[data-i18n="hero.cta1"]'));
t('tras el clic los CTA se calman', w.document.body.classList.contains('cta-visto'));
t('la preferencia queda en la sesión', w.sessionStorage.getItem('ccc_cta_v1') === '1');

/* ── 8 · integridad y contenido ──────────────────────────────────── */
const rec = [...new Set([...html.matchAll(/(?:src|srcset|href)="((?:assets|legal)[^"]+)"/g)].map(m => m[1]))];
t('todos los recursos existen', rec.every(p => fs.existsSync(path.join(D, p))));
const blank = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map(m => m[0]);
t('todos los enlaces externos con rel=noopener', blank.every(x => /rel="noopener/.test(x)));
const ld = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
t('JSON-LD con 21 productos', ld['@graph'].filter(x => x['@type'] === 'Product').length === 21);
t('correo de contacto actualizado', /corporacionclubdelcafe@gmail\.com/.test(html) && !/hola@clubcafecol/.test(html));
t('video de origen presente', !!$('.instagram-media'));

console.log('\n\x1b[32m✓ APROBADAS: ' + ok.length + '\x1b[0m');
ok.forEach(x => console.log('   ✓ ' + x));
if (fail.length) {
  console.log('\n\x1b[31m✗ FALLIDAS: ' + fail.length + '\x1b[0m');
  fail.forEach(x => console.log('   ✗ ' + x));
}
if (errs.length) {
  console.log('\n\x1b[31mERRORES JS:\x1b[0m');
  errs.forEach(e => console.log('   ' + e));
}
process.exit(fail.length || errs.length ? 1 : 0);
