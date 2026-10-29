import { Link, useParams } from 'react-router-dom';
import InquiryForm from '../components/forms/InquiryForm';
import ReportButton from '../components/forms/ReportButton';
import Gallery from '../components/ui/Gallery';
import { Avatar } from '../components/ui/Media';
import { EmptyState, ErrorBox, Loader } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';
import { displayName, formatPrice, whatsappLink, workAvailability } from '../utils/format';

export default function WorkDetail() {
  const { id } = useParams();
  const { data, loading, error, reload } = useAsync(async () => {
    const work = await api.get('works', id);
    if (!work) return { work: null };
    const artist = await api.get('profiles', work.artist_id);
    return { work, artist };
  }, [id]);

  const work = data?.work;
  useDocumentTitle(work ? work.title : 'Obra', work?.description);

  if (loading) return <Loader />;
  if (error) return <div className="container section"><ErrorBox message={error} onRetry={reload} /></div>;
  if (!work) {
    return (
      <div className="container section">
        <EmptyState title="No encontramos esta obra" text="Puede que haya sido retirada por su artista." actionLabel="Volver a la galería" actionTo="/galeria" />
      </div>
    );
  }

  const { artist } = data;
  const av = workAvailability(work);
  const wa = whatsappLink(artist?.whatsapp, `Hola ${displayName(artist)}, te escribo desde SIGA por la obra "${work.title}".`);
  const blocked = work.for_sale && !av.canBuy;

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/galeria">Galería</Link> / <span>{work.title}</span>
      </nav>
      <div className="detail">
        <Gallery images={work.images} title={work.title} seed={work.id} />

        <div className="detail-info">
          <div>
            <div className="tags" style={{ marginBottom: '0.7rem' }}>
              <span className="badge">{work.category}</span>
              {work.for_sale && <span className={`badge ${av.canBuy ? 'badge-ok' : 'badge-off'}`}>{av.label}</span>}
            </div>
            <h1>{work.title}</h1>
            {artist && (
              <Link to={`/artistas/${artist.id}`} className="row" style={{ textDecoration: 'none', marginTop: '0.6rem' }}>
                <Avatar src={artist.avatar_url} name={displayName(artist)} size={44} />
                <span>por <strong>{displayName(artist)}</strong></span>
              </Link>
            )}
          </div>

          {work.for_sale && (
            <div className="panel">
              <div className="price-big">{formatPrice(work.price, work.currency)}</div>
              <p className="muted" style={{ margin: 0 }}>
                {av.canBuy
                  ? `Stock: ${work.stock} ${Number(work.stock) === 1 ? 'unidad' : 'unidades'}. Pago y entrega se coordinan directamente con el artista.`
                  : av.key === 'agotada'
                    ? 'Esta obra está agotada: ya no hay unidades disponibles.'
                    : av.key === 'vendida'
                      ? 'Esta obra ya fue vendida.'
                      : 'Esta obra no está disponible por el momento.'}
              </p>
            </div>
          )}

          {work.description && <p>{work.description}</p>}

          <dl className="spec">
            {work.technique && (<><dt>Técnica</dt><dd>{work.technique}</dd></>)}
            {work.materials && (<><dt>Materiales</dt><dd>{work.materials}</dd></>)}
            {work.dimensions && (<><dt>Dimensiones</dt><dd>{work.dimensions}</dd></>)}
            {work.year && (<><dt>Año</dt><dd>{work.year}</dd></>)}
            <dt>Disponibilidad</dt><dd>{work.for_sale ? av.label : 'Obra de galería (no está en venta)'}</dd>
          </dl>

          <div className="panel">
            <h3>{work.for_sale ? 'Consultar o comprar' : 'Consultar por esta obra'}</h3>
            {blocked ? (
              <div className="alert alert-info">
                <strong>{av.label}.</strong> No se pueden enviar consultas de compra para esta obra. Mirá otras obras de{' '}
                {displayName(artist)} en su <Link to={`/artistas/${artist?.id}`}>perfil</Link>.
              </div>
            ) : (
              <div className="stack">
                {wa && (
                  <a className="btn btn-gold" href={wa} target="_blank" rel="noopener noreferrer">
                    Consultar por WhatsApp
                  </a>
                )}
                <InquiryForm
                  toUserId={work.artist_id}
                  kind="obra"
                  targetIds={{ work_id: work.id }}
                  subject={`Consulta por la obra: ${work.title}`}
                  defaultMessage={`Hola, me interesa la obra "${work.title}". ¿Podemos coordinar?`}
                />
              </div>
            )}
          </div>

          <div><ReportButton targetType="obra" targetId={work.id} targetTitle={work.title} /></div>
        </div>
      </div>
    </div>
  );
}
