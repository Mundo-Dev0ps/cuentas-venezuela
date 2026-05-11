import type { ObraPublica } from '../../types/obra';
import { ObraListItem } from './ObraListItem';
import { AggregateImpact } from './AggregateImpact';

interface StateViewProps {
  stateName: string;
  obras: ObraPublica[];
  onSelectObra: (obra: ObraPublica) => void;
}

function formatUSD(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function StateView({ stateName, obras, onSelectObra }: StateViewProps) {
  const total = obras.reduce((sum, o) => sum + o.presupuesto_usd, 0);
  const paralizadas = obras.filter(o => o.estatus === 'paralizada').length;
  const sorted = [...obras].sort((a, b) => b.presupuesto_usd - a.presupuesto_usd);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-amber-400 text-xs uppercase tracking-widest font-medium mb-1">Estado</p>
        <h2 className="text-slate-100 font-bold text-2xl leading-tight">{stateName}</h2>
      </div>

      <div className="bg-slate-800/60 rounded-lg p-3 min-w-0">
        <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Presupuesto total perdido</p>
        <p className="text-rose-400 font-mono font-bold text-2xl leading-none truncate" title={`${total.toLocaleString('es-VE')} USD`}>
          {formatUSD(total)} <span className="text-rose-300/80 text-sm">USD</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/60 rounded-lg p-2.5 text-center">
          <p className="text-orange-400 font-mono font-bold text-lg leading-none">{obras.length}</p>
          <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">obras</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-2.5 text-center">
          <p className="text-rose-300 font-mono font-bold text-lg leading-none">{paralizadas}</p>
          <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">paralizadas</p>
        </div>
      </div>

      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">
          Obras por presupuesto
        </p>
        {sorted.length === 0 ? (
          <p className="text-slate-500 text-sm italic">Sin obras registradas en este estado.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sorted.map(o => (
              <ObraListItem key={o.id} obra={o} onClick={() => onSelectObra(o)} />
            ))}
          </div>
        )}
      </div>

      <AggregateImpact obras={obras} scopeLabel={`en ${stateName}`} />
    </div>
  );
}
