import { useMemo, useState } from 'react';
import { EventCard } from '../components/cards/Cards';
import { EmptyState, ErrorBox, Loader } from '../components/ui/States';
import { EVENT_CATEGORIES, EVENT_TYPES } from '../config/constants';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';
import { isUpcoming, matchesQuery } from '../utils/format';

const SCOPES = [
  { value: 'proximos', label: 'Próximos' },
  { value: 'finalizados', label: 'Finalizados' },
  { value: 'todos', label: 'Todos' },
];

export default function Agenda() {
  useDocumentTitle('Agenda cultural', 'Exposiciones, ferias, encuentros, concursos y convocatorias de arte en Tinogasta, Catamarca.');
  const { data: events, loading, error, reload } = useAsync(() => api.list('events'), []);
  const [f, setF] = useState({ q: '', scope: 'proximos', type: '', category: '', from: '', to: '' });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const filtered = useMemo(() => {
    const list = (events || []).filter((e) => {
      const day = String(e.event_date).slice(0, 10);
      const up = isUpcoming(e);
      return (
        (f.scope === 'todos' || (f.scope === 'proximos' ? up : !up)) &&
        (!f.type || e.type === f.type) &&
        (!f.category || e.category === f.category) &&
        (!f.from || day >= f.from) &&
        (!f.to || day <= f.to) &&
        matchesQuery(f.q, e.title, e.description, e.place, e.organizer_name)
      );
    });
    // Próximos: del más cercano al más lejano. Finalizados: del más reciente al más antiguo.
    return list.sort((a, b) =>
      f.scope === 'proximos' ? a.event_date.localeCompare(b.event_date) : b.event_date.localeCompare(a.event_date),
    );
  }, [events, f]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="script">Arte en Tinogasta</span>
          <h1>Agenda artística</h1>
          <p>Exposiciones, ferias, encuentros y convocatorias. Si organizás algo, subí tu flyer desde tu panel.</p>
        </div>
      </section>
      <section className="container">
        <div className="btn-row" role="tablist" aria-label="Período" style={{ marginBottom: '1.2rem' }}>
          {SCOPES.map((s) => (
            <button
              key={s.value}
              role="tab"
              aria-selected={f.scope === s.value}
              className={`btn btn-sm ${f.scope === s.value ? '' : 'btn-ghost'}`}
              onClick={() => setF((x) => ({ ...x, scope: s.value }))}
            >
              {s.label}
            </button>
          ))}
        </div>
        <form className="filters" role="search" aria-label="Filtrar eventos" onSubmit={(e) => e.preventDefault()}>
          <div className="field search">
            <label htmlFor="e-q">Buscar</label>
            <input id="e-q" className="input" type="search" value={f.q} onChange={set('q')} placeholder="Título, lugar u organizador…" />
          </div>
          <div className="field">
            <label htmlFor="e-type">Tipo de evento</label>
            <select id="e-type" className="select" value={f.type} onChange={set('type')}>
              <option value="">Todos</option>
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="e-cat">Categoría</label>
            <select id="e-cat" className="select" value={f.category} onChange={set('category')}>
              <option value="">Todas</option>
              {EVENT_CATEGORIES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="e-from">Desde</label>
            <input id="e-from" className="input" type="date" value={f.from} onChange={set('from')} />
          </div>
          <div className="field">
            <label htmlFor="e-to">Hasta</label>
            <input id="e-to" className="input" type="date" value={f.to} onChange={set('to')} />
          </div>
        </form>

        {loading && <Loader />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        {events && (
          <>
            <p className="result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'evento' : 'eventos'}</p>
            {filtered.length === 0 ? (
              <EmptyState
                title={events.length === 0 ? 'Todavía no hay eventos publicados' : 'No hay eventos con esos filtros'}
                text={events.length === 0 ? 'Cuando se publiquen exposiciones, ferias o encuentros, los vas a ver acá.' : 'Probá cambiar el período o quitar filtros.'}
                actionLabel={events.length === 0 ? 'Quiero publicar un evento' : undefined}
                actionTo="/registro"
              />
            ) : (
              <div className="events-grid">{filtered.map((e) => <EventCard key={e.id} event={e} />)}</div>
            )}
          </>
        )}
      </section>
    </>
  );
}
