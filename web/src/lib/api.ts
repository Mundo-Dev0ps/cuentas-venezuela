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

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
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

export interface VeMacroRow {
  country: string;
  code: string;
  name: string | null;
  year: number;
  value: number | null;
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
