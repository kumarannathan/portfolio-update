import { Scene, PointerEvt, mulberry32, grainTile, applyGrain, feather, lerp } from './canvas';

type Pine = { x: number; w: number; h: number; shade: number };
type Gull = { x: number; y: number; sp: number; phase: number; size: number };
type Ring = { x: number; y: number; age: number; life: number; size: number; delay: number };

const TAU = Math.PI * 2;

/**
 * A grey-blue lake with a pine shore, a drifting sailboat and gulls.
 * Click the water to skip a stone.
 */
export class LakeScene implements Scene {
  private w = 0;
  private h = 0;
  private grain = grainTile(180, 0.16, 5);
  private pines: Pine[] = [];
  private gulls: Gull[] = [];
  private rings: Ring[] = [];
  private boatX = 0.2;
  private rng = mulberry32(21);

  setup(w: number, h: number) {
    this.w = w;
    this.h = h;
    const rng = mulberry32(21);
    this.rng = mulberry32(210);
    const s = w / 900;

    this.pines = [];
    let x = -10;
    while (x < w + 10) {
      const pw = lerp(10, 26, rng()) * s;
      this.pines.push({ x, w: pw, h: lerp(22, 58, rng()) * s, shade: rng() });
      x += pw * lerp(0.55, 0.9, rng());
    }

    if (this.gulls.length === 0) {
      for (let i = 0; i < 5; i++) {
        this.gulls.push({ x: rng() * w, y: lerp(0.08, 0.28, rng()) * h, sp: lerp(10, 22, rng()), phase: rng() * TAU, size: lerp(4, 8, rng()) });
      }
    }
  }

  pointer(e: PointerEvt) {
    const horizon = 0.4 * this.h;
    if (e.type !== 'down' || e.y < horizon) return;
    // Skip a stone: four hops, each smaller and closer than the last.
    let x = e.x;
    let y = e.y;
    let delay = 0;
    let hop = 46 * (this.w / 900);
    for (let i = 0; i < 4; i++) {
      this.rings.push({ x, y, age: 0, life: 2.2 - i * 0.3, size: 1 - i * 0.2, delay });
      x += hop;
      y -= hop * 0.12;
      delay += 0.22 - i * 0.03;
      hop *= 0.7;
    }
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) {
    const horizon = 0.4 * h;
    const s = w / 900;

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, '#eceeeb');
    sky.addColorStop(1, '#d3dde2');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, horizon + 1);

    // Far hills
    ctx.fillStyle = 'rgba(120, 140, 140, 0.35)';
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    for (let x = 0; x <= w; x += 20) {
      ctx.lineTo(x, horizon - 18 * s - Math.sin(x * 0.006 + 1) * 12 * s - Math.sin(x * 0.02) * 4 * s);
    }
    ctx.lineTo(w, horizon);
    ctx.closePath();
    ctx.fill();

    // Pine shore
    for (const p of this.pines) {
      const shade = 0.85 + p.shade * 0.15;
      ctx.fillStyle = `rgb(${Math.round(58 * shade)}, ${Math.round(74 * shade)}, ${Math.round(66 * shade)})`;
      ctx.beginPath();
      ctx.moveTo(p.x, horizon + 1);
      ctx.lineTo(p.x + p.w * 0.5, horizon - p.h);
      ctx.lineTo(p.x + p.w, horizon + 1);
      ctx.closePath();
      ctx.fill();
    }

    // Water
    const water = ctx.createLinearGradient(0, horizon, 0, h);
    water.addColorStop(0, '#93aab5');
    water.addColorStop(0.5, '#7d97a5');
    water.addColorStop(1, '#67828f');
    ctx.fillStyle = water;
    ctx.fillRect(0, horizon, w, h - horizon);

    // Shore reflection
    ctx.save();
    ctx.globalAlpha = 0.22;
    for (const p of this.pines) {
      ctx.fillStyle = '#3b4a42';
      ctx.beginPath();
      ctx.moveTo(p.x, horizon);
      ctx.lineTo(p.x + p.w * 0.5, horizon + p.h * 0.55 + Math.sin(t * 1.3 + p.x * 0.05) * 2);
      ctx.lineTo(p.x + p.w, horizon);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Wave lines
    ctx.lineWidth = 1;
    const rows = 34;
    for (let i = 0; i < rows; i++) {
      const p = i / rows;
      const y = horizon + 8 * s + p * p * (h - horizon - 8 * s);
      const amp = lerp(0.6, 2.4, p) * s;
      const freq = lerp(0.03, 0.012, p);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 12) {
        const yy = y + Math.sin(x * freq + t * (0.8 + p) + i) * amp;
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${lerp(0.05, 0.14, p)})`;
      ctx.stroke();
    }

    // Skipped-stone rings
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      if (r.delay > 0) {
        r.delay -= dt;
        continue;
      }
      r.age += dt;
      if (r.age > r.life) {
        this.rings.splice(i, 1);
        continue;
      }
      const p = r.age / r.life;
      const fade = (1 - p) * (1 - p);
      for (let k = 0; k < 2; k++) {
        const rad = (r.age * 46 + k * 9) * r.size * s + 1;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, rad, rad * 0.42, 0, 0, TAU);
        ctx.strokeStyle = `rgba(255, 255, 255, ${fade * (0.5 - k * 0.2) * r.size})`;
        ctx.stroke();
      }
    }

    // Sailboat drifting
    this.boatX += dt * 0.008;
    if (this.boatX > 1.12) this.boatX = -0.12;
    const bx = this.boatX * w;
    const by = horizon + 0.3 * (h - horizon) + Math.sin(t * 1.1) * 1.6 * s;
    const tilt = Math.sin(t * 0.9) * 0.04;
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(tilt);
    ctx.scale(s, s);
    // reflection
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#f2efe8';
    ctx.beginPath();
    ctx.moveTo(-2, 4);
    ctx.lineTo(-2, 40);
    ctx.lineTo(18, 4);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    // hull
    ctx.fillStyle = '#5a3f2e';
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(18, 0);
    ctx.lineTo(13, 6);
    ctx.lineTo(-11, 6);
    ctx.closePath();
    ctx.fill();
    // mast
    ctx.strokeStyle = '#3d2b20';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    ctx.lineTo(-2, -38);
    ctx.stroke();
    // sails
    ctx.fillStyle = '#f5f0e6';
    ctx.beginPath();
    ctx.moveTo(-1, -37);
    ctx.lineTo(19 + Math.sin(t * 1.5) * 1.5, -3);
    ctx.lineTo(-1, -3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ebe5d8';
    ctx.beginPath();
    ctx.moveTo(-3, -32);
    ctx.lineTo(-15, -3);
    ctx.lineTo(-3, -3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Gulls
    ctx.strokeStyle = 'rgba(70, 80, 84, 0.75)';
    ctx.lineWidth = 1.1 * s;
    ctx.lineCap = 'round';
    for (const g of this.gulls) {
      g.x += g.sp * s * dt;
      if (g.x > w + 20) g.x = -20;
      const flap = Math.sin(t * 6 + g.phase) * 0.5;
      const sz = g.size * s;
      const y = g.y + Math.sin(t * 0.7 + g.phase) * 4 * s;
      ctx.beginPath();
      ctx.moveTo(g.x - sz, y);
      ctx.quadraticCurveTo(g.x - sz * 0.5, y - sz * (0.6 + flap), g.x, y);
      ctx.quadraticCurveTo(g.x + sz * 0.5, y - sz * (0.6 + flap), g.x + sz, y);
      ctx.stroke();
    }

    applyGrain(ctx, this.grain, w, h, 0.75);
    feather(ctx, w, h, 0.07, 0.12);
  }
}
