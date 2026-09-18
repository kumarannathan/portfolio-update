import { ALL_WORK, WorkItem } from './work';
import { YOGGER_POSTINGS } from './postings';
import { Stat } from './caseStudies';

export type Tab = 'favorites' | 'yogger' | 'personal';
export const TABS: Tab[] = ['favorites', 'yogger', 'personal'];

export interface WorkEntry {
  item: WorkItem;
  title: string;
  blurb: string;
  stats: Stat[];
}

/** The five strongest pieces — Web App Redesign and HEP builder lead. */
/** Strongest pieces, in display order. */
const FAVORITES = [
  'toshi',
  'yogger-web-redesign',
  'home-exercise-builder',
  'yogger-crm',
];

/** Stats for personal projects, only where the project copy states them. */
const PERSONAL_STATS: Record<string, Stat[]> = {
  toshi: [
    { value: '14', label: 'tools on one deal' },
    { value: '1', label: 'sample deal, end to end' }
  ],
  'milo-mission-control': [{ value: '~$1.50', label: 'a month in API usage' }],
  'soul-forest': [{ value: 'Steam', label: 'commercial release' }],
  'jobsim-vr': [{ value: 'featured', label: 'UMich game design showcase' }]
};

function entryFor(item: WorkItem): WorkEntry {
  const posting = YOGGER_POSTINGS.find((p) => p.caseId === item.id);
  if (posting) return { item, title: posting.title, blurb: posting.blurb, stats: posting.stats };
  return { item, title: item.title, blurb: item.blurb, stats: PERSONAL_STATS[item.id] ?? [] };
}

const byIds = (ids: string[]) =>
  ids.map((id) => ALL_WORK.find((w) => w.id === id)).filter((w): w is WorkItem => Boolean(w)).map(entryFor);

export function entriesFor(tab: Tab): WorkEntry[] {
  if (tab === 'favorites') return byIds(FAVORITES);
  if (tab === 'yogger') {
    const order = [
      'yogger-web-redesign',
      'home-exercise-builder',
      'yogger-crm',
      'movement-age',
      'saml-sso',
      'rag-gemini',
    ];
    return byIds(order);
  }
  return ALL_WORK.filter((w) => w.kind === 'project').map(entryFor);
}
