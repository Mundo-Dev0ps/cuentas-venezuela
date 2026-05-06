"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#fb923c", "#7dd3fc", "#38bdf8", "#fbbf24", "#fb7185",
  "#22d3ee", "#a78bfa", "#ec4899", "#84cc16", "#64748b",
];

export interface SectorRow {
  sector: string;
  cotizantes: number;
}

export function SectorPieChart({ data }: { data: SectorRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <PieChart>
        <Pie
          data={data}
          dataKey="cotizantes"
          nameKey="sector"
          cx="50%"
          cy="50%"
          outerRadius={120}
          innerRadius={60}
          paddingAngle={1}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
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
        <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
