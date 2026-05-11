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
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
        <XAxis
          type="number"
          stroke="#94a3b8"
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          dataKey="region"
          type="category"
          stroke="#94a3b8"
          width={110}
          tick={{ fontSize: 12 }}
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
          formatter={(v: number) => v.toLocaleString("es-CL")}
        />
        <Bar
          dataKey="stock_legal"
          fill="#fb923c"
          radius={[0, 4, 4, 0]}
          isAnimationActive
          animationDuration={1100}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
