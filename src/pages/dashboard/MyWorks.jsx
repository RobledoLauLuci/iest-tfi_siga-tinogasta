import ResourceManager from '../../components/forms/ResourceManager';
import Media from '../../components/ui/Media';
import { workFields } from '../../config/forms';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatPrice, workAvailability } from '../../utils/format';
import PanelHead from './PanelHead';

const BADGE = { disponible: 'badge-ok', vendida: 'badge-off', agotada: 'badge-off', no_disponible: 'badge-warn' };

function StockControl({ row, ctx }) {
  if (!row.for_sale) return <span className="muted">No está en venta</span>;
  const stock = Number(row.stock) || 0;
  return (
    <div className="stock-ctl" role="group" aria-label={`Stock de ${row.title}`}>
      <button type="button" aria-label="Restar una unidad" disabled={stock <= 0} onClick={() => ctx.patch(row, { stock: stock - 1 })}>
        −
      </button>
      <output aria-live="polite">{stock}</output>
      <button type="button" aria-label="Sumar una unidad" onClick={() => ctx.patch(row, { stock: stock + 1 })}>
        +
      </button>
    </div>
  );
}

const columns = [
  {
    label: 'Obra',
    render: (w) => (
      <div className="cell-main">
        <span className="thumb-sm"><Media src={w.images?.[0]} alt="" seed={w.id} /></span>
        <span>
          <strong>{w.title}</strong>
          <span className="muted">{w.category}</span>
        </span>
      </div>
    ),
  },
  { label: 'Precio', render: (w) => (w.for_sale ? formatPrice(w.price, w.currency) : '—') },
  { label: 'Stock', render: (w, ctx) => <StockControl row={w} ctx={ctx} /> },
  {
    label: 'Estado',
    render: (w) => {
      const av = workAvailability(w);
      return <span className={`badge ${BADGE[av.key]}`}>{w.for_sale || av.key !== 'disponible' ? av.label : 'Solo exhibición'}</span>;
    },
  },
];

export default function MyWorks() {
  useDocumentTitle('Mis obras');
  return (
    <>
      <PanelHead
        title="Mis obras"
        text="Cargá tus obras, definí el precio y controlá el stock. Con stock en cero la obra figura como «Agotada» y no admite consultas de compra."
      />
      <ResourceManager
        table="works"
        ownerField="artist_id"
        fields={workFields}
        columns={columns}
        singular="Obra"
        plural="obras"
        emptyText="Publicá tu primera obra con fotografías, técnica y, si querés venderla, su precio y stock."
        createLabel="Publicar obra"
        rowActions={(w, ctx) =>
          w.status === 'disponible' ? (
            <button className="btn btn-ghost btn-sm" onClick={() => ctx.patch(w, { status: 'vendida' }, 'Obra marcada como vendida.')}>
              Marcar vendida
            </button>
          ) : (
            <button className="btn btn-ghost btn-sm" onClick={() => ctx.patch(w, { status: 'disponible' }, 'Obra disponible nuevamente.')}>
              Reactivar
            </button>
          )
        }
      />
    </>
  );
}
