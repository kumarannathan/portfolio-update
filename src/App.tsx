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

function App() {
  const [currentView, setCurrentView] = useState<Section>('home');

  React.useEffect(() => {
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

  return (
    <div className={`App ${isPhotosView ? 'light-mode' : ''}`}>
      <CustomCursor />
      <AnimatePresence>
        {isPhotosView && (
          <motion.div
            key="white-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#f5f5f5',
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
          </React.Suspense>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
