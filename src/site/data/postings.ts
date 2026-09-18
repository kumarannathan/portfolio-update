/**
 * Feature postings for the work done at Yogger. Every number is from the
 * project data. Empty screens render as labelled placeholders until the
 * screenshots are dropped into /public/projects/... and referenced here.
 */
import { Stat } from './caseStudies';
import { Category } from './work';

export type Device = 'phone' | 'browser';

/** A screen slot inside a device frame. null = empty frame waiting for a screenshot. */
export type Screen = { src: string; alt?: string } | null;

export interface Posting {
  id: string;
  /** Case study to link through to. */
  caseId: string;
  title: string;
  blurb: string;
  categories: Category[];
  device: Device;
  screens: Screen[];
  stats: Stat[];
  tags: string[];
}

export const YOGGER_POSTINGS: Posting[] = [
  {
    id: 'yogger-web-redesign',
    caseId: 'yogger-web-redesign',
    title: 'Yogger',
    blurb:
      'A new shell and sidebar, tasks rebuilt as a roster, new analytics and home exercise program tools. Shipped behind a toggle so coaches opt in.',
    categories: ['web'],
    device: 'browser',
    screens: [
      { src: '/projects/yogger-web/after/login-cover.jpg', alt: 'coach web login' },
      { src: '/projects/yogger-web/after/tasks.png', alt: 'tasks' }
    ],
    stats: [
      { value: '100+', label: 'files reworked' },
      { value: '7', label: 'new screens' }
    ],
    tags: ['React', 'TypeScript', 'MUI']
  },
  {
    id: 'home-exercise-builder',
    caseId: 'home-exercise-builder',
    title: 'Home Exercise Builder',
    blurb:
      'One continuous flow to create exercises and programs — built as a premium reason for coaches to open Yogger every day, not just when a task pings.',
    categories: ['web'],
    device: 'browser',
    screens: [
      { src: '/projects/home-exercise-builder/program-overview.jpg', alt: 'program overview' },
      { src: '/projects/home-exercise-builder/exercise-library.jpg', alt: 'exercise library' }
    ],
    stats: [
      { value: '1', label: 'creation flow' },
      { value: 'HEP', label: 'programs + tasks' }
    ],
    tags: ['React', 'TypeScript', 'MUI']
  },
  {
    id: 'yogger-crm',
    caseId: 'yogger-crm',
    title: 'CRM & Admin Platform',
    blurb:
      'The internal operator surface for support, sales, and CS. Deal pipelines, ticketing, user and org management, and KPI dashboards in React.',
    categories: ['web'],
    device: 'browser',
    screens: [
      { src: '/projects/yogger-crm/cover.jpg', alt: 'form submissions' },
      { src: '/projects/yogger-crm/profile.png', alt: 'user profile' }
    ],
    stats: [
      { value: '60+', label: 'components' },
      { value: '20+', label: 'filterable fields' }
    ],
    tags: ['React', 'TypeScript', 'Firestore']
  },
  {
    id: 'movement-age',
    caseId: 'movement-age',
    title: 'Movement Age',
    blurb:
      "Yogger's flagship assessment, built end-to-end in Kotlin. Rebuilt the assessment engine across 12+ assessments and overhauled 25+ screens.",
    categories: ['mobile'],
    device: 'phone',
    screens: [
      { src: '/projects/yogger-mobile/cover.jpg', alt: 'movement analysis' },
      { src: '/projects/yogger-mobile/before.png', alt: 'before' },
      { src: '/projects/yogger-mobile/after.jpg', alt: 'after' },
    ],
    stats: [
      { value: '+40%', label: 'session engagement' },
      { value: '2×', label: 'MAU, 16.8K peak' }
    ],
    tags: ['Kotlin', 'Android', 'pose tracking']
  },
  {
    id: 'rag-gemini',
    caseId: 'rag-gemini',
    title: 'AI Assessment Summaries',
    blurb:
      'Retrieval-augmented clinical narratives for movement assessments, grounded in an 18-document knowledge base so the output cites real sources.',
    categories: ['backend', 'mobile'],
    device: 'phone',
    screens: [null, null],
    stats: [
      { value: '18', label: 'source documents' },
      { value: '14', label: 'assessment types' }
    ],
    tags: ['Gemini', 'Cloud Functions', 'Swift']
  },
  {
    id: 'saml-sso',
    caseId: 'saml-sso',
    title: 'Enterprise SSO',
    blurb:
      'SAML single sign-on across web, Android, and iOS on Firebase Identity Platform. One shared auth bridge instead of three native flows.',
    categories: ['backend', 'mobile'],
    device: 'phone',
    screens: [null, null],
    stats: [
      { value: '47,000', label: 'employees at Sanford Health' },
      { value: '1st', label: 'enterprise customer' }
    ],
    tags: ['SAML 2.0', 'Firebase', 'Kotlin', 'Swift']
  }
];
