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
  "#059669", "#9333ea", "#0ea5e9", "#f59e0b", "#ef4444",
  "#14b8a6", "#6366f1", "#ec4899", "#84cc16", "#64748b",
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
        <Tooltip formatter={(v: number) => v.toLocaleString("es-CL")} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
