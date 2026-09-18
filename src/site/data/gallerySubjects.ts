/**
 * Subject grouping for the photo gallery, keyed by the ids in gallery.json.
 * Anything not listed falls back to its folder's default below.
 */
export const SUBJECT_ORDER = ['mountains', 'water', 'street', 'motorsport', 'wild'];

const BY_GROUP: Record<string, string> = {
  newz: 'mountains',
  f1: 'motorsport',
  mexico: 'street',
  seattle: 'street',
  grid: 'street',
  colorado: 'mountains'
};

const IDS: Record<string, string[]> = {
  mountains: [
    'grid-041', 'grid-042', 'grid-043', 'grid-044', 'grid-046', 'grid-059', 'grid-063', 'grid-080', 'grid-082',
    'grid-089', 'grid-090', 'grid-095', 'grid-097', 'grid-098', 'grid-100', 'grid-101', 'grid-102', 'grid-103',
    'grid-104', 'grid-105', 'grid-106', 'grid-107', 'grid-108', 'grid-111', 'grid-112', 'grid-113'
  ],
  water: [
    'mexico-024', 'mexico-025', 'mexico-036', 'mexico-037', 'mexico-038', 'seattle-040', 'grid-047', 'grid-054',
    'grid-056', 'grid-057', 'grid-061', 'grid-085', 'grid-092', 'grid-093', 'grid-096', 'grid-110'
  ],
  wild: ['mexico-030', 'mexico-032', 'mexico-033', 'mexico-035', 'grid-071', 'grid-073', 'grid-075', 'grid-099'],
  motorsport: ['grid-084', 'grid-087'],
  street: []
};

const LOOKUP = new Map<string, string>();
for (const [subject, ids] of Object.entries(IDS)) {
  for (const id of ids) LOOKUP.set(id, subject);
}

export function subjectOf(p: { id: string; group: string }): string {
  return LOOKUP.get(p.id) ?? BY_GROUP[p.group] ?? 'street';
}
