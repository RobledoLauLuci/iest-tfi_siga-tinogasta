import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { displayName } from '../../utils/format';

export const NAV_ITEMS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/artistas', label: 'Artistas' },
  { to: '/galeria', label: 'Galería de obras' },
  { to: '/obras-en-venta', label: 'Obras en venta' },
  { to: '/talleres', label: 'Talleres' },
  { to: '/comunidad', label: 'Comunidad artística' },
  { to: '/agenda', label: 'Agenda cultural' },
  { to: '/sobre-el-proyecto', label: 'Sobre el proyecto' },
  { to: '/contacto', label: 'Contacto' },
];

function NavList({ onNavigate }) {
  return (
    <ul>
      {NAV_ITEMS.map((item) => (
        <li key={item.to}>
          <NavLink to={item.to} end={item.end} onClick={onNavigate}>
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function AuthButtons({ onNavigate, mobile }) {
  const { isLoggedIn, profile, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    onNavigate?.();
    toast.success('Cerraste sesión.');
    navigate('/');
  }

  if (isLoggedIn) {
    return (
      <>
        <Link to="/panel" className="btn btn-gold btn-sm" onClick={onNavigate}>
          Mi panel
        </Link>
        <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
          Salir
        </button>
        {!mobile && profile && <span className="visually-hidden">Sesión iniciada como {displayName(profile)}</span>}
      </>
    );
  }
  return (
    <>
      <Link to="/ingresar" className="btn btn-ghost btn-sm" onClick={onNavigate}>
        Iniciar sesión
      </Link>
      <Link to="/registro" className="btn btn-sm" onClick={onNavigate}>
        Registrarse
      </Link>
    </>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-top">
          <Link to="/" className="brand" aria-label="SIGA, proyecto de arte — ir al inicio">
            <img src="/logo-siga.png" alt="" width="56" height="56" />
            <span className="brand-text">
              <span className="brand-name">SIGA</span>
              <span className="brand-sub">Artes visuales de Tinogasta</span>
            </span>
          </Link>
          <div className="header-auth">
            <span className="desktop-only" style={{ gap: '0.6rem', alignItems: 'center' }}>
              <AuthButtons />
            </span>
            <button
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="menu-movil"
              onClick={() => setOpen((o) => !o)}
            >
              <span aria-hidden="true">{open ? '✕' : '☰'}</span> Menú
            </button>
          </div>
        </div>
      </div>
      <nav className="main-nav" aria-label="Principal">
        <div className="container">
          <NavList />
        </div>
      </nav>
      {open && (
        <nav className="mobile-menu" id="menu-movil" aria-label="Principal (móvil)">
          <div className="container">
            <NavList onNavigate={() => setOpen(false)} />
            <div className="mobile-auth">
              <AuthButtons mobile onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
