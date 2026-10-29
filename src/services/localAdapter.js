// ADAPTADOR LOCAL (prototipo): guarda todo en LocalStorage del navegador.
// Sirve para probar el sitio sin configurar servidores. NO es seguro para producción:
// los datos viven en un único navegador y las contraseñas solo se "hashean" en el cliente.
// Implementa la misma interfaz que supabaseAdapter.js, así el resto de la app no cambia.

import { DEFAULT_GROUPS } from '../config/constants';
import { blobToDataUrl, optimizeImage } from './images';

const PREFIX = 'siga:';
export const TABLES = [
  'profiles',
  'works',
  'workshops',
  'workshop_photos',
  'events',
  'groups',
  'group_members',
  'inquiries',
  'reports',
];

// Campo que identifica al dueño de cada registro (para controlar permisos).
const OWNER_FIELD = {
  profiles: 'id',
  works: 'artist_id',
  workshops: 'teacher_id',
  workshop_photos: 'owner_id',
  events: 'organizer_id',
};

const listeners = new Set();

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    throw new Error('No hay espacio en el navegador para guardar más datos. Probá con imágenes más livianas.');
  }
}

const uid = () =>
  globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

async function hashPassword(password) {
  const data = new TextEncoder().encode(`siga-salt:${password}`);
  if (globalThis.crypto?.subtle) {
    const buf = await globalThis.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  let h = 0;
  for (const b of data) h = (h * 31 + b) >>> 0;
  return String(h);
}

function seedIfNeeded() {
  if (read('seeded', false)) return;
  write(
    'groups',
    DEFAULT_GROUPS.map((g) => ({
      id: uid(),
      ...g,
      image_url: '',
      activities: '',
      created_at: new Date().toISOString(),
    })),
  );
  write('seeded', true);
}

function currentUserId() {
  return read('session', null);
}

function currentProfile() {
  const id = currentUserId();
  if (!id) return null;
  return read('profiles', []).find((p) => p.id === id) || null;
}

function isAdmin() {
  return currentProfile()?.role === 'admin';
}

function assertCanWrite(table, action, row) {
  const user = currentProfile();
  const adminOnly = ['groups'];
  if (table === 'inquiries' && action === 'create') return; // cualquiera puede consultar
  if (table === 'reports' && action === 'create') return;
  if (!user) throw new Error('Tenés que iniciar sesión para hacer esto.');
  if (user.role === 'admin') return;
  if (adminOnly.includes(table) || table === 'reports') {
    throw new Error('Solo la administración puede hacer esto.');
  }
  if (table === 'inquiries') {
    if (row?.to_user_id !== user.id) throw new Error('No podés modificar consultas de otras personas.');
    return;
  }
  const field = OWNER_FIELD[table];
  if (!field) return;
  if (action === 'create') {
    if (row[field] !== user.id) throw new Error('No podés publicar a nombre de otra persona.');
    return;
  }
  if (row?.[field] !== user.id) throw new Error('Solo podés modificar tus propias publicaciones.');
}

export const localAdapter = {
  mode: 'local',

  init() {
    seedIfNeeded();
  },

  // ---------- Autenticación ----------
  async getSession() {
    const profile = currentProfile();
    if (!profile) return null;
    const user = read('users', []).find((u) => u.id === profile.id);
    return user ? { user: { id: user.id, email: user.email }, profile } : null;
  },

  onAuthChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  async signUp({ email, password, fullName }) {
    const users = read('users', []);
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalized)) throw new Error('Ya existe una cuenta con ese correo.');
    const id = uid();
    users.push({ id, email: normalized, password_hash: await hashPassword(password) });
    write('users', users);

    const profiles = read('profiles', []);
    const profile = {
      id,
      full_name: fullName.trim(),
      artistic_name: '',
      bio: '',
      specialty: '',
      techniques: [],
      avatar_url: '',
      whatsapp: '',
      email_public: '',
      instagram: '',
      facebook: '',
      // En modo local, la primera cuenta creada es administradora.
      role: profiles.length === 0 ? 'admin' : 'artist',
      is_public: true,
      created_at: new Date().toISOString(),
    };
    profiles.push(profile);
    write('profiles', profiles);
    write('session', id);
    listeners.forEach((cb) => cb());
    return { needsConfirmation: false };
  },

  async signIn({ email, password }) {
    const normalized = email.trim().toLowerCase();
    const user = read('users', []).find((u) => u.email === normalized);
    if (!user || user.password_hash !== (await hashPassword(password))) {
      throw new Error('Correo o contraseña incorrectos.');
    }
    write('session', user.id);
    listeners.forEach((cb) => cb());
  },

  async signOut() {
    window.localStorage.removeItem(PREFIX + 'session');
    listeners.forEach((cb) => cb());
  },

  // ---------- CRUD genérico ----------
  async list(table, { eq } = {}) {
    let rows = read(table, []);
    if (eq) rows = rows.filter((r) => Object.entries(eq).every(([k, v]) => r[k] === v));
    if (table === 'inquiries') {
      const user = currentProfile();
      if (!user) return [];
      if (user.role !== 'admin') rows = rows.filter((r) => r.to_user_id === user.id);
    }
    if (table === 'reports' && !isAdmin()) return [];
    if (table === 'profiles') {
      const user = currentProfile();
      rows = rows.filter((p) => p.is_public || user?.role === 'admin' || p.id === user?.id);
    }
    return [...rows].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  },

  async get(table, id) {
    const rows = await this.list(table);
    return rows.find((r) => r.id === id) || null;
  },

  async create(table, row) {
    assertCanWrite(table, 'create', row);
    const rows = read(table, []);
    const record = { id: row.id || uid(), ...row, created_at: new Date().toISOString() };
    rows.push(record);
    write(table, rows);
    return record;
  },

  async update(table, id, patch) {
    const rows = read(table, []);
    const index = rows.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('No se encontró el registro.');
    assertCanWrite(table, 'update', rows[index]);
    if (table === 'profiles' && 'role' in patch && patch.role !== rows[index].role && !isAdmin()) {
      throw new Error('Solo la administración puede cambiar roles.');
    }
    rows[index] = { ...rows[index], ...patch, id };
    write(table, rows);
    return rows[index];
  },

  async remove(table, id) {
    const rows = read(table, []);
    const target = rows.find((r) => r.id === id);
    if (!target) return;
    assertCanWrite(table, 'delete', target);
    write(
      table,
      rows.filter((r) => r.id !== id),
    );
    // Limpieza en cascada simple
    if (table === 'workshops') {
      write(
        'workshop_photos',
        read('workshop_photos', []).filter((p) => p.workshop_id !== id),
      );
    }
    if (table === 'groups') {
      write(
        'group_members',
        read('group_members', []).filter((m) => m.group_id !== id),
      );
    }
  },

  // ---------- Grupos ----------
  async listMembers(groupId) {
    return read('group_members', []).filter((m) => m.group_id === groupId);
  },

  async listAllMemberships() {
    return read('group_members', []);
  },

  async joinGroup(groupId) {
    const user = currentProfile();
    if (!user) throw new Error('Iniciá sesión para unirte a un grupo.');
    const members = read('group_members', []);
    if (members.some((m) => m.group_id === groupId && m.user_id === user.id)) return;
    members.push({ group_id: groupId, user_id: user.id, created_at: new Date().toISOString() });
    write('group_members', members);
  },

  async leaveGroup(groupId) {
    const user = currentProfile();
    if (!user) return;
    write(
      'group_members',
      read('group_members', []).filter((m) => !(m.group_id === groupId && m.user_id === user.id)),
    );
  },

  // ---------- Estadísticas reales de la comunidad ----------
  async communityCounts() {
    const profiles = read('profiles', []);
    const owners = new Set([
      ...read('works', []).map((w) => w.artist_id),
      ...read('workshops', []).map((w) => w.teacher_id),
      ...read('events', []).map((e) => e.organizer_id),
    ]);
    return {
      registered: profiles.length,
      activePublic: profiles.filter((p) => p.is_public && owners.has(p.id)).length,
    };
  },

  // ---------- Imágenes ----------
  // En modo local las imágenes se guardan optimizadas como data URL (livianas, máx. 1200 px).
  async uploadImage(file) {
    const blob = await optimizeImage(file, { maxSize: 1200, quality: 0.78 });
    return blobToDataUrl(blob);
  },
};
