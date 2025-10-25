import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface CreativePageProps {
  onSlideBack: () => void;
}

// Memoized photo item component for performance
const PhotoItem = React.memo<{ 
  photo: string; 
  alt: string; 
  index: number;
}>(({ photo, alt, index }) => {
  return (
    <div 
      className="photo-carousel-item loaded"
      style={{
        opacity: 1,
        transform: 'scale(1)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      }}
    >
             <LazyLoadImage
               src={photo}
               alt={alt}
               effect="blur"
               threshold={100}
               style={{
                 width: '100%',
                 height: '100%',
                 objectFit: 'cover',
                 borderRadius: '8px'
               }}
               placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 280'%3E%3Crect fill='%231a1a1a' width='400' height='280'/%3E%3C/svg%3E"
             />
    </div>
  );
});

PhotoItem.displayName = 'PhotoItem';

const CreativePage: React.FC<CreativePageProps> = ({ onSlideBack }) => {
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use Framer Motion's scroll tracking - track scroll progress within the container
  const { scrollYProgress } = useScroll({
    container: containerRef  // Use container instead of target
  });

  // Track when carousel reaches top of viewport
  const carouselRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: carouselProgress } = useScroll({
    target: carouselRef,
    offset: ["start end", "start start"]
  });

  // Transform scroll progress to animation values
  // Names completely disappear off-screen
  const nameOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const nameFirstX = useTransform(scrollYProgress, [0, 0.2], [0, -500]);
  const nameLastX = useTransform(scrollYProgress, [0, 0.2], [0, 500]);
  
  // Photo carousel scales up from center, then fades when reaching top
  const carouselOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.7, 0.8], [0, 1, 1, 0]);
  const carouselScale = useTransform(scrollYProgress, [0.1, 0.25], [0.3, 1]);
  
  // Top row speeds up and goes left, bottom row speeds up and goes right when carousel reaches top
  const topRowX = useTransform(carouselProgress, [0, 0.3], [0, -2000]);
  const bottomRowX = useTransform(carouselProgress, [0, 0.3], [0, 2000]);
  
  // Selected projects animates in from bottom
  const projectsOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const projectsScale = useTransform(scrollYProgress, [0.7, 0.9], [0.3, 1]);
  const projectsY = useTransform(scrollYProgress, [0.7, 0.9], [50, 0]);

  // Memoize photo arrays to prevent re-creation on every render
  // Use first 25 images in each set for faster load/perf
  const photographyPhotos = useMemo(() => {
    const count = 25;
    return Array.from({ length: count }, (_, i) => `/creative-photos/photography/gridimage${i + 1}.jpeg`);
  }, []);

  const designPhotos = useMemo(() => {
    const count = 25;
    return Array.from({ length: count }, (_, i) => `/creative-photos/photography-1/gridimage${i + 51}.jpeg`);
  }, []);

  // Preload images to reduce lag
  // Eagerly preload first 10 from each, defer the rest
  useEffect(() => {
    const eager = [
      ...photographyPhotos.slice(0, 10),
      ...designPhotos.slice(0, 10)
    ];
    const deferred = [
      ...photographyPhotos.slice(10),
      ...designPhotos.slice(10)
    ];

    eager.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const deferLoad = () => deferred.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Use requestIdleCallback if available, else defer via timeout
    if (typeof (window as any).requestIdleCallback === 'function') {
      (window as any).requestIdleCallback(deferLoad);
    } else {
      setTimeout(deferLoad, 0);
    }
  }, [photographyPhotos, designPhotos]);

  return (
    <div className="creative-page">
      {/* Left slide-back tab */}
      <button 
        className="slide-tab slide-tab-left" 
        onClick={onSlideBack}
        style={{ position: 'fixed', left: 0, zIndex: 1001 }}
      >
        <span>›</span>
      </button>

      {/* Top Navigation */}
      <nav className="creative-nav">
        <div className="creative-nav-left">
          <span className="creative-logo-text">kn</span>
        </div>
        <div className="creative-nav-center">
          <a href="mailto:kumarann@umich.edu" className="creative-email">kumarann@umich.edu</a>
        </div>
        <div className="creative-nav-right">
          {/* Emoji buttons hidden */}
        </div>
      </nav>

             <div className="creative-scroll-container" ref={containerRef}>
        
        {/* Hero Section */}
        <div className="creative-hero-section">
          <div className="creative-hero-content">
            <div className="name-container">
              <motion.span 
                className="name-first"
                style={{
                  x: nameFirstX,
                  opacity: nameOpacity
                }}
              >
                KUMARAN
              </motion.span>
              <motion.span 
                className="name-last"
                style={{
                  x: nameLastX,
                  opacity: nameOpacity
                }}
              >
                NATHAN
              </motion.span>
            </div>
            
            {/* Decorative Character */}
            <div className="creative-character">
              <svg viewBox="0 0 100 100" className="character-svg">
                <circle cx="50" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="43" cy="37" r="2" fill="currentColor"/>
                <circle cx="57" cy="37" r="2" fill="currentColor"/>
                <path d="M 40 45 Q 50 50 60 45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="50" y1="60" x2="50" y2="80" stroke="currentColor" strokeWidth="2"/>
                <line x1="50" y1="70" x2="35" y2="85" stroke="currentColor" strokeWidth="2"/>
                <line x1="50" y1="70" x2="65" y2="85" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>

          {/* 3D Visual Element */}
          <div className="creative-3d-visual">
            <div className="visual-block" style={{ '--delay': '0s' } as React.CSSProperties}></div>
            <div className="visual-block" style={{ '--delay': '0.1s' } as React.CSSProperties}></div>
            <div className="visual-block" style={{ '--delay': '0.2s' } as React.CSSProperties}></div>
            <div className="visual-block" style={{ '--delay': '0.3s' } as React.CSSProperties}></div>
            <div className="visual-block" style={{ '--delay': '0.4s' } as React.CSSProperties}></div>
            <div className="visual-block" style={{ '--delay': '0.5s' } as React.CSSProperties}></div>
          </div>
        </div>

        {/* Scrolling Marquee */}
        <div className="creative-marquee">
          <div className="marquee-content">
            <span>PHOTOGRAPHY · UI/UX · DEVELOPMENT · 3D · BRANDING · GAME DEVELOPMENT · VIDEOGRAPHY · PHOTOGRAPHY · UI/UX · DEVELOPMENT · 3D · BRANDING · GAME DEVELOPMENT · VIDEOGRAPHY · </span>
          </div>
        </div>

        {/* Video Panel */}
        <div className="crt-wrapper">
          <div className="crt-frame">
            <video
              className="crt-screen"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
            >
              <source src="/creative-photos/videos/sydney.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="crt-glow"></div>
            <button 
              className="audio-control"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>

        {/* Infinite Horizontal Photo Carousel */}
        <motion.div 
          ref={carouselRef}
          className="creative-photos-section"
          style={{
            opacity: carouselOpacity,
            scale: carouselScale
          }}
        >
          {/* First Row - Photography (Scrolls Left) */}
          <motion.div 
            className="photo-carousel-row"
            style={{ x: topRowX }}
          >
            <div className="photo-carousel-track scroll-left">
              {photographyPhotos.map((photo, index) => (
                <PhotoItem
                  key={`photo-${index}`}
                  photo={photo}
                  alt={`Photography ${index + 1}`}
                  index={index}
                />
              ))}
              {/* Duplicate for seamless loop */}
              {photographyPhotos.map((photo, index) => (
                <PhotoItem
                  key={`photo-dup-${index}`}
                  photo={photo}
                  alt={`Photography ${index + 1}`}
                  index={index}
                />
              ))}
            </div>
          </motion.div>

          {/* Second Row - Photography-1 (Scrolls Right) */}
          <motion.div 
            className="photo-carousel-row"
            style={{ x: bottomRowX }}
          >
            <div className="photo-carousel-track scroll-right">
              {designPhotos.map((photo, index) => (
                <PhotoItem
                  key={`design-${index}`}
                  photo={photo}
                  alt={`Photography-1 ${index + 1}`}
                  index={index}
                />
              ))}
              {/* Duplicate for seamless loop */}
              {designPhotos.map((photo, index) => (
                <PhotoItem
                  key={`design-dup-${index}`}
                  photo={photo}
                  alt={`Photography-1 ${index + 1}`}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Selected Projects Section */}
        <motion.div 
          className="selected-projects-section"
          style={{
            opacity: projectsOpacity,
            scale: projectsScale,
            y: projectsY
          }}
        >
          <h2 className="selected-projects-title">Selected Projects</h2>
          
          {/* Sydney Video */}
          <div className="sydney-video-container">
            <video
              className="sydney-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/creative-photos/videos/sydney.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="video-caption">src/sydney/australia</p>
          </div>
        </motion.div>

        {/* Location Footer */}
        <div className="creative-footer">
          <p>Ann Arbor, MI</p>
          <p>EST (GMT-5)</p>
        </div>
      </div>
    </div>
  );
};

export default CreativePage;

