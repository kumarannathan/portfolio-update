import React from 'react';
import Terminal from './Terminal';

const About: React.FC = () => {
  return (
    <div className="intro-section">
      <Terminal />
      <div className="intro-text">
        <p>I'm a Computer Science graduate from the University of Michigan with a passion for full-stack engineering, UI/UX design, and creating immersive digital experiences. I love building tools that are not just functional, but also visually engaging and intuitive.</p>
        <p>Currently, I'm working on modernizing legacy systems and building scalable web applications. My expertise spans React, TypeScript, Python, and cloud infrastructure, finding the sweet spot between technical performance and aesthetic design.</p>
        <p>When I'm not coding, I'm usually gaming or taking photos. You can check out my <button onClick={(e) => { e.preventDefault(); document.querySelector('.slide-tab-right')?.dispatchEvent(new MouseEvent('click', { bubbles: true })); }} style={{ color: 'inherit', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>photography here</button>.</p>
      </div>
    </div>
  );
};

export default About; 