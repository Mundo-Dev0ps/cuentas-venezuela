// Server-side (RSC, Route Handlers) uses internal docker hostname.
// Browser uses same-origin via Next rewrite (/api/* → API) to satisfy CSP.
const API_URL =
  typeof window === "undefined"
    ? (process.env.INTERNAL_API_URL ??
        process.env.NEXT_PUBLIC_API_URL ??
        "http://api:8000")
    : "";

export interface Source {
  id: number;
  slug: string;
  name: string;
  organization: string;
  url: string;
  license: string | null;
  description: string | null;
}

export interface Dataset {
  id: number;
  slug: string;
  sourceId: number;
  title: string;
  description: string | null;
  parquetKey: string;
  schemaVersion: number;
  rowCount: number | null;
  extractedAt: string;
  publishedAt: string;
}

export interface Indicator {
  id: number;
  slug: string;
  name: string;
  category: string;
  unit: string;
  description: string | null;
  source?: Pick<Source, "slug" | "name"> | null;
}

export interface Health {
  status: string;
  service: string;
  ts: string;
}

export interface SourceDetail {
  source: Source;
  datasets: Dataset[];
  indicators: Indicator[];
}

export interface StockRegionRow {
  year: number;
  region_code: string;
  region: string;
  stock_legal: number;
}

export interface CotizantesSectorRow {
  year: number;
  sector: string;
  cotizantes: number;
}

export interface AporteRow {
  year: number;
  concepto: string;
  monto_clp_millones: number;
}

// Default data path: World Bank / Freedom House / ACNUR / catalog
// endpoints serve historical data that changes at most yearly. A
// `no-store` here forced every consuming page into dynamic rendering
// (TTFB 1–2.5s, no edge cache). 1h ISR keeps pages fast while still
// picking up ETL refreshes within the hour. Callers that genuinely
// need realtime can pass their own fetch options.
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function safeGet<T>(path: string, fallback: T): Promise<T> {
  try {
    return await get<T>(path);
  } catch {
    return fallback;
  }
}

export async function getHealth(): Promise<Health | null> {
  try {
    return await get<Health>("/health");
  } catch {
    return null;
  }
}

export async function listSources(): Promise<Source[]> {
  const res = await safeGet<{ items: Source[] }>("/v1/sources", { items: [] });
  return res.items;
}

export async function getSource(slug: string): Promise<SourceDetail | null> {
  try {
    return await get<SourceDetail>(`/v1/sources/${slug}`);
  } catch {
    return null;
  }
}

export async function listIndicators(): Promise<Indicator[]> {
  const res = await safeGet<{ items: Indicator[] }>("/v1/indicators", {
    items: [],
  });
  return res.items;
}

export async function getStockRegion(): Promise<StockRegionRow[]> {
  const res = await safeGet<{ items: StockRegionRow[] }>(
    "/v1/data/stock-region",
    { items: [] },
  );
  return res.items;
}

export interface IndicatorDetail {
  indicator: {
    id: number;
    slug: string;
    name: string;
    category: string;
    unit: string;
    description: string | null;
  };
  dataset: {
    slug: string;
    title: string;
    parquetKey: string;
  } | null;
  source: {
    slug: string;
    name: string;
    url: string;
  } | null;
  preview: Record<string, unknown>[];
  previewError: string | null;
}

export async function getIndicator(slug: string): Promise<IndicatorDetail | null> {
  try {
    return await get<IndicatorDetail>(`/v1/indicators/${slug}`);
  } catch {
    return null;
  }
}

export async function getCotizantesSector(): Promise<CotizantesSectorRow[]> {
  const res = await safeGet<{ items: CotizantesSectorRow[] }>(
    "/v1/data/cotizantes-sector",
    { items: [] },
  );
  return res.items;
}

export interface ComparativaRow {
  year: number;
  nacionalidad: string;
  stock_legal: number;
}

export async function getComparativaNacionalidad(): Promise<ComparativaRow[]> {
  const res = await safeGet<{ items: ComparativaRow[] }>(
    "/v1/data/comparativa-nacionalidad",
    { items: [] },
  );
  return res.items;
}

export async function getAporteTributario(): Promise<AporteRow[]> {
  const res = await safeGet<{ items: AporteRow[] }>(
    "/v1/data/aporte-tributario",
    { items: [] },
  );
  return res.items;
}

export interface AcnurRow {
  year: number;
  country: string;
  countryName: string | null;
  refugees: number | null;
  asylumSeekers: number | null;
  othersConcern: number | null;
  total: number;
}

export async function getAcnurVe(opts: {
  year?: number;
  from?: number;
  to?: number;
  country?: string;
} = {}): Promise<AcnurRow[]> {
  const qs = new URLSearchParams();
  if (opts.year != null) qs.set("year", String(opts.year));
  if (opts.from != null) qs.set("from", String(opts.from));
  if (opts.to != null) qs.set("to", String(opts.to));
  if (opts.country) qs.set("country", opts.country);
  const path = `/v1/migracion/acnur-ve${qs.size ? `?${qs.toString()}` : ""}`;
  const res = await safeGet<{ items: AcnurRow[] }>(path, { items: [] });
  return res.items;
}

export interface FreedomHouseRow {
  country: string;
  year: number;
  status: "F" | "PF" | "NF" | string | null;
  prRating: number | null;
  clRating: number | null;
  prScore: number | null;
  clScore: number | null;
  total: number | null;
}

export async function getFreedomHouse(opts: {
  country?: string;
  from?: number;
  to?: number;
} = {}): Promise<FreedomHouseRow[]> {
  const qs = new URLSearchParams();
  if (opts.country) qs.set("country", opts.country);
  if (opts.from != null) qs.set("from", String(opts.from));
  if (opts.to != null) qs.set("to", String(opts.to));
  const path = `/v1/ddhh/freedom-house${qs.size ? `?${qs.toString()}` : ""}`;
  const res = await safeGet<{ items: FreedomHouseRow[] }>(path, { items: [] });
  return res.items;
}

export interface EmbiRow {
  country: string;
  countryName: string;
  snapshotDate: string;
  valueBps: number;
  isFrozen: boolean;
  note: string | null;
}

export async function getEmbi(): Promise<EmbiRow[]> {
  const res = await safeGet<{ items: EmbiRow[] }>("/v1/ve-macro/embi", { items: [] });
  return res.items;
}

export interface VeMacroRow {
  country: string;
  code: string;
  name: string | null;
  year: number;
  value: number | null;
}

export interface Supporter {
  name: string;
  amount: number | null;
  currency: string | null;
  message: string | null;
  type: string;
  at: string;
}

export async function getSupporters(limit = 50): Promise<Supporter[]> {
  // Note: this endpoint lives at /api/supporters (Hono /api/* path), so on the
  // browser it would resolve via the Next /api/:path* rewrite. From RSC we
  // use the direct URL like every other helper here.
  const path = `/api/supporters?limit=${limit}`;
  try {
    // Ko-fi-driven; 5-minute ISR matches the /apoyar page revalidate
    // so a new donation shows within ~5 min without per-request DB hits.
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: Supporter[] };
    return data.items;
  } catch {
    return [];
  }
}

// =====================================================================
// Mapa del Olvido — obras públicas paralizadas/críticas/inoperativas
// =====================================================================
// Re-declared here (instead of importing from src/mapa/types/obra.ts)
// because that file lives inside the SPA tree and we want the server
// helpers to stay agnostic of the SPA's internal types.
export type ObraEstatus = "paralizada" | "critica" | "inoperativa";

export interface ObraPublic {
  id: string;
  nombre: string;
  coordenadas: { lat: number; lng: number };
  geohash: string;
  presupuesto_usd: number;
  anio_inicio: number;
  categoria: string;
  estado_venezuela: string;
  estatus: ObraEstatus;
  ente_responsable: string;
  fuente_url: string;
  fotos_url: string[];
  descripcion?: string;
  progreso_pct?: number;
  sobrecosto_pct?: number;
  presupuesto_original_usd?: number;
  responsable_politico?: string;
  partido_politico?: string;
  contratista?: string;
}

export async function listObras(): Promise<ObraPublic[]> {
  try {
    const res = await fetch(`${API_URL}/api/obras`, {
      // 1h ISR-style cache — sitemap + list page should not hammer
      // the API on every request.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ObraPublic[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getObra(id: string): Promise<ObraPublic | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/obras/${encodeURIComponent(id)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return (await res.json()) as ObraPublic;
  } catch {
    return null;
  }
}

export async function getVeMacroIndicators(opts: {
  country?: string;
  code?: string;
  from?: number;
  to?: number;
} = {}): Promise<VeMacroRow[]> {
  const qs = new URLSearchParams();
  if (opts.country) qs.set("country", opts.country);
  if (opts.code) qs.set("code", opts.code);
  if (opts.from != null) qs.set("from", String(opts.from));
  if (opts.to != null) qs.set("to", String(opts.to));
  const path = `/v1/ve-macro/indicators${qs.size ? `?${qs.toString()}` : ""}`;
  const res = await safeGet<{ items: VeMacroRow[] }>(path, { items: [] });
  return res.items;
}
