import type { ObraPublica } from '../../types/obra';
import { calculateImpact } from './ImpactCalculator';

interface AggregateImpactProps {
  obras: ObraPublica[];
  scopeLabel: string;
}

export function AggregateImpact({ obras, scopeLabel }: AggregateImpactProps) {
  const total = obras.reduce((sum, o) => sum + o.presupuesto_usd, 0);
  if (total === 0) return null;
  const impact = calculateImpact(total);

  const items = [
    { icon: '🏫', count: impact.schools, label: 'escuelas primarias' },
    { icon: '🏥', count: impact.hospitals, label: 'hospitales comunitarios' },
    { icon: '🎓', count: impact.universities, label: 'universidades públicas' },
    { icon: '💧', count: impact.waterPlants, label: 'plantas potabilizadoras' },
    { icon: '⚡', count: impact.electricPlants, label: 'plantas eléctricas' },
  ].filter(i => i.count > 0);

  if (items.length === 0) return null;

  return (
    <div className="space-y-2 border-t border-slate-700/40 pt-4 mt-2">
      <p className="text-slate-500 text-[10px] uppercase tracking-widest">
        Con este dinero {scopeLabel} pudo construirse en su lugar
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2 px-2 py-1.5">
            <span className="text-base opacity-70" role="img" aria-hidden="true">{item.icon}</span>
            <div className="min-w-0">
              <p className="text-slate-300 font-mono text-sm leading-none">
                {item.count.toLocaleString('es-VE')}
              </p>
              <p className="text-slate-500 text-[9px] leading-tight mt-0.5">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-slate-600 text-[9px] italic">
        Costos referenciales en{' '}
        <a href="/metodologia" className="text-slate-500 hover:text-orange-400 underline underline-offset-2">
          /metodologia
        </a>
      </p>
    </div>
  );
}
