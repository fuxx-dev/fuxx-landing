export type Crop = { left: number; top: number; width: number; height: number }
export type ShotEntry = { shot: string; name: string; alt: string; width: number; crop?: Crop }
export const BUDGET: number
export function parseManifest(json: unknown): ShotEntry[]
export function outputPaths(name: string): { avif: string; webp: string }
export function overBudget(bytes: number, limit?: number): boolean
export function staleFiles(existing: string[], names: string[]): string[]
