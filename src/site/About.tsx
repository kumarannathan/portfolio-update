import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FadeContent from '../components/reactbits/FadeContent';
import { EXPERIENCE } from './data/experience';
import { ALL_WORK, WorkItem } from './data/work';
import { getCaseStudy } from './data/caseStudies';
import Collapse from './Collapse';
import yoggerLogo from '../assets/yogger-logo.png';
import toshiLogo from '../assets/toshi-logo.svg';
import countertopLogo from '../assets/countertop-logo.png';
import './About.css';

/** Product marks shown beside a project name. */
const LOGOS: Record<string, string> = { toshi: toshiLogo, countertop: countertopLogo };

function logoFor(item: WorkItem): string | undefined {
  return LOGOS[item.id] ?? (item.kind === 'production' ? yoggerLogo : undefined);
}

/** How many projects show before you ask for the rest. */
const SHOWN = 3;

/** Projects in the order they're worth reading, strongest first. */
const PROJECT_ORDER = [
  'yogger-web-redesign',
  'toshi',
  'yogger-crm',
  'countertop',
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

const PROJECTS = PROJECT_ORDER.map((id) => ALL_WORK.find((w) => w.id === id)).filter(
  (w): w is NonNullable<typeof w> => Boolean(w)
);

interface AboutProps {
  /** The project list. */
  showProjects?: boolean;
}

const About: React.FC<AboutProps> = ({ showProjects = true }) => {
  const [open, setOpen] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const visible = showAll ? PROJECTS : PROJECTS.slice(0, SHOWN);

  return (
    <div className="about container">
      <FadeContent duration={700} threshold={0}>
        <h1 className="sr-only">Kumaran Nathan — software engineer in Detroit</h1>
        <header className="about__head">
          <img className="about__avatar" src={`${process.env.PUBLIC_URL || ''}/me.jpg`} alt="Kumaran Nathan" />
          <div>
            <h2 className="about__name">Kumaran Nathan</h2>
            <p className="about__role">software engineer · detroit</p>
          </div>
        </header>

        <section className="about__bio">
          <p>
            hey! i'm kumaran. i graduated from the university of michigan in 2025, where i studied computer science. i love
            working across the stack, building products from idea to production.
          </p>
          <p>
            my background is in engineering, with time leading UI/UX at <strong>WolverineSoft</strong>, but the thing i
            keep coming back to is how software can feel more human, tactile, and alive.
          </p>
          <p>
            when i'm not building, i'm usually playing <strong>Valorant</strong>, hiking, taking{' '}
            <Link to="/photos">
              <span className="uline">photos</span>
            </Link>
            , or setting up{' '}
            <Link to="/fish-tanks">
              <span className="uline">fish tanks</span>
            </Link>
            .
          </p>
        </section>
      </FadeContent>

      <section className="section about__section">
        <h2 className="label label--left">experience</h2>
        <ul className="xp">
          {EXPERIENCE.map((x) => (
            <li key={x.company + x.role} className="xp__row">
              <img className="xp__logo" src={x.logo} alt="" aria-hidden />
              <div className="xp__body">
                <div className="xp__title">
                  {x.companyUrl ? (
                    <a href={x.companyUrl} target="_blank" rel="noreferrer">
                      {x.company}
                    </a>
                  ) : (
                    <span>{x.company}</span>
                  )}
                  <span className="xp__role">, {x.role}</span>
                </div>
              </div>
              <div className="xp__period">{x.period}</div>
            </li>
          ))}
        </ul>
      </section>

      {showProjects && (
        <section className="section about__section">
          <h2 className="label label--left">projects</h2>
          <ul className="plist">
            {visible.map((item) => {
              const isOpen = open === item.id;
              const study = getCaseStudy(item.id);
              const logo = logoFor(item);
              return (
                <li key={item.id} className="plist__row">
                  <button
                    type="button"
                    className="plist__name"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                  >
                    {logo && <img className="plist__logo" src={logo} alt="" aria-hidden />}
                    <span className="uline">{item.title}</span>
                  </button>
                  <Collapse open={isOpen}>
                    <div className="plist__body">
                      <p className="plist__lead">{item.detail.lead}</p>
                      <p className="plist__tech">{item.detail.tech}</p>
                      {study && (
                        <Link to={`/work/${item.id}`} className="plist__link">
                          <span className="uline">read the case study →</span>
                        </Link>
                      )}
                    </div>
                  </Collapse>
                </li>
              );
            })}
          </ul>
          {PROJECTS.length > SHOWN && (
            <button type="button" className="plist__more" onClick={() => setShowAll((v) => !v)}>
              <span className="uline">
                {showAll ? 'show less' : `see more (${PROJECTS.length - SHOWN})`}
              </span>
            </button>
          )}
        </section>
      )}

      <section className="section about__section">
        <h2 className="label label--left">elsewhere</h2>
        <div className="about__links">
          <a href="mailto:kumarann@umich.edu">
            <span className="uline">email ↗</span>
          </a>
          <a href="https://github.com/kumarannathan/" target="_blank" rel="noreferrer">
            <span className="uline">github ↗</span>
          </a>
          <a href="https://linkedin.com/in/kkumarann" target="_blank" rel="noreferrer">
            <span className="uline">linkedin ↗</span>
          </a>
          <a href="https://kumi.tiiny.site" target="_blank" rel="noreferrer">
            <span className="uline">resume ↗</span>
          </a>
        </div>
      </section>

    </div>
  );
};

export default About;
