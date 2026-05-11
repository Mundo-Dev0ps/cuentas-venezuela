import type { Supporter } from "@/lib/api";

function fmtAmount(s: Supporter): string {
  if (s.amount == null) return "";
  const cur = s.currency || "USD";
  return `${cur} ${s.amount.toLocaleString("es-CL", {
    maximumFractionDigits: 2,
  })}`;
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

interface SupportersWallProps {
  supporters: Supporter[];
  showEmpty?: boolean;
}

export function SupportersWall({ supporters, showEmpty = true }: SupportersWallProps) {
  if (supporters.length === 0) {
    if (!showEmpty) return null;
    return (
      <p className="text-sm text-slate-400 italic">
        Sé el primero en apoyar este proyecto. Tu nombre aparecerá aquí 🙌
      </p>
    );
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {supporters.map((s, i) => (
        <li
          key={i}
          className="rounded-lg border border-slate-700/40 bg-slate-900/60 px-4 py-3"
        >
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <p className="font-semibold text-slate-100 truncate">{s.name}</p>
            <span className="text-xs text-pink-300 whitespace-nowrap">
              {fmtAmount(s)}
            </span>
          </div>
          {s.message && (
            <p className="text-sm text-slate-300 italic mb-1">
              «{s.message}»
            </p>
          )}
          <p className="text-[0.65rem] text-slate-500 uppercase tracking-wider">
            {fmtDate(s.at)} · {s.type}
          </p>
        </li>
      ))}
    </ul>
  );
}
