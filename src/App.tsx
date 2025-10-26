import React, { useState } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import CreativePage from './components/CreativePage';
import SpotifyNowPlaying from './components/SpotifyNowPlaying';
import GitHubActivity from './components/GitHubActivity';

function App() {
  const [stage, setStage] = useState<'loading' | 'main'>('loading');
  const [isCreativeView, setIsCreativeView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (stage === 'loading') {
    return <LoadingScreen onComplete={() => setStage('main')} />;
  }

  return (
    <div className="App">
      {/* Grain Background */}
      <div className="grain-container">
        <div className="grain"></div>
      </div>

      {/* Main Portfolio Page */}
      <div className="portfolio-page-wrapper">
        <div className={`portfolio-page ${isCreativeView ? 'slide-left' : ''}`}>
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
                <h1>Kumaran Nathan</h1>
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
              
              {/* Spotify Now Playing */}
              <SpotifyNowPlaying />
              
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
          
          {/* Slide tab on far right */}
          <button 
            className="slide-tab slide-tab-right" 
            onClick={() => setIsCreativeView(true)}
          >
            <span>‹</span>
          </button>
        </div>
      </div>

      {/* Creative Portfolio Page */}
      <div className={`creative-page-wrapper ${isCreativeView ? 'slide-in' : ''}`}>
        <CreativePage onSlideBack={() => setIsCreativeView(false)} />
      </div>
    </div>
  );
}

export default App;
