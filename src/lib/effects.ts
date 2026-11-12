// Hand-rolled confetti + Web Audio sound effects. No dependencies.

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  life: number;
  shape: "rect" | "circle";
};

const COLORS = ["#ff4757", "#ffa502", "#ffd32a", "#2ed573", "#1e90ff", "#a55eea", "#ff6b81", "#ffffff"];

export class Confetti {
  private particles: Particle[] = [];
  private raf = 0;
  constructor(private canvas: HTMLCanvasElement) {}

  burst(x: number, y: number, count: number, spread = 360, angle = -90, power = 14) {
    for (let i = 0; i < count; i++) {
      const a = ((angle + (Math.random() - 0.5) * spread) * Math.PI) / 180;
      const p = power * (0.4 + Math.random() * 0.8);
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * p,
        vy: Math.sin(a) * p,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        w: 6 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        shape: Math.random() < 0.25 ? "circle" : "rect",
      });
    }
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  }

  private tick = () => {
    const c = this.canvas;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== c.clientWidth * dpr || c.height !== c.clientHeight * dpr) {
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
    }
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    this.particles = this.particles.filter((p) => p.life > 0 && p.y < c.clientHeight + 40);
    for (const p of this.particles) {
      p.vy += 0.32;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.004;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)) + 1);
      }
      ctx.restore();
    }
    this.raf = this.particles.length ? requestAnimationFrame(this.tick) : 0;
  };

  destroy() {
    cancelAnimationFrame(this.raf);
  }
}

export class Sfx {
  private ctx: AudioContext | null = null;
  muted = false;

  private ac(): AudioContext | null {
    if (this.muted || typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private tone(freq: number, start: number, dur: number, type: OscillatorType, vol: number, endFreq?: number) {
    const ctx = this.ac();
    if (!ctx) return;
    const t = ctx.currentTime + start;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  unlock() {
    this.ac();
  }

  tick(pitch = 1) {
    this.tone(1400 * pitch, 0, 0.04, "square", 0.05);
  }

  ding() {
    this.tone(880, 0, 0.35, "triangle", 0.25);
    this.tone(1320, 0.08, 0.45, "triangle", 0.2);
  }

  airhorn() {
    const pulses = [0, 0.18, 0.36, 0.6];
    for (const s of pulses) {
      const d = s === 0.6 ? 0.9 : 0.14;
      this.tone(415, s, d, "sawtooth", 0.12);
      this.tone(523, s, d, "sawtooth", 0.1);
      this.tone(622, s, d, "sawtooth", 0.08);
    }
  }

  slideWhistle() {
    this.tone(400, 0, 0.6, "sine", 0.2, 1600);
  }

  /** Family Feud wrong-answer buzzer. */
  buzzer() {
    this.tone(110, 0, 0.9, "sawtooth", 0.22);
    this.tone(116, 0, 0.9, "square", 0.12);
  }

  /** Answer-reveal "ding" (bright bell). */
  bell() {
    this.tone(1046, 0, 0.6, "triangle", 0.3);
    this.tone(1568, 0.02, 0.5, "sine", 0.15);
  }

  /** Points awarded. */
  chaChing() {
    [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, i * 0.07, 0.25, "square", 0.08));
  }

  /** Short fanfare for a match win. */
  fanfare() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, i * 0.14, i === 3 ? 0.7 : 0.18, "sawtooth", 0.09));
  }
}
