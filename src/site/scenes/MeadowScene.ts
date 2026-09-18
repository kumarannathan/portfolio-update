import { Scene, PointerEvt, mulberry32, grainTile, applyGrain, feather, lerp, clamp } from './canvas';

type Blade = { x: number; y: number; len: number; lean: number; width: number; color: string; phase: number };
type Firefly = { x: number; y: number; a: number; sp: number; phase: number; f: number; life: number };
type Tree = { x: number; w: number; h: number };

const TAU = Math.PI * 2;

/**
 * A meadow at dusk with fireflies. Move the cursor to stir them,
 * click to release a few more.
 */
export class MeadowScene implements Scene {
  private w = 0;
  private h = 0;
  private grain = grainTile(180, 0.17, 11);
  private blades: Blade[] = [];
  private flies: Firefly[] = [];
  private trees: Tree[] = [];
  private rng = mulberry32(7);
  private cursor: { x: number; y: number } | null = null;

  setup(w: number, h: number) {
    this.w = w;
    this.h = h;
    const rng = mulberry32(7);
    this.rng = mulberry32(77);
    const horizon = 0.46 * h;
    const s = w / 900;

    this.trees = [];
    let x = -20;
    while (x < w + 20) {
      const tw = lerp(30, 90, rng()) * s;
      this.trees.push({ x, w: tw, h: lerp(10, 34, rng()) * s });
      x += tw * lerp(0.5, 0.8, rng());
    }

    this.blades = [];
    const count = Math.round(520 * s);
    for (let i = 0; i < count; i++) {
      const depth = rng(); // 0 far, 1 near
      const y = lerp(horizon + 6, h + 4, depth * depth);
      const len = lerp(6, 46, depth) * s * lerp(0.7, 1.2, rng());
      const hue = 78 + rng() * 30;
      const light = lerp(30, 20, depth) + rng() * 12;
      this.blades.push({
        x: rng() * w,
        y,
        len,
        lean: (rng() - 0.5) * 0.9,
        width: lerp(0.7, 1.6, depth) * s,
        color: `hsla(${hue}, ${26 + rng() * 16}%, ${light}%, ${0.55 + depth * 0.4})`,
        phase: rng() * TAU
      });
    }
    this.blades.sort((a, b) => a.y - b.y);

    if (this.flies.length === 0) {
      for (let i = 0; i < 34; i++) this.spawnFly(rng() * w, lerp(horizon - 20, h - 10, rng()));
    }
  }

  private spawnFly(x: number, y: number) {
    const rng = this.rng;
    this.flies.push({
      x,
      y,
      a: rng() * TAU,
      sp: lerp(6, 16, rng()),
      phase: rng() * TAU,
      f: lerp(0.5, 1.4, rng()),
      life: 1
    });
  }

  pointer(e: PointerEvt) {
    if (e.type === 'leave') {
      this.cursor = null;
      return;
    }
    this.cursor = { x: e.x, y: e.y };
    if (e.type === 'down') {
      for (let i = 0; i < 6; i++) {
        this.spawnFly(e.x + (this.rng() - 0.5) * 24, e.y + (this.rng() - 0.5) * 24);
      }
      if (this.flies.length > 90) this.flies.splice(0, this.flies.length - 90);
    }
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) {
    const horizon = 0.46 * h;
    const s = w / 900;

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, '#e6d3c6');
    sky.addColorStop(0.6, '#d9c3c6');
    sky.addColorStop(1, '#c9bcc8');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, horizon + 2);

    // Sun glow low on the horizon
    const sg = ctx.createRadialGradient(0.72 * w, horizon, 0, 0.72 * w, horizon, 0.5 * w);
    sg.addColorStop(0, 'rgba(255, 214, 170, 0.55)');
    sg.addColorStop(1, 'rgba(255, 214, 170, 0)');
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, w, horizon + 2);

    // Tree line
    ctx.fillStyle = '#4d5a44';
    for (const tr of this.trees) {
      ctx.beginPath();
      ctx.ellipse(tr.x + tr.w / 2, horizon + 2, tr.w / 2, tr.h, 0, Math.PI, TAU);
      ctx.fill();
    }

    // Field
    const field = ctx.createLinearGradient(0, horizon, 0, h);
    field.addColorStop(0, '#6f8a58');
    field.addColorStop(0.5, '#5a7548');
    field.addColorStop(1, '#3e5634');
    ctx.fillStyle = field;
    ctx.fillRect(0, horizon, w, h - horizon);

    // Rolling shade bands
    ctx.fillStyle = 'rgba(30, 50, 30, 0.12)';
    ctx.beginPath();
    ctx.ellipse(0.3 * w, horizon + 0.22 * h, 0.5 * w, 0.06 * h, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = 'rgba(210, 230, 170, 0.1)';
    ctx.beginPath();
    ctx.ellipse(0.75 * w, horizon + 0.36 * h, 0.45 * w, 0.06 * h, 0, 0, TAU);
    ctx.fill();

    // Grass
    ctx.lineCap = 'round';
    for (const b of this.blades) {
      const sway = Math.sin(t * 1.4 + b.phase + b.x * 0.01) * (b.len * 0.09);
      const tipX = b.x + b.lean * b.len * 0.5 + sway;
      const tipY = b.y - b.len;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.quadraticCurveTo(b.x + b.lean * b.len * 0.2 + sway * 0.4, b.y - b.len * 0.55, tipX, tipY);
      ctx.strokeStyle = b.color;
      ctx.lineWidth = b.width;
      ctx.stroke();
    }

    // Fireflies
    for (const f of this.flies) {
      f.a += (this.rng() - 0.5) * 0.5;
      f.x += Math.cos(f.a) * f.sp * s * dt;
      f.y += Math.sin(f.a) * f.sp * s * dt * 0.7 + Math.sin(t * 1.7 + f.phase) * 0.15;
      if (this.cursor) {
        const dx = f.x - this.cursor.x;
        const dy = f.y - this.cursor.y;
        const d = Math.hypot(dx, dy);
        if (d < 90 * s && d > 0.1) {
          const push = (1 - d / (90 * s)) * 40 * s * dt;
          f.x += (dx / d) * push;
          f.y += (dy / d) * push;
        }
      }
      f.x = clamp(f.x, -10, w + 10);
      f.y = clamp(f.y, horizon - 40 * s, h + 5);

      const blink = Math.max(0, Math.sin(t * f.f + f.phase));
      const a = 0.12 + 0.88 * blink * blink * blink;
      const r = (5 + 3 * blink) * s;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
      g.addColorStop(0, `rgba(255, 238, 150, ${0.75 * a})`);
      g.addColorStop(1, 'rgba(255, 238, 150, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(f.x - r, f.y - r, r * 2, r * 2);
      ctx.beginPath();
      ctx.arc(f.x, f.y, 1.1 * s, 0, TAU);
      ctx.fillStyle = `rgba(255, 250, 200, ${0.4 + 0.6 * a})`;
      ctx.fill();
    }

    applyGrain(ctx, this.grain, w, h, 0.8);
    feather(ctx, w, h, 0.07, 0.12);
  }
}
