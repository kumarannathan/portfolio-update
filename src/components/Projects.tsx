import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Projects.css';

type ProjectTagTone =
  | 'lobster'
  | 'blue'
  | 'amber'
  | 'green'
  | 'cyan'
  | 'violet'
  | 'lime'
  | 'indigo'
  | 'rose';

interface ProjectTag {
  label: string;
  tone: ProjectTagTone;
}

interface Project {
  id: string;
  date: string;
  title: string;
  category: string;
  description: string;
  details: string;
  tag?: ProjectTag;
  /** Optional expanded copy for text-only detailed cards */
  detailText?: string;
  /** Optional single asset for detailed view: one video, one image, or none */
  media?: string;
  technologies?: string[];
  link?: string;
  github?: string;
  /** When set, detailed-view video autoplays (muted + loop; browser autoplay policy) */
  autoplayVideo?: boolean;
  /** Optional structured bullets under the main description */
  highlights?: string[];
  /** Optional second bullet list (no visible section title in UI) */
  agentsSection?: { items: string[] };
  /** Overrides joined technologies for the tech line when present */
  techSummary?: string;
}

function isVideoMediaSrc(src: string): boolean {
  const cleaned = src.toLowerCase().split('?')[0].split('#')[0];
  return cleaned.endsWith('.mp4') || cleaned.endsWith('.webm') || cleaned.endsWith('.ogg');
}

/** CRA `public/` files — respect `PUBLIC_URL` when the app is hosted under a subpath */
function publicAssetUrl(path: string): string {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

function hasProjectBullets(project: Project): boolean {
  const hl = project.highlights?.length ?? 0;
  const ag = project.agentsSection?.items?.length ?? 0;
  return hl > 0 || ag > 0;
}

function hasProjectDetailContent(project: Project): boolean {
  return Boolean(project.media) || Boolean(project.detailText) || Boolean(project.details) || hasProjectBullets(project);
}

const Projects: React.FC = () => {
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([]);
  const [detailedView, setDetailedView] = useState<boolean>(false);
  const [activeDetailedProjectId, setActiveDetailedProjectId] = useState<string>('');
  /** After left-side layout finishes entering; drives media pop-up */
  const [detailMediaRevealed, setDetailMediaRevealed] = useState<boolean>(false);
  /** True only while left layout is animating in (panel stays hidden until this ends) */
  const [detailLayoutEntering, setDetailLayoutEntering] = useState<boolean>(false);
  /** True while media is popping down before layout exit runs */
  const [detailExitInProgress, setDetailExitInProgress] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  /** Media-ready gate per project so bullets wait for the asset to load */
  const [detailMediaReadyByProject, setDetailMediaReadyByProject] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLElement | null>(null);
  const projectRefs = useRef<Record<string, HTMLElement | null>>({});
  const detailEnterTimeoutRef = useRef<number | null>(null);
  const detailExitTimeoutRef = useRef<number | null>(null);
  const detailSnapTimeoutRef = useRef<number | null>(null);
  const detailAutoScrollingRef = useRef(false);
  /** Must match --detail-layout-enter-ms / --detail-media-pop-ms in Projects.css */
  const LAYOUT_ENTER_MS = 2000;
  const MEDIA_POP_MS = 520;

  const projectsData = useMemo<Project[]>(() => [
    {
      id: "milo-mission-control",
      date: "2026",
      title: "Milo — Mission Control",
      category: "ai",
      description:
        "Run a fleet of specialized AI agents from one Mission Control dashboard—live status, shared memory, and a task bus you can actually watch instead of guessing what your bots are doing. I wired end-to-end pipelines from research and drafts through publish and social, with Milo orchestrating handoffs across agents in production. The whole stack is serverless APIs plus Supabase-backed state, tuned so cheap local inference (Ollama) keeps monthly costs trivial until you need to scale.",
      details: "Multi-agent task queues, Mission Control UI, Netlify Functions, Ollama cost optimization.",
      technologies: ["React", "Netlify Functions", "Supabase", "Python", "Ollama", "RapidAPI"],
      highlights: [
        "Built a multi-agent architecture orchestrated via shared task queues and memory (Supabase)",
        "Designed a Mission Control UI (React) to visualize agent status, activity feeds, and pipelines in real time",
        "Implemented a serverless backend (Netlify Functions) for agent communication, logging, and coordination",
        "Optimized for low-cost local inference (Ollama) with ~$1.50/month API usage (option to scale with paid models)"
      ],
      agentsSection: {
        items: [
          "Trade Bot: Tracks Polymarket activity and auto-researches positions/trends",
          "Competitor Intelligence Bot: Monitors tweets, news, and trends based on brand configs using RapidAPI + Clawdbot",
          "Content Pipeline Agents: End-to-end automation (research → draft → optimize → publish) across multiple specialized bots",
          "Orchestrator (Milo): Manages task scheduling, agent coordination, and pipeline execution via shared agent_tasks"
        ]
      },
      tag: { label: "OpenClaw", tone: "lobster" },
      techSummary: "React, Netlify Functions, Supabase, Python, Ollama, RapidAPI",
      media: "/milo.mp4",
      autoplayVideo: true
    },
    {
      id: "sipt",
      date: "2026",
      title: "Sipt",
      category: "fullstack",
      description: "Letterboxd for specialty coffee. Existing coffee loggers help you track brews privately, but they stop short of discovery, taste identity, and community. Sipt adds the social layer: log coffees with a 3-axis rating across Enjoyment, Balance, and Clarity, follow people whose taste you trust, and build a profile that actually says something about what you like.",
      details: "I designed the rating system, social discovery loop, and product direction for a coffee-first consumer app.",
      tag: { label: "Mobile", tone: "blue" },
      technologies: ["React", "React Native", "TypeScript", "Mobile Development"],
      techSummary: "React, React Native, TypeScript, mobile development",
      media: "/videos/coffee.mp4",
      autoplayVideo: true
    },
    {
      id: "booking-platform",
      date: "2025",
      title: "Startup Booking Platform",
      category: "fullstack",
      description: "Full-stack booking platform with TypeScript/React frontend and Node.js/Express backend handling 100+ monthly reservations with PostgreSQL managing relational customer and availability data. Built RESTful API layer with automated email notifications and JWT authentication.",
      details: "I designed the booking flow, reservation APIs, and admin operations tooling with an emphasis on reliability and speed.",
      tag: { label: "Frontend", tone: "amber" },
      technologies: ["React", "Node.js", "Express", "PostgreSQL", "JWT"],
      media: "/mtm.mp4",
      autoplayVideo: true
    },
    {
      id: "soul-forest",
      date: "2023",
      title: "Soul of the Forest",
      category: "game development",
      description: "Directed UI/UX department for commercial game development, establishing development timelines using Jira, Confluence, and Git. Led comprehensive playtesting and implemented menu designs using Figma, C# Scripts, and Unity Game Engine.",
      details: "Owned UI/UX quality across gameplay systems and coordinated QA with production for consistent releases.",
      tag: { label: "Game Dev", tone: "green" },
      technologies: ["Unity", "C#", "Figma", "Jira", "Git"],
      media: "/soul-of-the-forest.mp4",
      link: "https://store.steampowered.com/app/2877660/Soul_of_the_Forest/",
      autoplayVideo: true
    },
    {
      id: "tennis-analytics",
      date: "2025", 
      title: "CV Tennis Analytics",
      category: "ai",
      description: "Full-stack sports analytics platform with React dashboard and FastAPI backend processing match footage using custom YOLOv8 and PyTorch models. Designed RESTful APIs serving real-time analysis endpoints with PostgreSQL storing match statistics.",
      details: "Built the model-to-dashboard loop so users can upload footage and quickly see tactical insights.",
      tag: { label: "Computer Vision", tone: "cyan" },
      detailText: "I built the full path from raw match footage to usable analysis: a browser dashboard for uploads, a FastAPI layer for orchestration, and a CV pipeline that turned detections into rally-level stats and tactical feedback. The product goal was speed and clarity, so players could move from video to insight without touching a notebook or labeling tool.",
      technologies: ["React", "FastAPI", "YOLOv8", "PyTorch", "D3.js"],
    },
    {
      id: "dance-ar",
      date: "2025",
      title: "Dance AR",
      category: "ar/vr",
      description: "Full-stack AR fitness platform analyzing movement against choreography using MediaPipe pose estimation. Engineered RESTful API handling real-time WebRTC streams and movement scoring algorithms. Deployed via CI/CD on GCP.",
      details: "Shipped real-time pose feedback and score overlays, focused on responsiveness and user motivation loops.",
      tag: { label: "Game Dev", tone: "green" },
      technologies: ["Next.js", "MediaPipe", "WebRTC", "Firebase", "GCP"],
    },
    {
      id: "jobsim-vr",
      date: "2024",
      title: "JobSim VR",
      category: "ar/vr",
      description: "Corporate life simulator featuring NPCs with dynamic behaviors, head-tracking, movement, and dialogue. Designed 'Severance'-inspired Macrodata Refinement Room with interactable components and immersive VR environment. Featured in UMich Game Design Showcase.",
      details: "Implemented immersive interactions and pacing systems to make the simulation feel cohesive and reactive.",
      tag: { label: "Game Dev", tone: "green" },
      detailText: "This project was about making a strange office space feel alive in VR. I focused on interaction design, NPC behavior, and environmental pacing so the world stayed readable and uncanny at the same time, with enough system depth that the player could explore, observe, and feel the room reacting back.",
      technologies: ["Unreal Engine 5", "Blueprints", "C++"],
    },
    {
      id: "ann-arbor-go",
      date: "2024",
      title: "AnnArborGo",
      category: "ar/vr",
      description: "Location-based AR game promoting environmental stewardship through virtual tree planting, landmark exploration, and eco-defense mechanics. Features Environmental Achievement Recognition System with eco-medals, GPS landmark navigation, interactive history reveals, and dynamic squirrel encounters requiring strategic acorn-throwing defense.",
      details: "Designed map-based progression and AR interactions that encourage exploration with clear reward loops.",
      tag: { label: "Location AR", tone: "lime" },
      detailText: "I treated AnnArborGo as a city-scale progression system, combining GPS movement, landmark discovery, and lightweight AR interactions into something that felt playful instead of purely educational. The core challenge was balancing exploration, reward loops, and local context so the experience felt grounded in Ann Arbor rather than like a generic location game.",
      technologies: ["Unreal Engine 5", "AR", "GPS", "Blueprints", "C++"],
    },
    {
      id: "focus-zone",
      date: "2025",
      title: "Focus Zone",
      category: "cv",
      description: "Computer vision-powered focus tracking application using MediaPipe face mesh detection. Features hand gesture controls and real-time distraction detection.",
      details: "Built low-latency visual tracking and interaction controls directly in the browser for daily productivity use.",
      tag: { label: "MediaPipe", tone: "blue" },
      detailText: "Focus Zone started as a practical browser tool for staying locked in during deep work. I built low-latency face and gesture tracking in the client, then layered in distraction signals and simple controls so the system could react in real time without feeling heavy or invasive. It is the same kind of CV loop I want to revisit later with stronger video-driven UX.",
      technologies: ["React", "TypeScript", "MediaPipe", "Computer Vision"],
    },
    {
      id: "meeting-summarizer",
      date: "2025",
      title: "Smart Meeting Summarizer",
      category: "ai",
      description: "Meeting intelligence app that transcribes audio, extracts chapters, and detects attendees automatically using FastAPI and OpenAI/AssemblyAI.",
      details: "Focused on practical output formatting and summary quality so teams can act on notes immediately.",
      tag: { label: "Voice AI", tone: "amber" },
      technologies: ["React", "TypeScript", "FastAPI", "Python", "AssemblyAI"],
    },
    {
      id: "studyai",
      date: "2024",
      title: "StudyAI",
      category: "ai",
      description: "AI-powered learning platform using Next.js and TypeScript that leverages multiple AI APIs to generate flashcards and quizzes.",
      details: "Designed content-to-practice workflows to help students convert notes into active recall sessions quickly.",
      tag: { label: "EdTech", tone: "rose" },
      technologies: ["Next.js", "TypeScript", "Prisma", "OpenAI"],
    }
  ], []);

  const tagFilters = useMemo(
    () => [
      { label: 'All', value: 'all', tone: null as ProjectTagTone | null },
      ...projectsData.reduce<{ label: string; value: string; tone: ProjectTagTone }[]>((filters, project) => {
        if (!project.tag) return filters;
        if (filters.some((filter) => filter.value === project.tag?.label)) return filters;
        return [...filters, { label: project.tag.label, value: project.tag.label, tone: project.tag.tone }];
      }, [])
    ],
    [projectsData]
  );

  const filteredProjects = useMemo(
    () => (
      activeTagFilters.length === 0
        ? projectsData
        : projectsData.filter((project) => (
            project.tag ? activeTagFilters.includes(project.tag.label) : false
          ))
    ).slice(0, 10),
    [activeTagFilters, projectsData]
  );

  useEffect(() => {
    setActiveDetailedProjectId(filteredProjects[0]?.id ?? '');
  }, [activeTagFilters, filteredProjects]);

  useEffect(() => {
    if (!detailedView || filteredProjects.length === 0) return;
    const firstProjectId = filteredProjects[0].id;
    const t = window.setTimeout(() => {
      scrollToProject(firstProjectId);
    }, 80);
    return () => window.clearTimeout(t);
  }, [detailedView, filteredProjects]);

  const markProjectMediaReady = (projectId: string) => {
    setDetailMediaReadyByProject((current) =>
      current[projectId] ? current : { ...current, [projectId]: true }
    );
  };

  useEffect(() => {
    if (!detailedView) return;

    const updateActiveProject = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestId = filteredProjects[0]?.id ?? '';
      let closestDistance = Number.POSITIVE_INFINITY;

      filteredProjects.forEach((project) => {
        const el = projectRefs.current[project.id];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const projectCenter = rect.top + rect.height / 2;
        const distance = Math.abs(projectCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = project.id;
        }
      });

      if (closestId) {
        setActiveDetailedProjectId((current) => (current === closestId ? current : closestId));
      }
    };

    const snapToNearestProject = () => {
      if (detailAutoScrollingRef.current) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

      const targetId = filteredProjects.reduce(
        (closestId, project) => {
          const el = projectRefs.current[project.id];
          if (!el) return closestId;
          const viewportCenter = window.innerHeight / 2;
          const projectRect = el.getBoundingClientRect();
          const projectCenter = projectRect.top + projectRect.height / 2;
          const closestEl = projectRefs.current[closestId];
          const closestCenter = closestEl
            ? closestEl.getBoundingClientRect().top + closestEl.getBoundingClientRect().height / 2
            : viewportCenter;
          return Math.abs(projectCenter - viewportCenter) < Math.abs(closestCenter - viewportCenter)
            ? project.id
            : closestId;
        },
        filteredProjects[0]?.id ?? ''
      );

      if (!targetId) return;
      const target = projectRefs.current[targetId];
      if (!target) return;
      const targetRect = target.getBoundingClientRect();
      const threshold = window.innerHeight * 0.5;
      if (Math.abs(targetRect.top + targetRect.height / 2 - window.innerHeight / 2) < threshold) {
        detailAutoScrollingRef.current = true;
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        window.setTimeout(() => {
          detailAutoScrollingRef.current = false;
        }, 420);
      }
    };

    const onScroll = () => {
      updateActiveProject();
      if (detailSnapTimeoutRef.current !== null) {
        window.clearTimeout(detailSnapTimeoutRef.current);
      }
      detailSnapTimeoutRef.current = window.setTimeout(() => {
        snapToNearestProject();
        detailSnapTimeoutRef.current = null;
      }, 120);
    };

    updateActiveProject();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const rafId = window.requestAnimationFrame(updateActiveProject);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (detailSnapTimeoutRef.current !== null) {
        window.clearTimeout(detailSnapTimeoutRef.current);
        detailSnapTimeoutRef.current = null;
      }
    };
  }, [detailedView, filteredProjects]);

  const scrollToProject = (projectId: string) => {
    const target = projectRefs.current[projectId];
    if (!target) return;
    detailAutoScrollingRef.current = true;
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    setActiveDetailedProjectId(projectId);
    window.setTimeout(() => {
      detailAutoScrollingRef.current = false;
    }, 420);
  };

  useEffect(() => () => {
    if (detailEnterTimeoutRef.current !== null) {
      window.clearTimeout(detailEnterTimeoutRef.current);
    }
    if (detailExitTimeoutRef.current !== null) {
      window.clearTimeout(detailExitTimeoutRef.current);
    }
  }, []);

  const toggleDetailedView = () => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (detailedView) {
      if (detailEnterTimeoutRef.current !== null) {
        window.clearTimeout(detailEnterTimeoutRef.current);
        detailEnterTimeoutRef.current = null;
      }
      if (detailExitTimeoutRef.current !== null) {
        window.clearTimeout(detailExitTimeoutRef.current);
      }
      if (reduceMotion) {
        setDetailMediaRevealed(false);
        setDetailLayoutEntering(false);
        setDetailedView(false);
        setDetailExitInProgress(false);
        return;
      }
      /* 1) Pop media down (panel stays visible), 2) then collapse left layout */
      setDetailLayoutEntering(false);
      setDetailMediaRevealed(false);
      setDetailExitInProgress(true);
      detailExitTimeoutRef.current = window.setTimeout(() => {
        setDetailedView(false);
        setDetailExitInProgress(false);
        detailExitTimeoutRef.current = null;
      }, MEDIA_POP_MS);
      return;
    }

    if (detailExitTimeoutRef.current !== null) {
      window.clearTimeout(detailExitTimeoutRef.current);
      detailExitTimeoutRef.current = null;
    }
    if (detailEnterTimeoutRef.current !== null) {
      window.clearTimeout(detailEnterTimeoutRef.current);
    }

    if (reduceMotion) {
      setDetailedView(true);
      setDetailLayoutEntering(false);
      setDetailMediaRevealed(true);
      return;
    }

    /* 1) Left layout animates, 2) then media pops up */
    setDetailedView(true);
    setDetailLayoutEntering(true);
    setDetailMediaRevealed(false);
    detailEnterTimeoutRef.current = window.setTimeout(() => {
      setDetailLayoutEntering(false);
      setDetailMediaRevealed(true);
      detailEnterTimeoutRef.current = null;
    }, LAYOUT_ENTER_MS);
  };

  const renderFilterControl = (isDetailedOverlay = false) => (
    <div className={`filter-inline${isDetailedOverlay ? ' filter-inline--overlay' : ''}`}>
      <button
        className="filter-main-btn"
        onClick={() => setFiltersOpen((value) => !value)}
      >
        Filters
      </button>
      <div className={`filter-options-rail ${filtersOpen ? 'open' : ''}`}>
        {tagFilters.map((filter) => (
          <button
            key={filter.value}
            className={`filter-tag-btn${(filter.value === 'all' ? activeTagFilters.length === 0 : activeTagFilters.includes(filter.value)) ? ' is-active' : ''}${filter.tone ? ` project-chip project-chip--${filter.tone}` : ' filter-tag-btn--all'}`}
            aria-label={filter.label}
            title={filter.label}
            onClick={() => {
              if (filter.value === 'all') {
                setActiveTagFilters([]);
                return;
              }

              setActiveTagFilters((current) => (
                current.includes(filter.value)
                  ? current.filter((value) => value !== filter.value)
                  : [...current, filter.value]
              ));
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section
      className={`projects-section-new ${detailedView ? 'detailed-active' : ''}`}
      id="projects"
      ref={sectionRef}
    >
      <h2 className="projects-section-title">Side Projects</h2>
      <div className="projects-filter-row">
        {!detailedView && renderFilterControl()}
        {!detailedView && (
          <button
            className="detail-view-toggle"
            onClick={toggleDetailedView}
            disabled={detailExitInProgress}
          >
            Detailed view
          </button>
        )}
      </div>

      {detailedView && (
        <div className={`detail-view-controls${!detailExitInProgress ? ' is-visible' : ''}`}>
          <div className="detail-view-controls-left">
            {renderFilterControl(true)}
          </div>
          <button
            type="button"
            className="detail-view-leave-btn"
            onClick={toggleDetailedView}
            disabled={!detailMediaRevealed || detailExitInProgress}
          >
            Leave detailed view
          </button>
        </div>
      )}

      <div
        className={`projects-layout ${detailedView ? 'is-detailed' : ''} ${detailLayoutEntering ? 'detail-layout-entering' : ''} ${detailedView && detailMediaRevealed ? 'detail-media-revealed' : ''}`}
      >
        <div className="projects-grid projects-grid-vertical">
        {filteredProjects.map((project) => {
          const projectHasBullets = hasProjectBullets(project);
          const projectHasDetailContent = hasProjectDetailContent(project);
          const projectMediaReady = !project.media || Boolean(detailMediaReadyByProject[project.id]);
          const isSmallPortraitMedia = project.id === 'sipt';
          return (
          <article
            key={project.id}
            className={`project-card${detailedView && projectHasDetailContent ? ' project-card--with-detail-side' : ''}${detailedView && activeDetailedProjectId === project.id ? ' is-active' : ''}`}
            ref={(el) => {
              projectRefs.current[project.id] = el;
            }}
          >
            <div className="project-row-meta">{project.date}</div>
            <div className="project-card-body">
              <div className="project-card-title-row">
                <h3 className="project-card-title">
                  {project.link ? (
                    <a
                      href={project.link}
                      className="project-card-title-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                {project.tag && (
                  <span className={`project-chip project-chip--${project.tag.tone}`}>
                    {project.tag.label}
                  </span>
                )}
              </div>
              <p className="project-card-description">{project.description}</p>
              <p className="project-card-tech">
                {(() => {
                  const techLine = project.techSummary
                    ? project.techSummary
                    : project.technologies?.join(' • ') ?? '';
                  return detailedView ? `${project.date} • ${techLine}` : techLine;
                })()}
              </p>
            </div>
            {detailedView && projectHasDetailContent && (
              <div className={`project-card-detail-side${projectHasBullets ? ' project-card-detail-side--has-bullets' : ''}`}>
                <div className={`detail-media-shell${isSmallPortraitMedia ? ' detail-media-shell--portrait' : ''}`}>
                  <div className="detail-media-dim" aria-hidden />
                  {project.media && (
                    <div className="detail-media-inner">
                      <div className={`detail-media-frame${isSmallPortraitMedia ? ' detail-media-frame--portrait-small' : ''}`}>
                        {isVideoMediaSrc(project.media) ? (
                          <video
                            key={`${project.id}-media`}
                            src={publicAssetUrl(project.media)}
                            className={`detail-media-item detail-media-item--video${isSmallPortraitMedia ? ' detail-media-item--portrait' : ''}`}
                            controls
                            playsInline
                            muted={Boolean(project.autoplayVideo)}
                            autoPlay={Boolean(project.autoplayVideo)}
                            loop={Boolean(project.autoplayVideo)}
                          onLoadedData={() => markProjectMediaReady(project.id)}
                          onCanPlay={() => markProjectMediaReady(project.id)}
                          onError={() => markProjectMediaReady(project.id)}
                          />
                        ) : (
                          <img
                            key={`${project.id}-media`}
                            src={publicAssetUrl(project.media)}
                            alt={project.title}
                            className="detail-media-item detail-media-item--image"
                          onLoad={() => markProjectMediaReady(project.id)}
                          onError={() => markProjectMediaReady(project.id)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {!project.media && (project.detailText || project.details) && (
                    <div className="detail-text-panel">
                      <p className="detail-text-panel-copy">{project.detailText ?? project.details}</p>
                    </div>
                  )}
                  {projectHasBullets && projectMediaReady && (
                    <div className="detail-panel-bullets-stack">
                      {(project.highlights?.length ?? 0) > 0 && (
                        <ul className="detail-panel-bullets" aria-label={`${project.title} highlights`}>
                          {(project.highlights ?? []).map((line, i) => (
                            <li key={`h-${project.id}-${i}`}>{line}</li>
                          ))}
                        </ul>
                      )}
                      {project.agentsSection &&
                        project.agentsSection.items.length > 0 && (
                          <ul
                            className="detail-panel-bullets detail-panel-bullets--agents"
                            aria-label={`${project.title} additional details`}
                          >
                            {project.agentsSection.items.map((line, i) => (
                              <li key={`a-${project.id}-${i}`}>{line}</li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </article>
          );
        })}
        </div>
        {detailedView && (
          <div className="project-scroll-dots" aria-label="Project positions">
            {filteredProjects.map((project) => (
              <button
                key={`dot-${project.id}`}
                type="button"
                className={`project-scroll-dot${activeDetailedProjectId === project.id ? ' is-active' : ''}`}
                aria-label={`Jump to ${project.title}`}
                aria-pressed={activeDetailedProjectId === project.id}
                onClick={() => scrollToProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;