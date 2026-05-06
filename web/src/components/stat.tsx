import { cn } from "@/lib/cn";

export function Stat({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700/40 bg-slate-900/80 backdrop-blur-md p-5",
        className,
      )}
    >
      <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight font-mono text-orange-400">
        {value}
      </div>
      {hint ? (
        <div className="mt-1 text-xs text-slate-400">{hint}</div>
      ) : null}
    </div>
  );
}
