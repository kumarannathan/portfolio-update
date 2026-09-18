import React from 'react';
import { Screen } from './data/postings';
import './DeviceFrames.css';

const asset = (p: string) => `${(process.env.PUBLIC_URL || '').replace(/\/$/, '')}${p.startsWith('/') ? p : `/${p}`}`;

const Placeholder: React.FC<{ label?: string }> = ({ label = 'screenshot goes here' }) => (
  <div className="frame__placeholder" aria-hidden>
    <span className="frame__placeholder-mark" />
    <span>{label}</span>
  </div>
);

const ScreenContent: React.FC<{ screen: Screen }> = ({ screen }) => {
  const [missing, setMissing] = React.useState(false);
  if (!screen || missing) return <Placeholder label={screen?.alt ? `${screen.alt} · screenshot goes here` : undefined} />;
  return <img src={asset(screen.src)} alt={screen.alt ?? ''} loading="lazy" decoding="async" onError={() => setMissing(true)} />;
};

/** An iPhone-style frame around a portrait screenshot. */
export const PhoneFrame: React.FC<{ screen: Screen; caption?: string; className?: string }> = ({ screen, caption, className = '' }) => (
  <figure className={`phone ${className}`.trim()}>
    <div className="phone__body">
      <span className="phone__island" aria-hidden />
      <div className="phone__screen">
        <ScreenContent screen={screen} />
      </div>
    </div>
    {(caption ?? screen?.alt) && <figcaption className="frame__caption">{caption ?? screen?.alt}</figcaption>}
  </figure>
);

/** A minimal desktop browser window around a landscape screenshot. */
export const BrowserFrame: React.FC<{ screen: Screen; url?: string; caption?: string; className?: string }> = ({
  screen,
  url = 'admin.yogger.io',
  caption,
  className = ''
}) => (
  <figure className={`browser ${className}`.trim()}>
    <div className="browser__body">
      <div className="browser__bar" aria-hidden>
        <span className="browser__dot" />
        <span className="browser__dot" />
        <span className="browser__dot" />
        <span className="browser__url">{url}</span>
      </div>
      <div className="browser__screen">
        <ScreenContent screen={screen} />
      </div>
    </div>
    {(caption ?? screen?.alt) && <figcaption className="frame__caption">{caption ?? screen?.alt}</figcaption>}
  </figure>
);
