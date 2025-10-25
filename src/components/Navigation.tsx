import React from 'react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeSection, 
  onSectionChange, 
  isDarkMode, 
  onToggleDarkMode,
  className = ''
}) => {
  const sections = ['about', 'experience', 'projects', 'skills', 'contact'];

  return (
    <nav className={`navigation ${className}`}>
      <div className="nav-links">
        {sections.map((section) => (
          <button
            key={section}
            className={`nav-link ${activeSection === section ? 'active' : ''}`}
            onClick={() => onSectionChange(section)}
          >
            {section}
          </button>
        ))}
      </div>
      
      <div className="dark-mode-toggle" onClick={onToggleDarkMode}>
        <div className={`toggle-icon ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="toggle-dot"></div>
        </div>
        <span className="toggle-text">{isDarkMode ? 'dark' : 'light'}</span>
      </div>
    </nav>
  );
};

export default Navigation; 