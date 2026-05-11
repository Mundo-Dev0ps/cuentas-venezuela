import type { ObraPublica } from '../types/obra';

const HEADERS = [
  'id', 'nombre', 'estado_venezuela', 'categoria', 'estatus',
  'presupuesto_usd', 'anio_inicio', 'ente_responsable',
  'lat', 'lng', 'fuente_url',
];

function escapeCell(v: unknown): string {
  const s = String(v ?? '');
  return `"${s.replace(/"/g, '""')}"`;
}

export function obrasToCSV(obras: ObraPublica[]): string {
  const rows = obras.map(o =>
    [
      o.id, o.nombre, o.estado_venezuela, o.categoria, o.estatus,
      o.presupuesto_usd, o.anio_inicio, o.ente_responsable,
      o.coordenadas.lat, o.coordenadas.lng, o.fuente_url,
    ].map(escapeCell).join(','),
  );
  return [HEADERS.join(','), ...rows].join('\n');
}

export function downloadCSV(obras: ObraPublica[], filename = 'obras.csv'): void {
  const csv = obrasToCSV(obras);
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
