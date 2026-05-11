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

export interface DiasporaBarRow {
  country: string;
  refugees: number;
  asylumSeekers: number;
  othersConcern: number;
}

interface Props {
  data: DiasporaBarRow[];
  height?: number;
}

const fmt = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)}M`
  : v >= 1_000 ? `${(v / 1_000).toFixed(0)}k`
  : `${v}`;

export function DiasporaBarChart({ data, height = 480 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
        <XAxis
          type="number"
          stroke="#94a3b8"
          tick={{ fontSize: 11 }}
          tickFormatter={fmt}
        />
        <YAxis
          dataKey="country"
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
        <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
        <Bar
          dataKey="asylumSeekers"
          name="Solicitantes de asilo"
          stackId="a"
          fill="#fb923c"
          radius={[0, 0, 0, 0]}
          isAnimationActive
          animationDuration={900}
        />
        <Bar
          dataKey="refugees"
          name="Refugiados reconocidos"
          stackId="a"
          fill="#22d3ee"
          radius={[0, 0, 0, 0]}
          isAnimationActive
          animationDuration={900}
        />
        <Bar
          dataKey="othersConcern"
          name="Otros desplazados"
          stackId="a"
          fill="#a78bfa"
          radius={[0, 4, 4, 0]}
          isAnimationActive
          animationDuration={900}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
