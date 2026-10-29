import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../../../components/ui/Modal';
import { EmptyState, ErrorBox, Loader } from '../../../components/ui/States';
import { useToast } from '../../../context/ToastContext';
import { useAsync } from '../../../hooks/useAsync';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { api } from '../../../services';
import { formatDate } from '../../../utils/format';
import PanelHead from '../PanelHead';

// Dónde vive cada tipo de contenido denunciado y cómo verlo en el sitio.
const TARGETS = {
  obra: { table: 'works', link: (id) => `/obras/${id}`, label: 'Obra' },
  taller: { table: 'workshops', link: (id) => `/talleres/${id}`, label: 'Taller' },
  evento: { table: 'events', link: (id) => `/agenda/${id}`, label: 'Evento' },
  perfil: { table: 'profiles', link: (id) => `/artistas/${id}`, label: 'Perfil' },
  foto: { table: 'workshop_photos', link: null, label: 'Fotografía' },
};
const STATUS = { abierta: 'badge-warn', resuelta: 'badge-ok', descartada: '' };

export default function AdminReports({ onChange }) {
  useDocumentTitle('Publicaciones denunciadas');
  const toast = useToast();
  const [filter, setFilter] = useState('abierta');
  const [removing, setRemoving] = useState(null);
  const { data, loading, error, reload } = useAsync(() => api.list('reports'), []);

  async function setStatus(report, status) {
    try {
      await api.update('reports', report.id, { status });
      await reload();
      onChange?.();
    } catch (e) {
      toast.error(e.message || 'No se pudo actualizar.');
    }
  }

  async function takeAction() {
    const report = removing;
    const target = TARGETS[report.target_type];
    try {
      if (report.target_type === 'perfil') {
        await api.update('profiles', report.target_id, { is_public: false });
        toast.success('Perfil ocultado.');
      } else {
        await api.remove(target.table, report.target_id);
        toast.success('Publicación eliminada.');
      }
      await api.update('reports', report.id, { status: 'resuelta' });
      setRemoving(null);
      await reload();
      onChange?.();
    } catch (e) {
      toast.error(e.message || 'No se pudo completar la acción.');
    }
  }

  const all = data || [];
  const reports = filter === 'todas' ? all : all.filter((r) => r.status === filter);

  return (
    <div className="stack">
      <PanelHead title="Publicaciones denunciadas" text="Revisá las denuncias de la comunidad y decidí si corresponde retirar la publicación.">
        <div className="field" style={{ minWidth: 180 }}>
          <label htmlFor="filtro-denuncias">Mostrar</label>
          <select id="filtro-denuncias" className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="abierta">Abiertas</option>
            <option value="resuelta">Resueltas</option>
            <option value="descartada">Descartadas</option>
            <option value="todas">Todas</option>
          </select>
        </div>
      </PanelHead>
      {loading && <Loader />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {!loading && !error && reports.length === 0 && (
        <EmptyState title="No hay denuncias en esta vista" text="Cuando alguien denuncie una publicación, va a aparecer acá." />
      )}
      {reports.map((r) => {
        const target = TARGETS[r.target_type];
        return (
          <article className="inquiry" key={r.id}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="tags">
                <span className="badge">{target?.label || r.target_type}</span>
                <span className={`badge ${STATUS[r.status] || ''}`}>{r.status}</span>
              </div>
              <span className="muted">{formatDate(String(r.created_at).slice(0, 10))}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{r.target_title || 'Publicación sin título'}</h3>
            <p style={{ margin: 0 }}><strong>Motivo:</strong> {r.reason}</p>
            {r.details && <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{r.details}</p>}
            <div className="row-actions">
              {target?.link && <Link className="btn btn-ghost btn-sm" to={target.link(r.target_id)}>Ver publicación</Link>}
              {r.status === 'abierta' ? (
                <>
                  <button className="btn btn-danger btn-sm" onClick={() => setRemoving(r)}>
                    {r.target_type === 'perfil' ? 'Ocultar perfil' : 'Eliminar publicación'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setStatus(r, 'resuelta')}>Marcar resuelta</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setStatus(r, 'descartada')}>Descartar</button>
                </>
              ) : (
                <button className="btn btn-ghost btn-sm" onClick={() => setStatus(r, 'abierta')}>Reabrir</button>
              )}
            </div>
          </article>
        );
      })}
      {removing && (
        <ConfirmDialog
          title={removing.target_type === 'perfil' ? '¿Ocultar este perfil?' : '¿Eliminar esta publicación?'}
          message={
            removing.target_type === 'perfil'
              ? 'El perfil dejará de verse en el sitio. Podés volver a mostrarlo desde Usuarios.'
              : 'Se elimina definitivamente del sitio y la denuncia queda como resuelta.'
          }
          confirmLabel={removing.target_type === 'perfil' ? 'Ocultar' : 'Eliminar'}
          onConfirm={takeAction}
          onCancel={() => setRemoving(null)}
        />
      )}
    </div>
  );
}
