import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import CustomCursor from './components/CustomCursor';
import ClickSpark from './components/ClickSpark';
import { photoProjects } from './data/photos';
import MetallicPaint from './components/MetallicPaint';
import ParticleField from './components/ParticleField';
import ProductionProjects from './components/ProductionProjects';
import pageLogo from './assets/logo.png';

type AppView = 'home' | 'about' | 'photos' | 'a16z';

const CreativePageNew = React.lazy(() => import('./components/CreativePageNew'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const A16zAlpha = React.lazy(() => import('./components/A16ZAlpha'));

const Home: React.FC = () => {
  const [particleOpacity, setParticleOpacity] = useState(1);

  useEffect(() => {
    const updateParticleFade = () => {
      const experience = document.getElementById('experience');
      if (!experience) {
        setParticleOpacity(1);
        return;
      }

      const rect = experience.getBoundingClientRect();
      const fadeStart = window.innerHeight * 0.72;
      const fadeDistance = window.innerHeight * 0.5;
      const progress = Math.min(1, Math.max(0, (fadeStart - rect.bottom) / fadeDistance));

      setParticleOpacity(1 - progress);
    };

    updateParticleFade();
    window.addEventListener('scroll', updateParticleFade, { passive: true });
    window.addEventListener('resize', updateParticleFade);

    return () => {
      window.removeEventListener('scroll', updateParticleFade);
      window.removeEventListener('resize', updateParticleFade);
    };
  }, []);

  return (
    <div className="home-shell">
      <ParticleField opacity={particleOpacity} />
      <About />

      <div className="home-section-block">
        <Experience />
      </div>
      <div className="home-section-block">
        <ProductionProjects />
      </div>
      <div className="home-section-block home-section-block--projects">
        <Projects />
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let currentView: AppView = 'home';
  if (path === '/about') currentView = 'about';
  if (path === '/photos') currentView = 'photos';
  if (path === '/a16z') currentView = 'a16z';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const isPhotosView = currentView === 'photos';
  const isAlphaView = currentView === 'a16z';

  return (
    <div className={`App ${isAlphaView ? 'alpha-mode' : ''}`}>
      {!isPhotosView && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            width: 68,
            height: 68,
            zIndex: 2500,
            pointerEvents: 'none'
          }}
        >
          <MetallicPaint
            imageSrc={pageLogo}
            seed={42}
            scale={4}
            patternSharpness={1}
            noiseScale={0.5}
            speed={0.3}
            liquid={0.75}
            mouseAnimation={false}
            brightness={2}
            contrast={0.5}
            refraction={0.01}
            blur={0.015}
            chromaticSpread={2}
            fresnel={1}
            angle={0}
            waveAmplitude={1}
            distortion={1}
            contour={0.2}
            lightColor="#ffffff"
            darkColor="#000000"
            tintColor="#feb3ff"
          />
        </div>
      )}
      <CustomCursor />

      <ClickSpark
        className="app-click-spark"
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
        easing="ease-out"
        extraScale={1}
      >
      {/* Background flashes for theme transitions */}
      <AnimatePresence>
        {isPhotosView && (
          <motion.div
            key="photos-entry-flash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#000000',
              zIndex: 3000,
              pointerEvents: 'none'
            }}
          />
        )}
        {isAlphaView && (
          <motion.div
            key="alpha-flash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#000000',
              zIndex: 1500,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      <main className="main-layout">
        <AnimatePresence mode="wait">
          <React.Suspense fallback={null}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={
                <motion.div
                  key="about-page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AboutPage />
                </motion.div>
              } />
              <Route path="/photos" element={
                <motion.div
                  key="photos"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CreativePageNew />
                </motion.div>
              } />
              <Route path="/a16z" element={
                <motion.div
                  key="a16z"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <A16zAlpha />
                </motion.div>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </AnimatePresence>
      </main>
      </ClickSpark>
    </div>
  );
};

function App() {
  useEffect(() => {
    // Proactive preloading of photography content
    photoProjects.forEach(project => {
      if (project.images.length > 0) {
        const img = new Image();
        img.src = project.images[0];
      }
    });
  }, []);

  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
