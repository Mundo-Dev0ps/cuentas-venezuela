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

const NATIONALITY_COLORS: Record<string, string> = {
  Venezuela: "#7dd3fc",
  Perú: "#fb7185",
  Haití: "#38bdf8",
  Colombia: "#fbbf24",
  Bolivia: "#fb923c",
};

export interface ComparativaPoint {
  year: number;
  [nationality: string]: number;
}

export function ComparativaChart({
  data,
  nationalities,
}: {
  data: ComparativaPoint[];
  nationalities: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
        {nationalities.map((nat) => (
          <Line
            key={nat}
            type="monotone"
            dataKey={nat}
            stroke={NATIONALITY_COLORS[nat] ?? "#64748b"}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
