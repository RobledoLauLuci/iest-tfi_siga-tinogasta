import ResourceManager from '../../components/forms/ResourceManager';
import Media from '../../components/ui/Media';
import { eventFields } from '../../config/forms';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatDate, isUpcoming } from '../../utils/format';
import PanelHead from './PanelHead';

const columns = [
  {
    label: 'Evento',
    render: (e) => (
      <div className="cell-main">
        <span className="thumb-sm"><Media src={e.flyer_url || e.images?.[0]} alt="" seed={e.id} /></span>
        <span>
          <strong>{e.title}</strong>
          <span className="muted">{e.type}</span>
        </span>
      </div>
    ),
  },
  { label: 'Fecha', render: (e) => `${formatDate(e.event_date)}${e.event_time ? ` · ${e.event_time} h` : ''}` },
  { label: 'Lugar', render: (e) => e.place },
  {
    label: 'Estado',
    render: (e) => (
      <span className={`badge ${isUpcoming(e) ? 'badge-ok' : 'badge-off'}`}>{isUpcoming(e) ? 'Próximo' : 'Finalizado'}</span>
    ),
  },
];

export default function MyEvents() {
  useDocumentTitle('Mis eventos');
  return (
    <>
      <PanelHead
        title="Mis eventos y flyers"
        text="Publicá exposiciones, ferias, concursos y convocatorias para que la agenda cultural de Tinogasta esté siempre al día."
      />
      <ResourceManager
        table="events"
        ownerField="organizer_id"
        fields={eventFields}
        columns={columns}
        singular="Evento"
        plural="eventos"
        emptyText="Subí el flyer de tu próxima actividad para difundirla en la agenda."
        createLabel="Publicar evento"
      />
    </>
  );
}
