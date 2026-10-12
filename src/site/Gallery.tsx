import React, { useEffect, useMemo, useRef, useState } from 'react';
import FlexCarousel, { FlexCarouselItem } from '../components/reactbits/FlexCarousel';
import manifest from './data/gallery.json';
import { subjectOf, SUBJECT_ORDER, SUBJECT_LABEL, F1_SUBJECTS } from './data/gallerySubjects';
import Collapse from './Collapse';
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

/** Sets shown as full-size plates instead of a scrolling row. */
const PLATE_SUBJECTS = new Set(['f1-montreal-2026']);

/** The camera that took it, or an honest note when the file carries no exif. */
function cameraOf(p: Photo): string {
  return p.exif.camera || 'no exif';
}

/** How it was shot, for the line under the camera. */
function settingsOf(p: Photo): string {
  const e = p.exif;
  const parts = [e.lens, e.focal, e.aperture, e.shutter, e.iso].filter(Boolean);
  return parts.join(' · ');
}

function itemsFor(photos: Photo[]): FlexCarouselItem[] {
  return photos.map((p) => ({
    src: asset(p.srcSmall),
    alt: [cameraOf(p), settingsOf(p)].filter(Boolean).join(' — '),
    title: cameraOf(p),
    subtitle: settingsOf(p) || undefined
  }));
}

/** The series' mark if the file is there, otherwise a plain red chip. */
const F1Mark: React.FC = () => {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <span className="gallery__mark gallery__mark--text" aria-hidden>
        f1
      </span>
    );
  }
  return (
    <img
      className="gallery__mark"
      src={asset('/logos/f1.png')}
      alt=""
      aria-hidden
      onError={() => setMissing(true)}
    />
  );
};

/** Drag it, or use a wheel — a vertical wheel scrolls the strip sideways. */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      const amount = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!amount) return;
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + amount;
      // Let the page keep scrolling once the strip is at either end.
      if ((next <= 0 && amount < 0) || (next >= max && amount > 0)) return;
      e.preventDefault();
      el.scrollLeft = next;
    };

    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      if (e.button > 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.setPointerCapture?.(e.pointerId);
        el.classList.add('is-dragging');
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      down = false;
      el.releasePointerCapture?.(e.pointerId);
      el.classList.remove('is-dragging');
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('pointerleave', onUp);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('pointerleave', onUp);
    };
  }, []);

  return ref;
}

/** A horizontal strip of big plates — each photo once, at full size. */
const Plates: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const ref = useDragScroll();
  const [edge, setEdge] = useState({ start: true, end: false });

  const sync = () => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 4 });
  };

  useEffect(sync, [ref]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const from = el.scrollLeft;
    const target = from + dir * el.clientWidth * 0.8;
    el.scrollTo({ left: target, behavior: 'smooth' });
    // If this view can't animate — reduced motion, a background tab — just land it.
    window.setTimeout(() => {
      if (Math.abs(el.scrollLeft - from) < 2) el.scrollLeft = target;
    }, 140);
  };

  return (
    <div className="plates-wrap">
      <div className="plates" ref={ref} onScroll={sync} role="region" aria-label="photos" tabIndex={0}>
    {photos.map((p) => (
      <figure key={p.id} className="plate">
        <img
          src={asset(p.src)}
          width={p.w}
          height={p.h}
          alt={[cameraOf(p), settingsOf(p)].filter(Boolean).join(' — ')}
          loading="lazy"
          decoding="async"
          style={{ aspectRatio: `${p.w} / ${p.h}` }}
        />
        <figcaption>
          <span>{cameraOf(p)}</span>
          {settingsOf(p) && <span className="plate__exif">{settingsOf(p)}</span>}
        </figcaption>
        </figure>
      ))}
      </div>
      <div className="plates__nav">
        <button type="button" onClick={() => page(-1)} disabled={edge.start} aria-label="Previous photos">
          ‹
        </button>
        <button type="button" onClick={() => page(1)} disabled={edge.end} aria-label="More photos">
          ›
        </button>
      </div>
    </div>
  );
};

const Row: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const items = useMemo(() => itemsFor(photos), [photos]);
  return (
    <div className="gallery__rail">
      <FlexCarousel
        items={items}
        preset="liquid"
        intro="deal"
        cardHeight={0.5}
        gap={12}
        radius={8}
        lensWidth={0.2}
        bend={0}
        squeeze={0.2}
      />
    </div>
  );
};

const SubjectRow: React.FC<{ subject: string; photos: Photo[]; defaultOpen: boolean; plates?: boolean }> = ({
  subject,
  photos,
  defaultOpen,
  plates
}) => {
  const [open, setOpen] = useState(defaultOpen);
  // Mounted on first open and kept, so collapsing is a pure css transition and the
  // carousel never has to boot its canvas twice.
  const [mounted, setMounted] = useState(defaultOpen);
  const label = SUBJECT_LABEL[subject] ?? subject;

  const toggle = () => {
    setMounted(true);
    setOpen((v) => !v);
  };

  return (
    <section className={`gallery__group${open ? ' is-open' : ''}`}>
      <button type="button" className="gallery__toggle" aria-expanded={open} onClick={toggle}>
        <span className="gallery__chev" aria-hidden>
          ›
        </span>
        {F1_SUBJECTS.has(subject) && <F1Mark />}
        <h2 className="gallery__subject">
          {label} <span className="gallery__count">{photos.length}</span>
        </h2>
      </button>
      <Collapse open={open}>{mounted && (plates ? <Plates photos={photos} /> : <Row photos={photos} />)}</Collapse>
    </section>
  );
};

const Gallery: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const grouped = useMemo(() => {
    const bySubject = new Map<string, Photo[]>();
    for (const p of PHOTOS) {
      const s = subjectOf(p);
      if (!bySubject.has(s)) bySubject.set(s, []);
      bySubject.get(s)!.push(p);
    }
    return SUBJECT_ORDER.filter((s) => bySubject.has(s)).map((s) => ({ subject: s, photos: bySubject.get(s)! }));
  }, []);

  return (
    <div className="gallery container">
      <h1 className="sr-only">Photos</h1>
      {grouped.map((g, i) => (
        <SubjectRow
          key={g.subject}
          subject={g.subject}
          photos={g.photos}
          defaultOpen={i === 0}
          plates={PLATE_SUBJECTS.has(g.subject)}
        />
      ))}
    </div>
  );
};

export default Gallery;
