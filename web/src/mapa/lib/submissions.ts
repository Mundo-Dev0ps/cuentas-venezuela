const W3F_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY as string | undefined;
const W3F_URL = 'https://api.web3forms.com/submit';
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export interface ReportInput {
  tipo: string;
  obra: string;
  estado: string;
  fuente: string;
  mensaje: string;
}

async function notifyEmail(subject: string, body: Record<string, string>): Promise<void> {
  if (!W3F_KEY) return;
  try {
    await fetch(W3F_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: W3F_KEY,
        subject,
        from_name: 'Mapa del Olvido',
        ...body,
      }),
    });
  } catch (err) {
    console.warn('[notifyEmail] failed:', err);
  }
}

export async function submitReport(input: ReportInput): Promise<string> {
  // Build a single human-readable description for the unified /api/reportes
  // backend. Contacto + evidencia URL are tracked in their dedicated columns.
  const descripcion = [
    `Tipo: ${input.tipo.slice(0, 32)}`,
    `Obra: ${input.obra.slice(0, 200)}`,
    `Estado: ${input.estado.slice(0, 80)}`,
    `Mensaje: ${input.mensaje.slice(0, 4000)}`,
  ].join('\n');

  const res = await fetch(`${API_BASE}/api/reportes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      descripcion,
      evidencia_url: input.fuente.slice(0, 500) || undefined,
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`submit failed (${res.status}): ${txt}`);
  }
  const { id } = (await res.json()) as { id: string };

  await notifyEmail(`[Reporte ${input.tipo}] ${input.obra || 'sin nombre'}`, {
    Tipo: input.tipo,
    Obra: input.obra,
    Estado: input.estado,
    Fuente: input.fuente,
    Mensaje: input.mensaje,
    'Reporte ID': id,
  });

  return id;
}
