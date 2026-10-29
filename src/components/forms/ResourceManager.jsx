import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services';
import Modal, { ConfirmDialog } from '../ui/Modal';
import { EmptyState, ErrorBox, Loader } from '../ui/States';
import ResourceForm from './ResourceForm';

// Administrador genérico de publicaciones (obras, talleres, eventos, grupos).
// Lista, crea, edita y elimina. Cada artista solo ve y modifica lo suyo: se filtra por
// ownerField en la pantalla y, en producción, lo garantiza la base de datos (RLS).
//
// Props:
//  table, fields, columns[{ label, render(row, ctx) }], singular, plural, emptyText
//  ownerField  → campo que guarda el id del dueño (si no hay, la tabla es global)
//  rowActions(row, ctx) → botones extra por fila
//  sortFn      → orden opcional
//  beforeSave(payload) → permite completar datos antes de guardar
export default function ResourceManager({
  table,
  fields,
  columns,
  singular,
  plural,
  emptyText,
  ownerField,
  rowActions,
  beforeSave,
  createLabel,
  intro,
}) {
  const { user } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(null); // null | 'new' | row
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const { data, loading, error, reload } = useAsync(
    () => api.list(table, ownerField ? { eq: { [ownerField]: user.id } } : {}),
    [table, user?.id],
  );

  async function patch(row, changes, message) {
    try {
      await api.update(table, row.id, changes);
      if (message) toast.success(message);
      await reload();
    } catch (e) {
      toast.error(e.message || 'No se pudo actualizar.');
    }
  }

  async function save(payload) {
    const finalPayload = beforeSave ? beforeSave(payload) : payload;
    if (editing === 'new') {
      await api.create(table, ownerField ? { ...finalPayload, [ownerField]: user.id } : finalPayload);
      toast.success(`${singular} publicada correctamente.`);
    } else {
      await api.update(table, editing.id, finalPayload);
      toast.success('Los cambios se guardaron.');
    }
    setEditing(null);
    await reload();
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await api.remove(table, deleting.id);
      toast.success(`${singular} eliminada.`);
      setDeleting(null);
      await reload();
    } catch (e) {
      toast.error(e.message || 'No se pudo eliminar.');
    } finally {
      setBusy(false);
    }
  }

  const ctx = { patch, reload };
  const rows = data || [];

  return (
    <div className="stack">
      {intro}
      <div className="row">
        <button className="btn btn-gold" onClick={() => setEditing('new')}>
          + {createLabel || `Nueva ${singular.toLowerCase()}`}
        </button>
      </div>

      {loading && <Loader />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {!loading && !error && rows.length === 0 && <EmptyState title={`Todavía no hay ${plural}`} text={emptyText} />}

      {!loading && rows.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.label} scope="col">{c.label}</th>
                ))}
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => (
                    <td key={c.label}>{c.render(row, ctx)}</td>
                  ))}
                  <td>
                    <div className="row-actions">
                      {rowActions?.(row, ctx)}
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(row)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleting(row)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal
          wide
          title={editing === 'new' ? `Nueva ${singular.toLowerCase()}` : `Editar ${singular.toLowerCase()}`}
          onClose={() => setEditing(null)}
        >
          <ResourceForm
            fields={fields}
            initial={editing === 'new' ? {} : editing}
            submitLabel={editing === 'new' ? 'Publicar' : 'Guardar cambios'}
            onCancel={() => setEditing(null)}
            onSubmit={save}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title={`¿Eliminar ${singular.toLowerCase()}?`}
          message="Esta acción no se puede deshacer. La publicación dejará de verse en el sitio."
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
