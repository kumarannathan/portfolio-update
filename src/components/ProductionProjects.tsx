import React, { useCallback, useEffect, useState } from 'react';
import './ProductionProjects.css';
import { PRODUCTION_PROJECTS } from '../site/data/productionEntries';
import type { ProductionLink } from '../site/data/productionEntries';


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
