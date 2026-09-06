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
5. **El trámite** → cuatro pasos que aparecen uno a uno, la frase final y el estado de la pausa.

## Reset oculto

Triple toque sobre la barra de estado (la hora "9:41") reinicia el prototipo a la pantalla 1.

## Marco

Teléfono de 390 × 844 px (barra de estado 47 px · contenido 763 px · indicador de inicio 34 px).
En pantallas más pequeñas el marco se escala para caber completo, sin scroll.

Datos simulados. Profesionales y colegiaturas son ficticios.
