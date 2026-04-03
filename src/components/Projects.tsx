import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor } from 'lucide-react';
import StackIcon from 'tech-stack-icons';
import { getTechStackIconName } from './projectTechIconMap';
import './Projects.css';

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

export interface ProjectEntry {
  id: string;
  title: string;
  technologies: string[];
  /** Full lead copy — expanded view (and fallback if no summary) */
  description: string;
  /** One-line preview on grid cards */
  summary?: string;
  /** Category chip (e.g. OpenClaw, Frontend) — expanded + grid */
  roleTag?: string;
  /** e.g. "2026 • React, …" — expanded view only */
  metaLine?: string;
  /** Shown only in expanded view — stack, scope, or feature summary */
  details?: string;
  /** Bullet list — expanded view only */
  highlights?: string[];
  cover?: string;
  media?: string;
  /** youtu.be/… or youtube.com/watch?v=… — embedded in the card */
  youtubeUrl?: string;
  autoplayVideo?: boolean;
  link?: string;
  github?: string;
  /** Extra paragraph, expanded view only */
  detailText?: string;
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
    return <div className={`${base} ${base}--empty`} aria-hidden />;
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
      <span className={`${tagClass} ${tagClass}--stack`} title={tech}>
        <span className={`${tagClass}__icon`} aria-hidden>
          <StackIcon
            name={icon}
            variant="dark"
            style={{ width: iconSize, height: iconSize, display: 'block' }}
          />
        </span>
        <span className={`${tagClass}__label`}>{tech}</span>
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

const PROJECTS: ProjectEntry[] = [
  {
    id: 'milo-mission-control',
    title: 'Milo — Mission Control',
    roleTag: 'OpenClaw',
    technologies: ['React', 'Netlify Functions', 'Supabase', 'Python', 'Ollama', 'RapidAPI'],
    summary:
      'Run a fleet of specialized AI agents from one Mission Control dashboard—live status, shared memory, and a task bus you can actually watch.',
    metaLine: '2026 • React, Netlify Functions, Supabase, Python, Ollama, RapidAPI',
    description:
      'Run a fleet of specialized AI agents from one Mission Control dashboard—live status, shared memory, and a task bus you can actually watch instead of guessing what your bots are doing. I wired end-to-end pipelines from research and drafts through publish and social, with Milo orchestrating handoffs across agents in production. The whole stack is serverless APIs plus Supabase-backed state, tuned so cheap local inference (Ollama) keeps monthly costs trivial until you need to scale.',
    highlights: [
      'Built a multi-agent architecture orchestrated via shared task queues and memory (Supabase)',
      'Designed a Mission Control UI (React) to visualize agent status, activity feeds, and pipelines in real time',
      'Implemented a serverless backend (Netlify Functions) for agent communication, logging, and coordination',
      'Optimized for low-cost local inference (Ollama) with ~$1.50/month API usage (option to scale with paid models)',
      'Trade Bot: Tracks Polymarket activity and auto-researches positions/trends',
      'Competitor Intelligence Bot: Monitors tweets, news, and trends based on brand configs using RapidAPI + Clawdbot',
      'Content Pipeline Agents: End-to-end automation (research → draft → optimize → publish) across multiple specialized bots',
      'Orchestrator (Milo): Manages task scheduling, agent coordination, and pipeline execution via shared agent_tasks'
    ],
    media: '/milo.mp4',
    autoplayVideo: true
  },
  {
    id: 'neetcode-redesign',
    title: 'NeetCode Redesign',
    roleTag: 'Frontend',
    technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'GSAP'],
    summary:
      'Built a full NeetCode-inspired redesign with a modern dark aesthetic to make interview prep feel like a polished product.',
    metaLine: '2026 • Next.js 16, React 19, TypeScript, Tailwind CSS v4, GSAP',
    description:
      'Built a full NeetCode-inspired redesign with a modern dark aesthetic to make interview prep feel like a polished product rather than a static content site. Shipped for an X competition with animated landing experiences, state-driven dashboard navigation, and reusable interaction systems across key prep flows.',
    highlights: [
      'Built an animated landing with rotating insight cards, structured course explorer, roadmap section, and interactive resources blocks',
      'Developed a rich dashboard prototype with in-page sections (Home, Coding Interviews, Problems, Company Tagged, System Design, Roadmap)',
      'Implemented reusable UI systems (cards, chips, counters, hover/focus transitions, responsive sidebar behavior, reduced-motion-safe polish)',
      'Integrated route flow end-to-end (/sign-in → fake auth → /dashboard) and resolved production TypeScript/build blockers'
    ],
    media: '/neetcode.mp4',
    autoplayVideo: true,
    link: 'https://neatcoded.netlify.app/',
    github: 'https://github.com/kumarannathan/Neetcode.git'
  },
  {
    id: 'sipt',
    title: 'Sipt',
    roleTag: 'Mobile',
    technologies: ['React', 'React Native', 'TypeScript', 'mobile development'],
    summary: 'Letterboxd for specialty coffee—social discovery, taste identity, and community around how you rate brews.',
    metaLine: '2026 • React, React Native, TypeScript, mobile development',
    description:
      'Letterboxd for specialty coffee. Existing coffee loggers help you track brews privately, but they stop short of discovery, taste identity, and community. Sipt adds the social layer: log coffees with a 3-axis rating across Enjoyment, Balance, and Clarity, follow people whose taste you trust, and build a profile that actually says something about what you like.',
    media: '/videos/coffee.mp4',
    autoplayVideo: true
  },
  {
    id: 'booking-platform',
    title: 'Startup Booking Platform',
    roleTag: 'Frontend',
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'JWT'],
    summary:
      'Full-stack booking platform with TypeScript/React and Node/Express—100+ monthly reservations with PostgreSQL and JWT auth.',
    metaLine: '2025 • React • Node.js • Express • PostgreSQL • JWT',
    description:
      'Full-stack booking platform with TypeScript/React frontend and Node.js/Express backend handling 100+ monthly reservations with PostgreSQL managing relational customer and availability data. Built RESTful API layer with automated email notifications and JWT authentication.',
    media: '/mtm.mp4',
    autoplayVideo: true
  },
  {
    id: 'soul-forest',
    title: 'Soul of the Forest',
    roleTag: 'Game Dev',
    technologies: ['Unity', 'C#', 'Figma', 'Jira', 'Git'],
    summary: 'Commercial game UI/UX—timelines, playtesting, menus in Figma, C#, Unity.',
    metaLine: '2023 • Unity • C# • Figma • Jira • Git',
    description:
      'Directed UI/UX department for commercial game development, establishing development timelines using Jira, Confluence, and Git. Led comprehensive playtesting and implemented menu designs using Figma, C# Scripts, and Unity Game Engine.',
    media: '/soul-of-the-forest.mp4',
    link: 'https://store.steampowered.com/app/2877660/Soul_of_the_Forest/',
    autoplayVideo: true
  },
  {
    id: 'tennis-analytics',
    title: 'CV Tennis Analytics',
    roleTag: 'Computer Vision',
    technologies: ['React', 'FastAPI', 'YOLOv8', 'PyTorch', 'D3.js'],
    summary:
      'Full-stack sports analytics with React dashboard and FastAPI—YOLOv8 and PyTorch on match footage.',
    metaLine: '2025 • React • FastAPI • YOLOv8 • PyTorch • D3.js',
    description:
      'Full-stack sports analytics platform with React dashboard and FastAPI backend processing match footage using custom YOLOv8 and PyTorch models. Designed RESTful APIs serving real-time analysis endpoints with PostgreSQL storing match statistics.',
    detailText:
      'I built the full path from raw match footage to usable analysis: a browser dashboard for uploads, a FastAPI layer for orchestration, and a CV pipeline that turned detections into rally-level stats and tactical feedback. The product goal was speed and clarity, so players could move from video to insight without touching a notebook or labeling tool.'
  },
  {
    id: 'dance-ar',
    title: 'Dance AR',
    roleTag: 'Game Dev',
    technologies: ['Next.js', 'MediaPipe', 'WebRTC', 'Firebase', 'GCP'],
    summary: 'AR fitness platform analyzing movement against choreography using MediaPipe pose estimation.',
    metaLine: '2025 • Next.js • MediaPipe • WebRTC • Firebase • GCP',
    description:
      'Full-stack AR fitness platform analyzing movement against choreography using MediaPipe pose estimation. Engineered RESTful API handling real-time WebRTC streams and movement scoring algorithms. Deployed via CI/CD on GCP.',
    detailText: 'Shipped real-time pose feedback and score overlays, focused on responsiveness and user motivation loops.'
  },
  {
    id: 'jobsim-vr',
    title: 'JobSim VR',
    roleTag: 'Game Dev',
    technologies: ['Unreal Engine 5', 'Blueprints', 'C++'],
    summary:
      'Corporate life simulator in VR—NPCs, head-tracking, dialogue, and a Severance-inspired Macrodata Refinement Room.',
    metaLine: '2024 • Unreal Engine 5 • Blueprints • C++',
    description:
      "Corporate life simulator featuring NPCs with dynamic behaviors, head-tracking, movement, and dialogue. Designed 'Severance'-inspired Macrodata Refinement Room with interactable components and immersive VR environment. Featured in UMich Game Design Showcase.",
    detailText:
      'This project was about making a strange office space feel alive in VR. I focused on interaction design, NPC behavior, and environmental pacing so the world stayed readable and uncanny at the same time, with enough system depth that the player could explore, observe, and feel the room reacting back.',
    youtubeUrl: 'https://youtu.be/EPbTNA2fU0g',
    github: 'https://github.com/kumarannathan/JobSimVR'
  },
  {
    id: 'ann-arbor-go',
    title: 'AnnArborGo',
    roleTag: 'Location AR',
    technologies: ['Unreal Engine 5', 'AR', 'GPS', 'Blueprints', 'C++'],
    summary:
      'Location-based AR game—virtual tree planting, landmarks, eco-defense, GPS navigation, and squirrel encounters.',
    metaLine: '2024 • Unreal Engine 5 • AR • GPS • Blueprints • C++',
    description:
      'Location-based AR game promoting environmental stewardship through virtual tree planting, landmark exploration, and eco-defense mechanics. Features Environmental Achievement Recognition System with eco-medals, GPS landmark navigation, interactive history reveals, and dynamic squirrel encounters requiring strategic acorn-throwing defense.',
    detailText:
      'I treated AnnArborGo as a city-scale progression system, combining GPS movement, landmark discovery, and lightweight AR interactions into something that felt playful instead of purely educational. The core challenge was balancing exploration, reward loops, and local context so the experience felt grounded in Ann Arbor rather than like a generic location game.',
    github: 'https://github.com/kumarannathan/AnnArborGo'
  },
  {
    id: 'focus-zone',
    title: 'CV Distraction Tracker',
    roleTag: 'MediaPipe',
    technologies: ['React', 'TypeScript', 'MediaPipe', 'Computer Vision'],
    summary:
      'Computer vision-powered focus tracking with MediaPipe face mesh—hand gestures and real-time distraction detection.',
    metaLine: '2025 • React • TypeScript • MediaPipe • Computer Vision',
    description:
      'Computer vision-powered focus tracking application using MediaPipe face mesh detection. Features hand gesture controls and real-time distraction detection.',
    detailText:
      'Focus Zone started as a practical browser tool for staying locked in during deep work. I built low-latency face and gesture tracking in the client, then layered in distraction signals and simple controls so the system could react in real time without feeling heavy or invasive. It is the same kind of CV loop I want to revisit later with stronger video-driven UX.',
    github: 'https://github.com/kumarannathan/cv-distraction-tracker'
  }
];

const motionEase = [0.22, 1, 0.36, 1] as const;

const Projects: React.FC = () => {
  const [focusId, setFocusId] = useState<string | null>(null);

  const focused = focusId ? PROJECTS.find((p) => p.id === focusId) : null;

  useEffect(() => {
    if (focusId) {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [focusId]);

  return (
    <section className="projects-section" id="projects">
      <h2 className="projects-section-title">Side Projects</h2>

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
                  <p className="projects-card__desc">{project.summary ?? project.description}</p>
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
    </section>
  );
};

export default Projects;
