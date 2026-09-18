import React, { useCallback, useRef, useState } from 'react';
import { ScreenPair } from './data/redesign';
import './BeforeAfter.css';

const asset = (p: string) => `${(process.env.PUBLIC_URL || '').replace(/\/$/, '')}${p.startsWith('/') ? p : `/${p}`}`;

/** An image that swaps to a labelled placeholder if the file isn't there yet. */
export const ShotImage: React.FC<{ src: string; label: string; className?: string }> = ({ src, label, className = '' }) => {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div className={`shot-missing ${className}`.trim()}>
        <span>{label}</span>
        <code>{src.replace('/projects/', 'public/projects/')}</code>
      </div>
    );
  }
  return <img className={className} src={asset(src)} alt={label} loading="lazy" decoding="async" onError={() => setMissing(true)} draggable={false} />;
};

/**
 * Drag the divider (or use the arrow keys) to wipe between the old and new ui.
 * The after image sets the size; the before image is clipped over it.
 */
const BeforeAfter: React.FC<{ pair: ScreenPair }> = ({ pair }) => {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <figure className="ba">
      <div
        ref={ref}
        className="ba__stage"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setFromX(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromX(e.clientX)}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        <ShotImage src={pair.after} label={`${pair.label} · after`} className="ba__img" />
        <div className="ba__before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <ShotImage src={pair.before} label={`${pair.label} · before`} className="ba__img" />
        </div>
        <span className="ba__tag ba__tag--before" style={{ opacity: pos > 12 ? 1 : 0 }}>
          before
        </span>
        <span className="ba__tag ba__tag--after" style={{ opacity: pos < 88 ? 1 : 0 }}>
          after
        </span>
        <div
          className="ba__handle"
          style={{ left: `${pos}%` }}
          role="slider"
          tabIndex={0}
          aria-label={`${pair.label}: compare before and after`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5));
            if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5));
          }}
        >
          <span className="ba__knob" aria-hidden>
            ‹ ›
          </span>
        </div>
      </div>
      <figcaption>{pair.label}</figcaption>
    </figure>
  );
};

export default BeforeAfter;
