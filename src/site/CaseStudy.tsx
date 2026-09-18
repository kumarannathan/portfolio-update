import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FadeContent from '../components/reactbits/FadeContent';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import LineSidebar from '../components/reactbits/LineSidebar';
import WorkMenu from './WorkMenu';
import BackButton from './BackButton';
import CountUp from './CountUp';
import { ShotImage } from './BeforeAfter';
import { REDESIGN_PAIRS, REDESIGN_NEW, REDESIGN_VIDEO } from './data/redesign';
import { getCaseStudy, getWorkItem, Figure } from './data/caseStudies';
import './CaseStudy.css';

const asset = (p: string) => `${(process.env.PUBLIC_URL || '').replace(/\/$/, '')}${p.startsWith('/') ? p : `/${p}`}`;

type TocItem = { id: string; label: string };

const KPI_RE =
  /((?:~?\$)?[+#]?\d[\d,.]*(?:%|×|x|K|k|\+)?(?:[\s-]?(?:peak|documents?|assessment types?|assessments|screens|components|employees|users|weeks|filterable fields|monthly reservations|queries|months?|minutes?|hours?|clicks|place))?)/g;
const YEAR_RE = /^(19|20)\d{2}$/;

function isKpi(token: string): boolean {
  const t = token.trim();
  if (YEAR_RE.test(t)) return false;
  return /[%×xK+$#,-]|\s/.test(t) || /\d\.\d/.test(t);
}

function Kpis({ text }: { text: string }) {
  const parts = text.split(KPI_RE);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 && isKpi(part) ? (
          <strong key={i} className="kpi">
            <CountUp value={part} />
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

function Media({ fig, className }: { fig: Figure; className?: string }) {
  const isVideo = fig.kind === 'video' || /\.(mp4|webm)$/i.test(fig.src);
  return (
    <figure className={`cs__figure ${className ?? ''}`.trim()}>
      {isVideo ? (
        <video src={asset(fig.src)} muted loop autoPlay playsInline controls preload="metadata" />
      ) : (
        <img src={asset(fig.src)} alt={fig.caption ?? ''} loading="lazy" decoding="async" />
      )}
      {fig.caption && <figcaption>{fig.caption}</figcaption>}
    </figure>
  );
}

type CarouselSlide = { id: string; src: string; label: string };

/** Horizontal snap carousel — no chrome overload, just slides + dots. */
function ShotCarousel({ slides, label }: { slides: CarouselSlide[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const syncIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncIndex, { passive: true });
    return () => el.removeEventListener('scroll', syncIndex);
  }, [syncIndex]);

  const go = (next: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
    setIndex(clamped);
  };

  if (slides.length === 0) return null;

  return (
    <div className="cs__carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={trackRef} className="cs__carousel-track">
        {slides.map((slide) => (
          <figure key={slide.id} className="cs__carousel-slide">
            <div className="browser__body">
              <div className="browser__bar" aria-hidden>
                <span className="browser__dot" />
                <span className="browser__dot" />
                <span className="browser__dot" />
                <span className="browser__url">app.yogger.io</span>
              </div>
              <div className="browser__screen">
                <ShotImage src={slide.src} label={slide.label} />
              </div>
            </div>
            <figcaption className="cs__carousel-cap">{slide.label}</figcaption>
          </figure>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="cs__carousel-nav">
          <button type="button" className="cs__carousel-btn" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous">
            ←
          </button>
          <div className="cs__carousel-dots" role="tablist" aria-label={label}>
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`cs__carousel-dot${i === index ? ' is-active' : ''}`}
                onClick={() => go(i)}
                aria-label={`${slide.label}, slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="cs__carousel-btn"
            onClick={() => go(index + 1)}
            disabled={index >= slides.length - 1}
            aria-label="Next"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

function RedesignVideo() {
  const [missing, setMissing] = useState(false);
  const src = REDESIGN_VIDEO.src;

  if (missing) return null;

  return (
    <figure className="cs__figure cs__figure--video">
      <video
        src={asset(src)}
        controls
        playsInline
        preload="metadata"
        onError={() => setMissing(true)}
      />
      <figcaption>{REDESIGN_VIDEO.caption}</figcaption>
    </figure>
  );
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const CaseStudy: React.FC = () => {
  const { id = '' } = useParams();
  const cs = getCaseStudy(id);
  const item = getWorkItem(id);
  const [tocActive, setTocActive] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setTocActive(0);
    setTocOpen(false);
  }, [id]);

  const componentSlides = useMemo<CarouselSlide[]>(
    () => REDESIGN_PAIRS.map((pair) => ({ id: pair.id, src: pair.after, label: pair.label })),
    []
  );
  const newPageSlides = useMemo<CarouselSlide[]>(
    () => REDESIGN_NEW.map((shot) => ({ id: shot.id, src: shot.src, label: shot.label })),
    []
  );

  const toc = useMemo<TocItem[]>(() => {
    if (!cs) return [];
    const items: TocItem[] = [{ id: 'cs-overview', label: 'Overview' }];
    if ((cs.figures ?? []).some((f) => f.kind === 'video' || /\.(mp4|webm)$/i.test(f.src))) {
      items.push({ id: 'cs-walkthrough', label: 'Walkthrough' });
    }
    cs.sections.forEach((sec, i) => {
      const label = sec.heading || `Section ${i + 1}`;
      items.push({ id: `cs-sec-${i}-${slugify(label)}`, label });
    });
    if (cs.id === 'yogger-web-redesign') {
      items.push({ id: 'cs-components', label: 'Components' });
      items.push({ id: 'cs-new', label: 'New pages' });
    }
    const extraScreens =
      cs.id === 'home-exercise-builder' || cs.id === 'toshi'
        ? (cs.figures?.length ?? 0) - 1 > cs.sections.length
        : (cs.figures?.length ?? 0) > 1;
    if (extraScreens) items.push({ id: 'cs-screens', label: 'Screens' });
    items.push({ id: 'cs-more', label: 'More Projects' });
    return items;
  }, [cs]);

  useEffect(() => {
    if (toc.length === 0) return;

    const nodes = toc
      .map((t) => document.getElementById(t.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (obsEntries) => {
        obsEntries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });
        let bestId = '';
        let best = 0;
        ratios.forEach((ratio, sectionId) => {
          if (ratio > best) {
            best = ratio;
            bestId = sectionId;
          }
        });
        if (!bestId) return;
        const idx = toc.findIndex((t) => t.id === bestId);
        if (idx >= 0) setTocActive(idx);
      },
      { rootMargin: '-18% 0px -55% 0px', threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [toc, id]);

  const onTocClick = useCallback(
    (index: number) => {
      const target = toc[index];
      if (!target) return;
      document.getElementById(target.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTocActive(index);
    },
    [toc]
  );

  if (!cs || !item) return <Navigate to="/work" replace />;

  const figures = cs.figures ?? [];
  const hero = figures.find((f) => f.kind !== 'video' && !/\.(mp4|webm)$/i.test(f.src));
  const walkthrough = figures.find((f) => f.kind === 'video' || /\.(mp4|webm)$/i.test(f.src));
  const rest = figures.filter((f) => f !== hero && f !== walkthrough);
  const wrapScreens = cs.id === 'home-exercise-builder' || cs.id === 'toshi';

  return (
    <article className="cs container">
      <BackButton fallback="/work" />

      <div className="cs__layout">
        <div className="cs__main">
          <FadeContent duration={600} threshold={0}>
            <header className="cs__head">
              <p className="cs__eyebrow">
                {cs.year && <span>{cs.year}</span>}
                {cs.year && <span className="cs__sep">·</span>}
                <span>{cs.platforms}</span>
              </p>
              <h1 className="cs__title">{cs.title}</h1>
              <p className="cs__company">{cs.company}</p>
              {cs.links.length > 0 && (
                <div className="cs__actions">
                  {cs.links.map((l, i) => (
                    <a key={l.href} className={i === 0 ? 'cs__cta' : 'textlink'} href={l.href} target="_blank" rel="noreferrer">
                      {l.label} <span aria-hidden>↗</span>
                    </a>
                  ))}
                </div>
              )}
            </header>
          </FadeContent>

          {hero && (
            <AnimatedContent distance={24} duration={0.7} threshold={0}>
              <div className="cs__hero">
                <Media fig={hero} className="cs__figure--hero" />
              </div>
            </AnimatedContent>
          )}

          <section className="cs__section" id="cs-overview">
            <h2 className="cs__h2">Overview</h2>
            <p className="cs__body">
              <Kpis text={cs.overview} />
            </p>
          </section>

          {walkthrough && (
            <section className="cs__section" id="cs-walkthrough">
              <h2 className="cs__h2">Walkthrough</h2>
              <Media fig={walkthrough} className="cs__figure--video" />
            </section>
          )}

          {cs.sections.map((sec, i) => {
            const label = sec.heading || `Section ${i + 1}`;
            const paired =
              wrapScreens && rest[i]
                ? rest[i]
                : sec.figures?.[0];
            const useWrap = Boolean(paired);

            return (
              <section key={i} className="cs__section" id={`cs-sec-${i}-${slugify(label)}`}>
                {sec.heading && <h2 className="cs__h2">{sec.heading}</h2>}
                {useWrap && paired ? (
                  <div className={`cs__prose${i % 2 === 1 ? ' cs__prose--flip' : ''}`}>
                    <Media fig={paired} className="cs__figure--float cs__figure--float-lg" />
                    <p className="cs__body">
                      <Kpis text={sec.body} />
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="cs__body">
                      <Kpis text={sec.body} />
                    </p>
                    {sec.figures && (
                      <div className={`cs__figures${sec.figures.length === 1 ? ' cs__figures--single' : ''}`}>
                        {sec.figures.map((f) => (
                          <Media key={f.src} fig={f} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </section>
            );
          })}

          {cs.id === 'yogger-web-redesign' && (
            <>
              <RedesignVideo />
              <section className="cs__section" id="cs-components">
                <h2 className="cs__h2">Components</h2>
                <p className="cs__body">Screens that already existed — tightened into one shell.</p>
                <ShotCarousel slides={componentSlides} label="Redesigned components" />
              </section>
              <section className="cs__section" id="cs-new">
                <h2 className="cs__h2">New pages</h2>
                <p className="cs__body">Surfaces that did not exist before the redesign.</p>
                <ShotCarousel slides={newPageSlides} label="New pages" />
              </section>
            </>
          )}

          {rest.length > 0 && !wrapScreens && (
            <section className="cs__section" id="cs-screens">
              <h2 className="cs__h2">Screens</h2>
              <div className={`cs__figures${rest.length === 1 ? ' cs__figures--single' : ''}`}>
                {rest.map((f) => (
                  <Media key={f.src} fig={f} />
                ))}
              </div>
            </section>
          )}

          {wrapScreens && rest.length > cs.sections.length && (
            <section className="cs__section" id="cs-screens">
              <h2 className="cs__h2">More screens</h2>
              <div className="cs__screens-wrap">
                {rest.slice(cs.sections.length).map((f, i) => (
                  <div key={f.src} className={`cs__prose${i % 2 === 1 ? ' cs__prose--flip' : ''}`}>
                    <Media fig={f} className="cs__figure--float cs__figure--float-lg" />
                    {f.caption && <p className="cs__body cs__body--cap">{f.caption}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="cs__section">
            <p className="cs__note">{cs.stack}</p>
          </section>

          <section className="cs__section cs__more" id="cs-more">
            <h2 className="cs__h2">More Projects</h2>
            <WorkMenu currentId={cs.id} height={260} />
            <div className="cs__all">
              <Link to="/work" className="textlink">
                all projects →
              </Link>
            </div>
          </section>
        </div>

        <aside
          className={`cs__toc${tocOpen ? ' is-open' : ' is-collapsed'}`}
          aria-label="on this page"
        >
          <button
            type="button"
            className="cs__toc-toggle"
            aria-expanded={tocOpen}
            onClick={() => setTocOpen((o) => !o)}
          >
            <span className="cs__toc-burger" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            contents
          </button>
          {tocOpen && (
            <div className="cs__toc-panel">
              <LineSidebar
                key={cs.id}
                items={toc.map((t) => t.label)}
                accentColor="#2a2520"
                textColor="#9a9188"
                markerColor="#c6b6b6"
                showIndex={false}
                showMarker
                proximityRadius={90}
                maxShift={18}
                falloff="sharp"
                markerLength={40}
                markerGap={2}
                tickScale={0.45}
                scaleTick
                itemGap={14}
                fontSize={0.88}
                smoothing={100}
                defaultActive={tocActive}
                onItemClick={onTocClick}
              />
            </div>
          )}
        </aside>
      </div>
    </article>
  );
};

export default CaseStudy;
