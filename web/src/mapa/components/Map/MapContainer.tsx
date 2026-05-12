import DeckGL from '@deck.gl/react';
import type { DeckGLProps } from '@deck.gl/react';
import { useState, useCallback, useEffect } from 'react';
import type { MapViewState } from '@deck.gl/core';
import type { Layer } from '@deck.gl/core';
import { INITIAL_VIEW_STATE } from '../../lib/mapStyle';

// Min zoom depends on viewport: phones need to fit more of Venezuela on
// screen (lower zoom = wider area). Recomputed on resize/orientation.
const MIN_ZOOM_DESKTOP = 5.5;
const MIN_ZOOM_MOBILE_PORTRAIT = 4.0;
const MIN_ZOOM_MOBILE_LANDSCAPE = 4.5;

const MAX_ZOOM = 14;
const MAX_PITCH = 20;

// Includes Margarita (~11.0°N) so Nueva Esparta is reachable at zoom-in
const LNG_MIN = -71.5;
const LNG_MAX = -61.5;
const LAT_MIN = 2.0;
const LAT_MAX = 12.0;

function computeMinZoom(): number {
  if (typeof window === 'undefined') return MIN_ZOOM_DESKTOP;
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 640) return MIN_ZOOM_MOBILE_PORTRAIT;          // mobile portrait
  if (h <= 500 && w < 1024) return MIN_ZOOM_MOBILE_LANDSCAPE; // rotated phone
  return MIN_ZOOM_DESKTOP;
}

function computeInitialZoom(): number {
  if (typeof window === 'undefined') return INITIAL_VIEW_STATE.zoom;
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Mobile portrait: zoom out so Venezuela fits well
  if (w < 640) return 5.2;
  // Rotated phone (landscape low height)
  if (h <= 500 && w < 1024) return 5.6;
  // Tablet portrait
  if (w < 1024) return 5.8;
  // Desktop
  return INITIAL_VIEW_STATE.zoom;
}

interface MapContainerProps {
  layers: Layer[];
  onZoomChange?: (zoom: number) => void;
  getTooltip?: NonNullable<DeckGLProps['getTooltip']>;
}

export function MapContainer({ layers, onZoomChange, getTooltip }: MapContainerProps) {
  const [viewState, setViewState] = useState<MapViewState>(() => ({
    ...INITIAL_VIEW_STATE,
    zoom: computeInitialZoom(),
  }));
  const [minZoom, setMinZoom] = useState<number>(() => computeMinZoom());

  // Re-evaluate min zoom when the viewport changes (resize, orientation, fullscreen).
  useEffect(() => {
    const onResize = () => setMinZoom(computeMinZoom());
    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const handleViewStateChange = useCallback<NonNullable<DeckGLProps['onViewStateChange']>>(
    ({ viewState: vs }) => {
      const clamped: MapViewState = {
        ...vs,
        longitude: Math.max(LNG_MIN, Math.min(LNG_MAX, vs.longitude ?? INITIAL_VIEW_STATE.longitude)),
        latitude: Math.max(LAT_MIN, Math.min(LAT_MAX, vs.latitude ?? INITIAL_VIEW_STATE.latitude)),
        zoom: Math.max(minZoom, Math.min(MAX_ZOOM, vs.zoom ?? INITIAL_VIEW_STATE.zoom)),
        pitch: Math.min(MAX_PITCH, vs.pitch ?? 0),
      };
      setViewState(clamped);
      onZoomChange?.(clamped.zoom);
    },
    [onZoomChange, minZoom],
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
