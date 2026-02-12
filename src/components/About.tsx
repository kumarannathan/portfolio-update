import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* Main Headline */}
        <h1 className="about-title">Kumaran Nathan</h1>

        {/* Subtext */}
        <p className="about-intro">
          Hey, I'm Kumaran Nathan, a software engineer who loves building things that solve real problems. I recently graduated from the University of Michigan and have spent the last few years working across startups and game development, building everything from   analytics dashboards to computer vision systems that analyze tennis matches. My toolbox spans the full stack (React, Python, C++, TypeScript) and I'm happiest when I'm learning something new and shipping something meaningful.
        </p>

        {/* Decorative Separator */}
        <div className="about-separator"></div>
      </div>
    </section>
  );
};

export default About;
