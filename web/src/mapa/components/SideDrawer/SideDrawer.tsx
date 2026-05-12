import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlassPanel } from '../UI/GlassPanel';
import { ObraDetail } from './ObraDetail';
import { StateView } from './StateView';
import { Top10View } from './Top10View';
import type { ObraPublica } from '../../types/obra';

interface SideDrawerProps {
  obra: ObraPublica | null;
  selectedState: string | null;
  obrasInState: ObraPublica[];
  allObras: ObraPublica[];
  onCloseObra: () => void;
  onCloseState: () => void;
  onSelectObra: (obra: ObraPublica) => void;
  onSelectState: (name: string) => void;
}

export function SideDrawer({
  obra,
  selectedState,
  obrasInState,
  allObras,
  onCloseObra,
  onCloseState,
  onSelectObra,
  onSelectState,
}: SideDrawerProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 640;
  });

  // Auto-open drawer when obra or state is selected
  useEffect(() => {
    if (obra || selectedState) setCollapsed(false);
  }, [obra, selectedState]);

  // No title shown when in state view — StateView already has its own eyebrow + name
  let title: string | null = 'Top Ranking';
  if (obra) title = 'Ficha Técnica';
  else if (selectedState) title = null;

  const handleBack = obra ? onCloseObra : selectedState ? onCloseState : null;

  return (
    <div
      className={`mdo-overlay mdo-overlay-drawer absolute top-0 right-0 h-full z-30 transition-transform duration-300 ease-out animate-ui-slide-left animate-delay-400 ${
        collapsed ? 'translate-x-full sm:translate-x-[calc(100%-2rem)]' : 'translate-x-0'
      } w-full sm:w-80 max-w-full`}
    >
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-l-md flex items-center justify-center text-slate-300 text-xs"
        aria-label={collapsed ? 'Abrir panel' : 'Cerrar panel'}
      >
        {collapsed ? '‹' : '›'}
      </button>

      <GlassPanel className="h-full rounded-none flex flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50 shrink-0">
          {handleBack && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-100 transition-colors text-sm font-medium px-2 py-1 -ml-2 rounded hover:bg-slate-800/60"
              aria-label="Volver al inicio"
            >
              <span className="text-base leading-none">←</span>
              <span className="text-xs">Volver</span>
            </button>
          )}
          {title && (
            <p className="text-slate-300 text-xs uppercase tracking-widest font-medium ml-auto">
              {title}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {obra ? (
            <ObraDetail obra={obra} />
          ) : selectedState ? (
            <StateView
              stateName={selectedState}
              obras={obrasInState}
              onSelectObra={onSelectObra}
            />
          ) : (
            <Top10View
              obras={allObras}
              onSelectObra={onSelectObra}
              onSelectState={onSelectState}
            />
          )}
        </div>

        <nav className="border-t border-slate-700/40 px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-3 text-slate-400">
            <Link to="/metodologia" className="hover:text-slate-100">Metodología</Link>
            <Link to="/sobre" className="hover:text-slate-100">Sobre</Link>
            <Link to="/reportar" className="hover:text-slate-100">Reportar</Link>
          </div>
          <a
            href="https://ko-fi.com/donjonny"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300 flex items-center gap-1 font-semibold"
            title="Apoyá el proyecto en Ko-fi"
          >
            <span>☕</span>
            <span>Apoyar</span>
          </a>
        </nav>
      </GlassPanel>
    </div>
  );
}
