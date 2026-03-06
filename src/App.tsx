import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

const Home: React.FC = () => (
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
);

const MainContent: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let currentView: Section = 'home';
  if (path === '/about') currentView = 'about';
  if (path === '/photos') currentView = 'photos';
  if (path === '/contact') currentView = 'contact';
  if (path === '/a16z') currentView = 'a16z';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const isPhotosView = currentView === 'photos';
  const isAlphaView = currentView === 'a16z';

  return (
    <div className={`App ${isPhotosView ? 'light-mode' : ''} ${isAlphaView ? 'alpha-mode' : ''}`}>
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
        {!isPhotosView && !isAlphaView && (
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
        <Navbar activeSection={currentView} onNavigate={() => { }} />

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
              <Route path="/contact" element={
                <motion.div
                  key="contact"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Contact />
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
