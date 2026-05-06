"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count from 0 (or the previous value) up to `target` over `duration` ms using
 * an ease-out cubic curve. When `start` is false the value is held at 0 so the
 * caller can wait for an IntersectionObserver before kicking the animation off.
 */
export function useCountUp(
  target: number,
  duration = 1200,
  start = true,
): number {
  const [value, setValue] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (!start) return;
    const from = prev.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}
