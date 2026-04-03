import React from 'react';
import './About.css';

const About: React.FC = () => {
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSectionLink = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <section className="about-section" id="intro">
      <div className="about-header">
        <img className="about-avatar" src="/me.jpg" alt="Kumaran Nathan" />
        <div className="about-header-copy">
          <h1 className="about-title">Kumaran Nathan</h1>
          <p className="about-role">Product-focused Software Engineer</p>
          <a className="about-handle" href="mailto:kumarnath@umich.edu">kumarann@umich.edu</a>
          <div className="about-nav-actions">
            <a
              href="#experience"
              className="about-nav-link"
              onClick={(event) => handleSectionLink(event, 'experience')}
            >
              Experience <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#projects"
              className="about-nav-link"
              onClick={(event) => handleSectionLink(event, 'projects')}
            >
              Projects <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://kumi.tiiny.site"
              className="about-nav-link"
              target="_blank"
              rel="noreferrer"
            >
              Resume <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://github.com/kumarannathan/"
              className="about-nav-link"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="about-content">
        <p className="about-label">About</p>
        <p className="about-intro">
          I build software products from idea to production, with a focus on intuitive experiences and measurable outcomes. I recently graduated from the University of Michigan and have shipped across full-stack web, computer vision, and game systems.
        </p>
        <p className="about-intro">
          My toolbox spans React, TypeScript, Python, C++, and cloud infrastructure. I enjoy fast iteration, tight feedback loops, and solving real user problems with clean execution.
        </p>
      </div>
    </section>
  );
};

export default About;
