// Encabezado común de cada sección del panel.
export default function PanelHead({ title, text, children }) {
  return (
    <div className="dash-head">
      <div>
        <h1>{title}</h1>
        {text && <p className="muted" style={{ margin: '0.3rem 0 0', maxWidth: '60ch' }}>{text}</p>}
      </div>
      {children}
    </div>
  );
}
