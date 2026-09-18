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

const ROW = 8;
const GAP = 12;

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];
const LAYOUT_TRANSITION = { duration: 0.75, ease: EASE };

function useIsMobile(query = '(max-width: 640px)') {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return mobile;
}

function exifLine(p: Photo): string {
  const e = p.exif;
  const parts = [e.camera, e.lens, e.focal, e.aperture, e.shutter, e.iso].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'film scan · no exif';
}

function rowSpan(p: Photo, width: number): number {
  const height = (width * p.h) / p.w;
  return Math.max(1, Math.ceil((height + GAP) / (ROW + GAP)));
}

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

/** One photo at a time — topic menu + left/right (and swipe). No page scroll. */
const MobileSlider: React.FC<{ photos: Photo[]; subject: string }> = ({ photos, subject }) => {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    setIndex(0);
  }, [subject, photos]);

  const n = photos.length;
  const go = useCallback(
    (dir: number) => {
      if (n < 1) return;
      setIndex((i) => (i + dir + n) % n);
    },
    [n]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <div className="gallery__simple">
      <button type="button" className="gallery__simple-btn" aria-label="Previous photo" onClick={() => go(-1)}>
        ‹
      </button>
      <div
        className="gallery__simple-frame"
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) < 40) return;
          go(dx < 0 ? 1 : -1);
        }}
      >
        <img
          key={photo.id}
          className="gallery__simple-img"
          src={asset(photo.srcSmall)}
          srcSet={`${asset(photo.srcSmall)} 800w, ${asset(photo.src)} 1600w`}
          sizes="(max-width: 640px) 78vw, 400px"
          alt=""
          decoding="async"
        />
      </div>
      <button type="button" className="gallery__simple-btn" aria-label="Next photo" onClick={() => go(1)}>
        ›
      </button>
      <div className="gallery__simple-meta">
        <span>{photo.exif.date || subject}</span>
        <span>
          {index + 1}/{n}
        </span>
      </div>
    </div>
  );
};

const MobileGallery: React.FC<{
  grouped: { subject: string; photos: Photo[] }[];
}> = ({ grouped }) => {
  const topics = useMemo(() => grouped.map((g) => g.subject), [grouped]);
  const [subject, setSubject] = useState(topics[0] ?? SUBJECT_ORDER[0]);

  useEffect(() => {
    if (!topics.includes(subject) && topics[0]) setSubject(topics[0]);
  }, [topics, subject]);

  const photos = useMemo(
    () => grouped.find((g) => g.subject === subject)?.photos ?? [],
    [grouped, subject]
  );

  return (
    <div className="gallery gallery--mobile container">
      <h1 className="sr-only">Photos</h1>
      <header className="gallery__head">
        <div className="gallery__filters" role="tablist" aria-label="subjects">
          {topics.map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={subject === s}
              className={`squig squig--ink gallery__filter${subject === s ? ' is-active' : ''}`}
              onClick={() => setSubject(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <div className="gallery__morph">
        <MobileSlider key={subject} photos={photos} subject={subject} />
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const mobile = useIsMobile();
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

  if (mobile) return <MobileGallery grouped={grouped} />;

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
