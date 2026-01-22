import React from 'react';
import './JobSimVR.css';

const JobSimVR: React.FC = () => {
    return (
        <section className="jobsim-vr-section">
            <h2 className="jobsim-title">JobSim VR Demo</h2>
            <div className="video-wrapper">
                <iframe
                    src="https://www.youtube.com/embed/kZQmX16voqs"
                    title="JobSim VR"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </section>
    );
};

export default JobSimVR;
