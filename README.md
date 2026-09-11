# PAUSA · app para Android (APK) y PWA

Prototipo navegable para la hackathon de Pacífico Seguros. Detecta patrones de sobrecarga laboral (horas conectada, actividad nocturna y, si se conecta, datos de reloj), conecta a la persona con psicología o medicina de la red, genera el certificado de descanso médico y automatiza el aviso al empleador. **Todos los datos son ficticios**; no hay backend ni persistencia.

## Entregables

| | Qué | Dónde |
|---|---|---|
| D1 | APK de depuración, 4,85 MB (target Android 16 / API 36, mínimo Android 7 / API 24) | `entregables/PAUSA-debug.apk` |
| D2 | PWA instalable (misma base de código) y pasos para iOS | `dist/` tras `npm run build` · `docs/COMO-INSTALAR.md` |
| D3 | Estudio de mercado y de marca | `docs/estudio-de-mercado.md` |
| D4 | Sistema de diseño (tokens, tipografía, movimiento) | `docs/sistema-de-diseno.md` · `src/styles/tokens.css` |
| D5 | Registro de decisiones | `docs/decisiones.md` |
| D6 | Guía de instalación y pruebas manuales | `docs/COMO-INSTALAR.md` |
| D7 | Prototipo original intacto | `legacy/index.html` |
| | Lista de paridad funcional | `docs/paridad.md` |
| | Capturas de QA (360×800 y 412×915, con y sin movimiento reducido) | `docs/capturas/` |

## Cómo correrlo

```bash
npm install
npm run dev          # http://127.0.0.1:5173 (en escritorio se ve dentro de un marco de teléfono)
npm run build        # PWA en dist/
npm run android:apk  # compila el APK con el JDK 21 y lo copia a entregables/
npm run qa:capturas  # recorre el flujo con Playwright (Edge) y deja capturas en docs/capturas/
```

Parámetros de URL para demo y QA: `?demo=rapido` (loaders de un ciclo), `?dias=3..7` (escenario forzado), `?previos=15` (supera los 20 días del año).

## Flujo

1. **Ingreso** con usuario y contraseña ya escritos.
2. **Conectar reloj**: Conectar / Ahora no / No tengo.
3. **Inicio**: anillo de ritmo, métricas, gráfico semanal; a los 3 s, la alerta como bottom sheet.
4. **Pedir ayuda**: psicología (lista, horarios, confirmación; descuenta 1 de 6 sesiones) o medicina.
5. **Medicina**: búsqueda con el loader de respiración → médico asignado y horario → pre-consulta PHQ-4 (tamizaje, no diagnóstico; acceso a la Línea 113 opción 5 si el puntaje es alto) → cita confirmada → *Simular que llegó la hora* → sala de espera (respiración con contador) → teleconsulta simulada.
6. **Evaluación médica**: el médico indica de 3 a 7 días (`evaluarDescanso()`), tira de calendario, fundamento y contador "X de 20 días en el año".
7. **Certificado** (emisión con loader) → **Trámite** (checklist) → **Tu proceso** → **Tu empleador verá esto** (jefe directo sin diagnóstico o RR. HH. con certificado) → correo en Gmail, Outlook u otra app, fuera del WebView.

Pestañas: Inicio · Citas · Documentos · Perfil. Reinicio: triple toque sobre la palabra PAUSA. Modo presentador: mantener PAUSA 2 s.

## Stack

Vite 8 · React 19 · TypeScript 7 · Motion 13 (único motor de animación) · Capacitor 8.5.1 (`@capacitor/app`, `haptics`, `splash-screen`, `filesystem`, `share`, `app-launcher`) · vite-plugin-pwa. Tipografía Signika (OFL) empaquetada localmente. Paleta: azul Pacífico `#00A0DF`, azul profundo `#003B5C`, naranja `#FF5C35`, verde `#2FA84F`, crema `#FDF3E3`, con tonos derivados documentados en D4.

## Publicación

La PWA está publicada en https://angel5002.github.io/MVP-Hackathon/ mediante el flujo `.github/workflows/pages.yml` (manual, fuente de Pages: GitHub Actions). El prototipo anterior se conserva en `legacy/index.html`.

Datos simulados. Profesionales y colegiaturas son ficticios.
