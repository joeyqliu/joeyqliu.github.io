"use client";

import { forwardRef } from "react";
import { WHEEL_COLORS, WHEEL_LABEL } from "./data";

type WheelProps = {
  items: string[];
  /** Resting angle the wheel will end at; used to keep labels upright. The
   *  actual on-screen transform is driven imperatively via the forwarded ref. */
  rotation: number;
  colorOffset?: number;
};

function point(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return `${(r * Math.sin(a)).toFixed(3)} ${(-r * Math.cos(a)).toFixed(3)}`;
}

function splitLabel(label: string): string[] {
  if (label.length <= 14) return [label];
  const mid = Math.floor(label.length / 2);
  let best = -1;
  for (let i = 0; i < label.length; i++) {
    if (label[i] === " " && (best === -1 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  }
  return best === -1 ? [label] : [label.slice(0, best), label.slice(best + 1)];
}

const R = 96;

const Wheel = forwardRef<SVGGElement, WheelProps>(function Wheel(
  { items, rotation, colorOffset = 0 },
  ref,
) {
  const n = items.length;
  const seg = 360 / Math.max(n, 1);

  return (
    <div className="relative w-full aspect-square">
      {/* pointer */}
      <div className="absolute left-1/2 -top-3 -translate-x-1/2 z-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
        <svg width="44" height="54" viewBox="0 0 44 54">
          <path d="M22 54 L2 8 Q22 -6 42 8 Z" fill="#fff" stroke="#111" strokeWidth="3" />
        </svg>
      </div>
      <svg viewBox="-100 -100 200 200" className="w-full h-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <circle r="99" fill="#111" />
        <g ref={ref}>
          {n === 0 && <circle r={R} fill="#333" />}
          {n === 1 && <circle r={R} fill={WHEEL_COLORS[colorOffset % WHEEL_COLORS.length]} />}
          {n > 1 &&
            items.map((_, i) => (
              <path
                key={`s-${i}`}
                d={`M0 0 L${point(R, i * seg)} A${R} ${R} 0 ${seg > 180 ? 1 : 0} 1 ${point(R, (i + 1) * seg)} Z`}
                fill={WHEEL_COLORS[(i + colorOffset) % WHEEL_COLORS.length]}
                stroke="#111"
                strokeWidth="1.2"
              />
            ))}
          {items.map((item, i) => {
            const label = WHEEL_LABEL[item] ?? item;
            const lines = splitLabel(label);
            const longest = Math.max(...lines.map((l) => l.length));
            const fontSize = Math.min(10, 110 / Math.max(longest, 1));
            const center = (i + 0.5) * seg;
            // Where this label sits on screen once the wheel is at `rotation`.
            // Labels on the left half get flipped so they never read upside down.
            const screenAngle = (((center + rotation) % 360) + 360) % 360;
            const flip = screenAngle > 180 && screenAngle < 360;
            if (n === 1) {
              // Single option: draw it level, below the hub, regardless of wheel rotation.
              return (
                <g key={`t-${i}`} transform={`rotate(${-rotation})`}>
                  <text
                    y={R * 0.45}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.min(16, 150 / Math.max(longest, 1))}
                    fontWeight={800}
                    fill="#111"
                    style={{ fontFamily: "var(--font-geist), system-ui, sans-serif" }}
                  >
                    {label}
                  </text>
                </g>
              );
            }
            return (
              <g
                key={`t-${i}`}
                transform={`rotate(${center - 90})${flip ? ` rotate(180 ${R * 0.56} 0)` : ""}`}
              >
                <text
                  x={R * 0.56}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  fontWeight={800}
                  fill="#111"
                  style={{ fontFamily: "var(--font-geist), system-ui, sans-serif" }}
                >
                  {lines.map((l, j) => (
                    <tspan key={j} x={R * 0.56} dy={j === 0 ? (-(lines.length - 1) * fontSize) / 2 : fontSize}>
                      {l}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </g>
        <circle r="10" fill="#fff" stroke="#111" strokeWidth="3" />
      </svg>
    </div>
  );
});

export default Wheel;

/** Ease-out with a short tail: decelerates visibly but doesn't crawl for a second at the end. */
export const spinEase = (t: number) => 1 - Math.pow(1 - t, 2.2);

/** Returns the absolute rotation (deg) that lands the pointer (top) inside slice `idx`. */
export function targetRotation(current: number, n: number, idx: number, extraSpins: number): number {
  const seg = 360 / n;
  const jitter = (Math.random() - 0.5) * seg * 0.7;
  const center = (idx + 0.5) * seg + jitter;
  const desired = (((360 - center) % 360) + 360) % 360;
  const base = current + extraSpins * 360;
  const delta = (((desired - (base % 360)) % 360) + 360) % 360;
  return base + delta;
}
