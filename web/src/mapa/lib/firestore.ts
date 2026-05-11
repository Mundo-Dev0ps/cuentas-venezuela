import type { ObraPublica } from '../types/obra';

export async function fetchAllObras(): Promise<ObraPublica[]> {
  try {
    const res = await fetch("/api/obras");
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
