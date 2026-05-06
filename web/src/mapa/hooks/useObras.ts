import { useState, useEffect, useMemo } from 'react';
import { fetchAllObras, filterByYearRange } from '../lib/firestore';
import type { ObraPublica } from '../types/obra';

export function useObras(initialYearRange: [number, number] = [1999, 2026]) {
  const [obras, setObras] = useState<ObraPublica[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearRange, setYearRange] = useState<[number, number]>(initialYearRange);

  useEffect(() => {
    let mounted = true;
    fetchAllObras()
      .then(data => { if (mounted) setObras(data); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filteredObras = useMemo(
    () => filterByYearRange(obras, yearRange),
    [obras, yearRange],
  );

  return { obras, filteredObras, loading, yearRange, setYearRange };
}
