# 05 · Datos: qué información guarda SIGA

## Entidades
| Tabla | Campos principales |
|---|---|
| `usuarios` | id, nombre, email, clave_hash, rol |
| `categorias` | id, nombre |
| `obras` | id, usuario_id, categoria_id, titulo, descripcion, precio, estado |
| `imagenes_obra` | id, obra_id, ruta, texto_alt |
| `talleres` | id, usuario_id, titulo, descripcion, cupo, fecha, precio |
| `inscripciones` | id, taller_id, usuario_id, fecha |
| `pedidos` | id, usuario_id, fecha, estado |
| `detalles_pedido` | id, pedido_id, obra_id, precio |
| `mensajes_contacto` | id, nombre, email, mensaje, fecha |
| `reportes` | id, tipo, fecha, datos |

> Ajustar los nombres a los del DER real de SIGA si difieren.

## Esquema de ejemplo
```sql
-- db/esquema.sql
CREATE TABLE obras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  categoria_id INT NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(12,2) DEFAULT 0,
  estado ENUM('borrador','publicada','vendida') DEFAULT 'borrador'
);
```

## Ejemplo de datos
| id | titulo | categoria | precio | estado |
|---|---|---|---|---|
| 1 | Obra de ejemplo | Pintura | $ 0 | publicada |

Roles posibles: `administradora`, `artista`, `visitante`.
