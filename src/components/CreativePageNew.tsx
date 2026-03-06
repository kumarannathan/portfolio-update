import React, { useState, useEffect, useRef } from 'react';
import './CreativePageNew.css';
import logo from '../assets/logo.png';
import { photoProjects, Project } from '../data/photos';

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

const HorizontalCarousel = ({ images, title }: { images: string[]; title: string }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId: number;
        let scrollPos = 0;

        const animate = () => {
            scrollPos += 0.8; // Smooth Right-to-Left movement
            if (scrollPos >= scrollContainer.scrollWidth / 2) {
                scrollPos = 0;
            }
            scrollContainer.scrollLeft = scrollPos;
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Double the images for seamless infinite scroll
    const displayImages = [...images, ...images];

    return (
        <div className="horizontal-carousel-wrapper">
            <div className="carousel-track" ref={scrollRef}>
                {displayImages.map((src, idx) => (
                    <div key={idx} className="carousel-item">
                        <img src={src} alt={`${title} ${idx}`} loading="lazy" />
                    </div>
                ))}
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

                        <div className="photography-simple-header">
                            <h2>VISUAL WORKS</h2>
                        </div>

                        <div className={`photography-content-layout ${expandedProjectId ? 'is-expanded' : ''}`}>
                            <div className="collections-nav-horizontal">
                                <p className="collections-label">collections:</p>
                                <div className="titles-row">
                                    {photoProjects.map(p => (
                                        <div
                                            key={p.id}
                                            className={`horizontal-title-item ${expandedProjectId === p.id ? 'active' : ''}`}
                                            onClick={() => toggleProject(p.id)}
                                        >
                                            <span className={p.colorClass}>{p.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {expandedProjectId && (
                                <div className="carousel-side-container">
                                    {photoProjects.find(p => p.id === expandedProjectId) && (
                                        <HorizontalCarousel
                                            images={photoProjects.find(p => p.id === expandedProjectId)!.images}
                                            title={photoProjects.find(p => p.id === expandedProjectId)!.title}
                                        />
                                    )}
                                </div>
                            )}
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
