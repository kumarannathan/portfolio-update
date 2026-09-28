import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { compactNumber, dotLayout, monotonePath } from './crmCharts';

/* -------------------------------------------------------------------------- */
/* shared                                                                      */
/* -------------------------------------------------------------------------- */

/** Deterministic noise, so the demo series looks like signups and never changes under you. */
function series(seed: number, days: number): number[] {
  let s = seed >>> 0;
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: days }, (_, i) => {
    const weekend = i % 7 === 5 || i % 7 === 6 ? 0.68 : 1;
    const drift = 1 + (i / days) * 0.55;
    return Math.round((48 + rnd() * 74) * weekend * drift);
  });
}

const DAY_LABELS = (n: number) => {
  const end = new Date(2026, 8, 27);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(end);
    d.setDate(end.getDate() - (n - 1 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
};

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // Width is only read, never written back, so this cannot loop.
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/* -------------------------------------------------------------------------- */
/* metric card — crm/ui/metric-card.tsx + crm/charts/sparkline.tsx              */
/* -------------------------------------------------------------------------- */

function Sparkline({ data, color, width, height = 40 }: { data: number[]; color: string; width: number; height?: number }) {
  const id = useMemo(() => `spark-${Math.random().toString(36).slice(2)}`, []);
  if (width < 10 || data.length < 2) return null;
  const line = monotonePath(data, width, height);
  return (
    <svg width={width} height={height} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.24} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${line} L${width - 2},${height} L2,${height} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaLabel = 'vs previous period',
  caption,
  trend
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: number | null;
  deltaLabel?: string;
  caption?: string;
  trend?: number[];
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const hasDelta = typeof delta === 'number' && Number.isFinite(delta);
  const up = hasDelta && (delta as number) >= 0;
  // The sparkline follows the delta, not the series: down is red even if it ends high.
  const color = !hasDelta ? 'var(--c-brand)' : up ? 'var(--c-brand)' : 'var(--c-red)';

  return (
    <div className="c-card">
      <div className="c-card__head">{label}</div>
      <div className="c-card__body">
        <div className="c-metric">
          <p className="c-metric__value">
            {value}
            {unit && <span className="c-metric__unit">{unit}</span>}
          </p>
          <div className="c-metric__spark" ref={ref}>
            {trend && <Sparkline data={trend} color={color} width={width} />}
          </div>
        </div>
        <div className="c-metric__foot">
          {hasDelta ? (
            <>
              <span className={`c-badge${up ? '' : ' c-badge--down'}`}>
                {up ? '↑' : '↓'} {Math.abs(delta as number).toFixed(1)}%
              </span>
              <span className="c-metric__caption">{deltaLabel}</span>
            </>
          ) : (
            caption && <span className="c-metric__caption">{caption}</span>
          )}
        </div>
      </div>
    </div>
  );
}

const RANGES = [
  { key: '7D', days: 7 },
  { key: '30D', days: 30 },
  { key: '90D', days: 90 }
];

export const MetricRow: React.FC = () => {
  const [range, setRange] = useState(1);
  const days = RANGES[range].days;
  const data = useMemo(() => series(7, days), [days]);
  const prior = useMemo(() => series(11, days), [days]);

  const total = data.reduce((a, b) => a + b, 0);
  const priorTotal = prior.reduce((a, b) => a + b, 0);
  const delta = ((total - priorTotal) / priorTotal) * 100;
  const peak = Math.max(...data);
  const peakDay = DAY_LABELS(days)[data.indexOf(peak)];
  const priorPeak = Math.max(...prior);

  return (
    <div className="c-stack">
      <div className="c-seg" role="group" aria-label="range">
        {RANGES.map((r, i) => (
          <button key={r.key} type="button" className={`c-seg__btn${i === range ? ' is-on' : ''}`} onClick={() => setRange(i)}>
            {r.key}
          </button>
        ))}
      </div>
      <div className="c-grid c-grid--3">
        <MetricCard label="Signups" value={total.toLocaleString()} delta={delta} deltaLabel={`vs prior ${days}d`} trend={data} />
        <MetricCard
          label="Average per day"
          value={(total / days).toFixed(1)}
          unit="signups"
          delta={delta}
          deltaLabel="vs prior period"
          trend={data}
        />
        <MetricCard
          label="Peak day"
          value={peak.toLocaleString()}
          delta={((peak - priorPeak) / priorPeak) * 100}
          deltaLabel={peakDay}
          trend={data}
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* dot matrix — crm/charts/dot-matrix.tsx                                       */
/* -------------------------------------------------------------------------- */

export const DotMatrix: React.FC = () => {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [days, setDays] = useState(30);
  const [hover, setHover] = useState<number | null>(null);
  const height = 260;

  const data = useMemo(() => series(7, days), [days]);
  const labels = useMemo(() => DAY_LABELS(days), [days]);
  const L = useMemo(() => dotLayout(data, labels, Math.max(width, 1), height), [data, labels, width]);

  if (width < 80) return <div className="c-stack" ref={ref} style={{ minHeight: height }} />;

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const box = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
    const x = e.clientX - box.left - L.margin.left;
    setHover(Math.max(0, Math.min(data.length - 1, Math.floor(x / L.step))));
  };

  return (
    <div className="c-stack" ref={ref}>
      <div className="c-seg" role="group" aria-label="range">
        {[7, 30, 90].map((d) => (
          <button key={d} type="button" className={`c-seg__btn${d === days ? ' is-on' : ''}`} onClick={() => setDays(d)}>
            {d}D
          </button>
        ))}
      </div>
      <div className="c-card">
        <div className="c-card__head">
          Signups over time
          <span className="c-card__sub">
            By day · {data.reduce((a, b) => a + b, 0).toLocaleString()} total · 1 dot ≈ {Math.round(L.perDot)}
          </span>
        </div>
        <div className="c-card__body c-card__body--flush">
          <div className="c-plot">
            <svg width={width} height={height} role="img" aria-label="Signups by day">
              <g transform={`translate(${L.margin.left},${L.margin.top})`}>
                {L.yTicks.map((t) => (
                  <g key={t}>
                    <line x1={0} x2={L.innerW} y1={L.y(t)} y2={L.y(t)} stroke="var(--c-grid)" strokeDasharray="3 4" />
                    <text x={-12} y={L.y(t) + 4} textAnchor="end" fontSize={11} fill="var(--c-faint)">
                      {compactNumber(t)}
                    </text>
                  </g>
                ))}
                {data.map((v, i) => {
                  const cx = L.xAt(i) + L.bandwidth / 2;
                  const dots = Math.round(v / L.perDot);
                  const muted = hover !== null && hover !== i;
                  return (
                    <g key={i} opacity={muted ? 0.45 : 1}>
                      {Array.from({ length: Math.min(L.rows, dots) }, (_, r) => (
                        <circle key={r} cx={cx} cy={L.innerH - L.dot / 2 - r * (L.dot + L.gap)} r={L.dot / 2} fill="var(--c-brand)" />
                      ))}
                      {i % L.every === 0 && (
                        <text x={cx} y={L.innerH + 18} textAnchor="middle" fontSize={11} fill="var(--c-faint)">
                          {labels[i]}
                        </text>
                      )}
                    </g>
                  );
                })}
                <rect
                  width={L.innerW}
                  height={L.innerH}
                  fill="transparent"
                  onPointerMove={onMove}
                  onPointerLeave={() => setHover(null)}
                />
              </g>
            </svg>
            {hover !== null && (
              <div
                className="c-tip"
                style={{
                  left: L.margin.left + L.xAt(hover) + L.bandwidth / 2,
                  top: L.margin.top + L.y(data[hover])
                }}
              >
                <p className="c-tip__label">{labels[hover]}</p>
                <p className="c-tip__value">
                  <span className="c-tip__dot" />
                  {data[hover].toLocaleString()} <span>signups</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* fit pager — crm/ui/fit-pager.tsx                                             */
/* -------------------------------------------------------------------------- */

type Stage = 'New' | 'Responded' | 'Resolved';
type Lead = { id: number; stage: Stage; company: string; owner: string };

const COMPANIES = [
  'sports medicine clinic',
  'university lab',
  'performance gym',
  'physio practice',
  'rehab center',
  'college athletics',
  'movement studio',
  'chiro office',
  'pro team',
  'private clinic',
  'training facility',
  'health system'
];

const LEADS: Lead[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  stage: i % 3 === 0 ? 'New' : i % 3 === 1 ? 'Responded' : 'Resolved',
  company: COMPANIES[i % COMPANIES.length],
  owner: ['KK', 'HP', 'MI'][i % 3]
}));

const ITEM_HEIGHT = 58;

export const FitPagerDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  // The panel's height belongs to the user's drag (css resize), not to react — we
  // only measure it, so setting this never fights the element for control.
  const [height, setHeight] = useState(300);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = boxRef.current;
    if (el) setHeight(el.clientHeight);
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [measure]);

  // The whole trick: how many rows fit is a measurement, not a constant.
  const perPage = Math.max(1, Math.floor((height - 34) / ITEM_HEIGHT));
  const pages = Math.max(1, Math.ceil(LEADS.length / perPage));
  const current = Math.min(page, pages - 1);
  const visible = LEADS.slice(current * perPage, (current + 1) * perPage);

  return (
    <div className="c-stack">
      <p className="c-note">drag the bottom-right corner of the panel. the list never scrolls — it re-decides how many rows fit and pages the rest.</p>
      {/* The drag itself also measures, so the list keeps up even where resize
          notifications are throttled. */}
      <div className="c-card c-resize" ref={boxRef} onPointerMove={measure} onPointerUp={measure}>
        <div className="c-card__head">
          Form submissions
          <span className="c-card__sub">{perPage} per page · {pages} pages</span>
        </div>
        <div className="c-card__body c-pager">
          <ul className="c-list">
            {visible.map((lead) => (
              <li key={lead.id} className="c-row">
                <span className="c-row__mark" data-stage={lead.stage} />
                <span className="c-row__main">
                  <span className="c-row__title">submission #{String(lead.id).padStart(3, '0')}</span>
                  <span className="c-row__sub">{lead.company}</span>
                </span>
                <span className="c-row__stage">{lead.stage}</span>
                <span className="c-row__owner">{lead.owner}</span>
              </li>
            ))}
          </ul>
          <div className="c-pager__foot">
            <span>
              {current * perPage + 1}–{Math.min(LEADS.length, (current + 1) * perPage)} of {LEADS.length}
            </span>
            <span className="c-pager__btns">
              <button type="button" onClick={() => setPage(current - 1)} disabled={current === 0} aria-label="Previous">
                ‹
              </button>
              <button type="button" onClick={() => setPage(current + 1)} disabled={current >= pages - 1} aria-label="Next">
                ›
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
