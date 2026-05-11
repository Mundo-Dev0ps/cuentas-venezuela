export type ObraStatus =
  | "inaugurada"
  | "abandonada"
  | "parcial"
  | "en_construccion";

export type ObraTipo =
  | "vialidad"
  | "salud"
  | "educacion"
  | "vivienda"
  | "agua"
  | "energia"
  | "otros";

export interface Obra {
  id: string;
  slug: string;
  nombre: string;
  estado: string;
  municipio?: string;
  tipo: ObraTipo;
  status: ObraStatus;
  monto_usd?: number;
  anio_inicio?: number;
  anio_fin?: number;
  lat?: number;
  lon?: number;
  fuente_url?: string;
  fuente_tipo?: string;
}

export interface ObrasStats {
  total_count: number;
  total_monto_usd: number;
  by_status: Record<ObraStatus, number>;
  top10_estados: { estado: string; count: number; monto_usd: number }[];
}
