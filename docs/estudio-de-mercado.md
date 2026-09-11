# Estudio de mercado y de marca · PAUSA (D3)

Fecha de consulta de todas las fuentes: **10 de septiembre de 2026**, salvo indicación expresa. Cada dato lleva su fuente en la sección 6; las fuentes se clasifican como **oficial** (sitio del titular, documentación del fabricante, tienda de apps, norma o artículo indexado) o **secundaria** (prensa, blogs con autoría, comparadores). Cuando no se pudo verificar algo, se escribe "sin fuente verificable" y no se supone.

Método: descarga directa del HTML y las hojas CSS de pacifico.com.pe y medición por expresiones regulares; medición de métricas tipográficas con fontTools sobre los archivos `.woff2` servidos por el sitio y por Google Fonts; lectura de fichas de Google Play y App Store (API pública `itunes.apple.com/lookup`); lectura de la documentación oficial de Material Design 3 (archivos de tokens del repositorio de Google), Android Developers y Apple Human Interface Guidelines. Mobbin devolvió HTTP 403 al acceso automatizado y Refero solo renderiza con JavaScript; no se crearon cuentas. La referencia del loader se tomó de `imgs/`.

---

## 1. Identidad actual de Pacífico Seguros

### 1.1 Paleta medida en pacifico.com.pe

El sitio (CMS Liferay, tema `pacifico-corporativo-theme`, build del 7 de septiembre de 2026 según el parámetro `t=` del CSS) mezcla dos generaciones de estilos: un tema legado y componentes nuevos con prefijo `pacifico-`. Valores hex tal como aparecen en el CSS:

| Hex | Uso en el sitio (selector literal) | Archivo · frecuencia |
|---|---|---|
| `#0099CC` | Enlaces (`a{color:#09c}`), `theme-color`, títulos de sección, botón primario outline, relleno de 48 SVG | main.css ×83 · inline ×61 |
| `#0080AA` | Botón secundario del hero, títulos de tabs, tab activa (`border-bottom:2px solid`) | inline ×27 |
| `#0075B0` | Pie de página, degradado `linear-gradient(#0075b0,#09c)` | main.css ×36 |
| `#005C7A` | Ítems del menú y sus íconos, bordes de chips | main.css ×6 · inline ×7 |
| `#EE2C70` | **CTA primario actual** (`.pacifico-btn--secondary`, `.primary-btn{height:44px;border-radius:24px}`) | main.css ×18 · inline ×12 |
| `#FF6319` | CTA del tema legado (`.btn{border-radius:25px}`), badges | main.css ×31 |
| `#00AF3F` | Botón del banner, bordes de tabla | main.css ×22 |
| `#E8F9FF` | Fondo celeste de tarjetas y hover del botón primario | inline ×19 |
| `#585A5B` | Color del `body` (texto corrido) | main.css ×24 |
| `#444444` / `#2F373C` | Títulos de tarjetas; trazo de íconos de producto | inline ×24 / ×5 |
| `#B8C3C8` / `#BFC0C0` | Bordes de tarjetas y de controles | inline / main.css |

Lectura: el azul de Pacífico vive en una familia `#0099CC` → `#0080AA` → `#0075B0` → `#005C7A`, es decir, **el cian de marca se oscurece para todo lo que se lee o se pulsa**. Ese es exactamente el patrón que PAUSA adopta con su propio azul (sección 3). El magenta `#EE2C70`, el naranja `#FF6319`, el verde `#00AF3F` y el morado `#6837C8` son acentos de campaña que **no se incorporan** porque la paleta de PAUSA es una decisión cerrada del equipo.

### 1.2 Tipografía

- El `body` declara `font-family:"Foco","Arial",sans-serif; font-size:16px; color:#585a5b`. Los titulares del hero usan Foco 700 a 2 rem, 3 rem y 3,5 rem; los títulos de sección Foco 700 a 32/40 px.
- El sitio sirve cuatro `@font-face` propietarias desde `/o/pacifico-corporativo-theme/css/fonts/`: `foco_std_rg` (400), `foco_std_bd` (700), `foco_std_lt` (300) y su itálica. No carga nada de Google Fonts.
- **Foco es una tipografía comercial de Dalton Maag** (diseño de Fabio Haag, 2007), humanista, de bajo contraste, con terminales que evocan el trazo de pincel; se licencia por estilo. **No tiene licencia abierta**, así que no puede empaquetarse en PAUSA.
- Métricas medidas con fontTools sobre los `.woff2` del sitio y de Google Fonts:

| Fuente | x-height / em | cap-height / em | x / cap | Ancho de "n" / em | Licencia |
|---|---|---|---|---|---|
| **Foco Regular (sitio de Pacífico)** | 0,476 | 0,672 | 0,709 | 0,543 | Comercial |
| **Signika Regular** | 0,502 | 0,687 | 0,731 | 0,545 | OFL 1.1 (verificada en el repositorio) |
| Cabin Regular | 0,490 | 0,700 | 0,700 | 0,559 | OFL |
| Nunito Sans Regular | 0,486 | 0,705 | 0,689 | 0,568 | OFL |
| Nunito (la que usa el prototipo actual) | redondeada geométrica; no comparte la construcción humanista de Foco | | | | OFL |

Conclusión: **Signika** es la alternativa abierta más cercana en forma (humanista, terminales semirredondeados) y en anchura (0,545 frente a 0,543), con una x-height solo 2,6 % mayor. Cabin es la más cercana en proporción x/cap pero pierde el carácter redondeado que definió la identidad de 2011 (FutureBrand describió la tipografía como "rounded"). Se elige Signika, variable de 300 a 700, en un único archivo `woff2` latino de 42 KB empaquetado localmente.

### 1.3 Iconografía

- Íconos de producto (`salud.svg`, `soat.svg`, `vehiculares.svg`): lienzo de 72×72, `fill="none"`, `stroke="#444444"`, `stroke-linecap="round"`, sin `stroke-width` explícito (1 unidad sobre 72, trazo fino), esquinas redondeadas. Son **íconos de línea, monocromos**.
- Íconos de interfaz: menú con `stroke="#0099CC" stroke-width="2"`, chevrons de Material Icons rellenos en `#005C7A`. El sitio mezcla línea (producto) y relleno (sistema).
- La app Mi Espacio Pacífico usa íconos de línea azules sobre tiles blancos redondeados.

### 1.4 Radios y elevación

| Componente | Valor literal en el CSS |
|---|---|
| Botón primario nuevo | `height:44px; border-radius:24px` (píldora) |
| Botón del tema legado | `border-radius:25px` |
| Tarjeta de producto | `border-radius:20px; box-shadow:0 4px 10px -2px rgba(1,125,167,.27)` |
| Tarjeta genérica | `border:1px solid #b8c3c8; border-radius:1rem; box-shadow:0 4px 8px rgba(0,0,0,.1)` |
| Chips | `border-radius:8px` (el valor más frecuente) |
| Inputs legado | `border-radius:3px` |

La sombra de marca es **azulada** (`rgba(1,125,167,.27)`), no negra, y siempre corta.

### 1.5 Fotografía e ilustración

Personas reales de banco de imágenes, sonrientes, parejas y familias, luz cálida, fondos claros o exteriores; acentos turquesa en vestuario y props. Casi no hay ilustración en la web: los íconos de línea cumplen ese papel. En la app aparece la mascota 3D "Torito de Pacífico" y las capturas de tienda usan un degradado cian→morado con mockups de iPhone.

### 1.6 Tono de voz

Textos literales del sitio: "¿Qué quieres hacer hoy?", "Descubre el valor de no estar solo", "¡Vamos! Estás a un paso de obtener tu seguro y vivir tranquilo", "Protegemos la felicidad de las personas". Rasgos: tuteo constante, imperativos amables (Obtén, Descubre, Cotiza), eje emocional "felicidad / no estar solo", autorreferencia como "Pacífico" sin "Seguros".

### 1.7 Apps y redes

| App | Tienda | Identificador | Valoración | Última actualización |
|---|---|---|---|---|
| Mi Espacio Pacífico | Google Play | `pe.com.pacifico.miespacio` | 3,2 ★ (2 150) · 500 k+ descargas | 7 sep 2026 |
| Mi Espacio Pacífico | App Store | id1469237859, v3.28.3 | 3,0 ★ (464, ficha PE) | 8 sep 2026 |
| +Seguro al Volante | Google Play | `pe.com.pacifico.seguroalvolante` | 2,7 ★ (12) | sin fecha visible |

No existe una app separada de salud o EPS: esas funciones viven dentro de Mi Espacio Pacífico. Redes oficiales: Instagram `pacifico_seguros` (111 k), LinkedIn `pacificoseguros` (395 k), YouTube `@SegurosPacifico` (49,5 k). Pacífico forma parte de Credicorp. **No se encontró un manual de marca público**; la única descripción de la identidad es el artículo de Brandemia sobre el rediseño de FutureBrand (2011).

---

## 2. Benchmark

### 2.1 Aseguradoras peruanas con app

| App | Existe hoy | Última act. / valoración | Observaciones de interfaz verificables en capturas de tienda |
|---|---|---|---|
| App RIMAC (`com.rimac.rimac_surrogas`) | Sí | 1 sep 2026 · 4,5 ★ (57,5 k) | Fondo blanco, acento rojo→magenta. "Mis seguros" en tarjetas horizontales; "Mis asistencias" en grilla de tiles blancos con íconos de línea. "Estar Bien" es una **sección** dentro de la app (no una app aparte), con degradado verde-teal y chips de categoría |
| La Positiva (`pe.com.lapositiva.labpositiva.mobility`) | Sí | 3 sep 2026 · 2,3 ★ (480) | Naranja intenso. Tarjetas blancas con sombra suave; barra inferior de 5 ítems (Inicio, Servicios, Pagos, Comprar, Perfil); íconos ilustrados a color; pagos con tabs y badge "Pendiente" |
| App Mapfre Perú (`com.mapfreperu.appmapfre`) | Sí | 8 sep 2026 · 4,7 ★ (1 580) | Rojo Mapfre; barra inferior de 5 con botón SOS central circular; "Clínica Digital" con tabs y tarjetas de agendamiento "Presencial y virtual, programada o inmediata"; detalle de póliza en acordeones |
| Mi Espacio Pacífico (`pe.com.pacifico.miespacio`) | Sí | 7 sep 2026 · 3,2 ★ (2 150) | Azul degradado; grilla de tiles con íconos de línea azules; chips de filtro píldora (Todos, Vida, Vehicular…); tarjetas con foto y badge verde "Activo"; **no hay agendamiento de citas** en ficha ni capturas |
| Interseguro Vehicular | Sin verificar (Play 404, App Store sin resultados) | — | Sin fuente verificable |
| Sanitas Perú | No (solo portal web "Mi Sanitas") | — | Las apps "Mi Sanitas" y "EPS Sanitas" son de España y Colombia |
| Auna (`pe.com.auna.patientportal`, ecosistema de Oncosalud) | Sí | 4 sep 2026 · 3,7 ★ (657) | Teal con acento verde lima; lista "Tus próximas citas" con fecha en columna y etiqueta de modalidad (Teleconsulta naranja / Presencial verde); **stepper de 3 pasos**, tabs Teleconsulta / Presencial, **chips de horario por día**, botón píldora "Continuar"; barra inferior de 3 (Inicio, Nueva Cita, Mis Citas) |

Ninguna ficha ni fuente oficial documenta loaders ni estados de carga: sin fuente verificable.

### 2.2 Salud mental y respiración guiada

| Producto | Observaciones verificables |
|---|---|
| Apple Watch, app Mindfulness (Breathe) | Guía oficial: "inhale slowly as the animation grows, then exhale as it shrinks"; duración de 1 a 5 minutos; "Breathe Rate" ajusta respiraciones por minuto; háptica "None, Minimal, or Prominent". Los valores "7 rpm por defecto, rango 4–10" no aparecen en las páginas de soporte consultadas: sin fuente verificable |
| Calm | Ficha: "Breathing exercises and breathwork". Centro de ayuda (solo extracto, la página devolvió 403): "Breathe Bubble" de 60 s, ritmo de 4, 6 u 8 rpm |
| Headspace | Web oficial: "breathe along to animations of a sleeping cat, fluffy white clouds, gentle waves"; técnicas con conteo (box breathing 4-4-4-4, exhalación extendida 3/6); "Mini-Meditation: Breathe, 1 min". El dato "4 s / 6 s con cambio de color" circula en un blog de terceros, no oficial |
| Breathwrk (Peloton) | Ficha: "customizable sounds, visuals, haptic vibrations, and breath coaches"; técnica 4-7-8 |
| Balance | La ficha no describe un ejercicio visual de respiración |
| Referencia de `imgs/` | Relleno de color que sube y baja ocupando toda la pantalla, texto "Breathe in / Breathe out" arriba en peso medio, rostro mínimo dibujado en línea sobre el relleno |

Patrón dominante: **una sola forma que crece y se encoge o un relleno que sube y baja, sincronizado con la respiración, con texto corto y ritmo en rpm ajustable**. Ninguna de las apps documenta ciclos por defecto menores a 6 s.

### 2.3 Telemedicina con agendamiento

| Producto | Observaciones verificables |
|---|---|
| Doctoralia (Docplanner) | Búsqueda por especialidad, ciudad y seguro; perfil con opiniones de pacientes; agenda "eligiendo entre horarios disponibles"; recordatorios; chat y videoconsulta |
| Zocdoc | Perfiles con foto, trayectoria y reseñas; "instantly book in-person or telehealth visits"; formularios previos a la visita; cita en 24 a 72 h |
| Teladoc | Centro de ayuda: botón literal **"Join waiting room"**; recordatorio 10 min antes; dos modos (inmediata vs programada); **notificaciones de estado por etapas**: solicitud confirmada → el proveedor revisa el historial → listo → visita finalizada |
| Smart Doctor (Perú) | Ficha de tienda no accesible hoy; fuentes secundarias (CONFIEP, RPP) describen el flujo por la línea 113 opción 4 y formulario web |
| Auna (Perú) | Ver 2.1: stepper de 3 pasos y chips de horario por día |

Ninguna ficha muestra el número de colegiatura en la tarjeta del médico: sin fuente verificable. Es un rasgo que PAUSA sí incorpora por el contexto peruano del certificado.

### 2.4 Paneles de wearables

| Producto | Métrica y bandas oficiales | Presentación |
|---|---|---|
| Oura, Readiness | 0–100: 85–100 Optimal, 70–84 Good, 60–69 Fair, 0–59 Pay Attention | Número grande + barras por contribuidor; 3 pestañas (Today, Vitals, My Health); tarjetas reordenables; Trends con vistas D/S/M/A |
| WHOOP, Recovery | 0–100 %: verde 67–100, amarillo 34–66, rojo 0–33 | "Circular WHOOP graph"; número sobredimensionado; deslizar para ver tendencia de 7 días |
| Garmin, Body Battery | 0–100 en cuartiles (o 5–100 según modelo) | Línea del día; "Charged / Drained"; barras azules descanso, naranjas estrés |
| Google Health (Fitbit), Readiness | 1–100: High 65+, Moderate 30–64, Low 1–29 | Número en el panel "Today"; tabs superiores para tendencias; 4 pestañas |
| Apple, Vitals | Sin puntuación única: 5 métricas frente a un **rango típico personal**; estados High / Typical / Low | Lista de métricas; gráfico de barras D/W/M/6M; tipografía SF Pro (verificada) |

Lectura: todas usan **3 bandas de estado y un número grande**, y **una vista semanal por selector de periodo**. Apple es la única que evita el score compuesto y compara contra el rango propio de la persona: es la referencia más honesta para PAUSA, que mide patrón laboral y no salud.

### 2.5 Bienestar digital

| Producto | Observaciones verificables |
|---|---|
| Android, Bienestar digital | Panel con tres métricas literales: "Tiempo de pantalla", "Veces que se ha abierto", "Notificaciones recibidas"; temporizadores de apps que "atenúan el icono" al agotarse y se reinician a medianoche; "Modo Descanso" con escala de grises |
| iOS, Tiempo de uso | Vocabulario oficial en español: "Tiempo de inactividad", "Límites de apps" por categoría, "Siempre permitido". El artículo consultado en español (108806) es el de gestión familiar; el gráfico semanal del informe personal no se pudo leer en esta consulta |

### 2.6 Material Design 3 y Apple HIG (referencias normativas para Android e iOS)

Valores tomados de los archivos de tokens oficiales de Google (`md.sys.*` en el repositorio `material-components-android`) y de developer.android.com, porque m3.material.io se renderiza con JavaScript y no devolvió contenido al fetch.

| Aspecto | Valor |
|---|---|
| Escala tipográfica | Display 57/45/36 · Headline 32/28/24 · Title 22/16/14 · Body 16/14/12 · Label 14/12/11 sp. Display, Headline y Body en **Regular**; Medium solo para Title y Label |
| Elevación | Niveles 0, 1, 3, 6, 8 y 12 dp; la jerarquía se marca primero con tono de superficie, después con sombra |
| Formas | Extra small 4 · Small 8 · Medium 12 · Large 16 · Extra large 28 · Full (píldora) |
| Táctil | Android: "at least 48dp x 48dp". Apple HIG: 44×44 pt por defecto, 28×28 pt mínimo absoluto |
| Bottom sheet | Modal con scrim, se cierra deslizando; esquinas superiores 28 dp; drag handle con área táctil de 48 dp |
| Navigation bar | 3 a 5 destinos; 64 dp en M3 Expressive; indicador píldora de 56×32 dp; **sin negrita en el ítem activo** |

---

## 3. Conclusión accionable: decisiones de concordancia visual con Pacífico

La paleta de PAUSA se mantiene. La concordancia se logra en los otros ejes:

1. **Tipografía Signika (OFL) como sustituto de Foco.** Misma familia humanista de bajo contraste con terminales suavizados; ancho de "n" casi idéntico (0,545 vs 0,543). Empaquetada localmente, variable 300–700, pero PAUSA usa solo 400, 600 y 700.

2. **El azul se usa como lo usa Pacífico: el cian de marca oscurecido para todo lo que se lee o se pulsa.** Pacífico pasa de `#0099CC` a `#0080AA`/`#0075B0` en botones, tabs y pie. PAUSA pasa de `#00A0DF` (acento, logo, indicadores) a `#0077B6` (botones, barras, relleno del loader) y a `#003B5C` (texto, tab activa). Con esto el azul claro deja de fallar el contraste sin salir de la paleta.

3. **Iconografía de línea, monocroma, trazo de 1,75 px sobre 24 px, extremos redondeados.** Pacífico dibuja sus íconos de producto en línea fina con `stroke-linecap:round`; PAUSA usa un solo set de línea (sin rellenos mezclados) en navy o en el color semántico de su contexto, y sin fondos circulares de color salvo en el avatar.

4. **Botones píldora de 48 dp.** Pacífico: `height:44px; border-radius:24px`. PAUSA: 48 dp para cumplir Material, radio completo, relleno plano `#0077B6`, sin gradiente ni sombra. Botón secundario tonal (tinte azul + navy) y botón de texto subrayado, como los outline/ghost de Pacífico pero con más contraste.

5. **Radios por jerarquía: 8 chips y celdas, 12 filas y botones cuadrados, 16 tarjetas, 24 bottom sheet.** Coincide con los chips de 8 px y las tarjetas de 16–20 px de Pacífico y con la escala de formas de M3.

6. **Dos niveles de elevación con significado, sombra azulada y corta.** Nivel 1: superficie blanca con borde hairline, solo cuando agrupa algo accionable (tarjeta del médico, hoja de horarios). Nivel 2: flotante (bottom sheet, visor, toast) con `0 12px 32px -8px rgba(0,59,92,.28)`, la misma lógica de sombra azulada de Pacífico (`rgba(1,125,167,.27)`). Todo lo informativo va sobre la crema con espaciado.

7. **Composición de tarjeta de profesional al estilo de las apps peruanas de citas:** avatar con iniciales, nombre, especialidad, colegiatura visible y chips de estado; horarios como chips en grilla (Auna, Mapfre), no como lista.

8. **Tono de voz: tuteo, frases cortas, sin mayúsculas espaciadas ni cadenas con puntos medios.** Pacífico habla en segunda persona con imperativos amables; PAUSA conserva el tuteo pero evita la urgencia promocional: nada de exclamaciones ni promesas terapéuticas.

Lo que **no** se adopta: el magenta `#EE2C70` y el degradado cian→morado de las capturas de Pacífico (fuera de paleta), la mascota, y las 5 pestañas con botón central de Mapfre y La Positiva (PAUSA mantiene 4).

---

## 4. Referencia del loader de respiración (`imgs/`)

Seis capturas de una app de bienestar (fuente original en Mobbin, no accesible). Se observa: fondo blanco, relleno naranja que sube desde abajo con borde superior curvo, texto "Breathe in" / "Breathe out" centrado arriba en gris oscuro y peso medio, rostro mínimo dibujado en línea que sube con el relleno. PAUSA recrea el concepto con ejecución propia: relleno `#0077B6` sobre crema, palabras "Inhala" y "Exhala", sin rostro ni assets copiados; el detalle de implementación y accesibilidad está en `docs/sistema-de-diseno.md`.

---

## 5. Limitaciones de este estudio

- Mobbin (403) y Refero (SPA) no se pudieron consultar; no se crearon cuentas.
- Las fichas de tienda no traen texto alternativo de las capturas; la paleta y la tipografía de terceros solo se describen cuando el fabricante las documenta.
- Las páginas de m3.material.io no devolvieron contenido al fetch; los valores se tomaron de los tokens oficiales de Google en GitHub y de developer.android.com.
- No se accedió a imágenes de redes sociales de Pacífico; su estilo en redes queda "sin fuente verificable".

---

## 6. Fuentes

### Pacífico Seguros (oficiales)
- https://www.pacifico.com.pe/ · HTML, estilos inline, textos e imágenes · 10 sep 2026
- https://www.pacifico.com.pe/o/pacifico-corporativo-theme/css/main.css · paleta legado, @font-face, radios, sombras · 10 sep 2026
- https://www.pacifico.com.pe/o/pacifico-corporativo-theme/css/fonts/foco_std_rg-webfont.woff2 (y `_bd`, `_lt`) · fuentes servidas · 10 sep 2026
- https://www.pacifico.com.pe/nosotros · https://www.pacifico.com.pe/seguros/salud · https://www.pacifico.com.pe/eps · https://www.pacifico.com.pe/mi-espacio-pacifico · 10 sep 2026
- https://play.google.com/store/apps/details?id=pe.com.pacifico.miespacio · tienda · 10 sep 2026
- https://play.google.com/store/apps/details?id=pe.com.pacifico.seguroalvolante · tienda · 10 sep 2026
- https://apps.apple.com/pe/app/mi-espacio-pac%C3%ADfico/id1469237859 · https://apps.apple.com/pe/developer/pac%C3%ADfico-seguros/id455471271 · tienda · 10 sep 2026
- https://www.instagram.com/pacifico_seguros/ · https://www.linkedin.com/company/pacificoseguros · https://www.youtube.com/user/SegurosPacifico · redes oficiales · 10 sep 2026
- https://www.grupocredicorp.com/ · oficial (grupo) · 10 sep 2026

### Tipografía
- https://www.daltonmaag.com/font-library/foco.html · oficial (fundición) · 10 sep 2026
- https://fontsinuse.com/typefaces/1306/foco · secundaria · 10 sep 2026
- https://github.com/googlefonts/Signika/blob/master/OFL.txt · licencia OFL 1.1 verificada · 10 sep 2026
- https://openfontlicense.org · texto oficial SIL OFL · 10 sep 2026
- https://fonts.googleapis.com/css2?family=Signika:wght@300..700 · archivo woff2 empaquetado · 10 sep 2026
- https://brandemia.org/la-aseguradora-peruana-pacifico-presenta-nueva-identidad-corporativa · secundaria (identidad 2011, FutureBrand) · 10 sep 2026

### Aseguradoras peruanas (tienda y oficiales)
- https://apps.apple.com/pe/app/app-rimac/id602975058 · https://play.google.com/store/apps/details?id=com.rimac.rimac_surrogas · https://www.rimac.com/app-rimac · 10 sep 2026
- https://apps.apple.com/pe/app/la-positiva-seguros/id1325454947 · https://play.google.com/store/apps/details?id=pe.com.lapositiva.labpositiva.mobility · 10 sep 2026
- https://apps.apple.com/pe/app/app-mapfre-per%C3%BA/id1350593815 · https://play.google.com/store/apps/details?id=com.mapfreperu.appmapfre · https://www.mapfre.com.pe/clinica-digital-mapfre/ · 10 sep 2026
- https://apps.apple.com/pe/app/auna/id1188108872 · https://play.google.com/store/apps/details?id=pe.com.auna.patientportal · https://auna.org/pe/app-auna · 10 sep 2026
- https://www.interseguro.pe/vehicular/app/ · oficial (app no verificable en tiendas) · 10 sep 2026
- https://sanitasperu.com/mi-sanitas/ · https://sanitasperu.com/teleconsulta/ · oficial · 10 sep 2026

### Respiración y salud mental
- https://support.apple.com/guide/watch/breathe-apd371dfe3d7/watchos · oficial · 10 sep 2026
- https://apps.apple.com/us/app/calm-sleep-meditate-relax/id571800810 · tienda · 10 sep 2026
- https://support.calm.com/hc/en-us/articles/360000069973 · oficial (solo extracto, HTTP 403) · 10 sep 2026
- https://apps.apple.com/us/app/headspace-sleep-meditation/id493145008 · https://www.headspace.com/meditation/breathing-exercises · 10 sep 2026
- https://apps.apple.com/us/app/breathwrk-breathing-exercises/id1481804500 · https://apps.apple.com/us/app/balance-meditation-sleep/id1361356590 · tienda · 10 sep 2026

### Telemedicina
- https://apps.apple.com/us/app/doctoralia-mexico/id1471632318 · https://apps.apple.com/us/app/zocdoc-find-and-book-doctors/id391062219 · https://apps.apple.com/us/app/teladoc-health-telehealth/id656872607 · tienda · 10 sep 2026
- https://www.teladochealth.com/helpcenter/article/about-visits-and-troubleshooting-faqs · oficial · 10 sep 2026
- https://www.confiep.org.pe/smart-doctor/ · secundaria · 10 sep 2026

### Wearables
- https://support.ouraring.com/hc/en-us/articles/360025589793-Readiness-Score · https://support.ouraring.com/hc/en-us/articles/360058599753-How-to-Use-the-Oura-App · https://support.ouraring.com/hc/en-us/articles/360055983614-Using-Trends · oficial · 10 sep 2026
- https://developer.whoop.com/docs/whoop-101/ · oficial · https://apps.apple.com/us/app/whoop-performance-optimization/id933944389 · tienda · 10 sep 2026
- https://support.garmin.com/en-US/?faq=VOFJAsiXut9K19k1qEn5W5 · https://www8.garmin.com/manuals-apac/webhelp/forerunner255series/EN-SG/GUID-708836C9-AAAC-4D9B-9A71-73361F888AB0-627.html · oficial · 10 sep 2026
- https://support.google.com/fitbit/answer/14236710?hl=en · https://support.google.com/googlehealth/answer/17068213?hl=en · oficial · 10 sep 2026
- https://support.apple.com/en-us/120142 · https://support.apple.com/guide/watch/vitals-apd15aa7ed96/watchos · https://developer.apple.com/fonts/ · oficial · 10 sep 2026
- https://www.dcrainmaker.com/2026/07/oura-ring-5-in-depth-review-comparison.html · secundaria (Ray Maker) · 10 sep 2026

### Bienestar digital
- https://support.google.com/android/answer/9346420?hl=es · oficial · 10 sep 2026
- https://support.apple.com/es-es/108806 · oficial · 10 sep 2026

### Material Design 3 y Apple HIG
- https://raw.githubusercontent.com/material-components/material-components-android/master/lib/java/com/google/android/material/typography/res/values/tokens.xml · oficial (tokens md.sys.typescale) · 10 sep 2026
- https://raw.githubusercontent.com/material-components/material-components-android/master/lib/java/com/google/android/material/elevation/res/values/tokens.xml · oficial · 10 sep 2026
- https://raw.githubusercontent.com/material-components/material-components-android/master/lib/java/com/google/android/material/shape/res/values/tokens.xml · oficial · 10 sep 2026
- https://developer.android.com/develop/ui/compose/designsystems/material3 · https://developer.android.com/guide/topics/ui/accessibility/apps · https://developer.android.com/develop/ui/compose/components/bottom-sheets · https://developer.android.com/develop/ui/compose/components/navigation-bar · oficial · 10 sep 2026
- https://github.com/material-components/material-components-android/blob/master/docs/components/BottomSheet.md · https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md · oficial · 10 sep 2026
- https://developer.apple.com/design/human-interface-guidelines/accessibility · oficial (44×44 pt) · 10 sep 2026
- https://m3.material.io/styles/typography/type-scale-tokens y páginas hermanas · oficial, **sin contenido legible por fetch** · 10 sep 2026

### Repositorios de inspiración
- https://mobbin.com/ · HTTP 403 al acceso automatizado · 10 sep 2026
- https://refero.design/ · SPA sin contenido indexable · https://doc.refero.design/help/plans (plan Free con búsqueda limitada) · 10 sep 2026
