import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FadeContent from '../components/reactbits/FadeContent';
import { EXPERIENCE } from './data/experience';
import { ALL_WORK, WorkItem } from './data/work';
import { PROJECT_PAGES } from './data/projectPages';
import { SOCIAL } from './socials';
import yoggerLogo from '../assets/yogger-logo.png';
import toshiLogo from '../assets/toshi-logo.svg';
import countertopLogo from '../assets/countertop-logo.png';
import lumenLogo from '../assets/lumen-logo.png';
import miloLogo from '../assets/logo.png';
import './About.css';

/** Product marks shown beside a project name. */
const LOGOS: Record<string, string> = {
  toshi: toshiLogo,
  countertop: countertopLogo,
  lumen: lumenLogo,
  'milo-mission-control': miloLogo
};

function logoFor(item: WorkItem): string | undefined {
  return LOGOS[item.id] ?? (item.kind === 'production' ? yoggerLogo : undefined);
}

/** The Yogger work, in the order it's worth reading. */
const WORK_IDS = [
  'yogger-web-redesign',
  'yogger-crm',
  'home-exercise-builder',
  'saml-sso',
  'rag-gemini'
];

/** Built for myself, on my own time. */
const SIDE_IDS = ['toshi', 'lumen', 'countertop', 'milo-mission-control'];

const byIds = (ids: string[]) =>
  ids.map((id) => ALL_WORK.find((w) => w.id === id)).filter((w): w is WorkItem => Boolean(w));

const WORK = byIds(WORK_IDS);
const SIDE = byIds(SIDE_IDS);

/** A name on the left, a year or a link on the right, a dashed rule between. */
const GitHubMark: React.FC = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const LeaderRow: React.FC<{
  logo?: string;
  name: React.ReactNode;
  note: React.ReactNode;
  github?: string;
}> = ({ logo, name, note, github }) => (
  <li className="lrow">
    {logo && <img className="lrow__logo" src={logo} alt="" aria-hidden />}
    <span className="lrow__name">{name}</span>
    {github && (
      <a className="lrow__gh" href={github} target="_blank" rel="noreferrer" aria-label="Source on GitHub" title="Source on GitHub">
        <GitHubMark />
      </a>
    )}
    <span className="lrow__rule" aria-hidden />
    <span className="lrow__note">{note}</span>
  </li>
);

const Section: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <section className="band">
    <h2 className="band__label">{label}</h2>
    {children}
  </section>
);

const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

/** Where the project name goes: its site when it has one, otherwise the repo. */
function linkFor(item: WorkItem): { href: string; label: string } | null {
  const live = item.detail.links.find((l) => /live|site/i.test(l.label));
  const repo = item.detail.links.find((l) => /github/i.test(l.label));
  if (live) return { href: live.href.startsWith('/') ? `${base}${live.href}` : live.href, label: 'live' };
  if (repo) return { href: repo.href, label: 'github' };
  return null;
}

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="page">
      <FadeContent duration={700} threshold={0}>
        <header className="intro">
          <img className="intro__avatar" src={`${process.env.PUBLIC_URL || ''}/me.jpg`} alt="Kumaran Nathan" />
          <h1 className="intro__head">
            Software engineer, product builder &amp; occasional fish keeper.
          </h1>
          <p className="intro__body">
            hey! i'm kumaran. i graduated from the university of michigan in 2025, where i studied computer science. i
            build across the stack — web, mobile and the parts in between — and i like taking something from an idea to
            a thing people actually use.
          </p>
          <p className="intro__body">
            right now i'm at <strong>Yogger</strong>, where i've shipped the coach web app redesign, the internal crm,
            the home exercise builder and the android assessment engine. before that i led UI/UX at{' '}
            <strong>WolverineSoft</strong>. the thing i keep coming back to is how software can feel more human,
            tactile and alive.
          </p>
          <p className="intro__body">
            when i'm not building, i'm usually playing <strong>Valorant</strong>, hiking, taking{' '}
            <Link to="/photos">
              <span className="uline">photos</span>
            </Link>
            , or setting up fish tanks.
          </p>
        </header>
        <div className="intro__social">
          {SOCIAL.map((x) => (
            <a
              key={x.label}
              href={x.href}
              target={x.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={x.label}
              title={x.label}
            >
              {x.icon}
            </a>
          ))}
        </div>
      </FadeContent>

      <Section label="work experience">
        <ul className="lrows">
          {EXPERIENCE.map((x) => (
            <LeaderRow
              key={x.company + x.role}
              logo={x.logo}
              name={
                x.companyUrl ? (
                  <a href={x.companyUrl} target="_blank" rel="noreferrer">
                    <span className="uline">{x.company}</span>
                  </a>
                ) : (
                  x.company
                )
              }
              note={x.period}
            />
          ))}
        </ul>
      </Section>

      <Section label="work">
        <ul className="lrows">
          {WORK.map((item) => (
            <LeaderRow
              key={item.id}
              logo={logoFor(item)}
              name={
                PROJECT_PAGES[item.id] ? (
                  <Link to={`/work/${item.id}`}>
                    <span className="uline">{item.title}</span>
                  </Link>
                ) : (
                  item.title
                )
              }
              note={item.year}
            />
          ))}
        </ul>
      </Section>

      <Section label="side projects">
        <ul className="lrows">
          {SIDE.map((item) => {
            const link = linkFor(item);
            return (
              <LeaderRow
                key={item.id}
                logo={logoFor(item)}
                github={link?.label === 'live' ? item.github : undefined}
                name={
                  link ? (
                    <a href={link.href} target="_blank" rel="noreferrer">
                      <span className="uline">{item.title}</span>
                    </a>
                  ) : (
                    item.title
                  )
                }
                note={item.year}
              />
            );
          })}
        </ul>
      </Section>

      <footer className="page__foot">detroit, michigan</footer>
    </div>
  );
};

export default About;
