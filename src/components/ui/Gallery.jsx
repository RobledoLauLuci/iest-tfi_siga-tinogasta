import { useEffect, useState } from 'react';
import ArtPlaceholder from './ArtPlaceholder';

// Galería de una obra: imagen principal, miniaturas y vista ampliada.
export default function Gallery({ images = [], title, seed }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const list = images.filter(Boolean);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (list.length === 0) {
    return (
      <div className="gallery-main">
        <ArtPlaceholder seed={seed || title} label={`${title} (sin fotografía)`} />
      </div>
    );
  }

  return (
    <div>
      <div className="gallery-main">
        <img
          src={list[index]}
          alt={`${title} — fotografía ${index + 1} de ${list.length}`}
          onClick={() => setOpen(true)}
        />
      </div>
      {list.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label="Fotografías de la obra">
          {list.map((src, i) => (
            <button key={src + i} onClick={() => setIndex(i)} aria-current={i === index} aria-label={`Ver fotografía ${i + 1}`}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      <p className="muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
        Tocá la imagen para ampliarla.
      </p>
      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Imagen ampliada" onClick={() => setOpen(false)}>
          <button className="btn btn-gold btn-sm" onClick={() => setOpen(false)}>
            Cerrar ✕
          </button>
          <img src={list[index]} alt={`${title} ampliada`} />
        </div>
      )}
    </div>
  );
}
