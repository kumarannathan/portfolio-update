import type { IconName } from 'tech-stack-icons';

/** Exact labels used in `PROJECTS` → tech-stack-icons `name` (see tech-stack-icons.com). */
export const PROJECT_TECH_ICON_MAP: Partial<Record<string, IconName>> = {
  React: 'react',
  'React 19': 'react',
  'React Native': 'reactnative',
  TypeScript: 'typescript',
  'Next.js': 'nextjs',
  'Next.js 16': 'nextjs',
  'Tailwind CSS v4': 'tailwindcss',
  GSAP: 'gsap',
  Python: 'python',
  'Node.js': 'nodejs',
  Express: 'expressjs',
  PostgreSQL: 'postgresql',
  'Netlify Functions': 'netlify',
  Supabase: 'supabase',
  Ollama: 'ollama',
  'mobile development': 'reactnative',
  Unity: 'unity',
  'C#': 'c#',
  Figma: 'figma',
  Jira: 'jira',
  Git: 'git',
  PyTorch: 'pytorch',
  Firebase: 'firebase',
  GCP: 'gcloud',
  'Unreal Engine 5': 'unrealengine',
  'C++': 'c++',
  'Computer Vision': 'opencv'
};

export function getTechStackIconName(tech: string): IconName | undefined {
  return PROJECT_TECH_ICON_MAP[tech];
}
