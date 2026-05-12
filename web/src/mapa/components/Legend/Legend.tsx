import { STATUS_HEX } from '../../constants/colors';

const STATUSES: { key: keyof typeof STATUS_HEX; label: string }[] = [
  { key: 'paralizada', label: 'Paralizada' },
  { key: 'critica', label: 'Crítica' },
  { key: 'inoperativa', label: 'Inoperativa' },
];

export function Legend() {
  return (
    <div className="hidden sm:block absolute bottom-6 left-4 z-20 pointer-events-none animate-ui-slide-up animate-delay-300">
      <div className="backdrop-blur-md bg-slate-900/75 border border-slate-700/50 rounded-lg px-3 py-2 space-y-1.5">
        <div className="flex items-center gap-3 flex-wrap">
          {STATUSES.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: STATUS_HEX[key],
                  boxShadow: `0 0 5px ${STATUS_HEX[key]}`,
                }}
              />
              <span className="text-slate-300 text-[11px]">{label}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700/50 pt-1.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 text-[10px] uppercase tracking-wider mr-1">$:</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
          <span className="text-slate-400 text-[10px]">menor</span>
          <span className="inline-block w-3 h-3 rounded-full bg-slate-400 flex-shrink-0 ml-1" />
          <span className="text-slate-400 text-[10px]">mayor</span>
        </div>
      </div>
    </div>
  );
}
