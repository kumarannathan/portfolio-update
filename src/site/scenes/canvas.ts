/**
 * Tiny canvas "sketch" engine shared by the procedural scenes.
 * Handles DPR scaling, resize, pausing when offscreen, pointer input,
 * reduced-motion, and the soft feathered edge that all scenes share.
 */

export type PointerEvt = {
  type: 'down' | 'move' | 'up' | 'leave';
  x: number;
  y: number;
  shift: boolean;
};

export interface Scene {
  setup(w: number, h: number): void;
  draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number): void;
  pointer?(e: PointerEvt): void;
}

/** Deterministic PRNG so a scene looks the same on every load. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

/** A small tile of monochrome noise, used as a repeating pattern for film grain. */
export function grainTile(size = 160, alpha = 0.16, seed = 7): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const rng = mulberry32(seed);
  const img = ctx.createImageData(size, size);
  const d = img.data;
  const a = Math.round(alpha * 255);
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.floor(rng() * 255);
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = a;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Overlay the grain tile across the whole canvas. */
export function applyGrain(ctx: CanvasRenderingContext2D, tile: HTMLCanvasElement, w: number, h: number, alpha = 1) {
  const pat = ctx.createPattern(tile, 'repeat');
  if (!pat) return;
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = alpha;
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Soft, blurred edges: multiply the alpha channel by two linear gradients
 * (horizontal x vertical), which fades every edge and rounds the corners.
 */
export function feather(ctx: CanvasRenderingContext2D, w: number, h: number, fx = 0.07, fy = 0.1) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';

  const gx = ctx.createLinearGradient(0, 0, w, 0);
  gx.addColorStop(0, 'rgba(0,0,0,0)');
  gx.addColorStop(fx * 0.45, 'rgba(0,0,0,0.35)');
  gx.addColorStop(fx, 'rgba(0,0,0,1)');
  gx.addColorStop(1 - fx, 'rgba(0,0,0,1)');
  gx.addColorStop(1 - fx * 0.45, 'rgba(0,0,0,0.35)');
  gx.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gx;
  ctx.fillRect(0, 0, w, h);

  const gy = ctx.createLinearGradient(0, 0, 0, h);
  gy.addColorStop(0, 'rgba(0,0,0,0)');
  gy.addColorStop(fy * 0.45, 'rgba(0,0,0,0.35)');
  gy.addColorStop(fy, 'rgba(0,0,0,1)');
  gy.addColorStop(1 - fy, 'rgba(0,0,0,1)');
  gy.addColorStop(1 - fy * 0.45, 'rgba(0,0,0,0.35)');
  gy.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gy;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}

/**
 * Mount a scene on a canvas. The canvas fills its parent's width at the
 * given aspect ratio. Returns a cleanup function.
 */
export function mountScene(canvas: HTMLCanvasElement, scene: Scene, aspect: number): () => void {
  const parent = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  if (!parent || !ctx) return () => undefined;

  const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reducedMq.matches;
  let w = 0;
  let h = 0;
  let t = 0;
  let last = 0;
  let raf = 0;
  let running = false;
  let visible = true;
  let burstUntil = 0;

  const drawFrame = (dt: number) => {
    ctx.clearRect(0, 0, w, h);
    scene.draw(ctx, w, h, t, dt);
  };

  const loop = (now: number) => {
    if (!running) return;
    if (reduced && now > burstUntil) {
      running = false;
      return;
    }
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    t += dt;
    drawFrame(dt);
    raf = window.requestAnimationFrame(loop);
  };

  const start = () => {
    if (running) return;
    if (reduced && performance.now() > burstUntil) return;
    running = true;
    last = 0;
    raf = window.requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    window.cancelAnimationFrame(raf);
  };

  const resize = () => {
    const cw = parent.clientWidth;
    if (!cw) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cw;
    h = Math.round(cw / aspect);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scene.setup(w, h);
    drawFrame(0);
  };

  // Defer so the canvas size change doesn't re-trigger the observer in the same frame.
  let resizeRaf = 0;
  const ro = new ResizeObserver(() => {
    window.cancelAnimationFrame(resizeRaf);
    resizeRaf = window.requestAnimationFrame(resize);
  });
  ro.observe(parent);

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible && !document.hidden) start();
      else stop();
    },
    { threshold: 0.02 }
  );
  io.observe(canvas);

  const onVisibility = () => {
    if (document.hidden) stop();
    else if (visible) start();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const onReduced = () => {
    reduced = reducedMq.matches;
    if (!reduced && visible) start();
  };
  reducedMq.addEventListener?.('change', onReduced);

  const toLocal = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const makeHandler = (type: PointerEvt['type']) => (e: PointerEvent) => {
    if (!scene.pointer) return;
    const p = toLocal(e);
    scene.pointer({ type, x: p.x, y: p.y, shift: e.shiftKey });
    if (reduced) {
      // Let interactions play out briefly even with reduced motion.
      burstUntil = performance.now() + 2500;
      start();
    }
  };

  const onDown = makeHandler('down');
  const onMove = makeHandler('move');
  const onUp = makeHandler('up');
  const onLeave = makeHandler('leave');
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointerleave', onLeave);

  resize();

  return () => {
    stop();
    window.cancelAnimationFrame(resizeRaf);
    ro.disconnect();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    reducedMq.removeEventListener?.('change', onReduced);
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointerleave', onLeave);
  };
}
