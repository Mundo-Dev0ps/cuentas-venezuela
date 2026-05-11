import type { ObraPublica } from '../../types/obra';
import { STATUS_HEX } from '../../constants/colors';
import { calculateImpact } from './ImpactCalculator';
import { PhotoGallery } from './PhotoGallery';

const STATUS_LABEL: Record<string, string> = {
  paralizada: 'Paralizada',
  critica: 'Crítica',
  inoperativa: 'Inoperativa',
};

interface ObraDetailProps {
  obra: ObraPublica;
}

function formatUSDCompact(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function ObraDetail({ obra }: ObraDetailProps) {
  const impact = calculateImpact(obra.presupuesto_usd);
  const compact = formatUSDCompact(obra.presupuesto_usd);
  const fullAmount = new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(obra.presupuesto_usd);
  const yearsAbandoned = new Date().getFullYear() - obra.anio_inicio;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span
          className="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2"
          style={{
            backgroundColor: STATUS_HEX[obra.estatus] + '33',
            color: STATUS_HEX[obra.estatus],
          }}
        >
          {STATUS_LABEL[obra.estatus]}
        </span>
        <h2 className="text-slate-100 font-bold text-lg leading-tight">{obra.nombre}</h2>
        <p className="text-slate-400 text-sm mt-1">{obra.estado_venezuela} · {obra.categoria}</p>
      </div>

      {obra.descripcion && (
        <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/40 rounded-lg p-3 border-l-2 border-orange-400/50">
          {obra.descripcion}
        </p>
      )}

      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Fotografías</p>
        <PhotoGallery fotos={obra.fotos_url} alt={obra.nombre} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/60 rounded-lg p-3 min-w-0">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Presupuesto (USD)</p>
          <p
            className="text-rose-400 font-mono text-base font-bold truncate"
            title={fullAmount}
          >
            {compact} <span className="text-rose-300/80 text-xs">USD</span>
          </p>
          <p className="text-slate-500 text-[10px] truncate" title={fullAmount}>
            {fullAmount}
          </p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-3 min-w-0">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Inicio</p>
          <p className="text-slate-100 font-mono text-base font-bold">{obra.anio_inicio}</p>
          {yearsAbandoned > 0 && (
            <p className="text-amber-400 text-[10px]">
              {yearsAbandoned} {yearsAbandoned === 1 ? 'año' : 'años'} abandonada
            </p>
          )}
        </div>
        <div className="bg-slate-800/60 rounded-lg p-3 col-span-2 min-w-0">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Ente Responsable</p>
          <p className="text-slate-200 text-sm break-words">{obra.ente_responsable}</p>
        </div>

        {typeof obra.progreso_pct === 'number' && (
          <div className="bg-slate-800/60 rounded-lg p-3 col-span-2 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-xs uppercase tracking-wider">Progreso al paralizarse</p>
              <p className="text-slate-100 font-mono text-sm font-bold">{obra.progreso_pct}%</p>
            </div>
            <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-rose-400 rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, obra.progreso_pct))}%` }}
              />
            </div>
          </div>
        )}

        {typeof obra.sobrecosto_pct === 'number' && (
          <div className="bg-slate-800/60 rounded-lg p-3 col-span-2 min-w-0">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Sobrecosto</p>
            <p className="text-rose-400 font-mono text-base font-bold">
              +{obra.sobrecosto_pct}%
            </p>
            {typeof obra.presupuesto_original_usd === 'number' && (
              <p className="text-slate-500 text-[10px] mt-0.5">
                Anunciado: {formatUSDCompact(obra.presupuesto_original_usd)} USD → Real: {compact} USD
              </p>
            )}
          </div>
        )}
      </div>

      {(obra.responsable_politico || obra.partido_politico || obra.contratista) && (
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Responsabilidad</p>
          <div className="flex flex-col gap-2">
            {obra.responsable_politico && (
              <div className="bg-slate-800/40 rounded-lg p-2.5">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">A cargo al iniciar</p>
                <p className="text-slate-100 text-sm font-semibold">{obra.responsable_politico}</p>
                {obra.partido_politico && (
                  <p className="text-amber-400 text-[11px] mt-0.5">{obra.partido_politico}</p>
                )}
              </div>
            )}
            {obra.contratista && (
              <div className="bg-slate-800/40 rounded-lg p-2.5">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">Contratista</p>
                <p className="text-slate-100 text-sm">{obra.contratista}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">Impacto Social Equivalente</p>
        <div className="flex flex-col gap-2">
          {impact.schools > 0 && (
            <div className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
              <span className="text-2xl" role="img" aria-label="escuela">🏫</span>
              <div>
                <p className="text-slate-100 font-bold">{impact.schools.toLocaleString('es-VE')}</p>
                <p className="text-slate-400 text-xs">escuelas primarias</p>
              </div>
            </div>
          )}
          {impact.hospitals > 0 && (
            <div className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
              <span className="text-2xl" role="img" aria-label="hospital">🏥</span>
              <div>
                <p className="text-slate-100 font-bold">{impact.hospitals.toLocaleString('es-VE')}</p>
                <p className="text-slate-400 text-xs">hospitales comunitarios</p>
              </div>
            </div>
          )}
          {impact.universities > 0 && (
            <div className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
              <span className="text-2xl" role="img" aria-label="universidad">🎓</span>
              <div>
                <p className="text-slate-100 font-bold">{impact.universities.toLocaleString('es-VE')}</p>
                <p className="text-slate-400 text-xs">universidades públicas</p>
              </div>
            </div>
          )}
          {impact.waterPlants > 0 && (
            <div className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
              <span className="text-2xl" role="img" aria-label="agua">💧</span>
              <div>
                <p className="text-slate-100 font-bold">{impact.waterPlants.toLocaleString('es-VE')}</p>
                <p className="text-slate-400 text-xs">plantas de agua potable</p>
              </div>
            </div>
          )}
          {impact.electricPlants > 0 && (
            <div className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
              <span className="text-2xl" role="img" aria-label="electricidad">⚡</span>
              <div>
                <p className="text-slate-100 font-bold">{impact.electricPlants.toLocaleString('es-VE')}</p>
                <p className="text-slate-400 text-xs">plantas eléctricas comunitarias</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/40">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `${obra.nombre} — ${compact} de presupuesto, ${yearsAbandoned > 0 ? `${yearsAbandoned} años abandonada` : 'sin terminar'} en ${obra.estado_venezuela}. #MapaDelOlvido`,
          )}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-white text-slate-900 font-semibold text-sm rounded-lg py-2 transition-colors"
        >
          <span>𝕏</span>
          <span>Denunciar en X</span>
        </a>
        <a
          href={obra.fuente_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-400 hover:text-orange-300 text-sm underline underline-offset-4 transition-colors text-center"
        >
          Ver ficha en Transparencia Venezuela →
        </a>
      </div>
    </div>
  );
}
