import type { ObraPublica } from '../../types/obra';
import { useCountUp } from '../../hooks/useCountUp';
import { downloadCSV } from '../../lib/csvExport';

interface HeroStatsProps {
  obras: ObraPublica[];
  selectedState: string | null;
  onClearState: () => void;
}

function formatUSD(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function HeroStats({ obras, selectedState, onClearState }: HeroStatsProps) {
  const total = obras.reduce((sum, o) => sum + o.presupuesto_usd, 0);
  const paralizadas = obras.filter(o => o.estatus === 'paralizada').length;

  const countAnim = useCountUp(obras.length);
  const totalAnim = useCountUp(total);
  const paraAnim = useCountUp(paralizadas);

  const handleExport = () => {
    const tag = selectedState ? selectedState.replace(/\s+/g, '_') : 'todas';
    downloadCSV(obras, `obras-${tag}-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="mdo-overlay mdo-overlay-stats absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-[calc(100vw-1rem)]">
      <div className="backdrop-blur-md bg-slate-900/80 border border-slate-700/50 rounded-xl px-3 sm:px-5 py-2 sm:py-3 shadow-xl animate-ui-slide-down">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="text-center min-w-0">
            <p className="text-orange-400 font-bold text-base sm:text-2xl leading-none font-mono">
              {Math.round(countAnim)}
            </p>
            <p className="text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-wider mt-0.5 sm:mt-1">obras</p>
          </div>
          <div className="w-px h-8 sm:h-10 bg-slate-700/60" />
          <div className="text-center min-w-0">
            <p className="text-rose-400 font-bold text-base sm:text-2xl leading-none font-mono">
              {formatUSD(totalAnim)} <span className="text-[10px] sm:text-xs text-rose-300/80">USD</span>
            </p>
            <p className="text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-wider mt-0.5 sm:mt-1 truncate">
              <span className="hidden sm:inline">presupuesto </span>perdido
            </p>
          </div>
          <div className="w-px h-8 sm:h-10 bg-slate-700/60" />
          <div className="text-center min-w-0">
            <p className="text-rose-300 font-bold text-base sm:text-2xl leading-none font-mono">
              {Math.round(paraAnim)}
            </p>
            <p className="text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-wider mt-0.5 sm:mt-1">paralizadas</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-slate-700/60" />
          <button
            onClick={handleExport}
            disabled={obras.length === 0}
            className="hidden sm:flex text-slate-300 hover:text-orange-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors text-xs font-semibold flex-col items-center gap-1"
            title="Descargar CSV con datos filtrados"
          >
            <span className="text-base leading-none">↓</span>
            <span className="text-[10px] uppercase tracking-wider">CSV</span>
          </button>
        </div>
        {selectedState && (
          <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between gap-3">
            <p className="text-amber-400 text-xs">
              <span className="text-slate-400">Filtrado:</span> {selectedState}
            </p>
            <button
              onClick={onClearState}
              className="text-slate-400 hover:text-slate-100 text-xs underline underline-offset-2"
            >
              Limpiar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
