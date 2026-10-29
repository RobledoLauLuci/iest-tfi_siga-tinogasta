import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArtistCard } from '../components/cards/Cards';
import Media from '../components/ui/Media';
import { EmptyState, ErrorBox, Loader, SectionHead } from '../components/ui/States';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';

export default function GroupDetail() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const { data, loading, error, reload } = useAsync(async () => {
    const group = await api.get('groups', id);
    if (!group) return { group: null };
    const [members, profiles] = await Promise.all([api.listMembers(id), api.list('profiles')]);
    const byId = Object.fromEntries(profiles.map((p) => [p.id, p]));
    return { group, people: members.map((m) => byId[m.user_id]).filter(Boolean), memberIds: members.map((m) => m.user_id) };
  }, [id]);

  useDocumentTitle(data?.group?.name || 'Grupo', data?.group?.description);

  if (loading) return <Loader />;
  if (error) return <div className="container section"><ErrorBox message={error} onRetry={reload} /></div>;
  if (!data.group) {
    return <div className="container section"><EmptyState title="No encontramos este grupo" text="Puede que haya sido eliminado." actionLabel="Ver la comunidad" actionTo="/comunidad" /></div>;
  }

  const { group, people, memberIds } = data;
  const joined = user && memberIds.includes(user.id);

  async function toggle() {
    setBusy(true);
    try {
      if (joined) await api.leaveGroup(group.id);
      else await api.joinGroup(group.id);
      toast.success(joined ? 'Saliste del grupo.' : '¡Ya sos parte del grupo!');
      await reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/comunidad">Comunidad</Link> / <span>{group.name}</span>
      </nav>
      <div className="detail">
        <div className="gallery-main" style={{ aspectRatio: '16 / 10' }}>
          <Media src={group.image_url} alt={group.name} seed={group.id} />
        </div>
        <div className="detail-info">
          <h1>{group.name}</h1>
          <p>{group.description}</p>
          {group.activities && (
            <div className="panel">
              <h3>Actividades</h3>
              <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{group.activities}</p>
            </div>
          )}
          {isLoggedIn ? (
            <div><button className={`btn ${joined ? 'btn-ghost' : 'btn-gold'}`} onClick={toggle} disabled={busy}>
              {busy ? 'Procesando…' : joined ? 'Salir del grupo' : 'Unirme a este grupo'}
            </button></div>
          ) : (
            <p><Link to="/ingresar" state={{ from: `/comunidad/${group.id}` }}>Iniciá sesión</Link> para unirte a este grupo.</p>
          )}
        </div>
      </div>

      <section className="section-tight">
        <SectionHead title={`Integrantes (${people.length})`} />
        {people.length === 0 ? (
          <EmptyState title="Todavía no hay integrantes" text="Sé la primera o el primero en sumarte a este grupo." />
        ) : (
          <div className="card-grid">{people.map((p) => <ArtistCard key={p.id} profile={p} />)}</div>
        )}
      </section>
    </div>
  );
}
