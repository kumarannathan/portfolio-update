import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Navbar, { Section } from './components/Navbar';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Skills from './components/Skills';
import Experience from './components/Experience';
import CustomCursor from './components/CustomCursor';

import { photoProjects } from './data/photos';

const CreativePageNew = React.lazy(() => import('./components/CreativePageNew'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const A16zAlpha = React.lazy(() => import('./components/A16ZAlpha'));

function App() {
  const [currentView, setCurrentView] = useState<Section>('home');

  React.useEffect(() => {
    // Check for secret a16z entry via URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'a16z') {
      setCurrentView('a16z');
    }

    // Proactive preloading of photography content
    photoProjects.forEach(project => {
      if (project.images.length > 0) {
        const img = new Image();
        img.src = project.images[0];
      }
    });

    // Global navigation listener for internal links in blurbs
    const handleNavigationEvent = (e: any) => {
      handleNavigate(e.detail);
    };
    window.addEventListener('navigate', handleNavigationEvent);
    return () => window.removeEventListener('navigate', handleNavigationEvent);
  }, []);

  const handleNavigate = (section: Section) => {
    setCurrentView(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPhotosView = currentView === 'photos';
  const isAlphaView = currentView === 'a16z';

  return (
    <div className={`App ${isPhotosView ? 'light-mode' : ''} ${isAlphaView ? 'alpha-mode' : ''}`}>
      <CustomCursor />
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
        {!isPhotosView && (
          <motion.div
            key="main-theme-entry-flash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#0a0e27',
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
        <Navbar
          activeSection={currentView}
          onNavigate={handleNavigate}
        />
        <AnimatePresence mode="wait">
          <React.Suspense fallback={null}>
            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <About />
                <div className="home-content-grid">
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                    className="home-main-col"
                  >
                    <Projects />
                    <motion.div
                      layout
                      className="home-skills-wrapper"
                    >
                      <Skills />
                    </motion.div>
                  </motion.div>
                  <motion.div layout className="home-side-col">
                    <Experience />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentView === 'about' && (
              <motion.div
                key="about-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AboutPage />
              </motion.div>
            )}

            {currentView === 'photos' && (
              <motion.div
                key="photos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CreativePageNew />
              </motion.div>
            )}

            {currentView === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Contact />
              </motion.div>
            )}

            {currentView === 'a16z' && (
              <motion.div
                key="a16z"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <A16zAlpha />
              </motion.div>
            )}
          </React.Suspense>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
