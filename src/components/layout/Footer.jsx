import { Link } from 'react-router-dom';
import { CONFIG } from '../../config/constants';
import { whatsappLink } from '../../utils/format';

export default function Footer() {
  const wa = whatsappLink(CONFIG.contactWhatsapp);
  const hasContact = CONFIG.contactEmail || wa || CONFIG.instagram || CONFIG.facebook;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/logo-siga.png" alt="Logotipo de SIGA, proyecto de arte" loading="lazy" />
            <p>
              Plataforma de los artistas visuales de Tinogasta, Catamarca. Un espacio para mostrar, compartir y vender arte
              hecho en nuestra comunidad.
            </p>
          </div>
          <div>
            <h3>Explorar</h3>
            <ul>
              <li><Link to="/artistas">Artistas</Link></li>
              <li><Link to="/galeria">Galería de obras</Link></li>
              <li><Link to="/obras-en-venta">Obras en venta</Link></li>
              <li><Link to="/talleres">Talleres</Link></li>
              <li><Link to="/agenda">Agenda cultural</Link></li>
            </ul>
          </div>
          <div>
            <h3>El proyecto</h3>
            <ul>
              <li><Link to="/sobre-el-proyecto">Sobre el proyecto</Link></li>
              <li><Link to="/comunidad">Comunidad artística</Link></li>
              <li><Link to="/registro">Sumate como artista</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h3>Contacto</h3>
            {hasContact ? (
              <ul>
                {CONFIG.contactEmail && <li><a href={`mailto:${CONFIG.contactEmail}`}>{CONFIG.contactEmail}</a></li>}
                {wa && <li><a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>}
                {CONFIG.instagram && <li><a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
                {CONFIG.facebook && <li><a href={CONFIG.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>}
              </ul>
            ) : (
              <p style={{ opacity: 0.85 }}>
                Escribinos desde el <Link to="/contacto">formulario de contacto</Link>.
              </p>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SIGA · Tinogasta, Catamarca, Argentina</span>
          <span>Hecho con cariño para la comunidad artística local.</span>
        </div>
      </div>
    </footer>
  );
}
