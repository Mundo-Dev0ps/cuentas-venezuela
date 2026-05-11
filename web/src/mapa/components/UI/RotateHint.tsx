import { useEffect, useState, useCallback } from 'react';

interface RotateHintProps {
  view: 'data' | 'map';
  onToggle: () => void;
}

function useIsPortraitMobile(): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px) and (orientation: portrait)');
    const handler = () => setMatch(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return match;
}

/**
 * Try the standards-compliant path first: fullscreen + Screen Orientation
 * lock to landscape. Works on Chrome / Edge / most Android browsers.
 *
 * iOS Safari does NOT implement orientation.lock(), so we fall back to a
 * CSS transform that rotates the SPA root 90° within the existing portrait
 * viewport. The user keeps their phone vertical; the map renders sideways.
 */
function isOrientationLockSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const so = (screen as unknown as { orientation?: { lock?: unknown } }).orientation;
  return Boolean(so && typeof so.lock === 'function');
}

async function enterLandscape(): Promise<'native' | 'css'> {
  const root = document.documentElement;
  // Native path
  if (isOrientationLockSupported()) {
    try {
      if (!document.fullscreenElement && root.requestFullscreen) {
        await root.requestFullscreen();
      }
      const so = screen.orientation as unknown as {
        lock: (orientation: 'landscape' | 'landscape-primary') => Promise<void>;
      };
      await so.lock('landscape');
      return 'native';
    } catch {
      // fallthrough to CSS
    }
  }
  // CSS fallback — applied via body class so the SPA root rotates 90°.
  document.body.classList.add('mdo-force-landscape');
  return 'css';
}

async function exitLandscape(mode: 'native' | 'css' | null): Promise<void> {
  if (mode === 'native') {
    try {
      const so = screen.orientation as unknown as { unlock?: () => void };
      if (so && typeof so.unlock === 'function') so.unlock();
    } catch {
      /* noop */
    }
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {
        /* noop */
      }
    }
  }
  document.body.classList.remove('mdo-force-landscape');
}

export function RotateHint({ view, onToggle }: RotateHintProps) {
  const isPortraitMobile = useIsPortraitMobile();
  const [bannerOpen, setBannerOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [landscapeMode, setLandscapeMode] = useState<null | 'native' | 'css'>(null);

  // Show banner once per mount when starting in portrait + data view.
  useEffect(() => {
    if (hasShown) return;
    if (isPortraitMobile && view === 'data') {
      setBannerOpen(true);
      setHasShown(true);
    }
  }, [isPortraitMobile, view, hasShown]);

  // If user physically rotates phone or hits browser back, undo CSS rotation.
  useEffect(() => {
    if (!isPortraitMobile && landscapeMode === 'css') {
      document.body.classList.remove('mdo-force-landscape');
      setLandscapeMode(null);
    }
  }, [isPortraitMobile, landscapeMode]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      document.body.classList.remove('mdo-force-landscape');
    };
  }, []);

  const closeBanner = () => setBannerOpen(false);

  const handleRotate = useCallback(async () => {
    if (landscapeMode) {
      await exitLandscape(landscapeMode);
      setLandscapeMode(null);
    } else {
      const m = await enterLandscape();
      setLandscapeMode(m);
    }
    closeBanner();
  }, [landscapeMode]);

  return (
    <>
      {bannerOpen && (
        <div
          role="dialog"
          aria-label="Sugerencia para mejorar visualización"
          className="fixed inset-x-3 top-16 z-50 sm:hidden rounded-xl border border-cyan-400/40 bg-slate-900/95 backdrop-blur-md px-4 py-3 shadow-xl animate-ui-slide-down"
        >
          <div className="flex items-start gap-3">
            <span aria-hidden className="text-2xl leading-none mt-0.5">📱↻</span>
            <div className="flex-1 min-w-0">
              <p className="text-slate-100 text-sm font-semibold">
                Mapa más cómodo en horizontal
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                Toca «Rotar mapa» (sin girar el teléfono) o «Ver mapa»
                para ocultar paneles.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={handleRotate}
                  className="rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold px-3 py-1.5"
                >
                  ↺ Rotar mapa
                </button>
                <button
                  onClick={() => {
                    onToggle();
                    closeBanner();
                  }}
                  className="rounded-md border border-cyan-400/40 hover:border-cyan-400/80 text-cyan-200 text-xs px-3 py-1.5"
                >
                  Ver mapa
                </button>
                <button
                  onClick={closeBanner}
                  className="rounded-md border border-slate-600 hover:border-slate-400 text-slate-300 text-xs px-3 py-1.5"
                >
                  Cerrar
                </button>
              </div>
            </div>
            <button
              onClick={closeBanner}
              aria-label="Cerrar sugerencia"
              className="text-slate-500 hover:text-slate-200 text-lg leading-none w-6 h-6 flex items-center justify-center -mt-0.5"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Floating control: rotate (only on portrait mobile) */}
      <button
        type="button"
        onClick={handleRotate}
        aria-pressed={landscapeMode !== null}
        aria-label={landscapeMode ? 'Volver a vertical' : 'Rotar mapa a horizontal'}
        className="sm:hidden fixed bottom-40 right-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-orange-400/60 bg-slate-900/95 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-orange-200 shadow-xl ring-1 ring-orange-400/30"
      >
        <span aria-hidden className="text-base leading-none">↺</span>
        {landscapeMode ? 'Volver vertical' : 'Rotar mapa'}
      </button>

      {/* Floating control: data ↔ map (existing) */}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={view === 'map'}
        aria-label={view === 'map' ? 'Mostrar paneles de datos' : 'Ocultar paneles para ver el mapa'}
        className="sm:hidden fixed bottom-24 right-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/60 bg-slate-900/95 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-cyan-200 shadow-xl ring-1 ring-cyan-400/30"
      >
        <span aria-hidden className="text-base leading-none">{view === 'map' ? '☰' : '🗺'}</span>
        {view === 'map' ? 'Ver datos' : 'Ver mapa'}
      </button>
    </>
  );
}
