import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import BackButton from './BackButton';
import CountUp from './CountUp';
import { Thumb, logoFor } from './ProjectCard';
import { TABS, Tab, entriesFor, WorkEntry } from './data/workTabs';
import './ProjectCard.css';
import './Work.css';

const TAB_KEY = 'work:tab';

function readTab(): Tab {
  try {
    const t = window.localStorage.getItem(TAB_KEY) as Tab | null;
    return t && TABS.includes(t) ? t : 'favorites';
  } catch {
    return 'favorites';
  }
}

const EntryCard: React.FC<{ entry: WorkEntry; wide: boolean }> = ({ entry, wide }) => {
  const navigate = useNavigate();
  const href = `/work/${entry.item.id}`;
  const logo = logoFor(entry.item);
  return (
    <article className={`wcard${wide ? ' wcard--wide' : ''}`}>
      <button type="button" className="wcard__thumb" onClick={() => navigate(href)} aria-label={`${entry.title}: more`}>
        <Thumb item={entry.item} />
      </button>
      <div className="wcard__row">
        {logo && <img className="pcard__logo" src={logo} alt="" aria-hidden />}
        <h3 className="wcard__title">
          <Link to={href}>{entry.title}</Link>
        </h3>
      </div>
      <p className="wcard__blurb">{entry.blurb}</p>
      <div className="wcard__foot">
        {entry.stats.length > 0 ? (
          <dl className="wcard__stats">
            {entry.stats.map((s) => (
              <div key={s.label}>
                <dt>
                  <CountUp value={s.value} />
                </dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <span className="wcard__foot-spacer" aria-hidden />
        )}
        <Link to={href} className="wcard__cta">
          more
        </Link>
      </div>
    </article>
  );
};

const Work: React.FC = () => {
  const [tab, setTab] = useState<Tab>(readTab);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(TAB_KEY, tab);
    } catch {
      /* private mode etc. */
    }
  }, [tab]);

  const entries = entriesFor(tab);

  return (
    <div className="work container">
      <h1 className="sr-only">Work</h1>
      <BackButton fallback="/" />

      <nav className="work__tabs" role="tablist" aria-label="work">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={`squig squig--${t} work__tab${tab === t ? ' is-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      <AnimatedContent key={tab} distance={16} duration={0.5} threshold={0}>
        <div className="wgrid">
          {entries.map((e, i) => (
            <EntryCard key={e.item.id} entry={e} wide={i < 2} />
          ))}
        </div>
      </AnimatedContent>
    </div>
  );
};

export default Work;
