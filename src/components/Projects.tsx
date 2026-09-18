import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor } from 'lucide-react';
import StackIcon from 'tech-stack-icons';
import { getTechStackIconName } from './projectTechIconMap';
import Dither from './Dither';
import './Projects.css';
import { PROJECTS } from '../site/data/projectEntries';
import type { ProjectEntry } from '../site/data/projectEntries';
export type { ProjectEntry };

function BrandGithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.66-3.645-1.455-3.645-1.455-.495-1.26-1.2-1.59-1.2-1.59-.99-.675.075-.66.075-.66 1.095.075 1.665 1.125 1.665 1.125.975 1.665 2.55 1.185 3.165.9.105-.735.39-1.185.705-1.455-2.46-.27-5.04-1.23-5.04-5.515 0-1.23.435-2.23 1.125-3.015-.105-.27-.45-1.365.105-2.85 0 0 .915-.285 3.015 1.14.87-.24 1.815-.36 2.745-.36s1.875.12 2.745.36c2.1-1.425 3.015-1.14 3.015-1.14.555 1.485.21 2.58.105 2.85.69.785 1.125 1.785 1.125 3.015 0 4.305-2.595 5.25-5.07 5.55.405.345.765 1.02.765 2.055 0 1.485-.015 2.685-.015 3.045 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function BrandYoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}


function publicAssetUrl(path: string): string {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

function isVideoMediaSrc(src: string): boolean {
  const cleaned = src.toLowerCase().split('?')[0].split('#')[0];
  return cleaned.endsWith('.mp4') || cleaned.endsWith('.webm') || cleaned.endsWith('.ogg');
}

function youTubeEmbedSrc(url: string): string | null {
  const u = url.trim();
  const short = u.match(/youtu\.be\/([^?&#]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const v = u.match(/[?&]v=([^?&#]+)/);
  if (v) return `https://www.youtube.com/embed/${v[1]}`;
  const embed = u.match(/youtube\.com\/embed\/([^?&#]+)/);
  if (embed) return `https://www.youtube.com/embed/${embed[1]}`;
  return null;
}

function ProjectCover({ project, detail }: { project: ProjectEntry; detail?: boolean }) {
  const base = detail ? 'projects-detail__cover' : 'projects-card__cover';

  if (project.cover) {
    return (
      <div className={base}>
        <img src={publicAssetUrl(project.cover)} alt="" />
      </div>
    );
  }
  if (project.youtubeUrl) {
    const embed = youTubeEmbedSrc(project.youtubeUrl);
    if (embed) {
      return (
        <div className={`${base} ${base}--youtube`}>
          <iframe
            src={embed}
            title={`${project.title} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
    }
  }
  if (!project.media) {
    return (
      <div className={`${base} ${base}--dither`} aria-hidden>
        <Dither
          waveColor={[0.52, 0.52, 0.52]}
          disableAnimation={!detail}
          enableMouseInteraction={false}
          mouseRadius={0.25}
          colorNum={4}
          pixelSize={2}
          waveAmplitude={0.32}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
    );
  }
  const url = publicAssetUrl(project.media);
  if (isVideoMediaSrc(project.media)) {
    return (
      <div className={base}>
        <video
          className={detail ? 'projects-detail__cover-video' : 'projects-card__cover-video'}
          src={url}
          controls
          playsInline
          muted={Boolean(project.autoplayVideo)}
          autoPlay={Boolean(project.autoplayVideo)}
          loop={Boolean(project.autoplayVideo)}
        />
      </div>
    );
  }
  return (
    <div className={base}>
      <img src={url} alt="" />
    </div>
  );
}

function ExpandArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2 10L10 2M10 2H4M10 2V8"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Stable hue per label — muted chips when no tech-stack-icons asset exists. */
function techChipStyle(tech: string): React.CSSProperties {
  let n = 216;
  for (let i = 0; i < tech.length; i++) {
    n = (n * 33 + tech.charCodeAt(i) * (i + 1)) >>> 0;
  }
  const hue = n % 360;
  return {
    background: `hsla(${hue}, 14%, 24%, 0.52)`,
    borderColor: `hsla(${hue}, 16%, 36%, 0.42)`,
    color: `hsl(${hue}, 8%, 82%)`
  };
}

function ProjectTechChip({ tech, tagClass, iconSize }: { tech: string; tagClass: string; iconSize: number }) {
  const icon = getTechStackIconName(tech);
  if (icon) {
    return (
      <span className={`${tagClass} ${tagClass}--stack ${tagClass}--icon-only`} title={tech} aria-label={tech}>
        <span className={`${tagClass}__icon`} aria-hidden>
          <StackIcon
            name={icon}
            variant="dark"
            style={{ width: iconSize, height: iconSize, display: 'block' }}
          />
        </span>
      </span>
    );
  }
  return (
    <span className={tagClass} style={techChipStyle(tech)}>
      {tech}
    </span>
  );
}

function ProjectLinks({
  project,
  className,
  iconSize = 18
}: {
  project: ProjectEntry;
  className: string;
  iconSize?: number;
}) {
  if (!project.link && !project.github && !project.youtubeUrl) return null;
  const stroke = 1.65;
  return (
    <div className={className}>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="projects-external-link"
          aria-label="Open live site"
          title="Live site"
        >
          <Monitor size={iconSize} strokeWidth={stroke} aria-hidden />
        </a>
      )}
      {project.youtubeUrl && (
        <a
          href={project.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="projects-external-link projects-external-link--brand"
          aria-label="Watch on YouTube"
          title="YouTube"
        >
          <BrandYoutubeIcon size={iconSize} />
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="projects-external-link projects-external-link--brand"
          aria-label="View source on GitHub"
          title="GitHub"
        >
          <BrandGithubIcon size={iconSize} />
        </a>
      )}
    </div>
  );
}


const motionEase = [0.22, 1, 0.36, 1] as const;

const Projects: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);

  const focused = focusId ? PROJECTS.find((p) => p.id === focusId) : null;

  useEffect(() => {
    if (focusId && expanded) {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [focusId, expanded]);

  const handleToggle = () => {
    setExpanded((open) => {
      if (open) setFocusId(null);
      return !open;
    });
  };

  return (
    <section className="projects-section" id="projects">
      <div className={`projects-bevel-card ${expanded ? 'is-open' : ''}`}>
        <button
          type="button"
          className="projects-bevel-card__toggle"
          onClick={handleToggle}
          aria-expanded={expanded}
        >
          <h2 className="projects-section-title">Side Projects</h2>
          <span className="projects-bevel-card__chevron" aria-hidden>
            {expanded ? '−' : '+'}
          </span>
        </button>

        <div className={`projects-bevel-card__body${expanded ? ' is-open' : ''}`}>
          {expanded && (
            <div className="projects-bevel-card__collapse">
              <div className="projects-stage">
                <AnimatePresence mode="wait">
          {!focusId ? (
            <motion.div
              key="grid"
              className="projects-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: motionEase }}
            >
              {PROJECTS.map((project) => (
                <article key={project.id} className="projects-card">
                  <ProjectCover project={project} />
                  <h3 className="projects-card__title">{project.title}</h3>
                  {project.roleTag && <span className="projects-card__role">{project.roleTag}</span>}
                  <div className="projects-card__tags">
                    {project.technologies.map((tech) => (
                      <ProjectTechChip key={tech} tech={tech} tagClass="projects-card__tag" iconSize={15} />
                    ))}
                  </div>
                  <div className="projects-card__bottom">
                    <ProjectLinks project={project} className="projects-card__links" />
                    <button
                      type="button"
                      className="projects-card__expand"
                      onClick={() => setFocusId(project.id)}
                    >
                      <span>Expand</span>
                      <ExpandArrowIcon className="projects-card__expand-icon" />
                    </button>
                  </div>
                </article>
              ))}
            </motion.div>
          ) : focused ? (
            <motion.div
              key={`detail-${focusId}`}
              className="projects-detail"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.42, ease: motionEase }}
            >
              <button type="button" className="projects-detail__back" onClick={() => setFocusId(null)}>
                ← All projects
              </button>
              <ProjectCover project={focused} detail />
              <h3 className="projects-detail__title">{focused.title}</h3>
              {focused.roleTag && <span className="projects-detail__role">{focused.roleTag}</span>}
              <div className="projects-detail__tags">
                {focused.technologies.map((tech) => (
                  <ProjectTechChip key={tech} tech={tech} tagClass="projects-detail__tag" iconSize={17} />
                ))}
              </div>
              {focused.metaLine && <p className="projects-detail__meta">{focused.metaLine}</p>}
              <p className="projects-detail__desc">{focused.description}</p>
              {focused.details && <p className="projects-detail__details">{focused.details}</p>}
              {focused.detailText && (
                <p className="projects-detail__desc projects-detail__desc--secondary">{focused.detailText}</p>
              )}
              {focused.highlights && focused.highlights.length > 0 && (
                <ul className="projects-detail__highlights">
                  {focused.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <ProjectLinks project={focused} className="projects-detail__links" iconSize={22} />
            </motion.div>
          ) : null}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
