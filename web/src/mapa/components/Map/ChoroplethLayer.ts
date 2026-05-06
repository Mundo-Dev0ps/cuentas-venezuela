import { GeoJsonLayer } from '@deck.gl/layers';
import type { Layer } from '@deck.gl/core';
import type { ObraPublica } from '../../types/obra';

interface GeoFeature {
  type: string;
  geometry: { type: string; coordinates: number[][][] | number[][][][] };
  properties: Record<string, string>;
}

function getFeatureName(feature: GeoFeature): string {
  return feature.properties.shapeName ?? feature.properties.name ?? '';
}

// Heat ramp: dark navy → orange → rose. Stops based on normalized [0,1] value.
function heatColor(t: number): [number, number, number, number] {
  // Clamp
  const x = Math.max(0, Math.min(1, t));
  if (x === 0) return [14, 38, 105, 0];
  // 0   → [14, 38, 105]   navy (territory base)
  // 0.4 → [180, 90, 40]   amber-rust
  // 0.8 → [240, 90, 60]   coral
  // 1   → [255, 30, 80]   rose-red
  let r: number, g: number, b: number;
  if (x < 0.4) {
    const k = x / 0.4;
    r = 14 + (180 - 14) * k;
    g = 38 + (90 - 38) * k;
    b = 105 + (40 - 105) * k;
  } else if (x < 0.8) {
    const k = (x - 0.4) / 0.4;
    r = 180 + (240 - 180) * k;
    g = 90 + (90 - 90) * k;
    b = 40 + (60 - 40) * k;
  } else {
    const k = (x - 0.8) / 0.2;
    r = 240 + (255 - 240) * k;
    g = 90 + (30 - 90) * k;
    b = 60 + (80 - 60) * k;
  }
  // Alpha eases in so empty states stay subtle
  const alpha = 50 + 130 * x;
  return [Math.round(r), Math.round(g), Math.round(b), Math.round(alpha)];
}

export function buildChoroplethLayer(
  states: object | null,
  obras: ObraPublica[],
): Layer | null {
  if (!states) return null;

  const totals = new Map<string, number>();
  for (const o of obras) {
    totals.set(o.estado_venezuela, (totals.get(o.estado_venezuela) ?? 0) + o.presupuesto_usd);
  }

  let max = 0;
  for (const v of totals.values()) if (v > max) max = v;
  if (max === 0) max = 1;

  return new GeoJsonLayer({
    id: 'ven-choropleth',
    data: states as never,
    filled: true,
    stroked: false,
    getFillColor: ((feat: GeoFeature) => {
      const name = getFeatureName(feat);
      const total = totals.get(name) ?? 0;
      return heatColor(total / max);
    }) as never,
    pickable: false,
    updateTriggers: {
      getFillColor: [obras.length, max],
    },
  });
}
