import { useMemo } from 'react';
import type { ObraPublica } from '../../types/obra';

interface TopStatesBarsProps {
  obras: ObraPublica[];
  onSelectState: (name: string) => void;
  limit?: number;
}

function formatUSD(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

interface StateAgg {
  name: string;
  total: number;
  count: number;
}

export function TopStatesBars({ obras, onSelectState, limit = 5 }: TopStatesBarsProps) {
  const top = useMemo<StateAgg[]>(() => {
    const map = new Map<string, StateAgg>();
    for (const o of obras) {
      const cur = map.get(o.estado_venezuela);
      if (cur) {
        cur.total += o.presupuesto_usd;
        cur.count += 1;
      } else {
        map.set(o.estado_venezuela, { name: o.estado_venezuela, total: o.presupuesto_usd, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, limit);
  }, [obras, limit]);

  if (top.length === 0) return null;

  const max = top[0].total;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-rose-400 text-xs uppercase tracking-widest font-medium">
        Top estados — presupuesto perdido (USD)
      </p>
      <div className="flex flex-col gap-1.5">
        {top.map((s, i) => {
          const pct = max > 0 ? (s.total / max) * 100 : 0;
          return (
            <button
              key={s.name}
              onClick={() => onSelectState(s.name)}
              className="group text-left bg-slate-800/40 hover:bg-slate-800/70 transition-colors rounded-md p-2 border border-slate-700/30"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-100 text-xs font-semibold flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-slate-500 font-mono w-4 shrink-0">#{i + 1}</span>
                  <span className="truncate">{s.name}</span>
                </span>
                <span className="text-rose-400 font-mono text-[11px] font-bold shrink-0 ml-2 whitespace-nowrap">
                  {formatUSD(s.total)}<span className="text-rose-300/70 text-[9px] ml-0.5">USD</span>
                </span>
              </div>
              <div className="relative h-1.5 bg-slate-900/60 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-orange-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-slate-500 text-[10px] mt-1">
                {s.count} {s.count === 1 ? 'obra' : 'obras'}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
