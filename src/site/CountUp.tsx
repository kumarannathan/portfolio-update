import React, { useEffect, useRef, useState } from 'react';

/**
 * Counts a KPI up from zero the first time it scrolls into view.
 * Keeps whatever wraps the number: "+40%", "~$1.50", "47,000", "2×", "16.8K peak", "1st".
 * Values with no number in them ("steam", "featured") render as-is.
 */
const NUM = /^([^\d]*?)(\d[\d,]*(?:\.\d+)?)(.*)$/;

function parse(value: string) {
  const m = value.match(NUM);
  if (!m) return null;
  const raw = m[2];
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return { prefix: m[1], target: parseFloat(raw.replace(/,/g, '')), decimals, commas: raw.includes(','), suffix: m[3] };
}

function format(n: number, decimals: number, commas: boolean) {
  const fixed = n.toFixed(decimals);
  if (!commas) return fixed;
  const [int, dec] = fixed.split('.');
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec ? `.${dec}` : '');
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const CountUp: React.FC<{ value: string; duration?: number; className?: string }> = ({ value, duration = 1300, className }) => {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(() => (parsed ? format(0, parsed.decimals, parsed.commas) : value));

  useEffect(() => {
    if (!parsed) return undefined;
    const el = ref.current;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const final = format(parsed.target, parsed.decimals, parsed.commas);
    if (!el || reduced) {
      setShown(final);
      return undefined;
    }
    let raf = 0;
    let finish = 0;
    let started = false;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        setShown(format(parsed.target * easeOut(p), parsed.decimals, parsed.commas));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      // Animation frames pause in hidden tabs; never leave a KPI stuck mid-count.
      finish = window.setTimeout(() => {
        cancelAnimationFrame(raf);
        setShown(final);
      }, duration + 250);
    };
    if (typeof IntersectionObserver === 'undefined') {
      setShown(final);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!started && entries[0]?.isIntersecting) {
          started = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    // If it's never seen as on screen (hidden tab, print, crawler), show the real number anyway.
    const fallback = window.setTimeout(() => {
      if (!started) {
        started = true;
        io.disconnect();
        setShown(final);
      }
    }, 1500);
    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  if (!parsed) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden>
        {parsed.prefix}
        {shown}
        {parsed.suffix}
      </span>
    </span>
  );
};

export default CountUp;
