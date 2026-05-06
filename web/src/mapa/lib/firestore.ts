import type { ObraPublica } from '../types/obra';

// API base: empty string in integration mode (same-origin via Next rewrite),
// otherwise full URL set via VITE_API_URL for standalone dev.
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export async function fetchAllObras(): Promise<ObraPublica[]> {
  try {
    const res = await fetch(`${API_BASE}/api/obras`);
    if (!res.ok) {
      console.error('[fetchAllObras] API returned', res.status);
      return [];
    }
    return (await res.json()) as ObraPublica[];
  } catch (err) {
    console.error('[fetchAllObras] API fetch failed:', err);
    return [];
  }
}

export function filterByYearRange(
  obras: ObraPublica[],
  [min, max]: [number, number],
): ObraPublica[] {
  return obras.filter(o => o.anio_inicio >= min && o.anio_inicio <= max);
}
