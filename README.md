# PAUSA · MVP navegable

Prototipo de app móvil en un solo archivo (`index.html`) para grabar el video de demo.
Sin backend, sin dependencias, sin persistencia. Todos los datos están escritos en el código.

## Cómo abrir

- En línea: https://angel5002.github.io/MVP-Hackathon/
- Local: abrir `index.html` en cualquier navegador (no requiere servidor).

## Flujo

1. **Tu estado** → a los 3 s aparece la alerta (Agendar / Ahora no / No mostrar más).
2. **Pedir ayuda** → dos rutas: psicólogo (pantalla 3B) o médico (pantalla 4).
3. **Teleconsulta** → busca 2 s y asigna al médico automáticamente.
4. **Certificado** → selector de días (3 / 5 / 7, con 5 preseleccionado).
5. **El trámite** → cuatro pasos que aparecen uno a uno y luego el estado de la pausa.

## Navegación

Cada subpantalla tiene un botón "atrás" en la barra superior (3 → 1, 3B → 3, 4 → 3, 5 → 4 sin repetir la búsqueda, 6 → 5).
El gesto o botón "atrás" del navegador del celular hace lo mismo. La alerta de la pantalla 1 se muestra una sola vez por sesión.

## Reset oculto

Triple toque sobre la barra de estado (la hora "9:41") reinicia el prototipo a la pantalla 1.

## Sistema visual

Adaptado del sitio corporativo de Pacífico Seguros (pacifico.com.pe):

- Tipografía: Pacífico usa "Foco" (licenciada). Aquí se usa Nunito (Google Fonts), la más cercana por sus formas redondeadas, con Foco y Roboto de respaldo. Si no hay internet, el prototipo sigue funcionando con la fuente del sistema.
- Colores: celeste `#0099CC`, azul `#0075B0`, teal de títulos `#005C7A`, texto `#2F373C` / `#727C81`, fondos `#F2F3F3` y `#E8F9FF`, bordes `#DEE2E6`, verde `#00AF3F`, ámbar `#E09A2B`.
- Formas: lenguaje de apps de bienestar (anillo de progreso con badge, píldoras pastel con ícono y valor, tarjetas blancas de 24 px sobre fondo gris azulado, filas tipo tile con ícono en círculo, chips de categoría) con botones píldora en degradado azul-celeste.

## Marco

Teléfono de 390 × 844 px (barra de estado 47 px · contenido 763 px · indicador de inicio 34 px).
En pantallas más pequeñas el marco se escala para caber completo, sin scroll.

Datos simulados. Profesionales y colegiaturas son ficticios.
