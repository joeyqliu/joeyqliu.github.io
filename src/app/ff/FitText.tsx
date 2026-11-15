"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Renders text at the largest font size that fits inside its box (wrapping
 * allowed, never clipped). Re-fits when the box resizes or web fonts load.
 * The box size comes from `className`/`style`; give it a definite height.
 */
export default function FitText({
  children,
  className = "",
  style,
  maxFrac = 1,
  minPx = 10,
  align = "center",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Largest font size as a fraction of the box height (keeps short names from getting huge). */
  maxFrac?: number;
  minPx?: number;
  align?: "center" | "left";
}) {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const b = box.current;
    const t = text.current;
    if (!b || !t) return;
    const fit = () => {
      const cs = getComputedStyle(b);
      const avail = b.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      let lo = minPx;
      let hi = Math.max(minPx, avail * maxFrac);
      for (let i = 0; i < 14; i++) {
        const mid = (lo + hi) / 2;
        t.style.fontSize = `${mid}px`;
        const fits = t.scrollWidth <= t.clientWidth + 0.5 && t.scrollHeight <= avail + 0.5;
        if (fits) lo = mid;
        else hi = mid;
      }
      t.style.fontSize = `${lo}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    let alive = true;
    document.fonts?.ready.then(() => alive && fit());
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [children, maxFrac, minPx]);

  return (
    <div ref={box} className={`flex items-center justify-center overflow-hidden ${className}`} style={style}>
      <span ref={text} className={`block w-full ${align === "left" ? "text-left" : "text-center"} leading-[1.08] [text-wrap:balance]`}>
        {children}
      </span>
    </div>
  );
}
