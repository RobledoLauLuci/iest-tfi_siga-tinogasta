import { useState } from 'react';
import ResourceForm from '../../components/forms/ResourceForm';
import ResourceManager from '../../components/forms/ResourceManager';
import Modal, { ConfirmDialog } from '../../components/ui/Modal';
import Media from '../../components/ui/Media';
import { EmptyState, Loader } from '../../components/ui/States';
import { photoFields, workshopFields } from '../../config/forms';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { api } from '../../services';
import { audienceLabel, formatPrice } from '../../utils/format';
import PanelHead from './PanelHead';

function PhotosManager({ workshop, onClose }) {
  const { user } = useAuth();
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const { data, loading, reload } = useAsync(
    () => api.list('workshop_photos', { eq: { workshop_id: workshop.id } }),
    [workshop.id],
  );
  const photos = data || [];

  return (
    <Modal wide title={`Fotografías · ${workshop.name}`} onClose={onClose}>
      <p className="muted">
        Mostrá procesos creativos y trabajos terminados. Si aparecen menores de edad identificables, vas a necesitar la
        autorización de madres, padres o tutores antes de publicar.
      </p>
      {loading && <Loader />}
      {!loading && photos.length === 0 && !adding && (
        <EmptyState title="Este taller todavía no tiene fotografías" text="Sumá las primeras para que se vea cómo se trabaja." />
      )}
      {photos.length > 0 && (
        <div className="photo-grid" style={{ marginBottom: '1.2rem' }}>
          {photos.map((p) => (
            <figure className="photo-item" key={p.id} style={{ margin: 0 }}>
              <Media src={p.url} alt={p.caption || 'Fotografía del taller'} seed={p.id} />
              <figcaption className="cap">
                {p.caption || 'Sin descripción'}
                <div>
                  <button className="btn btn-danger btn-sm" style={{ marginTop: '0.4rem' }} onClick={() => setDeleting(p)}>
                    Quitar
                  </button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {adding ? (
        <ResourceForm
          fields={photoFields}
          submitLabel="Agregar fotografía"
          onCancel={() => setAdding(false)}
          onSubmit={async (p) => {
            await api.create('workshop_photos', {
              ...p,
              minors_consent: Boolean(p.minors_consent),
              workshop_id: workshop.id,
              owner_id: user.id,
            });
            toast.success('Fotografía agregada.');
            setAdding(false);
            await reload();
          }}
        />
      ) : (
        <div className="form-actions">
          <button className="btn btn-gold" onClick={() => setAdding(true)}>+ Agregar fotografía</button>
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>
      )}
      {deleting && (
        <ConfirmDialog
          title="¿Quitar esta fotografía?"
          message="Dejará de verse en la galería del taller."
          confirmLabel="Quitar"
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            try {
              await api.remove('workshop_photos', deleting.id);
              toast.success('Fotografía quitada.');
              setDeleting(null);
              await reload();
            } catch (e) {
              toast.error(e.message || 'No se pudo quitar.');
            }
          }}
        />
      )}
    </Modal>
  );
}

const columns = [
  {
    label: 'Taller',
    render: (w) => (
      <span>
        <strong>{w.name}</strong>
        <span className="muted">{w.modality} · {(w.audience || []).map(audienceLabel).join(', ')}</span>
      </span>
    ),
  },
  { label: 'Días y horarios', render: (w) => w.schedule },
  { label: 'Precio', render: (w) => (w.price ? formatPrice(w.price) : 'A consultar') },
  {
    label: 'Cupos',
    render: (w) =>
      w.spots === null || w.spots === undefined ? (
        '—'
      ) : w.spots === 0 ? (
        <span className="badge badge-off">Sin cupos</span>
      ) : (
        w.spots
      ),
  },
];

export default function MyWorkshops() {
  useDocumentTitle('Mis talleres');
  const [photosOf, setPhotosOf] = useState(null);
  return (
    <>
      <PanelHead
        title="Mis talleres"
        text="Publicá tus propuestas de formación, actualizá los cupos y mostrá lo que se hace en cada clase."
      />
      <ResourceManager
        table="workshops"
        ownerField="teacher_id"
        fields={workshopFields}
        columns={columns}
        singular="Taller"
        plural="talleres"
        emptyText="Creá tu primer taller con días, horarios, público destinatario y un medio de contacto."
        createLabel="Crear taller"
        rowActions={(w) => (
          <button className="btn btn-gold btn-sm" onClick={() => setPhotosOf(w)}>
            Fotografías
          </button>
        )}
      />
      {photosOf && <PhotosManager workshop={photosOf} onClose={() => setPhotosOf(null)} />}
    </>
  );
}
