"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Confetti, Sfx } from "@/lib/effects";
import Bracket from "../Bracket";
import { BANK, matchLabel, type GameEvent, type GameState } from "../game";
import { useBoardState } from "../sync";
import s from "../ff.module.css";

const fitText = "clamp(1.1rem, min(3vw, 5.2vh), 3.4rem)";

function TeamPanel({
  name,
  score,
  side,
  glowKey,
  pop,
}: {
  name: string;
  score: number;
  side: 0 | 1;
  glowKey: number;
  pop: { key: number; points: number } | null;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center min-w-0">
      <div
        key={`glow-${glowKey}`}
        className={`${glowKey ? s.glow : ""} rounded-2xl bg-[#0b1f5c] border-[3px] border-[#8fb3ff] px-[2vw] py-[1vh] w-full text-center`}
      >
        <div
          className="font-black uppercase truncate"
          style={{ fontSize: "clamp(1rem, min(2.4vw, 4vh), 2.6rem)" }}
        >
          {name}
        </div>
        <div
          className="font-black text-[#ffd34d] tabular-nums leading-none"
          style={{ fontSize: "clamp(2rem, min(5vw, 9vh), 6rem)" }}
        >
          {score}
        </div>
      </div>
      {pop && (
        <div
          key={`pop-${pop.key}`}
          className={`${s.awardPop} absolute ${side === 0 ? "left-1/2" : "right-1/2"} -top-2 font-black text-[#ffd34d] drop-shadow-[0_4px_0_#000]`}
          style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}
        >
          +{pop.points}
        </div>
      )}
    </div>
  );
}

/** Big red X with a white outline, drawn as SVG so it looks the same on every machine. */
function StrikeX({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <g strokeLinecap="round">
        <path d="M18 18 L82 82 M82 18 L18 82" stroke="#fff" strokeWidth="26" />
        <path d="M18 18 L82 82 M82 18 L18 82" stroke="#e8141c" strokeWidth="17" />
      </g>
    </svg>
  );
}

export default function Board() {
  const [armed, setArmed] = useState(false);
  const [strike, setStrike] = useState<{ key: number; count: number } | null>(
    null,
  );
  const [pop, setPop] = useState<{
    key: number;
    side: 0 | 1;
    points: number;
  } | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const sfx = useRef(new Sfx());
  const confetti = useRef<Confetti | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const onEvent = useCallback((ev: GameEvent) => {
    const fx = sfx.current;
    const cf = confetti.current;
    const w = innerWidth;
    const h = innerHeight;
    switch (ev.kind) {
      case "reveal":
        fx.bell();
        break;
      case "strike":
        fx.buzzer();
        setStrike({ key: ev.id, count: ev.count });
        setShakeKey(ev.id);
        window.setTimeout(
          () => setStrike((cur) => (cur?.key === ev.id ? null : cur)),
          1400,
        );
        break;
      case "award":
        fx.chaChing();
        setPop({ key: ev.id, side: ev.side, points: ev.points });
        window.setTimeout(
          () => setPop((cur) => (cur?.key === ev.id ? null : cur)),
          1700,
        );
        break;
      case "teamReveal":
        fx.bell();
        cf?.burst(w * (ev.index % 2 ? 0.75 : 0.25), h * (ev.index < 2 ? 0.4 : 0.72), 70, 360, -90, 12);
        if (ev.index === 3) window.setTimeout(() => fx.fanfare(), 350);
        break;
      case "matchOver":
        fx.fanfare();
        cf?.burst(0, h, 140, 50, -60, 24);
        cf?.burst(w, h, 140, 50, -120, 24);
        break;
      case "champion":
        fx.airhorn();
        window.setTimeout(() => fx.fanfare(), 900);
        [0, 600, 1200, 1800].forEach((d, i) =>
          window.setTimeout(() => {
            cf?.burst(i % 2 ? w : 0, h, 160, 50, i % 2 ? -120 : -60, 26);
            cf?.burst(w / 2, h * 0.3, 120, 360, -90, 16);
          }, d),
        );
        break;
    }
  }, []);
  const state = useBoardState(onEvent);

  useEffect(() => {
    if (canvas.current) confetti.current = new Confetti(canvas.current);
    return () => confetti.current?.destroy();
  }, []);

  const arm = () => {
    sfx.current.unlock();
    setArmed(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  };

  return (
    <div
      className={`${s.boardBg} fixed inset-0 overflow-hidden select-none`}
      onClick={arm}
    >
      <canvas
        ref={canvas}
        className="fixed inset-0 w-full h-full pointer-events-none z-50"
      />
      <div
        key={`shake-${shakeKey}`}
        className={`${shakeKey ? s.shake : ""} w-full h-full`}
      >
        <Screen state={state} pop={pop} />
      </div>

      {strike && (
        <div key={`strike-${strike.key}`} className={s.strikeOverlay}>
          {Array.from({ length: strike.count }, (_, i) => (
            <StrikeX key={i} className={s.strikeX} style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      )}

      {!armed && (
        <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center p-4 cursor-pointer">
          <div className="rounded-full bg-black/70 border border-white/20 px-6 py-3 text-lg font-semibold">
            🔊 Click anywhere to enable sound &amp; go full screen
          </div>
        </div>
      )}
    </div>
  );
}

function Screen({
  state,
  pop,
}: {
  state: GameState | null;
  pop: { key: number; side: 0 | 1; points: number } | null;
}) {
  if (!state || state.stage === "setup") {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <div
          className={`${s.logo} ${s.zoomIn} text-center leading-[0.9]`}
          style={{ fontSize: "min(16vw, 26vh)" }}
        >
          FAMILY
          <br />
          FEUD
        </div>
        <div
          className="text-white/70 font-semibold tracking-[0.3em]"
          style={{ fontSize: "clamp(1rem, 2vw, 2rem)" }}
        >
          {state ? "GET READY…" : "WAITING FOR HOST…"}
        </div>
      </div>
    );
  }

  if (state.stage === "intro") return <TeamIntro state={state} />;

  if (state.stage === "champion" && state.champion !== null) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-[1.5vh] px-8 text-center">
        <div className={`${s.zoomIn} leading-none`} style={{ fontSize: "min(10vw, 17vh)" }}>
          🏆
        </div>
        <div className={`${s.logo} leading-none`} style={{ fontSize: "min(6vw, 10vh)" }}>
          CHAMPIONS
        </div>
        <div
          className={`${s.zoomIn} font-black uppercase leading-none`}
          style={{ fontSize: "min(8vw, 13vh)", animationDelay: "0.3s" }}
        >
          {state.teams[state.champion]}
        </div>
        <div className="w-full max-w-6xl mt-[3vh]">
          <Bracket state={state} />
        </div>
      </div>
    );
  }

  const match = state.matches[state.matchIndex];
  if (state.stage === "matchOver" && match?.winner != null) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-[4vh] px-8 text-center">
        <div
          className="font-black tracking-[0.3em] text-[#ffd34d]"
          style={{ fontSize: "clamp(1rem, 2.4vw, 2.6rem)" }}
        >
          {matchLabel(state.matchIndex)} WINNER
        </div>
        <div
          className={`${s.zoomIn} font-black uppercase`}
          style={{ fontSize: "min(9vw, 15vh)" }}
        >
          🏆 {state.teams[match.winner]}
        </div>
        <div className="w-full max-w-6xl">
          <Bracket state={state} big />
        </div>
      </div>
    );
  }

  const round = state.round;
  if (!match || !round) return null;
  const q = BANK[round.q];
  const isTiebreak = match.roundIndex >= 2;

  return (
    <div className="h-full flex flex-col px-[2.5vw] py-[2.5vh] gap-[2vh]">
      {/* top bar */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-[2vw]">
        <TeamPanel
          name={state.teams[match.teams[0]]}
          score={match.scores[0]}
          side={0}
          glowKey={pop?.side === 0 ? pop.key : 0}
          pop={pop?.side === 0 ? pop : null}
        />
        <div className="flex flex-col items-center justify-center gap-[0.8vh]">
          <div
            className="font-black tracking-[0.25em] text-[#ffd34d]"
            style={{ fontSize: "clamp(0.8rem, min(1.4vw, 2.4vh), 1.4rem)" }}
          >
            {matchLabel(state.matchIndex)} ·{" "}
            {isTiebreak
              ? "TIEBREAKER"
              : `QUESTION ${match.roundIndex + 1} OF 2`}
          </div>
          <div
            className={`${s.goldBox} rounded-2xl px-[3vw] font-black tabular-nums leading-none py-[1vh]`}
            style={{ fontSize: "clamp(2.5rem, min(7vw, 12vh), 8rem)" }}
          >
            {round.bank}
          </div>
          <div className="flex gap-2 h-[4.5vh]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`font-black leading-none ${i < round.strikes ? "text-[#ff2a2a]" : "text-white/15"}`}
                style={{ fontSize: "4.5vh" }}
              >
                ✕
              </span>
            ))}
          </div>
        </div>
        <TeamPanel
          name={state.teams[match.teams[1]]}
          score={match.scores[1]}
          side={1}
          glowKey={pop?.side === 1 ? pop.key : 0}
          pop={pop?.side === 1 ? pop : null}
        />
      </div>

      {round.showQuestion && (
        <div
          className={`${s.zoomIn} text-center font-bold rounded-2xl bg-black/30 border border-white/15 px-6 py-[1.2vh]`}
          style={{ fontSize: "clamp(1rem, min(2.2vw, 3.6vh), 2.4rem)" }}
        >
          {q.question}
        </div>
      )}

      {/* answer board */}
      <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-3 grid-flow-col gap-[1.4vh_1.4vw] rounded-3xl p-[1.4vh] bg-[#030a20]/70 border-4 border-[#ffd34d]/70">
        {Array.from({ length: 6 }, (_, i) => {
          const a = q.answers[i];
          if (!a) return <div key={i} className={s.emptyTile} />;
          const shown = round.revealed[i];
          return (
            <div key={`${round.q}-${i}`} className={s.tile}>
              <div className={`${s.tileInner} ${shown ? s.flipped : ""}`}>
                <div className={`${s.face} ${s.front}`}>
                  <div
                    className={s.numOval}
                    style={{
                      width: "min(9vw, 11vh)",
                      height: "min(6vw, 7.5vh)",
                      fontSize: "min(3.6vw, 5vh)",
                    }}
                  >
                    {i + 1}
                  </div>
                </div>
                <div className={`${s.face} ${s.back}`}>
                  {/* Answer text only exists in the DOM once revealed: nothing to leak on the projector. */}
                  {shown && (
                    <>
                      <span
                        className="font-black uppercase pl-[1.4vw] pr-2 leading-tight truncate"
                        style={{ fontSize: fitText }}
                      >
                        {a.ans}
                      </span>
                      <span
                        className="h-full flex items-center justify-center bg-[#0b2a8a] border-l-[3px] border-[#8fb3ff] font-black tabular-nums rounded-r-[11px]"
                        style={{
                          fontSize: fitText,
                          minWidth: "min(9vw, 15vh)",
                        }}
                      >
                        {a.pnt * q.multiply}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** "Meet the teams": its own screen after the title. Cards flip as the host reveals them. */
function TeamIntro({ state }: { state: GameState }) {
  const revealed = state.introRevealed ?? 0;
  const card = (i: number) => {
    const shown = i < revealed;
    return (
      <div className={`${s.tile} flex-1 min-w-0`} style={{ height: "min(18vh, 12vw)" }}>
        <div className={`${s.tileInner} ${shown ? s.flipped : ""}`}>
          <div className={`${s.face} ${s.front}`}>
            <div className={s.numOval} style={{ width: "min(9vw, 13vh)", height: "min(6vw, 9vh)", fontSize: "min(3.6vw, 5.5vh)" }}>
              ?
            </div>
          </div>
          <div className={`${s.face} ${s.back}`} style={{ justifyContent: "center" }}>
            {shown && (
              <span className="font-black uppercase px-[1.5vw] truncate" style={{ fontSize: "clamp(1.4rem, min(4vw, 7vh), 5rem)" }}>
                {state.teams[i]}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="h-full flex flex-col items-center justify-center gap-[4vh] px-[5vw]">
      <div className="font-black tracking-[0.35em] text-[#ffd34d]" style={{ fontSize: "clamp(1.4rem, min(3.4vw, 6vh), 3.6rem)" }}>
        MEET THE TEAMS
      </div>
      {[0, 1].map((m) => (
        <div key={m} className="w-full flex flex-col items-center gap-[1.5vh]">
          <div className="font-black tracking-[0.3em] text-white/60" style={{ fontSize: "clamp(0.9rem, min(1.6vw, 2.8vh), 1.6rem)" }}>
            MATCH {m + 1}
          </div>
          <div className="w-full flex items-center gap-[2.5vw]">
            {card(m * 2)}
            <div className="font-black text-[#ffd34d] shrink-0" style={{ fontSize: "clamp(1.4rem, min(3.6vw, 6vh), 4rem)" }}>
              VS
            </div>
            {card(m * 2 + 1)}
          </div>
        </div>
      ))}
      <div className="h-[8vh] flex items-center">
        {revealed >= 4 && (
          <div className={`${s.logo} ${s.zoomIn}`} style={{ fontSize: "min(6vw, 9vh)" }}>
            LET&apos;S PLAY!
          </div>
        )}
      </div>
    </div>
  );
}
