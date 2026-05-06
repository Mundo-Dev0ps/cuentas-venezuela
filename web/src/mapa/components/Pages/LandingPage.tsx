import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllObras } from '../../lib/firestore';
import { useCountUp } from '../../hooks/useCountUp';
import type { ObraPublica } from '../../types/obra';

const SITE_NAME = 'Mapa del Olvido';

function formatUSD(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function LandingPage() {
  const [obras, setObras] = useState<ObraPublica[] | null>(null);

  useEffect(() => {
    document.title = `${SITE_NAME} — Obras públicas inconclusas en Venezuela`;
    let alive = true;
    fetchAllObras().then(d => { if (alive) setObras(d); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const total = obras ? obras.reduce((s, o) => s + o.presupuesto_usd, 0) : 0;
  const countObras = obras ? obras.length : 0;
  const paralizadas = obras ? obras.filter(o => o.estatus === 'paralizada').length : 0;
  const estados = obras ? new Set(obras.map(o => o.estado_venezuela)).size : 0;

  const animTotal = useCountUp(total, 1800);
  const animObras = useCountUp(countObras, 1400);
  const animParalizadas = useCountUp(paralizadas, 1400);
  const animEstados = useCountUp(estados, 1200);

  return (
    <div className="min-h-screen bg-[#06102a] text-slate-100 overflow-x-hidden">
      <Hero
        animTotal={animTotal}
        animObras={animObras}
        animParalizadas={animParalizadas}
        animEstados={animEstados}
      />

      <Section
        eyebrow="El problema"
        title="Cada punto rojo es un edificio sin terminar"
      >
        <p className="text-lg leading-relaxed">
          Hospitales que nunca abrieron. Metros que nunca arrancaron. Universidades sin estudiantes.
          Estadios sin partidos. Cada obra inconclusa es <strong className="text-rose-400">dinero público
          que no construyó nada</strong>, mientras los ciudadanos siguen esperando los servicios que
          se les prometieron.
        </p>
        <p className="text-slate-400">
          El Mapa del Olvido reúne {countObras > 0 ? countObras : 'cientos de'} casos verificables, con
          fuente, ubicación y montos. Para que ninguno se olvide.
        </p>
      </Section>

      <Section eyebrow="Cómo se usa" title="Tres formas de explorar">
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard
            icon="🗺️"
            title="Por ubicación"
            text="Hacé clic en un estado del mapa para ver todas las obras inconclusas allí."
          />
          <FeatureCard
            icon="📊"
            title="Por presupuesto"
            text="Ranking de las obras más costosas. Filtros por año, categoría y estatus."
          />
          <FeatureCard
            icon="🔍"
            title="Por nombre"
            text="Buscá una obra específica si ya conocés su nombre. Compartí el link directo."
          />
        </div>
      </Section>

      <Section eyebrow="Cómo aportar" title="Construido con la comunidad">
        <div className="grid md:grid-cols-2 gap-4">
          <ActionCard
            title="Reportá un dato"
            text="Encontraste una obra que falta o información desactualizada? Avisanos."
            cta="Ir al formulario →"
            href="/reportar"
          />
          <ActionCard
            title="Código abierto"
            text="Todo el código y los datos son públicos. Forkeá, mejorá, contribuí."
            cta="Ver en GitHub →"
            href="https://github.com/donjonny"
            external
          />
          <ActionCard
            title="Leé la metodología"
            text="Cómo se obtienen los datos, criterios de inclusión y conversión USD."
            cta="Ver metodología →"
            href="/metodologia"
          />
          <ActionCard
            title="Apoyá económicamente"
            text="Un café mensual ayuda a sostener el proyecto sin publicidad ni patrocinios."
            cta="Apoyar en Ko-fi ☕"
            href="https://ko-fi.com/donjonny"
            external
          />
        </div>
      </Section>

      <footer className="border-t border-slate-700/40 py-8 px-4 sm:px-8 mt-16">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <p>Mapa del Olvido · Datos abiertos · CC BY-SA 4.0</p>
          <div className="flex items-center gap-4">
            <Link to="/sobre" className="hover:text-slate-300">Sobre</Link>
            <Link to="/metodologia" className="hover:text-slate-300">Metodología</Link>
            <Link to="/reportar" className="hover:text-slate-300">Reportar</Link>
            <a
              href="https://ko-fi.com/donjonny"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300"
            >
              ☕ Apoyar
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface HeroProps {
  animTotal: number;
  animObras: number;
  animParalizadas: number;
  animEstados: number;
}

function Hero({ animTotal, animObras, animParalizadas, animEstados }: HeroProps) {
  return (
    <section className="relative px-4 sm:px-8 pt-12 sm:pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-rose-500/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-orange-500/8 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <p className="text-orange-400 text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold mb-4 animate-page-fade">
          Transparencia · Venezuela
        </p>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-4 animate-page-rise">
          Mapa del{' '}
          <span className="text-rose-400">Olvido</span>
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-page-rise">
          Las obras públicas inconclusas, el dinero perdido y los responsables.
          <br className="hidden sm:inline" />
          Un mapa para que nadie olvide.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <Stat
            value={Math.round(animObras).toLocaleString('es-VE')}
            label="obras"
            color="text-orange-400"
          />
          <Stat
            value={`${formatUSD(animTotal)} USD`}
            label="presupuesto perdido"
            color="text-rose-400"
          />
          <Stat
            value={Math.round(animParalizadas).toLocaleString('es-VE')}
            label="paralizadas"
            color="text-rose-300"
          />
          <Stat
            value={Math.round(animEstados).toString()}
            label="estados"
            color="text-amber-300"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/mapa-del-olvido"
            className="bg-orange-500 hover:bg-orange-400 text-slate-900 font-bold py-3 px-7 rounded-lg transition-colors text-base sm:text-lg"
          >
            Explorar el mapa →
          </Link>
          <Link
            to="/sobre"
            className="border border-slate-600 hover:border-slate-400 text-slate-200 font-medium py-3 px-7 rounded-lg transition-colors text-base sm:text-lg"
          >
            Conocer más
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4 backdrop-blur-md">
      <p className={`${color} font-mono font-bold text-xl sm:text-3xl leading-none truncate`}>{value}</p>
      <p className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-wider mt-2 truncate">{label}</p>
    </div>
  );
}

function Section({
  eyebrow, title, children,
}: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="px-4 sm:px-8 py-10 sm:py-16 max-w-4xl mx-auto">
      <p className="text-orange-400 text-xs uppercase tracking-widest font-semibold mb-2">{eyebrow}</p>
      <h2 className="text-2xl sm:text-4xl font-bold leading-tight mb-6 text-slate-100">{title}</h2>
      <div className="space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

function FeatureCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/40 rounded-xl p-5">
      <span className="text-3xl block mb-3">{icon}</span>
      <h3 className="text-slate-100 font-bold text-lg mb-1">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function ActionCard({
  title, text, cta, href, external,
}: { title: string; text: string; cta: string; href: string; external?: boolean }) {
  const inner = (
    <div className="bg-slate-900/50 border border-slate-700/40 hover:border-orange-400/60 hover:bg-slate-900/70 rounded-xl p-5 transition-colors h-full">
      <h3 className="text-slate-100 font-bold text-lg mb-1">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-3">{text}</p>
      <p className="text-orange-400 text-sm font-semibold">{cta}</p>
    </div>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return <Link to={href} className="block">{inner}</Link>;
}
