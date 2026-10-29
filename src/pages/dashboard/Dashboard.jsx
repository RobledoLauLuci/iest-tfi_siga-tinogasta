import { NavLink, Route, Routes, Link } from 'react-router-dom';
import ProtectedRoute from '../../components/guards/ProtectedRoute';
import { Avatar } from '../../components/ui/Media';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { api } from '../../services';
import { displayName } from '../../utils/format';
import { ROLES } from '../../config/constants';
import Inbox from './Inbox';
import MyEvents from './MyEvents';
import MyProfile from './MyProfile';
import MyWorks from './MyWorks';
import MyWorkshops from './MyWorkshops';
import Overview from './Overview';
import AdminGroups from './admin/AdminGroups';
import AdminReports from './admin/AdminReports';
import AdminUsers from './admin/AdminUsers';

function NavItem({ to, end, children, count }) {
  return (
    <NavLink to={to} end={end}>
      <span>{children}</span>
      {count > 0 && <span className="count" aria-label={`${count} pendientes`}>{count}</span>}
    </NavLink>
  );
}

export default function Dashboard() {
  useDocumentTitle('Mi panel');
  const { profile, user, isAdmin } = useAuth();

  // Contadores del menú (consultas sin leer y denuncias abiertas).
  const { data: counts, reload } = useAsync(async () => {
    const inquiries = await api.list('inquiries', { eq: { to_user_id: user.id } });
    const reports = isAdmin ? await api.list('reports') : [];
    const all = isAdmin ? await api.list('inquiries') : [];
    return {
      unread: inquiries.filter((i) => !i.read).length,
      openReports: reports.filter((r) => r.status === 'abierta').length,
      institutional: all.filter((i) => !i.to_user_id && !i.read).length,
    };
  }, [user.id, isAdmin]);

  const c = counts || { unread: 0, openReports: 0, institutional: 0 };

  return (
    <div className="container dash">
      <aside>
        <nav className="dash-nav" aria-label="Panel de usuario">
          <div className="who">
            <Avatar src={profile?.avatar_url} name={displayName(profile)} size={52} />
            <strong>{displayName(profile)}</strong>
            <span className="badge">{ROLES[profile?.role] || ROLES.artist}</span>
            {user && <Link to={`/artistas/${user.id}`} style={{ fontSize: '0.88rem' }}>Ver mi perfil público</Link>}
          </div>
          <NavItem to="/panel" end>Resumen</NavItem>
          <NavItem to="/panel/obras">Mis obras</NavItem>
          <NavItem to="/panel/talleres">Mis talleres</NavItem>
          <NavItem to="/panel/eventos">Mis eventos</NavItem>
          <NavItem to="/panel/consultas" count={c.unread}>Consultas recibidas</NavItem>
          <NavItem to="/panel/perfil">Mi perfil y grupos</NavItem>
          {isAdmin && (
            <>
              <div className="group-title">Administración</div>
              <NavItem to="/panel/admin/usuarios">Usuarios</NavItem>
              <NavItem to="/panel/admin/grupos">Grupos artísticos</NavItem>
              <NavItem to="/panel/admin/denuncias" count={c.openReports}>Publicaciones denunciadas</NavItem>
              <NavItem to="/panel/admin/consultas" count={c.institutional}>Consultas institucionales</NavItem>
            </>
          )}
        </nav>
      </aside>

      <section aria-live="polite">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="obras" element={<MyWorks />} />
          <Route path="talleres" element={<MyWorkshops />} />
          <Route path="eventos" element={<MyEvents />} />
          <Route path="consultas" element={<Inbox onChange={reload} />} />
          <Route path="perfil" element={<MyProfile />} />
          <Route path="admin/usuarios" element={<ProtectedRoute admin><AdminUsers /></ProtectedRoute>} />
          <Route path="admin/grupos" element={<ProtectedRoute admin><AdminGroups /></ProtectedRoute>} />
          <Route path="admin/denuncias" element={<ProtectedRoute admin><AdminReports onChange={reload} /></ProtectedRoute>} />
          <Route
            path="admin/consultas"
            element={<ProtectedRoute admin><Inbox institutional onChange={reload} /></ProtectedRoute>}
          />
          <Route path="*" element={<Overview />} />
        </Routes>
      </section>
    </div>
  );
}
