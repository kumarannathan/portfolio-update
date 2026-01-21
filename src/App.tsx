import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import CreativePageNew from './components/CreativePageNew';
import NavigationPill from './components/NavigationPill';
import GitHubActivity from './components/GitHubActivity';

function App() {
  const [activeTab, setActiveTab] = useState<'engineering' | 'photography'>('engineering');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="App">
      <NavigationPill
        activeTab={activeTab}
        onToggle={setActiveTab}
      />

      <AnimatePresence mode="wait">
        {activeTab === 'engineering' ? (
          <motion.div
            key="engineering"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ width: '100%' }}
          >
            {/* Grain Background */}
            <div className="grain-container">
              <div className="grain"></div>
            </div>

            <div className="portfolio-page-wrapper">
              <div className="portfolio-page">
                {/* Mobile Header */}
                <div className="mobile-header">
                  <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </button>
                  <div className="mobile-logo">
                    <h1>Kumaran Nathan</h1>
                  </div>
                </div>

                {/* Mobile Overlay */}
                {isMobileMenuOpen && (
                  <div
                    className="mobile-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                )}

                <div className="container">
                  {/* Sidebar */}
                  <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <div className="logo">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h1 style={{ margin: 0 }}>Kumaran Nathan</h1>
                      </div>
                      <p>Software Engineer</p>
                    </div>
                    <nav>
                      <ul>
                        <li><a href="#projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</a></li>
                        <li><a href="#experience" onClick={() => setIsMobileMenuOpen(false)}>Experience</a></li>
                        <li><a href="#skills" onClick={() => setIsMobileMenuOpen(false)}>Skills</a></li>
                      </ul>
                    </nav>

                    {/* GitHub Activity */}
                    <GitHubActivity username="kumarannathan" />

                    <div className="sidebar-footer-text">
                      Ann Arbor, MI
                    </div>
                    <div className="sidebar-footer-photo">
                      <div className="profile-photo">
                        <img src="/me.jpg" alt="Kumaran Nathan" />
                      </div>
                    </div>
                  </aside>

                  {/* Main Content */}
                  <main className="main-content">
                    <About />
                    <Projects />
                    <Experience />
                    <Skills />
                  </main>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="photography"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 2000 }}
          >
            <CreativePageNew onSlideBack={() => setActiveTab('engineering')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
