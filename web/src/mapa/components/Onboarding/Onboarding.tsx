import { BarChart3, Clock, MapPin, RotateCcw, Search } from 'lucide-react';

interface OnboardingProps {
  onClose: () => void;
}

const STEPS = [
  { icon: Search, title: 'Filtra', text: 'Buscá obras por nombre, categoría o estatus desde el panel superior izquierdo.' },
  { icon: MapPin, title: 'Explora', text: 'Clic en un estado del mapa para ver todas sus obras inconclusas.' },
  { icon: BarChart3, title: 'Profundiza', text: 'Clic en cualquier punto rojo, naranja o verde abre la ficha técnica completa.' },
  { icon: Clock, title: 'Viaja en el tiempo', text: 'Mové la barra inferior para filtrar por años de inicio.' },
  { icon: RotateCcw, title: 'Vuelve', text: 'Presioná ESC o el botón Volver para regresar al inicio.' },
];

export function Onboarding({ onClose }: OnboardingProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
    >
      <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-white/[0.1] shadow-2xl p-6">
        <div className="text-center mb-5">
          <p className="text-orange-400 text-xs font-medium mb-1">
            Guía rápida
          </p>
          <h2 id="onboarding-title" className="text-slate-100 font-semibold text-2xl leading-tight">
            Mapa del Olvido
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Cada punto es una obra pública abandonada en Venezuela.
          </p>
        </div>

        <ul className="space-y-2.5 mb-6">
          {STEPS.map(s => {
            const StepIcon = s.icon;
            return (
              <li key={s.title} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                <StepIcon className="h-[18px] w-[18px] text-orange-400 shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden />
                <div>
                  <p className="text-slate-100 font-medium text-sm">{s.title}</p>
                  <p className="text-slate-400 text-xs leading-snug">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          onClick={onClose}
          className="w-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-semibold py-2.5 rounded-lg transition-[background-color,transform] duration-150 active:scale-[0.96]"
        >
          Empezar a explorar
        </button>
        <p className="text-slate-400 text-xs text-center mt-3">
          Atajos: <kbd className="bg-slate-800 border border-white/[0.08] px-1.5 py-0.5 rounded text-slate-200 font-mono text-[11px]">/</kbd> para buscar · <kbd className="bg-slate-800 border border-white/[0.08] px-1.5 py-0.5 rounded text-slate-200 font-mono text-[11px]">ESC</kbd> para volver
        </p>
      </div>
    </div>
  );
}
