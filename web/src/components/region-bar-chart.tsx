"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface RegionRow {
  region: string;
  stock_legal: number;
}

export function RegionBarChart({ data }: { data: RegionRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
        <XAxis
          type="number"
          stroke="#6b7280"
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          dataKey="region"
          type="category"
          stroke="#6b7280"
          width={110}
          tick={{ fontSize: 12 }}
        />
        <Tooltip formatter={(v: number) => v.toLocaleString("es-CL")} />
        <Bar dataKey="stock_legal" fill="#059669" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
