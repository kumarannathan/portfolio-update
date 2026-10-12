import React, { useEffect, useState } from 'react';
import FadeContent from '../components/reactbits/FadeContent';
import { TANKS, Tank, TankEntry, TankPhoto, TankStat } from './data/tanks';
import Collapse from './Collapse';
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

/** Photos load lazily and show their own frame until they do. */
const Photo: React.FC<{ photo: TankPhoto; lead?: boolean }> = ({ photo, lead }) => {
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`tshot${lead ? ' tshot--lead' : ''}`}>
      {failed ? (
        <div className="tshot__missing">
          <code>{photo.src}</code>
        </div>
      ) : (
        <img src={asset(photo.src)} alt={photo.caption ?? ''} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      )}
      {photo.caption && <figcaption>{photo.caption}</figcaption>}
    </figure>
  );
};

const TankSection: React.FC<{ tank: Tank; index: number }> = ({ tank, index }) => {
  const tone = ['#e4572e', '#2a6f97', '#3f8f5f'][index % 3];
  const main = tank.photos.find((p) => p.main);
  const rest = tank.photos.filter((p) => p !== main);
  const schedule = tank.schedule.filter((row) => row.value);
  const [shots, setShots] = useState(index === 0);
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
        <div className={`tank__gallery${shots ? ' is-open' : ''}`}>
          <button type="button" className="tank__toggle" aria-expanded={shots} onClick={() => setShots((v) => !v)}>
            <span className="tank__chev" aria-hidden>
              ›
            </span>
            <span className="tank__toggle-label">
              photos <span className="tank__count">{tank.photos.length}</span>
            </span>
          </button>
          <Collapse open={shots}>
            {main && <Photo photo={main} lead />}
            {rest.length > 0 && (
              <div className="tank__shots">
                {rest.map((p) => (
                  <Photo key={p.src} photo={p} />
                ))}
              </div>
            )}
          </Collapse>
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
