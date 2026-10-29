// Validación y optimización de imágenes en el navegador antes de guardarlas.

export const MAX_UPLOAD_MB = 10;
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImageFile(file) {
  if (!file) return 'No se seleccionó ningún archivo.';
  if (!ACCEPTED_TYPES.includes(file.type)) return 'Formato no admitido. Usá JPG, PNG o WebP.';
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return `La imagen supera los ${MAX_UPLOAD_MB} MB.`;
  return '';
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen.'));
    };
    img.src = url;
  });
}

/**
 * Reduce el lado mayor a `maxSize` px y la convierte a WebP (o JPEG si el navegador no soporta WebP).
 * Devuelve un Blob listo para subir.
 */
export async function optimizeImage(file, { maxSize = 1600, quality = 0.82 } = {}) {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const img = await loadImage(file);
  const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
  const width = Math.round(img.width * ratio);
  const height = Math.round(img.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(img, 0, 0, width, height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  if (blob && blob.type === 'image/webp') return blob;
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

export function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo procesar la imagen.'));
    reader.readAsDataURL(blob);
  });
}
