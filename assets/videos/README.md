# Videos del hero (fondo de página)

Coloca aquí los videos de Instagram que se mostrarán como fondo del hero.

## Nombres esperados

El sitio carga estos 4 archivos (ver `script.js`, variable `videos`):

- `video-01.mp4`
- `video-02.mp4`
- `video-03.mp4`
- `video-04.mp4`

Puedes añadir o quitar entradas — solo edita el array `videos` al final de `script.js`.

## Especificaciones recomendadas

| Parámetro    | Valor                                         |
|--------------|-----------------------------------------------|
| Formato      | MP4 (codec H.264 + AAC)                       |
| Resolución   | 1280×720 o 1920×1080                          |
| Bitrate      | 1.5 – 2.5 Mbps                                |
| Duración     | 8 – 15 segundos por clip                      |
| Tamaño       | 3 – 8 MB cada uno (¡no más de 10!)            |
| Audio        | Mute / sin audio (los navegadores lo silencian de todas formas para autoplay) |
| Orientación  | Horizontal o vertical (object-fit: cover lo recortará al viewport) |

## Cómo bajarlos de Instagram

Tienes varias opciones. La más rápida sin instalar nada:

### Opción A · Online (rápido, sin instalación)
1. Copia la URL del reel/post en tu navegador (ej. `https://instagram.com/reel/XXXX/`)
2. Pega en uno de estos:
   - https://snapinsta.app
   - https://igram.io
   - https://saveinsta.app
3. Descarga el MP4.

### Opción B · yt-dlp (más control de calidad)
```bash
# Instalar
brew install yt-dlp        # macOS
# o: pip install yt-dlp

# Descargar
yt-dlp "https://www.instagram.com/reel/XXXX/" -o "video-01.mp4"
```

## Cómo comprimir si el archivo pesa demasiado

### Con HandBrake (GUI, gratis)
1. Abre HandBrake → File → Open Source → tu video
2. Preset: **Web → Vimeo YouTube HQ 720p30**
3. Tab *Video* → Quality RF: **22-24** (más alto = más comprimido)
4. Start Encode

### Con ffmpeg (CLI)
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 24 -preset slow \
  -vf "scale=1280:-2" -an -movflags +faststart video-01.mp4
```
El `-an` elimina el audio. El `-movflags +faststart` permite que el video empiece a reproducir antes de descargarse completo.

## Imagen de respaldo (recomendado)

Si quieres un poster que se vea antes de que carguen los videos, añade `poster.jpg` aquí
(idealmente un frame estático del primer video o una foto del café).

Después actualiza `index.html`:
```html
<video class="hero__video-layer is-active" ... poster="assets/videos/poster.jpg">
```

## Importante

- **Límites de GitHub:** archivos individuales hasta 100 MB, repo total hasta 1 GB recomendado.
  Si tus videos pesan más, usa Git LFS o sube los videos a Cloudinary/Bunny CDN y cambia las URLs en `script.js`.
- **Autoplay:** todos los navegadores exigen `muted` para autoplay sin interacción.
  El código ya lo aplica — no quites el atributo `muted` del `<video>`.
- **Móvil:** los videos se pausan automáticamente si el usuario tiene activado el "modo ahorro de datos".
