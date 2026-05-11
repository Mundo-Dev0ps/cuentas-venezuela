import { STATUS_HEX } from '../../constants/colors';

const STATUSES: { key: keyof typeof STATUS_HEX; label: string }[] = [
  { key: 'paralizada', label: 'Paralizada' },
  { key: 'critica', label: 'Crítica' },
  { key: 'inoperativa', label: 'Inoperativa' },
];

export function Legend() {
  return (
    <div className="hidden sm:block absolute bottom-6 left-4 z-20 pointer-events-none animate-ui-slide-up animate-delay-300">
      <div className="backdrop-blur-md bg-slate-900/75 border border-slate-700/50 rounded-lg px-4 py-3 space-y-3">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Estatus</p>
        <div className="space-y-2">
          {STATUSES.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: STATUS_HEX[key],
                  boxShadow: `0 0 6px ${STATUS_HEX[key]}`,
                }}
              />
              <span className="text-slate-300 text-xs">{label}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700/50 pt-2 space-y-1">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Presupuesto</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
            <span className="text-slate-400 text-xs">Menor</span>
            <span className="inline-block w-3.5 h-3.5 rounded-full bg-slate-400 flex-shrink-0 ml-2" />
            <span className="text-slate-400 text-xs">Mayor</span>
          </div>
          <p className="text-slate-500 text-[10px]">tamaño del punto · escala log USD</p>
        </div>
      </div>
    </div>
  );
}
