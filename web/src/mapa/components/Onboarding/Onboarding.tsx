interface OnboardingProps {
  onClose: () => void;
}

const STEPS = [
  { icon: '🔍', title: 'Filtra', text: 'Buscá obras por nombre, categoría o estatus desde el panel superior izquierdo.' },
  { icon: '📍', title: 'Explora', text: 'Clic en un estado del mapa para ver todas sus obras inconclusas.' },
  { icon: '📊', title: 'Profundiza', text: 'Clic en cualquier punto rojo, naranja o verde abre la ficha técnica completa.' },
  { icon: '⏳', title: 'Viaja en el tiempo', text: 'Mové la barra inferior para filtrar por años de inicio.' },
  { icon: '🔄', title: 'Vuelve', text: 'Presioná ESC o el botón Volver para regresar al inicio.' },
];

export function Onboarding({ onClose }: OnboardingProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-6">
        <div className="text-center mb-5">
          <p className="text-orange-400 text-xs uppercase tracking-widest font-semibold mb-1">
            Bienvenido
          </p>
          <h2 className="text-slate-100 font-bold text-2xl leading-tight">Mapa del Olvido</h2>
          <p className="text-slate-400 text-sm mt-2">
            Cada punto es una obra pública abandonada en Venezuela.
          </p>
        </div>

        <ul className="space-y-3 mb-6">
          {STEPS.map(s => (
            <li key={s.title} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
              <span className="text-2xl shrink-0" role="img" aria-hidden="true">{s.icon}</span>
              <div>
                <p className="text-slate-100 font-semibold text-sm">{s.title}</p>
                <p className="text-slate-400 text-xs leading-snug">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="w-full bg-orange-500 hover:bg-orange-400 text-slate-900 font-bold py-2.5 rounded-lg transition-colors"
        >
          Empezar a explorar
        </button>
        <p className="text-slate-500 text-[11px] text-center mt-3">
          Tip: presioná <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">/</kbd> para enfocar la búsqueda · <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">ESC</kbd> para volver
        </p>
      </div>
    </div>
  );
}
