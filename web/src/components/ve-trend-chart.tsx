"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface VeTrendPoint {
  year: number;
  VEN?: number | null;
  CHL?: number | null;
}

export type VeUnit =
  | "usd"
  | "pct"
  | "years"
  | "perThousand"
  | "per100k"
  | "raw";

interface VeTrendChartProps {
  data: VeTrendPoint[];
  unit?: VeUnit;
  height?: number;
}

function formatBy(unit: VeUnit, v: number): string {
  switch (unit) {
    case "usd":
      if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
      if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
      if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
      return `$${v.toFixed(0)}`;
    case "pct":
      return `${v.toFixed(1)}%`;
    case "years":
      return `${v.toFixed(1)}`;
    case "perThousand":
      return `${v.toFixed(1)} ‰`;
    case "per100k":
      return `${v.toFixed(1)}`;
    case "raw":
    default:
      if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
      if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
      if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
      return v.toFixed(2);
  }
}

export function VeTrendChart({ data, unit = "raw", height = 320 }: VeTrendChartProps) {
  const tickFmt = (v: number) => formatBy(unit, v);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
        <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
        <YAxis stroke="#94a3b8" tickFormatter={tickFmt} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(51,65,85,0.6)",
            borderRadius: 8,
            color: "#e2e8f0",
            fontSize: 12,
          }}
          itemStyle={{ color: "#e2e8f0" }}
          formatter={(v: number) => (v == null ? "—" : formatBy(unit, v))}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
        <Line
          type="monotone"
          dataKey="VEN"
          name="Venezuela"
          stroke="#f43f5e"
          strokeWidth={2}
          dot={false}
          isAnimationActive
          animationDuration={900}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="CHL"
          name="Chile"
          stroke="#22d3ee"
          strokeWidth={2}
          dot={false}
          isAnimationActive
          animationDuration={900}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
