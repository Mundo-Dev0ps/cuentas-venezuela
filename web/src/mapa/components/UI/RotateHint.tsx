import { useEffect, useState } from 'react';

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

export function RotateHint({ view, onToggle }: RotateHintProps) {
  const isPortraitMobile = useIsPortraitMobile();
  const [bannerOpen, setBannerOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Show banner once per mount (when portrait+mobile and starting in data view).
  // Toggling map↔data within the same mount does not retrigger it.
  // Navigating away unmounts the component, so a fresh visit shows it again.
  useEffect(() => {
    if (hasShown) return;
    if (isPortraitMobile && view === 'data') {
      setBannerOpen(true);
      setHasShown(true);
    }
  }, [isPortraitMobile, view, hasShown]);

  const closeBanner = () => setBannerOpen(false);

  return (
    <>
      {bannerOpen && (
        <div
          role="dialog"
          aria-label="Sugerencia de rotación"
          className="fixed inset-x-3 top-16 z-50 sm:hidden rounded-xl border border-cyan-400/40 bg-slate-900/95 backdrop-blur-md px-4 py-3 shadow-xl animate-ui-slide-down"
        >
          <div className="flex items-start gap-3">
            <span aria-hidden className="text-2xl leading-none mt-0.5">📱↻</span>
            <div className="flex-1 min-w-0">
              <p className="text-slate-100 text-sm font-semibold">
                Rota tu teléfono
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                El mapa se ve mejor en horizontal. O toca «Ver mapa»
                para ocultar paneles.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    onToggle();
                    closeBanner();
                  }}
                  className="rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold px-3 py-1.5"
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
