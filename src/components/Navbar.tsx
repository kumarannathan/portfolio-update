import React from 'react';
import './Navbar.css';

export type Section = 'home' | 'about' | 'photos' | 'contact' | 'a16z';

interface NavbarProps {
    activeSection: Section;
    onNavigate: (section: Section) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
    const isLightPage = activeSection === 'photos';
    const [searchValue, setSearchValue] = React.useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase();
        setSearchValue(val);
        if (val === 'a16z') {
            onNavigate('a16z');
            setSearchValue('');
        }
    };

    return (
        <nav className={`navbar ${isLightPage ? 'is-light' : ''}`}>
            <div className="navbar-container">
                {/* Left Section - Simple Name */}
                <div className="navbar-left">
                    {activeSection !== 'home' && (
                        <h1
                            className="navbar-name-simple"
                            onClick={() => onNavigate('home')}
                        >
                            Kumaran Nathan
                        </h1>
                    )}
                </div>

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
                    <div className="secret-search-container">
                        <input
                            type="text"
                            className="secret-input"
                            placeholder="enter code"
                            value={searchValue}
                            onChange={handleSearchChange}
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
