import shots from '../generated/shots.json'

type ShotMeta = { width: number; height: number; alt: string; focus?: { x: number; y: number } }
const table = shots as Record<string, ShotMeta>

export function hasShot(name: string): boolean {
  return name in table
}

/** Where the story's slow zoom leans in, as a CSS transform-origin (the shot's centre by default). */
export function shotOrigin(name: string): string {
  const f = table[name]?.focus ?? { x: 0.5, y: 0.5 }
  return `${Math.round(f.x * 100)}% ${Math.round(f.y * 100)}%`
}

export function Shot({ name, priority = false, className }: { name: string; priority?: boolean; className?: string }) {
  const meta = table[name]
  if (!meta) return null
  return (
    <picture className={className}>
      <source srcSet={`/shots/${name}.avif`} type="image/avif" />
      <img
        src={`/shots/${name}.webp`}
        width={meta.width}
        height={meta.height}
        alt={meta.alt}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
      />
    </picture>
  )
}
