import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './A16ZAlpha.css';

const BackgroundLines: React.FC = () => (
    <div className="background-lines-container">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-line" style={{ left: `${(i + 1) * 15}%`, animationDelay: `${i * 2}s` }} />
        ))}
    </div>
);

interface Project {
    title: string;
    tagline?: string;
    description: string;
    why: string;
    role: string;
    outcome: string;
    links: string[];
    video?: string;
    isVertical?: boolean;
    placeholder?: boolean;
}

const A16ZAlpha: React.FC = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const projects: Project[] = [
        {
            title: "Sipt",
            tagline: "Letterboxd for specialty coffee",
            description: "Apps like Beanconqueror and Brewlog already let you track coffee, but they're entirely personal. There's no social layer, no way to discover roasters through people whose taste you trust, no community being built around the data. Sipt fills that gap. You log a coffee with a 3 axis rating across Enjoyment, Balance, and Clarity, follow other drinkers, and build a taste profile over time that actually means something. The social feed turns your morning routine into a discovery tool.",
            why: "I'm a specialty coffee person and I kept hitting the same wall: the tools to track what I was drinking existed but none of them were social. Letterboxd changed how people think about film because it made taste public and comparative. Beli did it for restaurants. Nobody had done it seriously for coffee, and coffee has one of the most passionate enthusiast communities out there. I wanted to build the thing I actually wanted to use.",
            role: "Founder and mobile developer. I designed the 3 axis rating system, built the app from scratch, and created the full visual identity around a glassmorphism aesthetic with themes like Espresso, Mocha, and Long Black.",
            outcome: "Still building, but the roadmap is where it gets interesting. Roaster pages with direct ordering, AI driven taste recommendations, and a data layer that gives specialty roasters real signal on what their customers think, not just sales numbers. The consumer app builds the network, the roaster side monetizes it. The bet is the same one Letterboxd and Beli made: people don't just want to consume, they want to curate. Coffee is the most obvious space where that hasn't happened at scale yet.",
            links: [],
            video: "/videos/coffee.mp4",
            isVertical: true
        },
        {
            title: "Focus Tracker",
            description: "A computer vision-powered attention tracking system using MediaPipe face-mesh and gesture recognition to monitor cognitive load and distraction.",
            why: "Initially built as a tool to help me 'lock in' for intense study sessions by detecting when my focus wavered. I later realized this primitive focus-tracking could be pivoted for vehicular safety, detecting driver fatigue or distraction in autonomous vehicle environments.",
            role: "Full-stack Developer. Engineered the Real-time CV pipeline using MediaPipe and designed the 'Focus Score' algorithm.",
            outcome: "Expanded from a simple study tool to a prototype for intelligent cabin monitoring. Achieved 98% accuracy in detecting gaze-off-road scenarios in controlled testing.",
            links: ["https://github.com/kumarannathan/focus-zone"],
            video: "/videos/focus.mp4"
        },
        {
            title: "Autonomous Incident Commander",
            description: "A production grade AI orchestration system that automates the full incident lifecycle from detection to resolution. Built for the Elasticsearch Hackathon, it ingests logs, metrics, and deployment events simultaneously, connects them through vector based retrieval, and surfaces root cause hypotheses with confidence scores so engineers aren't drowning in noise when something breaks at 2am.",
            why: "Every engineering team hits the same wall during a production incident: too much data, not enough signal, and no clear picture of what actually caused it. I wanted to build something that could reason across all of that automatically and give you a confident answer fast, not just a dump of relevant logs.",
            role: "Lead architect and full stack developer. I designed the multi stage reasoning pipeline that combines structured retrieval, ranking heuristics, and LLM orchestration, and built the real time observability dashboard on top of it.",
            outcome: "Won the Most Innovative Tool award at the hackathon. Demonstrated 40% faster triage times in simulated incident scenarios. The core insight that made it work was treating retrieval and reasoning as separate stages rather than one LLM call, which made the output dramatically more reliable and explainable.",
            links: ["https://github.com/kumarannathan/incident-commander"],
            placeholder: true
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const scrollTop = containerRef.current.scrollTop;
            const vh = containerRef.current.clientHeight;
            const index = Math.round(scrollTop / vh);
            setActiveIndex(index);

            // Toggle navbar sliding based on whether we are at the top (header) or not
            if (index > 0) {
                document.body.classList.add('navbar-sliding');
            } else {
                document.body.classList.remove('navbar-sliding');
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            container?.removeEventListener('scroll', handleScroll);
            document.body.classList.remove('navbar-sliding');
        };
    }, []);

    const totalSections = projects.length + 2; // Header + Projects + Footer

    return (
        <div className="alpha-page-container" ref={containerRef}>
            <BackgroundLines />
            <div className="scroll-progress-nav">
                {Array.from({ length: totalSections }).map((_, i) => (
                    <div
                        key={i}
                        className={`scroll-nav-bar ${activeIndex === i ? 'active' : ''}`}
                        onClick={() => {
                            containerRef.current?.scrollTo({
                                top: i * containerRef.current.clientHeight,
                                behavior: 'smooth'
                            });
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="alpha-header"
            >
                <h1 className="alpha-title">some work to share with you :)</h1>
            </motion.div>

            <div className="alpha-projects-grid">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.title}
                        className="alpha-project-card"
                    >
                        <div className="project-card-glass">
                            <div className={`project-header-row ${project.isVertical ? 'has-vertical-video' : ''}`}>
                                <div className="project-text-main">
                                    <div className="project-title-group">
                                        <h2 className="project-title">{project.title}</h2>
                                        {project.tagline && <p className="project-tagline">{project.tagline}</p>}
                                    </div>

                                    <div className="project-section">
                                        <h3>Description</h3>
                                        <p>{project.description}</p>
                                    </div>

                                    <div className="project-section">
                                        <h3>Why I built it</h3>
                                        <p>{project.why}</p>
                                    </div>
                                </div>

                                {project.video ? (
                                    <div className={`project-video-container ${project.isVertical ? 'vertical' : ''}`}>
                                        <video
                                            src={project.video}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="project-video-element"
                                        />
                                    </div>
                                ) : project.placeholder ? (
                                    <div className="project-placeholder-container">
                                        <div className="placeholder-content">
                                            <span>COMING SOON</span>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="project-details-grid">
                                <div className="project-section">
                                    <h3>My Role</h3>
                                    <p>{project.role}</p>
                                </div>

                                <div className="project-section">
                                    <h3>Outcome & Impact</h3>
                                    <p>{project.outcome}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div className="alpha-footer">
                <button onClick={() => navigate('/')} className="alpha-back-btn">
                    RETURN TO PORTFOLIO
                </button>
            </motion.div>
        </div>
    );
};

export default A16ZAlpha;
