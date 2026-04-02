import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import CustomCursor from './components/CustomCursor';
import DomeGallery from './components/DomeGallery';
import Grainient from './components/Grainient';

import { photoProjects } from './data/photos';

type AppView = 'home' | 'about' | 'photos' | 'a16z';

const CreativePageNew = React.lazy(() => import('./components/CreativePageNew'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const A16zAlpha = React.lazy(() => import('./components/A16ZAlpha'));

const Home: React.FC = () => (
  <div className="home-shell">
    <About />
    <div className="home-section-block">
      <Experience />
    </div>
    <div className="home-section-block">
      <Projects />
    </div>
    <div className="home-section-block">
      <h2 style={{ fontSize: '22px', fontWeight: 'Normal', marginBottom: '-10%', transform: 'translateX(42%)', marginTop: '15%' }}>Photos</h2>

    </div>
    <div className="home-bottom-gallery-block">
      <DomeGallery
        images={photoProjects
          .filter((project) => ['formula1', 'mexico', 'filmfavorites'].includes(project.id))
          .flatMap((project) => project.images)}
        fit={0.8}
        minRadius={600}
        maxVerticalRotationDeg={0}
        segments={34}
        dragDampening={2}
        grayscale={false}
        overlayBlurColor="transparent"
      />
    </div>
  </div>
);

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
    <div className={`App ${isPhotosView ? 'light-mode' : ''} ${isAlphaView ? 'alpha-mode' : ''}`}>
      <div className="app-pixel-wallpaper" aria-hidden>
        <Grainient
          color1="#000000"
          color2="#707070"
          color3="#000000"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={4}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
      <CustomCursor />

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

      <main className={`main-layout ${currentView === 'home' ? 'main-layout-home' : ''}`}>
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
