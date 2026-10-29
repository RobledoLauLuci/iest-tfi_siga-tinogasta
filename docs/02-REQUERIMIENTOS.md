# 02 · Requerimientos: qué tiene que hacer SIGA

## Requerimientos funcionales
| ID | Requerimiento | Prioridad |
|---|---|---|
| RF01 | Registro e inicio de sesión | Alta |
| RF02 | Galería de obras con foto, título y precio | Alta |
| RF03 | Filtrar obras por categoría (pintura, dibujo, escultura) | Alta |
| RF04 | Ver detalle de una obra | Media |
| RF05 | Artista publica y edita sus obras | Alta |
| RF06 | Listar talleres con cupo y fecha | Alta |
| RF07 | Inscribirse a un taller | Alta |
| RF08 | Pedido de compra de una obra | Media |
| RF09 | Panel de administración y moderación | Alta |
| RF10 | Formulario de contacto | Media |
| RF11 | Reportes de ventas e inscripciones | Baja |

## Requerimientos no funcionales
- Adaptable a celular, tableta y computadora.
- Carga inicial en menos de 3 segundos.
- Contraseñas cifradas con bcrypt.
- Accesible: buen contraste y texto alternativo en imágenes.
- Roles con permisos: administradora, artista, visitante.

## Historia de usuario
Como visitante, quiero ver las obras por categoría para encontrar la que me gusta y consultar por ella.

## Criterios de aceptación
- La galería muestra solo obras publicadas.
- El filtro cambia los resultados sin recargar toda la página.
- Solo la dueña de una obra puede editarla.
