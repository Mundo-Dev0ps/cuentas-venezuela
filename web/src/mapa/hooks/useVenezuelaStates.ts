import { useEffect, useState } from 'react';

export function useVenezuelaStates() {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/mapa-del-olvido/data/venezuela-states.geojson')
      .then(r => r.json())
      .then((json: object) => setData(json))
      .catch(() => {});
  }, []);

  return data;
}
