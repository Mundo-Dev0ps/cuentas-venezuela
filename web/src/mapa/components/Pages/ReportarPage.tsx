import { useState } from 'react';
import { PageLayout } from './PageLayout';
import { submitReport } from '../../lib/submissions';

type Tipo = 'correccion' | 'nueva-obra' | 'foto' | 'otro';

const TIPOS: { value: Tipo; label: string; help: string }[] = [
  { value: 'correccion', label: 'Corregir un dato', help: 'Presupuesto, fecha, estatus o cualquier campo desactualizado.' },
  { value: 'nueva-obra', label: 'Agregar una obra', help: 'Una obra inconclusa que no aparece en el mapa.' },
  { value: 'foto', label: 'Aportar fotos', help: 'Fotos verificables del estado actual de la obra.' },
  { value: 'otro', label: 'Otro', help: 'Otra observación o sugerencia.' },
];

export function ReportarPage() {
  const [tipo, setTipo] = useState<Tipo>('correccion');
  const [obra, setObra] = useState('');
  const [estado, setEstado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [fuente, setFuente] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await submitReport({ tipo, obra, estado, fuente, mensaje });
      setStatus('ok');
      setObra('');
      setEstado('');
      setFuente('');
      setMensaje('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo enviar.');
    }
  };

  return (
    <PageLayout eyebrow="Aportá información" title="Reportar dato o agregar obra">
      <p className="text-slate-300">
        Cada reporte se revisa contra fuentes públicas antes de aplicarse. Mientras más completo el dato y la
        fuente, más rápido se incorpora.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 sm:p-6">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Tipo de reporte</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TIPOS.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTipo(t.value)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  tipo === t.value
                    ? 'border-orange-400/70 bg-orange-500/10'
                    : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
                }`}
              >
                <p className={`text-sm font-semibold ${tipo === t.value ? 'text-orange-300' : 'text-slate-200'}`}>
                  {t.label}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">{t.help}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre de la obra" required>
            <input
              type="text"
              value={obra}
              onChange={e => setObra(e.target.value)}
              required
              className="w-full bg-slate-800/70 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/40"
              placeholder="Ej. Hospital Universitario de Maracaibo"
            />
          </Field>
          <Field label="Estado">
            <input
              type="text"
              value={estado}
              onChange={e => setEstado(e.target.value)}
              className="w-full bg-slate-800/70 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/40"
              placeholder="Ej. Zulia"
            />
          </Field>
        </div>

        <Field label="Fuente o URL de respaldo" required>
          <input
            type="text"
            value={fuente}
            onChange={e => setFuente(e.target.value)}
            required
            className="w-full bg-slate-800/70 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/40"
            placeholder="https://... o nombre de gaceta/contrato"
          />
        </Field>

        <Field label="Detalle del reporte" required>
          <textarea
            value={mensaje}
            onChange={e => setMensaje(e.target.value)}
            required
            rows={6}
            className="w-full bg-slate-800/70 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/40 resize-y"
            placeholder="Describí el dato a corregir, agregar o el problema observado."
          />
        </Field>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-slate-500 text-xs">
            Tu reporte se guarda directamente. Lo revisamos antes de aplicarlo.
          </p>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold py-2.5 px-5 rounded-lg transition-colors"
          >
            {status === 'sending' ? 'Enviando...' : 'Enviar reporte →'}
          </button>
        </div>

        {status === 'ok' && (
          <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            Reporte recibido. Lo revisamos en los próximos días y te avisamos si necesitamos más datos.
          </p>
        )}

        {status === 'error' && (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
            No se pudo enviar: {errorMsg || 'error desconocido'}. Intentá de nuevo.
          </p>
        )}
      </form>
    </PageLayout>
  );
}

function Field({
  label, children, required = false,
}: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-slate-300 text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-rose-400 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
