import { Link } from 'react-router-dom';
import { audienceLabel, displayName, formatDate, formatPrice, isUpcoming, workAvailability } from '../../utils/format';
import { Avatar } from '../ui/Media';
import Media from '../ui/Media';
import { DemoBadge } from '../ui/States';

const BADGE_CLASS = { disponible: 'badge-ok', vendida: 'badge-off', agotada: 'badge-off', no_disponible: 'badge-warn' };

export function WorkCard({ work, artist }) {
  const av = workAvailability(work);
  return (
    <article className="card">
      <div className="card-media">
        <Media src={work.images?.[0]} alt={work.title} seed={work.id} />
        {work.for_sale && <span className={`badge ${BADGE_CLASS[av.key]}`}>{av.label}</span>}
      </div>
      <div className="card-body">
        <span className="card-meta">{work.category}{work.technique ? ` · ${work.technique}` : ''}</span>
        <h3>
          <Link to={`/obras/${work.id}`}>{work.title}</Link>
        </h3>
        <span className="card-meta">por {displayName(artist)}</span>
        {work.for_sale && <span className="card-price">{formatPrice(work.price, work.currency)}</span>}
      </div>
    </article>
  );
}

export function ArtistCard({ profile }) {
  return (
    <article className="card artist-card">
      <div className="card-media">
        <Media src={profile.avatar_url} alt={displayName(profile)} seed={profile.id} />
        {profile.is_demo && <DemoBadge />}
      </div>
      <div className="card-body">
        <h3>
          <Link to={`/artistas/${profile.id}`}>{displayName(profile)}</Link>
        </h3>
        <span className="card-meta">{profile.specialty || 'Artista visual de Tinogasta'}</span>
        {profile.techniques?.length > 0 && (
          <div className="tags" style={{ marginTop: '0.4rem' }}>
            {profile.techniques.slice(0, 3).map((t) => (
              <span className="badge" key={t}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function WorkshopCard({ workshop, teacher }) {
  const spotsLeft = workshop.spots;
  return (
    <article className="card">
      <div className="card-media" style={{ aspectRatio: '16 / 9' }}>
        <Media src={workshop.cover} alt={workshop.name} seed={workshop.id} />
        {workshop.is_demo && <DemoBadge />}
        {spotsLeft === 0 && <span className="badge badge-off">Sin cupos</span>}
      </div>
      <div className="card-body">
        <span className="card-meta">{workshop.modality} · {(workshop.audience || []).map(audienceLabel).join(', ')}</span>
        <h3>
          <Link to={`/talleres/${workshop.id}`}>{workshop.name}</Link>
        </h3>
        <span className="card-meta">Dicta: {displayName(teacher)}</span>
        <div className="tags" style={{ marginTop: '0.3rem' }}>
          {(workshop.techniques || []).slice(0, 3).map((t) => (
            <span className="badge" key={t}>{t}</span>
          ))}
        </div>
        <span className="card-price">{workshop.price ? `${formatPrice(workshop.price)}` : 'Precio a consultar'}</span>
      </div>
    </article>
  );
}

export function EventCard({ event }) {
  const upcoming = isUpcoming(event);
  const [y, m, d] = String(event.event_date).slice(0, 10).split('-').map(Number);
  const month = new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(new Date(y, m - 1, d));
  return (
    <article className={`card event-card ${upcoming ? '' : 'past'}`}>
      <div className="event-date" aria-hidden="true">
        <strong>{d}</strong>
        <span>{month} {y}</span>
      </div>
      <div className="card-body">
        <div className="tags">
          <span className="badge">{event.type}</span>
          <span className={`badge ${upcoming ? 'badge-ok' : 'badge-off'}`}>{upcoming ? 'Próximo' : 'Finalizado'}</span>
        </div>
        <h3>
          <Link to={`/agenda/${event.id}`}>{event.title}</Link>
        </h3>
        <span className="card-meta">
          <span className="visually-hidden">Fecha: </span>{formatDate(event.event_date)}
          {event.event_time ? ` · ${event.event_time} h` : ''}
        </span>
        <span className="card-meta">{event.place}</span>
      </div>
    </article>
  );
}

export function GroupCard({ group, memberCount = 0 }) {
  return (
    <article className="card group-card">
      <div className="card-media">
        <Media src={group.image_url} alt={group.name} seed={group.id || group.name} />
      </div>
      <div className="card-body">
        <h3>
          <Link to={`/comunidad/${group.id}`}>{group.name}</Link>
        </h3>
        <p className="card-meta" style={{ margin: 0 }}>{group.description}</p>
        <span className="card-price" style={{ fontSize: '0.95rem', fontFamily: 'var(--font-texto)' }}>
          {memberCount === 1 ? '1 integrante' : `${memberCount} integrantes`}
        </span>
      </div>
    </article>
  );
}

export { Avatar };
