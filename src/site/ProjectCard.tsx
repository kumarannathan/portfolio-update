import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkItem } from './data/work';
import yoggerLogo from '../assets/yogger-logo.png';
import toshiLogo from '../assets/toshi-logo.svg';
import './ProjectCard.css';

const asset = (p: string) => `${(process.env.PUBLIC_URL || '').replace(/\/$/, '')}${p.startsWith('/') ? p : `/${p}`}`;

/** Product marks shown beside a title, same treatment as the about page. */
const LOGOS: Record<string, string> = { toshi: toshiLogo };

export function logoFor(item: WorkItem): string | undefined {
  return LOGOS[item.id] ?? (item.kind === 'production' ? yoggerLogo : undefined);
}

function Placeholder({ item }: { item: WorkItem }) {
  return (
    <div className="pcard__placeholder" aria-hidden>
      <span className="pcard__placeholder-title">{item.title}</span>
      <span className="pcard__placeholder-tech">{item.detail.tech}</span>
    </div>
  );
}

function FallbackImg({ item, src }: { item: WorkItem; src: string }) {
  const [missing, setMissing] = React.useState(false);
  if (missing) return <Placeholder item={item} />;
  return <img src={src} alt="" loading="lazy" decoding="async" onError={() => setMissing(true)} />;
}

/** The card's picture: the project's own media, or its name and stack when there isn't any. */
export function Thumb({ item }: { item: WorkItem }) {
  if (!item.media) return <Placeholder item={item} />;
  if (item.media.type === 'video') {
    return <video src={asset(item.media.src)} muted loop autoPlay playsInline preload="metadata" aria-hidden />;
  }
  return <FallbackImg item={item} src={asset(item.media.src)} />;
}

interface ProjectCardProps {
  item: WorkItem;
}

/** Card that opens the project's case-study page. */
const ProjectCard: React.FC<ProjectCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const open = () => navigate(`/work/${item.id}`);
  const logo = logoFor(item);

  return (
    <article
      className="pcard"
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`${item.title}: read the case study`}
    >
      <div className="pcard__frame">
        <Thumb item={item} />
      </div>
      <div className="pcard__meta">
        <div className="pcard__row">
          {logo && <img className="pcard__logo" src={logo} alt="" aria-hidden />}
          <h3 className="pcard__title">{item.title}</h3>
        </div>
        <p className="pcard__tech">{item.detail.tech}</p>
      </div>
    </article>
  );
};

export default ProjectCard;
