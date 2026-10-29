import { useMemo, useState } from 'react';
import { ArtistCard } from '../components/cards/Cards';
import { EmptyState, ErrorBox, Loader } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';
import { displayName, matchesQuery } from '../utils/format';

export default function Artists() {
  useDocumentTitle('Artistas', 'Conocé a los artistas visuales de Tinogasta, Catamarca: perfiles, técnicas y obras.');
  const { data: profiles, loading, error, reload } = useAsync(() => api.list('profiles'), []);
  const [query, setQuery] = useState('');
  const [technique, setTechnique] = useState('');

  const techniques = useMemo(
    () => [...new Set((profiles || []).flatMap((p) => p.techniques || []))].sort((a, b) => a.localeCompare(b, 'es')),
    [profiles],
  );

  const filtered = useMemo(
    () =>
      (profiles || []).filter(
        (p) =>
          matchesQuery(query, displayName(p), p.full_name, p.specialty, p.techniques, p.bio) &&
          (!technique || (p.techniques || []).includes(technique)),
      ),
    [profiles, query, technique],
  );

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="script">Quiénes somos</span>
          <h1>Artistas de Tinogasta</h1>
          <p>Cada perfil es una puerta a una obra, un taller o una forma de mirar el mundo desde acá.</p>
        </div>
      </section>
      <section className="container">
        <form className="filters" role="search" aria-label="Buscar artistas" onSubmit={(e) => e.preventDefault()}>
          <div className="field search">
            <label htmlFor="q-artistas">Buscar por nombre o palabra clave</label>
            <input id="q-artistas" className="input" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ej.: acuarela, cerámica…" />
          </div>
          <div className="field">
            <label htmlFor="f-tec">Técnica</label>
            <select id="f-tec" className="select" value={technique} onChange={(e) => setTechnique(e.target.value)}>
              <option value="">Todas</option>
              {techniques.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </form>

        {loading && <Loader />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        {profiles && (
          <>
            <p className="result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'artista' : 'artistas'}</p>
            {filtered.length === 0 ? (
              <EmptyState
                title={profiles.length === 0 ? 'Todavía no hay artistas registrados' : 'No encontramos artistas con esa búsqueda'}
                text={profiles.length === 0 ? 'Sumate y creá tu perfil público para que te conozcan.' : 'Probá con otra palabra o quitá los filtros.'}
                actionLabel={profiles.length === 0 ? 'Crear mi perfil' : undefined}
                actionTo="/registro"
              />
            ) : (
              <div className="card-grid">
                {filtered.map((p) => <ArtistCard key={p.id} profile={p} />)}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
