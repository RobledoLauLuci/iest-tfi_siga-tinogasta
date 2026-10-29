// Composición abstracta con la paleta oficial. Se usa SOLO cuando una publicación todavía no tiene foto.
// No simula obras reales: es un fondo decorativo determinista según el id.

const COLORS = ['#d38e8e', '#b390a7', '#8aaaaa', '#d3aa84', '#e5a855'];

function hash(str = '') {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export default function ArtPlaceholder({ seed = 'siga', label = '' }) {
  const h = hash(seed);
  const pick = (n) => COLORS[(h >> n) % COLORS.length];
  const a = pick(1);
  const b = pick(3);
  const c = pick(5);
  const r1 = (h % 30) - 15;
  const r2 = ((h >> 4) % 30) - 15;
  const id = `rough-${h}`;
  return (
    <svg viewBox="0 0 400 340" role="img" aria-label={label || 'Composición de color sin fotografía'} preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={h % 50} />
          <feDisplacementMap in="SourceGraphic" scale="14" />
        </filter>
      </defs>
      <rect width="400" height="340" fill="#fbf5ed" />
      <g filter={`url(#${id})`} opacity="0.92">
        <rect x="-40" y="40" width="380" height="90" rx="45" fill={a} transform={`rotate(${r1} 200 85)`} />
        <rect x="60" y="130" width="380" height="80" rx="40" fill={b} transform={`rotate(${r2} 200 170)`} />
        <rect x="-30" y="220" width="360" height="70" rx="35" fill={c} transform={`rotate(${-r1} 200 255)`} />
      </g>
      <circle cx={80 + (h % 240)} cy={60 + ((h >> 3) % 200)} r="4" fill="#e5a855" />
      <circle cx={60 + ((h >> 5) % 280)} cy={90 + ((h >> 2) % 160)} r="2.5" fill="#e5a855" />
    </svg>
  );
}
