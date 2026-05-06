import { GeoJsonLayer, TextLayer, PolygonLayer } from '@deck.gl/layers';
import type { Layer, PickingInfo } from '@deck.gl/core';

interface GeoFeature {
  type: string;
  geometry: { type: string; coordinates: number[][][] | number[][][][] };
  properties: Record<string, string>;
}

interface GeoFeatureCollection {
  type: string;
  features: GeoFeature[];
}

const WORLD_BG = [
  { polygon: [[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]] },
];

function polygonCentroid(coords: number[][][]): [number, number] {
  const ring = coords[0];
  const n = ring.length;
  let sumX = 0, sumY = 0;
  for (const [x, y] of ring) { sumX += x; sumY += y; }
  return [sumX / n, sumY / n];
}

function featureCentroid(feature: GeoFeature): [number, number] {
  const geom = feature.geometry;
  if (geom.type === 'Polygon') return polygonCentroid(geom.coordinates as number[][][]);
  const rings = geom.coordinates as number[][][][];
  const largest = rings.reduce((a, b) => (a[0].length >= b[0].length ? a : b));
  return polygonCentroid(largest);
}

function getFeatureName(feature: GeoFeature): string {
  return feature.properties.shapeName ?? feature.properties.name ?? '';
}

interface BuildOpts {
  selectedState?: string | null;
  onStateClick?: (name: string | null) => void;
}

export function buildHighlightLayers(
  boundary: object | null,
  states: object | null,
  opts: BuildOpts = {},
): Layer[] {
  const { selectedState = null, onStateClick } = opts;

  const stateLabels: { position: [number, number]; name: string }[] = [];
  if (states) {
    const col = states as GeoFeatureCollection;
    for (const feat of col.features) {
      const name = getFeatureName(feat);
      if (!name) continue;
      stateLabels.push({ position: featureCentroid(feat), name });
    }
  }

  return [
    // ── 1. World background
    new PolygonLayer({
      id: 'world-bg',
      data: WORLD_BG,
      getPolygon: d => d.polygon as [number, number][],
      getFillColor: [6, 16, 42],
      stroked: false,
      pickable: false,
    }),

    // ── 2. Territory fill (ADM0)
    ...(boundary
      ? [
          new GeoJsonLayer({
            id: 'ven-territory',
            data: boundary as never,
            filled: true,
            stroked: false,
            getFillColor: [14, 38, 105],
            pickable: false,
          }),
        ]
      : []),

    // ── 3. Selected state highlight (above territory, below borders)
    ...(states && selectedState
      ? [
          new GeoJsonLayer({
            id: 'ven-state-selected',
            data: {
              type: 'FeatureCollection',
              features: (states as GeoFeatureCollection).features.filter(
                f => getFeatureName(f) === selectedState,
              ),
            } as never,
            filled: true,
            stroked: true,
            getFillColor: [255, 170, 0, 55],
            getLineColor: [255, 200, 80, 220],
            lineWidthUnits: 'pixels' as const,
            getLineWidth: 1.5,
            lineJointRounded: true,
            pickable: false,
          }),
        ]
      : []),

    // ── 4. State borders + labels + invisible pick layer
    ...(states
      ? [
          new GeoJsonLayer({
            id: 'ven-states-border',
            data: states as never,
            filled: false,
            stroked: true,
            getLineColor: [80, 160, 220, 90],
            lineWidthUnits: 'pixels' as const,
            getLineWidth: 0.6,
            lineWidthMinPixels: 0.4,
            lineWidthMaxPixels: 1.0,
            lineJointRounded: true,
            pickable: false,
          }),
          // Invisible pickable layer for state click
          new GeoJsonLayer({
            id: 'ven-states-pick',
            data: states as never,
            filled: true,
            stroked: false,
            getFillColor: [0, 0, 0, 0],
            pickable: true,
            onClick: (info: PickingInfo) => {
              if (!onStateClick || !info.object) return false;
              const feat = info.object as GeoFeature;
              const name = getFeatureName(feat);
              if (name) {
                onStateClick(name === selectedState ? null : name);
                return true;
              }
              return false;
            },
          }),
          new TextLayer({
            id: 'ven-state-labels',
            data: stateLabels,
            getPosition: d => d.position,
            getText: d => d.name.toUpperCase(),
            getSize: d => (d.name === selectedState ? 13 : 11),
            getColor: d =>
              d.name === selectedState
                ? [255, 220, 130, 240]
                : [180, 220, 255, 140],
            getAngle: 0,
            getTextAnchor: 'middle',
            getAlignmentBaseline: 'center',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 700,
            sizeUnits: 'pixels',
            characterSet: 'auto',
            pickable: false,
            updateTriggers: {
              getSize: selectedState,
              getColor: selectedState,
            },
          }),
        ]
      : []),

    // ── 5. Country border — soft halo + crisp line
    ...(boundary
      ? [
          new GeoJsonLayer({
            id: 'ven-border-halo',
            data: boundary as never,
            filled: false,
            stroked: true,
            getLineColor: [0, 200, 255, 40],
            lineWidthUnits: 'pixels' as const,
            getLineWidth: 14,
            lineJointRounded: true,
            pickable: false,
          }),
          new GeoJsonLayer({
            id: 'ven-border-line',
            data: boundary as never,
            filled: false,
            stroked: true,
            getLineColor: [160, 235, 255, 255],
            lineWidthUnits: 'pixels' as const,
            getLineWidth: 1.5,
            lineJointRounded: true,
            pickable: false,
          }),
        ]
      : []),
  ];
}
