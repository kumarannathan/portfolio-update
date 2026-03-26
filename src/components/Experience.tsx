import React from 'react';
import './Experience.css';

const Experience: React.FC = () => {
  const experiences = [
    {
      company: "Stealth Startup",
      companyUrl: "https://einnel.com/",
      role: "Software Engineer Intern",
      period: "Jul. 2024 – Oct. 2024",
      description: "Reduced API latency by 20% via profiling and optimization of Python and C++ data paths. Developed a real-time SaaS analytics dashboard using React and D3.js.",
      technologies: "Python • C++ • React • D3.js"
    },
    {
      company: "Wolverine Soft",
      companyUrl: "https://www.wolverinesoft.org/about-wolverinesoft-studio",
      role: "QA Lead / Programmer",
      period: "Sep. 2023 – Sep. 2024",
      description: "Spearheaded development of UI systems and quest architecture in Unity. Led QA operations in an Agile workflow using Jira and Confluence.",
      technologies: "Unity • C# • Jira • Confluence"
    },
    {
      company: "Extern",
      role: "Snap Lens Developer",
      period: "Mar. 2024 – May. 2024",
      description: "Analyzed engagement patterns across 50K+ users with SQL and Python, identifying behavior trends that contributed to a 13% retention increase.",
      technologies: "SQL • Python • Analytics"
    }
  ];

  return (
    <section className="experience-section" id="experience">
      <h2 className="experience-section-title">Work Experience</h2>

      <div className="experience-list">
        {experiences.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-date">{exp.period}</div>
            <div className="experience-content">
              <div className="experience-header">
                <h3>
                  {exp.role} —{" "}
                  {exp.companyUrl ? (
                    <a href={exp.companyUrl} target="_blank" rel="noreferrer">{exp.company}</a>
                  ) : (
                    exp.company
                  )}
                </h3>
              </div>
              <p className="experience-description">{exp.description}</p>
              <p className="experience-technologies">{exp.technologies}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience; 