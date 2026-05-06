"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface AporteByYear {
  year: number;
  Renta: number;
  IVA: number;
}

export function AporteBarChart({ data }: { data: AporteByYear[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
        <XAxis dataKey="year" stroke="#94a3b8" />
        <YAxis
          stroke="#94a3b8"
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}MM`}
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
          formatter={(v: number) => `${v.toLocaleString("es-CL")} M CLP`}
        />
        <Legend />
        <Bar dataKey="Renta" stackId="a" fill="#fb923c" />
        <Bar dataKey="IVA" stackId="a" fill="#7dd3fc" />
      </BarChart>
    </ResponsiveContainer>
  );
}
