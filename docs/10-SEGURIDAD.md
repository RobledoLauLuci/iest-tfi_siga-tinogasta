# 10 · Seguridad de SIGA

## Principios
- No subir archivos `.env`, contraseñas, tokens ni claves privadas al repositorio.
- No compartir secretos en mensajes, capturas ni documentación.
- No colocar claves de servidor en variables `VITE_*`: las variables con ese prefijo se incorporan a la aplicación que recibe el navegador.
- Usar únicamente la clave pública apropiada para la aplicación cliente de Supabase.
- Nunca usar `service_role` ni una clave secreta de Supabase en el frontend.

## Variables de entorno
La configuración de producción se administra en Vercel. Entre las variables usadas por la interfaz se encuentran:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (o la variable pública equivalente que espera el código)
- `VITE_SUPABASE_BUCKET`
- `VITE_SHOW_DEMO`
- Variables opcionales de contacto, como `VITE_CONTACT_EMAIL`, `VITE_CONTACT_WHATSAPP`, `VITE_INSTAGRAM_URL` y `VITE_FACEBOOK_URL`

Antes de agregar una variable, confirmar el nombre exacto que lee el código. Los valores `VITE_*` son visibles para el navegador; no almacenar allí información secreta.

## Autenticación y autorización
- La autenticación real se gestiona con Supabase Auth cuando el modo Supabase está activo.
- La autorización de registros debe protegerse con políticas RLS en Supabase.
- Ocultar botones en la interfaz no sustituye las políticas de seguridad de la base de datos.
- Probar permisos con cuentas de visitante, artista y administración.
- Verificar que un artista no pueda modificar contenido ajeno manipulando solicitudes.

## Formularios y datos
- Validar campos obligatorios y formatos.
- Mostrar errores sin exponer detalles internos ni credenciales.
- Evitar almacenar datos personales que no sean necesarios.
- Publicar datos de contacto solo con autorización de su titular.
- En fotos de menores, respetar los consentimientos y la configuración prevista por el proyecto.

## Verificación antes de entregar
- [ ] Revisar `git status` y los archivos rastreados.
- [ ] Confirmar que `.env` y `.env.local` estén ignorados por Git.
- [ ] Revisar políticas RLS en `supabase/schema.sql` y en Supabase.
- [ ] Probar acceso permitido y denegado con diferentes roles.
- [ ] Revisar variables de entorno en Vercel.
- [ ] No ejecutar arreglos de dependencias destructivos sin revisar sus efectos.

## Limitación conocida
La existencia del adaptador y del esquema no demuestra por sí sola que la configuración real de Supabase sea correcta. La seguridad debe verificarse en el proyecto conectado y en producción.
