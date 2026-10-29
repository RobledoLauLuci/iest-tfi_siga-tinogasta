# SIGA · Artes visuales de Tinogasta

Plataforma web para los artistas visuales de Tinogasta, Catamarca: galería de obras, venta con control de stock,
perfiles de artistas, talleres, comunidad y agenda cultural.
Hecha con **React + Vite + React Router**. Para producción usa **Supabase** (base de datos, cuentas e imágenes).

> Guía pensada para quien está aprendiendo. Si algo no sale, no te preocupes: cada paso dice qué deberías ver.

---

## Guía paso a paso

### 1. Descargar y descomprimir
Descargá `SIGA-Tinogasta.zip`, hacé clic derecho → **Extraer todo** (Windows) o doble clic (Mac).
Vas a obtener una carpeta `siga-tinogasta`. Guardala en un lugar fácil, por ejemplo `Documentos`.

### 2. Instalar Node.js (una sola vez)
Node.js es el programa que hace funcionar el proyecto en tu computadora.
1. Entrá a https://nodejs.org y descargá la versión **LTS** (la recomendada). Necesitás la 18 o superior.
2. Instalala con "Siguiente" en todo.
3. Para comprobar: abrí una terminal (paso 4) y escribí `node -v`. Debe mostrar un número como `v22.x.x`.

### 3. Abrir la carpeta en Visual Studio Code
1. Abrí Visual Studio Code (https://code.visualstudio.com si no lo tenés).
2. Menú **Archivo → Abrir carpeta…** y elegí `siga-tinogasta`.

### 4. Abrir una terminal dentro de la carpeta
En VS Code: menú **Terminal → Nueva terminal**. Se abre abajo y ya está ubicada en la carpeta del proyecto.

### 5. Instalar las dependencias
En la terminal escribí y presioná Enter:
```bash
npm install
```
Tarda un minuto y crea la carpeta `node_modules` (es normal, no la toques). Al terminar no debe mostrar errores en rojo.

### 6. Configurar las variables de entorno
Las variables son los datos de conexión. **Si querés solo probar el sitio, podés saltear este paso y el 7 y 8**:
funciona en *modo local* (ver más abajo).
1. En la carpeta hay un archivo `.env.example`. Hacé una copia y llamala `.env` (exactamente así, con el punto al inicio).
2. Abrí `.env` y completá los valores cuando los tengas (paso 7). Ejemplo:
   ```
   VITE_SUPABASE_URL=https://abcdxyz.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
3. **Nunca subas `.env` a GitHub ni lo compartas.** Ya está excluido en `.gitignore`.

### 7. Crear y conectar un proyecto de Supabase
1. Entrá a https://supabase.com, creá una cuenta gratuita y tocá **New project**.
2. Poné un nombre (ej. `siga`), una contraseña para la base de datos (guardala) y la región más cercana.
3. Esperá a que termine de crearse (1-2 minutos).
4. Andá a **Project Settings → API**. Copiá:
   - **Project URL** → pegala en `VITE_SUPABASE_URL`
   - **anon public** (clave pública) → pegala en `VITE_SUPABASE_ANON_KEY`
   - ⚠️ **No uses nunca la clave `service_role`** en este proyecto: es secreta.
5. En **Authentication → Providers** verificá que **Email** esté activo.
6. En **Authentication → URL Configuration**, en *Site URL* poné `http://localhost:5173` (y más adelante la dirección de tu sitio publicado).

### 8. Ejecutar el esquema SQL y configurar permisos
1. En Supabase, abrí **SQL Editor → New query**.
2. Abrí en VS Code el archivo `supabase/schema.sql`, copiá **todo** su contenido y pegalo en Supabase.
3. Tocá **Run**. Debe decir "Success". Esto crea las tablas, los **permisos de seguridad (RLS)**, el espacio para
   imágenes y los 6 grupos artísticos iniciales. Es seguro ejecutarlo más de una vez.
4. Registrate en el sitio (paso 9) y después hacete administradora pegando esto en el SQL Editor
   (cambiá el correo por el tuyo):
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'TU_CORREO@ejemplo.com');
   ```

### 9. Iniciar la aplicación
```bash
npm run dev
```
Verás algo así:
```
  ➜  Local:   http://localhost:5173/
```

### 10. Abrir la dirección local
Mantené presionada la tecla Ctrl y hacé clic en la dirección, o copiala en tu navegador.
Para detener el servidor: Ctrl + C en la terminal.

### 11. Importar el proyecto a Replit
1. Entrá a https://replit.com y creá una cuenta.
2. Opción más simple: **Create Repl → Import from GitHub**. Para eso subí antes el proyecto a un repositorio de GitHub
   (en VS Code: pestaña *Control de código fuente* → *Publicar en GitHub*; el `.gitignore` ya evita subir `node_modules` y `.env`).
3. Otra opción: **Create Repl → Node.js**, y arrastrá el contenido de la carpeta (sin `node_modules`) al panel de archivos.
4. En Replit abrí la pestaña **Secrets** (candado) y creá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con tus valores.
5. En la consola de Replit ejecutá `npm install` y luego `npm run dev -- --host 0.0.0.0`.
   Si Replit bloquea el sitio por el host, en `vite.config.js` agregá dentro de `defineConfig({ ... })`:
   `server: { host: '0.0.0.0', allowedHosts: true }`.

---

## Qué funciona en modo local y qué necesita Supabase

| Función | Modo local (sin configurar) | Con Supabase |
|---|---|---|
| Ver todo el sitio, filtros, buscador | ✅ | ✅ |
| Registro, inicio de sesión, roles | ✅ solo en tu navegador | ✅ cuentas reales |
| Publicar obras, stock, talleres, eventos, fotos | ✅ solo en tu navegador | ✅ compartido y público |
| Consultas y denuncias | ✅ solo en tu navegador | ✅ llegan a la persona destinataria |
| Que otras personas vean lo que publicás | ❌ | ✅ |
| Seguridad real de contraseñas y permisos | ❌ (solo prototipo) | ✅ (RLS en la base de datos) |
| Imágenes en almacenamiento en la nube | ❌ (se guardan en el navegador) | ✅ |
| Confirmación de correo | ❌ | ✅ (la envía Supabase) |

En modo local la **primera cuenta que se registra es administradora**. Los datos viven solo en ese navegador:
sirve para estudiar y presentar, **no para publicar**.

## Estado del proyecto (sin exagerar)

**Probado en un navegador real en modo local:** registro/ingreso, roles, publicar obras con foto, stock con +/−
(con stock 0 figura «Agotada» y no admite compra), talleres y fotos con autorización de menores, eventos próximos/finalizados,
consultas, denuncias, moderación de administración, páginas públicas y menú móvil. Hay 8 pruebas automáticas
(`npm test`) y el build de producción compila.

**NO probado:** la conexión con un proyecto real de Supabase. El esquema SQL y el adaptador (`src/services/supabaseAdapter.js`)
están escritos pero hay que verificarlos con tu proyecto. Si algo falla al conectar, revisá primero la consola del navegador (F12)
y que ejecutaste todo `schema.sql`.

**Pendiente / no incluido:** carrito de compras, pagos y pedidos (no se simulan; la arquitectura está preparada),
pantalla «Olvidé mi contraseña», avisos por correo (las consultas llegan al panel), datos de contacto institucional
(`VITE_CONTACT_*`) y redes del pie de página.

## Comandos útiles

```bash
npm run dev       # iniciar el sitio para desarrollar
npm test          # pruebas automáticas
npm run build     # versión final en la carpeta dist
npm run preview   # ver esa versión final localmente
```

## Cómo está organizado

```
src/
  components/   layout, cards, forms (ResourceForm, ResourceManager, ImageUploader), ui, guards
  pages/        páginas públicas y pages/dashboard (panel de artista y administración)
  services/     index.js (reglas de negocio) · localAdapter.js · supabaseAdapter.js
  config/       constants.js (categorías, roles) · forms.js (definición de formularios)
  styles/       tokens.css (paleta oficial), base, layout, components, pages
  __tests__/    pruebas automáticas
supabase/schema.sql   tablas, permisos (RLS) e imágenes
```
La app solo habla con `services/index.js`. Los dos adaptadores tienen la misma interfaz: por eso pasar de modo local
a Supabase no cambia ninguna pantalla, y ahí mismo se sumarán carrito y pagos.

## Variables de entorno

| Variable | Para qué |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Activan el modo Supabase |
| `VITE_SUPABASE_BUCKET` | Nombre del espacio de imágenes (`siga-images`) |
| `VITE_SHOW_DEMO` | `false` oculta el taller de demostración |
| `VITE_CONTACT_EMAIL`, `VITE_CONTACT_WHATSAPP`, `VITE_INSTAGRAM_URL`, `VITE_FACEBOOK_URL` | Contacto institucional |

## Publicar en internet
Vercel, Netlify o Cloudflare Pages: comando `npm run build`, carpeta `dist`. Cargá allí las variables `VITE_*`
(no subas `.env`). Ya incluye `vercel.json` y `public/_redirects` para que las rutas funcionen al recargar.
Después agregá la dirección publicada en Supabase → Authentication → URL Configuration.

## Notas
- Las tipografías vienen de Google Fonts; sin internet se usan las del sistema.
- El taller de demostración se identifica como «Demo» y desaparece al publicarse el primer taller real.
