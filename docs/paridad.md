# Lista de verificación de paridad funcional · legacy → app

Origen: `legacy/index.html` y el README original. Estado al 11 de septiembre de 2026. ✅ hecho · ➕ ampliado por las Fases 4 y 5 · ⬜ pendiente.

## Flujo de 7 pasos del README

| # | Función original | Estado | Dónde vive ahora |
|---|---|---|---|
| 1 | Ingreso con usuario y contraseña ya escritos | ✅ | `screens/Auth.tsx` (Login) |
| 2 | Conectar reloj: Conectar / Ahora no / No tengo; con "Conectar" el inicio muestra dos métricas más | ✅ | `Auth.tsx` (Watch), `Home.tsx` (fila de reloj) |
| 3 | Tu estado: anillo, tres métricas, gráfico semanal; alerta a los 3 s con Agendar / Ahora no / No mostrar más | ✅ ➕ la alerta es un bottom sheet arrastrable | `Home.tsx`, `components/Charts.tsx`, `components/Sheet.tsx` |
| 4a | Psicólogo: lista con etiquetas, horarios y confirmación | ✅ | `Ayuda.tsx` (Psico, PsicoOk) |
| 4b | Médico: búsqueda, médico asignado con horarios, lista opcional de otros médicos | ✅ ➕ la búsqueda es el loader de respiración (un ciclo) | `Medico.tsx` (Buscando, Medico) |
| 5 | Certificado: datos del médico, CIE-10, selector de días (5 preseleccionado), vista previa | ✅ ➕ los días ya no los elige la persona: los indica el médico tras la teleconsulta (`evaluarDescanso`) | `Consulta.tsx` (Evaluacion, Emitiendo, Cert), `logic/evaluarDescanso.ts` |
| 6 | El trámite: cuatro checks cada 800 ms, pausa de 1,2 s y frase final | ✅ ➕ quinto check de canje por CITT cuando se superan los 20 días | `Tramite.tsx` (Tramite) |
| 7 | Tu proceso: pausa activa, días, sesiones, documentos y correo | ✅ ("días guardados" se reemplaza por "días de descanso este año X de 20", porque el descanso no se acumula como saldo) | `Tramite.tsx` (Proceso) |

## Pestañas y navegación

| Función | Estado | Notas |
|---|---|---|
| 4 pestañas: Inicio, Citas, Documentos, Perfil | ✅ | `components/Screen.tsx` (TabBar) |
| Punto en Documentos cuando hay certificado | ✅ | `tab__dot` |
| Botón atrás en cada subpantalla | ✅ | `TopBar back` |
| Botón atrás del sistema y gesto del navegador | ✅ ➕ en Android nativo usa la pila propia; en la raíz minimiza la app | `nav/store.tsx` (popstate + `App.addListener('backButton')`) |
| Botones simulados de Android bajo la pantalla | Eliminados a propósito (layout real) | Solo queda el marco de "modo presentación" en escritorio |
| Reinicio con triple toque sobre la hora "9:41" | ✅ trasladado al triple toque sobre la marca PAUSA de la barra superior (ya no hay barra de estado falsa) | `Screen.tsx` (Brand) |
| Repetir el flujo sin recargar | ✅ | `reset()` y estado en memoria |

## Documentos y correo

| Función | Estado | Notas |
|---|---|---|
| Certificado y aviso generados como SVG y descargados en PNG sin librerías | ✅ ➕ en nativo se guardan en caché y se abre la hoja de compartir | `logic/docs.ts`, `platform/native.ts` |
| Vista previa en la pantalla del certificado; descarga habilitada solo al terminar el trámite | ✅ | `components/Viewer.tsx` |
| Firma "CASO FICTICIO" y pie de prototipo sin validez legal | ✅ ➕ marca de agua diagonal "CASO FICTICIO · PROTOTIPO SIN VALIDEZ LEGAL" | `docs.ts` |
| Plantilla de correo con campos reemplazables (jefe, días, fechas, médico) | ✅ ➕ dos destinatarios: jefe directo sin diagnóstico, RR. HH. con certificado; pantalla previa "Tu empleador verá esto" con confirmación | `logic/mail.ts`, `Tramite.tsx` (Empleador, Correo) |
| Abrir en Gmail, Outlook u otro cliente | ✅ ➕ en nativo se abre fuera del WebView (`AppLauncher.openUrl`) | `platform/native.ts` |
| Cada sesión agendada descuenta una de las 6; si no hay ninguna, la pausa incluye una de acompañamiento | ✅ | `Tabs.tsx` (Perfil, Citas), `Tramite.tsx` (Proceso) |
| Una nueva consulta reemplaza el certificado | ✅ | el estado del certificado se sobreescribe en `Tele.finalizar` |

## Añadidos de las Fases 4 y 5 (no existían en el legacy)

| Función | Estado |
|---|---|
| Pre-consulta PHQ-4 (traducción oficial "Spanish for Peru"), resultado con acceso a la Línea 113 opción 5 si el puntaje es alto | ✅ |
| "Simular que llegó la hora de tu cita" (control honesto en Cita confirmada y en Citas) | ✅ |
| Sala de espera con loader de respiración de varios ciclos y contador de respiraciones | ✅ |
| Teleconsulta simulada con cierre explícito | ✅ |
| `evaluarDescanso()` con tabla de decisión documentada, 3 a 7 días | ✅ |
| Tira de calendario que se enciende día a día con háptica | ✅ |
| Contador "Días de descanso acumulados en el año: X de 20" con aviso y canje por CITT | ✅ |
| Loader de emisión del certificado | ✅ |
| Modo presentador (mantener la marca 2 s): forzar 3–7 días, un ciclo, 15 días previos; también por URL `?demo=rapido&dias=N&previos=15` | ✅ |
| `prefers-reduced-motion` en transiciones, sheet, gráficos y loader | ✅ |
| Edge-to-edge con `--safe-area-inset-*` (SystemBars) | ✅ |
| Fuente empaquetada localmente (sin CDN) | ✅ |
| PWA con manifest y service worker (funciona sin conexión) | ✅ |
| Texto eliminado: "Los días que no uses quedan disponibles por si los necesitas más adelante" | ✅ no aparece en ninguna pantalla |
| Copy corregido: "Tú eliges qué datos recoge PAUSA" (se refiere a lo que la app mide) | ✅ |
