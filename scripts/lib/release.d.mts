export type Release = { version: string; zipUrl: string; publishedAt: string | null }
export const FALLBACK: Release
export function pickRelease(json: unknown): Release
