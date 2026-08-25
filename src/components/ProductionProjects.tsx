import React, { useCallback, useEffect, useState } from 'react';
import './ProductionProjects.css';

const YOGGER_CRM_IMAGES = [
  '/projects/yogger-crm/profile.png',
  '/projects/yogger-crm/subscription.png',
  '/projects/yogger-crm/journey.png',
  '/projects/yogger-crm/trials.png',
];

type ProductionLink = {
  label: string;
  href: string;
};

type ProductionHighlight = {
  title: string;
  detail: string;
};

type ProductionProject = {
  id: string;
  title: string;
  roleTag?: string;
  summary: string;
  lead: string;
  highlights: ProductionHighlight[];
  technologies: string;
  images?: string[];
  links?: ProductionLink[];
};

const PRODUCTION_PROJECTS: ProductionProject[] = [
  {
    id: 'yogger-crm',
    title: 'CRM @ Yogger',
    roleTag: 'Production',
    summary: 'Internal CRM and admin platform for support, sales, and customer success',
    lead:
      "Architected and built Yogger's internal operations platform in React and TypeScript — 60+ components spanning deal pipelines, form submissions, support ticketing, and user/org management — replacing manual sales tracking with a single operator surface used daily across support, sales, and CS.",
    highlights: [
      {
        title: 'Deal pipeline & form submissions',
        detail:
          "inbound demo and trial requests flow through a staged pipeline, so sales sees every lead's state at a glance instead of digging through raw form data.",
      },
      {
        title: 'User & org management',
        detail:
          'search accounts, inspect coach/athlete relationships, resolve team-access issues, and adjust subscriptions and entitlements in place, with changes reflected instantly on iOS, Android, and web.',
      },
      {
        title: 'Config-driven segmentation engine',
        detail:
          "designed a segmentation layer over flattened Firestore queries that seeds bounded pool queries from indexable fields, working around Firestore's lack of full-text and dynamic OR search to support 20+ filterable fields.",
      },
      {
        title: 'Org KPI dashboards',
        detail:
          'clinic-trial progress tracking and UTM attribution built on scheduled Cloud Functions rollups, turning raw event streams into queryable cohort and funnel views.',
      },
    ],
    technologies: 'React · TypeScript · Firebase (Firestore, Auth, Cloud Functions) · scheduled rollup jobs',
    images: YOGGER_CRM_IMAGES,
  },
  {
    id: 'saml-sso',
    title: 'Enterprise SAML SSO',
    roleTag: 'Platform',
    summary: 'Single sign-on across web, Android, and iOS — the unlock for our first enterprise customer',
    lead:
      "Owned enterprise SAML SSO end-to-end on Firebase Identity Platform, covering multi-tenant provider resolution, user provisioning, and a web auth bridge that brings the same flow to both mobile clients. Landed Sanford Health (47,000 employees) as Yogger's first enterprise customer.",
    highlights: [
      {
        title: 'Multi-tenant resolution',
        detail:
          'routes each sign-in to the correct identity provider so a single deployment serves many enterprise tenants.',
      },
      {
        title: 'Just-in-time provisioning',
        detail:
          'creates and links accounts on first login and maps them into the right org, no manual onboarding step.',
      },
      {
        title: 'Cross-platform auth bridge',
        detail:
          'a shared web-based flow the Android and iOS clients hand off to, keeping one implementation instead of three divergent native ones.',
      },
    ],
    technologies: 'Firebase Identity Platform · SAML 2.0 · TypeScript · Kotlin · Swift',
  },
  {
    id: 'rag-gemini',
    title: 'RAG AI Assessment Summaries',
    roleTag: 'AI',
    summary: 'Grounded, clinically-sourced AI summaries for movement assessments',
    lead:
      'Shipped a retrieval-augmented summary feature that turns raw assessment scores into readable clinical narratives, grounded in an 18-document knowledge base spanning 14 assessment types — so output cites real source material instead of improvising.',
    highlights: [
      {
        title: 'Retrieval over a curated corpus',
        detail:
          'Gemini File Search retrieves the relevant clinical passages per assessment type; generation runs on Firebase Cloud Functions and is grounded in what comes back.',
      },
      {
        title: 'Hash-diffed sync CLI',
        detail:
          'custom tooling that diffs content hashes and pushes only what changed, making knowledge-base updates a single command instead of a manual re-upload.',
      },
      {
        title: 'Offline prompt eval harness',
        detail:
          'prompt changes are scored against a fixed set of cases before shipping, so regressions get caught off the critical path.',
      },
      {
        title: 'Layered fallbacks & caching',
        detail:
          'tiered retrieval and quota fallbacks keep the feature available under load; prompt-version plus content-hash caching on the iOS client avoids paying for identical generations twice.',
      },
    ],
    technologies: 'Google Gemini (File Search) · Firebase Cloud Functions · Node.js CLI tooling · Swift',
  },
  {
    id: 'movement-age',
    title: 'Movement Age & the Android Assessment Engine',
    roleTag: 'Mobile',
    summary: "Yogger's flagship assessment product, shipped end-to-end on Android",
    lead:
      "Built Movement Age — the company's flagship assessment — end-to-end in Kotlin, raising average session engagement 40% in the 10 weeks after launch.",
    highlights: [
      {
        title: 'Rebuilt assessment engine',
        detail:
          'directional joint trackers, phase state machines, calibration checks, and signal-quality flags across 12+ assessments, improving capture reliability and bringing Android scores in line with iOS.',
      },
      {
        title: 'UI overhaul across 25+ screens',
        detail:
          'tab bar, role-based dashboards, progress, library, and assessment creation, with localization, paging, and caching throughout. MAU grew 2× to a 16.8K peak over the same period.',
      },
      {
        title: 'Clearer results experience',
        detail:
          'score breakdowns that lead with the takeaway, expandable component cards that collapse a long scroll into a scannable overview, and a lighter visual system that keeps attention on the analysis.',
      },
    ],
    technologies: 'Kotlin · Android · Firebase · MediaPipe-style pose tracking',
    images: ['/projects/yogger-mobile/hero.jpg'],
    links: [
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=io.yogger.Yogger&hl=en_NZ',
      },
      {
        label: 'App Store',
        href: 'https://apps.apple.com/us/app/yogger-movement-analysis/id1576592816',
      },
    ],
  },
];

function ProductionLinks({ links }: { links: ProductionLink[] }) {
  return (
    <div className="production-card__links">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="production-card__link"
        >
          {link.label} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

function ProductionGallery({
  images,
  onExpand,
}: {
  images: string[];
  onExpand: (src: string) => void;
}) {
  const isSingle = images.length === 1;

  return (
    <div className={`production-card__gallery${isSingle ? ' production-card__gallery--single' : ''}`}>
      {images.map((src) => (
        <button
          key={src}
          type="button"
          className="production-card__gallery-item"
          onClick={() => onExpand(src)}
          aria-label="Expand image"
        >
          <img src={src} alt="" loading="lazy" />
        </button>
      ))}
    </div>
  );
}

function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="production-lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button type="button" className="production-lightbox__close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <img src={src} alt="" className="production-lightbox__img" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

const ProductionProjects: React.FC = () => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="production-section" id="production-projects">
      <h2 className="production-section-title">Production Projects</h2>

      <div className="production-list">
        {PRODUCTION_PROJECTS.map((project) => {
          const isExpanded = expandedIds.has(project.id);

          return (
            <article
              key={project.id}
              className={`production-card${isExpanded ? ' production-card--expanded' : ''}`}
            >
              <div className="production-card__body">
                <div className="production-card__header">
                  <h3 className="production-card__title">{project.title}</h3>
                  {project.roleTag && (
                    <>
                      <span className="production-card__sep" aria-hidden="true">
                        —
                      </span>
                      <span className="production-card__role">{project.roleTag}</span>
                    </>
                  )}
                </div>
                <p className="production-card__desc">{project.summary}</p>
                <button
                  type="button"
                  className="production-card__expand"
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpanded(project.id)}
                >
                  {isExpanded ? 'Hide details' : 'View details'}
                </button>
              </div>

              <div className={`production-card__details${isExpanded ? ' production-card__details--open' : ''}`}>
                <div className="production-card__details-inner">
                  {project.images && project.images.length > 0 && (
                    <ProductionGallery images={project.images} onExpand={setLightboxSrc} />
                  )}
                  <p className="production-card__lead">{project.lead}</p>
                  <ul className="production-card__highlights">
                    {project.highlights.map((item) => (
                      <li key={item.title}>
                        <strong>{item.title}</strong>
                        <span aria-hidden="true"> — </span>
                        {item.detail}
                      </li>
                    ))}
                  </ul>
                  <p className="production-card__tech">{project.technologies}</p>
                  {project.links && <ProductionLinks links={project.links} />}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {lightboxSrc && <ImageLightbox src={lightboxSrc} onClose={closeLightbox} />}
    </section>
  );
};

export default ProductionProjects;
