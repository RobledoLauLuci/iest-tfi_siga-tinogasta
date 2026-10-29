# 02 · Requerimientos de SIGA

## Requerimientos funcionales

| ID | Requerimiento | Prioridad | Estado documental |
|---|---|---:|---|
| RF01 | Permitir registro e inicio de sesión | Alta | Implementado en la interfaz; verificar en Supabase real |
| RF02 | Mostrar galería de obras con imagen, título, artista y precio/datos disponibles | Alta | Implementado en modo local; verificar datos compartidos |
| RF03 | Permitir explorar o filtrar obras por categoría cuando hay datos | Alta | Revisar en la aplicación publicada |
| RF04 | Mostrar información de una obra | Media | Revisar en la aplicación publicada |
| RF05 | Permitir que artistas gestionen sus obras desde el panel | Alta | Implementado en la interfaz; verificar permisos en Supabase |
| RF06 | Mostrar talleres y sus datos principales | Alta | Implementado en la interfaz; verificar datos compartidos |
| RF07 | Permitir gestionar información y fotos de talleres | Alta | La interfaz contempla gestión; verificar inscripción real si se presenta como disponible |
| RF08 | Mostrar eventos y agenda cultural | Media | Implementado en la interfaz; verificar datos compartidos |
| RF09 | Disponer de panel administrativo y moderación | Alta | Implementado en la interfaz; verificar roles y RLS |
| RF10 | Permitir enviar consultas mediante formulario | Media | Implementado en la interfaz; verificar persistencia y destinatario |
| RF11 | Gestionar grupos y miembros de la comunidad | Media | Tablas y pantallas previstas; validar funcionamiento integral |
| RF12 | Permitir reportar contenido y moderarlo | Media | La interfaz contempla moderación; validar persistencia y permisos |

## Requerimientos no funcionales
- Diseño adaptable a celulares, tabletas y computadoras.
- Interfaz clara, coherente con la identidad visual de SIGA.
- Imágenes con texto alternativo cuando corresponda.
- Formularios con validaciones y mensajes comprensibles.
- Variables de entorno fuera del repositorio.
- Permisos de datos configurados mediante políticas de Supabase (RLS).
- Compilación de producción sin errores y pruebas automáticas ejecutadas antes de entregar.
- No afirmar métricas de rendimiento o accesibilidad hasta medirlas.

## Historia de usuario
Como visitante, quiero explorar las obras y conocer a sus artistas para descubrir propuestas y realizar una consulta.

## Criterios de aceptación
- Las pantallas muestran estados claros cuando no hay contenido.
- Los filtros, formularios y navegación responden sin recargar toda la aplicación cuando corresponde.
- Los controles de gestión están disponibles solo para los roles autorizados.
- Los permisos deben comprobarse también en la base de datos, no solamente ocultando botones.
- Los datos publicados deben persistir y poder verse desde otra sesión cuando se usa Supabase real.

## Pendientes de validación
La conexión de producción con Supabase, los permisos RLS, la persistencia entre cuentas y el flujo completo de consultas deben probarse con el proyecto desplegado. No se debe declarar un requisito como aprobado solo porque la pantalla existe.
