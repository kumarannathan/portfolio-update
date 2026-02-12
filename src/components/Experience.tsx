import React from 'react';

const Experience: React.FC = () => {
  const experiences = [
    {
      company: "Stealth Startup",
      role: "Software Engineer Intern",
      period: "Jul. 2024 – Oct. 2024",
      description: "Reduced API latency by 20% via profiling/optimization of Python/C++ data paths. Developed a real-time SaaS analytics dashboard using React and D3.js."
    },
    {
      company: "Wolverine Soft",
      role: "QA Lead / Programmer",
      period: "Sep. 2023 – Sep. 2024",
      description: "Spearheaded development of UI systems and quest architecture using Unity/C#. Led QA in an Agile environment using Confluence/Jira."
    },
    {
      company: "Extern",
      role: "Snap Lens Developer",
      period: "Mar. 2024 – May. 2024",
      description: "Analyzed engagement patterns across 50K+ users using SQL/Python. Identified behavior patterns contributing to a 13% retention increase."
    }
  ];

  return (
    <section className="experience-section">
      <h2 className="experience-section-title">Experience</h2>

      <div className="experience-list">
        {experiences.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <h3>{exp.company}</h3>
              <span className="experience-date">{exp.period}</span>
            </div>
            <p className="experience-role">{exp.role}</p>
            <p className="experience-description">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience; 