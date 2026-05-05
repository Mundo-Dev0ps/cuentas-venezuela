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
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
        <XAxis dataKey="year" stroke="#6b7280" />
        <YAxis
          stroke="#6b7280"
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v: number) => v.toLocaleString("es-CL")}
          labelFormatter={(l) => `Año ${l}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="legal"
          name="Stock legal"
          stroke="#059669"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="estimado_total"
          name="Estimado total"
          stroke="#9333ea"
          strokeWidth={2}
          strokeDasharray="4 3"
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
