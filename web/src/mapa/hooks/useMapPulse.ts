import { useState, useEffect } from 'react';

export function useMapPulse(): boolean {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setExpanded(v => !v), 1000);
    return () => clearInterval(id);
  }, []);
  return expanded;
}
