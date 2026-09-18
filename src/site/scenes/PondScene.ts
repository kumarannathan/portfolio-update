import { Scene, PointerEvt, mulberry32, grainTile, applyGrain, feather, clamp, lerp } from './canvas';

type Blob = { x: number; y: number; r: number; ax: number; ay: number; sp: number; ph: number; light: boolean };
type Blade = { len: number; lean: number; width: number; color: string; phase: number };
type Cattail = { len: number; lean: number; phase: number };
type Clump = { x: number; y: number; blades: Blade[]; cattails: Cattail[] };
type Ripple = { x: number; y: number; age: number; life: number; strength: number; delay: number };
type Crumb = { x: number; y: number; claimedBy: number | null };
type Duck = {
  id: number;
  x: number;
  y: number;
  a: number;
  tx: number;
  ty: number;
  speed: number;
  pauseUntil: number;
  phase: number;
  crumb: Crumb | null;
  born: number;
};

const TAU = Math.PI * 2;

const angleLerp = (a: number, b: number, maxStep: number) => {
  let d = ((b - a + Math.PI) % TAU) - Math.PI;
  if (d < -Math.PI) d += TAU;
  return a + clamp(d, -maxStep, maxStep);
};

/**
 * A quiet pond. Click the water to send a ripple and drop a few crumbs,
 * the ducks will paddle over. Reeds and cattails sway along the banks.
 */
export class PondScene implements Scene {
  private w = 0;
  private h = 0;
  private t = 0;
  private grain = grainTile(180, 0.2, 3);
  private blobs: Blob[] = [];
  private clumps: Clump[] = [];
  private ripples: Ripple[] = [];
  private crumbs: Crumb[] = [];
  private ducks: Duck[] = [];
  private nextDuckId = 1;
  private lastHoverRipple = 0;
  private rng = mulberry32(42);

  setup(w: number, h: number) {
    this.w = w;
    this.h = h;
    const rng = mulberry32(42);
    this.rng = mulberry32(99);

    // Cloudy light/dark patches drifting under the surface.
    this.blobs = [];
    for (let i = 0; i < 11; i++) {
      this.blobs.push({
        x: rng() * w,
        y: rng() * h,
        r: lerp(0.22, 0.42, rng()) * w,
        ax: lerp(0.03, 0.08, rng()) * w,
        ay: lerp(0.03, 0.07, rng()) * h,
        sp: lerp(0.05, 0.13, rng()),
        ph: rng() * TAU,
        light: i < 7
      });
    }

    // Reeds along the banks.
    this.clumps = [];
    const scale = w / 900;
    const makeClump = (x: number, y: number, size: number, lean: number, count: number, cattailChance: number) => {
      const blades: Blade[] = [];
      for (let i = 0; i < count; i++) {
        const hue = 82 + rng() * 34;
        blades.push({
          len: size * lerp(0.55, 1, rng()),
          lean: lean + (rng() - 0.5) * 0.9,
          width: lerp(0.8, 1.7, rng()) * scale,
          color: `hsla(${hue}, ${28 + rng() * 18}%, ${36 + rng() * 22}%, ${0.75 + rng() * 0.25})`,
          phase: rng() * TAU
        });
      }
      const cattails: Cattail[] = [];
      const n = rng() < cattailChance ? 1 + (rng() < 0.4 ? 1 : 0) : 0;
      for (let i = 0; i < n; i++) {
        cattails.push({ len: size * lerp(1.05, 1.35, rng()), lean: lean * 0.6 + (rng() - 0.5) * 0.5, phase: rng() * TAU });
      }
      this.clumps.push({ x, y, blades, cattails });
    };

    // top bank
    for (let i = 0; i < 10; i++) {
      makeClump(lerp(0.03, 0.97, rng()) * w, lerp(0.03, 0.1, rng()) * h, lerp(18, 34, rng()) * scale, 0, 4 + Math.floor(rng() * 4), 0.35);
    }
    // bottom bank (closer, bigger)
    for (let i = 0; i < 14; i++) {
      makeClump(lerp(0.02, 0.98, rng()) * w, lerp(0.9, 1.0, rng()) * h, lerp(34, 62, rng()) * scale, 0, 6 + Math.floor(rng() * 5), 0.45);
    }
    // left / right banks
    for (let i = 0; i < 7; i++) {
      makeClump(lerp(0.01, 0.06, rng()) * w, lerp(0.15, 0.95, rng()) * h, lerp(26, 48, rng()) * scale, 0.9, 5 + Math.floor(rng() * 4), 0.4);
      makeClump(lerp(0.94, 0.99, rng()) * w, lerp(0.15, 0.95, rng()) * h, lerp(26, 48, rng()) * scale, -0.9, 5 + Math.floor(rng() * 4), 0.4);
    }
    // farthest back first so foreground overlaps
    this.clumps.sort((a, b) => a.y - b.y);

    if (this.ducks.length === 0) {
      this.addDuck(0.62 * w, 0.38 * h);
      this.addDuck(0.68 * w, 0.5 * h);
    } else {
      for (const d of this.ducks) {
        d.x = clamp(d.x, 0.12 * w, 0.88 * w);
        d.y = clamp(d.y, 0.14 * h, 0.86 * h);
        this.pickTarget(d);
      }
    }
  }

  addDuck(x?: number, y?: number) {
    if (this.ducks.length >= 8) return;
    const rng = this.rng;
    const d: Duck = {
      id: this.nextDuckId++,
      x: x ?? lerp(0.15, 0.85, rng()) * this.w,
      y: y ?? lerp(0.18, 0.82, rng()) * this.h,
      a: rng() * TAU,
      tx: 0,
      ty: 0,
      speed: 0,
      pauseUntil: 0,
      phase: rng() * TAU,
      crumb: null,
      born: this.t
    };
    this.pickTarget(d);
    this.ducks.push(d);
    this.ripples.push({ x: d.x, y: d.y, age: 0, life: 1.8, strength: 0.7, delay: 0 });
  }

  get duckCount() {
    return this.ducks.length;
  }

  private pickTarget(d: Duck) {
    const rng = this.rng;
    d.tx = lerp(0.12, 0.88, rng()) * this.w;
    d.ty = lerp(0.14, 0.86, rng()) * this.h;
    d.crumb = null;
  }

  pointer(e: PointerEvt) {
    if (e.type === 'down') {
      this.ripples.push({ x: e.x, y: e.y, age: 0, life: 2.6, strength: 1, delay: 0 });
      const rng = this.rng;
      for (let i = 0; i < 3; i++) {
        this.crumbs.push({ x: e.x + (rng() - 0.5) * 14, y: e.y + (rng() - 0.5) * 10, claimedBy: null });
      }
      if (this.crumbs.length > 24) this.crumbs.splice(0, this.crumbs.length - 24);
    } else if (e.type === 'move') {
      const now = performance.now();
      if (now - this.lastHoverRipple > 260) {
        this.lastHoverRipple = now;
        this.ripples.push({ x: e.x, y: e.y, age: 0, life: 1.1, strength: 0.22, delay: 0 });
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) {
    this.t = t;
    this.drawWater(ctx, w, h, t);
    this.drawRipples(ctx, dt);
    this.drawCrumbs(ctx);
    this.updateDucks(t, dt);
    for (const d of this.ducks) this.drawDuck(ctx, d, t);
    applyGrain(ctx, this.grain, w, h, 0.9);
    this.drawReeds(ctx, t);
    feather(ctx, w, h, 0.055, 0.085);
  }

  private drawWater(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    ctx.fillStyle = '#35587a';
    ctx.fillRect(0, 0, w, h);
    for (const b of this.blobs) {
      const x = b.x + Math.sin(t * b.sp + b.ph) * b.ax;
      const y = b.y + Math.cos(t * b.sp * 0.8 + b.ph) * b.ay;
      const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      if (b.light) {
        g.addColorStop(0, 'rgba(150, 178, 204, 0.22)');
        g.addColorStop(1, 'rgba(150, 178, 204, 0)');
      } else {
        g.addColorStop(0, 'rgba(22, 44, 72, 0.3)');
        g.addColorStop(1, 'rgba(22, 44, 72, 0)');
      }
      ctx.fillStyle = g;
      ctx.fillRect(x - b.r, y - b.r, b.r * 2, b.r * 2);
    }
  }

  private drawRipples(ctx: CanvasRenderingContext2D, dt: number) {
    ctx.lineWidth = 1.1;
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      if (r.delay > 0) {
        r.delay -= dt;
        continue;
      }
      r.age += dt;
      if (r.age >= r.life) {
        this.ripples.splice(i, 1);
        continue;
      }
      const p = r.age / r.life;
      const fade = (1 - p) * (1 - p);
      const base = r.age * 62 * r.strength + 2;
      for (let k = 0; k < 3; k++) {
        const rad = base + k * 10 * r.strength;
        const a = fade * (0.34 - k * 0.09) * r.strength;
        if (a <= 0.005) continue;
        ctx.beginPath();
        ctx.arc(r.x, r.y, rad, 0, TAU);
        ctx.strokeStyle = `rgba(228, 238, 246, ${a})`;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0.1, rad - 2.2), 0, TAU);
        ctx.strokeStyle = `rgba(14, 34, 60, ${a * 0.55})`;
        ctx.stroke();
      }
    }
  }

  private drawCrumbs(ctx: CanvasRenderingContext2D) {
    for (const c of this.crumbs) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 1.7, 0, TAU);
      ctx.fillStyle = 'rgba(222, 196, 150, 0.95)';
      ctx.fill();
    }
  }

  private updateDucks(t: number, dt: number) {
    const w = this.w;
    const h = this.h;
    for (const d of this.ducks) {
      // Look for food.
      if (!d.crumb || !this.crumbs.includes(d.crumb)) {
        d.crumb = null;
        let best: Crumb | null = null;
        let bestD = Infinity;
        for (const c of this.crumbs) {
          if (c.claimedBy !== null && c.claimedBy !== d.id) continue;
          const dist = Math.hypot(c.x - d.x, c.y - d.y);
          if (dist < bestD) {
            bestD = dist;
            best = c;
          }
        }
        if (best) {
          best.claimedBy = d.id;
          d.crumb = best;
          d.tx = best.x;
          d.ty = best.y;
        }
      }

      if (t < d.pauseUntil) {
        d.speed = lerp(d.speed, 0, 0.1);
        continue;
      }

      const dx = d.tx - d.x;
      const dy = d.ty - d.y;
      const dist = Math.hypot(dx, dy);
      const targetSpeed = (d.crumb ? 26 : 13) * (w / 900);

      if (dist < 5) {
        if (d.crumb) {
          const idx = this.crumbs.indexOf(d.crumb);
          if (idx >= 0) this.crumbs.splice(idx, 1);
          d.crumb = null;
          d.pauseUntil = t + 0.7;
          this.ripples.push({ x: d.x, y: d.y, age: 0, life: 1.2, strength: 0.4, delay: 0 });
        } else {
          d.pauseUntil = t + lerp(1, 3.5, this.rng());
        }
        this.pickTarget(d);
        continue;
      }

      const want = Math.atan2(dy, dx);
      d.a = angleLerp(d.a, want, 2.4 * dt);
      d.speed = lerp(d.speed, targetSpeed, 0.05);
      d.x += Math.cos(d.a) * d.speed * dt;
      d.y += Math.sin(d.a) * d.speed * dt;

      // Gentle personal space.
      for (const o of this.ducks) {
        if (o === d) continue;
        const ox = d.x - o.x;
        const oy = d.y - o.y;
        const od = Math.hypot(ox, oy);
        if (od > 0 && od < 20) {
          d.x += (ox / od) * (20 - od) * 0.3;
          d.y += (oy / od) * (20 - od) * 0.3;
        }
      }
      d.x = clamp(d.x, 0.08 * w, 0.92 * w);
      d.y = clamp(d.y, 0.1 * h, 0.9 * h);
    }
  }

  private drawDuck(ctx: CanvasRenderingContext2D, d: Duck, t: number) {
    const s = this.w / 900;
    const bob = Math.sin(t * 2.6 + d.phase) * 0.5;
    const grow = Math.min(1, (t - d.born) / 0.6);
    const scale = Math.max(s, 0.72) * 1.35 * (0.6 + 0.4 * grow);
    const cos = Math.cos(d.a);
    const sin = Math.sin(d.a);

    ctx.save();
    ctx.translate(d.x, d.y + bob);

    // Wake
    if (d.speed > 2) {
      const len = clamp(d.speed * 0.9, 8, 26) * s;
      ctx.strokeStyle = 'rgba(230, 240, 248, 0.22)';
      ctx.lineWidth = 1;
      for (const side of [-1, 1]) {
        const ang = d.a + Math.PI + side * 0.42;
        ctx.beginPath();
        ctx.moveTo(-cos * 6 * scale, -sin * 6 * scale);
        ctx.lineTo(-cos * 6 * scale + Math.cos(ang) * len, -sin * 6 * scale + Math.sin(ang) * len);
        ctx.stroke();
      }
    }

    ctx.rotate(d.a);
    ctx.scale(scale, scale);

    // Shadow in the water
    ctx.beginPath();
    ctx.ellipse(0, 1.5, 9.5, 6.5, 0, 0, TAU);
    ctx.fillStyle = 'rgba(12, 30, 54, 0.28)';
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 6.4, 0, 0, TAU);
    ctx.fillStyle = '#f6f2ea';
    ctx.fill();
    // Wing line
    ctx.beginPath();
    ctx.ellipse(-1.5, 0.4, 5.5, 3.6, 0, 0, TAU);
    ctx.fillStyle = 'rgba(214, 205, 190, 0.6)';
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(7, -1.2, 4.4, 0, TAU);
    ctx.fillStyle = '#f9f6ef';
    ctx.fill();

    // Beak
    ctx.beginPath();
    ctx.moveTo(11, -2.4);
    ctx.lineTo(15.5, -1);
    ctx.lineTo(11, 0.4);
    ctx.closePath();
    ctx.fillStyle = '#ee9a2c';
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(8.4, -2.4, 0.75, 0, TAU);
    ctx.fillStyle = '#2a2520';
    ctx.fill();

    ctx.restore();
  }

  private drawReeds(ctx: CanvasRenderingContext2D, t: number) {
    ctx.lineCap = 'round';
    for (const c of this.clumps) {
      for (const b of c.blades) {
        const sway = Math.sin(t * 1.3 + b.phase) * 2.2 + Math.sin(t * 0.4 + b.phase * 2) * 1.2;
        const tipX = c.x + b.lean * b.len * 0.55 + sway;
        const tipY = c.y - b.len;
        const cx = c.x + b.lean * b.len * 0.2 + sway * 0.3;
        const cy = c.y - b.len * 0.55;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.quadraticCurveTo(cx, cy, tipX, tipY);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = b.width;
        ctx.stroke();
      }
      for (const ct of c.cattails) {
        const sway = Math.sin(t * 1.1 + ct.phase) * 2.6;
        const tipX = c.x + ct.lean * ct.len * 0.5 + sway;
        const tipY = c.y - ct.len;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.quadraticCurveTo(c.x + ct.lean * ct.len * 0.2, c.y - ct.len * 0.5, tipX, tipY);
        ctx.strokeStyle = 'rgba(96, 108, 62, 0.9)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
        // head
        const headLen = ct.len * 0.22;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY + headLen * 0.15);
        ctx.lineTo(tipX - (tipX - c.x) * 0.06, tipY + headLen);
        ctx.strokeStyle = '#5a3a24';
        ctx.lineWidth = 3.2;
        ctx.stroke();
      }
    }
  }
}
