// Validaciones reutilizables. Cada función devuelve un mensaje de error o '' si es válido.

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());

export function validateField(field, value, allValues = {}) {
  if (field.type === 'checkbox') {
    return field.required && !value ? field.requiredMessage || `Tenés que aceptar: ${field.label}` : '';
  }
  const empty = value === undefined || value === null || String(value).trim() === '';
  if (field.required && empty) return `${field.label} es obligatorio.`;
  if (empty) return '';

  if (field.type === 'email' && !isEmail(value)) return 'Ingresá un correo válido.';
  if (field.type === 'url' && !/^https?:\/\/\S+\.\S+/.test(String(value))) {
    return 'Ingresá un enlace que empiece con http:// o https://';
  }
  if (field.type === 'number') {
    const n = Number(value);
    if (Number.isNaN(n)) return `${field.label} debe ser un número.`;
    if (field.min !== undefined && n < field.min) return `${field.label} no puede ser menor que ${field.min}.`;
    if (field.max !== undefined && n > field.max) return `${field.label} no puede ser mayor que ${field.max}.`;
    if (field.integer && !Number.isInteger(n)) return `${field.label} debe ser un número entero.`;
  }
  if (field.maxLength && String(value).length > field.maxLength) {
    return `${field.label} admite hasta ${field.maxLength} caracteres.`;
  }
  if (field.type === 'tel') {
    const digits = String(value).replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) {
      return 'Ingresá un teléfono válido con código de área (ej. 5493837123456).';
    }
  }
  if (field.validate) return field.validate(value, allValues) || '';
  return '';
}

export function validateForm(fields, values) {
  const errors = {};
  for (const f of fields) {
    if (f.showIf && !f.showIf(values)) continue;
    const msg = validateField(f, values[f.name], values);
    if (msg) errors[f.name] = msg;
  }
  return errors;
}

export function validatePassword(pw) {
  if (!pw || pw.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Usá letras y al menos un número.';
  return '';
}
