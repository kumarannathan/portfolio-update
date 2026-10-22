import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import manifest from './data/gallery.json';
import { subjectOf, SUBJECT_ORDER, SUBJECT_LABEL } from './data/gallerySubjects';
import Masonry from './Masonry';
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

const DASH = '—';

/** "may 2024" → "2024". */
function yearOf(p: Photo): string | undefined {
  return p.exif.date?.match(/\b(19|20)\d{2}\b/)?.[0];
}

function subjectLabel(p: Photo): string {
  const s = subjectOf(p);
  return SUBJECT_LABEL[s] ?? s;
}

/* -------------------------------------------------------------------------- */
/* filters                                                                     */
/* -------------------------------------------------------------------------- */

type FacetKey = 'camera' | 'lens' | 'year' | 'subject';

const FACETS: { key: FacetKey; label: string; of: (p: Photo) => string | undefined }[] = [
  { key: 'camera', label: 'model', of: (p) => p.exif.camera },
  { key: 'lens', label: 'lens', of: (p) => p.exif.lens },
  { key: 'year', label: 'year', of: yearOf },
  { key: 'subject', label: 'subject', of: subjectLabel }
];

type Picked = Partial<Record<FacetKey, string>>;

const FilterBar: React.FC<{
  photos: Photo[];
  picked: Picked;
  onPick: (key: FacetKey, value: string | undefined) => void;
  count: number;
}> = ({ photos, picked, onPick, count }) => {
  const [open, setOpen] = useState<FacetKey | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const away = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, []);

  // Every value a facet actually has, with how many photos carry it.
  const values = useMemo(() => {
    const out: Record<string, { value: string; count: number }[]> = {};
    for (const f of FACETS) {
      const tally = new Map<string, number>();
      for (const p of photos) {
        const v = f.of(p);
        if (v) tally.set(v, (tally.get(v) ?? 0) + 1);
      }
      const order = f.key === 'subject' ? SUBJECT_ORDER.map((s) => SUBJECT_LABEL[s] ?? s) : null;
      out[f.key] = Array.from(tally.entries())
        .map(([value, n]) => ({ value, count: n }))
        .sort((a, b) =>
          order ? order.indexOf(a.value) - order.indexOf(b.value) : b.count - a.count || a.value.localeCompare(b.value)
        );
    }
    return out;
  }, [photos]);

  return (
    <div className="fbar" ref={ref}>
      {FACETS.map((f) => (
        <div key={f.key} className="fbar__slot">
          {open === f.key && (
            <div className="fmenu" role="listbox">
              {picked[f.key] && (
                <button type="button" className="fmenu__row" onClick={() => {
                    onPick(f.key, undefined);
                    setOpen(null);
                  }}>
                  <span>any {f.label}</span>
                </button>
              )}
              {values[f.key].map((v) => (
                <button
                  key={v.value}
                  type="button"
                  className={`fmenu__row${picked[f.key] === v.value ? ' is-on' : ''}`}
                  onClick={() => {
                    onPick(f.key, v.value);
                    setOpen(null);
                  }}
                >
                  <span>{v.value}</span>
                  <span className="fmenu__n">{v.count}</span>
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            className={`fchip${picked[f.key] ? ' is-on' : ''}`}
            aria-expanded={open === f.key}
            title={picked[f.key] ? `clear ${f.label}` : undefined}
            onClick={() => {
              if (picked[f.key]) {
                onPick(f.key, undefined);
                setOpen(null);
              } else setOpen((cur) => (cur === f.key ? null : f.key));
            }}
          >
            {picked[f.key] ?? f.label}
          </button>
        </div>
      ))}
      <span className="fbar__count">{count}</span>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* tile: the blurred thumbnail sits underneath and the real image fades over it */
/* -------------------------------------------------------------------------- */

const Tile: React.FC<{ photo: Photo; morph: boolean; eager: boolean; onOpen: (id: string) => void }> = ({ photo: p, morph, eager, onOpen }) => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // An image the browser already had is complete before onLoad can fire.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, []);

  const img = morph ? (
    <motion.img
      layoutId={`shot-${p.id}`}
      className="tile__img is-loaded"
      src={asset(p.srcSmall)}
      alt=""
      transition={{ type: 'spring', stiffness: 240, damping: 30 }}
    />
  ) : (
    <img
      ref={ref}
      className={`tile__img${loaded ? ' is-loaded' : ''}`}
      src={asset(p.srcSmall)}
      width={p.w}
      height={p.h}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
    />
  );

  return (
    <figure className="tile">
      <div
        className={`tile__frame${loaded || morph ? ' is-loaded' : ''}`}
        style={{ aspectRatio: `${p.w} / ${p.h}`, backgroundImage: `url(${p.blur})` }}
        onClick={() => onOpen(p.id)}
      >
        {img}
      </div>
      <figcaption className="tile__cap">
        <span>{p.exif.date ?? subjectLabel(p)}</span>
        <span className="tile__sub">{p.exif.camera ?? 'no exif'}</span>
      </figcaption>
    </figure>
  );
};

/* -------------------------------------------------------------------------- */
/* detail                                                                      */
/* -------------------------------------------------------------------------- */

const Row: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="meta__row">
    <span className="meta__value">{value || DASH}</span>
    <span className="meta__label">{label}</span>
  </div>
);

const Detail: React.FC<{ photo: Photo; onClose: () => void; onStep: (dir: 1 | -1) => void }> = ({
  photo,
  onClose,
  onStep
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      className="detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      <motion.img
        layoutId={`shot-${photo.id}`}
        className="detail__img"
        src={asset(photo.src)}
        alt=""
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      />

      <motion.aside
        className="meta"
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 18 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <Row label="Subject" value={subjectLabel(photo)} />
        <Row label="Taken on" value={photo.exif.date} />
        <div className="meta__gap" />
        <Row label="Camera" value={photo.exif.camera} />
        <Row label="Lens" value={photo.exif.lens} />
        <Row label="Focal length" value={photo.exif.focal} />
        <Row label="Aperture" value={photo.exif.aperture} />
        <Row label="Shutter speed" value={photo.exif.shutter} />
        <Row label="ISO" value={photo.exif.iso} />
        <div className="meta__gap" />
        <Row label="Pixels" value={`${photo.w} × ${photo.h}`} />
      </motion.aside>

      <button type="button" className="detail__close" onClick={onClose} aria-label="Close">
        ✕
      </button>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */

/** Phones get two tight columns; everything else keeps the airy layout. */
function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
}

const Gallery: React.FC = () => {
  const narrow = useNarrow();
  const [picked, setPicked] = useState<Picked>({});
  const [openId, setOpenId] = useState<string | null>(null);
  // Which tile is allowed to be a shared element. Held past the close so the
  // photo has something to morph back into, then released.
  const [morphId, setMorphId] = useState<string | null>(null);
  const release = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const shown = useMemo(
    () =>
      PHOTOS.filter((p) =>
        FACETS.every((f) => {
          const want = picked[f.key];
          return !want || f.of(p) === want;
        })
      ),
    [picked]
  );

  const opened = shown.find((p) => p.id === openId) ?? null;

  const open = useCallback((photoId: string) => {
    window.clearTimeout(release.current);
    setMorphId(photoId);
    setOpenId(photoId);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    release.current = window.setTimeout(() => setMorphId(null), 450);
  }, []);

  useEffect(() => () => window.clearTimeout(release.current), []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenId((cur) => {
        const i = shown.findIndex((p) => p.id === cur);
        if (i < 0) return cur;
        const nextId = shown[(i + dir + shown.length) % shown.length].id;
        setMorphId(nextId);
        return nextId;
      });
    },
    [shown]
  );

  const pick = useCallback((key: FacetKey, value: string | undefined) => {
    setPicked((cur) => ({ ...cur, [key]: value }));
  }, []);

  return (
    <div className="shots">
      <Masonry items={shown.map((p) => ({ ...p, key: p.id }))} minColumn={narrow ? 140 : 250} maxColumns={4} gap={narrow ? 8 : 16}>
        {(p) => <Tile photo={p} morph={morphId === p.id} eager={shown.indexOf(p) < 16} onOpen={open} />}
      </Masonry>

      {shown.length === 0 && <p className="shots__empty">nothing matches those filters.</p>}

      <FilterBar photos={PHOTOS} picked={picked} onPick={pick} count={shown.length} />

      <AnimatePresence>
        {opened && <Detail key={opened.id} photo={opened} onClose={close} onStep={step} />}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
