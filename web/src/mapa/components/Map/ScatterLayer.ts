import { ScatterplotLayer } from '@deck.gl/layers';
import type { ObraPublica, Estatus } from '../../types/obra';
import { STATUS_COLORS } from '../../constants/colors';

const MIN_RADIUS = 2.5;
const MAX_RADIUS = 7;
const MAX_LOG = Math.log10(1_000_000_000);

export function getRadius(obra: ObraPublica): number {
  const log = Math.log10(Math.max(obra.presupuesto_usd, 1));
  return MIN_RADIUS + (log / MAX_LOG) * (MAX_RADIUS - MIN_RADIUS);
}

export function getStatusRGB(estatus: Estatus): [number, number, number] {
  return STATUS_COLORS[estatus];
}

export function buildScatterLayers(
  obras: ObraPublica[],
  onObraClick: (obra: ObraPublica) => void,
  pulseExpanded: boolean,
  opacity = 1,
): ScatterplotLayer[] {
  // Aura: bigger swing for visible heartbeat
  const auraScale = pulseExpanded ? 5.0 : 1.8;
  const auraAlpha = pulseExpanded ? 6 : 50;
  // Glow: pulses moderately
  const glowScale = pulseExpanded ? 2.4 : 1.2;
  const glowAlpha = pulseExpanded ? 30 : 110;

  const triggers = { getRadius: obras.length, getFillColor: obras.length };
  const pulseKey = `${obras.length}-${String(pulseExpanded)}`;

  return [
    // outer aura — large pulse, alpha modulates
    new ScatterplotLayer<ObraPublica>({
      id: 'scatter-aura',
      data: obras,
      getPosition: d => [d.coordenadas.lng, d.coordenadas.lat],
      getRadius: d => getRadius(d) * auraScale,
      getFillColor: d => [...getStatusRGB(d.estatus), auraAlpha] as [number, number, number, number],
      stroked: false,
      pickable: false,
      radiusUnits: 'pixels',
      opacity,
      transitions: { getRadius: { duration: 850 }, getFillColor: { duration: 850 }, opacity: { duration: 800 } },
      updateTriggers: { getRadius: pulseKey, getFillColor: pulseKey },
    }),
    // glow ring — also pulses, smaller range
    new ScatterplotLayer<ObraPublica>({
      id: 'scatter-glow',
      data: obras,
      getPosition: d => [d.coordenadas.lng, d.coordenadas.lat],
      getRadius: d => getRadius(d) * glowScale,
      getFillColor: d => [...getStatusRGB(d.estatus), glowAlpha] as [number, number, number, number],
      stroked: false,
      pickable: false,
      radiusUnits: 'pixels',
      opacity,
      transitions: { getRadius: { duration: 850 }, getFillColor: { duration: 850 }, opacity: { duration: 800 } },
      updateTriggers: { getRadius: pulseKey, getFillColor: pulseKey },
    }),
    // halo ring — static
    new ScatterplotLayer<ObraPublica>({
      id: 'scatter-halo',
      data: obras,
      getPosition: d => [d.coordenadas.lng, d.coordenadas.lat],
      getRadius: d => getRadius(d) * 1.2,
      getFillColor: d => [...getStatusRGB(d.estatus), 120] as [number, number, number, number],
      stroked: false,
      pickable: false,
      radiusUnits: 'pixels',
      opacity,
      transitions: { getRadius: { duration: 600 }, getFillColor: { duration: 600 } },
      updateTriggers: triggers,
    }),
    // core — solid + white stroke
    new ScatterplotLayer<ObraPublica>({
      id: 'scatter-core',
      data: obras,
      getPosition: d => [d.coordenadas.lng, d.coordenadas.lat],
      getRadius: d => getRadius(d),
      getFillColor: d => [...getStatusRGB(d.estatus), 255] as [number, number, number, number],
      getLineColor: [255, 255, 255, 230],
      stroked: true,
      lineWidthMinPixels: 1,
      pickable: true,
      radiusUnits: 'pixels',
      opacity,
      transitions: {
        opacity: { duration: 800 },
        getRadius: { duration: 600 },
        getFillColor: { duration: 600 },
      },
      onClick: ({ object }) => object && onObraClick(object),
      updateTriggers: { ...triggers, getLineColor: obras.length },
    }),
  ];
}
