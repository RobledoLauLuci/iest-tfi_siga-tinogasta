// ADAPTADOR SUPABASE (producción): autenticación, base de datos Postgres y Storage reales.
// Los permisos NO dependen de este código: los aplica la base de datos con Row Level Security
// (ver supabase/schema.sql). Aunque alguien modifique el JavaScript del navegador, no puede
// editar publicaciones ajenas.

import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '../config/constants';
import { optimizeImage } from './images';

let client = null;
function sb() {
  if (!client) {
    client = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}

const uid = () =>
  globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function friendly(error) {
  if (!error) return null;
  const msg = String(error.message || error);
  if (/Invalid login credentials/i.test(msg)) return new Error('Correo o contraseña incorrectos.');
  if (/already registered|already been registered/i.test(msg)) return new Error('Ya existe una cuenta con ese correo.');
  if (/Email not confirmed/i.test(msg)) return new Error('Confirmá tu correo antes de iniciar sesión (revisá tu bandeja).');
  if (/row-level security|permission denied/i.test(msg)) return new Error('No tenés permiso para realizar esta acción.');
  if (/Failed to fetch|NetworkError/i.test(msg)) return new Error('No hay conexión con el servidor. Revisá tu internet.');
  return new Error(msg);
}

function unwrap({ data, error }) {
  if (error) throw friendly(error);
  return data;
}

export const supabaseAdapter = {
  mode: 'supabase',

  init() {},

  // ---------- Autenticación ----------
  async getSession() {
    const { data } = await sb().auth.getSession();
    const session = data?.session;
    if (!session) return null;
    const { data: profile } = await sb().from('profiles').select('*').eq('id', session.user.id).maybeSingle();
    return { user: { id: session.user.id, email: session.user.email }, profile: profile || null };
  },

  onAuthChange(callback) {
    const { data } = sb().auth.onAuthStateChange(() => callback());
    return () => data.subscription.unsubscribe();
  },

  async signUp({ email, password, fullName }) {
    const { data, error } = await sb().auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    if (error) throw friendly(error);
    // Si el proyecto exige confirmar el correo, no hay sesión inmediata.
    return { needsConfirmation: !data.session };
  },

  async signIn({ email, password }) {
    const { error } = await sb().auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw friendly(error);
  },

  async signOut() {
    await sb().auth.signOut();
  },

  // ---------- CRUD genérico ----------
  async list(table, { eq } = {}) {
    let query = sb().from(table).select('*');
    if (eq) Object.entries(eq).forEach(([k, v]) => (query = query.eq(k, v)));
    if (table !== 'group_members') query = query.order('created_at', { ascending: false });
    return unwrap(await query);
  },

  async get(table, id) {
    return unwrap(await sb().from(table).select('*').eq('id', id).maybeSingle());
  },

  async create(table, row) {
    const payload = { ...row };
    delete payload.created_at;
    // Las consultas y denuncias anónimas no necesitan leer lo que insertan.
    if (table === 'inquiries' || table === 'reports') {
      const id = payload.id || uid();
      unwrap(await sb().from(table).insert({ ...payload, id }));
      return { ...payload, id };
    }
    return unwrap(await sb().from(table).insert(payload).select().single());
  },

  async update(table, id, patch) {
    const payload = { ...patch };
    delete payload.id;
    delete payload.created_at;
    return unwrap(await sb().from(table).update(payload).eq('id', id).select().single());
  },

  async remove(table, id) {
    unwrap(await sb().from(table).delete().eq('id', id));
  },

  // ---------- Grupos ----------
  async listMembers(groupId) {
    return unwrap(await sb().from('group_members').select('*').eq('group_id', groupId));
  },

  async listAllMemberships() {
    return unwrap(await sb().from('group_members').select('*'));
  },

  async joinGroup(groupId) {
    const { data } = await sb().auth.getUser();
    if (!data?.user) throw new Error('Iniciá sesión para unirte a un grupo.');
    const { error } = await sb()
      .from('group_members')
      .upsert({ group_id: groupId, user_id: data.user.id }, { onConflict: 'group_id,user_id' });
    if (error) throw friendly(error);
  },

  async leaveGroup(groupId) {
    const { data } = await sb().auth.getUser();
    if (!data?.user) return;
    unwrap(await sb().from('group_members').delete().eq('group_id', groupId).eq('user_id', data.user.id));
  },

  // ---------- Estadísticas reales de la comunidad ----------
  // Función SQL con SECURITY DEFINER (ver schema.sql): cuenta sin exponer datos privados.
  async communityCounts() {
    const { data, error } = await sb().rpc('community_counts');
    if (error) throw friendly(error);
    const row = Array.isArray(data) ? data[0] : data;
    return { registered: Number(row?.registered || 0), activePublic: Number(row?.active_public || 0) };
  },

  // ---------- Imágenes (Supabase Storage) ----------
  async uploadImage(file, folder = 'obras') {
    const { data } = await sb().auth.getUser();
    if (!data?.user) throw new Error('Iniciá sesión para subir imágenes.');
    const blob = await optimizeImage(file, { maxSize: 1600, quality: 0.82 });
    const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
    // La primera carpeta es el id del usuario: la política de Storage lo exige.
    const path = `${data.user.id}/${folder}/${uid()}.${ext}`;
    const { error } = await sb().storage.from(CONFIG.bucket).upload(path, blob, {
      contentType: blob.type,
      cacheControl: '31536000',
    });
    if (error) throw friendly(error);
    return sb().storage.from(CONFIG.bucket).getPublicUrl(path).data.publicUrl;
  },
};
