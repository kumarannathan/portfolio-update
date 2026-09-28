import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="about-page-content">
            <div className="bio-section">
                <h2 className="section-subtitle">The Story</h2>
                <p className="bio-text">
                    I’m a Computer Science graduate from Michigan who thrives at the intersection of technical precision
                    and creative messiness. My background is in engineering—having spent time at <strong>Snap</strong> and
                    leading UI/UX teams at <strong>WolverineSoft</strong>—but my true obsession is exploring how
                    software can feel more human, tactile, and alive.
                </p>
                <p className="bio-text">
                    Whether it’s optimizing real-time computer vision plugins or chasing a flow state in
                    <strong> Valorant</strong> (peaked at <strong>Ascendant 3</strong>, top 0.73% NA—stats{' '}
                    <a
                        href="https://tracker.gg/valorant/profile/riot/iroh%237699/overview"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-link"
                    >
                        here
                    </a>), I’m always looking for that sweet spot where focus meets execution.
                </p>
                <p className="bio-text">
                    When I’m not at a keyboard, I’m usually out with my camera (check out my{' '}
                    <span
                        className="inline-link"
                        onClick={() => navigate('/photos')}
                        style={{ cursor: 'pointer' }}
                    >
                        photography work
                    </span>) or exploring worlds in games like <strong>Arc Raiders</strong> and <strong>Hogwarts Legacy</strong>.
                    I’m just trying to build things that feel good to use and look even better.
                </p>
            </div>

        </div>
    );
};

export default AboutPage;
