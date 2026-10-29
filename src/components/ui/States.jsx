import { Link } from 'react-router-dom';

export function Loader({ text = 'Cargando…' }) {
  return (
    <div className="loader" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="alert alert-error" role="alert">
      <strong>No pudimos cargar esta sección.</strong> {message}{' '}
      {onRetry && (
        <button className="btn btn-sm btn-ghost" onClick={onRetry} style={{ marginLeft: '0.5rem' }}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, actionLabel, actionTo }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{text}</p>
      {actionLabel && actionTo && (
        <Link className="btn btn-gold" to={actionTo}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function SectionHead({ title, text, linkTo, linkLabel, script }) {
  return (
    <div className="section-head">
      <div>
        {script && <span className="script" style={{ fontSize: '1.9rem', color: 'var(--rosa-pincelada)', display: 'block', lineHeight: 1 }}>{script}</span>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {linkTo && (
        <Link className="btn btn-ghost btn-sm" to={linkTo}>
          {linkLabel || 'Ver todo'} →
        </Link>
      )}
    </div>
  );
}

export function DemoBadge() {
  return <span className="badge badge-demo" title="Contenido de demostración: no es información real">Demo</span>;
}

export function DemoNotice() {
  return (
    <div className="alert alert-info" role="note">
      <strong>Contenido de demostración.</strong> Estos datos son de ejemplo y desaparecerán apenas se publique el primer
      taller real. No tienen datos de contacto ni inscripción.
    </div>
  );
}
