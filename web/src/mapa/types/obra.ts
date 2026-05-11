export type Estatus = 'paralizada' | 'critica' | 'inoperativa';

export interface ObraPublica {
  id: string;
  nombre: string;
  coordenadas: { lat: number; lng: number };
  geohash: string;
  presupuesto_usd: number;
  anio_inicio: number;
  categoria: string;
  estado_venezuela: string;
  estatus: Estatus;
  ente_responsable: string;
  fuente_url: string;
  fotos_url: string[];

  // Optional enrichment fields
  descripcion?: string;
  progreso_pct?: number;            // % construido al paralizarse (0–100)
  sobrecosto_pct?: number;          // (gastado − original) / original × 100
  presupuesto_original_usd?: number; // anunciado vs gastado
  responsable_politico?: string;    // gobernador/ministro al iniciar
  partido_politico?: string;        // partido en poder al iniciar
  contratista?: string;             // empresa adjudicada
}
