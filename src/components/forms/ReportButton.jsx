import { useState } from 'react';
import { REPORT_REASONS } from '../../config/constants';
import { useToast } from '../../context/ToastContext';
import { api, isDemoId } from '../../services';
import Modal from '../ui/Modal';
import ResourceForm from './ResourceForm';

const fields = [
  { name: 'reason', label: 'Motivo', type: 'select', required: true, options: REPORT_REASONS, default: REPORT_REASONS[0] },
  { name: 'details', label: 'Detalles (opcional)', type: 'textarea', maxLength: 800, full: true },
];

// Permite a cualquier visitante denunciar una publicación. La administración las revisa en su panel.
export default function ReportButton({ targetType, targetId, targetTitle }) {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  if (isDemoId(targetId)) return null;

  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
        Denunciar publicación
      </button>
      {open && (
        <Modal title="Denunciar publicación" onClose={() => setOpen(false)}>
          <p className="muted">
            Si algo de esta publicación no corresponde, avisanos. La administración la revisará.
          </p>
          <ResourceForm
            fields={fields}
            submitLabel="Enviar denuncia"
            onCancel={() => setOpen(false)}
            onSubmit={async (p) => {
              await api.sendReport({
                target_type: targetType,
                target_id: targetId,
                target_title: targetTitle,
                reason: p.reason,
                details: p.details || '',
              });
              toast.success('Gracias. Recibimos tu denuncia.');
              setOpen(false);
            }}
          />
        </Modal>
      )}
    </>
  );
}
