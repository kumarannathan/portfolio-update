import { PROJECTS, ProjectEntry } from './projectEntries';
import { PRODUCTION_PROJECTS, ProductionProject } from './productionEntries';
import { ALL_WORK, WorkItem } from './work';

export interface Stat {
  value: string;
  label: string;
}

export interface Figure {
  src: string;
  caption?: string;
  kind?: 'image' | 'video';
}

/** A bold-headed paragraph, Sakara-style: what the problem was, what I did, what it changed. */
export interface CaseSection {
  heading: string;
  body: string;
  figures?: Figure[];
}

export interface CaseStudy {
  id: string;
  /** e.g. "2026" */
  year: string;
  /** e.g. "android", "web", "ios and android" */
  platforms: string;
  title: string;
  /** One line about the company or product itself. */
  company: string;
  overview: string;
  sections: CaseSection[];
  figures?: Figure[];
  stack: string;
  links: { label: string; href: string }[];
}

const PLATFORMS: Record<string, string> = {
  'yogger-web-redesign': 'web',
  'home-exercise-builder': 'web',
  toshi: 'web and ios',
  'yogger-crm': 'web',
  countertop: 'macos',
  'saml-sso': 'web, android and ios',
  'rag-gemini': 'ios and cloud',
  'movement-age': 'android',
  'milo-mission-control': 'web and serverless',
  'neetcode-redesign': 'web',
  sipt: 'ios and android',
  'soul-forest': 'pc · steam',
  'tennis-analytics': 'web',
  'jobsim-vr': 'vr',
  'ann-arbor-go': 'ar · mobile'
};

/** Product one-liners and framing sections for side projects that get the full case-study treatment. */
const YOGGER_LINE = 'Yogger is a movement analysis app used by coaches, clinics, and athletes.';

const COMPANY_LINE: Record<string, string> = {
  toshi: '年 (toshi) means “year” in Japanese — model year, loan term, five years of ownership. a car-buying tool for people who got tired of trusting the monthly payment.'
};

const LEAD_SECTIONS: Record<string, CaseSection[]> = {
  toshi: [
    {
      heading: 'Why I built it',
      body:
        'I kept watching friends walk into a dealership with a screenshot of a "payment as low as" ad and walk out having agreed to a term they could not explain. the quote is designed that way. so I built the tool I wanted on the lot: drop in whatever paper they hand you, get one structured deal, and see the math before anyone asks for a signature.'
    }
  ]
};

const PROJECT_FIGURES: Record<string, Figure[]> = {
  countertop: [
    { src: '/projects/countertop/hero.png', caption: 'the menu bar panel — what went where, today' },
    { src: '/projects/countertop/overview.png', caption: 'overview — totals and recent activity' },
    { src: '/projects/countertop/activity.png', caption: 'activity — every move, with put back' },
    { src: '/projects/countertop/files.png', caption: 'files across the countertop folders' },
    { src: '/projects/countertop/onboarding.png', caption: 'setup — choosing where files go' }
  ],
  toshi: [
    { src: '/projects/toshi/cover.jpg', caption: 'landing — real cost vs the dealer payment' },
    { src: '/projects/toshi/walkthrough.mp4', kind: 'video', caption: 'walkthrough' },
    { src: '/projects/toshi/lease.jpg', caption: 'lease calculator with what-if sliders' },
    { src: '/projects/toshi/deal-score.jpg', caption: 'deal score — checks, grade, flags' },
    { src: '/projects/toshi/mobile.png', caption: 'toshi for iphone — scan, glance, compare' }
  ]
};

const PRODUCTION_FIGURES: Record<string, Figure[]> = {
  'yogger-web-redesign': [
    { src: '/projects/yogger-web/after/login-cover.jpg', caption: 'coach web login' }
  ],
  'home-exercise-builder': [
    { src: '/projects/home-exercise-builder/program-overview.jpg', caption: 'program overview — sticky cover, one sheet' },
    { src: '/projects/home-exercise-builder/create-program.jpg', caption: 'create program — name, weeks, cover' },
    { src: '/projects/home-exercise-builder/exercise-library.jpg', caption: 'exercise library' },
    { src: '/projects/home-exercise-builder/exercise-detail.jpg', caption: 'exercise detail — dose + how-to' },
    { src: '/projects/home-exercise-builder/program-library.jpg', caption: 'program library' },
    { src: '/projects/home-exercise-builder/analytics-cover.jpg', caption: 'caseload analytics beside HEP' }
  ],
  'yogger-crm': [
    { src: '/projects/yogger-crm/user-analytics.webp', caption: 'user analytics — signups, retention, and how people signed up' },
    { src: '/projects/yogger-crm/metric-row.webp', caption: 'the metric card: number, change against the last period, sparkline' },
    { src: '/projects/yogger-crm/signups-chart.png', caption: 'one dot per slice of the day, so a spike reads as height and density' },
    { src: '/projects/yogger-crm/journey-analytics.webp', caption: 'journey — where people sign up and which paywall they hit' },
    { src: '/projects/yogger-crm/form-submissions.webp', caption: 'form submissions by stage (lead names blurred)' },
    { src: '/projects/yogger-crm/trial-detail.png', caption: 'a clinic trial: day count, feature usage, whether a card is on file' },
    { src: '/projects/yogger-crm/app-feedback.webp', caption: 'in-app ratings and cancellation reasons, pulled on demand' },
    { src: '/projects/yogger-crm/team.webp', caption: 'team — who owns what, and their open support work' }
  ],
  'movement-age': [
    { src: '/projects/yogger-mobile/cover.jpg', caption: 'movement analysis on tablet' }
  ]
};

function fromProduction(p: ProductionProject): CaseStudy {
  return {
    id: p.id,
    year: '2026',
    platforms: PLATFORMS[p.id] ?? 'web',
    title: p.title,
    company: YOGGER_LINE,
    overview: p.lead,
    sections: p.highlights.map((h) => ({ heading: h.title, body: h.detail })),
    figures: PRODUCTION_FIGURES[p.id],
    stack: p.technologies,
    links: p.links ?? []
  };
}

function fromProject(p: ProjectEntry): CaseStudy {
  const work = ALL_WORK.find((w) => w.id === p.id);
  const year = p.metaLine?.match(/\d{4}/)?.[0] ?? '';
  const links: { label: string; href: string }[] = [];
  if (p.link) links.push({ label: 'Live site', href: p.link });
  if (p.github) links.push({ label: 'GitHub', href: p.github });
  if (p.youtubeUrl) links.push({ label: 'Video', href: p.youtubeUrl });

  const sections: CaseSection[] = (p.highlights ?? []).map((h) => {
    const [head, ...rest] = h.split(':');
    return rest.length ? { heading: head.trim(), body: rest.join(':').trim() } : { heading: '', body: h };
  });
  if (COMPANY_LINE[p.id]) sections.unshift(...(LEAD_SECTIONS[p.id] ?? []));
  if (p.detailText) sections.push({ heading: 'How It Went', body: p.detailText });

  const figures: Figure[] = PROJECT_FIGURES[p.id]
    ? [...PROJECT_FIGURES[p.id]]
    : [];
  if (!PROJECT_FIGURES[p.id]) {
    if (work?.media?.type === 'video') figures.push({ src: work.media.src, kind: 'video' });
    if (work?.media?.type === 'image') figures.push({ src: work.media.src });
  }

  return {
    id: p.id,
    year,
    platforms: PLATFORMS[p.id] ?? 'web',
    title: p.title,
    company: COMPANY_LINE[p.id] ?? (p.summary ?? '').replace(/\.$/, ''),
    overview: p.description,
    sections,
    figures: figures.length ? figures : undefined,
    stack: p.technologies.join(', '),
    links
  };
}

export const CASE_STUDIES: CaseStudy[] = [...PRODUCTION_PROJECTS.map(fromProduction), ...PROJECTS.map(fromProject)];

export function getCaseStudy(id: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.id === id);
}

export function getWorkItem(id: string): WorkItem | undefined {
  return ALL_WORK.find((w) => w.id === id);
}

/** Yogger-wide numbers, each traceable to a project on the work page. */
export const YOGGER_STATS: Stat[] = [
  { value: '47,000', label: 'employees at our first enterprise customer' },
  { value: '+40%', label: 'session engagement after movement age' },
  { value: '2×', label: 'mau, to a 16.8K peak' },
  { value: '60+', label: 'crm components in production' }
];
