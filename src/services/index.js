// Punto único de acceso a los datos. Elige el adaptador según las variables de entorno
// y agrega reglas de negocio (stock, contenido de demostración, estadísticas reales).

import { CONFIG, USE_SUPABASE } from '../config/constants';
import { DEMO_PROFILE, DEMO_PROFILE_ID, DEMO_WORKSHOPS } from '../data/demo';
import { isUpcoming, normalizeWorkStock } from '../utils/format';
import { localAdapter } from './localAdapter';
import { supabaseAdapter } from './supabaseAdapter';

export const adapter = USE_SUPABASE ? supabaseAdapter : localAdapter;
adapter.init();

export const isDemoId = (id) => typeof id === 'string' && id.startsWith('demo-');

// El contenido de demostración solo aparece si no hay talleres reales.
async function demoActive() {
  if (!CONFIG.showDemo) return false;
  const real = await adapter.list('workshops');
  return real.length === 0;
}

const matchesEq = (row, eq) => !eq || Object.entries(eq).every(([k, v]) => row[k] === v);

export const api = {
  mode: adapter.mode,

  // Autenticación
  getSession: () => adapter.getSession(),
  onAuthChange: (cb) => adapter.onAuthChange(cb),
  signUp: (data) => adapter.signUp(data),
  signIn: (data) => adapter.signIn(data),
  signOut: () => adapter.signOut(),

  // Lecturas (con contenido de demostración cuando corresponde)
  async list(table, opts = {}) {
    const rows = await adapter.list(table, opts);
    if (table === 'workshops' && (await demoActive())) return DEMO_WORKSHOPS.filter((w) => matchesEq(w, opts.eq));
    if (table === 'profiles' && (await demoActive()) && matchesEq(DEMO_PROFILE, opts.eq)) {
      return [...rows, DEMO_PROFILE];
    }
    return rows;
  },

  async get(table, id) {
    if (table === 'profiles' && id === DEMO_PROFILE_ID) return CONFIG.showDemo ? DEMO_PROFILE : null;
    if (table === 'workshops' && isDemoId(id)) return CONFIG.showDemo ? DEMO_WORKSHOPS.find((w) => w.id === id) || null : null;
    return adapter.get(table, id);
  },

  // Escrituras
  async create(table, row) {
    if (table === 'works') row = normalizeWorkStock(row);
    return adapter.create(table, row);
  },

  async update(table, id, patch) {
    if (table === 'works' && 'stock' in patch) patch = normalizeWorkStock(patch);
    return adapter.update(table, id, patch);
  },

  remove: (table, id) => adapter.remove(table, id),

  // Grupos
  listMembers: (groupId) => adapter.listMembers(groupId),
  listAllMemberships: () => adapter.listAllMemberships(),
  joinGroup: (groupId) => adapter.joinGroup(groupId),
  leaveGroup: (groupId) => adapter.leaveGroup(groupId),

  // Imágenes
  uploadImage: (file, folder) => adapter.uploadImage(file, folder),

  // Consultas a artistas o institucionales (to_user_id = null)
  sendInquiry(data) {
    return adapter.create('inquiries', { ...data, read: false });
  },

  sendReport(data) {
    return adapter.create('reports', { ...data, status: 'abierta' });
  },

  // Estadísticas reales: nunca incluyen contenido de demostración.
  async stats() {
    const [counts, works, workshops, events, groups] = await Promise.all([
      adapter.communityCounts(),
      adapter.list('works'),
      adapter.list('workshops'),
      adapter.list('events'),
      adapter.list('groups'),
    ]);
    return {
      registered: counts.registered,
      activePublic: counts.activePublic,
      works: works.length,
      worksForSale: works.filter((w) => w.for_sale && w.status === 'disponible' && Number(w.stock) > 0).length,
      workshops: workshops.length,
      upcomingEvents: events.filter((e) => isUpcoming(e)).length,
      groups: groups.length,
    };
  },
};
