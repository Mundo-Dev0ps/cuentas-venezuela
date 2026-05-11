"use client";

import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/cn";

/**
 * Wraps children in a div that fades + slides up when it scrolls into view.
 * Uses the .animate-ui-slide-up keyframes already defined in globals.css.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 100 | 200 | 300 | 400 | 500 | 0;
}) {
  const { ref, inView } = useInView({ threshold: 0.15 });
  const delayClass =
    delay === 0 ? "" : `animate-delay-${delay}`;
  return (
    <div
      ref={ref}
      className={cn(
        inView ? `animate-ui-slide-up ${delayClass}` : "opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
