import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Projects.css';

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  technologies: string[];
  link?: string;
}

const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('featured');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['featured', 'all', 'ai', 'cv', 'fullstack', 'game development', 'ar/vr'];

  const projectsData: (Project & { featured?: boolean })[] = [
    {
      id: "booking-platform",
      title: "Startup Booking Platform",
      category: "fullstack",
      year: "2025",
      description: "Full-stack booking platform with TypeScript/React frontend and Node.js/Express backend handling 100+ monthly reservations with PostgreSQL managing relational customer and availability data. Built RESTful API layer with automated email notifications and JWT authentication.",
      technologies: ["React", "Node.js", "Express", "PostgreSQL", "JWT"],
      featured: true,
    },
    {
      id: "tennis-analytics",
      title: "CV Tennis Analytics",
      category: "ai",
      year: "2025",
      description: "Full-stack sports analytics platform with React dashboard and FastAPI backend processing match footage using custom YOLOv8 and PyTorch models. Designed RESTful APIs serving real-time analysis endpoints with PostgreSQL storing match statistics.",
      technologies: ["React", "FastAPI", "YOLOv8", "PyTorch", "D3.js"],
      featured: true,
    },
    {
      id: "dance-ar",
      title: "Dance AR",
      category: "ar/vr",
      year: "2025",
      description: "Full-stack AR fitness platform analyzing movement against choreography using MediaPipe pose estimation. Engineered RESTful API handling real-time WebRTC streams and movement scoring algorithms. Deployed via CI/CD on GCP.",
      technologies: ["Next.js", "MediaPipe", "WebRTC", "Firebase", "GCP"],
      featured: true,
    },
    {
      id: "soul-forest",
      title: "Soul of the Forest",
      category: "game development",
      year: "2023",
      description: "Directed UI/UX department for commercial game development, establishing development timelines using Jira, Confluence, and Git. Led comprehensive playtesting and implemented menu designs using Figma, C# Scripts, and Unity Game Engine.",
      technologies: ["Unity", "C#", "Figma", "Jira", "Git"],
      featured: true,
    },
    {
      id: "jobsim-vr",
      title: "JobSim VR",
      category: "ar/vr",
      year: "2024",
      description: "Corporate life simulator featuring NPCs with dynamic behaviors, head-tracking, movement, and dialogue. Designed 'Severance'-inspired Macrodata Refinement Room with interactable components and immersive VR environment. Featured in UMich Game Design Showcase.",
      technologies: ["Unreal Engine 5", "Blueprints", "C++"],
      featured: true,
    },
    {
      id: "depth-analysis",
      title: "Stereoscopic Depth Analysis",
      category: "explorations / case studies / yaps",
      year: "2023",
      description: "Exploration of stereoscopic depth mapping using synchronized dual-camera setups to recreate human-like depth perception. Reduced point cloud processing latency by 40% using custom CUDA kernels. Tools: C++, OpenCV, CUDA.",
      technologies: ["C++", "OpenCV", "CUDA", "Computer Vision"],
      featured: false,
    },
    {
      id: "generative-visuals",
      title: "Generative Visual Systems",
      category: "explorations / case studies / yaps",
      year: "2024",
      description: "Bridge between raw data and aesthetic output, translating real-time biometric data into generative GLSL shaders with a focus on emotional resonance through bio-feedback loops. Tools: TouchDesigner, GLSL, Python, MediaPipe.",
      technologies: ["TouchDesigner", "GLSL", "Python", "MediaPipe"],
      featured: false,
    },
    {
      id: "ann-arbor-go",
      title: "AnnArborGo",
      category: "ar/vr",
      year: "2024",
      description: "Location-based AR game promoting environmental stewardship through virtual tree planting, landmark exploration, and eco-defense mechanics. Features Environmental Achievement Recognition System with eco-medals, GPS landmark navigation, interactive history reveals, and dynamic squirrel encounters requiring strategic acorn-throwing defense.",
      technologies: ["Unreal Engine 5", "AR", "GPS", "Blueprints", "C++"],
    },
    {
      id: "focus-zone",
      title: "Focus Zone",
      category: "cv",
      year: "2025",
      description: "Computer vision-powered focus tracking application using MediaPipe face mesh detection. Features hand gesture controls and real-time distraction detection.",
      technologies: ["React", "TypeScript", "MediaPipe", "Computer Vision"],
    },
    {
      id: "meeting-summarizer",
      title: "Smart Meeting Summarizer",
      category: "ai",
      year: "2025",
      description: "Meeting intelligence app that transcribes audio, extracts chapters, and detects attendees automatically using FastAPI and OpenAI/AssemblyAI.",
      technologies: ["React", "TypeScript", "FastAPI", "Python", "AssemblyAI"],
    },
    {
      id: "studyai",
      title: "StudyAI",
      category: "ai",
      year: "2024",
      description: "AI-powered learning platform using Next.js and TypeScript that leverages multiple AI APIs to generate flashcards and quizzes.",
      technologies: ["Next.js", "TypeScript", "Prisma", "OpenAI"],
    }
  ];

  const filteredProjects = activeCategory === 'all'
    ? projectsData
    : activeCategory === 'featured'
      ? projectsData.filter(p => p.featured)
      : projectsData.filter(p => p.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="projects-section-new" id="projects">
      <h2 className="projects-section-title">Projects</h2>
      <div className="section-header">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-accordion">
        {filteredProjects.map((project, index) => (
          <motion.div
            layout
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 26,
              mass: 1.2,
              restDelta: 0.001 /* High precision to eliminate end-of-animation jump */
            }}
            className={`accordion-item ${expandedId === project.id ? 'expanded' : ''}`}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
              e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
            }}
          >
            <div
              className="item-main"
              onClick={() => toggleExpand(project.id)}
            >
              <h3 className="item-title">{project.title}</h3>
              <div className="item-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <motion.div
              layout
              initial={false}
              animate={{
                height: expandedId === project.id ? "auto" : 0,
                opacity: expandedId === project.id ? 1 : 0
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] /* Smooth quintic ease */
              }}
              style={{ overflow: 'hidden' }}
              className="item-details"
            >
              <div className="details-content">
                <div className="details-text">
                  <p className="description">{project.description}</p>
                  <div className="meta">
                    <span className="year">{project.year}</span>
                    <span className="category">{project.category}</span>
                  </div>
                  <ul className="tech-stack">
                    {project.technologies.map((tech, i) => (
                      <li key={i} className="tech-tag">{tech}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;