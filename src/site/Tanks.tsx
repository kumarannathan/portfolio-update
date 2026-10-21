import React, { useEffect } from 'react';
import FadeContent from '../components/reactbits/FadeContent';
import { TANKS, Tank, TankEntry, TankStat } from './data/tanks';
import FlexCarousel from '../components/reactbits/FlexCarousel';
import './Tanks.css';

const asset = (p: string) => `${(process.env.PUBLIC_URL || '').replace(/\/$/, '')}${p}`;

/** A value I don't have yet reads as a dash, never as a guess. */
const DASH = '—';

/** The little coloured rule before a section label, as on a spec sheet. */
const Eyebrow: React.FC<{ tone: string; children: React.ReactNode }> = ({ tone, children }) => (
  <p className="tank__eyebrow">
    <span className="tank__dash" style={{ background: tone }} aria-hidden />
    {children}
  </p>
);

const Stat: React.FC<{ stat: TankStat }> = ({ stat }) => (
  <div className="tstat">
    <p className="tstat__value">
      {stat.value ?? DASH}
      {stat.value && stat.unit && <span className="tstat__unit">{stat.unit}</span>}
    </p>
    <p className="tstat__label">{stat.label}</p>
    {stat.value && stat.note && <p className="tstat__note">{stat.note}</p>}
  </div>
);

const EntryList: React.FC<{ entries: TankEntry[] }> = ({ entries }) => {
  if (!entries.length) return <p className="tlist__empty">{DASH}</p>;
  return (
    <ul className="tlist">
      {entries.map((e) => (
        <li key={e.name} className="tlist__row">
          <span className="tlist__name">{e.name}</span>
          {e.detail && <span className="tlist__detail">{e.detail}</span>}
          <span className="tlist__count">{e.count ?? ''}</span>
        </li>
      ))}
    </ul>
  );
};

const TankSection: React.FC<{ tank: Tank; index: number }> = ({ tank, index }) => {
  const tone = ['#e4572e', '#2a6f97', '#3f8f5f'][index % 3];
  const schedule = tank.schedule.filter((row) => row.value);
  return (
    <section className="tank" id={tank.id}>
      <header className="tank__head">
        <Eyebrow tone={tone}>tank {String(index + 1).padStart(2, '0')}</Eyebrow>
        <h2 className="tank__name">{tank.name}</h2>
        {tank.blurb && <p className="tank__blurb">{tank.blurb}</p>}
        {tank.started && (
          <p className="tank__started">
            set up <span>{tank.started}</span>
          </p>
        )}
      </header>

      {tank.photos.length > 0 && (
        <div className="tank__reel">
          <FlexCarousel
            items={tank.photos.map((p) => ({
              src: asset(p.src),
              alt: p.caption ?? tank.name,
              title: p.caption ?? tank.name
            }))}
            preset="liquid"
            intro="rise"
            cardHeight={0.5}
            gap={12}
            radius={10}
            squeeze={0.2}
            focusOnClick
            captions
          />
        </div>
      )}

      <div className="tank__stats">
        {tank.stats.map((s) => (
          <Stat key={s.label} stat={s} />
        ))}
      </div>

      <div className="tank__grid">
        <div className="tank__col">
          <Eyebrow tone={tone}>plants</Eyebrow>
          <EntryList entries={tank.plants} />
        </div>
        <div className="tank__col">
          <Eyebrow tone={tone}>livestock</Eyebrow>
          <EntryList entries={tank.livestock} />
        </div>
        <div className="tank__col">
          <Eyebrow tone={tone}>build</Eyebrow>
          <EntryList entries={tank.hardware} />
        </div>
      </div>

      {schedule.length > 0 && (
        <div className="tank__schedule">
          <Eyebrow tone={tone}>schedule</Eyebrow>
          <dl className="tsched">
            {schedule.map((row) => (
              <div key={row.label} className="tsched__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
};

const Tanks: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="tanks container">
      <FadeContent duration={700} threshold={0}>
        <header className="tanks__head">
          <h1 className="tanks__title">Fish tanks</h1>
        </header>
      </FadeContent>

      {TANKS.map((tank, i) => (
        <TankSection key={tank.id} tank={tank} index={i} />
      ))}
    </div>
  );
};

export default Tanks;
