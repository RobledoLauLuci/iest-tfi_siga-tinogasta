# 10 · Seguridad: cómo protegemos datos y sistema

## Datos sensibles
| Dato | Tratamiento |
|---|---|
| Contraseñas | Cifradas con bcrypt; nunca en texto plano |
| Email | Visible solo para su dueño y la administradora |
| `JWT_SECRET` y clave de la base | Solo en `.env` |

## Variables de entorno
```text
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```
`.env` va en `.gitignore`.

## Validaciones
- Validar todo en la API, porque el navegador se puede manipular.
- Consultas SQL con parámetros (`?`).
- Verificar rol y propiedad antes de editar una obra o taller.
- Calcular precios y totales en el servidor.

## Nunca debe llegar al navegador
- Claves de la base, `JWT_SECRET` y hashes de contraseñas.
- Nunca usar `dangerouslySetInnerHTML`.
