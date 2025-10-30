import React from 'react';
import Terminal from './Terminal';

const About: React.FC = () => {
  return (
    <div className="intro-section">
      <Terminal />
      <div className="intro-text">
        <p>I'm a Computer Science graduate from the University of Michigan with a passion for full-stack development, UI/UX design, and emerging technologies. My experience spans across web development, AR/VR applications, and data analytics.</p>
        <p>I've worked with companies like Snapchat and led development teams at WolverineSoft, where I've built everything from financial analytics dashboards to computer vision systems.</p>
        <p>My technical expertise includes React, TypeScript, Python, and AWS, with a strong focus on creating user-centered solutions that drive measurable business impact. I'm always excited to tackle new challenges and collaborate on innovative projects that push the boundaries of technology.</p>
      </div>
    </div>
  );
};

export default About; 