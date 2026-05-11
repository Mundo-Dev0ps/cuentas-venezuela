import { useState, useEffect } from 'react';

interface PhotoGalleryProps {
  fotos: string[];
  alt: string;
}

export function PhotoGallery({ fotos, alt }: PhotoGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIdx(null);
      else if (e.key === 'ArrowRight' && activeIdx < fotos.length - 1)
        setActiveIdx(activeIdx + 1);
      else if (e.key === 'ArrowLeft' && activeIdx > 0)
        setActiveIdx(activeIdx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, fotos.length]);

  if (fotos.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-dashed border-slate-700/50 rounded-lg p-4 text-center">
        <p className="text-slate-500 text-xs italic">Sin fotografías disponibles</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {fotos.map((url, i) => (
          <button
            key={url + i}
            onClick={() => setActiveIdx(i)}
            className="relative aspect-video bg-slate-800/60 rounded-lg overflow-hidden group border border-slate-700/40 hover:border-orange-400/60 transition-colors"
          >
            <img
              src={url}
              alt={`${alt} - foto ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </button>
        ))}
      </div>

      {activeIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveIdx(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-orange-400"
            onClick={() => setActiveIdx(null)}
            aria-label="Cerrar"
          >
            ×
          </button>
          {activeIdx > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setActiveIdx(activeIdx - 1); }}
              className="absolute left-4 text-white text-4xl hover:text-orange-400 px-3"
              aria-label="Anterior"
            >
              ‹
            </button>
          )}
          <img
            src={fotos[activeIdx]}
            alt={`${alt} - foto ${activeIdx + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={e => e.stopPropagation()}
          />
          {activeIdx < fotos.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); setActiveIdx(activeIdx + 1); }}
              className="absolute right-4 text-white text-4xl hover:text-orange-400 px-3"
              aria-label="Siguiente"
            >
              ›
            </button>
          )}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-300 text-sm font-mono">
            {activeIdx + 1} / {fotos.length}
          </p>
        </div>
      )}
    </>
  );
}
