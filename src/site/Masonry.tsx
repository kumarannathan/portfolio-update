import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Masonry.css';

export interface MasonryItem {
  key: string;
  /** Natural width and height — only the ratio is used. */
  w: number;
  h: number;
}

interface MasonryProps<T extends MasonryItem> {
  items: T[];
  /** Narrowest a column is allowed to get before dropping one. */
  minColumn?: number;
  /** Never more columns than this. */
  maxColumns?: number;
  gap?: number;
  className?: string;
  children: (item: T) => React.ReactNode;
}

/**
 * Columns balanced by height, so nothing is cropped and nothing is stretched —
 * each tile keeps the shape it was shot in. CSS multi-column can't be used here:
 * it fragments boxes and fights the shared-element animation.
 */
export function Masonry<T extends MasonryItem>({
  items,
  minColumn = 260,
  maxColumns = 4,
  gap = 14,
  className,
  children
}: MasonryProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => setWidth(el.clientWidth);
    const ro = new ResizeObserver(read);
    ro.observe(el);
    read();
    return () => ro.disconnect();
  }, []);

  const columns = width ? Math.max(1, Math.min(maxColumns, Math.floor((width + gap) / (minColumn + gap)))) : 1;

  // Each item lands in whichever column is shortest, measured in aspect ratios.
  const buckets = useMemo(() => {
    const out: T[][] = Array.from({ length: columns }, () => []);
    const heights = new Array(columns).fill(0);
    for (const item of items) {
      let at = 0;
      for (let i = 1; i < columns; i++) if (heights[i] < heights[at]) at = i;
      out[at].push(item);
      heights[at] += item.h / item.w;
    }
    return out;
  }, [items, columns]);

  return (
    <div ref={ref} className={`masonry${className ? ` ${className}` : ''}`} style={{ gap }}>
      {buckets.map((bucket, i) => (
        <div className="masonry__col" key={i} style={{ gap }}>
          {bucket.map((item) => (
            <React.Fragment key={item.key}>{children(item)}</React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Masonry;
