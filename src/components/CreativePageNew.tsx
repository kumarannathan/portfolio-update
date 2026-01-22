import React, { useState, useEffect } from 'react';
import './CreativePageNew.css';
import logo from '../assets/logo.png';
import JobSimVR from './JobSimVR';

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

interface Project {
    id: string;
    title: string;
    colorClass: string;
    images: string[];
}

interface CreativePageNewProps {
    onSlideBack: () => void;
}

const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
    // Determine if we need to encode the URL (if it contains spaces but isn't already encoded)
    const formattedSrc = src.includes(' ') && !src.includes('%20') ? encodeURI(src) : src;

    return (
        <div className="grid-item">
            <img
                loading="lazy"
                src={formattedSrc}
                alt={alt}
                draggable={false}
                onError={(e) => {
                    console.error('Image failed to load:', formattedSrc);
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.innerText = alt;
                        e.currentTarget.parentElement.style.display = 'flex';
                        e.currentTarget.parentElement.style.alignItems = 'center';
                        e.currentTarget.parentElement.style.justifyContent = 'center';
                        e.currentTarget.parentElement.style.textAlign = 'center';
                        e.currentTarget.parentElement.style.padding = '0.5rem';
                        e.currentTarget.parentElement.style.fontSize = '12px';
                        e.currentTarget.parentElement.style.color = '#888';
                    }
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

const ContactPage = () => (
    <section style={{ position: 'relative', flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', paddingTop: '1rem' }}>

        <div style={{ fontFamily: 'Syne Mono', fontSize: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
            <div>
                <p style={{ opacity: 0.5, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>phone</p>
                <p>+1 248 635 7735</p>
            </div>
            <div>
                <p style={{ opacity: 0.5, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>email</p>
                <a href="mailto:kumarann@umich.edu" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>kumarann@umich.edu</a>
            </div>
            <div>
                <p style={{ opacity: 0.5, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>ig</p>
                <a href="https://instagram.com/kumarannathann" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>@kumarannathann</a>
            </div>
        </div>
    </section>
);

const CreativePageNew: React.FC<CreativePageNewProps> = ({ onSlideBack }) => {
    const [currentView, setCurrentView] = useState<'home' | 'contact' | 'portfolio'>('home');
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExpandedProjectId('newzealand');
        }, 2000); // 2s delay
        return () => clearTimeout(timer);
    }, []);

    const projects: Project[] = [
        {
            id: 'newzealand',
            title: 'NEW ZEALAND',
            colorClass: 'bg-sage',
            images: [
                '/newz/218 - 90 - KUM_0010.jpg',
                '/newz/215 - 87 - KUM_0139.jpg',
                '/newz/205 - 78 - KUM_0204.jpg',
                '/newz/210 - 83 - KUM_0205.jpg',
                '/newz/204 - 77 - KUM_0228.jpg',
                '/newz/188 - 69 - KUM_0229.jpg',
                '/newz/230 - 94 - KUM_0230.jpg',
                '/newz/203 - 76 - KUM_0233-2.jpg',
                '/newz/216 - 88 - KUM_0235.jpg',
                '/newz/200 - 75 - KUM_0254.jpg',
                '/newz/208 - 81 - KUM_0306.jpg'
            ]
        },
        {
            id: 'formula1',
            title: 'FORMULA 1',
            colorClass: 'bg-terracotta',
            images: [
                '/f1/133 - 51 - mclaren1.jpg',
                '/f1/127 - 49 - OGF_0411.jpg',
                '/f1/068 - 15 - OGF_0983.jpg',
                '/f1/071 - 17 - ferrari2.jpg',
                '/f1/085 - 23 - OGF_0276.jpg',
                '/f1/111 - 39 - OGF_0409.jpg',
                '/f1/120 - 43 - OGF_0690.jpg',
                '/f1/116 - 41 - OGF_0275.jpg',
                '/f1/097 - 31 - OGF_0985.jpg',
                '/f1/088 - 25 - OGF_0186.jpg'
            ]
        },
        {
            id: 'mexico',
            title: 'MEXICO',
            colorClass: 'bg-ochre',
            images: [
                '/mexico/130 - Nathan001577-R1-012-4A.jpg',
                '/mexico/156 - Nathan001575-R1-054-25A.jpg',
                '/mexico/039 - Nathan001577-R1-070-33A.jpg',
                '/mexico/052 - Nathan001576-R1-026-11A.jpg',
                '/mexico/223 - CEINE3857.JPG',
                '/mexico/012 - Nathan001577-R1-002-00A.jpg',
                '/mexico/025 - IYIAE9054.JPG',
                '/mexico/043 - CMITE3346.JPG',
                '/mexico/048 - CSPQE3442.JPG',
                '/mexico/055 - Nathan001577-R1-006-1A.jpg',
                '/mexico/064 - Nathan001578-R1-069-33.jpg',
                '/mexico/110 - RWUVE2849.JPG',
                '/mexico/112 - BJFNE5011.JPG',
                '/mexico/150 - Nathan001577-R1-038-17A.jpg',
                '/mexico/152 - Nathan001578-R1-057-27.jpg',
                '/mexico/158 - AYASE7537.JPG',
                '/mexico/234 - EHTBE7503.JPG'
            ]
        },
        {
            id: 'filmfavorites',
            title: 'FILM FAVORITES',
            colorClass: 'bg-dusty-blue',
            images: [
                '/seattle/025 - IYIAE9054.JPG',
                '/seattle/052 - Nathan001576-R1-026-11A.jpg',
                '/seattle/108 - 38 - OGF_0520.jpg',
                '/seattle/150 - Nathan001577-R1-038-17A.jpg',
                '/seattle/165 - Nathan001577-R1-028-12A.jpg'
            ]
        }
    ];

    const toggleProject = (id: string) => {
        setExpandedProjectId(prev => prev === id ? null : id);
    };

    return (
        <div className="creative-page-new">
            <div className="container">
                {/* Header - Unified with Name and Navigation */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '2.5rem 0', position: 'relative' }}>
                    {/* Left Side: Dynamic Page Title with Integrated Logo */}
                    <div
                        onClick={() => setCurrentView('home')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="name-block" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {currentView === 'home' ? (
                                <>
                                    <span>KUMARAN</span>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem' }}>
                                        <span>NATHAN</span>
                                        <img
                                            src={logo}
                                            alt="Logo"
                                            className="header-logo"
                                            style={{ height: '55px', objectFit: 'contain', marginBottom: '0.4rem' }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem' }}>
                                    <span>{currentView.toUpperCase()}</span>
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        className="header-logo"
                                        style={{ height: '55px', objectFit: 'contain', marginBottom: '0.4rem' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Navigation */}
                    <div className="nav-container">
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>

                        <nav className={`desktop-nav ${isMenuOpen ? 'mobile-open' : ''}`} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.8rem',
                            textAlign: 'right',
                            marginTop: '0.5rem'
                        }}>
                            <span onClick={() => { setCurrentView('home'); setIsMenuOpen(false); }} className={`nav-link ${currentView === 'home' ? 'active' : ''}`} style={{ cursor: 'pointer', margin: 0 }}>Home</span>
                            <span onClick={() => { setCurrentView('portfolio'); setIsMenuOpen(false); }} className={`nav-link ${currentView === 'portfolio' ? 'active' : ''}`} style={{ cursor: 'pointer', margin: 0 }}>Portfolio</span>
                            <span onClick={() => { setCurrentView('contact'); setIsMenuOpen(false); }} className={`nav-link ${currentView === 'contact' ? 'active' : ''}`} style={{ cursor: 'pointer', margin: 0 }}>Contact</span>
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: '0' }}>
                    {currentView === 'home' ? (
                        <section style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {/* ... existing home section content */}
                            <div className="sub-header" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-start', width: '100%', marginTop: '0.5rem' }}>
                                <StarsIcon />
                                <div className="sub-header-content" style={{ textAlign: 'left' }}>
                                    <p>photographer, engineer, gamer sometimes</p>
                                </div>
                            </div>

                            <div className="work-section" style={{ marginTop: '5rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '2.5rem', letterSpacing: '0.15em', fontWeight: 700, fontFamily: 'Syne Mono', opacity: 0.6 }}>check out my work:</p>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                                    {projects.map(p => (
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
                    ) : currentView === 'portfolio' ? (
                        <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                            <div style={{ fontFamily: 'Syne Mono', fontSize: '1.5rem', opacity: 0.7 }}>
                                Coming Soon
                            </div>
                        </div>
                    ) : (
                        <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                            <ContactPage />
                        </div>
                    )}

                    <GrainyCircle />
                </main>

                {/* Footer */}
                <footer style={{ marginTop: 'auto', padding: '8rem 0 3rem', display: 'flex', justifyContent: 'center', opacity: 0.4 }}>
                    <img src={logo} alt="Logo" style={{ height: '40px', objectFit: 'contain', cursor: 'pointer' }} onClick={() => setCurrentView('home')} />
                </footer>
            </div>
        </div>
    );
}

export default CreativePageNew;
