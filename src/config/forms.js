// Definición de los formularios del panel. Cada lista alimenta <ResourceForm />.

import { AUDIENCES, CATEGORIES, EVENT_CATEGORIES, EVENT_TYPES, MODALITIES, WORK_STATUS } from './constants';

const nextYear = new Date().getFullYear() + 1;

export const workFields = [
  { name: 'title', label: 'Título de la obra', required: true, maxLength: 120, full: true },
  { name: 'category', label: 'Categoría', type: 'select', required: true, options: CATEGORIES, default: CATEGORIES[0] },
  { name: 'technique', label: 'Técnica utilizada', required: true, maxLength: 120, placeholder: 'Ej.: óleo sobre tela' },
  { name: 'description', label: 'Descripción', type: 'textarea', required: true, maxLength: 1500, full: true },
  { name: 'materials', label: 'Materiales', maxLength: 200 },
  { name: 'dimensions', label: 'Dimensiones', maxLength: 60, placeholder: 'Ej.: 60 x 80 cm' },
  { name: 'year', label: 'Año de realización', type: 'number', integer: true, min: 1900, max: nextYear },
  {
    name: 'images',
    label: 'Fotografías de la obra',
    type: 'images',
    required: true,
    max: 6,
    folder: 'obras',
    full: true,
    hint: 'Cargá al menos una fotografía de buena calidad, con buena luz y sin recortes.',
  },
  {
    name: 'for_sale',
    label: 'Publicar esta obra para la venta',
    type: 'checkbox',
    full: true,
    hint: 'Los compradores te consultan y coordinan pago y entrega directamente con vos.',
  },
  { name: 'price', label: 'Precio', type: 'number', min: 0, showIf: (v) => v.for_sale, hint: 'Dejalo vacío para "Consultar precio".' },
  {
    name: 'currency',
    label: 'Moneda',
    type: 'select',
    required: true,
    options: ['ARS', 'USD'],
    default: 'ARS',
    showIf: (v) => v.for_sale,
  },
  {
    name: 'stock',
    label: 'Cantidad disponible (stock)',
    type: 'number',
    integer: true,
    min: 0,
    required: true,
    default: 1,
    showIf: (v) => v.for_sale,
    hint: 'Con stock 0 la obra figura como "Agotada" y no admite consultas de compra.',
  },
  { name: 'status', label: 'Estado', type: 'select', required: true, options: WORK_STATUS, default: 'disponible' },
];

export const workshopFields = [
  { name: 'name', label: 'Nombre del taller', required: true, maxLength: 120, full: true },
  { name: 'description', label: 'Descripción de las actividades', type: 'textarea', required: true, maxLength: 1500, full: true },
  { name: 'techniques', label: 'Técnicas que se enseñan', type: 'tags', required: true, hint: 'Separadas por comas. Ej.: dibujo, acuarela, modelado' },
  { name: 'audience', label: 'Público destinatario', type: 'checkgroup', required: true, options: AUDIENCES, full: true },
  { name: 'modality', label: 'Modalidad', type: 'select', required: true, options: MODALITIES, default: 'Presencial' },
  { name: 'location', label: 'Dirección o lugar', maxLength: 160, hint: 'Para talleres virtuales, indicá la plataforma.' },
  { name: 'schedule', label: 'Días y horarios', required: true, maxLength: 160, placeholder: 'Ej.: martes y jueves de 17 a 19 h' },
  { name: 'price', label: 'Precio (por mes o total)', type: 'number', min: 0, hint: 'Vacío = a consultar.' },
  { name: 'spots', label: 'Cupos disponibles', type: 'number', integer: true, min: 0 },
  { name: 'start_date', label: 'Fecha de inicio', type: 'date' },
  {
    name: 'end_date',
    label: 'Fecha de finalización',
    type: 'date',
    validate: (value, all) => (all.start_date && value < all.start_date ? 'La fecha de fin no puede ser anterior al inicio.' : ''),
  },
  { name: 'requirements', label: 'Requisitos y materiales necesarios', type: 'textarea', maxLength: 800, full: true },
  { name: 'enrollment_info', label: 'Información para inscripciones', type: 'textarea', maxLength: 800, full: true },
  { name: 'contact', label: 'Medio de contacto directo', required: true, maxLength: 160, hint: 'WhatsApp, correo o teléfono. Se mostrará públicamente.' },
];

export const eventFields = [
  { name: 'title', label: 'Título', required: true, maxLength: 140, full: true },
  { name: 'type', label: 'Tipo de evento', type: 'select', required: true, options: EVENT_TYPES, default: EVENT_TYPES[0] },
  { name: 'category', label: 'Categoría', type: 'select', required: true, options: EVENT_CATEGORIES, default: EVENT_CATEGORIES[0] },
  { name: 'description', label: 'Descripción', type: 'textarea', required: true, maxLength: 1500, full: true },
  { name: 'event_date', label: 'Fecha', type: 'date', required: true },
  { name: 'event_time', label: 'Horario', type: 'time' },
  { name: 'place', label: 'Lugar', required: true, maxLength: 160 },
  { name: 'organizer_name', label: 'Organiza', required: true, maxLength: 120 },
  { name: 'contact', label: 'Contacto', maxLength: 160, hint: 'WhatsApp, correo o red social. Se mostrará públicamente.' },
  {
    name: 'flyer_url',
    label: 'Flyer',
    type: 'image',
    folder: 'flyers',
    full: true,
    hint: 'Subí el flyer tal como lo vas a difundir.',
  },
  { name: 'images', label: 'Fotografías (opcional)', type: 'images', max: 4, folder: 'eventos', full: true },
];

export const profileFields = [
  { name: 'full_name', label: 'Nombre completo', required: true, maxLength: 120 },
  { name: 'artistic_name', label: 'Nombre artístico', maxLength: 120 },
  { name: 'specialty', label: 'Especialidad artística', maxLength: 160, full: true, placeholder: 'Ej.: pintura al óleo y acuarela' },
  { name: 'techniques', label: 'Técnicas que utilizás', type: 'tags', full: true, hint: 'Separadas por comas.' },
  { name: 'bio', label: 'Biografía y trayectoria', type: 'textarea', maxLength: 1500, full: true },
  { name: 'avatar_url', label: 'Fotografía de perfil', type: 'image', folder: 'perfil', full: true },
  {
    name: 'whatsapp',
    label: 'WhatsApp (público)',
    type: 'tel',
    placeholder: '5493837123456',
    hint: 'Con código de país y área, sin espacios. Solo se muestra si lo completás.',
  },
  { name: 'email_public', label: 'Correo de contacto (público)', type: 'email', hint: 'Opcional. Solo se muestra si lo completás.' },
  { name: 'instagram', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/tu_usuario' },
  { name: 'facebook', label: 'Facebook', type: 'url', placeholder: 'https://facebook.com/tu_pagina' },
  {
    name: 'is_public',
    label: 'Mostrar mi perfil públicamente',
    type: 'checkbox',
    full: true,
    hint: 'Si lo desactivás, tu perfil deja de aparecer en el sitio (tus obras siguen visibles).',
  },
];

export const groupFields = [
  { name: 'name', label: 'Nombre del grupo', required: true, maxLength: 80, full: true },
  { name: 'description', label: 'Descripción', type: 'textarea', maxLength: 600, full: true },
  { name: 'activities', label: 'Actividades del grupo', type: 'textarea', maxLength: 600, full: true },
  { name: 'image_url', label: 'Imagen representativa', type: 'image', folder: 'grupos', full: true },
];

export const photoFields = [
  { name: 'url', label: 'Fotografía', type: 'image', required: true, folder: 'talleres', full: true },
  { name: 'caption', label: 'Descripción breve', maxLength: 200, full: true },
  { name: 'technique', label: 'Técnica', maxLength: 80 },
  { name: 'taken_on', label: 'Fecha', type: 'date' },
  {
    name: 'has_minors',
    label: 'En la foto aparecen menores de edad identificables',
    type: 'checkbox',
    transient: true,
    full: true,
  },
  {
    name: 'minors_consent',
    label: 'Confirmo que cuento con la autorización escrita de madres, padres o tutores para publicar esta imagen',
    type: 'checkbox',
    required: true,
    requiredMessage: 'Sin autorización no se pueden publicar fotografías identificables de menores.',
    showIf: (v) => v.has_minors,
    full: true,
  },
];
