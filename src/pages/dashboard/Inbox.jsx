import { useState } from 'react';
import { ConfirmDialog } from '../../components/ui/Modal';
import { EmptyState, ErrorBox, Loader } from '../../components/ui/States';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { api } from '../../services';
import { formatDate, whatsappLink } from '../../utils/format';
import PanelHead from './PanelHead';

const KINDS = { obra: 'Obra', taller: 'Taller', evento: 'Evento', artista: 'Artista', institucional: 'Institucional', general: 'General' };

// Bandeja de consultas. Con `institutional` muestra las dirigidas a la plataforma (solo administración).
export default function Inbox({ institutional = false, onChange }) {
  useDocumentTitle(institutional ? 'Consultas institucionales' : 'Consultas recibidas');
  const { user } = useAuth();
  const toast = useToast();
  const [deleting, setDeleting] = useState(null);

  const { data, loading, error, reload } = useAsync(async () => {
    if (institutional) return (await api.list('inquiries')).filter((i) => !i.to_user_id);
    return api.list('inquiries', { eq: { to_user_id: user.id } });
  }, [institutional, user.id]);

  async function toggleRead(item) {
    try {
      await api.update('inquiries', item.id, { read: !item.read });
      await reload();
      onChange?.();
    } catch (e) {
      toast.error(e.message || 'No se pudo actualizar la consulta.');
    }
  }

  async function confirmDelete() {
    try {
      await api.remove('inquiries', deleting.id);
      toast.success('Consulta eliminada.');
      setDeleting(null);
      await reload();
      onChange?.();
    } catch (e) {
      toast.error(e.message || 'No se pudo eliminar.');
    }
  }

  const items = data || [];
  return (
    <div className="stack">
      <PanelHead
        title={institutional ? 'Consultas institucionales' : 'Consultas recibidas'}
        text={
          institutional
            ? 'Mensajes enviados desde el formulario de contacto de la plataforma.'
            : 'Mensajes de personas interesadas en tus obras, talleres, eventos o en tu trabajo. Respondé por el medio que prefieras.'
        }
      />
      {loading && <Loader />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState title="No hay consultas por ahora" text="Cuando alguien te escriba desde el sitio, el mensaje va a aparecer acá." />
      )}
      {items.map((i) => {
        const wa = whatsappLink(i.phone, `Hola ${i.name}, te escribo por tu consulta en SIGA.`);
        return (
          <article key={i.id} className={`inquiry ${i.read ? '' : 'unread'}`}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="tags">
                <span className="badge">{KINDS[i.kind] || 'General'}</span>
                {!i.read && <span className="badge badge-warn">Nueva</span>}
              </div>
              <span className="muted">{formatDate(String(i.created_at).slice(0, 10))}</span>
            </div>
            {i.subject && <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{i.subject}</h3>}
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{i.message}</p>
            <p className="muted" style={{ margin: 0 }}>
              De: <strong>{i.name}</strong> · {i.email}
              {i.phone ? ` · ${i.phone}` : ''}
            </p>
            <div className="row-actions">
              <a className="btn btn-gold btn-sm" href={`mailto:${i.email}?subject=${encodeURIComponent(`Re: ${i.subject || 'Tu consulta en SIGA'}`)}`}>
                Responder por correo
              </a>
              {wa && (
                <a className="btn btn-ghost btn-sm" href={wa} target="_blank" rel="noopener noreferrer">
                  Responder por WhatsApp
                </a>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => toggleRead(i)}>
                {i.read ? 'Marcar como no leída' : 'Marcar como leída'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setDeleting(i)}>Eliminar</button>
            </div>
          </article>
        );
      })}
      {deleting && (
        <ConfirmDialog
          title="¿Eliminar esta consulta?"
          message="Se borra definitivamente de tu bandeja."
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
