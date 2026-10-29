import { useState } from 'react';
import ResourceForm from '../../components/forms/ResourceForm';
import { ErrorBox, Loader } from '../../components/ui/States';
import { profileFields } from '../../config/forms';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { api } from '../../services';
import PanelHead from './PanelHead';

function MyGroups() {
  const { user } = useAuth();
  const toast = useToast();
  const [busyId, setBusyId] = useState('');
  const { data, loading, error, reload } = useAsync(async () => {
    const [groups, memberships] = await Promise.all([api.list('groups'), api.listAllMemberships()]);
    return { groups, mine: new Set(memberships.filter((m) => m.user_id === user.id).map((m) => m.group_id)) };
  }, [user.id]);

  async function toggle(group, joined) {
    setBusyId(group.id);
    try {
      if (joined) await api.leaveGroup(group.id);
      else await api.joinGroup(group.id);
      toast.success(joined ? `Saliste de «${group.name}».` : `Te sumaste a «${group.name}».`);
      await reload();
    } catch (e) {
      toast.error(e.message || 'No se pudo actualizar.');
    } finally {
      setBusyId('');
    }
  }

  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <div className="panel">
      <h3>Mis grupos artísticos</h3>
      <p className="muted">Sumate a los grupos que representan tu trabajo. Vas a aparecer en su página de integrantes.</p>
      {data.groups.length === 0 && <p>La administración todavía no creó grupos.</p>}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.6rem' }}>
        {data.groups.map((g) => {
          const joined = data.mine.has(g.id);
          return (
            <li key={g.id} className="row" style={{ justifyContent: 'space-between' }}>
              <span>
                <strong>{g.name}</strong>
                {joined && <span className="badge badge-ok" style={{ marginLeft: '0.5rem' }}>Integrante</span>}
              </span>
              <button className={`btn btn-sm ${joined ? 'btn-ghost' : 'btn-gold'}`} disabled={busyId === g.id} onClick={() => toggle(g, joined)}>
                {joined ? 'Salir del grupo' : 'Unirme'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function MyProfile() {
  useDocumentTitle('Mi perfil');
  const { user, profile, refresh } = useAuth();
  const toast = useToast();

  return (
    <div className="stack">
      <PanelHead
        title="Mi perfil"
        text="Vos decidís qué datos se muestran. El WhatsApp, el correo y las redes solo se publican si los completás."
      />
      <div className="form-card">
        <ResourceForm
          fields={profileFields}
          initial={profile || {}}
          submitLabel="Guardar perfil"
          onSubmit={async (payload) => {
            await api.update('profiles', user.id, payload);
            await refresh();
            toast.success('Tu perfil se actualizó.');
          }}
        />
      </div>
      <MyGroups />
    </div>
  );
}
