import React from 'react';

const Skills: React.FC = () => {
  const skillCategories = [
    {
      category: "Languages",
      skills: ["C++/C#", "Python", "JS/TS", "Go", "SQL"]
    },
    {
      category: "Frameworks/Tech",
      skills: ["React", "FastAPI", "Docker", "PostgreSQL", "MediaPipe"]
    },
    {
      category: "AI",
      skills: ["PyTorch", "OpenCV", "YOLOv8", "MLOps"]
    },
    {
      category: "Tools & Practices",
      skills: ["Git/GitHub", "AWS (EC2)", "Jira", "CI/CD", "Agile"]
    }
  ];

  return (
    <section className="skills-section">
      <h2 className="skills-section-title">Skills & Technologies</h2>

      <div className="skills-grid">
        {skillCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="skill-category">
            <h4>{category.category}</h4>
            <ul>
              {category.skills.map((skill, skillIndex) => (
                <li key={skillIndex}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}

        <div className="skill-category">
          <h4>Tools & Design</h4>
          <div className="tool-logos">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" className="tool-logo" title="Git" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="Figma" className="tool-logo" title="Figma" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VS Code" className="tool-logo" title="VS Code" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" alt="Jira" className="tool-logo" title="Jira" />
            <div title="Agile/Scrum">
              <svg className="tool-logo" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7.45 3.73L12 11.63 4.55 7.91 12 4.18zM4 9.47l7 3.5v6.86l-7-3.5V9.47zm9 10.36v-6.86l7-3.5v6.86l-7 3.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;