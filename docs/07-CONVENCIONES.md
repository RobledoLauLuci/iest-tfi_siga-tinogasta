# 07 · Convenciones de desarrollo

## Lenguaje y formato
- La interfaz y la documentación para usuarios se redactan en español.
- Mantener los nombres de archivos y convenciones que ya usa el código; evitar renombrados masivos sin necesidad.
- Utilizar componentes React reutilizables cuando ayuden a mantener consistencia.
- Preferir `const`; usar `let` cuando sea necesario reasignar. Evitar `var`.
- Mantener funciones pequeñas y nombres claros.

## Organización
- Pantallas en `src/pages/`.
- Componentes reutilizables en `src/components/`.
- Operaciones y adaptadores de datos en `src/services/`.
- Configuración común en `src/config/`.
- Estilos en `src/styles/`.
- Pruebas en `src/__tests__/`.
- Documentación en `docs/`.

## Datos y errores
- Las pantallas deben utilizar la capa de servicios, en lugar de duplicar lógica de acceso a datos.
- Mostrar estados de carga, éxito, error y ausencia de contenido cuando corresponda.
- Validar los datos tanto en la interfaz como en la capa de persistencia.
- No registrar tokens, claves, contraseñas ni información privada en la consola.

## Git
Mensajes de commit breves y descriptivos, por ejemplo:
- `documenta: actualiza arquitectura real de SIGA`
- `corrige: valida formulario de contacto`
- `mejora: ajusta galería para celulares`

## Flujo de trabajo
1. Revisar el archivo y la funcionalidad que se va a modificar.
2. Realizar un cambio acotado.
3. Ejecutar `npm test`.
4. Ejecutar `npm run build`.
5. Revisar visualmente los cambios.
6. Hacer commit y subir los cambios a GitHub.
7. Verificar el despliegue de Vercel.

No declarar pruebas aprobadas sin haberlas ejecutado.
