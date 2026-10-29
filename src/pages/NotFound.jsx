import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Página no encontrada');
  return (
    <div className="container not-found">
      <div className="script" aria-hidden="true">404</div>
      <h1>Esta página no está en el cuadro</h1>
      <p className="muted">Puede que el enlace haya cambiado o que la publicación ya no exista.</p>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <Link className="btn" to="/">Volver al inicio</Link>
        <Link className="btn btn-ghost" to="/galeria">Ir a la galería</Link>
      </div>
    </div>
  );
}
