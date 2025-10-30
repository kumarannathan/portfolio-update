import React from 'react';

const Experience: React.FC = () => {
  const experiences = [
    {
      company: "Freelance Developer",
      role: "Full Stack Developer",
      period: "Mar. 2025 – Present",
      description: "Full-stack development with real-time booking systems and 45% increase in client bookings."
    },
    {
      company: "EinNel Technologies",
      role: "Frontend Web Developer & Designer",
      period: "Jul. 2024 – Oct. 2024",
      description: "Interactive dashboards and KPI visualization systems boosting operational efficiency by 35%."
    },
    {
      company: "Snapchat",
      role: "AR & Digital Developer",
      period: "Mar. 2024 – May. 2024",
      description: "AR lenses with 20,000+ views and 13% user retention increase."
    },
    {
      company: "WolverineSoft",
      role: "UI/UX & QA Department Lead",
      period: "Aug. 2023 – May. 2024",
      description: "Led 20+ member team for Steam-published game with 15+ modular UI systems."
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