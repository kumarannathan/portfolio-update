import React, { useState } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import CreativePage from './components/CreativePage';
// import SpotifyNowPlaying from './components/SpotifyNowPlaying';
import GitHubActivity from './components/GitHubActivity';
// import EyeNavBeta from './components/EyeNavBeta';

function App() {
  const [stage, setStage] = useState<'loading' | 'main'>('loading');
  const [isCreativeView, setIsCreativeView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [isEyeNavOpen, setIsEyeNavOpen] = useState(false);

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
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
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
              
              {/* Eye Navigation Button (hidden for now) */}
              {false && (
                <div style={{ marginTop: 12 }}>
                  <button className="project-link-button" onClick={() => {/* setIsEyeNavOpen(true) */}}>
                    <span>Try Eye Navigation (Beta)</span>
                  </button>
                </div>
              )}
              
              {/* Spotify Now Playing */}
              {/* <SpotifyNowPlaying /> */}
              
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

      {/* Eye Navigation Modal */}
      {/* Eye Navigation Modal (hidden for now) */}
      {false && (
        <div className="global-overlay" onClick={() => {/* setIsEyeNavOpen(false) */}}>
          <div style={{ maxWidth: 640, width:'100%', padding:'0 16px' }} onClick={(e)=>e.stopPropagation()}>
            {/* <EyeNavBeta /> */}
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop: 8 }}>
              <button className="project-link-button" onClick={() => {/* setIsEyeNavOpen(false) */}}>
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creative Portfolio Page */}
      <div className={`creative-page-wrapper ${isCreativeView ? 'slide-in' : ''}`}>
        <CreativePage onSlideBack={() => setIsCreativeView(false)} />
      </div>

    </div>
  );
}

export default App;
