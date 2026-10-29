import { useId, useMemo, useState } from 'react';
import { splitList } from '../../utils/format';
import { validateForm } from '../../utils/validators';
import ImageUploader from './ImageUploader';

// Formulario generado a partir de una lista de campos. Se reutiliza para obras, talleres,
// eventos, perfil, grupos y fotografías: una sola lógica de validación y de errores.

function toInitial(fields, initial = {}) {
  const values = {};
  for (const f of fields) {
    const v = initial[f.name];
    if (f.type === 'tags') values[f.name] = Array.isArray(v) ? v.join(', ') : v || '';
    else if (f.type === 'checkbox') values[f.name] = v ?? f.default ?? false;
    else if (f.type === 'checkgroup' || f.type === 'images') values[f.name] = Array.isArray(v) ? v : [];
    else if (f.type === 'image') values[f.name] = v || '';
    else values[f.name] = v ?? f.default ?? '';
  }
  return values;
}

function toPayload(fields, values) {
  const out = {};
  for (const f of fields) {
    if (f.transient || (f.showIf && !f.showIf(values))) continue;
    const v = values[f.name];
    if (f.type === 'tags') out[f.name] = splitList(v);
    else if (f.type === 'number') out[f.name] = v === '' || v === null ? null : Number(v);
    else if (f.type === 'date') out[f.name] = v || null;
    else if (typeof v === 'string') out[f.name] = v.trim();
    else out[f.name] = v;
  }
  return out;
}

function FieldControl({ field, value, error, onChange, describedBy }) {
  const id = useId();
  const common = {
    id,
    name: field.name,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': field.hint ? describedBy : undefined,
  };

  let control;
  switch (field.type) {
    case 'textarea':
      control = (
        <textarea
          {...common}
          className="textarea"
          value={value}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case 'select':
      control = (
        <select {...common} className="select" value={value} onChange={(e) => onChange(e.target.value)}>
          {!field.required && <option value="">—</option>}
          {field.options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
      );
      break;
    case 'checkbox':
      return (
        <div className={`field ${field.full ? 'full' : ''}`}>
          <label className="check">
            <input
              type="checkbox"
              name={field.name}
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              aria-describedby={field.hint ? describedBy : undefined}
            />
            <span>
              {field.label}
              {field.required && <span className="req"> *</span>}
            </span>
          </label>
          {field.hint && (
            <div className="hint" id={describedBy}>
              {field.hint}
            </div>
          )}
          {error && <div className="error" role="alert">{error}</div>}
        </div>
      );
    case 'checkgroup':
      return (
        <div className={`field ${field.full ? 'full' : ''}`} role="group" aria-labelledby={`${id}-l`}>
          <span className="label" id={`${id}-l`}>
            {field.label}
            {field.required && <span className="req"> *</span>}
          </span>
          <div className="check-group">
            {field.options.map((o) => (
              <label className="check" key={o.value}>
                <input
                  type="checkbox"
                  checked={value.includes(o.value)}
                  onChange={(e) =>
                    onChange(e.target.checked ? [...value, o.value] : value.filter((x) => x !== o.value))
                  }
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          {error && <div className="error" role="alert">{error}</div>}
        </div>
      );
    case 'image':
    case 'images':
      return (
        <div className={`field ${field.full ? 'full' : ''}`}>
          <span className="label">
            {field.label}
            {field.required && <span className="req"> *</span>}
          </span>
          <ImageUploader
            value={value}
            onChange={(v) => onChange(field.type === 'image' ? v[0] || '' : v)}
            multiple={field.type === 'images'}
            max={field.max || 6}
            folder={field.folder || 'obras'}
          />
          {field.hint && <div className="hint">{field.hint}</div>}
          {error && <div className="error" role="alert">{error}</div>}
        </div>
      );
    default:
      control = (
        <input
          {...common}
          className="input"
          type={field.type === 'tags' ? 'text' : field.type || 'text'}
          value={value}
          min={field.min}
          max={field.max}
          step={field.step}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          inputMode={field.type === 'tel' ? 'tel' : field.type === 'number' ? 'decimal' : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }

  return (
    <div className={`field ${field.full ? 'full' : ''}`}>
      <label htmlFor={id}>
        {field.label}
        {field.required && <span className="req"> *</span>}
      </label>
      {control}
      {field.hint && (
        <div className="hint" id={describedBy}>
          {field.hint}
        </div>
      )}
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default function ResourceForm({ fields, initial, onSubmit, submitLabel = 'Guardar', onCancel, notice }) {
  const [values, setValues] = useState(() => toInitial(fields, initial));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const formId = useId();

  const visible = useMemo(() => fields.filter((f) => !f.showIf || f.showIf(values)), [fields, values]);

  function setValue(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const found = validateForm(fields, values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError('Revisá los campos marcados antes de guardar.');
      const first = Object.keys(found)[0];
      document.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await onSubmit(toPayload(fields, values));
    } catch (err) {
      setFormError(err.message || 'No se pudo guardar. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {notice}
      <div className="form-grid">
        {visible.map((f) => (
          <FieldControl
            key={f.name}
            field={f}
            value={values[f.name]}
            error={errors[f.name]}
            describedBy={`${formId}-${f.name}-hint`}
            onChange={(v) => setValue(f.name, v)}
          />
        ))}
      </div>
      {formError && (
        <div className="alert alert-error" role="alert">
          {formError}
        </div>
      )}
      <div className="form-actions">
        <button className="btn" type="submit" disabled={saving}>
          {saving ? 'Guardando…' : submitLabel}
        </button>
        {onCancel && (
          <button className="btn btn-ghost" type="button" onClick={onCancel} disabled={saving}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
