import React, { useState, useEffect } from 'react';
import './CreativePageNew.css';
import logo from '../assets/logo.png';
import { photoProjects, Project } from '../data/photos';

const StarsIcon = () => (
    <div className="floating-element stars">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="currentColor">
            <path d="M10 0L13 7L20 10L13 13L10 20L7 13L0 10L7 7L10 0Z" transform="translate(0, 0) scale(0.5)" />
            <path d="M10 0L13 7L20 10L13 13L10 20L7 13L0 10L7 7L10 0Z" transform="translate(30, 20) scale(0.3)" />
            <path d="M10 0L13 7L20 10L13 13L10 20L7 13L0 10L7 7L10 0Z" transform="translate(10, 40) scale(0.2)" />
        </svg>
    </div>
);

const GrainyCircle = () => (
    <div className="floating-element" style={{
        bottom: '0%',
        right: '-50px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)',
        opacity: 0.1,
    }} />
);

interface CreativePageNewProps {
    onSlideBack: () => void;
}

const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
    const formattedSrc = src.includes(' ') && !src.includes('%20') ? encodeURI(src) : src;

    return (
        <div className="grid-item">
            <img
                loading="lazy"
                src={formattedSrc}
                alt={alt}
                draggable={false}
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}
                style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                }}
            />
        </div>
    );
};

const ProjectItem = ({
    project,
    isExpanded,
    onToggle
}: {
    project: Project;
    isExpanded: boolean;
    onToggle: () => void
}) => {
    const [hasBeenOpened, setHasBeenOpened] = useState(false);

    useEffect(() => {
        if (isExpanded) setHasBeenOpened(true);
    }, [isExpanded]);

    const shouldRenderContent = isExpanded || hasBeenOpened;

    return (
        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
            <div className="name-block project-title">
                <span
                    className={project.colorClass}
                    onClick={onToggle}
                    style={{ borderRadius: '6px' }}
                >
                    {project.title}
                </span>
            </div>

            <div className={`photo-grid-container ${isExpanded ? 'expanded' : ''}`}>
                {shouldRenderContent && (
                    <div className="photo-grid">
                        {project.images.map((img, idx) => (
                            <LazyImage key={idx} src={img} alt={`${project.title} ${idx + 1}`} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CreativePageNew: React.FC = () => {
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

    const toggleProject = (id: string) => {
        setExpandedProjectId(prev => prev === id ? null : id);
    };

    return (
        <div className="creative-page-new">
            <div className="container" style={{ paddingTop: '20px' }}>
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: '0' }}>
                    <section style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>


                        <div className="work-section" style={{ marginTop: '3rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '2.5rem', letterSpacing: '0.15em', fontWeight: 700, fontFamily: 'Syne Mono', opacity: 0.6 }}>photography work:</p>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                                {photoProjects.map(p => (
                                    <ProjectItem
                                        key={p.id}
                                        project={p}
                                        isExpanded={expandedProjectId === p.id}
                                        onToggle={() => toggleProject(p.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                <GrainyCircle />

                <footer style={{ marginTop: 'auto', padding: '6rem 0 3rem', display: 'flex', justifyContent: 'center', opacity: 0.2 }}>
                    <img src={logo} alt="Logo" style={{ height: '30px', objectFit: 'contain', cursor: 'none' }} />
                </footer>
            </div>
        </div>
    );
}

export default CreativePageNew;
