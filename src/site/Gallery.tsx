import React, { useEffect, useMemo, useState } from 'react';
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

const SubjectRow: React.FC<{ subject: string; photos: Photo[]; defaultOpen: boolean }> = ({
  subject,
  photos,
  defaultOpen
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
      <Collapse open={open}>{mounted && <Row photos={photos} />}</Collapse>
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
        <SubjectRow key={g.subject} subject={g.subject} photos={g.photos} defaultOpen={i === 0} />
      ))}
    </div>
  );
};

export default Gallery;
