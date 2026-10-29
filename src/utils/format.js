// Funciones de formato y de lógica de negocio sin dependencias de React.

import { isEmail } from './validators';

export function formatPrice(value, currency = 'ARS') {
  if (value === null || value === undefined || value === '') return 'Consultar precio';
  const n = Number(value);
  if (Number.isNaN(n)) return 'Consultar precio';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso) {
  if (!iso) return '';
  // Se interpreta como fecha local para evitar el corrimiento por zona horaria.
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(y, m - 1, d),
  );
}

export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isUpcoming(event, now = new Date()) {
  if (!event?.event_date) return false;
  // Si se usa directamente en Array.filter, el 2.º argumento es el índice: se ignora.
  const reference = now instanceof Date ? now : new Date();
  return String(event.event_date).slice(0, 10) >= todayISO(reference);
}

/**
 * Disponibilidad de una obra. Regla clave del sistema de stock:
 * con stock en cero la obra figura como "Agotada" y no admite compra.
 */
export function workAvailability(work) {
  if (!work) return { key: 'no_disponible', label: 'No disponible', canBuy: false };
  if (work.status === 'vendida') return { key: 'vendida', label: 'Vendida', canBuy: false };
  if (work.status === 'no_disponible') return { key: 'no_disponible', label: 'No disponible', canBuy: false };
  if (work.for_sale && Number(work.stock) <= 0) return { key: 'agotada', label: 'Agotada', canBuy: false };
  return { key: 'disponible', label: 'Disponible', canBuy: true };
}

/** Normaliza el stock: si llega a cero se marca como vendida/agotada de forma coherente. */
export function normalizeWorkStock(work) {
  const stock = Math.max(0, Math.floor(Number(work.stock) || 0));
  return { ...work, stock };
}

export function whatsappLink(number, text = '') {
  const digits = String(number || '').replace(/\D/g, '');
  if (!digits) return '';
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${digits}${q}`;
}

export function displayName(profile) {
  if (!profile) return 'Artista';
  return profile.artistic_name || profile.full_name || 'Artista';
}

export function initials(name = '') {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('') || 'A'
  );
}

export function audienceLabel(value) {
  return (
    { ninos: 'Niños', adolescentes: 'Adolescentes', adultos: 'Adultos', mayores: 'Personas mayores' }[value] || value
  );
}

export function splitList(text) {
  if (Array.isArray(text)) return text;
  return String(text || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export function normalizeText(s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function matchesQuery(query, ...fields) {
  const q = normalizeText(query).trim();
  if (!q) return true;
  return fields.some((f) => normalizeText(Array.isArray(f) ? f.join(' ') : f || '').includes(q));
}

/** Convierte un dato de contacto de texto libre en un enlace (correo, web o WhatsApp). */
export function contactLink(text) {
  const t = String(text || '').trim();
  if (!t) return '';
  if (isEmail(t)) return `mailto:${t}`;
  if (/^https?:\/\//.test(t)) return t;
  if (/^[+\d\s()-]{8,}$/.test(t)) return whatsappLink(t);
  return '';
}
