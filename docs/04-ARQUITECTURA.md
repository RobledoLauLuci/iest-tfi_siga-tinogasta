# 04 · Arquitectura de SIGA

## Estructura principal

```text
siga-tinogasta/
├── docs/                  Documentación del proyecto
├── public/                Recursos estáticos públicos
├── src/
│   ├── components/        Componentes reutilizables de interfaz
│   ├── pages/             Pantallas públicas y paneles
│   ├── services/          Reglas de negocio y adaptadores de datos
│   │   ├── index.js       Interfaz común de operaciones
│   │   ├── localAdapter.js
│   │   └── supabaseAdapter.js
│   ├── config/            Constantes y definiciones de formularios
│   ├── styles/            Tokens, estilos base, componentes y páginas
│   └── __tests__/         Pruebas automatizadas
├── supabase/
│   └── schema.sql         Esquema SQL y configuración de datos/permisos
├── .env.example           Ejemplo de variables (si está presente)
├── .gitignore             Archivos excluidos de Git
├── package.json           Scripts y dependencias
├── vite.config.js         Configuración de Vite
└── vercel.json            Configuración de despliegue/rutas
```

## Responsabilidad de las partes
- **`src/pages/`:** pantallas de la aplicación.
- **`src/components/`:** elementos reutilizables, formularios, tarjetas y componentes de interfaz.
- **`src/services/index.js`:** punto común de acceso a las operaciones de datos.
- **`src/services/localAdapter.js`:** modo local/de demostración; sus datos no se comparten entre usuarios.
- **`src/services/supabaseAdapter.js`:** operaciones conectadas a Supabase.
- **`src/config/`:** constantes, roles, categorías y configuración de formularios.
- **`src/styles/`:** tokens visuales y estilos.
- **`supabase/schema.sql`:** definición de tablas y políticas del backend; revisar este archivo para conocer los nombres exactos.

## Flujo general
1. La persona navega por una pantalla React.
2. La pantalla utiliza los servicios de `src/services/index.js`.
3. La aplicación trabaja con el adaptador local o con el adaptador Supabase, según la configuración.
4. En modo Supabase, la base de datos y sus políticas RLS deben autorizar cada operación.
5. Vite genera los archivos de producción y Vercel los publica.

## Importante
No existe en la estructura documentada un directorio `backend/` con Express ni un esquema MySQL separado. No documentar esa arquitectura antigua como si fuera la actual.
