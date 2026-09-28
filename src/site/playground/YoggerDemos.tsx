import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/* segmented control (recreated from src/components/SegmentedControl) */
/* ------------------------------------------------------------------ */

function Segmented<T extends string>({
  value,
  options,
  onChange,
  layoutId,
  variant = 'filled',
  size = 'md'
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  layoutId: string;
  variant?: 'filled' | 'ghost';
  size?: 'sm' | 'md';
}) {
  return (
    <div className={`y-seg y-seg--${variant} y-seg--${size}`} role="tablist">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button key={o.id} type="button" role="tab" aria-selected={on} className={`y-seg__tab${on ? ' is-on' : ''}`} onClick={() => onChange(o.id)}>
            {on && <motion.span layoutId={layoutId} className="y-seg__pill" transition={{ type: 'spring', stiffness: 520, damping: 40 }} />}
            <span className="y-seg__label">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export const SegmentedDemo: React.FC = () => {
  const [tab, setTab] = useState<'videos' | 'snapshots' | 'assessments'>('videos');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<'functional' | 'performance' | 'range' | 'flows' | 'age'>('range');
  return (
    <div className="y-stack">
      <div className="y-row">
        <Segmented
          layoutId="demo-lib"
          value={tab}
          onChange={setTab}
          options={[
            { id: 'videos', label: 'Videos' },
            { id: 'snapshots', label: 'Snapshots' },
            { id: 'assessments', label: 'Assessments' }
          ]}
        />
        <Segmented
          layoutId="demo-view"
          value={view}
          onChange={setView}
          options={[
            { id: 'grid', label: 'Grid' },
            { id: 'list', label: 'List' }
          ]}
        />
      </div>
      <Segmented
        layoutId="demo-sort"
        variant="ghost"
        size="sm"
        value={sort}
        onChange={setSort}
        options={[
          { id: 'functional', label: 'Functional' },
          { id: 'performance', label: 'Performance' },
          { id: 'range', label: 'Range' },
          { id: 'flows', label: 'Flows' },
          { id: 'age', label: 'Movement Age' }
        ]}
      />
      <p className="y-hint">
        filled on a grey track for page-level switches, ghost for filters inside a card. same 8px corners as every other
        control.
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* coach roster (tone rule from src/.../Tasks/Coach/coachMock.ts)      */
/* ------------------------------------------------------------------ */

type Status = 'completed' | 'review' | 'overdue' | 'pending';
type Tone = 'good' | 'watch' | 'late';
interface Task {
  id: string;
  title: string;
  kind: 'assessment' | 'video' | 'program';
  status: Status;
  when: string;
}
interface Athlete {
  id: string;
  name: string;
  tasks: Task[];
}

/** late: 2+ overdue or under 30% done. watch: 1 overdue or under 60%. otherwise on track. */
function toneOf(tasks: Task[]): { tone: Tone; percent: number; open: number; overdue: number } {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const overdue = tasks.filter((t) => t.status === 'overdue').length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const tone: Tone = overdue >= 2 || percent < 30 ? 'late' : overdue === 1 || percent < 60 ? 'watch' : 'good';
  return { tone, percent, open: total - completed, overdue };
}

const T = (id: string, title: string, kind: Task['kind'], status: Status, when: string): Task => ({ id, title, kind, status, when });

const START: Athlete[] = [
  {
    id: 'a',
    name: 'Maya C.',
    tasks: [
      T('a1', 'Overhead squat screen', 'assessment', 'overdue', '6d overdue'),
      T('a2', 'Upload sprint start video', 'video', 'overdue', '4d overdue'),
      T('a3', 'Week 3 · Session 1', 'program', 'review', 'submitted yesterday'),
      T('a4', 'Gait analysis', 'assessment', 'completed', 'done sep 12'),
      T('a5', 'Shoulder ROM check', 'assessment', 'pending', 'due sep 21')
    ]
  },
  {
    id: 'b',
    name: 'Jordan H.',
    tasks: [
      T('b1', 'Single-leg balance', 'assessment', 'review', 'submitted sep 16'),
      T('b2', 'Upload landing mechanics clip', 'video', 'overdue', 'due yesterday'),
      T('b3', 'Week 2 · Session 3', 'program', 'completed', 'done sep 12'),
      T('b4', 'Sleep & soreness check-in', 'program', 'completed', 'done sep 16')
    ]
  },
  {
    id: 'c',
    name: 'Luis O.',
    tasks: [
      T('c1', 'Upload sprint start video', 'video', 'review', 'submitted sep 17'),
      T('c2', 'Shoulder ROM check', 'assessment', 'completed', 'done sep 16'),
      T('c3', 'Week 2 · Session 3', 'program', 'completed', 'done sep 12'),
      T('c4', 'Sleep & soreness check-in', 'program', 'completed', 'done sep 16')
    ]
  },
  {
    id: 'd',
    name: 'Priya S.',
    tasks: [
      T('d1', 'Neck mobility', 'assessment', 'overdue', '3d overdue'),
      T('d2', 'Hip rotation', 'assessment', 'review', 'submitted sep 15'),
      T('d3', 'Week 1 · Session 2', 'program', 'pending', 'due sep 20')
    ]
  }
];

const TONE_LABEL: Record<Tone, string> = { good: 'On track', watch: 'Watch', late: 'Late' };
const STATUS_LABEL: Record<Status, string> = { completed: 'Completed', review: 'Needs review', overdue: 'Overdue', pending: 'Pending' };

export const RosterDemo: React.FC = () => {
  const [athletes, setAthletes] = useState(START);
  const [filter, setFilter] = useState<'all' | 'attention' | 'track'>('all');
  const [selected, setSelected] = useState('a');

  const rows = useMemo(() => athletes.map((a) => ({ ...a, ...toneOf(a.tasks) })), [athletes]);
  const visible = rows.filter((r) => (filter === 'all' ? true : filter === 'track' ? r.tone === 'good' : r.tone !== 'good'));
  const current = rows.find((r) => r.id === selected) ?? rows[0];

  const update = (taskId: string, status: Status, when: string) =>
    setAthletes((list) =>
      list.map((a) => (a.id !== current.id ? a : { ...a, tasks: a.tasks.map((t) => (t.id === taskId ? { ...t, status, when } : t)) }))
    );

  return (
    <div className="yr">
      <div className="yr__list">
        <Segmented
          layoutId="roster-filter"
          size="sm"
          value={filter}
          onChange={setFilter}
          options={[
            { id: 'all', label: 'All' },
            { id: 'attention', label: 'Needs attention' },
            { id: 'track', label: 'On track' }
          ]}
        />
        <ul>
          {visible.map((r) => (
            <li key={r.id}>
              <button type="button" className={`yr__athlete${r.id === current.id ? ' is-on' : ''}`} onClick={() => setSelected(r.id)}>
                <span className="yr__avatar">{r.name[0]}</span>
                <span className="yr__who">
                  <strong>{r.name}</strong>
                  <em>{r.open} open</em>
                </span>
                <span className={`y-pill y-pill--${r.tone}`}>{TONE_LABEL[r.tone]}</span>
                <span className="yr__bar">
                  <motion.span className={`yr__fill yr__fill--${r.tone}`} animate={{ width: `${r.percent}%` }} transition={{ duration: 0.5 }} />
                </span>
              </button>
            </li>
          ))}
          {visible.length === 0 && <li className="y-hint">nobody here right now.</li>}
        </ul>
      </div>

      <div className="yr__detail">
        <div className="yr__head">
          <strong>{current.name}</strong>
          <span className={`y-pill y-pill--${current.tone}`}>{TONE_LABEL[current.tone]}</span>
        </div>
        <div className="yr__stats">
          <div>
            <span>Adherence</span>
            <b className="c-good">{current.percent}%</b>
          </div>
          <div>
            <span>Open tasks</span>
            <b className="c-watch">{current.open}</b>
          </div>
          <div>
            <span>Overdue</span>
            <b className="c-late">{current.overdue}</b>
          </div>
        </div>
        <ul className="yr__tasks">
          {current.tasks.map((t) => (
            <li key={t.id}>
              <span className={`yr__kind yr__kind--${t.kind}`} aria-hidden />
              <span className="yr__task">
                <strong>{t.title}</strong>
                <em>
                  {t.kind} · {t.when}
                </em>
              </span>
              {t.status === 'review' && (
                <button type="button" className="y-btn" onClick={() => update(t.id, 'completed', 'reviewed just now')}>
                  ✓ Mark reviewed
                </button>
              )}
              {t.status === 'overdue' && (
                <button type="button" className="y-btn y-btn--ghost" onClick={() => update(t.id, 'review', 'submitted just now')}>
                  simulate submit
                </button>
              )}
              <span className={`y-pill y-pill--${t.status}`}>{STATUS_LABEL[t.status]}</span>
            </li>
          ))}
        </ul>
        <p className="y-hint">
          the tone is computed, not set: late at 2+ overdue or under 30% done, watch at 1 overdue or under 60%. review a
          submission and watch the status change on its own.
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* exercise dose editor (prescriptionSummary from src/.../HEP/models)  */
/* ------------------------------------------------------------------ */

type Side = '' | 'both' | 'left' | 'right' | 'alternating';
interface Dose {
  sets: number;
  reps: number;
  hold: number;
  duration: number;
  rest: number;
  side: Side;
  times: number;
  per: 'day' | 'week';
}

const MAX_DAILY_FREQUENCY = 6;
const MAX_WEEKLY_FREQUENCY = 14;

function frequencyLabel(count: number, period: 'day' | 'week'): string {
  if (!(count > 0)) return '';
  const c = Math.round(count);
  if (period === 'day') {
    if (c <= 1 || c > MAX_DAILY_FREQUENCY) return 'Daily';
    return `${c}× daily`;
  }
  if (c <= 1) return '1× per week';
  if (c > MAX_WEEKLY_FREQUENCY) return 'Weekly';
  return `${c}× per week`;
}

function sideLabel(side: Side): string {
  if (!side) return '';
  if (side === 'both') return 'Both sides';
  if (side === 'alternating') return 'Alternating';
  return `${side.charAt(0).toUpperCase()}${side.slice(1)} side`;
}

/** "2 × 10 · Both sides · Daily" */
function prescriptionSummary(p: Dose): string {
  const parts: string[] = [];
  if (p.sets && p.reps) parts.push(`${p.sets} × ${p.reps}`);
  else if (p.sets) parts.push(`${p.sets} sets`);
  else if (p.reps) parts.push(`${p.reps} reps`);
  if (p.duration) parts.push(`${p.duration}s`);
  if (p.hold) parts.push(`${p.hold}s hold`);
  if (p.rest) parts.push(`${p.rest}s rest`);
  const side = sideLabel(p.side);
  if (side) parts.push(side);
  const cadence = frequencyLabel(p.times, p.per);
  if (cadence) parts.push(cadence);
  return parts.join(' · ');
}

const DoseInput: React.FC<{ label: string; value: number; onChange: (n: number) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <label className="y-field">
    <span>{label}</span>
    <input
      type="number"
      min={0}
      value={value || ''}
      placeholder={placeholder ?? '—'}
      onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
    />
  </label>
);

export const DoseEditor: React.FC = () => {
  const [d, setD] = useState<Dose>({ sets: 2, reps: 10, hold: 0, duration: 0, rest: 0, side: 'both', times: 1, per: 'day' });
  const set = <K extends keyof Dose>(k: K) => (v: Dose[K]) => setD((cur) => ({ ...cur, [k]: v }));
  const summary = prescriptionSummary(d);
  const weekly = d.sets * d.reps * (d.per === 'day' ? Math.round(d.times || 0) * 7 : Math.round(d.times || 0));

  return (
    <div className="yd">
      <div className="yd__card">
        <div className="yd__row">
          <span className="yd__num">1</span>
          <span className="yd__thumb" aria-hidden />
          <strong>Wall Push-Up</strong>
          <span className="y-tag">Chest</span>
          <motion.span key={summary} className="yd__summary" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}>
            {summary || 'no dose yet'}
          </motion.span>
        </div>
        <div className="yd__fields">
          <DoseInput label="Sets" value={d.sets} onChange={set('sets')} />
          <DoseInput label="Reps" value={d.reps} onChange={set('reps')} />
          <DoseInput label="Hold (s)" value={d.hold} onChange={set('hold')} />
          <DoseInput label="Duration (s)" value={d.duration} onChange={set('duration')} />
          <DoseInput label="Rest (s)" value={d.rest} onChange={set('rest')} />
          <label className="y-field">
            <span>Side</span>
            <select value={d.side} onChange={(e) => set('side')(e.target.value as Side)}>
              <option value="">—</option>
              <option value="both">Both</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="alternating">Alternating</option>
            </select>
          </label>
          <DoseInput label="Times" value={d.times} onChange={set('times')} />
          <label className="y-field">
            <span>Per</span>
            <select value={d.per} onChange={(e) => set('per')(e.target.value as Dose['per'])}>
              <option value="day">Day</option>
              <option value="week">Week</option>
            </select>
          </label>
        </div>
      </div>
      <p className="y-hint">
        {weekly > 0 ? `${weekly} reps a week at this dose. ` : ''}the summary line is what the athlete sees on their phone, so
        silly inputs collapse: try 100 times a day.
      </p>
    </div>
  );
};
