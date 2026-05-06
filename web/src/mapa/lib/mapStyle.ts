import type { StyleSpecification } from 'maplibre-gl';

export const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'esri-dark': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: '© Esri, HERE, Garmin, © OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'esri-dark-layer',
      type: 'raster',
      source: 'esri-dark',
      paint: {
        'raster-brightness-max': 0.85,
        'raster-contrast': 0.2,
        'raster-saturation': -0.5,
      },
    },
  ],
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
};

export const INITIAL_VIEW_STATE = {
  longitude: -66.2,
  latitude: 6.8,
  zoom: 6.3,
  pitch: 0,
  bearing: 0,
};

// Venezuela bounding box
export const VENEZUELA_BOUNDS: [[number, number], [number, number]] = [
  [-74.5, -0.5],
  [-58.5, 13.5],
];
