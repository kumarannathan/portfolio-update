import { Scene, PointerEvt, mulberry32, grainTile, applyGrain, feather, clamp, lerp } from './canvas';

type Fish = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  phase: number;
  tx: number;
  ty: number;
  retarget: number;
  food: Flake | null;
  born: number;
};
type Flake = { x: number; y: number; vy: number; drift: number; claimedBy: number | null; age: number; settled: boolean };
type Bubble = { x: number; y: number; r: number; vy: number; wob: number };
type Pebble = { x: number; y: number; r: number; shade: number };
type Floater = { x: number; y: number; r: number; leaves: number; phase: number; drift: number };
type Shrimp = { x: number; dir: number; pauseUntil: number; phase: number; speed: number };
type Ray = { u: number; width: number; phase: number };

const TAU = Math.PI * 2;

/**
 * A planted tank on a wooden table, lit by a desk lamp. Click the water to
 * sprinkle food; the fish come up for it. Whatever they miss sinks to the
 * shrimp, and if you overfeed, algae starts to creep up the glass.
 */
export class AquariumScene implements Scene {
  private w = 0;
  private h = 0;
  private t = 0;
  private grain = grainTile(180, 0.17, 9);
  private fish: Fish[] = [];
  private flakes: Flake[] = [];
  private bubbles: Bubble[] = [];
  private pebbles: Pebble[] = [];
  private floaters: Floater[] = [];
  private shrimp: Shrimp[] = [];
  private rays: Ray[] = [];
  private algaeLevel = 0;
  private rng = mulberry32(13);
  private nextId = 1;

  // Layout (fractions of canvas size), computed in setup.
  private tank = { x0: 0, x1: 0, top: 0, water: 0, gravel: 0, bottom: 0 };
  private lamp = { baseX: 0, baseY: 0, headX: 0, headY: 0 };

  get fishCount() {
    return this.fish.length;
  }

  /** 0 = crystal clear, 1 = very green. */
  get algae() {
    return this.algaeLevel;
  }

  setup(w: number, h: number) {
    this.w = w;
    this.h = h;
    const rng = mulberry32(13);
    this.rng = mulberry32(131);
    const s = w / 900;

    const tableY = 0.8 * h;
    this.tank = {
      x0: 0.19 * w,
      x1: 0.81 * w,
      top: 0.2 * h,
      water: 0.25 * h,
      gravel: tableY - 0.075 * h,
      bottom: tableY
    };
    this.lamp = { baseX: 0.9 * w, baseY: tableY, headX: 0.7 * w, headY: 0.11 * h };

    const tk = this.tank;
    this.pebbles = [];
    for (let i = 0; i < Math.round(140 * s); i++) {
      this.pebbles.push({
        x: lerp(tk.x0 + 4, tk.x1 - 4, rng()),
        y: lerp(tk.gravel + 2, tk.bottom - 3, rng()),
        r: lerp(1.4, 3.6, rng()) * s,
        shade: rng()
      });
    }

    this.rays = [];
    for (let i = 0; i < 6; i++) {
      this.rays.push({ u: lerp(0.08, 0.92, rng()), width: lerp(0.04, 0.11, rng()), phase: rng() * TAU });
    }

    if (this.floaters.length === 0) {
      for (let i = 0; i < 7; i++) {
        this.floaters.push({
          x: lerp(0.05, 0.95, rng()),
          y: 0,
          r: lerp(4, 7, rng()) * s,
          leaves: 2 + Math.floor(rng() * 3),
          phase: rng() * TAU,
          drift: (rng() - 0.5) * 0.004
        });
      }
    }

    if (this.shrimp.length === 0) {
      for (let i = 0; i < 3; i++) {
        this.shrimp.push({ x: lerp(0.1, 0.9, rng()), dir: rng() < 0.5 ? -1 : 1, pauseUntil: 0, phase: rng() * TAU, speed: lerp(4, 8, rng()) });
      }
    }

    if (this.bubbles.length === 0) {
      for (let i = 0; i < 10; i++) this.spawnBubble(true);
    }

    if (this.fish.length === 0) {
      this.addFish(0.4, 0.5);
      this.addFish(0.6, 0.62);
      this.addFish(0.5, 0.4);
    } else {
      for (const f of this.fish) {
        f.x = clamp(f.x, tk.x0 + 20, tk.x1 - 20);
        f.y = clamp(f.y, tk.water + 16, tk.gravel - 10);
      }
    }
  }

  /** Coordinates are fractions of the water box when called from setup. */
  addFish(fx?: number, fy?: number) {
    if (this.fish.length >= 8) return;
    const rng = this.rng;
    const tk = this.tank;
    const palette = [22, 8, 32, 205, 350, 40];
    const f: Fish = {
      id: this.nextId++,
      x: lerp(tk.x0 + 30, tk.x1 - 30, fx ?? rng()),
      y: lerp(tk.water + 20, tk.gravel - 20, fy ?? rng()),
      vx: (rng() < 0.5 ? -1 : 1) * 10,
      vy: 0,
      size: lerp(0.85, 1.2, rng()),
      hue: palette[Math.floor(rng() * palette.length)],
      phase: rng() * TAU,
      tx: 0,
      ty: 0,
      retarget: 0,
      food: null,
      born: this.t
    };
    this.pickTarget(f);
    this.fish.push(f);
  }

  private pickTarget(f: Fish) {
    const rng = this.rng;
    const tk = this.tank;
    f.tx = lerp(tk.x0 + 30, tk.x1 - 30, rng());
    f.ty = lerp(tk.water + 22, tk.gravel - 22, rng());
    f.retarget = this.t + lerp(2, 6, rng());
    f.food = null;
  }

  private spawnBubble(anywhere = false) {
    const rng = this.rng;
    const s = this.w / 900;
    const tk = this.tank;
    const x = tk.x0 + 0.12 * (tk.x1 - tk.x0);
    this.bubbles.push({
      x: x + (rng() - 0.5) * 8 * s,
      y: anywhere ? lerp(tk.water, tk.gravel, rng()) : tk.gravel - 2,
      r: lerp(1, 2.6, rng()) * s,
      vy: lerp(18, 34, rng()) * s,
      wob: rng() * TAU
    });
  }

  pointer(e: PointerEvt) {
    if (e.type !== 'down') return;
    const tk = this.tank;
    if (e.x < tk.x0 || e.x > tk.x1 || e.y < tk.top - 10 || e.y > tk.bottom) return;
    const rng = this.rng;
    const s = this.w / 900;
    for (let i = 0; i < 6; i++) {
      this.flakes.push({
        x: clamp(e.x + (rng() - 0.5) * 26 * s, tk.x0 + 6, tk.x1 - 6),
        y: tk.water + 2 + rng() * 6,
        vy: lerp(5, 11, rng()),
        drift: (rng() - 0.5) * 10,
        claimedBy: null,
        age: 0,
        settled: false
      });
    }
    if (this.flakes.length > 40) this.flakes.splice(0, this.flakes.length - 40);
    // Overfeeding: every pinch nudges the algae up; the tank clears itself slowly.
    this.algaeLevel = clamp(this.algaeLevel + 0.06, 0, 1);
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) {
    this.t = t;
    const s = w / 900;
    const tk = this.tank;

    // Algae fades on its own, faster while there's no food lying around.
    const leftover = this.flakes.filter((f) => f.settled).length;
    this.algaeLevel = clamp(this.algaeLevel + (leftover * 0.004 - 0.008) * dt, 0, 1);
    const algae = this.algaeLevel;

    this.drawRoom(ctx, w, h, s);
    this.drawTable(ctx, w, h, s);

    // --- inside the tank ---
    ctx.save();
    ctx.beginPath();
    ctx.rect(tk.x0, tk.top, tk.x1 - tk.x0, tk.bottom - tk.top);
    ctx.clip();

    // Water
    const water = ctx.createLinearGradient(0, tk.water, 0, tk.bottom);
    water.addColorStop(0, `rgb(${Math.round(lerp(96, 90, algae))}, ${Math.round(lerp(150, 158, algae))}, ${Math.round(lerp(168, 120, algae))})`);
    water.addColorStop(1, `rgb(${Math.round(lerp(50, 52, algae))}, ${Math.round(lerp(96, 110, algae))}, ${Math.round(lerp(120, 82, algae))})`);
    ctx.fillStyle = water;
    ctx.fillRect(tk.x0, tk.water, tk.x1 - tk.x0, tk.bottom - tk.water);

    this.drawLightCone(ctx, s, t);
    this.drawGravel(ctx, s);
    this.drawDriftwoodAndPlants(ctx, s, t);
    this.updateShrimp(t, dt, s);
    for (const sh of this.shrimp) this.drawShrimp(ctx, sh, t, s);
    this.updateFlakes(t, dt, s);
    this.drawFlakes(ctx, t, s);
    this.updateFish(t, dt, s);
    for (const f of this.fish) this.drawFish(ctx, f, t, s);
    this.drawBubbles(ctx, t, dt, s);
    this.drawFloaters(ctx, t, dt, s);
    this.drawSurface(ctx, t, s);
    this.drawAlgae(ctx, s, algae);
    ctx.restore();

    this.drawGlass(ctx, s);
    this.drawLamp(ctx, s, t);

    applyGrain(ctx, this.grain, w, h, 0.8);
    feather(ctx, w, h, 0.055, 0.085);
  }

  private drawRoom(ctx: CanvasRenderingContext2D, w: number, h: number, s: number) {
    ctx.fillStyle = '#e7dfd4';
    ctx.fillRect(0, 0, w, h);
    // Lamp glow on the wall
    const { headX, headY } = this.lamp;
    const g = ctx.createRadialGradient(headX, headY, 0, headX, headY, 0.45 * w);
    g.addColorStop(0, 'rgba(255, 232, 190, 0.5)');
    g.addColorStop(0.4, 'rgba(255, 232, 190, 0.14)');
    g.addColorStop(1, 'rgba(255, 232, 190, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // Soft vignette at the edges
    const v = ctx.createRadialGradient(0.5 * w, 0.5 * h, 0.3 * w, 0.5 * w, 0.5 * h, 0.9 * w);
    v.addColorStop(0, 'rgba(60, 40, 30, 0)');
    v.addColorStop(1, 'rgba(60, 40, 30, 0.12)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
    void s;
  }

  private drawTable(ctx: CanvasRenderingContext2D, w: number, h: number, s: number) {
    const top = this.tank.bottom;
    // Table top
    const wood = ctx.createLinearGradient(0, top, 0, h);
    wood.addColorStop(0, '#a8784f');
    wood.addColorStop(0.08, '#96693f');
    wood.addColorStop(0.09, '#6e4a2b');
    wood.addColorStop(1, '#4f351f');
    ctx.fillStyle = wood;
    ctx.fillRect(0, top, w, h - top);
    // Grain lines on the top surface
    ctx.strokeStyle = 'rgba(70, 40, 20, 0.18)';
    ctx.lineWidth = 1;
    const rng = mulberry32(5);
    for (let i = 0; i < 14; i++) {
      const y = top + 2 + rng() * 0.07 * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 30) ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * 1.5 * s);
      ctx.stroke();
    }
    // Front edge highlight
    ctx.fillStyle = 'rgba(255, 220, 170, 0.18)';
    ctx.fillRect(0, top, w, 2 * s);
    // Shadow under the tank
    const sh = ctx.createLinearGradient(0, top, 0, top + 0.06 * h);
    sh.addColorStop(0, 'rgba(20, 10, 5, 0.35)');
    sh.addColorStop(1, 'rgba(20, 10, 5, 0)');
    ctx.fillStyle = sh;
    ctx.fillRect(this.tank.x0 - 6 * s, top, this.tank.x1 - this.tank.x0 + 12 * s, 0.06 * h);
  }

  private drawLightCone(ctx: CanvasRenderingContext2D, s: number, t: number) {
    const tk = this.tank;
    const { headX, headY } = this.lamp;
    // The lamp points down and to the left; the cone lands across the gravel.
    const landL = tk.x0 + 0.05 * (tk.x1 - tk.x0);
    const landR = tk.x0 + 0.85 * (tk.x1 - tk.x0);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const cone = ctx.createLinearGradient(headX, headY, headX - 0.2 * this.w, tk.bottom);
    cone.addColorStop(0, 'rgba(255, 236, 190, 0.22)');
    cone.addColorStop(1, 'rgba(255, 236, 190, 0.02)');
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(headX - 10 * s, headY);
    ctx.lineTo(headX + 10 * s, headY);
    ctx.lineTo(landR, tk.bottom);
    ctx.lineTo(landL, tk.bottom);
    ctx.closePath();
    ctx.fill();

    // Drifting rays inside the cone
    for (const r of this.rays) {
      const u = r.u + Math.sin(t * 0.18 + r.phase) * 0.05;
      const bx = lerp(landL, landR, u);
      const bw = r.width * (landR - landL);
      const a = 0.05 + 0.05 * (0.5 + 0.5 * Math.sin(t * 0.5 + r.phase));
      const g = ctx.createLinearGradient(headX, headY, bx, tk.bottom);
      g.addColorStop(0, `rgba(255, 245, 210, ${a * 1.6})`);
      g.addColorStop(0.7, `rgba(255, 245, 210, ${a})`);
      g.addColorStop(1, 'rgba(255, 245, 210, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(headX - 3 * s, headY);
      ctx.lineTo(headX + 3 * s, headY);
      ctx.lineTo(bx + bw / 2, tk.bottom);
      ctx.lineTo(bx - bw / 2, tk.bottom);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  private drawGravel(ctx: CanvasRenderingContext2D, s: number) {
    const tk = this.tank;
    const g = ctx.createLinearGradient(0, tk.gravel, 0, tk.bottom);
    g.addColorStop(0, '#b6a082');
    g.addColorStop(1, '#7f6a52');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(tk.x0, tk.gravel + 3 * s);
    for (let x = tk.x0; x <= tk.x1; x += 20) ctx.lineTo(x, tk.gravel + Math.sin(x * 0.035) * 2.5 * s);
    ctx.lineTo(tk.x1, tk.bottom);
    ctx.lineTo(tk.x0, tk.bottom);
    ctx.closePath();
    ctx.fill();
    for (const p of this.pebbles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, TAU);
      ctx.fillStyle = `hsla(${28 + p.shade * 18}, 20%, ${44 + p.shade * 30}%, 0.9)`;
      ctx.fill();
    }
  }

  private drawDriftwoodAndPlants(ctx: CanvasRenderingContext2D, s: number, t: number) {
    const tk = this.tank;
    const tw = tk.x1 - tk.x0;
    const gy = tk.gravel;

    // Driftwood: one gnarled branch resting left of centre.
    const wx = tk.x0 + 0.22 * tw;
    ctx.save();
    ctx.translate(wx, gy + 2 * s);
    ctx.scale(s * (tw / 560), s * (tw / 560));
    ctx.fillStyle = '#5c3f2a';
    ctx.beginPath();
    ctx.moveTo(-70, 6);
    ctx.bezierCurveTo(-50, -10, -20, -14, 10, -18);
    ctx.bezierCurveTo(40, -22, 70, -50, 96, -74);
    ctx.lineTo(104, -66);
    ctx.bezierCurveTo(84, -40, 60, -12, 30, -6);
    ctx.bezierCurveTo(50, -4, 80, 0, 100, 4);
    ctx.lineTo(96, 10);
    ctx.bezierCurveTo(60, 8, 20, 6, -10, 8);
    ctx.bezierCurveTo(-40, 10, -60, 12, -74, 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(30, 18, 10, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-60, 4);
    ctx.bezierCurveTo(-30, -6, 10, -10, 40, -14);
    ctx.stroke();
    ctx.restore();

    // Java fern: long wavy leaves growing off the driftwood.
    const fernBase = { x: wx + 0.06 * tw, y: gy - 0.012 * this.h };
    ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) {
      const spread = (i - 4) * 0.22;
      const len = (0.16 + (i % 3) * 0.04) * (tk.bottom - tk.water);
      const sway = Math.sin(t * 0.8 + i) * 4 * s;
      const tipX = fernBase.x + Math.sin(spread) * len * 0.9 + sway;
      const tipY = fernBase.y - Math.cos(spread) * len;
      const cx = fernBase.x + Math.sin(spread) * len * 0.3 - sway * 0.5;
      const cy = fernBase.y - Math.cos(spread) * len * 0.55;
      ctx.beginPath();
      ctx.moveTo(fernBase.x, fernBase.y);
      ctx.quadraticCurveTo(cx, cy, tipX, tipY);
      ctx.strokeStyle = 'rgba(46, 96, 52, 0.95)';
      ctx.lineWidth = 4.2 * s;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(96, 150, 84, 0.7)';
      ctx.lineWidth = 1.4 * s;
      ctx.stroke();
    }

    // Anubias: broad rounded leaves, low, on the right.
    const ax = tk.x0 + 0.74 * tw;
    for (let i = 0; i < 6; i++) {
      const ang = -Math.PI / 2 + (i - 2.5) * 0.42;
      const len = (0.07 + (i % 2) * 0.025) * (tk.bottom - tk.water);
      const sway = Math.sin(t * 0.6 + i * 1.3) * 1.5 * s;
      const lx = ax + Math.cos(ang) * len + sway;
      const ly = gy - Math.abs(Math.sin(ang)) * len;
      ctx.strokeStyle = 'rgba(40, 80, 44, 0.9)';
      ctx.lineWidth = 1.6 * s;
      ctx.beginPath();
      ctx.moveTo(ax, gy);
      ctx.lineTo(lx, ly);
      ctx.stroke();
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(ang + Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(0, -9 * s, 7 * s, 11 * s, 0, 0, TAU);
      ctx.fillStyle = 'rgba(38, 84, 46, 0.96)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(120, 170, 110, 0.5)';
      ctx.lineWidth = 0.8 * s;
      ctx.beginPath();
      ctx.moveTo(0, -1 * s);
      ctx.lineTo(0, -18 * s);
      ctx.stroke();
      ctx.restore();
    }

    // A couple of short grassy tufts for texture.
    for (let i = 0; i < 5; i++) {
      const bx = tk.x0 + (0.5 + i * 0.06) * tw;
      for (let k = 0; k < 4; k++) {
        const sway = Math.sin(t * 1.1 + i + k) * 2 * s;
        ctx.beginPath();
        ctx.moveTo(bx + k * 2 * s, gy + 1);
        ctx.quadraticCurveTo(bx + k * 2 * s + sway, gy - 12 * s, bx + (k - 1.5) * 3 * s + sway * 1.5, gy - 22 * s);
        ctx.strokeStyle = 'rgba(80, 130, 70, 0.8)';
        ctx.lineWidth = 1.1 * s;
        ctx.stroke();
      }
    }
  }

  private updateShrimp(t: number, dt: number, s: number) {
    const tk = this.tank;
    const tw = tk.x1 - tk.x0;
    for (const sh of this.shrimp) {
      // Head for settled food if any is nearby, otherwise potter about.
      const settled = this.flakes.filter((f) => f.settled);
      let target: Flake | null = null;
      let best = Infinity;
      for (const f of settled) {
        const d = Math.abs(f.x - (tk.x0 + sh.x * tw));
        if (d < best) {
          best = d;
          target = f;
        }
      }
      if (t < sh.pauseUntil && !target) continue;
      if (target) {
        const sx = tk.x0 + sh.x * tw;
        sh.dir = target.x > sx ? 1 : -1;
        if (Math.abs(target.x - sx) < 6 * s) {
          this.flakes.splice(this.flakes.indexOf(target), 1);
          sh.pauseUntil = t + 1.2;
        }
      } else if (this.rng() < dt * 0.25) {
        sh.pauseUntil = t + lerp(1, 3, this.rng());
        if (this.rng() < 0.4) sh.dir *= -1;
      }
      sh.x += (sh.dir * sh.speed * dt) / tw;
      if (sh.x < 0.03) {
        sh.x = 0.03;
        sh.dir = 1;
      }
      if (sh.x > 0.97) {
        sh.x = 0.97;
        sh.dir = -1;
      }
    }
  }

  private drawShrimp(ctx: CanvasRenderingContext2D, sh: Shrimp, t: number, s: number) {
    const tk = this.tank;
    const x = tk.x0 + sh.x * (tk.x1 - tk.x0);
    const y = tk.gravel + 1 + Math.sin(x * 0.035) * 2.5 * s;
    const wiggle = Math.sin(t * 8 + sh.phase) * 0.6;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sh.dir * s, s);
    // Body: a small curved arc of segments
    ctx.strokeStyle = '#d4402a';
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-6, -1);
    ctx.quadraticCurveTo(0, -6, 6, -2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 190, 170, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-5, -2);
    ctx.quadraticCurveTo(0, -6, 5, -3);
    ctx.stroke();
    // Tail fan
    ctx.fillStyle = '#c93a25';
    ctx.beginPath();
    ctx.moveTo(-6, -1);
    ctx.lineTo(-10, 1 + wiggle);
    ctx.lineTo(-9, -3);
    ctx.closePath();
    ctx.fill();
    // Legs
    ctx.strokeStyle = 'rgba(200, 70, 50, 0.8)';
    ctx.lineWidth = 0.7;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(-3 + i * 2.2, 0);
      ctx.lineTo(-3 + i * 2.2 + wiggle * 0.5, 2.5);
      ctx.stroke();
    }
    // Antennae
    ctx.beginPath();
    ctx.moveTo(6, -2);
    ctx.lineTo(13, -5 + wiggle);
    ctx.moveTo(6, -2);
    ctx.lineTo(12, 0 + wiggle * 0.5);
    ctx.stroke();
    // Eye
    ctx.fillStyle = '#2a2520';
    ctx.beginPath();
    ctx.arc(5.5, -3, 0.7, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  private updateFlakes(t: number, dt: number, s: number) {
    const tk = this.tank;
    for (let i = this.flakes.length - 1; i >= 0; i--) {
      const f = this.flakes[i];
      f.age += dt;
      if (!f.settled) {
        f.y += f.vy * s * dt;
        f.x += Math.sin(t * 2 + f.drift) * 6 * s * dt + f.drift * dt * 0.4;
        f.x = clamp(f.x, tk.x0 + 4, tk.x1 - 4);
        if (f.y >= tk.gravel - 1) {
          f.y = tk.gravel - 1 + Math.sin(f.x * 0.035) * 2.5 * s;
          f.settled = true;
          f.claimedBy = -1; // fish stop chasing it; shrimp take over
        }
      } else if (f.age > 40) {
        this.flakes.splice(i, 1);
      }
    }
  }

  private drawFlakes(ctx: CanvasRenderingContext2D, t: number, s: number) {
    for (const f of this.flakes) {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.settled ? f.drift : f.drift + t);
      ctx.fillStyle = f.settled ? 'rgba(170, 120, 70, 0.85)' : 'rgba(214, 150, 78, 0.95)';
      ctx.fillRect(-1.8 * s, -1.2 * s, 3.6 * s, 2.4 * s);
      ctx.restore();
    }
  }

  private updateFish(t: number, dt: number, s: number) {
    const tk = this.tank;
    for (const f of this.fish) {
      if (!f.food || !this.flakes.includes(f.food) || f.food.settled) {
        f.food = null;
        let best: Flake | null = null;
        let bestD = Infinity;
        for (const fl of this.flakes) {
          if (fl.settled) continue;
          if (fl.claimedBy !== null && fl.claimedBy !== f.id) continue;
          const d = Math.hypot(fl.x - f.x, fl.y - f.y);
          if (d < bestD) {
            bestD = d;
            best = fl;
          }
        }
        if (best) {
          best.claimedBy = f.id;
          f.food = best;
        }
      }
      if (f.food) {
        f.tx = f.food.x;
        f.ty = f.food.y;
      } else if (t > f.retarget || Math.hypot(f.tx - f.x, f.ty - f.y) < 8) {
        this.pickTarget(f);
      }

      const dx = f.tx - f.x;
      const dy = f.ty - f.y;
      const d = Math.hypot(dx, dy) || 1;
      const speed = (f.food ? 58 : 22) * s;
      f.vx = lerp(f.vx, (dx / d) * speed, 0.9 * dt);
      f.vy = lerp(f.vy, (dy / d) * speed, 0.9 * dt);

      for (const o of this.fish) {
        if (o === f) continue;
        const ox = f.x - o.x;
        const oy = f.y - o.y;
        const od = Math.hypot(ox, oy);
        if (od > 0 && od < 40 * s) {
          f.vx += (ox / od) * 12 * s * dt;
          f.vy += (oy / od) * 12 * s * dt;
        }
      }

      f.x += f.vx * dt;
      f.y += f.vy * dt + Math.sin(t * 1.5 + f.phase) * 0.15;
      f.x = clamp(f.x, tk.x0 + 18 * s, tk.x1 - 18 * s);
      f.y = clamp(f.y, tk.water + 14 * s, tk.gravel - 10 * s);

      if (f.food && Math.hypot(f.food.x - f.x, f.food.y - f.y) < 10 * s) {
        const idx = this.flakes.indexOf(f.food);
        if (idx >= 0) this.flakes.splice(idx, 1);
        f.food = null;
        this.pickTarget(f);
      }
    }
  }

  private drawFish(ctx: CanvasRenderingContext2D, f: Fish, t: number, s: number) {
    const grow = Math.min(1, (t - f.born) / 0.6);
    const sc = s * f.size * 1.5 * (0.5 + 0.5 * grow);
    const dir = f.vx >= 0 ? 1 : -1;
    const speed = Math.hypot(f.vx, f.vy);
    const wag = Math.sin(t * (6 + speed * 0.08) + f.phase) * 0.35;
    const tilt = clamp(f.vy / 60, -0.4, 0.4) * dir;

    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.scale(dir, 1);
    ctx.rotate(tilt);
    ctx.scale(sc, sc);

    const body = `hsl(${f.hue}, 64%, 56%)`;
    const dark = `hsl(${f.hue}, 58%, 40%)`;

    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.lineTo(-17, -6 + wag * 4);
    ctx.lineTo(-15, 0 + wag * 2);
    ctx.lineTo(-17, 6 + wag * 4);
    ctx.closePath();
    ctx.fillStyle = dark;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 6, 0, 0, TAU);
    ctx.fillStyle = body;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(1, 2, 7, 2.6, 0, 0, TAU);
    ctx.fillStyle = 'rgba(255, 245, 225, 0.35)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-3, -5.5);
    ctx.quadraticCurveTo(1, -11, 5, -5);
    ctx.closePath();
    ctx.fillStyle = dark;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(2, 2);
    ctx.quadraticCurveTo(-2 + wag * 2, 7, -4, 4);
    ctx.closePath();
    ctx.fillStyle = `hsla(${f.hue}, 55%, 40%, 0.8)`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(6.5, -1.5, 1.6, 0, TAU);
    ctx.fillStyle = '#fbf7f0';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -1.5, 0.8, 0, TAU);
    ctx.fillStyle = '#2a2520';
    ctx.fill();

    ctx.restore();
  }

  private drawBubbles(ctx: CanvasRenderingContext2D, t: number, dt: number, s: number) {
    const tk = this.tank;
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.y -= b.vy * dt;
      b.x += Math.sin(t * 3 + b.wob) * 0.25 * s;
      if (b.y < tk.water + 2) {
        this.bubbles.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, TAU);
      ctx.strokeStyle = 'rgba(225, 240, 248, 0.55)';
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, TAU);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
    }
    if (this.rng() < dt * 2) this.spawnBubble();
    // Air stone
    ctx.fillStyle = '#6f6a63';
    ctx.beginPath();
    ctx.ellipse(tk.x0 + 0.12 * (tk.x1 - tk.x0), tk.gravel + 1, 6 * s, 2.5 * s, 0, 0, TAU);
    ctx.fill();
  }

  private drawFloaters(ctx: CanvasRenderingContext2D, t: number, dt: number, s: number) {
    const tk = this.tank;
    const tw = tk.x1 - tk.x0;
    for (const fl of this.floaters) {
      fl.x += fl.drift * dt + Math.sin(t * 0.3 + fl.phase) * 0.0004;
      if (fl.x < 0.03) fl.x = 0.03;
      if (fl.x > 0.97) fl.x = 0.97;
      const x = tk.x0 + fl.x * tw;
      const y = tk.water + Math.sin(x * 0.04 + t * 1.6) * 1.2 * s;
      // Roots
      ctx.strokeStyle = 'rgba(200, 220, 190, 0.5)';
      ctx.lineWidth = 0.8 * s;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.moveTo(x + (k - 1) * 2 * s, y + 1);
        ctx.quadraticCurveTo(x + (k - 1) * 3 * s + Math.sin(t + k) * 2 * s, y + 10 * s, x + (k - 1) * 2 * s, y + (16 + k * 4) * s);
        ctx.stroke();
      }
      // Leaves
      for (let k = 0; k < fl.leaves; k++) {
        const ang = fl.phase + (k / fl.leaves) * TAU;
        const lx = x + Math.cos(ang) * fl.r * 0.9;
        ctx.beginPath();
        ctx.ellipse(lx, y - 1, fl.r, fl.r * 0.5, 0, 0, TAU);
        ctx.fillStyle = k % 2 ? '#7fb04f' : '#6a9c42';
        ctx.fill();
      }
    }
  }

  private drawSurface(ctx: CanvasRenderingContext2D, t: number, s: number) {
    const tk = this.tank;
    // Air gap above the water line
    ctx.beginPath();
    ctx.moveTo(tk.x0, tk.top);
    ctx.lineTo(tk.x1, tk.top);
    for (let x = tk.x1; x >= tk.x0; x -= 8) {
      ctx.lineTo(x, tk.water + Math.sin(x * 0.04 + t * 1.6) * 1.2 * s);
    }
    ctx.closePath();
    ctx.fillStyle = '#e7dfd4';
    ctx.fill();
    ctx.beginPath();
    for (let x = tk.x0; x <= tk.x1; x += 8) {
      const y = tk.water + Math.sin(x * 0.04 + t * 1.6) * 1.2 * s;
      if (x === tk.x0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  private drawAlgae(ctx: CanvasRenderingContext2D, s: number, algae: number) {
    if (algae < 0.02) return;
    const tk = this.tank;
    // Green film creeping up from the corners and along the gravel line.
    const rng = mulberry32(77);
    const reach = lerp(0.1, 0.95, algae) * (tk.gravel - tk.water);
    ctx.fillStyle = `rgba(88, 140, 60, ${0.08 + algae * 0.3})`;
    for (let i = 0; i < 90; i++) {
      const side = rng() < 0.5 ? tk.x0 : tk.x1;
      const up = rng() * rng() * reach;
      const x = side + (side === tk.x0 ? 1 : -1) * rng() * lerp(6, 40, algae) * s;
      const y = tk.gravel - up;
      const r = lerp(1, 4, rng()) * s * (0.5 + algae);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }
    // Whole-glass haze
    ctx.fillStyle = `rgba(90, 150, 70, ${algae * 0.16})`;
    ctx.fillRect(tk.x0, tk.water, tk.x1 - tk.x0, tk.bottom - tk.water);
  }

  private drawGlass(ctx: CanvasRenderingContext2D, s: number) {
    const tk = this.tank;
    // Front reflection
    const gl = ctx.createLinearGradient(tk.x0, 0, tk.x0 + 0.2 * (tk.x1 - tk.x0), 0);
    gl.addColorStop(0, 'rgba(255,255,255,0.16)');
    gl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl;
    ctx.fillRect(tk.x0, tk.top, 0.2 * (tk.x1 - tk.x0), tk.bottom - tk.top);
    // Frame
    ctx.strokeStyle = 'rgba(40, 50, 55, 0.55)';
    ctx.lineWidth = 2.2 * s;
    ctx.strokeRect(tk.x0, tk.top, tk.x1 - tk.x0, tk.bottom - tk.top);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(tk.x0 + 2.5 * s, tk.top + 2.5 * s, tk.x1 - tk.x0 - 5 * s, tk.bottom - tk.top - 5 * s);
  }

  private drawLamp(ctx: CanvasRenderingContext2D, s: number, t: number) {
    const { baseX, baseY, headX, headY } = this.lamp;
    const armTopY = 0.09 * this.h;
    ctx.lineCap = 'round';
    // Base
    ctx.fillStyle = '#3a3532';
    ctx.beginPath();
    ctx.ellipse(baseX, baseY, 22 * s, 5 * s, 0, 0, TAU);
    ctx.fill();
    // Arm: up, then over toward the tank
    ctx.strokeStyle = '#3a3532';
    ctx.lineWidth = 4 * s;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(baseX, armTopY + 18 * s);
    ctx.quadraticCurveTo(baseX, armTopY, baseX - 20 * s, armTopY);
    ctx.lineTo(headX + 14 * s, headY - 6 * s);
    ctx.stroke();
    // Head: a shade angled down-left
    ctx.save();
    ctx.translate(headX, headY);
    ctx.rotate(0.55);
    ctx.fillStyle = '#3a3532';
    ctx.beginPath();
    ctx.moveTo(-10 * s, -14 * s);
    ctx.lineTo(10 * s, -14 * s);
    ctx.lineTo(18 * s, 6 * s);
    ctx.lineTo(-18 * s, 6 * s);
    ctx.closePath();
    ctx.fill();
    // Bulb glow
    const flicker = 0.9 + 0.1 * Math.sin(t * 7.3) * Math.sin(t * 3.1);
    const g = ctx.createRadialGradient(0, 8 * s, 0, 0, 8 * s, 40 * s);
    g.addColorStop(0, `rgba(255, 244, 210, ${0.9 * flicker})`);
    g.addColorStop(0.3, `rgba(255, 236, 190, ${0.35 * flicker})`);
    g.addColorStop(1, 'rgba(255, 236, 190, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(-40 * s, -30 * s, 80 * s, 80 * s);
    ctx.fillStyle = `rgba(255, 246, 220, ${flicker})`;
    ctx.beginPath();
    ctx.ellipse(0, 6 * s, 12 * s, 3 * s, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}
