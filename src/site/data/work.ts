import { PROJECTS, ProjectEntry } from './projectEntries';
import { PRODUCTION_PROJECTS, ProductionProject } from './productionEntries';

export type CardMedia = { type: 'video' | 'image'; src: string };

/** Top-level buckets for the work page filters. */
export type Category = 'mobile' | 'web' | 'game' | 'backend';
export const CATEGORIES: Category[] = ['mobile', 'web', 'game', 'backend'];

const CATEGORY_OF: Record<string, Category[]> = {
  'yogger-web-redesign': ['web'],
  'home-exercise-builder': ['web'],
  toshi: ['web', 'backend'],
  countertop: ['backend'],
  lumen: ['mobile'],
  'yogger-crm': ['web'],
  'saml-sso': ['backend', 'mobile'],
  'rag-gemini': ['backend', 'mobile'],
  'movement-age': ['mobile'],
  'milo-mission-control': ['backend', 'web'],
  'neetcode-redesign': ['web'],
  sipt: ['mobile'],
  'soul-forest': ['game'],
  'tennis-analytics': ['backend', 'web'],
  'jobsim-vr': ['game'],
  'ann-arbor-go': ['game', 'mobile']
};

/** Older filler projects that don't earn their spot anymore. Data stays, they just don't render. */
const ARCHIVED = new Set(['booking-platform', 'dance-ar', 'focus-zone', 'sipt']);

export interface WorkLink {
  label: string;
  href: string;
}

export interface WorkItem {
  id: string;
  kind: 'production' | 'project';
  categories: Category[];
  year?: string;
  title: string;
  tags: string[];
  blurb: string;
  /** Primary external link (live site, store page, video). */
  href?: string;
  github?: string;
  media?: CardMedia;
  /** Photo behind the floating media window. */
  bg: string;
  detail: {
    lead: string;
    highlights: string[];
    tech: string;
    links: WorkLink[];
    images?: string[];
    extra?: string;
  };
}

/** Backdrops for the cards, drawn from my own photography. */
const BACKDROPS = [
  '/photos/gridimage16.jpeg',
  '/photos/gridimage76.jpeg',
  '/photos/gridimage66.jpeg',
  '/photos/gridimage17.jpeg',
  '/photos/gridimage67.jpeg',
  '/photos/gridimage43.jpeg',
  '/photos/gridimage68.jpeg',
  '/photos/gridimage15.jpeg',
  '/photos/gridimage51.jpeg'
];

/** Media that actually exists in /public, keyed by project id. */
const PROJECT_MEDIA: Record<string, CardMedia> = {
  toshi: { type: 'image', src: '/projects/toshi/cover.jpg' },
  countertop: { type: 'image', src: '/projects/countertop/hero.png' },
  lumen: { type: 'image', src: '/projects/lumen/meter.png' },
  'milo-mission-control': { type: 'image', src: '/projects/milo/control-room.jpg' },
  'neetcode-redesign': { type: 'video', src: '/neetcode.mp4' },
  'booking-platform': { type: 'video', src: '/mtm.mp4' },
  'soul-forest': { type: 'video', src: '/soul-of-the-forest.mp4' },
  'focus-zone': { type: 'video', src: '/videos/focus.mp4' }
};

const PROJECT_BACKDROP: Record<string, string> = {
  toshi: '/projects/toshi/cover.jpg',
  'milo-mission-control': '/photos/gridimage66.jpeg',
  'neetcode-redesign': '/photos/gridimage76.jpeg',
  sipt: '/photos/gridimage43.jpeg',
  'booking-platform': '/photos/gridimage16.jpeg',
  'soul-forest': '/photos/gridimage68.jpeg',
  'tennis-analytics': '/photos/gridimage17.jpeg',
  'dance-ar': '/photos/gridimage15.jpeg',
  'jobsim-vr': '/photos/gridimage67.jpeg',
  'ann-arbor-go': '/photos/gridimage51.jpeg',
  'focus-zone': '/photos/gridimage66.jpeg'
};

const PRODUCTION_BACKDROP: Record<string, string> = {
  'yogger-web-redesign': '/photos/gridimage66.jpeg',
  'home-exercise-builder': '/photos/gridimage76.jpeg',
  'yogger-crm': '/photos/gridimage67.jpeg',
  'saml-sso': '/photos/gridimage16.jpeg',
  'rag-gemini': '/photos/gridimage68.jpeg',
  'movement-age': '/photos/gridimage76.jpeg'
};

const PRODUCTION_TAGS: Record<string, string[]> = {
  'yogger-web-redesign': ['Web', 'Redesign'],
  'home-exercise-builder': ['Web', 'HEP'],
  'yogger-crm': ['Production', 'React + Firebase'],
  'saml-sso': ['Platform', 'SAML 2.0'],
  'rag-gemini': ['AI', 'Gemini + RAG'],
  'movement-age': ['Mobile', 'Kotlin']
};

function fromProduction(p: ProductionProject, i: number): WorkItem {
  const media: CardMedia | undefined = p.images?.[0] ? { type: 'image', src: p.images[0] } : undefined;
  return {
    id: p.id,
    kind: 'production',
    categories: CATEGORY_OF[p.id] ?? ['web'],
    year: '2026',
    title: p.title,
    tags: PRODUCTION_TAGS[p.id] ?? [p.roleTag ?? 'Production'],
    blurb: p.summary,
    href: p.links?.[0]?.href,
    media,
    bg: PRODUCTION_BACKDROP[p.id] ?? BACKDROPS[i % BACKDROPS.length],
    detail: {
      lead: p.lead,
      highlights: p.highlights.map((h) => `${h.title} — ${h.detail}`),
      tech: p.technologies,
      links: p.links ?? [],
      images: p.images
    }
  };
}

function fromProject(p: ProjectEntry, i: number): WorkItem {
  const links: WorkLink[] = [];
  if (p.link) links.push({ label: 'Live', href: p.link });
  if (p.github) links.push({ label: 'GitHub', href: p.github });
  if (p.youtubeUrl) links.push({ label: 'Video', href: p.youtubeUrl });
  const tags = [p.roleTag, p.technologies[0]].filter((t): t is string => Boolean(t));
  return {
    id: p.id,
    kind: 'project',
    categories: CATEGORY_OF[p.id] ?? ['web'],
    year: p.metaLine?.match(/\d{4}/)?.[0],
    title: p.title,
    tags,
    blurb: p.summary ?? p.description,
    href: p.link ?? p.youtubeUrl,
    github: p.github,
    media: PROJECT_MEDIA[p.id],
    bg: PROJECT_BACKDROP[p.id] ?? BACKDROPS[i % BACKDROPS.length],
    detail: {
      lead: p.description,
      highlights: p.highlights ?? [],
      tech: p.technologies.join(', '),
      links,
      extra: p.detailText
    }
  };
}

export const PRODUCTION_WORK: WorkItem[] = PRODUCTION_PROJECTS.map(fromProduction);
export const PROJECT_WORK: WorkItem[] = PROJECTS.filter((p) => !ARCHIVED.has(p.id)).map(fromProject);
export const ALL_WORK: WorkItem[] = [...PRODUCTION_WORK, ...PROJECT_WORK];

const FEATURED_IDS = [
  'toshi',
  'yogger-web-redesign',
  'home-exercise-builder',
  'yogger-crm',
];

export const FEATURED_WORK: WorkItem[] = FEATURED_IDS.map((id) => ALL_WORK.find((w) => w.id === id)).filter(
  (w): w is WorkItem => Boolean(w)
);
