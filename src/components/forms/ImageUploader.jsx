import { useId, useRef, useState } from 'react';
import { api } from '../../services';
import { validateImageFile } from '../../services/images';

// Cargador de imágenes: valida, optimiza y sube (Storage o modo local). Devuelve las URL.
export default function ImageUploader({ value = [], onChange, multiple = false, max = 6, folder = 'obras', label }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const list = Array.isArray(value) ? value : value ? [value] : [];

  async function handleFiles(fileList) {
    setError('');
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    const room = multiple ? max - list.length : 1;
    if (room <= 0) {
      setError(`Podés cargar hasta ${max} imágenes.`);
      return;
    }
    const selected = files.slice(0, room);
    for (const f of selected) {
      const problem = validateImageFile(f);
      if (problem) {
        setError(`${f.name}: ${problem}`);
        return;
      }
    }
    setBusy(true);
    try {
      const urls = [];
      for (const f of selected) urls.push(await api.uploadImage(f, folder));
      onChange(multiple ? [...list, ...urls] : urls);
      if (files.length > room) setError(`Solo se cargaron ${room} imágenes (máximo ${max}).`);
    } catch (e) {
      setError(e.message || 'No se pudo subir la imagen.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function remove(index) {
    onChange(multiple ? list.filter((_, i) => i !== index) : []);
  }

  return (
    <div className="uploader">
      {list.length > 0 && (
        <div className="uploader-list">
          {list.map((src, i) => (
            <div className="thumb" key={src.slice(-40) + i}>
              <img src={src} alt={`Imagen cargada ${i + 1}`} />
              <button type="button" onClick={() => remove(i)} aria-label={`Quitar imagen ${i + 1}`}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {(multiple ? list.length < max : list.length === 0) && (
        <label className="drop" htmlFor={inputId}>
          <strong>{busy ? 'Subiendo y optimizando…' : label || (multiple ? 'Elegir fotografías' : 'Elegir una imagen')}</strong>
          <div className="hint muted" style={{ fontSize: '0.82rem' }}>
            JPG, PNG o WebP · hasta 10 MB · se optimizan automáticamente
          </div>
          <input
            id={inputId}
            ref={inputRef}
            className="visually-hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={multiple}
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      )}
      {error && (
        <div className="error" role="alert" style={{ color: 'var(--error)', fontSize: '0.88rem' }}>
          {error}
        </div>
      )}
    </div>
  );
}
