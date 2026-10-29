# 04 · Arquitectura: cómo se organiza el código

```text
siga/
├── backend/
│   ├── src/
│   │   ├── config/db.js        ← única conexión a MySQL
│   │   ├── routes/             ← rutas de la API
│   │   ├── controllers/        ← lógica de cada ruta
│   │   └── middleware/         ← JWT y control de roles
│   ├── .env                    ← no se sube
│   └── server.js
├── frontend/
│   ├── public/                 ← favicon e imágenes fijas
│   └── src/
│       ├── components/         ← TarjetaObra, TarjetaTaller, Menu
│       ├── pages/              ← Inicio, Galeria, Talleres, Panel...
│       └── estilos/variables.css
├── db/esquema.sql              ← tablas
└── docs/                       ← especificaciones .md
```

| Parte | Función |
|---|---|
| `config/db.js` | Pool de conexiones MySQL |
| `routes/` | Define los endpoints `/api/...` |
| `middleware/` | Verifica el token y el rol |
| `components/` | Piezas de interfaz reutilizables |
| `pages/` | Una pantalla por archivo |
| `db/esquema.sql` | Crea las tablas |
