import { Building2, Droplets, GraduationCap, HeartPulse, Zap } from 'lucide-react';
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
    { icon: Building2, count: impact.schools, label: 'escuelas primarias' },
    { icon: HeartPulse, count: impact.hospitals, label: 'hospitales comunitarios' },
    { icon: GraduationCap, count: impact.universities, label: 'universidades públicas' },
    { icon: Droplets, count: impact.waterPlants, label: 'plantas potabilizadoras' },
    { icon: Zap, count: impact.electricPlants, label: 'plantas eléctricas' },
  ].filter(i => i.count > 0);

  if (items.length === 0) return null;

  return (
    <div className="space-y-2 border-t border-white/[0.08] pt-4 mt-2">
      <p className="text-slate-400 text-xs font-medium">
        Con este dinero {scopeLabel} pudo construirse en su lugar
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-2 px-2 py-1.5">
              <Icon className="h-4 w-4 text-slate-400 shrink-0" strokeWidth={1.5} aria-hidden />
              <div className="min-w-0">
                <p className="text-slate-200 font-mono tabular-nums text-sm leading-none">
                  {item.count.toLocaleString('es-VE')}
                </p>
                <p className="text-slate-400 text-[11px] leading-tight mt-0.5">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-slate-400 text-[11px]">
        Costos referenciales en{' '}
        <a href="/metodologia" className="text-slate-300 hover:text-orange-400 underline underline-offset-2">
          /metodologia
        </a>
      </p>
    </div>
  );
}
