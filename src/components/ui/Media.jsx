import { useState } from 'react';
import { initials } from '../../utils/format';
import ArtPlaceholder from './ArtPlaceholder';

// Imagen con carga diferida y alternativa si falla o no existe.
export default function Media({ src, alt, seed, className }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <ArtPlaceholder seed={seed || alt} label={alt ? `${alt} (sin fotografía)` : ''} />;
  return <img src={src} alt={alt || ''} loading="lazy" decoding="async" className={className} onError={() => setFailed(true)} />;
}

export function Avatar({ src, name, size = 64 }) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size, fontSize: size * 0.38 };
  if (!src || failed) {
    return (
      <span className="avatar" style={style} aria-hidden="true">
        {initials(name)}
      </span>
    );
  }
  return <img className="avatar" style={style} src={src} alt="" loading="lazy" onError={() => setFailed(true)} />;
}
