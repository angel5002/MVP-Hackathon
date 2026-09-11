# PAUSA · guía para trabajar en este repo

App móvil (APK Android + PWA) del prototipo PAUSA para la hackathon de Pacífico Seguros. Datos ficticios, sin backend.

## Comandos
- `npm run dev` · `npm run build` · `npm run typecheck`
- `node scripts/build-apk.mjs` → `entregables/PAUSA-debug.apk` (usa el JDK 21 de Adoptium solo en ese proceso; no toca `JAVA_HOME`)
- `node scripts/capturas.mjs` → QA visual con Playwright (Edge instalado, sin descargar navegadores) contra `http://127.0.0.1:5173`
- `node scripts/qa-dispositivo.mjs` → QA en el teléfono por DevTools (adb forward + CDP) con capturas `screencap`
- Parámetros de URL: `?demo=rapido` (loaders de un ciclo), `?dias=3..7`, `?previos=15`

## Dirección visual vigente (v2, 11 sep 2026)
Referencia: la app *stoic.* (Mobbin) por su sobriedad, más los toques de Pacífico. El detalle está en `docs/sistema-de-diseno.md` §10.
- Fondo gris cálido casi blanco (`--gris-050`), tinta casi negra, tarjetas blancas con sombra suave, **tarjeta héroe oscura** con brillo azul para lo importante.
- Acento Pacífico `#00A0DF` solo donde suma: logo, botón central de la barra, loader, brillos. Botón primario en tinta.
- Tipografía DM Sans (OFL, empaquetada). Etiquetas de sección en mayúsculas espaciadas pequeñas (`.eyebrow`).
- Barra inferior de 5 posiciones con botón central "Pedir ayuda", montada una sola vez en `App.tsx` (fuera de la transición de pantallas; entre pestañas solo hay fundido). La alerta del inicio es una tarjeta héroe, no un modal.
- Loader de respiración: mar azul con ola y carita que recorre la ola en bucle (`components/BreathLoader.tsx`, `components/Face.tsx`); 4 s inhala / 6 s exhala; nunca corta una exhalación. Portada del ingreso con el pájaro de PAUSA (`components/Bird.tsx`).
- Certificado y aviso (`logic/docs.ts`): formato de tarjeta con cabecera de ambas marcas, banda de título, columnas de datos, CIE-10, DESDE/HASTA, observaciones y QR real (`qrcode`); sin firma ni sello.
- Fluidez primero: nada de `filter` animado, sombras cortas, no desmontar tarjetas grandes para cambiarles el contenido; entre pestañas el contenido se desliza y la barra queda fija.
- Teleconsulta a pantalla completa con avatar, ondas de audio, anillos y la carita en la cámara propia.
- Solo se animan `transform` y `opacity`; se respeta `prefers-reduced-motion`.

## Reglas de trabajo
- Un commit por bloque de trabajo, mensajes en español. No hacer `push` ni publicar en GitHub Pages sin pedirlo (el flujo `pages.yml` es manual).
- Preguntar antes de instalar en el teléfono; en HyperOS hace falta "Instalar vía USB" y "Depuración USB (ajustes de seguridad)".
- Todo lo clínico y normativo se documenta con fuente en `docs/decisiones.md`; `evaluarDescanso()` es una simulación y debe seguir marcada así.
- La carpeta `legacy/` no se toca.
