"use client";

import { useEffect, useState } from "react";
import Bracket from "./Bracket";
import { BANK, matchLabel } from "./game";
import { useHostGame } from "./sync";

const btn = "rounded-xl px-4 py-2 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed";

export default function HostConsole() {
  const { state, dispatch, undo, canUndo, loaded, boardConnected } = useHostGame();
  const [names, setNames] = useState(["", "", "", ""]);

  const match = state.matches[state.matchIndex];
  const round = state.round;
  const q = round ? BANK[round.q] : null;

  const openBoard = () => window.open("/ff/board", "ff-board", "popup,width=1280,height=720");

  const next = () => {
    if (round && round.awardedTo === null && !confirm("No points were awarded this round. Continue anyway?")) return;
    dispatch({ type: "next" });
  };

  const reset = () => {
    if (confirm("Reset the whole game? Scores and bracket will be cleared.")) dispatch({ type: "reset" });
  };

  // Keyboard: 1–6 reveal, X strike, Q toggle question, Cmd/Ctrl+Z undo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || state.stage !== "playing") return;
      if (/^[1-6]$/.test(e.key)) dispatch({ type: "reveal", index: Number(e.key) - 1 });
      else if (e.key.toLowerCase() === "x") dispatch({ type: "strike" });
      else if (e.key.toLowerCase() === "q") dispatch({ type: "toggleQuestion" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch, undo, state.stage]);

  if (!loaded) return <div className="min-h-screen bg-[#0b1020]" />;

  const lastRound = match ? match.roundIndex + 1 >= match.questions.length : false;
  const tiebreak = match ? match.roundIndex >= 2 : false;

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-white/10 bg-[#0b1020]/95 px-6 py-3 backdrop-blur">
        <h1 className="text-xl font-black">🎤 Family Feud · Host</h1>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${boardConnected ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/60"}`}
        >
          {boardConnected ? "● Board connected" : "○ Board not open"}
        </span>
        <div className="ml-auto flex gap-2">
          <button onClick={openBoard} className={`${btn} bg-[#2459d6] hover:bg-[#2e6bff]`}>
            Open board window ↗
          </button>
          <button onClick={undo} disabled={!canUndo} className={`${btn} bg-white/10 hover:bg-white/20`} title="Cmd/Ctrl+Z">
            ↶ Undo
          </button>
          <button onClick={reset} className={`${btn} bg-white/10 hover:bg-red-500/40`}>
            Reset
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-6">
        {state.stage === "setup" && (
          <section className="flex flex-col gap-6">
            <ol className="list-decimal pl-6 text-white/70 space-y-1">
              <li>Click <b>Open board window</b>, drag it onto the projector, and click it once (turns on sound + full screen).</li>
              <li>Enter the four team names and start. Match 1 is Team 1 vs Team 2, Match 2 is Team 3 vs Team 4, then the winners meet in the final.</li>
              <li>Keys while playing: <b>1–6</b> reveal, <b>X</b> strike, <b>Q</b> show/hide question on board, <b>⌘Z</b> undo.</li>
            </ol>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                dispatch({ type: "start", teams: names });
              }}
            >
              {names.map((n, i) => (
                <label key={i} className="flex flex-col gap-1">
                  <span className="text-sm text-white/60">
                    Team {i + 1} · {i < 2 ? "Match 1" : "Match 2"}
                  </span>
                  <input
                    value={n}
                    onChange={(e) => setNames((ns) => ns.map((x, j) => (j === i ? e.target.value : x)))}
                    placeholder={`Team ${i + 1}`}
                    className="rounded-xl bg-white/10 px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-[#ffd34d]"
                  />
                </label>
              ))}
              <button type="submit" className={`${btn} sm:col-span-2 bg-[#ffd34d] text-black text-xl py-4 hover:brightness-110`}>
                Start game →
              </button>
            </form>
          </section>
        )}

        {state.stage === "playing" && match && round && q && (
          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-sm font-black tracking-[0.25em] text-[#ffd34d]">
                {matchLabel(state.matchIndex)} · {tiebreak ? "TIEBREAKER" : `QUESTION ${match.roundIndex + 1} OF 2`}
              </div>
              <div className="text-white/50 text-sm">Keys: 1–6 reveal · X strike · Q question · ⌘Z undo</div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
              {[0, 1].map((side) => (
                <div
                  key={side}
                  className={`rounded-2xl bg-white/5 border border-white/10 p-4 text-center ${side === 1 ? "order-3" : ""}`}
                >
                  <div className="font-bold text-lg truncate">{state.teams[match.teams[side]]}</div>
                  <div className="text-4xl font-black tabular-nums text-[#ffd34d]">{match.scores[side]}</div>
                </div>
              ))}
              <div className="order-2 rounded-2xl bg-[#ffd34d] text-black px-6 flex flex-col items-center justify-center">
                <div className="text-xs font-black tracking-widest">BANK</div>
                <div className="text-4xl font-black tabular-nums">{round.bank}</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="text-2xl font-bold leading-snug">{q.question}</div>
              <label className="mt-3 inline-flex items-center gap-2 text-white/70 cursor-pointer">
                <input type="checkbox" checked={round.showQuestion} onChange={() => dispatch({ type: "toggleQuestion" })} className="size-4 accent-[#ffd34d]" />
                Show question on board (Q)
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 sm:grid-rows-3 sm:grid-flow-col">
              {q.answers.map((a, i) => {
                const shown = round.revealed[i];
                return (
                  <button
                    key={i}
                    onClick={() => dispatch({ type: "reveal", index: i })}
                    disabled={shown}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-lg font-semibold border transition ${
                      shown ? "bg-[#2459d6]/30 border-[#2459d6] text-white/60" : "bg-white/5 border-white/15 hover:bg-white/15"
                    }`}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#2459d6] font-black">{i + 1}</span>
                    <span className="flex-1">{a.ans}</span>
                    <span className="tabular-nums font-black">{a.pnt * q.multiply}</span>
                    <span className="w-20 text-right text-sm">{shown ? "✓ shown" : "Reveal"}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => dispatch({ type: "strike" })} disabled={round.strikes >= 3} className={`${btn} bg-red-600 hover:bg-red-500 text-lg px-6`}>
                ✕ Strike (X)
              </button>
              <span className="text-2xl font-black tracking-widest">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={i < round.strikes ? "text-red-500" : "text-white/15"}>
                    ✕
                  </span>
                ))}
              </span>
              <button onClick={() => dispatch({ type: "clearStrikes" })} disabled={round.strikes === 0} className={`${btn} bg-white/10 hover:bg-white/20 text-sm`}>
                Clear strikes
              </button>
              <button
                onClick={() => round.revealed.forEach((r, i) => !r && dispatch({ type: "reveal", index: i }))}
                disabled={round.revealed.every(Boolean)}
                className={`${btn} bg-white/10 hover:bg-white/20 text-sm ml-auto`}
              >
                Reveal all remaining
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 p-4 flex flex-wrap items-center gap-3">
              {round.awardedTo === null ? (
                <>
                  <span className="text-white/60">Award the bank ({round.bank}) to:</span>
                  {[0, 1].map((side) => (
                    <button
                      key={side}
                      onClick={() => dispatch({ type: "award", side: side as 0 | 1 })}
                      className={`${btn} bg-green-600 hover:bg-green-500`}
                    >
                      {state.teams[match.teams[side]]} +{round.bank}
                    </button>
                  ))}
                </>
              ) : (
                <span className="text-green-300 font-semibold">
                  ✓ {round.bank} points awarded to {state.teams[match.teams[round.awardedTo]]}
                </span>
              )}
              <button onClick={next} className={`${btn} ml-auto bg-[#ffd34d] text-black hover:brightness-110 text-lg px-6`}>
                {lastRound
                  ? match.scores[0] === match.scores[1] && round.awardedTo !== null
                    ? "Tied! Go to tiebreaker →"
                    : "Finish match →"
                  : "Next question →"}
              </button>
            </div>
          </section>
        )}

        {state.stage === "matchOver" && match?.winner != null && (
          <section className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="text-sm font-black tracking-[0.25em] text-[#ffd34d]">{matchLabel(state.matchIndex)} WINNER</div>
            <div className="text-5xl font-black">🏆 {state.teams[match.winner]}</div>
            <div className="text-white/60">
              {match.scores[0]} – {match.scores[1]}
            </div>
            <button onClick={() => dispatch({ type: "nextMatch" })} className={`${btn} bg-[#ffd34d] text-black text-xl px-8 py-4 hover:brightness-110`}>
              Start {matchLabel(state.matchIndex + 1).toLowerCase()} →
            </button>
          </section>
        )}

        {state.stage === "champion" && state.champion !== null && (
          <section className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="text-sm font-black tracking-[0.25em] text-[#ffd34d]">CHAMPIONS</div>
            <div className="text-6xl font-black">🏆 {state.teams[state.champion]}</div>
            <button onClick={reset} className={`${btn} bg-white/10 hover:bg-white/20`}>
              New game
            </button>
          </section>
        )}

        {state.stage !== "setup" && (
          <section>
            <h2 className="mb-2 text-sm font-black tracking-[0.25em] text-white/50">BRACKET</h2>
            <Bracket state={state} />
          </section>
        )}
      </main>
    </div>
  );
}
