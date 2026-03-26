import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export type Section = 'home' | 'about' | 'photos' | 'contact' | 'a16z';

interface NavbarProps {
    activeSection: Section;
    onNavigate: (section: Section) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
    const navigate = useNavigate();

    const handleNavigate = (section: Section) => {
    onNavigate(section);
        if (section === 'home') navigate('/');
        else navigate(`/${section}`);
    };

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

    return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left" onClick={() => handleNavigate('home')}>
          <div className="navbar-brand-badge">KN</div>
                </div>

        <div className="navbar-center">
          {activeSection === 'home' ? (
            <>
              <button className="nav-link" onClick={() => scrollToSection('experience')}>Experience</button>
              <button className="nav-link" onClick={() => scrollToSection('projects')}>Projects</button>
              <a href="https://kumi.tiiny.site" target="_blank" rel="noopener noreferrer" className="nav-link">Resume</a>
              <button className="navbar-cta" onClick={() => handleNavigate('contact')}>Contact</button>
            </>
          ) : (
            <>
              <button className="nav-link" onClick={() => handleNavigate('home')}>Home</button>
              <button className="nav-link" onClick={() => handleNavigate('about')}>About</button>
              <button className="nav-link" onClick={() => handleNavigate('photos')}>Photos</button>
              <button className="navbar-cta" onClick={() => handleNavigate('contact')}>Contact</button>
            </>
          )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
