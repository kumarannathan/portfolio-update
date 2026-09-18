import yoggerLogo from '../../assets/yogger-logo.png';
import einnelLogo from '../../assets/einnel-logo.png';
import snapLogo from '../../assets/snap-logo.png';
import wsoftLogo from '../../assets/wsoft-logo.png';

export interface ExperienceEntry {
  company: string;
  companyUrl?: string;
  role: string;
  period: string;
  description: string;
  technologies: string;
  logo: string;
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: 'Yogger',
    role: 'Software Engineer',
    period: 'Apr 2026 – Present',
    description: 'Web, mobile, and pose-detection features across React, TypeScript, Kotlin, Swift, Firebase, and Node.js.',
    technologies: 'React · TypeScript · Kotlin · Swift · Firebase · Node.js',
    logo: yoggerLogo
  },
  {
    company: 'Stealth Startup',
    companyUrl: 'https://einnel.com/',
    role: 'Software Engineer Intern',
    period: 'Jul 2024 – Oct 2024',
    description: 'Cut API latency 20% by profiling Python and C++ data paths. Built a real-time SaaS analytics dashboard in React and D3.',
    technologies: 'Python · C++ · React · D3.js',
    logo: einnelLogo
  },
  {
    company: 'Wolverine Soft',
    companyUrl: 'https://www.wolverinesoft.org/about-wolverinesoft-studio',
    role: 'QA Lead / Programmer',
    period: 'Sep 2023 – Sep 2024',
    description: 'Led UI systems and quest architecture in Unity, and ran QA in an Agile workflow with Jira and Confluence.',
    technologies: 'Unity · C# · Jira · Confluence',
    logo: wsoftLogo
  },
  {
    company: 'Extern',
    role: 'Snap Lens Developer',
    period: 'Mar 2024 – May 2024',
    description: 'Analyzed engagement across 50K+ users with SQL and Python, surfacing trends behind a 13% retention lift.',
    technologies: 'SQL · Python · Analytics',
    logo: snapLogo
  }
];
