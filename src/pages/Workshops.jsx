import { useMemo, useState } from 'react';
import { WorkshopCard } from '../components/cards/Cards';
import { DemoNotice, EmptyState, ErrorBox, Loader } from '../components/ui/States';
import { AUDIENCES, MODALITIES } from '../config/constants';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';
import { matchesQuery } from '../utils/format';

export default function Workshops() {
  useDocumentTitle('Talleres', 'Talleres de arte en Tinogasta para niños, adolescentes, adultos y personas mayores: dibujo, pintura, escultura y más.');
  const { data, loading, error, reload } = useAsync(async () => {
    const [workshops, profiles] = await Promise.all([api.list('workshops'), api.list('profiles')]);
    return { workshops, byId: Object.fromEntries(profiles.map((p) => [p.id, p])) };
  }, []);
  const [f, setF] = useState({ q: '', audience: '', modality: '', technique: '', onlyOpen: false });

  const techniques = useMemo(
    () => [...new Set((data?.workshops || []).flatMap((w) => w.techniques || []))].sort((a, b) => a.localeCompare(b, 'es')),
    [data],
  );

  const filtered = useMemo(
    () =>
      (data?.workshops || []).filter(
        (w) =>
          matchesQuery(f.q, w.name, w.description, w.techniques, data.byId[w.teacher_id]?.full_name, data.byId[w.teacher_id]?.artistic_name) &&
          (!f.audience || (w.audience || []).includes(f.audience)) &&
          (!f.modality || w.modality === f.modality) &&
          (!f.technique || (w.techniques || []).includes(f.technique)) &&
          (!f.onlyOpen || w.spots === null || w.spots === undefined || w.spots > 0),
      ),
    [data, f],
  );

  const hasDemo = (data?.workshops || []).some((w) => w.is_demo);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="script">Aprender haciendo</span>
          <h1>Talleres de arte</h1>
          <p>Propuestas de formación para todas las edades, dictadas por artistas de Tinogasta.</p>
        </div>
      </section>
      <section className="container">
        {hasDemo && <div style={{ marginBottom: '1.5rem' }}><DemoNotice /></div>}
        <form className="filters" role="search" aria-label="Buscar y filtrar talleres" onSubmit={(e) => e.preventDefault()}>
          <div className="field search">
            <label htmlFor="w-q">Buscar talleres</label>
            <input id="w-q" className="input" type="search" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} placeholder="Nombre, técnica o docente…" />
          </div>
          <div className="field">
            <label htmlFor="w-aud">Público</label>
            <select id="w-aud" className="select" value={f.audience} onChange={(e) => setF({ ...f, audience: e.target.value })}>
              <option value="">Todos</option>
              {AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="w-tec">Técnica</label>
            <select id="w-tec" className="select" value={f.technique} onChange={(e) => setF({ ...f, technique: e.target.value })}>
              <option value="">Todas</option>
              {techniques.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="w-mod">Modalidad</label>
            <select id="w-mod" className="select" value={f.modality} onChange={(e) => setF({ ...f, modality: e.target.value })}>
              <option value="">Todas</option>
              {MODALITIES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <label className="check" style={{ alignSelf: 'center' }}>
            <input type="checkbox" checked={f.onlyOpen} onChange={(e) => setF({ ...f, onlyOpen: e.target.checked })} />
            <span>Solo con cupos disponibles</span>
          </label>
        </form>

        {loading && <Loader />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        {data && (
          <>
            <p className="result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'taller' : 'talleres'}</p>
            {filtered.length === 0 ? (
              <EmptyState
                title={data.workshops.length === 0 ? 'Todavía no hay talleres publicados' : 'Ningún taller coincide con tu búsqueda'}
                text={data.workshops.length === 0 ? 'Quienes dictan talleres pueden publicarlos desde su panel.' : 'Probá con otros filtros.'}
                actionLabel={data.workshops.length === 0 ? 'Quiero publicar un taller' : undefined}
                actionTo="/registro"
              />
            ) : (
              <div className="card-grid">
                {filtered.map((w) => <WorkshopCard key={w.id} workshop={w} teacher={data.byId[w.teacher_id]} />)}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
