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
