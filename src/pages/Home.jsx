import { Link } from 'react-router-dom';
import { ArtistCard, EventCard, WorkCard, WorkshopCard } from '../components/cards/Cards';
import BrushHero from '../components/ui/BrushHero';
import { EmptyState, ErrorBox, Loader, SectionHead } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';
import { displayName, formatDate, isUpcoming } from '../utils/format';

async function loadHome() {
  const [profiles, works, workshops, events, stats] = await Promise.all([
    api.list('profiles'),
    api.list('works'),
    api.list('workshops'),
    api.list('events'),
    api.stats(),
  ]);
  const byId = Object.fromEntries(profiles.map((p) => [p.id, p]));
  const upcoming = events.filter((e) => isUpcoming(e)).sort((a, b) => a.event_date.localeCompare(b.event_date));

  const news = [
    ...works.map((w) => ({ kind: 'Obra', title: w.title, to: `/obras/${w.id}`, at: w.created_at, by: byId[w.artist_id] })),
    ...events.map((e) => ({ kind: 'Evento', title: e.title, to: `/agenda/${e.id}`, at: e.created_at, by: byId[e.organizer_id] })),
    ...workshops
      .filter((w) => !w.is_demo)
      .map((w) => ({ kind: 'Taller', title: w.name, to: `/talleres/${w.id}`, at: w.created_at, by: byId[w.teacher_id] })),
  ]
    .sort((a, b) => String(b.at).localeCompare(String(a.at)))
    .slice(0, 5);

  return {
    byId,
    stats,
    featured: works.slice(0, 6),
    withPhotos: works.filter((w) => w.images?.length).slice(0, 2),
    artists: profiles.slice(0, 4),
    upcoming: upcoming.slice(0, 3),
    workshops: workshops.slice(0, 3),
    news,
  };
}

export default function Home() {
  useDocumentTitle(
    '',
    'SIGA reúne a los artistas visuales de Tinogasta, Catamarca: obras, talleres, agenda cultural y comunidad.',
  );
  const { data, loading, error, reload } = useAsync(loadHome, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="reveal">
            <p className="eyebrow">Tinogasta · Catamarca · Argentina</p>
            <h1>
              <span className="script">Arte que nace</span>
              en Tinogasta
            </h1>
            <p className="lead">
              SIGA es el punto de encuentro de los artistas visuales de nuestra tierra. Descubrí sus obras, conocé sus
              talleres, seguí la agenda cultural y llevate a casa un pedacito de arte local.
            </p>
            <div className="btn-row">
              <Link className="btn" to="/galeria">Explorar la galería</Link>
              <Link className="btn btn-gold" to="/artistas">Conocer artistas</Link>
              <Link className="btn btn-ghost" to="/talleres">Descubrir talleres</Link>
            </div>
          </div>
          <BrushHero photos={data?.withPhotos || []} />
        </div>
      </section>

      {loading && <Loader />}
      {error && (
        <div className="container">
          <ErrorBox message={error} onRetry={reload} />
        </div>
      )}

      {data && (
        <>
          <section className="section-tight">
            <div className="container">
              <div className="stats" role="list" aria-label="Estadísticas de la comunidad">
                <div className="stat" role="listitem"><strong>{data.stats.registered}</strong><span>Artistas registrados</span></div>
                <div className="stat" role="listitem"><strong>{data.stats.activePublic}</strong><span>Perfiles públicos activos</span></div>
                <div className="stat" role="listitem"><strong>{data.stats.works}</strong><span>Obras publicadas</span></div>
                <div className="stat" role="listitem"><strong>{data.stats.worksForSale}</strong><span>Obras en venta</span></div>
                <div className="stat" role="listitem"><strong>{data.stats.workshops}</strong><span>Talleres</span></div>
                <div className="stat" role="listitem"><strong>{data.stats.upcomingEvents}</strong><span>Próximos eventos</span></div>
              </div>
              <p className="stats-note">Cifras reales y automáticas: se actualizan a medida que la comunidad publica.</p>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <SectionHead script="Para mirar de cerca" title="Obras destacadas" text="Las publicaciones más recientes de nuestros artistas." linkTo="/galeria" linkLabel="Ver la galería" />
              {data.featured.length === 0 ? (
                <EmptyState
                  title="Todavía no hay obras publicadas"
                  text="Cuando los artistas carguen sus primeras obras, las vas a ver acá. ¿Sos artista de Tinogasta? Sé la primera o el primero."
                  actionLabel="Registrarme como artista"
                  actionTo="/registro"
                />
              ) : (
                <div className="card-grid">
                  {data.featured.map((w) => (
                    <WorkCard key={w.id} work={w} artist={data.byId[w.artist_id]} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="section" style={{ background: 'var(--rosa-suave)' }}>
            <div className="container">
              <SectionHead script="Manos que crean" title="Artistas de la comunidad" text="Pintura, dibujo, escultura, cerámica, fotografía y mucho más." linkTo="/artistas" />
              {data.artists.length === 0 ? (
                <EmptyState title="Aún no hay perfiles públicos" text="Los perfiles de artistas aparecerán acá apenas se registren." actionLabel="Crear mi perfil" actionTo="/registro" />
              ) : (
                <div className="card-grid">
                  {data.artists.map((p) => (
                    <ArtistCard key={p.id} profile={p} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="section">
            <div className="container">
              <SectionHead script="Para aprender" title="Próximos talleres" text="Propuestas de formación para niños, adolescentes, adultos y personas mayores." linkTo="/talleres" />
              {data.workshops.length === 0 ? (
                <EmptyState title="No hay talleres publicados" text="Quienes dictan talleres pueden publicarlos desde su panel." />
              ) : (
                <div className="card-grid">
                  {data.workshops.map((w) => (
                    <WorkshopCard key={w.id} workshop={w} teacher={data.byId[w.teacher_id]} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="section" style={{ background: 'var(--lila-suave)' }}>
            <div className="container">
              <SectionHead script="No te lo pierdas" title="Agenda artística" text="Exposiciones, ferias, encuentros y convocatorias." linkTo="/agenda" linkLabel="Ver toda la agenda" />
              {data.upcoming.length === 0 ? (
                <EmptyState title="No hay actividades próximas" text="Cuando se publiquen exposiciones o encuentros, aparecerán acá con su fecha." />
              ) : (
                <div className="events-grid">
                  {data.upcoming.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="section">
            <div className="container">
              <SectionHead script="Lo último" title="Novedades recientes" />
              {data.news.length === 0 ? (
                <EmptyState title="Sin novedades por ahora" text="Las nuevas obras, talleres y eventos publicados se listan acá automáticamente." />
              ) : (
                <div className="news-list">
                  {data.news.map((n) => (
                    <Link key={n.to} className="news-item" to={n.to}>
                      <span className="badge kind">{n.kind}</span>
                      <span style={{ flex: 1 }}>
                        <strong>{n.title}</strong>
                        <span className="muted"> · {displayName(n.by)}</span>
                      </span>
                      <span className="muted" style={{ fontSize: '0.85rem' }}>{formatDate(n.at)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
