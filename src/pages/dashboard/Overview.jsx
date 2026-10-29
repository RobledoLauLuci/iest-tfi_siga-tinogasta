import { Link } from 'react-router-dom';
import { Loader, ErrorBox } from '../../components/ui/States';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services';
import { displayName, isUpcoming, workAvailability } from '../../utils/format';
import PanelHead from './PanelHead';

export default function Overview() {
  const { user, profile } = useAuth();
  const { data, loading, error, reload } = useAsync(async () => {
    const [works, workshops, events, inquiries] = await Promise.all([
      api.list('works', { eq: { artist_id: user.id } }),
      api.list('workshops', { eq: { teacher_id: user.id } }),
      api.list('events', { eq: { organizer_id: user.id } }),
      api.list('inquiries', { eq: { to_user_id: user.id } }),
    ]);
    return { works, workshops, events, inquiries };
  }, [user.id]);

  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const { works, workshops, events, inquiries } = data;
  const forSale = works.filter((w) => w.for_sale && workAvailability(w).canBuy).length;
  const soldOut = works.filter((w) => w.for_sale && workAvailability(w).key === 'agotada').length;
  const profileIncomplete = !profile?.bio || !profile?.specialty || !profile?.avatar_url;

  return (
    <div className="stack">
      <PanelHead title={`Hola, ${displayName(profile)}`} text="Desde acá administrás todo lo que publicás en SIGA." />

      {profileIncomplete && (
        <div className="alert alert-info" role="note">
          Tu perfil público está incompleto. Sumá una fotografía, tu especialidad y tu biografía para que te conozcan mejor.{' '}
          <Link to="/panel/perfil">Completar perfil</Link>
        </div>
      )}

      <div className="mini-stats">
        <div className="mini-stat"><strong>{works.length}</strong>Obras publicadas</div>
        <div className="mini-stat"><strong>{forSale}</strong>En venta con stock</div>
        <div className="mini-stat"><strong>{soldOut}</strong>Agotadas</div>
        <div className="mini-stat"><strong>{workshops.length}</strong>Talleres</div>
        <div className="mini-stat"><strong>{events.filter((e) => isUpcoming(e)).length}</strong>Eventos próximos</div>
        <div className="mini-stat"><strong>{inquiries.filter((i) => !i.read).length}</strong>Consultas sin leer</div>
      </div>

      <div className="panel">
        <h3>¿Qué querés hacer?</h3>
        <div className="btn-row">
          <Link className="btn btn-gold" to="/panel/obras">Publicar una obra</Link>
          <Link className="btn btn-ghost" to="/panel/talleres">Crear un taller</Link>
          <Link className="btn btn-ghost" to="/panel/eventos">Subir un flyer o evento</Link>
          <Link className="btn btn-ghost" to="/panel/consultas">Ver consultas</Link>
        </div>
      </div>
    </div>
  );
}
