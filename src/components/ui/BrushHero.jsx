import Media from './Media';

// Composición del héroe: pinceladas con la paleta oficial + el logotipo, sin modificarlo.
// Si ya hay obras con fotografía, dos de ellas se asoman como cuadros sobre la composición.
export default function BrushHero({ photos = [] }) {
  return (
    <div className="hero-art" aria-hidden={photos.length === 0 ? 'true' : undefined}>
      <svg viewBox="0 0 540 540" aria-hidden="true">
        <defs>
          <filter id="hero-rough" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="22" />
          </filter>
        </defs>
        <g filter="url(#hero-rough)" fill="none" strokeLinecap="round" opacity="0.95">
          <path d="M30 120 C150 40, 320 70, 500 40" stroke="#d38e8e" strokeWidth="64" />
          <path d="M60 230 C200 160, 330 250, 510 170" stroke="#b390a7" strokeWidth="56" />
          <path d="M20 380 C160 300, 340 420, 520 320" stroke="#8aaaaa" strokeWidth="60" />
          <path d="M70 490 C220 430, 330 520, 500 450" stroke="#d3aa84" strokeWidth="50" />
        </g>
        <g fill="#e5a855">
          <circle cx="60" cy="70" r="5" />
          <circle cx="480" cy="110" r="4" />
          <circle cx="505" cy="270" r="6" />
          <circle cx="30" cy="300" r="4" />
          <circle cx="455" cy="500" r="5" />
          <circle cx="110" cy="520" r="3.5" />
          <circle cx="280" cy="20" r="3.5" />
        </g>
      </svg>
      <div className="hero-logo">
        <img src="/logo-siga.png" alt="Logotipo de SIGA, proyecto de arte" width="512" height="512" fetchpriority="high" />
      </div>
      {photos[0] && (
        <div className="hero-frame f1">
          <Media src={photos[0].images?.[0]} alt={photos[0].title} seed={photos[0].id} />
        </div>
      )}
      {photos[1] && (
        <div className="hero-frame f2">
          <Media src={photos[1].images?.[0]} alt={photos[1].title} seed={photos[1].id} />
        </div>
      )}
    </div>
  );
}
