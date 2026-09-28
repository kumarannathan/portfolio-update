import { ALL_WORK, WorkItem } from './work';

const asset = (p: string) => `${(process.env.PUBLIC_URL || '').replace(/\/$/, '')}${p}`;

/**
 * A still for every project. Screenshots where they exist, a frame pulled from the
 * project's own video where that's all there is, and a plain title card for the
 * ones with no imagery at all — never a stand-in from somewhere else.
 */
const COVER: Record<string, string> = {
  'yogger-web-redesign': '/projects/yogger-web/after/analytics-cover.jpg',
  toshi: '/projects/toshi/cover.jpg',
  'yogger-crm': '/projects/yogger-crm/user-analytics.webp',
  'home-exercise-builder': '/projects/home-exercise-builder/program-overview.jpg',
  'movement-age': '/projects/yogger-mobile/cover.jpg',
  'saml-sso': '/projects/_cards/saml-sso.jpg',
  'rag-gemini': '/projects/_cards/rag-gemini.jpg',
  'neetcode-redesign': '/projects/_cards/neetcode-redesign.jpg',
  'soul-forest': '/projects/_cards/soul-forest.jpg',
  'milo-mission-control': '/projects/_cards/milo-mission-control.jpg',
  'tennis-analytics': '/projects/_cards/tennis-analytics.jpg',
  'jobsim-vr': '/projects/_cards/jobsim-vr.jpg',
  'ann-arbor-go': '/projects/_cards/ann-arbor-go.jpg'
};

/** Carousel order: the strongest work first, then the rest. */
const ORDER = [
  'yogger-web-redesign',
  'toshi',
  'yogger-crm',
  'home-exercise-builder',
  'movement-age',
  'saml-sso',
  'rag-gemini',
  'neetcode-redesign',
  'soul-forest',
  'milo-mission-control',
  'tennis-analytics',
  'jobsim-vr',
  'ann-arbor-go'
];

export interface CarouselProject {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  blurb: string;
  tech: string;
  year?: string;
  item: WorkItem;
}

/** The one-line subtitle under the carousel title, in the user's own words. */
function subtitleFor(item: WorkItem): string {
  const first = item.blurb.split(/[.;]/)[0].trim();
  return first.length > 64 ? `${first.slice(0, 61).trimEnd()}…` : first;
}

export const CAROUSEL_PROJECTS: CarouselProject[] = ORDER.map((id): CarouselProject | null => {
  const item = ALL_WORK.find((w) => w.id === id);
  if (!item || !COVER[id]) return null;
  return {
    id,
    src: asset(COVER[id]),
    alt: item.title,
    title: item.title,
    subtitle: subtitleFor(item),
    blurb: item.detail.lead,
    tech: item.detail.tech,
    year: item.year,
    item
  };
}).filter((p): p is CarouselProject => Boolean(p));
