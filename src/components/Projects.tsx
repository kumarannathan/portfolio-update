import React, { useState } from 'react';

interface Project {
  title: string;
  year: string;
  description: string;
  technologies: string[];
  video?: string;
  link?: string;
}

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'selected' | 'gamedev'>('selected');

  const selectedProjects: Project[] = [
    {
      title: "Focus Zone",
      year: "2025",
      description: "Computer vision-powered focus tracking application using MediaPipe face mesh detection to monitor user attention and detect distractions in real-time. Features hand gesture controls for hands-free session management (fist, open palm, peace sign, thumbs up/down), real-time focus score calculation based on eye tracking, and comprehensive distraction detection with categorized interruption analysis. Includes Pomodoro timer integration and session analytics with smooth animations.",
      technologies: ["React", "TypeScript", "MediaPipe", "Computer Vision", "Hand Gesture Recognition", "Focus Detection", "Framer Motion", "Tailwind CSS"],
    },
    {
      title: "Test Generation Platform",
      year: "2025",
      description: "Deployed a full-stack web application using Gemini API to generate unit tests for numerous languages, reducing manual testing writing time by 85%, with real sandboxed pytest coverage analytics with 95% coverage. Engineered custom code complexity analysis engine that detects algorithmic inefficiencies (O(n²) nested loops, redundant operations, cyclomatic complexity).",
      technologies: ["React", "TypeScript", "Node.js", "Python", "Gemini API"],
    },
    {
      title: "Social Platform Database",
      year: "2025",
      description: "Designed RDBMS with 11 normalized tables for 800+ users, implementing triggers for bidirectional friendship validation, deferred constraints for circular dependencies, and complex data migration from denormalized schema. Built performant JDBC application with nine optimized SQL queries for friend recommendations and photo analytics, achieving sub 90ms execution via indexed lookups and DBMS-side aggregation.",
      technologies: ["Java", "JDBC", "Oracle SQL", "SQL*Plus"]
    },
    {
      title: "TennisCV",
      year: "2025",
      description: "End-to-end computer vision pipeline to detect, track, and analyze player movements, ball speed, court key points, and shot metrics from tennis match videos using custom-trained YOLOv8/V5 and CNN models with real-time analytics dashboard.",
      technologies: ["YOLOv8", "OpenCV", "PyTorch"]
    },
    {
      title: "DanceAR",
      year: "2024",
      description: "AR-powered fitness platform leveraging Streamlit, OpenCV, and MediaPipe to compare dance moves with benchmark videos in real-time. Features live scoring, performance insights, and secure Firebase authentication with role-based access.",
      technologies: ["React", "TypeScript", "Firebase", "MediaPipe", "WebRTC"],
      link: "https://dancear.netlify.app/"
    },
    {
      title: "SmartReview",
      year: "2024",
      description: "AI-powered Chrome extension using Google Gemini AI to analyze and summarize Amazon product reviews, helping users make informed purchasing decisions efficiently. Implemented secure proxy server architecture and built robust review extraction system.",
      technologies: ["Chrome Extension", "Google Gemini AI", "RESTful API", "JavaScript"]
    },
    {
      title: "StudyAI",
      year: "2024",
      description: "AI-powered learning platform using Next.js and TypeScript that leverages multiple AI APIs to generate flashcards and quizzes, reducing study preparation time by 40%. Features real-time collaboration and OAuth authentication.",
      technologies: ["Next.js", "ReactJS", "TypeScript", "Prisma"]
    }
  ];

  const gameDevProjects: Project[] = [
    {
      title: "JobSim VR",
      year: "2024",
      description: "Corporate life simulator featuring NPCs with dynamic behaviors, head-tracking, movement, and dialogue. Designed 'Severance'-inspired Macrodata Refinement Room with interactable components and immersive VR environment. Featured in UMich Game Design Showcase.",
      technologies: ["Unreal Engine 5", "Blueprints", "C++"],
      link: "https://github.com/kumarannathan/JobSimVR"
    },
    {
      title: "AnnArborGo",
      year: "2024",
      description: "Location-based AR game promoting environmental stewardship through virtual tree planting, landmark exploration, and eco-defense mechanics. Features Environmental Achievement Recognition System with eco-medals, GPS landmark navigation, interactive history reveals, and dynamic squirrel encounters requiring strategic acorn-throwing defense.",
      technologies: ["Unreal Engine 5", "AR", "GPS", "Blueprints", "C++"],
      link: "https://github.com/kumarannathan/AnnArborGo"
    },
    {
      title: "Soul of the Forest",
      year: "2023",
      description: "Directed UI/UX department for commercial game development, establishing development timelines using Jira, Confluence, and Git. Led comprehensive playtesting and implemented menu designs using Figma, C# Scripts, and Unity Game Engine.",
      technologies: ["Unity", "C#", "Figma", "Jira", "Git"],
      link: "https://store.steampowered.com/app/2880650/Soul_of_the_Forest/"
    }
  ];

  const currentProjects = activeTab === 'selected' ? selectedProjects : gameDevProjects;

  return (
    <section className="projects-section">
      <div className="projects-tabs">
        <button
          className={`projects-tab ${activeTab === 'selected' ? 'active' : ''}`}
          onClick={() => setActiveTab('selected')}
        >
          Selected Projects
        </button>
        <button
          className={`projects-tab ${activeTab === 'gamedev' ? 'active' : ''}`}
          onClick={() => setActiveTab('gamedev')}
        >
          Game Dev Projects
        </button>
      </div>
      
      <div className="projects-list">
        {currentProjects.map((project, index) => (
          <div key={index} className="project">
            <div className="project-header">
              <h3>{project.title}</h3>
              <span className="project-year">{project.year}</span>
            </div>
            <p className="project-description-new">{project.description}</p>
            {project.video && (
              <div className="project-video-container">
                <video 
                  className="project-video"
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  poster="/focus-zone-poster.jpg"
                >
                  <source src={project.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="project-tags">
              {project.technologies.map((tech, techIndex) => (
                <span key={techIndex} className="tag">{tech}</span>
              ))}
            </div>
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-link-inline"
              >
                View Project →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects; 