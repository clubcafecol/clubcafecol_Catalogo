# Club del Café · Catálogo de Especialidad 2026

Sitio web del catálogo de cafés de especialidad 2026 de **Club del Café**. Presenta las 14 variedades cultivadas en Huila, Colombia, con sus perfiles sensoriales, procesos y datos de origen.

> Publicado vía GitHub Pages:`

---

## Estructura del repositorio

```
.
├── index.html                # Página principal
├── styles.css                # Estilos (editorial · navy + dorado)
├── script.js                 # Renderizado del catálogo, modal, interacciones
├── _config.yml               # Configuración de GitHub Pages (Jekyll)
├── README.md                 # Este archivo
└── assets/
    ├── img/
    │   └── logo.jpg          # Logo Club del Café
    ├── pdf/
    │   └── catalogo-cafes-especialidad-2026.pdf
    ├── videos/               # Videos del hero (fondo de página)
    │   ├── README.md         # Instrucciones para subir los videos
    │   ├── video-01.mp4      # ← tú los añades
    │   ├── video-02.mp4
    │   ├── video-03.mp4
    │   └── video-04.mp4
    └── variedades/           # Imágenes de las 14 etiquetas
        ├── blend-castillo.jpg
        ├── papayo.jpg
        ├── tabi-natural.jpg
        ├── geisha.jpg
        ├── bourbon-rojo-top-roast.jpg
        ├── landrace.jpg
        ├── geisha-top-roast.jpg
        ├── bourbon-aji.jpg
        ├── bourbon-sandia.jpg
        ├── natural-passion.jpg
        ├── bourbon-galleta.jpg
        ├── bourbon-sidra.jpg
        ├── wush-wush.jpg
        └── moka.jpg
```

## Características

- **Diseño editorial premium** — Tipografía serif (Cormorant Garamond) + sans-serif (Manrope), paleta navy + dorado del logo, fondo cremoso para el catálogo.
- **Carrusel de videos en el hero** — Reproduce en bucle videos de @clubcafecol con cross-fade automático. Pausa en `prefers-reduced-motion` y modo ahorro de datos. Ver `assets/videos/README.md` para añadirlos.
- **Hero animado** — Animaciones de entrada escalonadas (CSS), grano de película, gradientes radiales.
- **Catálogo en grid responsivo** — Scroll-reveal con `IntersectionObserver`, hover-overlay con perfil sensorial.
- **Modal de detalle** — Vista expandida de cada variedad con ficha completa.
- **Cursor personalizado** — Punto dorado con mix-blend-mode (desktop).
- **Descarga directa** — Botón para descargar el PDF completo del catálogo.
- **Optimizado** — Imágenes JPG comprimidas (~100 KB c/u), tipografías auto-precargadas.

## Variedades incluidas (14)

| Nº | Variedad | Proceso | Origen |
|----|----------|---------|--------|
| 01 | Blend Castillo (Caturra y Colombia) | Lavado · 48h | Pitalito, Huila |
| 02 | Papayo | Lavado · 60h | Pitalito, Huila |
| 03 | Tabi Natural | Natural · 120h | Pitalito, Huila |
| 04 | Geisha | Lavado · 48h | Pitalito, Huila |
| 05 | Bourbon Rojo Top Roast | Natural · 400h | Pitalito, Huila |
| 06 | Landrace | Natural · 80h biorreactor | Pitalito, Huila |
| 07 | Geisha Top Roast | Espirituoso · maceración | Pitalito, Huila |
| 08 | Bourbon Ají | Semi lavado · 96h | Pitalito, Huila |
| 09 | Bourbon Sandía | Natural · 120h | Pitalito, Huila |
| 10 | Natural Passion | Espirituoso · 120h | Pitalito, Huila |
| 11 | Bourbon Galleta | Espirituoso · 120h | Pitalito, Huila |
| 12 | Bourbon Sidra | Espirituoso · 120h | Pitalito, Huila |
| 13 | Wush Wush | Semi lavado · 96h | Pitalito, Huila |
| 14 | Moka | Natural · 120h | Acevedo, Huila |

## Cómo desplegar

1. **Sube los archivos** al repositorio (`main`).
2. En GitHub, ve a **Settings → Pages**.
3. En **Source**, elige `Deploy from a branch`, branch `main`, carpeta `/ (root)`.
4. Guarda. En unos minutos el sitio estará en `https://vmhd04.github.io/Cat-logo-Cafe-Especialidad/`.

## Cómo personalizar

### Cambiar textos del hero, manifiesto o footer

Edita directamente `index.html` — está estructurado con secciones claras y comentarios.

### Modificar perfil sensorial o datos de una variedad

Abre `script.js` y edita el array `varieties` (al inicio del archivo). Cada entrada tiene:
```js
{
  slug: 'nombre-archivo',       // debe coincidir con el .jpg en assets/variedades/
  name: 'Nombre de la variedad',
  sub: 'Subtítulo corto',
  profile: 'Notas sensoriales',
  process: 'Proceso de beneficio',
  fermentation: 'Tiempo / método',
  origin: 'Lugar de origen',
  altitude: 'Altura MSNM'
}
```

### Cambiar colores de la marca

Las variables CSS están centralizadas al inicio de `styles.css`:
```css
:root {
  --navy-900: #07101F;
  --gold:     #C9A961;
  --cream:    #F0E6D2;
  /* … */
}
```

### Añadir o quitar una variedad

1. Coloca la imagen en `assets/variedades/nombre-de-la-variedad.jpg`.
2. Agrega o quita el objeto correspondiente en el array `varieties` de `script.js`.
3. Si cambia el total, actualiza el contador del hero en `index.html` (`<span class="hero__meta-num">14</span>`).

## Tecnología

HTML5 + CSS3 + JavaScript vanilla. Sin dependencias, sin frameworks. Hosting estático en GitHub Pages.

## Contacto

- Instagram · [@clubcafecol](https://instagram.com/clubcafecol)
- Tel · +57 315 4510390
- Ubicación · Teusaquillo, Bogotá

---

© 2026 Club del Café · Catálogo de especialidad
