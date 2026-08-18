# Pruebas de regresión

Montan `index.html` en un navegador simulado (jsdom), ejecutan `script.js`
e `i18n.js` de verdad y comprueban comportamiento real: catálogo, carrito de
punta a punta, quiz, los 10 idiomas, el CSS crítico que ya causó fallos en
producción y la llamada de atención de los CTA.

```bash
cd tests
npm install      # solo la primera vez
npm test
```

Salida esperada: **62 aprobadas, 0 fallidas**. Cualquier fallo indica una
regresión: revísala antes de publicar.
