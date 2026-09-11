# Registro de decisiones · PAUSA → APK

Formato: cada entrada indica **qué** se decidió, **por qué** y **alternativas descartadas**. Las fechas son de 2026.

## 0. Diagnóstico del entorno (10 sep)

| Elemento | Hallazgo | Acción |
|---|---|---|
| SO | Windows 10 Home 22H2 (build 19045), sin permisos de administrador asumidos | Todo se instala en la carpeta de usuario o dentro del proyecto |
| Node / npm | v24.13.0 / 10.3.0 | Se reutiliza (cumple el mínimo de Vite y Capacitor) |
| git | 2.53.0 | Se reutiliza |
| Java | JDK 21.0.11 LTS (Eclipse Adoptium) y JDK 25 instalados; `JAVA_HOME` de usuario apunta a un JDK 18 obsoleto | Se usa el JDK 21 (ver D-01) |
| Android SDK | Ya existe en `%LOCALAPPDATA%\Android\Sdk`: platforms 29, 32, 36.1; build-tools 36.0.0 y 37.0.0; platform-tools 37.0.0 (adb 1.0.41); licencias aceptadas; `ANDROID_HOME` definida a nivel de usuario | Se reutiliza; se instala lo que falte con `sdkmanager` |
| Android Studio | Instalado (`C:\Program Files\Android\Android Studio`) | Se reutiliza su SDK; no se abre para compilar |
| Gradle | 7.4.2 en el PATH (obsoleto); caché de wrapper 9.4.1 ya descargada | Se usa siempre `gradlew.bat` del proyecto, nunca el Gradle del PATH |
| Playwright | Chromium 1208 y 1228 en caché de usuario | Se reutiliza para el QA visual |
| Disco | C: 43,8 GB libres · E: 446 GB libres (el proyecto vive en E:) | Suficiente |
| Ruta del proyecto | Contiene un espacio ("MVP Hackathon") | Se vigila en Gradle/Capacitor; se reporta antes de mover nada |

### D-01 · JDK: usar el 21 sin tocar `JAVA_HOME` global
- **Qué:** el build de Android usa `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`, inyectado solo en la invocación de `gradlew.bat` (variable de entorno del proceso) y fijado en `android/gradle.properties` como `org.gradle.java.home`.
- **Por qué:** el `JAVA_HOME` de usuario apunta a un JDK 18 que probablemente usan otras herramientas del equipo (hay tooling de SAP/UI5 y Cordova instalados globalmente). Cambiarlo a ciegas podría romper otros proyectos. Fijarlo por proyecto es reproducible y no requiere administrador.
- **Descartado:** cambiar `JAVA_HOME` de usuario (efecto colateral fuera del proyecto); usar el JDK 25 (más nuevo que lo que la plantilla de Capacitor/AGP declara soportar en el momento de la consulta; ver D-10).

### D-02 · El original se conserva en `legacy/index.html`
- **Qué:** copia byte a byte del `index.html` previo a la migración (97 679 bytes, commit `d1da217`).
- **Por qué:** entregable D7 y referencia de paridad funcional.

## 1. Sistema de color (Fase 2)

### D-03 · Paleta base intacta; tonos derivados con rol
- **Qué:** se mantienen `#00A0DF`, `#003B5C`, `#FF5C35`, `#2FA84F`, `#FDF3E3`. Solo se agregan tonos derivados de esos cinco (mezclas lineales con blanco, negro o entre sí), cada uno con un rol semántico. Ningún matiz nuevo.
- **Por qué:** decisión del equipo (sección 5 del prompt). El azul `#00A0DF` y el naranja `#FF5C35` no alcanzan 4,5:1 sobre blanco ni sobre crema, así que pasan a ser acentos no textuales; sus variantes oscuras hacen el trabajo de texto y de relleno de botón.
- **Cómo se midió:** `scripts/contraste.mjs` (fórmula de WCAG 2.2). La tabla completa está en `docs/sistema-de-diseno.md`.

### D-04 · Tonos derivados y sus roles
- **Qué:** `#0077B6` (azul oscurecido) es el primario de relleno; `#3F697E` (navy 75 % + crema 25 %) es el texto secundario; `#B23A17` y `#1E7A3A` son los colores de alerta y éxito para texto e íconos; `#00A0DF`, `#FF5C35` y `#2FA84F` quedan como acentos no textuales. Tintes al 12 % para chips y botón tonal. Recetas y roles en `docs/sistema-de-diseno.md` §2.
- **Por qué:** con `scripts/contraste.mjs` se midió que los tres colores base fallan 4,5:1 sobre blanco y crema (2,96 / 3,07 / 3,07) y que `#00A0DF` falla incluso 3:1 como componente. Los derivados pasan todos (tabla en `docs/contraste-tabla.md`: 32 de 34 pares; los 2 restantes son decorativo y deshabilitado).
- **Descartado:** introducir un gris neutro nuevo para texto secundario (matiz fuera de paleta); mantener el gradiente de botón (su extremo claro falla).

### D-05 · Tipografía: Signika (OFL) en lugar de Nunito, como sustituto abierto de Foco
- **Qué:** Signika variable 300–700, subconjunto latino (42 KB), empaquetada en el proyecto; se usan solo 400, 600 y 700. Licencia OFL 1.1 copiada en `docs/maquetas/fonts/OFL-Signika.txt`.
- **Por qué:** el sitio de Pacífico usa Foco (Dalton Maag), propietaria. Medición con fontTools: Signika es la más cercana en forma (humanista, terminales suavizados) y en anchura (0,545 vs 0,543 de "n"/em). Nunito, la actual, es geométrica redondeada y no comparte esa construcción. Fuente local porque la app debe funcionar sin conexión.
- **Descartado:** Cabin (más neutra, pierde el carácter redondeado); mantener Nunito desde Google Fonts (CDN, y menos afín a Pacífico).

### D-06 · Elevación: dos niveles, sin sombra en botones ni campos
- **Qué:** nivel 1 = blanco + hairline `#D7D7CF` solo para grupos accionables; nivel 2 = sombra azulada `0 12px 32px -8px rgba(0,59,92,.28)` solo para sheet, visor y toast. Todo lo demás, sobre la crema.
- **Por qué:** el legado usaba una sola sombra para todo (tarjetas, campos, botones redondos, píldoras), así que la elevación no significaba nada. Pacífico usa sombras cortas y azuladas (`rgba(1,125,167,.27)`).

### D-07 · Botones píldora planos de 48 dp
- **Qué:** primario relleno `#0077B6`, tonal (tinte azul + navy), contorno (navy 1,5 px), texto subrayado. Todos de 48 dp y radio completo. Sin gradiente ni sombra.
- **Por qué:** Pacífico usa `height:44px; border-radius:24px`; 48 dp cubre Material y Apple HIG. El gradiente fallaba contraste.

### D-08 · Escala tipográfica de 6 pasos y 3 pesos
- **Qué:** display 32/40·700, headline 24/32·700, title 18/24·600, body 16/24·400, label 14/20·600, caption 13/18·400. Sin mayúsculas espaciadas ni cadenas con puntos medios.
- **Por qué:** el legado tenía 37 declaraciones de 800 y ninguna de 400: la jerarquía estaba aplanada. M3 reserva los pesos altos para títulos y etiquetas.

### D-09 · Loader de respiración: relleno `#0077B6` con texto en dos capas
- **Qué:** el texto "Inhala"/"Exhala" se pinta en navy sobre la crema y, duplicado, en blanco dentro del contenedor del relleno con contra-transformación. Ciclo 4 s + 6 s configurable por token; la salida espera el fin de la fase.
- **Por qué:** un solo color de texto no cumple contraste sobre ambos fondos (navy sobre `#00A0DF` = 3,99:1 y blanco sobre `#00A0DF` = 2,96:1). Con dos capas cada zona pasa: 10,73:1 y 4,87:1. El relleno se anima con `translateY`, no con `height`.
- **Descartado:** relleno `#00A0DF` (obliga a texto grande y falla como componente); cambiar el color del texto en un umbral (parpadeo en el cruce).

### D-10 · Versiones verificadas del stack (10 sep, npm y documentación oficial)
| Paquete | Versión | Nota |
|---|---|---|
| @capacitor/core, cli, android | 8.5.1 | Plantilla: minSdk 24, compileSdk 36, targetSdk 36, AGP 8.13.0, Gradle 8.14.3; `capacitor-android` compila con Java 21 |
| @capacitor/app · haptics · splash-screen · filesystem · share · browser · app-launcher | 8.1.1 · 8.0.2 · 8.0.2 · 8.1.3 · 8.0.1 · 8.0.4 · 8.0.1 | `@capacitor/system-bars` no existe: SystemBars viene en core; `App.openUrl` no existe: se usa `AppLauncher.openUrl` para `mailto:` |
| @capacitor/assets | 3.0.5 | Ícono adaptativo y splash |
| motion | 13.2.0 (MIT) | `import ... from "motion/react"` |
| @lottiefiles/dotlottie-react | 0.19.16 (MIT) | Solo si hace falta |
| vite · @vitejs/plugin-react · react · typescript | 8.3.0 · 6.1.1 · 19.3.0 · 7.0.2 | Vite 8 exige Node 20.19+ o 22.12+ (tenemos 24.13) |
| vite-plugin-pwa · workbox | 1.3.0 · 7.4.1 | PWA |
| @playwright/test | 1.63.0 | QA visual; en local se usa `playwright-core` con el canal `msedge` ya instalado, sin descargar navegadores |
| Android cmdline-tools | `commandlinetools-win-15859902_latest.zip` | Solo si falta algún paquete del SDK |

- **Edge-to-edge:** `adjustMarginsForEdgeToEdge` fue eliminado en Capacitor 8; se configura `plugins.SystemBars` (`insetsHandling: "css"`) y se usa `var(--safe-area-inset-*, env(safe-area-inset-*))`. En Android 16 (API 36) `windowOptOutEdgeToEdgeEnforcement` está deshabilitado; con target 36 no hay opt-out.
- **Google Play:** desde el 31 de agosto de 2026 las apps nuevas deben apuntar a API 36; la plantilla cumple (fuera de alcance publicar, pero el APK queda alineado).
- **JDK:** Gradle 8.14.3 no soporta JVM 25, y `capacitor-android` exige 21: se usa el Temurin 21 (ver D-01).

### D-11 · PHQ-4 en español: se deriva de las traducciones oficiales "Spanish for Peru"
- **Qué:** los 4 ítems se toman de `PHQ9_Spanish_for_Peru.pdf` (ítems 1 y 2) y `GAD7_Spanish_for_Peru.pdf` (ítems 1 y 2), descargados de phqscreeners.com el 10 de septiembre y guardados en `docs/fuentes/`.
- **Por qué:** phqscreeners.com no publica un PHQ-4 en español, pero su documento "PHQ and GAD-7: Other translations" indica textualmente que "the abbreviated versions of these measures – PHQ-8, PHQ-2, GAD-2, and PHQ-4 – can simply be derived from the translations by selecting the relevant items", y que los screeners y traducciones se pueden reproducir sin permiso. No se redacta ningún ítem propio.

### D-12 · Fuentes normativas del certificado: qué se verificó y qué no
- **Verificado (gob.pe, UGEL 09 Huaura, requisitos para licencias por incapacidad):** el certificado particular vale "solo para los primeros 20 días del año" y debe detallar "apellidos y nombres, edad, DNI, diagnóstico-CIE, periodo del descanso en números y letras, sello y firma del médico autorizado-habilitado por el Colegio Médico del Perú".
- **Verificado (El Peruano, Jurídica 697):** los primeros 20 días los paga el empleador; desde el día 21 EsSalud subsidia mediante CITT; el canje debe presentarse "dentro de los 30 primeros días hábiles".
- **Verificado (Zaccaro et al., 2018):** "slow breathing techniques (<10 breaths/minute)".
- **Sin fuente verificable en línea:** la Directiva 015-GG-ESSALUD-2014 (no cargó), el texto oficial de la Ley 31572 (solo fuentes secundarias: 12 horas continuas como lapso diferenciado para ciertos teletrabajadores), la reserva del diagnóstico frente al empleador (Ley 29733, PDF escaneado) y el texto oficial CIE-10 en español (solo secundarias: F43.2 "Trastornos de adaptación", Z73.0 "Agotamiento"). En la interfaz no se afirmará nada que dependa de estos puntos.
- **Línea de salud mental del MINSA:** 113 opción 5, gratuita, 24 horas (títulos de páginas oficiales de gob.pe y afiche del MINSA; los números de WhatsApp aparecen solo en extractos y no se mostrarán).

## 2. Arquitectura y migración (Fase 3, 11 sep)

### D-13 · `evaluarDescanso()`: tabla de decisión (SIMULACIÓN PARA EL PROTOTIPO)
| Entrada | Regla | Efecto |
|---|---|---|
| Base | siempre | 3 días |
| Patrón laboral | días sin desconectar > 12 h ≥ 7 | +1 |
| Patrón laboral | días sin desconectar > 12 h ≥ 14 | +1 adicional |
| Patrón laboral | noches con actividad después de las 11 pm ≥ 3 | +1 |
| Pre-consulta | PHQ-4 total 6–8 | +1 |
| Pre-consulta | PHQ-4 total 9–12 | +2 |
| Reloj | conectado y sueño promedio < 6 h | +1 |
| Acotación | resultado en [3, 7] | |
| Presentador | escenario forzado 3–7 | sustituye el resultado |
- **Salida:** días, fecha de inicio (día de la teleconsulta), fin, reincorporación, frase de fundamento en lenguaje claro y médico que indica. Con los datos de la demo: 5 días sin reloj y PHQ-4 bajo; 6 con reloj; 7 con reloj y PHQ-4 ≥ 6.
- **Por qué:** la persona no elige los días; el prototipo necesita un criterio reproducible y explicable en la pantalla "Tu indicación de pausa". No es un criterio clínico: la tabla está marcada como simulación en el código (`src/logic/evaluarDescanso.ts`) y aquí.

### D-14 · Stack: Vite 8 + React 19 + TypeScript 7 + Motion 13 + Capacitor 8.5.1
- Un único motor de animación (Motion); no se agregó dotLottie porque ninguna animación necesitó assets vectoriales de terceros (el loader, el anillo, las barras y la tira de calendario se construyen en código).
- Navegación con pila propia (`src/nav/store.tsx`): `history.pushState` por avance, `popstate` = atrás, y en Android `App.addListener('backButton')` cierra capas → pila → minimiza en la raíz.
- Sin marco de teléfono en nativo ni en PWA instalada; en navegador de escritorio (≥ 768 px) se muestra un marco de 390×844 con la hora real, para proyectar.

### D-15 · Loaders de respiración: dónde sí y dónde no
- **Sí:** búsqueda de médico (1 ciclo = 10 s), sala de espera (3 ciclos = 30 s, con contador) y emisión del certificado (1 ciclo). Las cargas simuladas duran fases completas; la salida solo ocurre al terminar una exhalación.
- **No:** el trámite (checklist de 800 ms por paso), la conexión del reloj (1,4 s) y cualquier carga dentro de una pantalla. En un pitch de pocos minutos cada ciclo completo cuesta al menos 6 s de tiempo muerto; por eso el modo presentador (mantener la marca 2 s, o `?demo=rapido`) reduce todos los loaders a un ciclo.
- El reloj de fases usa temporizadores, no eventos de fin de animación: si el WebView deja de pintar (pantalla parcialmente tapada, pestaña en segundo plano) el ritmo no se congela y la animación se pone al día al volver.
- Contraste verificado en las dos capas del texto (10,73:1 sobre crema y 4,87:1 sobre el relleno) y en movimiento reducido (navy sobre el tinte azul, 10,39:1).

### D-16 · Empleador: dos destinatarios y confirmación explícita
- **Qué:** la pantalla "Tu empleador verá esto" obliga a elegir entre *Jefe directo* (aviso de ausencia, sin diagnóstico ni datos clínicos, adjunto: aviso) y *Recursos Humanos* (remite el certificado; el cuerpo del correo tampoco repite el diagnóstico). Muestra el correo completo y exige marcar "Entiendo qué recibirá…" antes de continuar.
- **Por qué:** la práctica peruana exige el diagnóstico dentro del certificado (requisitos de licencias por incapacidad en gob.pe), pero nada obliga a repetirlo en el texto del correo ni a enviárselo al jefe directo. Separar destinatarios reduce la exposición del dato sensible al mínimo necesario.
- **Copy corregido:** "Tú eliges qué datos recoge PAUSA" (Inicio y Perfil) habla de lo que la app mide; lo que ve el empleador se decide en esta pantalla, y el Perfil lo aclara en una línea.

### D-17 · Certificado: contenido y límites
- Contiene nombres y apellidos, edad, DNI, diagnóstico CIE-10 (F43.2), período en números y letras con inicio y fin, reincorporación, fecha de emisión, médico con CMP, firma y sello (placeholders), número de verificación y el contador de días acumulados en el año.
- Marca de agua diagonal "CASO FICTICIO · PROTOTIPO SIN VALIDEZ LEGAL" y pie de prototipo. Maquetación propia: sin logos ni estructura del CMP o del CITT.
- El código CIE-10 se mantiene fijo en F43.2 porque no hubo fuente oficial accesible para justificar un cambio; queda como dato del médico ficticio.

### D-18 · Descargas y correo en nativo
- Descargas: se rasteriza el SVG a PNG en un canvas, se escribe en `Directory.Cache` con `@capacitor/filesystem` y se abre la hoja de compartir con `@capacitor/share`. En web se conserva la descarga del navegador.
- Correo y teléfono: `AppLauncher.openUrl` para `mailto:`, `tel:` y las URL de Gmail/Outlook, de modo que siempre salgan del WebView. En web, `window.open`.

### D-19 · QA visual con Playwright sin descargar navegadores
- `scripts/capturas.mjs` usa `playwright-core` con `channel: 'msedge'` (Edge ya instalado). Recorre el flujo completo con `?demo=rapido`, en 360×800 y 412×915, con `reducedMotion` en `no-preference` y `reduce`, y detecta desbordes horizontales y errores de consola. `FONT_SCALE=1.3` repite la corrida con la fuente al 130 %.
- **Por qué:** el navegador integrado de la sesión no pintaba fotogramas (0 llamadas a `requestAnimationFrame` en 500 ms), así que no servía para verificar animaciones.

### D-20 · iOS
- Este equipo es Windows: no hay build nativo de iOS (requiere macOS con Xcode 26+). El iPhone usa la PWA. Limitaciones documentadas en `docs/COMO-INSTALAR.md` §B, verificadas el 10 sep: sin API de vibración en Safari (caniuse/MDN), Web Push solo en apps añadidas a la pantalla de inicio, exención del borrado de almacenamiento a los 7 días para las apps de la pantalla de inicio (WebKit). Los pasos para compilar en una Mac quedan en D6 §D.

## 3. Build, QA y publicación (Fases 6 a 8, 11 sep)

### D-21 · APK de depuración
- `entregables/PAUSA-debug.apk`: **4,85 MB**; `pe.pausa.hackathon` v1.0 (1); compileSdk 36, targetSdk 36, minSdk 24; permisos: INTERNET y VIBRATE. Firmado con la clave de depuración de Android (no sirve para tiendas; fuera de alcance).
- Compilado con `node scripts/build-apk.mjs`: Vite build → `cap sync` → `gradlew.bat assembleDebug` con `JAVA_HOME` apuntando al Temurin 21 solo en ese proceso. Gradle 8.14.3 y AGP 8.13.0 se descargaron al caché de usuario; la plataforma android-36 y las dependencias las resolvió Gradle sin instalar `cmdline-tools`.
- Incidencia: la primera corrida quedó sin salida visible porque el registro pasaba por `tail`; se relanzó con el log en archivo y terminó en 57 s (tareas ya cacheadas). No se detectó ningún problema por el espacio en la ruta del proyecto.

### D-22 · Resultados del QA visual
- `scripts/capturas.mjs` recorrió el flujo completo (37 capturas por configuración) en 360×800 y 412×915, con y sin `prefers-reduced-motion`, y una quinta corrida a 360×800 con la fuente al 130 %. Resultado: **0 errores de consola y 0 desbordes horizontales** en las cinco corridas (`docs/capturas/informe.json` e `informe-fs1.3.json`).
- Hallazgos corregidos durante el QA: el bottom sheet quedaba bajo el CTA (ahora se monta con un portal en la raíz de la app); el botón "Entrar" de la sala de espera era azul sobre azul (ahora superficie blanca); el rótulo de la semana se partía; "11" salía en cifra dentro de la frase del médico.
- Verificación de la PWA sin conexión con el build de producción: service worker activo, manifest con 3 íconos y `display: standalone`, y la app navega (ingreso → reloj) con la red desconectada y la fuente Signika cargada desde caché.
- **No verificado:** rendimiento a 60 fps en un Android de gama media (no hay medición en dispositivo todavía) y el comportamiento real de la háptica, la hoja de compartir y el botón atrás en el teléfono; queda para el QA en dispositivo cuando se autorice la instalación por adb.

### D-23 · Publicación en GitHub Pages: ejecutada el 11 sep con aprobación del usuario
- El flujo `.github/workflows/pages.yml` (manual, `workflow_dispatch`) construye `dist/` y lo publica con `actions/deploy-pages`. Tras el "Apruebo todo" del usuario: `git push` de los 5 commits a `origin/main`, cambio de la fuente de Pages de `legacy` (rama main, raíz) a `workflow` con `gh api -X PUT .../pages -f build_type=workflow`, y ejecución del flujo (run 34568344241, correcto). Verificado en vivo: https://angel5002.github.io/MVP-Hackathon/ responde 200 con la nueva app, `manifest.webmanifest` y `sw.js` disponibles, service worker activo y navegación ingreso → reloj sin errores de consola.
- Nota: entre el push y el fin del flujo (unos 2 minutos) la URL sirvió el `index.html` de Vite sin compilar. El prototipo anterior sigue accesible en el repositorio como `legacy/index.html`; ya no se sirve en la URL pública.
- `base: './'` en Vite permite que el mismo build funcione bajo `/MVP-Hackathon/` y dentro del APK.

### D-24 · QA en dispositivo real: completado
- Teléfono: Xiaomi 25100RA69G, Android 16 (API 36), HyperOS, 1080×2392 a 450 dpi (384×850 dp). Instalación por `adb install -r`: `Success` (el primer intento lo canceló HyperOS hasta abrir Opciones de desarrollador).
- HyperOS bloquea `input tap/keyevent` desde adb salvo con "Depuración USB (ajustes de seguridad)"; el usuario la activó. `scripts/qa-dispositivo.mjs` conecta Playwright al WebView por DevTools (`adb forward … webview_devtools_remote_<pid>`), captura con `screencap` y prueba el botón atrás físico con `keyevent 4`.
- Resultado (30 capturas en `docs/capturas/dispositivo/`, `resumen.json`, `logcat.txt`): sin errores de JavaScript ni del WebView; insets reales `--safe-area-inset-top: 39px` y `bottom: 47px`, nada tapado por las barras; loader de respiración a pantalla completa; **botón atrás físico**: Correo → "Tu empleador verá esto" → Proceso, y en la raíz la app se minimiza (`com.miui.home` al frente) y sigue viva; **descarga**: abre `ChooserActivity` (hoja de compartir de Android) con el PNG; el único mensaje de error es "Share canceled", esperado porque nadie eligió destino.
- **Defectos encontrados en el dispositivo y corregidos:** (1) el contenedor del botón fijo interceptaba el toque en la casilla de confirmación del empleador (ahora `pointer-events: none` en el contenedor y más margen de scroll); (2) el service worker de la PWA también se registraba dentro del APK y sirvió CSS antiguo desde su caché tras reinstalar: ahora solo se registra fuera de Capacitor; (3) el botón de la pantalla inferior se transparentaba bajo los botones del visor (fondo del visor ahora opaco).
- **No verificado con instrumentos:** háptica (no se puede medir por adb; probar a mano con la lista de `docs/COMO-INSTALAR.md` §C) y fluidez a 60 fps (sin trazas de rendimiento; la observación por DevTools no mostró jank en las transiciones ni en el loader).

## 4. Rediseño visual v2 (11 sep, pedido del usuario tras probar en el teléfono)

### D-25 · Nueva capa visual inspirada en stoic., con el azul de Pacífico como firma
- **Qué:** fondo neutro casi blanco, tinta casi negra, tarjetas con sombra suave, tarjeta héroe oscura, DM Sans, barra inferior de 5 posiciones con botón central, alerta como tarjeta héroe, gráfico con eje de horas, loader "mar con ola y carita" y teleconsulta a pantalla completa. Detalle y tabla de cambios en `docs/sistema-de-diseno.md` §10.
- **Por qué:** el usuario pidió capturar la esencia del loader de referencia (Mobbin), corregir la alerta "mal optimizada en dispositivos", hacer legible el gráfico (no tenía horas), dar a la app un aspecto más profesional al estilo de stoic. y hacer más amable la pantalla de llamada, que dejaba un hueco debajo. Autorizó reescribir las restricciones de la Fase 2 (paleta cerrada y crema de fondo) y usar los recursos que hicieran falta.
- **Se conserva de Pacífico:** el azul `#00A0DF` como acento en el logo, el botón central, los brillos y el mar del loader; los tonos de alerta y éxito; el tono de voz.
- **Descartado:** añadir Lottie para la carita (bastó un SVG con Motion, sin assets de terceros ni licencias que registrar); botón primario azul (compite con el acento y resta sobriedad).
- **Referencias consultadas:** las dos pantallas de stoic. se leyeron a resolución completa desde la sesión de Chrome del usuario (Mobbin bloquea el acceso automatizado); el loader, desde `imgs/`.

### D-26 · Segunda revisión visual (11 sep, tarde)
- **Qué:** barra inferior fuera de la transición entre pantallas (fundido entre pestañas), carita que recorre la ola en bucle, ilustración animada en el ingreso (referencia: introducción de stoic. en Mobbin, adaptada a los tonos azules de PAUSA), márgenes del ingreso en teléfono y en el marco de escritorio, y redistribución de botones largos como filas. Detalle en `docs/sistema-de-diseno.md` §10.4.
- **Defecto encontrado y corregido:** la regla `.breath__sea svg { height: 100% }` alcanzaba también al SVG de la carita al envolverla en un contenedor sin alto, dejándola en 0 px durante la exhalación; la regla ahora aplica solo al hijo directo.
- **Por qué:** pedido del usuario tras revisar el APK y la web publicada.

### D-27 · Tercera revisión visual (11 sep, noche)
- **Qué:** transición direccional entre pestañas con la barra fija (en lugar del fundido), pasada de rendimiento (sin filtros animados, sombras cortas, tarjeta héroe persistente, capas promovidas), portada del ingreso con el pájaro de PAUSA recreado en SVG, y certificado/aviso con el formato de la maqueta del equipo y QR real. Detalle en `docs/sistema-de-diseno.md` §10.5.
- **Por qué:** el usuario señaló que la transición de pestañas se había quitado en lugar de arreglarse, que la app se sentía con tirones tras el ingreso, que la ilustración del ingreso debía ser bonita como el pájaro de la referencia, y entregó la maqueta del certificado (sin firma, con QR).
- **Dependencia nueva:** `qrcode` 1.5.4 (MIT) para generar el QR de validación en el SVG del certificado y del aviso; se usa la API síncrona `QRCode.create` para no cambiar la firma de `certSVG()`.
- **Marca de Pacífico en el documento:** se compone tipográficamente (onda + "Pacífico Seguros"); no se usa el logotipo oficial.

### D-28 · Retícula de listas y pájaro fiel (11 sep, madrugada)
- **Qué:** primitivas `Seccion` y `Lista` en `components/ui.tsx` aplicadas en todas las pantallas; iconos de fila a 40 px sin margen; textos explicativos convertidos en notas al pie; Perfil centrado; pájaro redibujado con la geometría de la referencia de stoic.; tarjeta de ingreso oscura recuperada con margen. Detalle en `docs/sistema-de-diseno.md` §10.6.
- **Por qué:** el usuario mostró Perfil y Documentos con textos descuadrados (dos sangrías distintas según la fila estuviera o no dentro de una tarjeta) y pantallas saturadas, señaló que el pájaro no se parecía a la referencia y pidió recuperar el fondo de color de la tarjeta superior del ingreso.
- **Color del pájaro:** en la tarjeta navy va en blanco roto (`#F5F5F2`) porque la silueta negra de la referencia no tendría contraste sobre ese fondo; la forma es la que se conserva fiel.
- **Ajustes tras revisión:** cola corta recortada por el borde y pies iguales en el pájaro; ondas de la teleconsulta ancladas al avatar y detrás del contenido.
- **Segunda pasada del pájaro (11 sep):** el usuario señaló que el pecho tenía "panza"; se recalcó el contorno desde la referencia (lomo convexo, pecho recto, vientre en arco amplio, cola recortada, patas como dos palitos sin pies).

### D-29 · Asignación automática del médico, elección de psicólogo, descarga real y barra del sistema (11 sep)
- **Médico asignado, no elegido.** Al terminar la búsqueda, PAUSA asigna al médico mejor puntuado por el sistema de recomendación (`logic/recomendar.ts`: historial 3, disponibilidad 2, cercanía 2, presencial 0,5, valoración como desempate) y la pantalla explica que no se puede cambiar. Motivo: evitar que el asegurado busque a quien le firme un descanso (fraude). La lista de "otros médicos" se eliminó.
- **Psicólogo sí se elige**, con el **mismo** sistema de recomendación: la lista completa se muestra siempre ordenada, la primera opción lleva el motivo ("Recomendación de PAUSA, porque ya te atendió") y al tocar a alguien los horarios aparecen debajo con un fundido y la pantalla se desplaza hasta ellos. Se retiró el colapso de la lista, que dejaba una segunda tarjeta "colgada".
- **Pre-consulta:** se quitó la frase "Basado en el PHQ-4 (Kroenke et al., 2009)…" de la pantalla; la fuente sigue documentada en D-08 y en `logic/phq4.ts`.
- **Documentos solo al terminar el trámite.** Se retiró la vista previa del certificado en la pantalla "Certificado emitido"; ver, descargar y compartir se habilitan en Documentos y Proceso cuando `tramiteListo` es verdadero.
- **Descarga real en Android.** "Descargar" escribe el PNG en la carpeta pública `Documentos/PAUSA` (plugin Filesystem, `Directory.Documents`, sin permiso en Android 11+ para archivos propios, escaneado por MediaStore) y avisa con un toast; "Compartir" abre la hoja del sistema (antes "Descargar" solo compartía). En web: descarga del navegador y Web Share con archivos cuando existe.
- **Barra de navegación del sistema.** En `MainActivity` se oculta la barra de navegación en modo inmersivo (`BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE`: reaparece al deslizar desde abajo y se esconde sola) y se desactiva la franja opaca que Android pinta detrás de los tres botones (`setNavigationBarContrastEnforced(false)`). El usuario reportaba que los tres botones quedaban fijos y tapaban la app. Los insets por CSS siguen funcionando: al ocultarse la barra, `--sa-bottom` pasa a 0 y la barra de pestañas baja hasta el borde.
