import React, { useEffect, useRef } from 'react';
import './Collapse.css';

const DURATION = 420;

/**
 * Opens and closes on the content's real height, measured each time. A css-only
 * 0fr/1fr grid looks tidier but collapses to a single line here, so this measures.
 */
const Collapse: React.FC<{ open: boolean; className?: string; children: React.ReactNode }> = ({
  open,
  className,
  children
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // No animation on the first paint — it just starts in the right state.
    if (first.current) {
      first.current = false;
      el.style.height = open ? 'auto' : '0px';
      if (open) el.classList.add('is-settled');
      return undefined;
    }

    // Clip again while the height moves; a settled panel lets its children bleed.
    el.classList.remove('is-settled');

    // Give the transition a concrete start, then a concrete end.
    el.style.height = `${open ? 0 : el.scrollHeight}px`;
    void el.offsetHeight;
    el.style.height = open ? `${el.scrollHeight}px` : '0px';

    if (!open) return undefined;
    // Once it's open, hand the height back to the content so it can grow.
    const settle = () => {
      el.style.height = 'auto';
      el.classList.add('is-settled');
    };
    el.addEventListener('transitionend', settle, { once: true });
    const id = window.setTimeout(settle, DURATION + 60);
    return () => {
      el.removeEventListener('transitionend', settle);
      window.clearTimeout(id);
    };
  }, [open]);

  return (
    <div ref={ref} className={`collapse${className ? ` ${className}` : ''}`} aria-hidden={!open}>
      {children}
    </div>
  );
};

export default Collapse;
