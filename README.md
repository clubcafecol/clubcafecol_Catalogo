# CLUBCAFECOL · Catálogo digital 2026

Tienda estática de café de especialidad. HTML + CSS + JavaScript vanilla, sin dependencias ni framework. Alojada en GitHub Pages.

---

## 1. Despliegue

Copia **todo el contenido de esta carpeta** a la raíz del repositorio `clubcafecol/clubcafecol_Catalogo`, rama `main`, y haz push.

```bash
git add -A
git commit -m "feat: carrito, 21 etiquetas, 10 idiomas, analítica, SEO y legales"
git push origin main
```

GitHub Pages reconstruye en 1–3 minutos.

### Purga de caché — importante

El sitio venía sirviendo una versión antigua a parte de los visitantes por caché de CDN. Ya está resuelto con dos medidas incluidas:

1. **Versionado de assets.** `styles.css?v=2026.08`, `script.js?v=2026.08`, `i18n.js?v=2026.08`. Cada vez que edites uno de esos archivos, sube `ASSET_VER` en `build/skus.py` y vuelve a ejecutar el build. Eso invalida la caché de forma determinista.
2. **`.nojekyll`.** Salta el procesamiento Jekyll: despliegues más rápidos y sin sorpresas con carpetas que empiezan por guion bajo.

Para forzar una purga inmediata tras publicar:

```
https://clubcafecol.github.io/clubcafecol_Catalogo/?v=YYYYMMDD
```

Y en Search Console, pide reindexación de la URL principal.

---

## 2. Actualizar el catálogo

**Nunca edites `index.html` a mano.** Se genera.

1. Edita `build/skus.py` — precios, notas de cata, puntajes SCA, SKUs, kits, testimonios, FAQ.
2. Ejecuta:

```bash
cd build && python3 build.py
```

Esto regenera `index.html`, `robots.txt` y `sitemap.xml`, y recalcula automáticamente:

- el precio por taza de cada formato,
- el índice de valor (puntos SCA por cada $1.000 de costo por taza),
- las etiquetas de mejor relación calidad-precio,
- el JSON-LD completo con las 21 fichas de producto.

### Añadir un café nuevo

1. Guarda la etiqueta como `assets/productos/<id-en-minúscula>.webp` **y** `.jpg` (760 px de ancho).
2. Agrega el diccionario correspondiente en `SKUS` dentro de `build/skus.py`.
3. Ejecuta el build.

---

## 3. Activar la analítica

Sin esto no puedes medir CAC ni ROAS, y la pauta en Meta no tiene señal de conversión.

En `build/build.py`, dentro del bloque `window.CCC_CONFIG`, completa:

```js
GA4_ID:  'G-XXXXXXXXXX',   // Google Analytics 4
META_ID: '1234567890',      // Píxel de Meta
```

Vuelve a ejecutar el build. Los eventos ya están instrumentados:

| Evento | Se dispara cuando |
|---|---|
| `view_item` | se abre la ficha de un café |
| `add_to_cart` | se agrega un producto o kit |
| `view_cart` | se abre el carrito |
| `begin_checkout` | se envía el pedido por WhatsApp (con valor e ítems) |
| `contact` | clic en cualquier CTA de WhatsApp, con la intención |
| `generate_lead` | se entrega el correo para el catálogo |
| `subscribe` | clic en un plan del Club |
| `quiz_complete` | se termina el test, con el café recomendado |
| `filter_catalog` / `sort_catalog` / `change_language` | interacción con el catálogo |

Recomendado además: configurar la **Conversions API** de Meta en servidor para recuperar las conversiones que pierde el bloqueo de cookies.

---

## 4. Videos del hero

Coloca hasta cuatro archivos en `assets/videos/`:

```
video-01.mp4   video-02.mp4   video-03.mp4   video-04.mp4
```

Recomendación técnica: H.264, 1080p o 720p, **sin pista de audio**, 6–10 segundos, menos de 3 MB cada uno.

El reproductor:

- fuerza `muted`, `playsInline` y `autoplay` por JavaScript, que es lo que exigen iOS y Android — no basta con los atributos HTML;
- si el navegador bloquea el autoplay, reintenta al primer gesto del usuario (toque, clic, scroll o tecla);
- rota los clips con cross-fade cada 8 segundos;
- si los archivos no existen o fallan, oculta el video y deja el degradado de marca. La página nunca se rompe;
- respeta `prefers-reduced-motion`.

---

## 5. Estructura

```
├── index.html              ← GENERADO, no editar
├── styles.css
├── script.js               ← carrito, i18n, quiz, modal, video, analítica
├── i18n.js                 ← 10 idiomas
├── robots.txt              ← GENERADO
├── sitemap.xml             ← GENERADO
├── .nojekyll
├── build/
│   ├── skus.py             ← FUENTE DE VERDAD: precios, SKUs, kits, FAQ
│   └── build.py            ← generador
├── legal/
│   ├── politica-datos.html      ← Ley 1581 de 2012
│   ├── envios-devoluciones.html ← Ley 1480 de 2011
│   ├── terminos.html
│   └── legal.css
└── assets/
    ├── productos/          ← 21 etiquetas (WebP + JPG)
    ├── img/logo.jpg
    ├── pdf/Catalogo_CLUBCAFECOL_2026_B2C.pdf
    └── videos/             ← los añades tú
```

---

## 6. Cómo funciona el carrito

No hay pasarela de pago: el carrito **arma el pedido** y lo entrega consolidado en **un solo mensaje** de WhatsApp.

- Persiste en `localStorage`, así que sobrevive a recargas y cierres de pestaña.
- Selector de molienda por línea (7 opciones). Los drips no lo muestran: ya vienen listos.
- Barra de progreso hacia el envío gratis desde $85.000.
- Campos de ciudad y nota para el tostador.
- El mensaje sale formateado con variedad, proceso, puntaje SCA, molienda, cantidades y subtotal.

Esto sustituye los 105 enlaces sueltos de WhatsApp que había antes, donde cada clic abría una conversación distinta.

Cuando el volumen justifique cobrar en línea, el siguiente paso natural es integrar **Wompi, Mercado Pago o ePayco** sobre este mismo carrito: la estructura de datos ya está lista.

---

## 7. Dominio propio

Es la mejora pendiente de mayor impacto. Un subdominio `github.io` con ruta anidada transmite «proyecto de código», no marca de café premium, y limita la autoridad de dominio.

1. Compra `clubcafecol.com`.
2. Crea un archivo `CNAME` en la raíz del repositorio con una sola línea: `clubcafecol.com`.
3. En el DNS del proveedor, apunta los registros `A` a las IP de GitHub Pages y crea un `CNAME` de `www` hacia `clubcafecol.github.io`.
4. En **Settings → Pages**, activa *Enforce HTTPS*.
5. Reemplaza la constante `SITE` en `build/skus.py` y vuelve a ejecutar el build para que se actualicen canonical, hreflang, sitemap y JSON-LD.

---

## 8. Pendientes conocidos

- **Testimonios**: los seis incluidos son marcadores de posición realistas. **Sustitúyelos por reseñas verificables antes de publicar** — testimonios inventados exponen a sanciones bajo el Estatuto del Consumidor y destruyen la confianza si se detectan.
- **Documentos legales**: son una base sólida, no un dictamen. Conviene revisión de un abogado y, si aplica, registro de bases de datos ante el RNBD de la SIC.
- **Notas de cata**: en algunos lotes el texto de la etiqueta impresa y el del sitio no coinciden exactamente (por ejemplo Wush Wush). Vale la pena unificar la fuente de verdad.
- **Kits**: los precios de `BDL-001` a `BDL-004` son propuestas de margen. Valídalos con el CFO antes de publicar.
