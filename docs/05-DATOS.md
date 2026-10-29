# 05 · Datos de SIGA

## Fuente de verdad
Los nombres definitivos de tablas, columnas, relaciones y políticas deben verificarse en `supabase/schema.sql` y en el proyecto Supabase utilizado por SIGA. No crear tablas duplicadas basándose en esquemas de ejemplo antiguos.

## Entidades contempladas
El esquema del proyecto contempla, entre otras, entidades relacionadas con:

| Entidad | Propósito |
|---|---|
| `profiles` | Perfil, rol y datos públicos del artista |
| `works` | Obras publicadas, precio, stock y estado |
| `workshops` | Talleres, público destinatario y datos de la actividad |
| `workshop_photos` | Fotografías asociadas a talleres y consentimiento correspondiente |
| `events` | Eventos y agenda cultural |
| `groups` | Grupos artísticos |
| `group_members` | Relación entre grupos y miembros |
| `inquiries` | Consultas enviadas a través de la plataforma |
| `reports` | Reportes de contenido para moderación |

La lista es orientativa: confirmar los nombres y campos exactos con `supabase/schema.sql`, porque el esquema puede incluir tablas auxiliares adicionales.

## Datos y persistencia
- En modo local, los registros se guardan en el navegador y no se comparten entre usuarios.
- En modo Supabase, los registros deben persistir en la base remota y estar disponibles según las políticas de acceso.
- Las imágenes requieren que Supabase Storage y sus permisos estén correctamente configurados.
- Los valores de precio, stock y estado deben validarse antes de guardarse.

## Seguridad
- No guardar contraseñas en texto plano en tablas propias.
- Usar Supabase Auth para autenticación cuando se utilice el backend real.
- Aplicar políticas RLS para limitar lectura, creación, modificación y eliminación.
- No confiar únicamente en las restricciones de la interfaz.
- No almacenar claves privadas en el navegador ni en el repositorio.

## Datos de prueba
Los datos de ejemplo deben identificarse como demostración. No presentar obras, ventas, inscripciones ni estadísticas inventadas como actividad real del proyecto.
