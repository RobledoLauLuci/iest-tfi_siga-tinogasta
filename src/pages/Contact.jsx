import InquiryForm from '../components/forms/InquiryForm';
import { CONFIG } from '../config/constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { whatsappLink } from '../utils/format';

export default function Contact() {
  useDocumentTitle('Contacto', 'Escribinos por consultas sobre la plataforma de artistas visuales de Tinogasta.');
  const wa = whatsappLink(CONFIG.contactWhatsapp, 'Hola, tengo una consulta sobre SIGA.');
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="script">Hablemos</span>
          <h1>Contacto</h1>
          <p>Para consultas sobre la plataforma, sugerencias o para sumarte como artista. Si querés escribirle a un artista en particular, hacelo desde su perfil.</p>
        </div>
      </section>
      <section className="container section-tight">
        <div className="detail" style={{ paddingTop: 0 }}>
          <div className="form-card">
            <h2 style={{ fontSize: '1.6rem' }}>Escribinos</h2>
            <InquiryForm kind="institucional" subject="Consulta institucional" />
          </div>
          <aside className="panel">
            <h3>Otros medios</h3>
            {CONFIG.contactEmail || wa || CONFIG.instagram || CONFIG.facebook ? (
              <ul style={{ paddingLeft: '1.1rem', display: 'grid', gap: '0.4rem' }}>
                {CONFIG.contactEmail && <li><a href={`mailto:${CONFIG.contactEmail}`}>{CONFIG.contactEmail}</a></li>}
                {wa && <li><a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp institucional</a></li>}
                {CONFIG.instagram && <li><a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
                {CONFIG.facebook && <li><a href={CONFIG.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>}
              </ul>
            ) : (
              <p className="muted">
                Los datos de contacto institucional se configuran con las variables <code>VITE_CONTACT_*</code> (ver README).
                Mientras tanto, el formulario es el medio de contacto.
              </p>
            )}
            <p className="muted" style={{ fontSize: '0.88rem' }}>
              Tinogasta, Catamarca, Argentina. Nunca publicamos datos privados de las personas registradas.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
