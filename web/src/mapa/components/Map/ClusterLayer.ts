import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import type { Layer } from '@deck.gl/core';
import type { ObraPublica, Estatus } from '../../types/obra';
import { STATUS_COLORS } from '../../constants/colors';

interface GeoFeature {
  type: string;
  geometry: { type: string; coordinates: number[][][] | number[][][][] };
  properties: Record<string, string>;
}

interface GeoFeatureCollection {
  type: string;
  features: GeoFeature[];
}

function polygonCentroid(coords: number[][][]): [number, number] {
  const ring = coords[0];
  let sumX = 0, sumY = 0;
  for (const [x, y] of ring) { sumX += x; sumY += y; }
  return [sumX / ring.length, sumY / ring.length];
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

interface Cluster {
  position: [number, number];
  state: string;
  count: number;
  total: number;
  dominantEstatus: Estatus;
}

export function buildClusterLayers(
  states: object | null,
  obras: ObraPublica[],
  onStateClick: (name: string) => void,
): Layer[] {
  if (!states) return [];

  const centroids = new Map<string, [number, number]>();
  for (const f of (states as GeoFeatureCollection).features) {
    const name = getFeatureName(f);
    if (name) centroids.set(name, featureCentroid(f));
  }

  // Aggregate per state
  const byState = new Map<string, { count: number; total: number; statusCounts: Record<Estatus, number> }>();
  for (const o of obras) {
    let agg = byState.get(o.estado_venezuela);
    if (!agg) {
      agg = { count: 0, total: 0, statusCounts: { paralizada: 0, critica: 0, inoperativa: 0 } };
      byState.set(o.estado_venezuela, agg);
    }
    agg.count += 1;
    agg.total += o.presupuesto_usd;
    agg.statusCounts[o.estatus] += 1;
  }

  const clusters: Cluster[] = [];
  for (const [state, agg] of byState) {
    const pos = centroids.get(state);
    if (!pos) continue;
    let dominantEstatus: Estatus = 'paralizada';
    let maxCount = 0;
    for (const [k, v] of Object.entries(agg.statusCounts) as [Estatus, number][]) {
      if (v > maxCount) { dominantEstatus = k; maxCount = v; }
    }
    clusters.push({ position: pos, state, count: agg.count, total: agg.total, dominantEstatus });
  }

  if (clusters.length === 0) return [];

  // Radius scaled by sqrt(count) so visual area ~ count
  const maxCount = clusters.reduce((m, c) => Math.max(m, c.count), 1);
  const radiusFor = (c: Cluster) => 6 + 10 * Math.sqrt(c.count / maxCount);

  return [
    new ScatterplotLayer<Cluster>({
      id: 'cluster-aura',
      data: clusters,
      getPosition: d => d.position,
      getRadius: d => radiusFor(d) * 1.4,
      getFillColor: d => [...STATUS_COLORS[d.dominantEstatus], 25] as [number, number, number, number],
      stroked: false,
      pickable: false,
      radiusUnits: 'pixels',
    }),
    new ScatterplotLayer<Cluster>({
      id: 'cluster-core',
      data: clusters,
      getPosition: d => d.position,
      getRadius: d => radiusFor(d),
      getFillColor: d => [...STATUS_COLORS[d.dominantEstatus], 200] as [number, number, number, number],
      getLineColor: [255, 255, 255, 230],
      stroked: true,
      lineWidthMinPixels: 1.5,
      pickable: true,
      radiusUnits: 'pixels',
      onClick: ({ object }) => {
        if (object) onStateClick(object.state);
      },
    }),
    new TextLayer<Cluster>({
      id: 'cluster-labels',
      data: clusters,
      getPosition: d => d.position,
      getText: d => String(d.count),
      getSize: 10,
      getColor: [10, 18, 36, 240],
      getAngle: 0,
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'center',
      fontFamily: 'system-ui, sans-serif',
      fontWeight: 700,
      sizeUnits: 'pixels',
      pickable: false,
    }),
  ];
}
