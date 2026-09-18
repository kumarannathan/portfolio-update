import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import manifest from './data/gallery.json';
import { subjectOf, SUBJECT_ORDER } from './data/gallerySubjects';
import './Gallery.css';

interface Exif {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  focal?: string;
  date?: string;
}

export interface Photo {
  id: string;
  group: string;
  file: string;
  src: string;
  srcSmall: string;
  w: number;
  h: number;
  blur: string;
  exif: Exif;
}

const asset = (p: string) => `${(process.env.PUBLIC_URL || '').replace(/\/$/, '')}${p}`;
const PHOTOS: Photo[] = (manifest as { photos: Photo[] }).photos;


/** Masonry is a CSS grid with tiny rows; each tile spans enough rows for its aspect ratio. */
const ROW = 8;
const GAP = 12;

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];
const LAYOUT_TRANSITION = { duration: 0.75, ease: EASE };

function exifLine(p: Photo): string {
  const e = p.exif;
  const parts = [e.camera, e.lens, e.focal, e.aperture, e.shutter, e.iso].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'film scan · no exif';
}

function rowSpan(p: Photo, width: number): number {
  const height = (width * p.h) / p.w;
  return Math.max(1, Math.ceil((height + GAP) / (ROW + GAP)));
}

/** Watch a grid and report its column width and full width. */
function useGridMetrics(ref: React.RefObject<HTMLDivElement | null>, columns: number) {
  const [m, setM] = useState({ col: 0, full: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const full = el.clientWidth;
      const col = (full - GAP * (columns - 1)) / columns;
      setM((cur) => (cur.col === col && cur.full === full ? cur : { col, full }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, columns]);
  return m;
}

function useColumns(): number {
  const get = () => (window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3);
  const [cols, setCols] = useState(get);
  useEffect(() => {
    const onResize = () => setCols(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return cols;
}

interface TileProps {
  photo: Photo;
  eager?: boolean;
  expanded: boolean;
  span: number;
  colSpan: number;
  onToggle: (p: Photo) => void;
}

const PhotoTile: React.FC<TileProps> = ({ photo, eager, expanded, span, colSpan, onToggle }) => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!expanded) return undefined;
    // Bring the opened photo into view once the grid has re-flowed around it.
    const id = window.setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    return () => window.clearTimeout(id);
  }, [expanded]);

  return (
    <motion.figure
      ref={ref}
      layout
      transition={LAYOUT_TRANSITION}
      className={`gtile${loaded ? ' is-loaded' : ''}${expanded ? ' is-expanded' : ''}`}
      style={{
        gridRowEnd: `span ${span}`,
        gridColumn: expanded && colSpan > 1 ? `span ${colSpan}` : undefined
      }}
      onClick={() => onToggle(photo)}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
      aria-label={`${expanded ? 'collapse' : 'expand'} photo ${photo.id}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(photo);
        }
      }}
    >
      <img
        src={asset(photo.srcSmall)}
        srcSet={`${asset(photo.srcSmall)} 800w, ${asset(photo.src)} 1600w`}
        sizes={expanded ? '(max-width: 1024px) 92vw, 700px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px'}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
      <figcaption className="gtile__meta">
        <span className="gtile__exif">{exifLine(photo)}</span>
        {photo.exif.date && <span className="gtile__date">{photo.exif.date}</span>}
      </figcaption>
    </motion.figure>
  );
};

const GroupGrid: React.FC<{
  photos: Photo[];
  columns: number;
  expandedId: string | null;
  onToggle: (p: Photo) => void;
  eagerStart: number;
}> = ({ photos, columns, expandedId, onToggle, eagerStart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { col } = useGridMetrics(ref, columns);

  return (
    <div
      ref={ref}
      className="ggrid"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridAutoRows: `${ROW}px`, gap: `${GAP}px` }}
    >
      {photos.map((p, i) => {
        const expanded = expandedId === p.id;
        // Open tiles take two columns (never the whole row on wide screens), so the rest packs around them.
        const colSpan = expanded ? Math.min(2, columns) : 1;
        const width = colSpan > 1 ? col * colSpan + GAP * (colSpan - 1) : col;
        return (
          <PhotoTile
            key={p.id}
            photo={p}
            eager={eagerStart + i < 8}
            expanded={expanded}
            span={width ? rowSpan(p, width) : 20}
            colSpan={colSpan}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
};

const Gallery: React.FC = () => {
  const [subject, setSubject] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const columns = useColumns();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!expandedId) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedId]);

  const grouped = useMemo(() => {
    const bySubject = new Map<string, Photo[]>();
    for (const p of PHOTOS) {
      const s = subjectOf(p);
      if (!bySubject.has(s)) bySubject.set(s, []);
      bySubject.get(s)!.push(p);
    }
    return SUBJECT_ORDER.filter((s) => bySubject.has(s)).map((s) => ({ subject: s, photos: bySubject.get(s)! }));
  }, []);

  const visible = subject === 'all' ? grouped : grouped.filter((g) => g.subject === subject);

  const toggle = useCallback((p: Photo) => setExpandedId((cur) => (cur === p.id ? null : p.id)), []);

  let eagerStart = 0;

  return (
    <div className="gallery container">
      <h1 className="sr-only">Photos</h1>
      <header className="gallery__head">
        <div className="gallery__filters" role="tablist" aria-label="subjects">
          {['all', ...grouped.map((g) => g.subject)].map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={subject === s}
              className={`squig squig--ink gallery__filter${subject === s ? ' is-active' : ''}`}
              onClick={() => {
                setSubject(s);
                setExpandedId(null);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <LayoutGroup>
        {visible.map((g) => {
          const start = eagerStart;
          eagerStart += g.photos.length;
          return (
            <section key={g.subject} className="gallery__group">
              <h3 className="gallery__subject">
                {g.subject} <span className="gallery__count">{g.photos.length}</span>
              </h3>
              <GroupGrid photos={g.photos} columns={columns} expandedId={expandedId} onToggle={toggle} eagerStart={start} />
            </section>
          );
        })}
      </LayoutGroup>
    </div>
  );
};

export default Gallery;
