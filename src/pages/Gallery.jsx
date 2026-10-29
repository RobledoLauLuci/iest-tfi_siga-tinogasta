import { useMemo, useState } from 'react';
import { WorkCard } from '../components/cards/Cards';
import { EmptyState, ErrorBox, Loader } from '../components/ui/States';
import { CATEGORIES } from '../config/constants';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';
import { displayName, matchesQuery, workAvailability } from '../utils/format';

const PRICE_RANGES = [
  { value: '', label: 'Cualquiera' },
  { value: '0-50000', label: 'Hasta $ 50.000' },
  { value: '50000-150000', label: '$ 50.000 – $ 150.000' },
  { value: '150000-400000', label: '$ 150.000 – $ 400.000' },
  { value: '400000-', label: 'Más de $ 400.000' },
];

function inRange(price, range) {
  if (!range) return true;
  if (price === null || price === undefined || price === '') return false;
  const [min, max] = range.split('-');
  const n = Number(price);
  return n >= Number(min || 0) && (max === '' || n <= Number(max));
}

export default function Gallery({ onlyForSale = false }) {
  useDocumentTitle(
    onlyForSale ? 'Obras en venta' : 'Galería de obras',
    onlyForSale
      ? 'Obras originales de artistas de Tinogasta disponibles para la venta. Consultá directamente con cada artista.'
      : 'Galería de obras de los artistas visuales de Tinogasta: pintura, dibujo, escultura, cerámica, fotografía y más.',
  );
  const { data, loading, error, reload } = useAsync(async () => {
    const [works, profiles] = await Promise.all([api.list('works'), api.list('profiles')]);
    return { works, byId: Object.fromEntries(profiles.map((p) => [p.id, p])) };
  }, []);

  const [f, setF] = useState({ q: '', category: '', artist: '', technique: '', price: '', availability: '' });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const base = useMemo(() => (data?.works || []).filter((w) => !onlyForSale || w.for_sale), [data, onlyForSale]);
  const artists = useMemo(
    () => [...new Set(base.map((w) => w.artist_id))].map((id) => data.byId[id]).filter(Boolean),
    [base, data],
  );
  const techniques = useMemo(() => [...new Set(base.map((w) => w.technique).filter(Boolean))].sort(), [base]);

  const filtered = useMemo(
    () =>
      base.filter((w) => {
        const artist = data.byId[w.artist_id];
        const av = workAvailability(w).key;
        return (
          matchesQuery(f.q, w.title, w.description, w.technique, w.materials, w.category, displayName(artist)) &&
          (!f.category || w.category === f.category) &&
          (!f.artist || w.artist_id === f.artist) &&
          (!f.technique || w.technique === f.technique) &&
          inRange(w.price, f.price) &&
          (!f.availability || av === f.availability)
        );
      }),
    [base, data, f],
  );

  const reset = () => setF({ q: '', category: '', artist: '', technique: '', price: '', availability: '' });
  const hasFilters = Object.values(f).some(Boolean);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="script">{onlyForSale ? 'Llevate arte local' : 'Mirá con calma'}</span>
          <h1>{onlyForSale ? 'Obras en venta' : 'Galería de obras'}</h1>
          <p>
            {onlyForSale
              ? 'Obras originales disponibles. Consultás directamente con cada artista para coordinar pago y entrega.'
              : 'Las producciones de nuestros artistas: filtrá por técnica, categoría, precio o disponibilidad.'}
          </p>
        </div>
      </section>

      <section className="container">
        <form className="filters" role="search" aria-label="Buscar y filtrar obras" onSubmit={(e) => e.preventDefault()}>
          <div className="field search">
            <label htmlFor="g-q">Buscar obras o artistas</label>
            <input id="g-q" className="input" type="search" value={f.q} onChange={set('q')} placeholder="Título, técnica, artista…" />
          </div>
          <div className="field">
            <label htmlFor="g-cat">Categoría</label>
            <select id="g-cat" className="select" value={f.category} onChange={set('category')}>
              <option value="">Todas</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="g-tec">Técnica</label>
            <select id="g-tec" className="select" value={f.technique} onChange={set('technique')}>
              <option value="">Todas</option>
              {techniques.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="g-art">Artista</label>
            <select id="g-art" className="select" value={f.artist} onChange={set('artist')}>
              <option value="">Todos</option>
              {artists.map((a) => <option key={a.id} value={a.id}>{displayName(a)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="g-price">Rango de precio</label>
            <select id="g-price" className="select" value={f.price} onChange={set('price')}>
              {PRICE_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="g-av">Disponibilidad</label>
            <select id="g-av" className="select" value={f.availability} onChange={set('availability')}>
              <option value="">Todas</option>
              <option value="disponible">Disponible</option>
              <option value="agotada">Agotada</option>
              <option value="vendida">Vendida</option>
              <option value="no_disponible">No disponible</option>
            </select>
          </div>
          {hasFilters && (
            <div className="field">
              <button type="button" className="btn btn-ghost" onClick={reset}>Limpiar filtros</button>
            </div>
          )}
        </form>

        {loading && <Loader />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        {data && (
          <>
            <p className="result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'obra' : 'obras'}</p>
            {filtered.length === 0 ? (
              <EmptyState
                title={base.length === 0 ? (onlyForSale ? 'No hay obras en venta por ahora' : 'Todavía no hay obras publicadas') : 'Ninguna obra coincide con tu búsqueda'}
                text={base.length === 0 ? 'Las obras aparecerán acá apenas los artistas las publiquen.' : 'Probá con otros filtros o limpiá la búsqueda.'}
                actionLabel={base.length === 0 ? 'Soy artista: quiero publicar' : undefined}
                actionTo="/registro"
              />
            ) : (
              <div className="card-grid">
                {filtered.map((w) => <WorkCard key={w.id} work={w} artist={data.byId[w.artist_id]} />)}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
