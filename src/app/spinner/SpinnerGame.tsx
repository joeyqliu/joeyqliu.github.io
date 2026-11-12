"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Wheel, { spinEase, targetRotation } from "./Wheel";
import { Confetti, Sfx } from "@/lib/effects";
import { MEME_LINES, STORIES, STORY_EMOJI, STYLES, STYLE_EMOJI, WHEEL_COLORS } from "./data";
import s from "./spinner.module.css";

type Pairing = { style: string; story: string };
type Phase = "idle" | "spinning" | "celebrating";
type Meme = { id: number; text: string; left: number; top: number; size: number; color: string; r0: number; r1: number; delay: number };
type Drop = { id: number; emoji: string; left: number; size: number; dur: number; delay: number; spin: number };

const STORAGE_KEY = "skit-spinner-taken-v1";
const STYLE_MS = 4000;
const STORY_MS = 6500;
/** Let the crowd see the second pointer settle before the chaos covers it. */
const REVEAL_PAUSE_MS = 300;
const MEME_COLORS = ["#ffd32a", "#ff4757", "#2ed573", "#1e90ff", "#ff9ff3", "#ffffff", "#00d2d3"];
const EXTRA_EMOJI = ["🔥", "💀", "😂", "🙏", "✨", "🎉", "😭", "🤯", "👑", "💯"];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function SpinnerGame() {
  const [taken, setTaken] = useState<Pairing[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [resumedCount, setResumedCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  // Wheel contents are frozen during a spin + celebration so slices don't jump.
  const [frozen, setFrozen] = useState<{ styles: string[]; stories: string[] } | null>(null);
  const [styleRot, setStyleRot] = useState(0);
  const [storyRot, setStoryRot] = useState(0);
  const [styleLanded, setStyleLanded] = useState<string | null>(null);
  const [storyLanded, setStoryLanded] = useState<string | null>(null);
  const [lastOne, setLastOne] = useState<{ style: boolean; story: boolean }>({ style: false, story: false });
  const [shake, setShake] = useState(false);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [hits, setHits] = useState<{ id: number; x: number; y: number }[]>([]);
  const [muted, setMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<Confetti | null>(null);
  const sfxRef = useRef<Sfx>(new Sfx());
  const styleWheelRef = useRef<SVGGElement>(null);
  const storyWheelRef = useRef<SVGGElement>(null);
  const styleBoxRef = useRef<HTMLDivElement>(null);
  const storyBoxRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const idRef = useRef(0);
  const busyRef = useRef(false);
  const rotRef = useRef({ style: 0, story: 0 });
  const rafs = useRef<Set<number>>(new Set());

  // load / persist
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Pairing[];
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((p) => STYLES.includes(p.style) && STORIES.includes(p.story));
          setTaken(valid);
          setResumedCount(valid.length);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(taken));
  }, [taken, loaded]);

  useEffect(() => {
    if (canvasRef.current) confettiRef.current = new Confetti(canvasRef.current);
    const t = timers.current;
    const rafsSet = rafs.current;
    return () => {
      confettiRef.current?.destroy();
      t.forEach(clearTimeout);
      rafsSet.forEach(cancelAnimationFrame);
    };
  }, []);

  useEffect(() => {
    sfxRef.current.muted = muted;
  }, [muted]);

  // Browsers block audio until the first interaction; unlock on any click/key.
  useEffect(() => {
    const unlock = () => sfxRef.current.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const remainingStyles = STYLES.filter((x) => !taken.some((t) => t.style === x));
  const remainingStories = STORIES.filter((x) => !taken.some((t) => t.story === x));
  const wheelStyles = frozen?.styles ?? remainingStyles;
  const wheelStories = frozen?.stories ?? remainingStories;
  const done = loaded && (remainingStyles.length === 0 || remainingStories.length === 0);

  /**
   * Animate one wheel frame-by-frame. Visuals and sound come from the same
   * frame: a tick plays exactly when a slice edge passes the pointer, and
   * onDone fires on the frame the wheel stops.
   */
  const animateWheel = (
    el: SVGGElement | null,
    from: number,
    to: number,
    ms: number,
    n: number,
    pitch: number,
    onDone: () => void,
  ) => {
    const seg = 360 / n;
    const start = performance.now();
    let lastEdge = Math.floor(from / seg);
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const angle = from + (to - from) * spinEase(t);
      if (el) el.style.transform = `rotate(${angle}deg)`;
      const edge = Math.floor(angle / seg);
      if (edge !== lastEdge && n > 1) sfxRef.current.tick(pitch);
      lastEdge = edge;
      if (t < 1) {
        const id = requestAnimationFrame(step);
        rafs.current.add(id);
      } else {
        onDone();
      }
    };
    const id = requestAnimationFrame(step);
    rafs.current.add(id);
  };

  const boxCenter = (el: HTMLElement | null) => {
    const r = el?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 };
  };

  const landPop = (box: HTMLElement | null) => {
    sfxRef.current.ding();
    const c = boxCenter(box);
    confettiRef.current?.burst(c.x, c.y, prefersReducedMotion() ? 25 : 80, 360, -90, 12);
    const id = ++idRef.current;
    setHits((h) => [...h, { id, x: c.x, y: c.y }]);
    later(() => setHits((h) => h.filter((x) => x.id !== id)), 600);
  };

  const celebrate = (style: string, story: string) => {
    const sfx = sfxRef.current;
    const reduced = prefersReducedMotion();
    setTaken((t) => [...t, { style, story }]);
    setPhase("celebrating");
    busyRef.current = false;
    sfx.airhorn();
    later(() => sfx.slideWhistle(), 900);
    if (!reduced) {
      setShake(true);
      later(() => setShake(false), 650);
    }

    const cf = confettiRef.current;
    const k = reduced ? 0.25 : 1;
    const w = innerWidth;
    const h = innerHeight;
    cf?.burst(0, h, 160 * k, 50, -60, 26);
    cf?.burst(w, h, 160 * k, 50, -120, 26);
    if (!reduced) {
      later(() => cf?.burst(w / 2, h * 0.35, 220, 360, -90, 18), 250);
      later(() => {
        cf?.burst(w * 0.2, h * 0.2, 90, 360, -90, 14);
        cf?.burst(w * 0.8, h * 0.2, 90, 360, -90, 14);
      }, 900);
    }

    const base = ++idRef.current * 1000;
    const lines = [...MEME_LINES].sort(() => Math.random() - 0.5).slice(0, reduced ? 4 : 10);
    setMemes(
      lines.map((text, i) => ({
        id: base + i,
        text,
        left: rand(12, 88),
        top: i % 2 ? rand(8, 30) : rand(70, 92),
        size: rand(28, 60),
        color: pick(MEME_COLORS),
        r0: rand(-60, 60),
        r1: rand(-14, 14),
        delay: i * 0.28,
      })),
    );
    if (!reduced) {
      const pool = [STYLE_EMOJI[style], STORY_EMOJI[story], ...EXTRA_EMOJI];
      setDrops(
        Array.from({ length: 40 }, (_, i) => ({
          id: base + 100 + i,
          emoji: i < 16 ? (i % 2 ? STYLE_EMOJI[style] : STORY_EMOJI[story]) : pick(pool),
          left: rand(0, 100),
          size: rand(28, 64),
          dur: rand(2.2, 4.2),
          delay: rand(0, 2.5),
          spin: rand(-540, 540),
        })),
      );
    }
    later(() => setMemes([]), 6000);
    later(() => setDrops([]), 7500);
  };

  const spin = useCallback(() => {
    if (phase !== "idle" || done || busyRef.current) return;
    busyRef.current = true;
    setResumedCount(0);
    sfxRef.current.unlock();
    const styles = remainingStyles;
    const stories = remainingStories;
    const si = Math.floor(Math.random() * styles.length);
    const ti = Math.floor(Math.random() * stories.length);
    const style = styles[si];
    const story = stories[ti];
    // A wheel with one option left doesn't spin — it's already decided.
    const styleFixed = styles.length === 1;
    const storyFixed = stories.length === 1;

    setFrozen({ styles, stories });
    setLastOne({ style: styleFixed, story: storyFixed });
    setStyleLanded(styleFixed ? style : null);
    setStoryLanded(storyFixed ? story : null);
    setPhase("spinning");

    let pending = (styleFixed ? 0 : 1) + (storyFixed ? 0 : 1);
    const finished = () => {
      pending -= 1;
      if (pending <= 0) later(() => celebrate(style, story), REVEAL_PAUSE_MS);
    };
    if (pending === 0) later(() => celebrate(style, story), REVEAL_PAUSE_MS);

    if (!styleFixed) {
      const from = rotRef.current.style;
      const to = targetRotation(from, styles.length, si, 5);
      rotRef.current.style = to;
      setStyleRot(to);
      animateWheel(styleWheelRef.current, from, to, STYLE_MS, styles.length, 1, () => {
        setStyleLanded(style);
        landPop(styleBoxRef.current);
        finished();
      });
    }
    if (!storyFixed) {
      const from = rotRef.current.story;
      const to = targetRotation(from, stories.length, ti, 8);
      rotRef.current.story = to;
      setStoryRot(to);
      animateWheel(storyWheelRef.current, from, to, STORY_MS, stories.length, 0.75, () => {
        setStoryLanded(story);
        landPop(storyBoxRef.current);
        finished();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, done, remainingStyles.join("|"), remainingStories.join("|")]);

  const nextTeam = useCallback(() => {
    if (phase !== "celebrating") return;
    setPhase("idle");
    setFrozen(null);
    setStyleLanded(null);
    setStoryLanded(null);
    setLastOne({ style: false, story: false });
    setMemes([]);
    setDrops([]);
    if (done) {
      sfxRef.current.ding();
      const cf = confettiRef.current;
      const k = prefersReducedMotion() ? 0.25 : 1;
      cf?.burst(0, innerHeight, 140 * k, 50, -60, 26);
      cf?.burst(innerWidth, innerHeight, 140 * k, 50, -120, 26);
    }
  }, [phase, done]);

  const doReset = () => {
    setTaken([]);
    setFrozen(null);
    setPhase("idle");
    setStyleLanded(null);
    setStoryLanded(null);
    setLastOne({ style: false, story: false });
    setResumedCount(0);
  };

  const reset = () => {
    if (phase === "spinning") return;
    if (!confirm("Reset all teams and put every option back on the wheels?")) return;
    doReset();
  };

  /** Skip the wheels: randomly pair every remaining style with a remaining story and jump to the lineup. */
  const instantPick = () => {
    if (phase !== "idle" || done) return;
    if (!confirm("Instantly assign all remaining teams (no spinning) and jump to the lineup?")) return;
    const shuffle = <T,>(arr: T[]) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const styles = shuffle(remainingStyles);
    const stories = shuffle(remainingStories);
    const count = Math.min(styles.length, stories.length);
    const picks = Array.from({ length: count }, (_, i) => ({ style: styles[i], story: stories[i] }));
    setResumedCount(0);
    setTaken((t) => [...t, ...picks]);
    sfxRef.current.airhorn();
    const cf = confettiRef.current;
    const k = prefersReducedMotion() ? 0.25 : 1;
    cf?.burst(0, innerHeight, 160 * k, 50, -60, 26);
    cf?.burst(innerWidth, innerHeight, 160 * k, 50, -120, 26);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sfxRef.current.muted = next;
    if (!next) sfxRef.current.ding(); // doubles as a sound check
  };

  // Space / Enter: spin or advance
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "Enter") return;
      e.preventDefault();
      if (phase === "idle") spin();
      else if (phase === "celebrating") nextTeam();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, spin, nextTeam]);

  const showFinal = done && phase === "idle";
  const teamNumber = taken.length;
  const latest = taken[taken.length - 1];

  const wheels = [
    { label: "STYLE", items: wheelStyles, rot: styleRot, ref: styleWheelRef, box: styleBoxRef, landed: styleLanded, fixed: lastOne.style, emoji: STYLE_EMOJI, offset: 0 },
    { label: "BIBLE STORY", items: wheelStories, rot: storyRot, ref: storyWheelRef, box: storyBoxRef, landed: storyLanded, fixed: lastOne.story, emoji: STORY_EMOJI, offset: 4 },
  ];

  return (
    <div className={s.root}>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-50" />

      <div className={`${shake ? s.shake : ""} flex flex-col items-center px-4 sm:px-8 pt-4 pb-6 gap-3 ${showFinal ? "min-h-screen lg:h-screen" : "min-h-screen"}`}>
        <header className={`flex w-full ${showFinal ? "" : "max-w-7xl"} items-center justify-between gap-4`}>
          <button
            onClick={toggleMute}
            className="text-2xl rounded-full bg-white/10 hover:bg-white/20 w-12 h-12 shrink-0"
            title={muted ? "Unmute (plays a test sound)" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          {showFinal ? (
            <h1 className="text-2xl lg:text-3xl font-black tracking-[0.3em] text-white/80 text-center">THE LINEUP</h1>
          ) : (
            <h1 className={`${s.title} text-4xl lg:text-5xl font-black tracking-tight text-center`}>SKIT SPINNER</h1>
          )}
          <div className="flex gap-2 shrink-0">
            {!done && (
              <button
                onClick={instantPick}
                disabled={phase !== "idle" || !loaded}
                className="text-sm font-semibold rounded-full bg-white/10 hover:bg-white/20 px-4 h-12 disabled:opacity-40"
                title="Assign all remaining teams instantly, no spinning"
              >
                ⚡ Instant
              </button>
            )}
            <button
              onClick={reset}
              disabled={phase === "spinning"}
              className="text-sm font-semibold rounded-full bg-white/10 hover:bg-white/20 px-4 h-12 disabled:opacity-40"
            >
              Reset
            </button>
          </div>
        </header>

        {showFinal ? (
          <ol className="grid w-full flex-1 min-h-0 gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {taken.map((t, i) => (
              <li
                key={i}
                className={`${s.landedChip} flex flex-col items-center justify-center text-center rounded-3xl px-4 py-3 text-[#1a0b3b] shadow-2xl min-h-0`}
                style={{
                  background: WHEEL_COLORS[i % WHEEL_COLORS.length],
                  animationDelay: `${i * 0.12}s`,
                  fontSize: "clamp(1.1rem, min(2.5vw, 4.4vh), 3rem)",
                }}
              >
                <div className="font-black tracking-[0.25em] opacity-70 text-[0.65em] mb-[0.4em]">TEAM {i + 1}</div>
                <div className="font-black leading-[1.1]">
                  {STYLE_EMOJI[t.style]} {t.style}
                </div>
                <div className="font-black text-white text-[0.8em] leading-none my-[0.35em]">×</div>
                <div className="font-black leading-[1.1]">
                  {STORY_EMOJI[t.story]} {t.story}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] items-start flex-1">
            <div className="flex flex-col items-center gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full items-start">
                {wheels.map((w) => (
                  <section key={w.label} className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-white/90">{w.label}</h2>
                    <div
                      ref={w.box}
                      className="w-full mt-3 max-w-[min(520px,80vw)] md:max-w-[min(520px,40vw,56vh)] lg:max-w-[min(520px,34vw,56vh)]"
                    >
                      <Wheel ref={w.ref} items={w.items} rotation={w.rot} colorOffset={w.offset} />
                    </div>
                    <div className="min-h-14 flex items-center">
                      {w.landed ? (
                        <div className={`${s.landedChip} rounded-2xl bg-white text-[#1a0b3b] px-5 py-2 text-xl sm:text-2xl font-black shadow-xl text-center`}>
                          {w.emoji[w.landed]} {w.landed}
                          {w.fixed && <span className="block text-xs tracking-widest text-[#a55eea]">LAST ONE LEFT</span>}
                        </div>
                      ) : phase === "spinning" ? (
                        <div className={`${s.wiggle} text-3xl`}>🤔</div>
                      ) : null}
                    </div>
                  </section>
                ))}
              </div>

              {done && phase !== "spinning" ? (
                <div className="text-3xl sm:text-5xl font-black text-center">ALL TEAMS ASSIGNED 🎉</div>
              ) : (
                <button
                  onClick={spin}
                  disabled={phase !== "idle" || !loaded}
                  className={`${s.spinButton} rounded-full px-12 py-4 text-2xl sm:text-4xl font-black tracking-wider`}
                >
                  {phase === "spinning" ? "SPINNING…" : `🔥 SPIN FOR TEAM ${teamNumber + 1} 🔥`}
                </button>
              )}
            </div>

            <aside className="w-full max-w-3xl mx-auto lg:max-w-none lg:mt-12">
              {resumedCount > 0 && phase === "idle" && (
                <div className="mb-4 flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-[#ffd32a] text-[#1a0b3b] px-4 py-3 text-sm font-semibold text-center">
                  <span>
                    Picking up a saved game: {resumedCount} team{resumedCount === 1 ? "" : "s"} already assigned.
                  </span>
                  <button onClick={doReset} className="rounded-full bg-[#1a0b3b] text-white px-4 py-1 text-sm">
                    Start fresh
                  </button>
                  <button onClick={() => setResumedCount(0)} className="rounded-full bg-black/10 px-4 py-1 text-sm">
                    Keep going
                  </button>
                </div>
              )}
              <h3 className="text-sm uppercase tracking-[0.25em] text-white/50 mb-2 text-center lg:text-left">
                Teams ({taken.length}/{Math.min(STYLES.length, STORIES.length)})
              </h3>
              {taken.length === 0 ? (
                <p className="text-white/40 text-sm text-center lg:text-left">No teams yet. Hit spin!</p>
              ) : (
                <ol className="grid sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
                  {taken.map((t, i) => (
                    <li key={i} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm leading-snug">
                      <span className="font-black text-[#ffd32a] mr-1.5">{i + 1}.</span>
                      {STYLE_EMOJI[t.style]} {t.style} × {STORY_EMOJI[t.story]} {t.story}
                    </li>
                  ))}
                </ol>
              )}
            </aside>
          </div>
        )}
      </div>

      {hits.map((h) => (
        <div key={h.id} className={s.hitmarker} style={{ left: h.x, top: h.y, fontSize: 120 }}>
          ❌
        </div>
      ))}

      {phase === "celebrating" && latest && (
        <div className={s.overlay} onClick={nextTeam}>
          <div className={s.glasses} style={{ fontSize: "min(18vw, 160px)" }}>
            😎
          </div>
          <div className={`${s.resultCard} text-center px-6`}>
            <div className="text-2xl sm:text-4xl font-black tracking-[0.3em] text-[#ffd32a] mb-4">TEAM {teamNumber}</div>
            <div className={`${s.pulse} font-black leading-tight`}>
              <div className="text-5xl sm:text-7xl lg:text-8xl">
                {STYLE_EMOJI[latest.style]} {latest.style.toUpperCase()}
              </div>
              <div className="text-4xl sm:text-6xl my-3 text-[#ff4757]">×</div>
              <div className="text-5xl sm:text-7xl lg:text-8xl">
                {STORY_EMOJI[latest.story]} {latest.story.toUpperCase()}
              </div>
            </div>
            <button onClick={nextTeam} className={`${s.spinButton} mt-10 rounded-full px-10 py-4 text-2xl font-black`}>
              {done ? "SEE ALL TEAMS ➜" : "NEXT TEAM ➜"}
            </button>
          </div>
        </div>
      )}

      {memes.map((m) => (
        <div
          key={m.id}
          className={s.meme}
          style={
            {
              left: `${m.left}%`,
              top: `${m.top}%`,
              fontSize: m.size,
              color: m.color,
              animationDelay: `${m.delay}s`,
              "--r0": `${m.r0}deg`,
              "--r1": `${m.r1}deg`,
            } as CSSProperties
          }
        >
          {m.text}
        </div>
      ))}

      {drops.map((d) => (
        <div
          key={d.id}
          className={s.rain}
          style={
            {
              left: `${d.left}%`,
              fontSize: d.size,
              animationDuration: `${d.dur}s`,
              animationDelay: `${d.delay}s`,
              "--spin": `${d.spin}deg`,
            } as CSSProperties
          }
        >
          {d.emoji}
        </div>
      ))}
    </div>
  );
}
