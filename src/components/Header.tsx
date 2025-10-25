import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="profile-photo">
          <img src="/me.jpg" alt="Kumaran Nathan" />
        </div>
        <h1 className="name">kumaran nathan</h1>
        <p className="description">Computer Science graduate from University of Michigan.</p>
        
        <div className="social-links">
          <a href="mailto:kumarann@umich.edu" className="social-link">
            mail
          </a>
          <a href="https://linkedin.com/in/kkumarann" target="_blank" rel="noopener noreferrer" className="social-link">
            linkedin
          </a>
          <a href="https://kumarann.netlify.app" target="_blank" rel="noopener noreferrer" className="social-link">
            portfolio
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header; 