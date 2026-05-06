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
        "rounded-xl border border-slate-700 bg-slate-900 p-5 dark:border-neutral-800 dark:bg-neutral-900",
        className,
      )}
    >
      <div className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
      {hint ? (
        <div className="mt-1 text-xs text-slate-400">{hint}</div>
      ) : null}
    </div>
  );
}
