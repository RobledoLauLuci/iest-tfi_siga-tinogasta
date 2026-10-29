import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services';
import { isEmail, validatePassword } from '../utils/validators';

export default function Register() {
  useDocumentTitle('Registrarse', 'Creá tu cuenta de artista en SIGA y publicá tus obras, talleres y eventos.');
  const { signUp, isLoggedIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '', accept: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(false);

  if (isLoggedIn && !pending) return <Navigate to="/panel" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    const found = {};
    if (form.fullName.trim().length < 2) found.fullName = 'Ingresá tu nombre completo.';
    if (!isEmail(form.email)) found.email = 'Ingresá un correo válido.';
    const pw = validatePassword(form.password);
    if (pw) found.password = pw;
    if (form.confirm !== form.password) found.confirm = 'Las contraseñas no coinciden.';
    if (!form.accept) found.accept = 'Tenés que aceptar para crear la cuenta.';
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const result = await signUp({ email: form.email, password: form.password, fullName: form.fullName });
      if (result.needsConfirmation) {
        setPending(true);
      } else {
        toast.success('¡Cuenta creada! Completá tu perfil para que te conozcan.');
        navigate('/panel/perfil', { replace: true });
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (pending) {
    return (
      <div className="container auth-wrap">
        <div className="form-card auth-card center">
          <h1 style={{ fontSize: '1.9rem' }}>Revisá tu correo</h1>
          <p>Te enviamos un enlace para confirmar tu cuenta a <strong>{form.email}</strong>. Después de confirmarla, podés iniciar sesión.</p>
          <Link className="btn" to="/ingresar">Ir a iniciar sesión</Link>
        </div>
      </div>
    );
  }

  const Err = ({ k }) => (errors[k] ? <div className="error" role="alert">{errors[k]}</div> : null);

  return (
    <div className="container auth-wrap">
      <div className="form-card auth-card">
        <div className="brand-top">
          <img src="/logo-siga.png" alt="" width="92" height="92" />
          <h1 style={{ fontSize: '1.9rem', margin: 0 }}>Sumate a SIGA</h1>
          <p className="muted" style={{ margin: '0.3rem 0 0' }}>Creá tu cuenta de artista. Es gratis.</p>
        </div>
        {api.mode === 'local' && (
          <div className="alert alert-info" role="note" style={{ marginBottom: '1rem' }}>
            <strong>Modo prototipo.</strong> Los datos se guardan solo en este navegador. La primera cuenta creada será la
            administradora.
          </div>
        )}
        <form className="form" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="r-name">Nombre completo <span className="req">*</span></label>
            <input id="r-name" className="input" autoComplete="name" value={form.fullName} aria-invalid={errors.fullName ? 'true' : undefined} onChange={set('fullName')} />
            <Err k="fullName" />
          </div>
          <div className="field">
            <label htmlFor="r-email">Correo electrónico <span className="req">*</span></label>
            <input id="r-email" className="input" type="email" autoComplete="email" value={form.email} aria-invalid={errors.email ? 'true' : undefined} onChange={set('email')} />
            <span className="hint">Es privado: solo lo usamos para tu cuenta.</span>
            <Err k="email" />
          </div>
          <div className="field">
            <label htmlFor="r-pass">Contraseña <span className="req">*</span></label>
            <input id="r-pass" className="input" type="password" autoComplete="new-password" value={form.password} aria-invalid={errors.password ? 'true' : undefined} onChange={set('password')} />
            <span className="hint">Mínimo 8 caracteres, con letras y al menos un número.</span>
            <Err k="password" />
          </div>
          <div className="field">
            <label htmlFor="r-conf">Repetir contraseña <span className="req">*</span></label>
            <input id="r-conf" className="input" type="password" autoComplete="new-password" value={form.confirm} aria-invalid={errors.confirm ? 'true' : undefined} onChange={set('confirm')} />
            <Err k="confirm" />
          </div>
          <div className="field">
            <label className="check">
              <input type="checkbox" checked={form.accept} onChange={set('accept')} />
              <span>Soy artista visual de Tinogasta y me comprometo a publicar solo contenido propio y a respetar a la comunidad.</span>
            </label>
            <Err k="accept" />
          </div>
          {formError && <div className="alert alert-error" role="alert">{formError}</div>}
          <button className="btn btn-block" type="submit" disabled={busy}>{busy ? 'Creando cuenta…' : 'Crear mi cuenta'}</button>
        </form>
        <p className="center mt" style={{ marginBottom: 0 }}>
          ¿Ya tenés cuenta? <Link to="/ingresar">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}
