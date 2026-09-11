# Cómo instalar PAUSA en tu teléfono (D6)

Guía para alguien que nunca instaló un APK. El archivo se llama **`entregables/PAUSA-debug.apk`** y es un prototipo: todos los datos son ficticios y no se conecta a ningún servidor.

---

## A. Android (APK de depuración)

### 1. Pasar el APK al teléfono

Elige una de estas tres vías:

- **Cable USB.** Conecta el teléfono a la computadora, desliza la notificación "Cargando por USB" y elige *Transferencia de archivos*. Copia `PAUSA-debug.apk` a la carpeta **Descargas** del teléfono.
- **Google Drive, WhatsApp o correo.** Envíate el archivo a ti misma y descárgalo desde el teléfono. Quedará en **Descargas**.
- **adb** (si tienes la depuración USB activada): `adb install -r entregables/PAUSA-debug.apk`.

### 2. Permitir la instalación desde un origen desconocido (Android 15 y 16)

Android no bloquea el APK: bloquea a la **app desde la que lo abres** (por ejemplo, la app Archivos o Chrome). La primera vez verás el aviso *"Por tu seguridad, tu teléfono no puede instalar apps desconocidas de esta fuente"*.

1. Toca **Ajustes** en ese aviso (o ve a *Ajustes → Apps → Acceso especial de apps → Instalar apps desconocidas*).
2. Elige la app desde la que abriste el archivo (Archivos, Chrome, Drive…).
3. Activa **Permitir de esta fuente**.
4. Vuelve atrás y toca de nuevo el APK → **Instalar**.

Puedes desactivar ese permiso después de instalar.

### 3. Qué significa el aviso de Play Protect

Al instalar puede aparecer *"Play Protect no reconoce al desarrollador de esta app"* o *"App bloqueada"*. Es normal: el APK está firmado con una **clave de depuración**, no con una cuenta de Google Play, y Play Protect avisa de cualquier app que no venga de la tienda. No significa que la app sea maliciosa.

- Si el aviso ofrece **Instalar de todos modos** (a veces está detrás de *Más detalles*), tócalo.
- Si dice *"Analizar app"*, deja que termine y luego instala.
- Si Play Protect la bloquea sin opción, abre **Play Store → tu foto → Play Protect → ⚙ → desactiva "Analizar apps con Play Protect"**, instala PAUSA y vuelve a activarlo.

### 4. Abrir y usar

Busca **PAUSA** en el cajón de apps. Usuario y contraseña ya vienen escritos. Toda la demo es local.

- **Reiniciar la demo:** toca tres veces la palabra PAUSA de la barra superior.
- **Modo presentador:** mantén presionada la palabra PAUSA durante 2 segundos. Desde ahí puedes forzar el escenario de 3 a 7 días, acortar los loaders de respiración a un solo ciclo y simular 15 días de descanso previos en el año.

### 5. Desinstalar

Mantén presionado el ícono de PAUSA → **Desinstalar**. O *Ajustes → Apps → PAUSA → Desinstalar*. No deja datos: la app no guarda nada en el teléfono salvo los PNG que decidas compartir.

---

## B. iPhone (PWA)

No hay build nativo de iOS porque este equipo es Windows (Xcode solo existe en macOS, ver `docs/decisiones.md` D-20). El iPhone usa la versión web instalable, con estas diferencias reales frente al APK:

- **Sin vibración:** Safari no implementa la API de vibración; los toques hápticos simplemente no ocurren, sin errores.
- **Descargas:** el PNG del certificado se abre en una pestaña o se guarda en Archivos; no hay hoja de compartir nativa desde la web.
- **Funciona sin conexión** una vez instalada (service worker). Si pasan más de 7 días sin abrirla desde Safari, iOS puede borrar la caché de las web que no están en la pantalla de inicio; las instaladas en la pantalla de inicio están exentas.

### Instalar desde Safari (iOS 26)

1. Abre https://angel5002.github.io/MVP-Hackathon/ en **Safari**.
2. Toca el botón **Compartir** (cuadrado con flecha).
3. Elige **Añadir a pantalla de inicio** → **Añadir**.
4. Ábrela desde el ícono: se abre a pantalla completa, sin barra del navegador.

### Instalar desde Chrome en Android (alternativa al APK)

1. Abre la URL en Chrome.
2. Menú ⋮ → **Instalar app** (o **Añadir a pantalla de inicio**).
3. Confirma. Aparece como app independiente.

---

## C. Lista de pruebas manuales

Marca cada punto en el teléfono. Si algo falla, anota pantalla y paso.

| # | Prueba | Resultado esperado |
|---|---|---|
| 1 | Abrir la app | Splash crema con la marca; entra al ingreso sin barra negra arriba ni abajo (contenido detrás de las barras del sistema, nada tapado) |
| 2 | Ingresar → Conectar reloj | Animación de conexión y llegada al Inicio con las dos métricas del reloj |
| 3 | Esperar 3 s en Inicio | Aparece el bottom sheet de alerta; se cierra arrastrándolo hacia abajo |
| 4 | Botón atrás del sistema en Inicio | La app se minimiza (no se cierra de golpe) |
| 5 | Pedir ayuda → Medicina | Loader "Inhala / Exhala": el relleno azul sube 4 s y baja 6 s; texto legible sobre ambos fondos; vibración suave en cada cambio |
| 6 | Botón atrás durante el loader | Vuelve a "¿Qué necesitas?" |
| 7 | Médico asignado → elegir horario → Confirmar cita | Pre-consulta de 4 preguntas; al terminar, resultado con la Línea 113 si respondiste "casi todos los días" |
| 8 | Cita confirmada → Simular que llegó la hora | Sala de espera con contador de respiraciones (3 ciclos, 30 s); botón "Entrar" al final |
| 9 | Teleconsulta → Finalizar consulta | Pregunta de confirmación; luego "Tu indicación de pausa" con los días encendiéndose uno a uno y una vibración por día |
| 10 | Ver mi certificado | Loader de emisión de un ciclo y pantalla "Certificado emitido" con contador "X de 20" |
| 11 | Iniciar el trámite | Cuatro checks (cinco si superas los 20 días), vibración por check y botón "Ver mi proceso" |
| 12 | Tu proceso → ícono de descarga del certificado | Se abre la hoja de compartir de Android con el PNG (marca de agua "CASO FICTICIO") |
| 13 | Avisar a tu empleador → Jefe directo → Continuar | El texto del correo no menciona el diagnóstico; el botón Continuar solo se activa con la casilla marcada |
| 14 | Gmail / Outlook / Otra app | Se abre la app de correo o el navegador **fuera** de PAUSA con destinatario, asunto y cuerpo |
| 15 | Documentos → punto rojo en la pestaña | Aparecen certificado y aviso; el visor se cierra con el botón atrás |
| 16 | Citas | La consulta figura como "Realizada" y la sesión de psicología (si la agendaste) descuenta una de las 6 |
| 17 | Perfil → apagar "Vibración en la respiración" → repetir un loader | Ya no vibra |
| 18 | Ajustes del teléfono → Tamaño de fuente al máximo → recorrer Inicio, Médico asignado y Evaluación | Nada se recorta; las pantallas hacen scroll |
| 19 | Ajustes → Accesibilidad → Quitar animaciones | Las transiciones son fundidos y el loader cambia de tinte en lugar de subir |
| 20 | Modo avión → cerrar y abrir la app | Funciona igual (no depende de red) |
| 21 | Triple toque en PAUSA | Vuelve al ingreso con todo reiniciado |
| 22 | Mantener PAUSA 2 s → 3 días → recorrer hasta el certificado | El certificado dice "tres (3) días" y las fechas cierran (inicio, fin, reincorporación) |
| 23 | Modo presentador → 7 días + 15 previos | El contador marca 22 de 20 en rojo, aparece el aviso de canje por CITT y un quinto paso en el trámite |

---

## D. Para compilar la versión nativa de iOS cuando tengas una Mac

Requiere macOS con **Xcode 26 o superior** (mínimo de Capacitor 8) y una cuenta de Apple ID.

```bash
npm install
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

En Xcode: selecciona el target *App* → *Signing & Capabilities* → marca *Automatically manage signing* y elige tu equipo (con un Apple ID gratuito la app instalada en tu iPhone caduca a los 7 días y hay que reinstalarla). Conecta el iPhone, actívalo como dispositivo de desarrollo cuando iOS lo pida y pulsa ▶. Los insets de las barras llegan igual por `--safe-area-inset-*`; la háptica nativa sí funciona en iOS con `@capacitor/haptics`.
