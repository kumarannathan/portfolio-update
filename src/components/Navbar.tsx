import React from 'react';
import './Navbar.css';

export type Section = 'home' | 'about' | 'photos' | 'contact';

interface NavbarProps {
    activeSection: Section;
    onNavigate: (section: Section) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
    const isLightPage = activeSection === 'photos';

    return (
        <nav className={`navbar ${isLightPage ? 'is-light' : ''}`}>
            <div className="navbar-container">
                {/* Left Section - Simple Name */}
                {activeSection !== 'home' && (
                    <div
                        className="navbar-left"
                        onClick={() => onNavigate('home')}
                    >
                        <h1 className="navbar-name-simple">Kumaran Nathan</h1>
                    </div>
                )}

                {/* Right Section - Navigation Links */}
                <div className="navbar-center">
                    <button
                        className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                        onClick={() => onNavigate('home')}
                    >
                        HOME
                    </button>
                    <button
                        className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                        onClick={() => onNavigate('about')}
                    >
                        ABOUT
                    </button>
                    <button
                        className={`nav-link ${activeSection === 'photos' ? 'active' : ''}`}
                        onClick={() => onNavigate('photos')}
                    >
                        PHOTOS
                    </button>
                    <a
                        href="/Kumi.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link"
                        style={{ textDecoration: 'none' }}
                    >
                        RESUME
                    </a>
                    <button
                        className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                        onClick={() => onNavigate('contact')}
                    >
                        CONTACT
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
