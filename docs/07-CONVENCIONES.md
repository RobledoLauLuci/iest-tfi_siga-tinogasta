# 07 · Convenciones: cómo escribimos el código

| Elemento | Regla | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `TarjetaObra.jsx` |
| Funciones y variables | camelCase en español | `obtenerObras()` |
| Rutas de API | minúsculas, plural | `/api/obras` |
| Tablas SQL | minúsculas, plural | `detalles_pedido` |
| Estilos | clases con guiones | `.tarjeta-obra` |

- Idioma del código y los comentarios: español.
- Usar `const` y `let`; nunca `var`.

## Commits
```text
tipo: descripción corta en minúsculas
```
Tipos: `agrega`, `corrige`, `mejora`, `documenta`.

Ejemplos:
- `agrega filtro por categoría`
- `corrige login con token vencido`

## Ramas
`feature/galeria`, `feature/talleres`.
