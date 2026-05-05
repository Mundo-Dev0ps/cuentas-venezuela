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
  Venezuela: "#9333ea",
  Perú: "#dc2626",
  Haití: "#0ea5e9",
  Colombia: "#f59e0b",
  Bolivia: "#059669",
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
