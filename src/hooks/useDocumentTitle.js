import { useEffect } from 'react';

const BASE = 'SIGA · Artes visuales de Tinogasta';

// Actualiza el título y la meta descripción de cada página (SEO básico para buscadores y redes).
export function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · SIGA Tinogasta` : BASE;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description.slice(0, 160));
    }
  }, [title, description]);
}
