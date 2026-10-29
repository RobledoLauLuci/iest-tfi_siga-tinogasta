// Constantes compartidas por toda la aplicación.

export const SITE_NAME = 'SIGA · Artes visuales de Tinogasta';

export const CATEGORIES = [
  'Pintura',
  'Dibujo',
  'Escultura',
  'Cerámica',
  'Grabado',
  'Fotografía',
  'Arte digital',
  'Técnicas mixtas',
  'Textil y fibras',
  'Otras disciplinas',
];

export const WORK_STATUS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'vendida', label: 'Vendida' },
  { value: 'no_disponible', label: 'No disponible' },
];

export const AUDIENCES = [
  { value: 'ninos', label: 'Niños' },
  { value: 'adolescentes', label: 'Adolescentes' },
  { value: 'adultos', label: 'Adultos' },
  { value: 'mayores', label: 'Personas mayores' },
];

export const MODALITIES = ['Presencial', 'Virtual', 'Mixta'];

export const EVENT_TYPES = [
  'Exposición',
  'Feria de arte',
  'Encuentro cultural',
  'Taller especial',
  'Concurso',
  'Muestra colectiva',
  'Presentación de proyecto',
  'Convocatoria',
  'Inauguración',
  'Otra actividad',
];

export const EVENT_CATEGORIES = [
  'Artes visuales',
  'Educación artística',
  'Cultura local',
  'Comunidad',
  'Mercado de arte',
];

export const REPORT_REASONS = [
  'Contenido inapropiado',
  'Información falsa o engañosa',
  'Fotografía de menores sin autorización',
  'Obra o texto que no es del autor',
  'Otro motivo',
];

export const ROLES = {
  artist: 'Artista registrado',
  admin: 'Administrador',
};

export const DEFAULT_GROUPS = [
  { name: 'Pintura y dibujo', description: 'Artistas que trabajan con pincel, lápiz, tinta y color sobre papel, tela o muro.' },
  { name: 'Escultura y cerámica', description: 'Modelado, talla, cerámica y trabajo en volumen con distintos materiales.' },
  { name: 'Fotografía y arte digital', description: 'Miradas con cámara y pantalla: fotografía, ilustración digital y nuevos medios.' },
  { name: 'Artesanos y técnicas mixtas', description: 'Oficios y combinaciones de técnicas que mezclan tradición y experimentación.' },
  { name: 'Docentes y talleristas', description: 'Quienes comparten su saber en talleres, clases y espacios de formación.' },
  { name: 'Colectivos independientes', description: 'Grupos autogestionados que producen y exponen en conjunto.' },
];

const env = import.meta.env || {};

export const CONFIG = {
  supabaseUrl: env.VITE_SUPABASE_URL || '',
  supabaseKey: env.VITE_SUPABASE_ANON_KEY || '',
  bucket: env.VITE_SUPABASE_BUCKET || 'siga-images',
  showDemo: String(env.VITE_SHOW_DEMO ?? 'true') !== 'false',
  contactEmail: env.VITE_CONTACT_EMAIL || '',
  contactWhatsapp: env.VITE_CONTACT_WHATSAPP || '',
  instagram: env.VITE_INSTAGRAM_URL || '',
  facebook: env.VITE_FACEBOOK_URL || '',
};

export const USE_SUPABASE = Boolean(CONFIG.supabaseUrl && CONFIG.supabaseKey);
