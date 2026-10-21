import yoggerLogo from '../../assets/yogger-logo.png';
import einnelLogo from '../../assets/einnel-logo.png';
import wsoftLogo from '../../assets/wsoft-logo.png';

export interface ExperienceEntry {
  company: string;
  companyUrl?: string;
  role: string;
  period: string;
  logo: string;
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: 'Yogger',
    companyUrl: 'https://apps.apple.com/us/app/yogger-movement-analysis/id1576592816',
    role: 'Software Engineer',
    period: 'Apr 2026 – Present',
    logo: yoggerLogo
  },
  {
    company: 'Einnel Technologies',
    companyUrl: 'https://einnel.com/',
    role: 'Software Engineer Intern',
    period: 'Jul 2024 – Oct 2024',
    logo: einnelLogo
  },
  {
    company: 'Wolverine Soft',
    companyUrl: 'https://www.wolverinesoft.org/about-wolverinesoft-studio',
    role: 'QA Lead / Programmer',
    period: 'Sep 2023 – Sep 2024',
    logo: wsoftLogo
  }
];
