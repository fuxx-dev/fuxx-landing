/** The static ╭∩╮ neon: first paint, no-WebGL and reduced-motion hero. Paths from the logo master SVG. */
export function HeroFallback() {
  return (
    <svg className="hero__fallback" viewBox="200 380 624 330" role="img" aria-label="fuxx mascot">
      <defs>
        <filter id="hero-neon" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g fill="none" stroke="#00ff66" strokeLinecap="round" strokeLinejoin="round" strokeWidth="26" filter="url(#hero-neon)">
        <path d="M 350 468 L 297 468 A 60 60 0 0 0 237 528 L 237 670" />
        <path d="M 437 670 L 437 428 A 75 75 0 0 1 587 428 L 587 670" />
        <path d="M 674 468 L 727 468 A 60 60 0 0 1 787 528 L 787 670" />
      </g>
      <g fill="none" stroke="#d9ffe6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7">
        <path d="M 350 468 L 297 468 A 60 60 0 0 0 237 528 L 237 670" />
        <path d="M 437 670 L 437 428 A 75 75 0 0 1 587 428 L 587 670" />
        <path d="M 674 468 L 727 468 A 60 60 0 0 1 787 528 L 787 670" />
      </g>
    </svg>
  )
}
