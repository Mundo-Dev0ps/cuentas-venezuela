import type { Obra, ObrasStats, ObraStatus } from "./obras-types";

export const MOCK_OBRAS: Obra[] = [
  { id: "1",  slug: "puente-tinaquillo",         nombre: "Puente sobre el Tinaquillo",     estado: "Cojedes",            tipo: "vialidad",  status: "abandonada",      monto_usd: 12_000_000,    anio_inicio: 2012, anio_fin: 2015, lat: 9.91,  lon: -68.30, fuente_url: "https://example.gaceta/obra/1" },
  { id: "2",  slug: "hospital-cardio-caracas",   nombre: "Hospital Cardiológico Infantil", estado: "Distrito Capital",   tipo: "salud",     status: "inaugurada",      monto_usd: 80_000_000,    anio_inicio: 2006, anio_fin: 2007, lat: 10.50, lon: -66.92, fuente_url: "https://example.gaceta/obra/2" },
  { id: "3",  slug: "metro-cable-petare",        nombre: "Metrocable Petare",              estado: "Miranda",            tipo: "vialidad",  status: "parcial",         monto_usd: 220_000_000,   anio_inicio: 2010, anio_fin: 2018, lat: 10.49, lon: -66.81, fuente_url: "https://example.gaceta/obra/3" },
  { id: "4",  slug: "central-tocoma",            nombre: "Central Hidroeléctrica Tocoma",  estado: "Bolívar",            tipo: "energia",   status: "parcial",         monto_usd: 4_300_000_000, anio_inicio: 2007, anio_fin: 2018, lat: 7.89,  lon: -63.10, fuente_url: "https://example.gaceta/obra/4" },
  { id: "5",  slug: "gmvv-aragua-i",             nombre: "GMVV - Aragua etapa I",          estado: "Aragua",             tipo: "vivienda",  status: "inaugurada",      monto_usd: 150_000_000,   anio_inicio: 2011, anio_fin: 2014, lat: 10.25, lon: -67.59, fuente_url: "https://example.gaceta/obra/5" },
  { id: "6",  slug: "autopista-paez-sur",        nombre: "Autopista José A. Páez ramal sur", estado: "Portuguesa",       tipo: "vialidad",  status: "abandonada",      monto_usd: 95_000_000,    anio_inicio: 2013, anio_fin: 2017, lat: 9.05,  lon: -69.74, fuente_url: "https://example.gaceta/obra/6" },
  { id: "7",  slug: "planta-pulpa-papel-lacar",  nombre: "Planta de pulpa y papel Lacar",  estado: "Mérida",             tipo: "otros",     status: "abandonada",      monto_usd: 60_000_000,    anio_inicio: 2014, anio_fin: 2016, lat: 8.59,  lon: -71.15, fuente_url: "https://example.gaceta/obra/7" },
  { id: "8",  slug: "liceo-bolivariano-zulia",   nombre: "Liceo Bolivariano Zulia",        estado: "Zulia",              tipo: "educacion", status: "inaugurada",      monto_usd: 8_500_000,     anio_inicio: 2012, anio_fin: 2013, lat: 10.65, lon: -71.65, fuente_url: "https://example.gaceta/obra/8" },
  { id: "9",  slug: "sistema-agua-margarita",    nombre: "Sistema de agua isla Margarita", estado: "Nueva Esparta",      tipo: "agua",      status: "parcial",         monto_usd: 175_000_000,   anio_inicio: 2009, anio_fin: 2020, lat: 11.00, lon: -63.90, fuente_url: "https://example.gaceta/obra/9" },
  { id: "10", slug: "metro-los-teques-l2",       nombre: "Metro Los Teques Línea 2",       estado: "Miranda",            tipo: "vialidad",  status: "en_construccion", monto_usd: 1_200_000_000, anio_inicio: 2009,                 lat: 10.34, lon: -67.04, fuente_url: "https://example.gaceta/obra/10" },
  { id: "11", slug: "central-azucar-barinas",    nombre: "Central Azucarero Barinas",      estado: "Barinas",            tipo: "otros",     status: "abandonada",      monto_usd: 240_000_000,   anio_inicio: 2008, anio_fin: 2012, lat: 8.62,  lon: -70.21, fuente_url: "https://example.gaceta/obra/11" },
  { id: "12", slug: "gas-domiciliario-anzoategui", nombre: "Red de gas domiciliario",      estado: "Anzoátegui",         tipo: "energia",   status: "parcial",         monto_usd: 120_000_000,   anio_inicio: 2011, anio_fin: 2019, lat: 10.13, lon: -64.68, fuente_url: "https://example.gaceta/obra/12" },
];

export function mockStats(): ObrasStats {
  const by_status: Record<ObraStatus, number> = {
    inaugurada: 0,
    abandonada: 0,
    parcial: 0,
    en_construccion: 0,
  };
  const by_estado: Record<string, { count: number; monto_usd: number }> = {};
  let total_monto_usd = 0;

  for (const o of MOCK_OBRAS) {
    by_status[o.status]++;
    total_monto_usd += o.monto_usd ?? 0;
    by_estado[o.estado] ??= { count: 0, monto_usd: 0 };
    by_estado[o.estado].count++;
    by_estado[o.estado].monto_usd += o.monto_usd ?? 0;
  }

  const top10_estados = Object.entries(by_estado)
    .map(([estado, v]) => ({ estado, ...v }))
    .sort((a, b) => b.monto_usd - a.monto_usd)
    .slice(0, 10);

  return {
    total_count: MOCK_OBRAS.length,
    total_monto_usd,
    by_status,
    top10_estados,
  };
}
