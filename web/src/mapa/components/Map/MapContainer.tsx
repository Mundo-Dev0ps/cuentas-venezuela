import DeckGL from '@deck.gl/react';
import type { DeckGLProps } from '@deck.gl/react';
import { useState, useCallback } from 'react';
import type { MapViewState } from '@deck.gl/core';
import type { Layer } from '@deck.gl/core';
import { INITIAL_VIEW_STATE } from '../../lib/mapStyle';

const MIN_ZOOM = 5.5;
const MAX_ZOOM = 14;
const MAX_PITCH = 20;

// Includes Margarita (~11.0°N) so Nueva Esparta is reachable at zoom-in
const LNG_MIN = -71.5;
const LNG_MAX = -61.5;
const LAT_MIN = 2.0;
const LAT_MAX = 12.0;

interface MapContainerProps {
  layers: Layer[];
  onZoomChange?: (zoom: number) => void;
  getTooltip?: NonNullable<DeckGLProps['getTooltip']>;
}

export function MapContainer({ layers, onZoomChange, getTooltip }: MapContainerProps) {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

  const handleViewStateChange = useCallback<NonNullable<DeckGLProps['onViewStateChange']>>(
    ({ viewState: vs }) => {
      const clamped: MapViewState = {
        ...vs,
        longitude: Math.max(LNG_MIN, Math.min(LNG_MAX, vs.longitude ?? INITIAL_VIEW_STATE.longitude)),
        latitude: Math.max(LAT_MIN, Math.min(LAT_MAX, vs.latitude ?? INITIAL_VIEW_STATE.latitude)),
        zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, vs.zoom ?? INITIAL_VIEW_STATE.zoom)),
        pitch: Math.min(MAX_PITCH, vs.pitch ?? 0),
      };
      setViewState(clamped);
      onZoomChange?.(clamped.zoom);
    },
    [onZoomChange],
  );

  return (
    <DeckGL
      viewState={viewState}
      controller={{ dragPan: true, scrollZoom: true, touchZoom: true }}
      layers={layers}
      onViewStateChange={handleViewStateChange}
      getTooltip={getTooltip}
      onWebGLInitialized={(gl) => gl.clearColor(0.024, 0.063, 0.165, 1)}
      style={{ position: 'absolute', inset: '0' }}
    />
  );
}
