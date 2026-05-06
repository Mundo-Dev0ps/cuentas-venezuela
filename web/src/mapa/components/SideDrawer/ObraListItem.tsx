import type { ObraPublica } from '../../types/obra';
import { STATUS_HEX } from '../../constants/colors';

interface ObraListItemProps {
  obra: ObraPublica;
  rank?: number;
  onClick: () => void;
}

function formatUSD(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function ObraListItem({ obra, rank, onClick }: ObraListItemProps) {
  const color = STATUS_HEX[obra.estatus];
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-slate-800/40 hover:bg-slate-800/70 transition-colors rounded-lg p-3 border border-slate-700/30 group"
    >
      <div className="flex items-start gap-3">
        {rank !== undefined && (
          <span className="text-slate-500 font-mono text-xs font-bold mt-0.5 w-5 shrink-0">
            #{rank}
          </span>
        )}
        <span
          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-slate-100 text-sm font-medium leading-tight group-hover:text-white truncate">
            {obra.nombre}
          </p>
          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-slate-500 text-xs truncate">
              {obra.estado_venezuela} · {obra.anio_inicio}
            </p>
            <p className="text-rose-400 font-mono text-xs font-semibold shrink-0">
              {formatUSD(obra.presupuesto_usd)} <span className="text-rose-300/70 text-[10px]">USD</span>
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
