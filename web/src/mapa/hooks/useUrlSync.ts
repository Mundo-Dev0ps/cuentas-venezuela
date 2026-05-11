import { useEffect, useRef } from 'react';
import type { Estatus } from '../types/obra';

const VALID_ESTATUS: Estatus[] = ['paralizada', 'critica', 'inoperativa'];

export interface UrlState {
  yearRange: [number, number];
  selectedState: string | null;
  search: string;
  activeCategorias: Set<string>;
  activeEstatus: Set<Estatus>;
}

export function readUrlState(defaults: UrlState): UrlState {
  if (typeof window === 'undefined') return defaults;
  const p = new URLSearchParams(window.location.search);

  let yearRange = defaults.yearRange;
  const yr = p.get('year');
  if (yr) {
    const m = yr.match(/^(\d{4})-(\d{4})$/);
    if (m) {
      const a = Number(m[1]);
      const b = Number(m[2]);
      if (Number.isFinite(a) && Number.isFinite(b) && a <= b) yearRange = [a, b];
    }
  }

  return {
    yearRange,
    selectedState: p.get('estado') || null,
    search: p.get('q') || '',
    activeCategorias: new Set((p.get('cat') || '').split(',').filter(Boolean)),
    activeEstatus: new Set(
      (p.get('status') || '')
        .split(',')
        .filter((s): s is Estatus => VALID_ESTATUS.includes(s as Estatus)),
    ),
  };
}

export function useUrlSync(state: UrlState, defaults: UrlState): void {
  const timeoutRef = useRef<number | undefined>(undefined);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      const p = new URLSearchParams();
      const [y0, y1] = state.yearRange;
      const [d0, d1] = defaults.yearRange;
      if (y0 !== d0 || y1 !== d1) p.set('year', `${y0}-${y1}`);
      if (state.selectedState) p.set('estado', state.selectedState);
      if (state.search) p.set('q', state.search);
      if (state.activeCategorias.size) p.set('cat', Array.from(state.activeCategorias).join(','));
      if (state.activeEstatus.size) p.set('status', Array.from(state.activeEstatus).join(','));
      const qs = p.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }, 250);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state, defaults]);
}
