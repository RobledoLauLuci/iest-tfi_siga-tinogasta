import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { isEmail } from '../utils/validators';

export default function Login() {
  useDocumentTitle('Iniciar sesión');
  const { signIn, isLoggedIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const from = location.state?.from || '/panel';
  if (isLoggedIn) return <Navigate to={from} replace />;

  async function submit(e) {
    e.preventDefault();
    const found = {};
    if (!isEmail(form.email)) found.email = 'Ingresá un correo válido.';
    if (!form.password) found.password = 'Ingresá tu contraseña.';
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      await signIn(form);
      toast.success('¡Bienvenida/o de vuelta!');
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container auth-wrap">
      <div className="form-card auth-card">
        <div className="brand-top">
          <img src="/logo-siga.png" alt="" width="92" height="92" />
          <h1 style={{ fontSize: '1.9rem', margin: 0 }}>Iniciar sesión</h1>
        </div>
        <form className="form" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="l-email">Correo electrónico</label>
            <input id="l-email" className="input" type="email" autoComplete="email" value={form.email} aria-invalid={errors.email ? 'true' : undefined} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <div className="error" role="alert">{errors.email}</div>}
          </div>
          <div className="field">
            <label htmlFor="l-pass">Contraseña</label>
            <input id="l-pass" className="input" type="password" autoComplete="current-password" value={form.password} aria-invalid={errors.password ? 'true' : undefined} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {errors.password && <div className="error" role="alert">{errors.password}</div>}
          </div>
          {formError && <div className="alert alert-error" role="alert">{formError}</div>}
          <button className="btn btn-block" type="submit" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
        </form>
        <p className="center mt" style={{ marginBottom: 0 }}>
          ¿Todavía no tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </div>
    </div>
  );
}
