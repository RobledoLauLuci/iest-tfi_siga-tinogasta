import { Link, useParams } from 'react-router-dom';
import InquiryForm from '../components/forms/InquiryForm';
import ReportButton from '../components/forms/ReportButton';
import { EmptyState, ErrorBox, Loader } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';
import { contactLink, displayName, formatDate, isUpcoming } from '../utils/format';

export default function EventDetail() {
  const { id } = useParams();
  const { data, loading, error, reload } = useAsync(async () => {
    const event = await api.get('events', id);
    if (!event) return { event: null };
    return { event, organizer: await api.get('profiles', event.organizer_id) };
  }, [id]);

  const event = data?.event;
  useDocumentTitle(event ? event.title : 'Evento', event?.description);

  if (loading) return <Loader />;
  if (error) return <div className="container section"><ErrorBox message={error} onRetry={reload} /></div>;
  if (!event) {
    return <div className="container section"><EmptyState title="No encontramos este evento" text="Puede que haya sido retirado." actionLabel="Ver la agenda" actionTo="/agenda" /></div>;
  }

  const upcoming = isUpcoming(event);
  const link = contactLink(event.contact);

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/agenda">Agenda</Link> / <span>{event.title}</span>
      </nav>
      <div className="detail">
        <div className="stack">
          {event.flyer_url ? (
            <div className="flyer"><img src={event.flyer_url} alt={`Flyer de ${event.title}`} /></div>
          ) : (
            <div className="alert alert-info">Este evento todavía no tiene flyer.</div>
          )}
          {event.images?.length > 0 && (
            <div className="photo-grid">
              {event.images.map((src, i) => (
                <div className="photo-item" key={src.slice(-30) + i}><img src={src} alt={`${event.title}, fotografía ${i + 1}`} loading="lazy" /></div>
              ))}
            </div>
          )}
        </div>
        <div className="detail-info">
          <div className="tags">
            <span className="badge">{event.type}</span>
            <span className="badge">{event.category}</span>
            <span className={`badge ${upcoming ? 'badge-ok' : 'badge-off'}`}>{upcoming ? 'Próximo' : 'Finalizado'}</span>
          </div>
          <h1>{event.title}</h1>
          <p style={{ whiteSpace: 'pre-line' }}>{event.description}</p>
          <dl className="spec">
            <dt>Fecha</dt><dd>{formatDate(event.event_date)}</dd>
            {event.event_time && (<><dt>Horario</dt><dd>{event.event_time} h</dd></>)}
            <dt>Lugar</dt><dd>{event.place}</dd>
            <dt>Organiza</dt>
            <dd>{event.organizer_name}{data.organizer && <> · <Link to={`/artistas/${data.organizer.id}`}>{displayName(data.organizer)}</Link></>}</dd>
            {event.contact && (<><dt>Contacto</dt><dd>{link ? <a href={link} target="_blank" rel="noopener noreferrer">{event.contact}</a> : event.contact}</dd></>)}
          </dl>
          <div className="panel">
            <h3>Consultar sobre este evento</h3>
            <InquiryForm
              toUserId={event.organizer_id}
              kind="evento"
              targetIds={{ event_id: event.id }}
              subject={`Consulta por el evento: ${event.title}`}
              defaultMessage={`Hola, quiero consultar por "${event.title}".`}
            />
          </div>
          <div><ReportButton targetType="evento" targetId={event.id} targetTitle={event.title} /></div>
        </div>
      </div>
    </div>
  );
}
