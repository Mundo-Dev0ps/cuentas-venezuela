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
  /**
   * Color tone for the value:
   *  - "auto" (default): teal for neutral numerics, orange when prefix is "+"/"-"
   *  - "accent": always orange (use for highlighted/featured stats)
   *  - "neutral": always teal
   */
  tone?: "auto" | "accent" | "neutral";
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
  duration = 800,
  tone = "auto",
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

  const isGrowth = prefix === "+" || prefix === "-";
  const valueColor =
    tone === "accent"
      ? "text-orange-400"
      : tone === "neutral"
        ? "text-cyan-300"
        : isGrowth
          ? "text-orange-400"
          : "text-cyan-300";

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
      <div
        className={cn(
          "mt-2 font-bold tracking-tight leading-tight overflow-hidden",
          valueColor,
          numericValue !== undefined
            ? "text-2xl sm:text-3xl font-mono tabular-nums"
            : "text-lg sm:text-xl",
        )}
      >
        <span className="block whitespace-nowrap truncate" title={display}>
          {display}
        </span>
      </div>
      {hint ? (
        <div className="mt-1 text-xs text-slate-400">{hint}</div>
      ) : null}
    </div>
  );
}
