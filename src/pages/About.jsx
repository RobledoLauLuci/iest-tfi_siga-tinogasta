import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const PURPOSES = [
  'Visibilizar el talento artístico local.',
  'Reunir a artistas de distintas disciplinas.',
  'Promover la comercialización de obras.',
  'Difundir talleres y espacios de formación.',
  'Compartir exposiciones, ferias y actividades culturales.',
  'Fomentar la colaboración entre artistas.',
  'Preservar y difundir la identidad cultural de Tinogasta.',
  'Generar oportunidades de crecimiento profesional y económico.',
];

export default function About() {
  useDocumentTitle('Sobre el proyecto', 'SIGA es la plataforma de los artistas visuales de Tinogasta, Catamarca: misión, visión, valores y objetivos.');
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="script">Por qué existe SIGA</span>
          <h1>Sobre el proyecto</h1>
          <p>
            SIGA nace para que el arte que se hace en Tinogasta se vea, se comparta y se valore. Es un espacio pensado
            exclusivamente para los artistas visuales de nuestra comunidad.
          </p>
        </div>
      </section>

      <section className="container section-tight">
        <div className="pillars">
          <article className="pillar">
            <h2>Misión</h2>
            <p>
              Ofrecer a los artistas visuales de Tinogasta una plataforma propia, simple y cálida para mostrar sus obras,
              venderlas, dar a conocer sus talleres y difundir sus actividades, sin depender de intermediarios.
            </p>
          </article>
          <article className="pillar">
            <h2>Visión</h2>
            <p>
              Que SIGA sea el lugar de referencia donde cualquier persona descubra el arte de Tinogasta, y donde cada
              artista encuentre público, compañía y oportunidades para crecer.
            </p>
          </article>
          <article className="pillar">
            <h2>Valores</h2>
            <ul>
              <li><strong>Identidad:</strong> orgullo por lo nuestro.</li>
              <li><strong>Inclusión:</strong> todas las disciplinas y todas las edades.</li>
              <li><strong>Colaboración:</strong> crecemos juntos.</li>
              <li><strong>Respeto:</strong> por cada obra, cada autor y cada persona.</li>
              <li><strong>Transparencia:</strong> información clara y datos reales.</li>
            </ul>
          </article>
          <article className="pillar">
            <h2>Objetivos</h2>
            <ul>
              <li>Reunir en un solo sitio a la comunidad artística local.</li>
              <li>Facilitar la publicación de obras y el control de su stock.</li>
              <li>Conectar a compradores con artistas de forma directa.</li>
              <li>Mantener actualizada la agenda cultural de Tinogasta.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="container section">
        <h2>Para qué sirve esta plataforma</h2>
        <ul className="purpose-list">
          {PURPOSES.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </section>

      <section className="container section-tight">
        <div className="panel">
          <h3>Cómo funciona</h3>
          <ol style={{ paddingLeft: '1.2rem', display: 'grid', gap: '0.5rem', margin: 0 }}>
            <li><strong>Visitantes</strong> exploran obras, artistas, talleres y eventos sin necesidad de registrarse.</li>
            <li><strong>Artistas</strong> se registran, completan su perfil y publican obras, talleres y eventos. Cada artista solo puede modificar sus propias publicaciones y decide qué datos de contacto hacer públicos.</li>
            <li><strong>Compradores</strong> consultan directamente con cada artista para acordar pago y entrega. Por ahora SIGA no procesa pagos.</li>
            <li><strong>La administración</strong> cuida la comunidad: gestiona grupos, usuarios y atiende las denuncias.</li>
          </ol>
          <div className="btn-row mt">
            <Link className="btn btn-gold" to="/registro">Sumarme como artista</Link>
            <Link className="btn btn-ghost" to="/contacto">Escribirnos</Link>
          </div>
        </div>
      </section>
    </>
  );
}
