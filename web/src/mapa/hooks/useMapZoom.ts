import { useState, useCallback } from 'react';

export function useMapZoom(initialZoom = 5.5) {
  const [zoom, setZoom] = useState(initialZoom);
  const handleZoomChange = useCallback((z: number) => setZoom(z), []);
  return { zoom, handleZoomChange };
}
