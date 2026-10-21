import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FadeContent from '../components/reactbits/FadeContent';
import CountUp from './CountUp';
import { PROJECT_PAGES, PROJECT_ORDER } from './data/projectPages';
import Carousel from '../components/reactbits/Carousel';
import yoggerLogo from '../assets/yogger-logo.png';
import './Project.css';

const asset = (p: string) => `${(process.env.PUBLIC_URL || '').replace(/\/$/, '')}${p}`;

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const page = id ? PROJECT_PAGES[id] : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!page) return <Navigate to="/" replace />;

  const index = PROJECT_ORDER.indexOf(page.id);
  const next = PROJECT_ORDER[(index + 1) % PROJECT_ORDER.length];
  const nextPage = PROJECT_PAGES[next];

  return (
    <div className="page proj">
      <FadeContent duration={600} threshold={0}>
        <Link to="/" className="proj__back">
          <span className="uline">← back</span>
        </Link>
      </FadeContent>

      <FadeContent duration={600} threshold={0}>
        <div className="proj__lede">
          <header className="proj__head">
            <img className="proj__logo" src={yoggerLogo} alt="" aria-hidden />
            <h1 className="proj__title">{page.title}</h1>
            <p className="proj__blurb">{page.blurb}</p>
          </header>

          {page.stats.length > 0 && (
            <div className="metrics">
              {page.stats.map((s) => (
                <div key={s.label} className="metric">
                  <p className="metric__value">
                    <CountUp value={s.value} />
                  </p>
                  <p className="metric__label">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeContent>

      {page.shots.length > 0 && (
        <div className="proj__shots">
          <Carousel
            items={page.shots.map((src) => (
              <div className="shot-slide" key={src}>
                <img src={asset(src)} alt="" draggable={false} decoding="async" />
              </div>
            ))}
            baseWidth={760}
            aspectRatio={1.55}
            effect="scale"
            indicator="bars"
            frame={false}
            loop
            peek={14}
            gap={14}
            radius={10}
            theme="light"
          />
        </div>
      )}

      <section className="band">
        <h2 className="band__label">what shipped</h2>
        <ul className="notes">
          {page.notes.map((n) => (
            <li key={n.title} className="note">
              <h3 className="note__title">{n.title}</h3>
              <p className="note__detail">{n.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="band">
        <h2 className="band__label">built with</h2>
        <p className="proj__stack">{page.stack}</p>
      </section>

      {nextPage && nextPage.id !== page.id && (
        <Link to={`/work/${nextPage.id}`} className="proj__next">
          <span className="proj__next-label">next</span>
          <span className="uline">{nextPage.title} →</span>
        </Link>
      )}
    </div>
  );
};

export default Project;
