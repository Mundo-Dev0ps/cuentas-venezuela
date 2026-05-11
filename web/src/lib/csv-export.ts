import type { Obra } from "./obras-types";

const HEADERS = [
  "id",
  "slug",
  "nombre",
  "estado",
  "municipio",
  "tipo",
  "status",
  "monto_usd",
  "anio_inicio",
  "anio_fin",
  "lat",
  "lon",
  "fuente_url",
];

function escapeCell(v: unknown): string {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export function obrasToCSV(obras: Obra[]): string {
  const rows = obras.map((o) =>
    [
      o.id,
      o.slug,
      o.nombre,
      o.estado,
      o.municipio,
      o.tipo,
      o.status,
      o.monto_usd,
      o.anio_inicio,
      o.anio_fin,
      o.lat,
      o.lon,
      o.fuente_url,
    ]
      .map(escapeCell)
      .join(","),
  );
  return [HEADERS.join(","), ...rows].join("\n");
}

export function downloadCSV(obras: Obra[], filename = "obras.csv"): void {
  const csv = obrasToCSV(obras);
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
