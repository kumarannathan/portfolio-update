import { YOGGER_POSTINGS } from './postings';
import { PRODUCTION_PROJECTS } from './productionEntries';
import { Stat } from './caseStudies';

export interface ProjectPage {
  id: string;
  title: string;
  /** One line on what it is. */
  blurb: string;
  /** The numbers, as they came from the project. */
  stats: Stat[];
  /** What it's built on. */
  stack: string;
  /** The screens, in reading order. */
  shots: string[];
  /** Short, factual lines about what shipped. */
  notes: { title: string; detail: string }[];
}

/** Screens per project. Anything missing renders as a labelled frame. */
const SHOTS: Record<string, string[]> = {
  'yogger-web-redesign': [
    '/projects/yogger-web/after/analytics-cover.jpg',
    '/projects/yogger-web/after/tasks-progress.png',
    '/projects/yogger-web/after/library.png',
    '/projects/yogger-web/after/manage-athletes.png',
    '/projects/yogger-web/after/home.jpg',
    '/projects/yogger-web/after/login-cover.jpg'
  ],
  'yogger-crm': [
    '/projects/yogger-crm/user-analytics.webp',
    '/projects/yogger-crm/journey-analytics.webp',
    '/projects/yogger-crm/form-submissions.webp',
    '/projects/yogger-crm/trial-detail.png',
    '/projects/yogger-crm/app-feedback.webp',
    '/projects/yogger-crm/team.webp'
  ],
  'home-exercise-builder': [
    '/projects/home-exercise-builder/program-overview.jpg',
    '/projects/home-exercise-builder/create-program.jpg',
    '/projects/home-exercise-builder/exercise-library.jpg',
    '/projects/home-exercise-builder/exercise-detail.jpg',
    '/projects/home-exercise-builder/program-library.jpg',
    '/projects/home-exercise-builder/analytics-cover.jpg'
  ],
  'movement-age': ['/projects/yogger-mobile/cover.jpg', '/projects/yogger-mobile/hero.jpg'],
  'saml-sso': [],
  'rag-gemini': []
};

/** The Yogger work that gets its own page, keyed by id. */
export const PROJECT_PAGES: Record<string, ProjectPage> = Object.fromEntries(
  PRODUCTION_PROJECTS.map((p) => {
    const posting = YOGGER_POSTINGS.find((x) => x.caseId === p.id);
    const page: ProjectPage = {
      id: p.id,
      title: p.title,
      blurb: posting?.blurb ?? p.summary,
      stats: posting?.stats ?? [],
      stack: p.technologies,
      shots: SHOTS[p.id] ?? [],
      notes: p.highlights.map((h) => ({ title: h.title, detail: h.detail }))
    };
    return [p.id, page];
  })
);

/** Not shown on the site, so it stays out of the next-project cycle too. */
const HIDDEN = new Set(['movement-age']);

export const PROJECT_ORDER = PRODUCTION_PROJECTS.map((p) => p.id).filter((id) => !HIDDEN.has(id));
