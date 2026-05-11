import { useEffect, useState } from 'react';

export function useVenezuelaBoundary() {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/mapa-del-olvido/data/venezuela.geojson')
      .then(r => r.json())
      .then((json: object) => setData(json))
      .catch(() => {});
  }, []);

  return data;
}
