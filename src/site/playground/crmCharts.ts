/*
 * The chart math from the yogger crm, ported off @visx so it runs here with plain
 * svg. The scales, tick choice, dot packing and monotone curve are the same ones
 * crm/charts/* use — only the rendering library is gone.
 */

/** d3's tick step: 1, 2, 5 or 10 times a power of ten. */
function tickIncrement(start: number, stop: number, count: number): number {
  const step = (stop - start) / Math.max(0, count);
  const power = Math.floor(Math.log(step) / Math.LN10);
  const error = step / Math.pow(10, power);
  const factor = error >= Math.sqrt(50) ? 10 : error >= Math.sqrt(10) ? 5 : error >= Math.sqrt(2) ? 2 : 1;
  return factor * Math.pow(10, power);
}

/** The ticks d3 would pick across [start, stop] — what `scale.ticks(count)` returns. */
export function ticks(start: number, stop: number, count: number): number[] {
  if (stop <= start || count <= 0) return [start];
  const step = tickIncrement(start, stop, count);
  const first = Math.ceil(start / step);
  const last = Math.floor(stop / step);
  const out: number[] = [];
  for (let i = first; i <= last; i++) out.push(i * step);
  return out;
}

/** Rounds a domain out to whole ticks, the way `scaleLinear({ nice: n })` does. */
export function niceMax(max: number, count = 4): number {
  const step = tickIncrement(0, max, count);
  return Math.ceil(max / step) * step;
}

/** Rough width of a label in the UI font, good enough to decide what fits. */
export const textWidth = (text: string, fontSize = 12) => text.length * fontSize * 0.58;

/** 1234 → "1.2k", 1500000 → "1.5M". */
export const compactNumber = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M`;
  if (abs >= 1000) return `${(n / 1000).toFixed(abs % 1000 === 0 ? 0 : 1)}k`;
  return `${Math.round(n)}`;
};

export interface DotLayout {
  margin: { top: number; right: number; bottom: number; left: number };
  innerW: number;
  innerH: number;
  yTicks: number[];
  /** Pixel y for a value. */
  y: (v: number) => number;
  /** Left edge of a column by index. */
  xAt: (i: number) => number;
  bandwidth: number;
  step: number;
  dot: number;
  gap: number;
  rows: number;
  /** How much one dot is worth. */
  perDot: number;
  /** Label every nth column, so labels never collide. */
  every: number;
}

/**
 * Columns of dots, one dot per slice of value. Dot size follows the column width,
 * capped so tall charts don't get giant dots; the row count then decides what a
 * single dot is worth.
 */
export function dotLayout(
  values: number[],
  labels: string[],
  width: number,
  height: number,
  padding = 0.12
): DotLayout {
  const max = Math.max(1, ...values);
  const domainMax = niceMax(max, 4);
  const yTicks = ticks(0, domainMax, 4);
  const yLabelWidth = Math.max(...yTicks.map((t) => textWidth(compactNumber(t))), 12);
  const margin = { top: 8, right: 4, bottom: 26, left: Math.ceil(yLabelWidth) + 14 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);

  const step = innerW / Math.max(1, values.length);
  const bandwidth = step * (1 - padding);
  const dot = Math.max(3, Math.min(bandwidth, 12));
  const gap = Math.max(1.5, dot * 0.28);
  const rows = Math.max(1, Math.floor(innerH / (dot + gap)));

  const widest = Math.max(...labels.map((l) => textWidth(l)), 20);

  return {
    margin,
    innerW,
    innerH,
    yTicks,
    y: (v: number) => innerH - (v / domainMax) * innerH,
    xAt: (i: number) => i * step + (step - bandwidth) / 2,
    bandwidth,
    step,
    dot,
    gap,
    rows,
    perDot: domainMax / rows,
    every: Math.max(1, Math.ceil((widest + 12) / step))
  };
}

/**
 * A monotone cubic through the points — d3's curveMonotoneX, so a sparkline never
 * overshoots into a dip the data doesn't have.
 */
export function monotonePath(values: number[], width: number, height: number, pad = 2): string {
  if (values.length < 2) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max === min ? 1 : max - min;
  const px = (i: number) => pad + (i / (values.length - 1)) * (width - pad * 2);
  const py = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);

  const n = values.length;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(px(i + 1) - px(i));
    slope.push((py(values[i + 1]) - py(values[i])) / dx[i]);
  }

  // Fritsch–Carlson tangents: zero at a turning point, harmonic mean elsewhere.
  const m: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    const a = slope[i - 1];
    const b = slope[i];
    if (a * b <= 0) {
      m.push(0);
    } else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      m.push((w1 + w2) / (w1 / a + w2 / b));
    }
  }
  m.push(slope[n - 2]);

  let d = `M${px(0)},${py(values[0])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${px(i) + h},${py(values[i]) + m[i] * h} ${px(i + 1) - h},${py(values[i + 1]) - m[i + 1] * h} ${px(i + 1)},${py(values[i + 1])}`;
  }
  return d;
}
