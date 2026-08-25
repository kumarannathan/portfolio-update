import React from 'react';
import './Experience.css';
import yoggerLogo from '../assets/yogger-logo.png';
import einnElLogo from '../assets/einnel-logo.png';
import snapLogo from '../assets/snap-logo.png';
import wsoftLogo from '../assets/wsoft-logo.png';

const Experience: React.FC = () => {
  const experiences = [
    {
      company: "Yogger",
      role: "Software Engineer",
      period: "Apr. 2026 – Present",
      description:
        "Developed web, mobile, and pose detection features with React, TypeScript, Kotlin, Swift, Firebase, and Node.js.",
      technologies: "React • TypeScript • Kotlin • Swift • Firebase • Node.js",
      logoSrc: yoggerLogo,
    },
    {
      company: "Stealth Startup",
      companyUrl: "https://einnel.com/",
      role: "Software Engineer Intern",
      period: "Jul. 2024 – Oct. 2024",
      description: "Reduced API latency by 20% via profiling and optimization of Python and C++ data paths. Developed a real-time SaaS analytics dashboard using React and D3.js.",
      technologies: "Python • C++ • React • D3.js",
      logoSrc: einnElLogo,
    },
    {
      company: "Wolverine Soft",
      companyUrl: "https://www.wolverinesoft.org/about-wolverinesoft-studio",
      role: "QA Lead / Programmer",
      period: "Sep. 2023 – Sep. 2024",
      description: "Spearheaded development of UI systems and quest architecture in Unity. Led QA operations in an Agile workflow using Jira and Confluence.",
      technologies: "Unity • C# • Jira • Confluence",
      logoSrc: wsoftLogo,
    },
    {
      company: "Extern",
      role: "Snap Lens Developer",
      period: "Mar. 2024 – May. 2024",
      description: "Analyzed engagement patterns across 50K+ users with SQL and Python, identifying behavior trends that contributed to a 13% retention increase.",
      technologies: "SQL • Python • Analytics",
      logoSrc: snapLogo,
    },
  ];

  return (
    <section className="experience-section" id="experience">
      <h2 className="experience-section-title">Work Experience</h2>

      <div className="experience-list">
        {experiences.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-left">
              {'logoSrc' in exp && exp.logoSrc ? (
                <img className="experience-mark" src={exp.logoSrc as string} alt="" aria-hidden />
              ) : 'logoText' in exp && exp.logoText ? (
                <div className="experience-mark experience-mark-fallback" aria-hidden>
                  {exp.logoText as string}
                </div>
              ) : null}
            </div>
            <div className="experience-content">
              <div className="experience-header">
                <div className="experience-title">
                  {exp.companyUrl ? (
                    <a className="experience-company" href={exp.companyUrl} target="_blank" rel="noreferrer">
                      {exp.company}
                    </a>
                  ) : (
                    <span className="experience-company">{exp.company}</span>
                  )}
                  <span className="experience-sep">, </span>
                  <span className="experience-role">{exp.role}</span>
                </div>
              </div>
              <p className="experience-description">{exp.description}</p>
              <p className="experience-technologies">{exp.technologies}</p>
              <div className="experience-date experience-date-bottom">{exp.period}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience; 