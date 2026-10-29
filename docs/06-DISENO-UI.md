# 06 · Diseño de interfaz (UI)

## Principios
SIGA busca una estética de galería de arte contemporánea: cálida, ordenada, accesible y con espacio visual para que las obras sean protagonistas. El diseño debe funcionar en computadora, tableta y celular.

## Pantallas y navegación
Las rutas exactas deben verificarse en el código actual. La aplicación contempla:
- Inicio y presentación de SIGA.
- Galería de obras.
- Información de obras y artistas.
- Talleres.
- Eventos y agenda cultural.
- Comunidad y grupos.
- Acceso, registro y paneles según permisos.
- Contacto y consultas.

No documentar una ruta como existente sin comprobarla en el enrutador de `src/`.

## Identidad visual
Usar los tokens definidos en `src/styles/` como fuente de verdad. La paleta de marca documentada incluye:
- Crema papel: `#FBF5ED`
- Negro tinta: `#080605`
- Rosa pincelada: `#D38E8E`
- Lila acuarela: `#B390A7`
- Verde agua: `#8AAAAA`
- Beige lienzo: `#D3AA84`
- Dorado hoja: `#E5A855`

Antes de cambiar los colores, compararlos con los tokens CSS existentes y con el sitio publicado. No duplicar ni inventar variables si ya hay nombres equivalentes en el código.

## Diseño adaptable y accesibilidad
- Revisar el diseño desde 360 px de ancho.
- Mantener contraste legible, especialmente en botones y textos.
- Incluir texto alternativo útil en imágenes informativas.
- Mantener foco visible y navegación por teclado.
- Usar etiquetas claras en formularios y mensajes de error comprensibles.
- Evitar que las tarjetas o los menús se desborden en pantallas pequeñas.

## Criterio de aceptación
Los cambios visuales se consideran terminados después de revisar las pantallas principales en escritorio y celular, ejecutar el build y comprobar que no se rompió la navegación.
