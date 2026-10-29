import { Link, useParams } from 'react-router-dom';
import { EventCard, WorkCard, WorkshopCard } from '../components/cards/Cards';
import InquiryForm from '../components/forms/InquiryForm';
import ReportButton from '../components/forms/ReportButton';
import { Avatar } from '../components/ui/Media';
import { DemoBadge, DemoNotice, EmptyState, ErrorBox, Loader, SectionHead } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';
import { displayName, whatsappLink, workAvailability } from '../utils/format';

async function loadArtist(id) {
  const profile = await api.get('profiles', id);
  if (!profile) return { profile: null };
  const demo = Boolean(profile.is_demo);
  const [works, workshops, events, memberships, groups] = demo
    ? [[], await api.list('workshops', { eq: { teacher_id: id } }), [], [], []]
    : await Promise.all([
        api.list('works', { eq: { artist_id: id } }),
        api.list('workshops', { eq: { teacher_id: id } }),
        api.list('events', { eq: { organizer_id: id } }),
        api.listAllMemberships(),
        api.list('groups'),
      ]);
  const myGroups = groups.filter((g) => memberships.some((m) => m.group_id === g.id && m.user_id === id));
  const photoLists = demo ? [] : await Promise.all(workshops.map((w) => api.list('workshop_photos', { eq: { workshop_id: w.id } })));
  return { profile, works, workshops, events, myGroups, photos: photoLists.flat() };
}

export default function ArtistProfile() {
  const { id } = useParams();
  const { data, loading, error, reload } = useAsync(() => loadArtist(id), [id]);
  const profile = data?.profile;
  useDocumentTitle(profile ? displayName(profile) : 'Artista', profile?.bio || profile?.specialty);

  if (loading) return <Loader />;
  if (error) return <div className="container section"><ErrorBox message={error} onRetry={reload} /></div>;
  if (!profile) {
    return (
      <div className="container section">
        <EmptyState title="No encontramos este perfil" text="Puede que la persona haya decidido ocultarlo." actionLabel="Ver artistas" actionTo="/artistas" />
      </div>
    );
  }

  const name = displayName(profile);
  const { works, workshops, events, myGroups, photos } = data;
  const forSale = works.filter((w) => w.for_sale && workAvailability(w).canBuy);
  const wa = whatsappLink(profile.whatsapp, `Hola ${name}, te escribo desde SIGA.`);
  const hasDirect = wa || profile.email_public || profile.instagram || profile.facebook;

  return (
    <div className="container">
      <header className="profile-head reveal">
        <Avatar src={profile.avatar_url} name={name} size={160} />
        <div>
          <div className="row" style={{ marginBottom: '0.4rem' }}>
            <p className="eyebrow" style={{ margin: 0 }}>Artista de Tinogasta</p>
            {profile.is_demo && <DemoBadge />}
          </div>
          <h1>{name}</h1>
          {profile.specialty && <p style={{ fontSize: '1.15rem' }}>{profile.specialty}</p>}
          {profile.techniques?.length > 0 && (
            <div className="tags" style={{ marginBottom: '1rem' }}>
              {profile.techniques.map((t) => <span className="badge" key={t}>{t}</span>)}
            </div>
          )}
          <div className="social">
            {wa && <a className="btn btn-gold btn-sm" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            {profile.email_public && <a className="btn btn-ghost btn-sm" href={`mailto:${profile.email_public}`}>Correo</a>}
            {profile.instagram && <a className="btn btn-ghost btn-sm" href={profile.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
            {profile.facebook && <a className="btn btn-ghost btn-sm" href={profile.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
            <a className="btn btn-sm" href="#contactar">Escribirle a {name.split(' ')[0]}</a>
          </div>
        </div>
      </header>

      {profile.is_demo && <DemoNotice />}

      {profile.bio && (
        <section className="section-tight">
          <h2>Biografía y trayectoria</h2>
          <p style={{ maxWidth: '75ch', whiteSpace: 'pre-line' }}>{profile.bio}</p>
          {myGroups?.length > 0 && (
            <div className="tags">
              {myGroups.map((g) => <Link key={g.id} className="badge" to={`/comunidad/${g.id}`}>{g.name}</Link>)}
            </div>
          )}
        </section>
      )}

      {!profile.is_demo && (
        <section className="section-tight">
          <SectionHead title="Galería de obras" />
          {works.length === 0 ? (
            <EmptyState title="Todavía no hay obras publicadas" text={`${name} aún no cargó obras en la galería.`} />
          ) : (
            <div className="card-grid">{works.map((w) => <WorkCard key={w.id} work={w} artist={profile} />)}</div>
          )}
        </section>
      )}

      {forSale.length > 0 && (
        <section className="section-tight">
          <SectionHead title="Obras disponibles para la venta" text="Consultá directamente con el artista." />
          <div className="card-grid">{forSale.map((w) => <WorkCard key={w.id} work={w} artist={profile} />)}</div>
        </section>
      )}

      <section className="section-tight">
        <SectionHead title="Talleres que ofrece" />
        {workshops.length === 0 ? (
          <EmptyState title="Sin talleres publicados" text={`${name} no tiene talleres publicados por ahora.`} />
        ) : (
          <div className="card-grid">{workshops.map((w) => <WorkshopCard key={w.id} workshop={w} teacher={profile} />)}</div>
        )}
      </section>

      {photos?.length > 0 && (
        <section className="section-tight">
          <SectionHead title="Trabajos y actividades" text="Fotografías de los talleres." />
          <div className="photo-grid">
            {photos.map((p) => (
              <figure key={p.id} className="photo-item" style={{ margin: 0 }}>
                <img src={p.url} alt={p.caption || 'Fotografía de taller'} loading="lazy" />
                {p.caption && <figcaption className="cap">{p.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {events?.length > 0 && (
        <section className="section-tight">
          <SectionHead title="Eventos en los que participa" />
          <div className="events-grid">{events.map((e) => <EventCard key={e.id} event={e} />)}</div>
        </section>
      )}

      <section className="section-tight" id="contactar">
        <div className="panel" style={{ maxWidth: 720 }}>
          <h3>Contactar a {name}</h3>
          {!hasDirect && !profile.is_demo && (
            <p className="muted">Este artista no publicó datos de contacto directo. Podés escribirle desde este formulario.</p>
          )}
          <InquiryForm
            toUserId={profile.id}
            kind="artista"
            subject={`Consulta para ${name}`}
            disabled={Boolean(profile.is_demo)}
            disabledReason="Perfil de demostración: no recibe consultas. Los perfiles reales sí."
          />
        </div>
        <div className="mt"><ReportButton targetType="perfil" targetId={profile.id} targetTitle={name} /></div>
      </section>
    </div>
  );
}
