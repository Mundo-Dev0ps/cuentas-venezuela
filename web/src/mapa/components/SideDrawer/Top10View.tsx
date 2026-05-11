import type { ObraPublica } from '../../types/obra';
import { ObraListItem } from './ObraListItem';
import { TopStatesBars } from './TopStatesBars';
import { AggregateImpact } from './AggregateImpact';

interface Top10ViewProps {
  obras: ObraPublica[];
  onSelectObra: (obra: ObraPublica) => void;
  onSelectState: (name: string) => void;
}

export function Top10View({ obras, onSelectObra, onSelectState }: Top10ViewProps) {
  const top10 = [...obras]
    .sort((a, b) => b.presupuesto_usd - a.presupuesto_usd)
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-5">
      <TopStatesBars obras={obras} onSelectState={onSelectState} />

      <div className="border-t border-slate-700/40 pt-5">
        <p className="text-rose-400 text-xs uppercase tracking-widest font-medium mb-1">Ranking</p>
        <h2 className="text-slate-100 font-bold text-xl leading-tight">
          Top 10 más costosas
        </h2>
        <p className="text-slate-400 text-xs mt-1 mb-3">
          Obras inconclusas con mayor presupuesto
        </p>

        {top10.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No hay obras para mostrar.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {top10.map((o, i) => (
              <ObraListItem
                key={o.id}
                obra={o}
                rank={i + 1}
                onClick={() => onSelectObra(o)}
              />
            ))}
          </div>
        )}
      </div>

      <AggregateImpact obras={obras} scopeLabel="" />

      <p className="text-slate-500 text-[11px] italic">
        Tip: clic en un estado del mapa o en su barra para filtrar.
      </p>
    </div>
  );
}
