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
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
        <XAxis dataKey="year" stroke="#6b7280" />
        <YAxis
          stroke="#6b7280"
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}MM`}
        />
        <Tooltip
          formatter={(v: number) => `${v.toLocaleString("es-CL")} M CLP`}
        />
        <Legend />
        <Bar dataKey="Renta" stackId="a" fill="#059669" />
        <Bar dataKey="IVA" stackId="a" fill="#9333ea" />
      </BarChart>
    </ResponsiveContainer>
  );
}
