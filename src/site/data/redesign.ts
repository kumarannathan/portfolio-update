/**
 * Screens for the Yogger coach web app redesign.
 *
 * Drop screenshots into public/projects/yogger-web/before/ and public/projects/yogger-web/after/
 * using the file names below. Anything missing shows a labelled placeholder, so the page never breaks.
 *
 * Walkthrough video (optional): public/projects/yogger-web/walkthrough.mp4
 */

export interface ScreenPair {
  id: string;
  label: string;
  before: string;
  after: string;
}

export interface ScreenShot {
  id: string;
  label: string;
  src: string;
}

const B = '/projects/yogger-web/before';
const A = '/projects/yogger-web/after';

/** Optional product walkthrough — drop an mp4 at this path to light it up. */
export const REDESIGN_VIDEO = {
  src: '/projects/yogger-web/walkthrough.mp4',
  caption: 'Walkthrough of the redesigned coach web app'
};

/** Same screen, old ui vs new ui. */
export const REDESIGN_PAIRS: ScreenPair[] = [
  { id: 'home', label: 'Home', before: `${B}/home.png`, after: `${A}/home.jpg` },
  { id: 'tasks', label: 'Tasks', before: `${B}/tasks.png`, after: `${A}/tasks.png` },
  { id: 'library', label: 'Library', before: `${B}/library.png`, after: `${A}/library.png` },
  { id: 'assessments', label: 'Assessments', before: `${B}/assessments.png`, after: `${A}/assessments.png` },
  { id: 'reports', label: 'Reports', before: `${B}/reports.png`, after: `${A}/reports.png` },
  { id: 'login', label: 'Login', before: `${B}/login.jpg`, after: `${A}/login-cover.jpg` }
];

/** Screens that didn't exist before the redesign. */
export const REDESIGN_NEW: ScreenShot[] = [
  { id: 'tasks-progress', label: 'Athlete Progress', src: `${A}/tasks-progress.png` },
  { id: 'analytics', label: 'Coach Analytics', src: `${A}/analytics-cover.jpg` },
  { id: 'manage-athletes', label: 'Manage Athletes', src: `${A}/manage-athletes.png` },
  { id: 'program-library', label: 'Program Library', src: '/projects/home-exercise-builder/program-library.jpg' },
  { id: 'program-overview', label: 'Program Overview', src: '/projects/home-exercise-builder/program-overview.jpg' },
  { id: 'exercise-library', label: 'Exercise Library', src: '/projects/home-exercise-builder/exercise-library.jpg' },
  { id: 'exercise-detail', label: 'Exercise Detail', src: '/projects/home-exercise-builder/exercise-detail.jpg' },
  { id: 'create-program', label: 'Create Program', src: '/projects/home-exercise-builder/create-program.jpg' },
  { id: 'hep-tasks', label: 'HEP Task Roster', src: `${A}/hep-tasks.png` }
];
