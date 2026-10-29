# 03 · Tecnologías: con qué lo construimos

| Capa | Tecnología | Motivo |
|---|---|---|
| Interfaz | React | Componentes reutilizables; ya se usa en el Sprint 1 |
| Servidor | Node.js + Express | API REST ya implementada en el Sprint 1 |
| Estilos | CSS + variables | Fiel a la identidad de marca |
| Base de datos | MySQL | Ya diseñada y conectada con pool de conexiones |
| Autenticación | JWT + bcrypt | Sesiones seguras con roles |
| Código | Git + GitHub | Historial y respaldo |
| Publicación | Vercel (interfaz) y Render (API), a confirmar | Despliegue gratuito con HTTPS |
| IA | Claude | Ayuda a redactar especificaciones y código |

## Diferencia con Ursus
Ursus usa Next.js y PostgreSQL. SIGA mantiene React, Express y MySQL porque ya están implementados y funcionando en el Sprint 1; migrar sería rehacer trabajo hecho.

## No usar en este proyecto
- Tailwind, Bootstrap.
- Vue, Angular.
- MongoDB, Firebase.
- TypeScript, por ahora.

Si el stack cambia, primero se edita este archivo y después el código.
