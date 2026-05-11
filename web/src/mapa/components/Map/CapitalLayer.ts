import { TextLayer, IconLayer } from '@deck.gl/layers';
import type { Layer } from '@deck.gl/core';
import { VENEZUELA_CAPITALS, type Capital } from '../../data/capitals';

const SHOW_FROM_ZOOM = 6.5;

// Tiny star marker rendered as canvas data URL — visual anchor for capital
const STAR_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">` +
  `<path d="M12 2 L14.7 9 L22 9 L16 14 L18.5 22 L12 17 L5.5 22 L8 14 L2 9 L9.3 9 Z" ` +
  `fill="#ffd27a" stroke="#06102a" stroke-width="1"/></svg>`,
);
const STAR_URL = `data:image/svg+xml,${STAR_SVG}`;

export function buildCapitalLayers(zoom: number): Layer[] {
  if (zoom < SHOW_FROM_ZOOM) return [];

  // Fade-in opacity between threshold and threshold+1
  const opacity = Math.min(1, (zoom - SHOW_FROM_ZOOM) / 0.8);
  const labelAlpha = Math.round(220 * opacity);

  return [
    new IconLayer<Capital>({
      id: 'capital-markers',
      data: VENEZUELA_CAPITALS,
      getPosition: d => [d.lng, d.lat],
      getIcon: () => ({
        url: STAR_URL,
        width: 24,
        height: 24,
        anchorY: 12,
      }),
      getSize: 14,
      sizeUnits: 'pixels',
      pickable: false,
      opacity,
    }),
    new TextLayer<Capital>({
      id: 'capital-labels',
      data: VENEZUELA_CAPITALS,
      getPosition: d => [d.lng, d.lat],
      getText: d => d.capital,
      getSize: 10,
      getColor: [255, 220, 150, labelAlpha],
      getPixelOffset: [0, 14],
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'top',
      fontFamily: 'system-ui, sans-serif',
      fontWeight: 500,
      fontSettings: { sdf: true },
      outlineWidth: 2,
      outlineColor: [10, 18, 36, 220],
      sizeUnits: 'pixels',
      characterSet: 'auto',
      pickable: false,
    }),
  ];
}
