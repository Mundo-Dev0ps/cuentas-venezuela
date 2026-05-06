"use client";

import { cn } from "@/lib/cn";
import { useCountUp } from "@/lib/use-count-up";
import { useInView } from "@/lib/use-in-view";

interface StatProps {
  label: string;
  /** Static display string. Used when numericValue is undefined. */
  value?: string;
  /** Counts up from 0 -> numericValue once visible. */
  numericValue?: number;
  /** Divide the animated value before formatting (e.g. 1000 for "k"). */
  divisor?: number;
  /** Decimal places after divisor. Default 0. */
  decimals?: number;
  /** Prepended to the formatted number. */
  prefix?: string;
  /** Appended to the formatted number. */
  suffix?: string;
  /** Use Spanish thousand separators. Default true (only when decimals === 0). */
  groupThousands?: boolean;
  hint?: string;
  className?: string;
  /** Animation duration in ms. */
  duration?: number;
}

export function Stat({
  label,
  value,
  numericValue,
  divisor = 1,
  decimals = 0,
  prefix = "",
  suffix = "",
  groupThousands = true,
  hint,
  className,
  duration = 1500,
}: StatProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const animated = useCountUp(numericValue ?? 0, duration, inView);

  let display: string;
  if (numericValue !== undefined) {
    const v = animated / divisor;
    const num =
      decimals > 0
        ? v.toFixed(decimals)
        : groupThousands
          ? Math.round(v).toLocaleString("es-CL")
          : Math.round(v).toString();
    display = `${prefix}${num}${suffix}`;
  } else {
    display = value ?? "";
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-slate-700/40 bg-slate-900/80 backdrop-blur-md p-5",
        className,
      )}
    >
      <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight font-mono text-orange-400">
        {display}
      </div>
      {hint ? (
        <div className="mt-1 text-xs text-slate-400">{hint}</div>
      ) : null}
    </div>
  );
}
