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

export interface StockPoint {
  year: number;
  legal: number;
  estimado_total: number;
}

export function StockChart({ data }: { data: StockPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
        <XAxis dataKey="year" stroke="#94a3b8" />
        <YAxis
          stroke="#94a3b8"
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(51,65,85,0.6)",
            borderRadius: 8,
            color: "#e2e8f0",
            fontSize: 12,
          }}
          itemStyle={{ color: "#e2e8f0" }}
          labelStyle={{ color: "#94a3b8", fontWeight: 600 }}
          formatter={(v: number) => v.toLocaleString("es-CL")}
          labelFormatter={(l) => `Año ${l}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="legal"
          name="Stock legal"
          stroke="#fb923c"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="estimado_total"
          name="Estimado total"
          stroke="#7dd3fc"
          strokeWidth={2}
          strokeDasharray="4 3"
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
