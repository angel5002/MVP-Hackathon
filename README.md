# PAUSA · MVP navegable

Prototipo de app móvil en un solo archivo (`index.html`) para la hackathon de Pacífico Seguros.
Sin backend, sin dependencias, sin persistencia. Todos los datos están escritos en el código.

## Cómo abrir

- En línea: https://angel5002.github.io/MVP-Hackathon/
- Local: abrir `index.html` en cualquier navegador (no requiere servidor).

## Flujo

1. **Ingreso** con usuario y contraseña ya escritos (siempre funciona).
2. **Conectar reloj**: Conectar / Ahora no / No tengo. Con "Conectar", el inicio muestra dos métricas más.
3. **Tu estado**: anillo de ritmo, tres píldoras, gráfico semanal. A los 3 s aparece la alerta (Agendar / Ahora no / No mostrar más).
4. **Pedir ayuda**: psicólogo o médico.
   - **Psicólogo**: lista con etiquetas (te atendió antes, más cercano, disponible hoy), horarios y confirmación.
   - **Médico**: búsqueda de 2 s, médico asignado con horarios, lista opcional de otros médicos disponibles.
5. **Certificado**: datos del médico, CIE-10, selector de días (5 preseleccionado), vista previa y descarga.
6. **El trámite**: cuatro checks cada 800 ms, pausa de 1,2 s y frase final "Solo te queda presentarlo. Nosotros hicimos el resto."
7. **Tu proceso**: pausa activa, días guardados, sesiones, documentos y correo para el empleador.

Pestañas: Inicio · Citas · Documentos · Perfil. Botones del sistema (atrás, inicio, recientes) bajo la pantalla.

## Documentos

- Certificado de descanso médico y aviso de ausencia se generan como SVG y se descargan en PNG (sin librerías).
- La firma dice **CASO FICTICIO** y el pie indica que es un prototipo sin validez legal.
- El correo para el empleador es una plantilla con campos que se reemplazan (jefe, días, fechas, médico) y se abre en Gmail, Outlook u otro cliente con el texto listo.

## Navegación y reset

- Botón "atrás" en cada subpantalla y botón "atrás" del sistema; también funciona el gesto/botón atrás del navegador.
- Triple toque sobre la barra de estado (la hora "9:41") reinicia el prototipo al ingreso.

## Identidad visual

Paleta de la ficha de diseño: azul Pacífico `#00A0DF`, azul profundo `#003B5C`, naranja de atención `#FF5C35`, verde `#2FA84F`, fondo crema `#FDF3E3`. Tipografía Nunito (Google Fonts) con respaldo del sistema. Esquinas de 16 a 20 px, sombras suaves.

Datos simulados. Profesionales y colegiaturas son ficticios.
