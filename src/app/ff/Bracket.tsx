import type { GameState } from "./game";
import { matchLabel } from "./game";

/** Bracket: M1 (T1 vs T2), M2 (T3 vs T4), Final (winners). Used on host and board. */
export default function Bracket({ state, big = false }: { state: GameState; big?: boolean }) {
  const { teams, matches, matchIndex, stage } = state;
  const slots: [number | null, number | null][] = [
    [0, 1],
    [2, 3],
    [matches[0]?.winner ?? null, matches[1]?.winner ?? null],
  ];

  const row = (i: number) => {
    const m = matches[i];
    const live = stage === "playing" && matchIndex === i;
    return (
      <div
        key={i}
        className={`rounded-2xl border-2 ${live ? "border-[#ffd34d] bg-[#ffd34d]/10" : "border-white/15 bg-white/5"} ${big ? "p-5" : "p-3"}`}
      >
        <div className={`font-black tracking-[0.25em] text-[#ffd34d] ${big ? "text-xl mb-3" : "text-xs mb-2"}`}>
          {matchLabel(i)}
          {live && <span className="ml-2 text-white/70">● LIVE</span>}
        </div>
        {slots[i].map((t, side) => {
          const won = m?.winner != null && m.winner === t;
          const lost = m?.winner != null && m.winner !== t;
          return (
            <div
              key={side}
              className={`flex justify-between gap-4 font-bold ${big ? "text-3xl py-1" : "text-base"} ${won ? "text-[#ffd34d]" : lost ? "text-white/35 line-through" : "text-white"}`}
            >
              <span>
                {t === null ? "TBD" : teams[t]} {won && "🏆"}
              </span>
              {m && <span className="tabular-nums">{m.scores[side]}</span>}
            </div>
          );
        })}
      </div>
    );
  };

  return <div className={`grid ${big ? "gap-5" : "gap-3"} md:grid-cols-3`}>{[0, 1, 2].map(row)}</div>;
}
