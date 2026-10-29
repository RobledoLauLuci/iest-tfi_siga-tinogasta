// CONTENIDO DE DEMOSTRACIÓN.
// Se muestra únicamente mientras no exista ningún taller real y VITE_SHOW_DEMO no sea "false".
// Nunca se cuenta en las estadísticas ni tiene datos de contacto: sirve para ver cómo luce el sitio.

export const DEMO_PROFILE_ID = 'demo-tallerista';

export const DEMO_PROFILE = {
  id: DEMO_PROFILE_ID,
  is_demo: true,
  full_name: 'Tallerista independiente (demostración)',
  artistic_name: 'Tallerista de ejemplo',
  specialty: 'Dibujo, pintura y escultura para niños y adultos',
  techniques: ['Dibujo', 'Pintura', 'Escultura', 'Modelado en arcilla'],
  bio: 'Perfil de demostración. Muestra cómo se verá la presentación de una tallerista o un tallerista independiente de Tinogasta. Los datos reales aparecerán cuando se registren los y las artistas.',
  avatar_url: '',
  whatsapp: '',
  email_public: '',
  instagram: '',
  facebook: '',
  role: 'artist',
  is_public: true,
  created_at: '2026-01-01T00:00:00.000Z',
};

export const DEMO_WORKSHOPS = [
  {
    id: 'demo-taller-dibujo',
    is_demo: true,
    teacher_id: DEMO_PROFILE_ID,
    name: 'Dibujo y color para niñas y niños',
    description:
      'Taller de demostración: exploración del trazo, la línea y el color a través de juegos y proyectos breves.',
    techniques: ['Dibujo', 'Lápices de color', 'Acuarela'],
    audience: ['ninos'],
    modality: 'Presencial',
    location: 'Lugar a definir (demostración)',
    schedule: 'Días y horarios a definir',
    price: '',
    spots: 12,
    start_date: '',
    end_date: '',
    requirements: 'Materiales básicos a coordinar con quien dicte el taller.',
    enrollment_info: 'Dato de demostración: la inscripción se habilitará con los datos reales.',
    contact: '',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-taller-pintura',
    is_demo: true,
    teacher_id: DEMO_PROFILE_ID,
    name: 'Pintura y escultura para adultos',
    description:
      'Taller de demostración: introducción a la pintura sobre tela y al modelado en arcilla, a ritmo personal.',
    techniques: ['Pintura', 'Escultura', 'Modelado en arcilla'],
    audience: ['adultos', 'mayores'],
    modality: 'Presencial',
    location: 'Lugar a definir (demostración)',
    schedule: 'Días y horarios a definir',
    price: '',
    spots: 8,
    start_date: '',
    end_date: '',
    requirements: 'No se requiere experiencia previa.',
    enrollment_info: 'Dato de demostración: la inscripción se habilitará con los datos reales.',
    contact: '',
    created_at: '2026-01-01T00:00:00.000Z',
  },
];
