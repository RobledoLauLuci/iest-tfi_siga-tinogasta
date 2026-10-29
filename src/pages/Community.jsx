import { Link } from 'react-router-dom';
import { GroupCard } from '../components/cards/Cards';
import { EmptyState, ErrorBox, Loader, SectionHead } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';

export default function Community() {
  useDocumentTitle('Comunidad artística', 'Los grupos y colectivos de artistas visuales de Tinogasta: pintura, escultura, fotografía, docentes y más.');
  const { data, loading, error, reload } = useAsync(async () => {
    const [stats, groups, memberships] = await Promise.all([api.stats(), api.list('groups'), api.listAllMemberships()]);
    const counts = {};
    memberships.forEach((m) => (counts[m.group_id] = (counts[m.group_id] || 0) + 1));
    return { stats, groups: [...groups].sort((a, b) => a.name.localeCompare(b.name, 'es')), counts };
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="script">Nos une el arte</span>
          <h1>Comunidad artística</h1>
          <p>Grupos y colectivos donde los artistas de Tinogasta se encuentran, se acompañan y crecen juntos.</p>
        </div>
      </section>

      <section className="container">
        {loading && <Loader />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        {data && (
          <>
            <div className="stats" role="list" aria-label="Miembros de la comunidad">
              <div className="stat" role="listitem"><strong>{data.stats.registered}</strong><span>Miembros registrados</span></div>
              <div className="stat" role="listitem"><strong>{data.stats.activePublic}</strong><span>Perfiles públicos activos</span></div>
              <div className="stat" role="listitem"><strong>{data.stats.groups}</strong><span>Grupos</span></div>
            </div>
            <p className="stats-note">
              Contadores automáticos con datos reales. Un perfil público activo es el de quien tiene su perfil visible y al menos una publicación.
            </p>

            <div className="section-tight" />
            <SectionHead title="Grupos y colectivos" text="Sumate a los que representen tu práctica artística desde tu panel." />
            {data.groups.length === 0 ? (
              <EmptyState title="Todavía no hay grupos" text="La administración puede crear los primeros grupos desde su panel." />
            ) : (
              <div className="card-grid">
                {data.groups.map((g) => <GroupCard key={g.id} group={g} memberCount={data.counts[g.id] || 0} />)}
              </div>
            )}
            <p className="center mt">
              ¿Todavía no sos parte? <Link to="/registro">Creá tu perfil de artista</Link> y unite a un grupo.
            </p>
          </>
        )}
      </section>
    </>
  );
}
