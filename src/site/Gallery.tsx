import React, { useEffect, useMemo } from 'react';
import FlexCarousel, { FlexCarouselItem } from '../components/reactbits/FlexCarousel';
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

/** The camera that took it, or an honest note when the file carries no exif. */
function cameraOf(p: Photo): string {
  return p.exif.camera || 'film scan';
}

/** How it was shot, for the line under the camera. */
function settingsOf(p: Photo): string {
  const e = p.exif;
  const parts = [e.lens, e.focal, e.aperture, e.shutter, e.iso].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'no exif';
}

function itemsFor(photos: Photo[]): FlexCarouselItem[] {
  return photos.map((p) => ({
    src: asset(p.srcSmall),
    alt: `${cameraOf(p)} — ${settingsOf(p)}`,
    title: cameraOf(p),
    subtitle: settingsOf(p)
  }));
}

const SubjectRow: React.FC<{ subject: string; photos: Photo[] }> = ({ subject, photos }) => {
  const items = useMemo(() => itemsFor(photos), [photos]);
  return (
    <section className="gallery__group">
      <h2 className="gallery__subject">
        {subject} <span className="gallery__count">{photos.length}</span>
      </h2>
      <div className="gallery__rail">
        <FlexCarousel
          items={items}
          preset="liquid"
          intro="deal"
          cardHeight={0.64}
          gap={12}
          radius={8}
          lensWidth={0.2}
          bend={0}
          squeeze={0.2}
        />
      </div>
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
      {grouped.map((g) => (
        <SubjectRow key={g.subject} subject={g.subject} photos={g.photos} />
      ))}
    </div>
  );
};

export default Gallery;
