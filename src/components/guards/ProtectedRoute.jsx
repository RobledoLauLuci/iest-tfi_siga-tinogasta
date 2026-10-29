import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../ui/States';

// Protege rutas del panel. En producción la seguridad real la aplica la base de datos (RLS);
// esto solo evita mostrar pantallas a quien no corresponde.
export default function ProtectedRoute({ children, admin = false }) {
  const { loading, isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <Loader text="Verificando sesión…" />;
  if (!isLoggedIn) return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />;
  if (admin && !isAdmin) return <Navigate to="/panel" replace />;
  return children;
}
