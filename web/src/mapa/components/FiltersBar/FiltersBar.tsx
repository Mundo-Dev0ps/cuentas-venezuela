import { useMemo, useState } from 'react';
import type { Estatus, ObraPublica } from '../../types/obra';
import { STATUS_HEX } from '../../constants/colors';

const ESTATUS_OPTIONS: { key: Estatus; label: string }[] = [
  { key: 'paralizada', label: 'Paralizada' },
  { key: 'critica', label: 'Crítica' },
  { key: 'inoperativa', label: 'Inoperativa' },
];

interface FiltersBarProps {
  obras: ObraPublica[];
  search: string;
  activeCategorias: Set<string>;
  activeEstatus: Set<Estatus>;
  onSearchChange: (v: string) => void;
  onToggleCategoria: (c: string) => void;
  onToggleEstatus: (e: Estatus) => void;
  onClearAll: () => void;
}

export function FiltersBar({
  obras,
  search,
  activeCategorias,
  activeEstatus,
  onSearchChange,
  onToggleCategoria,
  onToggleEstatus,
  onClearAll,
}: FiltersBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const categorias = useMemo(() => {
    const set = new Set<string>();
    obras.forEach(o => set.add(o.categoria));
    return Array.from(set).sort();
  }, [obras]);

  const activeCount = (search ? 1 : 0) + activeCategorias.size + activeEstatus.size;
  const hasActive = activeCount > 0;

  const panel = (
    <div className="space-y-3">
      <div className="relative">
        <input
          id="search-input"
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar obra... (/)"
          className="w-full bg-slate-800/70 border border-slate-700/40 rounded-lg pl-8 pr-3 py-1.5 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/40"
        />
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 text-xs"
            aria-label="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>

      <div>
        <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-1.5">
          Estatus
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ESTATUS_OPTIONS.map(({ key, label }) => {
            const active = activeEstatus.has(key);
            const hex = STATUS_HEX[key];
            return (
              <button
                key={key}
                onClick={() => onToggleEstatus(key)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors border ${
                  active
                    ? 'bg-slate-700 border-slate-500 text-slate-100'
                    : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: hex,
                    boxShadow: active ? `0 0 6px ${hex}` : 'none',
                  }}
                />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {categorias.length > 0 && (
        <div>
          <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-1.5">
            Categoría
          </p>
          <div className="flex flex-wrap gap-1.5">
            {categorias.map(c => {
              const active = activeCategorias.has(c);
              return (
                <button
                  key={c}
                  onClick={() => onToggleCategoria(c)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors border ${
                    active
                      ? 'bg-orange-500/20 border-orange-400/60 text-orange-200'
                      : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasActive && (
        <button
          onClick={onClearAll}
          className="text-slate-400 hover:text-slate-100 text-[11px] underline underline-offset-2 transition-colors"
        >
          Limpiar todos los filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: always visible left panel */}
      <div className="hidden sm:block absolute top-4 left-4 z-20 w-72 animate-ui-slide-right animate-delay-100">
        <div className="backdrop-blur-md bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 shadow-xl">
          {panel}
        </div>
      </div>

      {/* Mobile: floating button + sheet */}
      <button
        onClick={() => setMobileOpen(true)}
        className="mdo-overlay mdo-overlay-filters sm:hidden fixed bottom-32 left-3 z-20 w-12 h-12 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/50 shadow-xl text-slate-100 flex items-center justify-center"
        aria-label="Abrir filtros"
      >
        <span className="text-lg">⚲</span>
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-slate-900 text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-end"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-full bg-slate-900 border-t border-slate-700/50 rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-200 text-sm font-semibold uppercase tracking-wider">Filtros</p>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-slate-400 hover:text-slate-100 text-2xl leading-none w-8 h-8 flex items-center justify-center"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            {panel}
          </div>
        </div>
      )}
    </>
  );
}
