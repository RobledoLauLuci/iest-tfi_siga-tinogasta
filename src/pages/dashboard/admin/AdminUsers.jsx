import { Avatar } from '../../../components/ui/Media';
import { ErrorBox, Loader } from '../../../components/ui/States';
import { ROLES } from '../../../config/constants';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useAsync } from '../../../hooks/useAsync';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { api } from '../../../services';
import { displayName, formatDate } from '../../../utils/format';
import PanelHead from '../PanelHead';

export default function AdminUsers() {
  useDocumentTitle('Usuarios');
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(async () => (await api.list('profiles')).filter((p) => !p.is_demo), []);

  async function change(profile, patch, message) {
    try {
      await api.update('profiles', profile.id, patch);
      toast.success(message);
      await reload();
    } catch (e) {
      toast.error(e.message || 'No se pudo actualizar.');
    }
  }

  const profiles = data || [];
  return (
    <div className="stack">
      <PanelHead
        title="Usuarios"
        text="Gestioná los roles y la visibilidad de los perfiles. No podés quitarte a vos mismo el rol de administración."
      />
      {loading && <Loader />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {!loading && !error && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Persona</th>
                <th scope="col">Alta</th>
                <th scope="col">Perfil</th>
                <th scope="col">Rol</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const self = p.id === user.id;
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="cell-main">
                        <Avatar src={p.avatar_url} name={displayName(p)} size={40} />
                        <strong>{displayName(p)}{self ? ' (vos)' : ''}</strong>
                      </div>
                    </td>
                    <td>{formatDate(String(p.created_at).slice(0, 10))}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          change(p, { is_public: !p.is_public }, p.is_public ? 'Perfil ocultado.' : 'Perfil visible nuevamente.')
                        }
                      >
                        {p.is_public ? 'Público · Ocultar' : 'Oculto · Mostrar'}
                      </button>
                    </td>
                    <td>
                      <label className="visually-hidden" htmlFor={`rol-${p.id}`}>Rol de {displayName(p)}</label>
                      <select
                        id={`rol-${p.id}`}
                        className="select"
                        value={p.role}
                        disabled={self}
                        onChange={(e) => change(p, { role: e.target.value }, 'Rol actualizado.')}
                      >
                        {Object.entries(ROLES).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
