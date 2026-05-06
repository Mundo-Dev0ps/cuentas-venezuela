import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}

export function PageLayout({ title, eyebrow, children }: PageLayoutProps) {
  // Reset internal scroll position on mount
  useEffect(() => {
    const el = document.getElementById('page-scroll');
    if (el) el.scrollTop = 0;
  }, []);

  return (
    <div
      id="page-scroll"
      className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-[#06102a] text-slate-200 animate-page-fade"
    >
      <header className="border-b border-slate-700/40 px-4 sm:px-8 py-4 backdrop-blur-md bg-slate-900/80 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/mapa-del-olvido" className="text-orange-400 hover:text-orange-300 text-sm font-semibold flex items-center gap-2">
            <span>←</span>
            <span>Mapa del Olvido</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4 text-xs">
            <Link to="/metodologia" className="text-slate-400 hover:text-slate-100">Metodología</Link>
            <Link to="/sobre" className="text-slate-400 hover:text-slate-100">Sobre</Link>
            <Link to="/reportar" className="text-slate-400 hover:text-slate-100">Reportar</Link>
            <a
              href="https://ko-fi.com/donjonny"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 flex items-center gap-1"
              title="Apoyá el proyecto en Ko-fi"
            >
              <span>☕</span><span>Apoyar</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-16 animate-page-rise">
        {eyebrow && (
          <p className="text-orange-400 text-xs uppercase tracking-widest font-semibold mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="text-slate-100 font-bold text-3xl sm:text-4xl mb-8 leading-tight">{title}</h1>
        <div className="space-y-6 text-slate-300 leading-relaxed">{children}</div>
      </main>

      <footer className="border-t border-slate-700/40 px-4 sm:px-8 py-6 mt-12">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <p>Mapa del Olvido · Datos abiertos · CC BY-SA 4.0</p>
          <div className="flex items-center gap-4">
            <a
              href="https://ko-fi.com/donjonny"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 flex items-center gap-1.5"
              title="Apoyá el proyecto en Ko-fi"
            >
              <span>☕</span>
              <span>Apoyar</span>
            </a>
            <Link to="/mapa-del-olvido" className="text-orange-400 hover:text-orange-300">Volver al mapa →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
