interface MapModeToggleProps {
  choropleth: boolean;
  onToggle: () => void;
}

export function MapModeToggle({ choropleth, onToggle }: MapModeToggleProps) {
  const tooltip = choropleth ? 'Ver puntos individuales' : 'Ver mapa de calor por estado';
  const icon = choropleth ? '◉' : '▦';

  return (
    <button
      onClick={onToggle}
      className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 backdrop-blur-md bg-slate-900/80 border border-slate-700/50 rounded-full w-9 h-9 shadow-xl text-slate-200 hover:bg-slate-800/80 hover:text-orange-400 transition-colors flex items-center justify-center animate-ui-slide-left animate-delay-200"
      title={tooltip}
      aria-label={tooltip}
    >
      <span className="text-base leading-none">{icon}</span>
    </button>
  );
}
