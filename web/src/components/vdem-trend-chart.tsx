"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import type { VDemRow } from "@/lib/api";

interface Point {
  year: number;
  VEN?: number | null;
  CHL?: number | null;
  URY?: number | null;
}

/**
 * Pivots rows from the API (one row per country/year) into a single
 * point per year carrying one column per country, which is the format
 * recharts expects.
 */
function pivot(rows: VDemRow[], indicator: string): Point[] {
  const byYear = new Map<number, Point>();
  for (const r of rows) {
    if (r.indicatorCode !== indicator) continue;
    let p = byYear.get(r.year);
    if (!p) {
      p = { year: r.year };
      byYear.set(r.year, p);
    }
    if (r.country === "VEN") p.VEN = r.value;
    else if (r.country === "CHL") p.CHL = r.value;
    else if (r.country === "URY") p.URY = r.value;
  }
  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}

export function VdemTrendChart({ rows }: { rows: VDemRow[] }) {
  // Prefer Liberal Democracy Index; fall back to Polyarchy (Electoral
  // Democracy Index) if the ETL hasn't populated lib_dem yet.
  let data = pivot(rows, "v2x_libdem");
  let indicatorLabel = "Liberal Democracy Index (V-Dem)";
  if (data.length === 0) {
    data = pivot(rows, "v2x_polyarchy");
    indicatorLabel = "Electoral Democracy Index (V-Dem)";
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-5 text-sm text-slate-400">
        Los datos de V-Dem aún no están cargados. El pipeline ETL{" "}
        <code className="font-mono text-slate-300">etl/pipelines/vdem.py</code>{" "}
        corre nightly y poblará este gráfico.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wider text-slate-500">
        {indicatorLabel}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis
            domain={[0, 1]}
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            label={{
              value: "0 (autocracia) — 1 (democracia)",
              angle: -90,
              position: "insideLeft",
              fill: "#64748b",
              fontSize: 11,
            }}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(51,65,85,0.6)",
              borderRadius: 8,
              color: "#e2e8f0",
              fontSize: 12,
            }}
            formatter={(v: number | string) =>
              typeof v === "number" ? v.toFixed(3) : v
            }
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
          <Line type="monotone" dataKey="VEN" name="Venezuela" stroke="#f43f5e" strokeWidth={2.5} dot={false} connectNulls />
          <Line type="monotone" dataKey="CHL" name="Chile" stroke="#22d3ee" strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="URY" name="Uruguay" stroke="#a78bfa" strokeWidth={2} dot={false} connectNulls strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
