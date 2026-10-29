import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/guards/ProtectedRoute';
import Layout from './components/layout/Layout';
import { Loader } from './components/ui/States';

import About from './pages/About';
import Agenda from './pages/Agenda';
import ArtistProfile from './pages/ArtistProfile';
import Artists from './pages/Artists';
import Community from './pages/Community';
import Contact from './pages/Contact';
import EventDetail from './pages/EventDetail';
import Gallery from './pages/Gallery';
import GroupDetail from './pages/GroupDetail';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import WorkDetail from './pages/WorkDetail';
import WorkshopDetail from './pages/WorkshopDetail';
import Workshops from './pages/Workshops';

// El panel se carga solo cuando hace falta (mejora la velocidad de la parte pública).
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="artistas" element={<Artists />} />
        <Route path="artistas/:id" element={<ArtistProfile />} />
        <Route path="galeria" element={<Gallery />} />
        <Route path="obras-en-venta" element={<Gallery onlyForSale />} />
        <Route path="obras/:id" element={<WorkDetail />} />
        <Route path="talleres" element={<Workshops />} />
        <Route path="talleres/:id" element={<WorkshopDetail />} />
        <Route path="comunidad" element={<Community />} />
        <Route path="comunidad/:id" element={<GroupDetail />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="agenda/:id" element={<EventDetail />} />
        <Route path="sobre-el-proyecto" element={<About />} />
        <Route path="contacto" element={<Contact />} />
        <Route path="ingresar" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route
          path="panel/*"
          element={
            <ProtectedRoute>
              <Suspense fallback={<Loader text="Abriendo tu panel…" />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
