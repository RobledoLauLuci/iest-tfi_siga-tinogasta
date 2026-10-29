import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InquiryForm from '../components/forms/InquiryForm';
import ReportButton from '../components/forms/ReportButton';
import { DemoBadge, DemoNotice, EmptyState, ErrorBox, Loader } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';
import { audienceLabel, contactLink, displayName, formatDate, formatPrice } from '../utils/format';

export default function WorkshopDetail() {
  const { id } = useParams();
  const { data, loading, error, reload } = useAsync(async () => {
    const workshop = await api.get('workshops', id);
    if (!workshop) return { workshop: null };
    const teacher = await api.get('profiles', workshop.teacher_id);
    const photos = workshop.is_demo ? [] : await api.list('workshop_photos', { eq: { workshop_id: id } });
    return { workshop, teacher, photos };
  }, [id]);
  const [tech, setTech] = useState('');

  const photos = data?.photos || [];
  const techniques = useMemo(() => [...new Set(photos.map((p) => p.technique).filter(Boolean))].sort(), [photos]);
  const shown = useMemo(
    () =>
      photos
        .filter((p) => !tech || p.technique === tech)
        .sort((a, b) => String(b.taken_on || b.created_at).localeCompare(String(a.taken_on || a.created_at))),
    [photos, tech],
  );

  const w = data?.workshop;
  useDocumentTitle(w ? w.name : 'Taller', w?.description);

  if (loading) return <Loader />;
  if (error) return <div className="container section"><ErrorBox message={error} onRetry={reload} /></div>;
  if (!w) {
    return (
      <div className="container section">
        <EmptyState title="No encontramos este taller" text="Puede que ya no esté publicado." actionLabel="Ver talleres" actionTo="/talleres" />
      </div>
    );
  }

  const { teacher } = data;
  const link = contactLink(w.contact);
  const full = w.spots === 0;

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/talleres">Talleres</Link> / <span>{w.name}</span>
      </nav>
      <div className="detail">
        <div className="detail-info">
          <div className="tags">
            <span className="badge">{w.modality}</span>
            {(w.audience || []).map((a) => <span key={a} className="badge badge-ok">{audienceLabel(a)}</span>)}
            {full && <span className="badge badge-off">Sin cupos</span>}
            {w.is_demo && <DemoBadge />}
          </div>
          <h1>{w.name}</h1>
          {teacher && <p>Dicta <Link to={`/artistas/${teacher.id}`}><strong>{displayName(teacher)}</strong></Link></p>}
          {w.is_demo && <DemoNotice />}
          <p style={{ whiteSpace: 'pre-line' }}>{w.description}</p>
          {w.techniques?.length > 0 && <div className="tags">{w.techniques.map((t) => <span key={t} className="badge">{t}</span>)}</div>}
          <div><ReportButton targetType="taller" targetId={w.id} targetTitle={w.name} /></div>
        </div>

        <aside className="panel">
          <h3>Información práctica</h3>
          <dl className="spec">
            <dt>Lugar</dt><dd>{w.location || 'A confirmar'}</dd>
            <dt>Días y horarios</dt><dd>{w.schedule || 'A confirmar'}</dd>
            {w.start_date && (<><dt>Inicio</dt><dd>{formatDate(w.start_date)}</dd></>)}
            {w.end_date && (<><dt>Finalización</dt><dd>{formatDate(w.end_date)}</dd></>)}
            <dt>Precio</dt><dd>{w.price ? formatPrice(w.price) : 'A consultar'}</dd>
            <dt>Cupos</dt><dd>{w.spots === null || w.spots === undefined || w.spots === '' ? 'Consultar' : full ? 'Completo' : w.spots}</dd>
            {w.requirements && (<><dt>Requisitos y materiales</dt><dd style={{ whiteSpace: 'pre-line' }}>{w.requirements}</dd></>)}
            {w.enrollment_info && (<><dt>Inscripciones</dt><dd style={{ whiteSpace: 'pre-line' }}>{w.enrollment_info}</dd></>)}
            {w.contact && (<><dt>Contacto</dt><dd>{link ? <a href={link} target="_blank" rel="noopener noreferrer">{w.contact}</a> : w.contact}</dd></>)}
          </dl>
        </aside>
      </div>

      <section className="section-tight" style={{ maxWidth: 720 }}>
        <div className="panel">
          <h3>Consultar o inscribirme</h3>
          {full && <p className="alert alert-info">El taller no tiene cupos por ahora. Podés dejar tu consulta para la lista de espera.</p>}
          <InquiryForm
            toUserId={w.teacher_id}
            kind="taller"
            targetIds={{ workshop_id: w.id }}
            subject={`Consulta por el taller: ${w.name}`}
            defaultMessage={`Hola, quiero consultar por el taller "${w.name}".`}
            disabled={Boolean(w.is_demo)}
            disabledReason="Taller de demostración: la inscripción se habilitará con los datos reales."
          />
        </div>
      </section>

      {!w.is_demo && (
        <section className="section-tight">
          <h2>Galería de actividades</h2>
          <p className="muted" style={{ maxWidth: '70ch' }}>
            Procesos creativos y trabajos de las personas que participan. Las fotografías donde aparecen menores de edad
            identificables solo se publican con autorización de madres, padres o tutores.
          </p>
          {techniques.length > 0 && (
            <div className="field" style={{ maxWidth: 260, marginBottom: '1.2rem' }}>
              <label htmlFor="ph-tec">Filtrar por técnica</label>
              <select id="ph-tec" className="select" value={tech} onChange={(e) => setTech(e.target.value)}>
                <option value="">Todas</option>
                {techniques.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          )}
          {shown.length === 0 ? (
            <EmptyState title="Aún no hay fotografías" text="La persona a cargo puede sumar imágenes de los procesos y trabajos desde su panel." />
          ) : (
            <div className="photo-grid">
              {shown.map((p) => (
                <figure key={p.id} className="photo-item" style={{ margin: 0 }}>
                  <img src={p.url} alt={p.caption || 'Fotografía del taller'} loading="lazy" />
                  <figcaption className="cap">
                    {p.caption && <div>{p.caption}</div>}
                    <span className="muted">{[p.technique, formatDate(p.taken_on)].filter(Boolean).join(' · ')}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
