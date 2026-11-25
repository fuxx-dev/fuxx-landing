import './logo-mark.css'

/**
 * The ╭∩╮ mark as one stroked SVG path: the left hook, the arch and the right hook from fuxx-cli's logo
 * master SVG (the same strokes as the hero's neon, src/hero/mascot.ts). `currentColor`, so it takes the
 * text colour; `.logo-mark__path` is what the intro and the close section draw.
 */
export const LOGO_PATH =
  'M 350 468 L 297 468 A 60 60 0 0 0 237 528 L 237 670 ' +
  'M 437 670 L 437 428 A 75 75 0 0 1 587 428 L 587 670 ' +
  'M 674 468 L 727 468 A 60 60 0 0 1 787 528 L 787 670'

export function LogoMark({ draw = false, className = '' }: { draw?: boolean; className?: string }) {
  return (
    <svg
      className={`logo-mark ${draw ? 'logo-mark--draw' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      viewBox="205 321 614 381"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="logo-mark__path"
        d={LOGO_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="50"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
