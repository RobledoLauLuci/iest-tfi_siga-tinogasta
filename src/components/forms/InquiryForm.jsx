import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services';
import { Loader } from '../ui/States';
import ResourceForm from './ResourceForm';

const fields = [
  { name: 'name', label: 'Tu nombre', required: true, maxLength: 120 },
  { name: 'email', label: 'Tu correo', type: 'email', required: true, maxLength: 200 },
  { name: 'phone', label: 'Teléfono (opcional)', type: 'tel', hint: 'Si preferís que te respondan por WhatsApp.' },
  { name: 'message', label: 'Mensaje', type: 'textarea', required: true, maxLength: 2000, full: true,
    validate: (v) => (String(v).trim().length < 5 ? 'Escribí un mensaje de al menos 5 caracteres.' : '') },
];

// Formulario de consulta real: guarda el mensaje en la base de datos y le llega a la persona destinataria
// desde su panel. to_user_id vacío = consulta institucional (la recibe la administración).
export default function InquiryForm({
  toUserId = null,
  kind = 'general',
  targetIds = {},
  subject = '',
  defaultMessage = '',
  disabled = false,
  disabledReason = '',
}) {
  const { profile, user, loading } = useAuth();
  const [sent, setSent] = useState(false);

  // Se espera a que cargue la sesión para que nombre y correo lleguen precargados.
  if (loading) return <Loader text="Preparando el formulario…" />;

  if (disabled) {
    return (
      <div className="alert alert-info" role="note">
        {disabledReason || 'Las consultas no están disponibles por el momento.'}
      </div>
    );
  }

  if (sent) {
    return (
      <div className="alert alert-ok" role="status">
        <strong>¡Mensaje enviado!</strong> Quedó registrado y la persona destinataria lo verá en su panel. Te responderá al
        correo o teléfono que dejaste.
        <div style={{ marginTop: '0.8rem' }}>
          <button className="btn btn-sm btn-ghost" onClick={() => setSent(false)}>
            Enviar otra consulta
          </button>
        </div>
      </div>
    );
  }

  return (
    <ResourceForm
      fields={fields}
      initial={{
        name: profile?.full_name || '',
        email: user?.email || '',
        message: defaultMessage,
      }}
      submitLabel="Enviar consulta"
      onSubmit={async (payload) => {
        await api.sendInquiry({
          to_user_id: toUserId,
          kind,
          subject,
          name: payload.name,
          email: payload.email,
          phone: payload.phone || '',
          message: payload.message,
          ...targetIds,
        });
        setSent(true);
      }}
    />
  );
}
