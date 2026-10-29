# 03 · Tecnologías utilizadas en SIGA

## Stack actual

| Capa | Tecnología | Uso |
|---|---|---|
| Interfaz | React | Componentes y pantallas de la aplicación |
| Herramientas de desarrollo y compilación | Vite | Servidor de desarrollo y build de producción |
| Navegación | React Router | Navegación entre pantallas |
| Estilos | CSS | Diseño visual y adaptación a distintos tamaños |
| Backend como servicio | Supabase | Servicios de base de datos, autenticación y almacenamiento |
| Base de datos | PostgreSQL administrado por Supabase | Persistencia de los datos |
| Seguridad de datos | Supabase Auth y políticas RLS | Identidad, roles y acceso a los registros |
| Almacenamiento | Supabase Storage | Imágenes, según configuración del proyecto |
| Pruebas | npm test | Ejecución de las pruebas automatizadas definidas |
| Control de versiones | Git y GitHub | Historial y repositorio público |
| Publicación de interfaz | Vercel | Despliegue web |
| Asistencia de desarrollo | Herramientas de IA utilizadas durante el trabajo | Apoyo; revisar y validar cada resultado |

## Arquitectura elegida
SIGA utiliza React + Vite y un servicio de datos que puede trabajar con un adaptador local o con Supabase. La aplicación accede a las operaciones mediante `src/services/index.js`, de modo que las pantallas no necesitan conocer directamente todos los detalles de cada adaptador.

## Tecnologías que no describen la versión actual
Los documentos anteriores mencionaban Express, MySQL, JWT y bcrypt como si fueran el stack de SIGA. Esas tecnologías no describen la implementación actual documentada en el repositorio y no deben presentarse como utilizadas por la aplicación, salvo que se incorpore y documente un backend separado en el futuro.

## Variables de entorno
El proyecto utiliza variables con prefijo `VITE_` para valores que la interfaz necesita leer. Todo valor `VITE_*` se expone al navegador y no debe contener secretos de servidor. Nunca usar una clave `service_role`, una clave secreta ni la contraseña de la base de datos en variables del frontend.

## Publicación
La interfaz se compila con `npm run build` y se publica en Vercel. Las variables de entorno deben configurarse en Vercel y luego generar un nuevo despliegue.
