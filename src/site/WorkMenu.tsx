import React, { useMemo } from 'react';
import AccordionGallery, { AccordionGalleryItem } from '../components/reactbits/AccordionGallery';
import { ALL_WORK, WorkItem } from './data/work';
import './WorkMenu.css';

const asset = (p: string) => `${(process.env.PUBLIC_URL || '').replace(/\/$/, '')}${p.startsWith('/') ? p : `/${p}`}`;

/** Which projects sit in the accordion menu, in order. */
const MENU_IDS = [
  'toshi',
  'yogger-web-redesign',
  'home-exercise-builder',
  'yogger-crm',
];

function imageFor(w: WorkItem): string {
  if (w.media?.type === 'image') return asset(w.media.src);
  return asset(w.bg);
}

interface WorkMenuProps {
  /** Id of the project to open with, if any (e.g. the current case study). */
  currentId?: string;
  height?: number;
}

/** The accordion menu of projects: hover to peek, click the open panel to go. */
const WorkMenu: React.FC<WorkMenuProps> = ({ currentId, height = 300 }) => {
  const items = useMemo<AccordionGalleryItem[]>(
    () =>
      MENU_IDS.map((id) => ALL_WORK.find((w) => w.id === id))
        .filter((w): w is WorkItem => Boolean(w))
        .map((w) => ({ image: imageFor(w), label: w.title, link: `#/work/${w.id}`, alt: w.title })),
    []
  );
  const defaultIndex = Math.max(0, MENU_IDS.indexOf(currentId ?? ''));

  return (
    <div className="workmenu">
      <AccordionGallery
        items={items}
        defaultIndex={defaultIndex}
        height={height}
        gap={8}
        radius={12}
        expandRatio={0.46}
        accentColor="#f5f1ec"
        overlayColor="#2a2520"
        textColor="#f5f1ec"
        trigger="hover"
        duration={0.7}
        tilt={5}
      />
    </div>
  );
};

export default WorkMenu;
