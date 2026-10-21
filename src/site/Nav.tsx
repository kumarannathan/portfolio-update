import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';

const Nav: React.FC = () => {
  // Out of the way on the way down, back on the way up.
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last.current) > 6) {
        setHidden(y > last.current && y > 80);
        last.current = y;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav${hidden ? ' is-hidden' : ''}`}>
      <a className="nav__skip" href="#main">
        skip to content
      </a>
      <div className="nav__inner">
        <nav className="nav__links" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
            about
          </NavLink>
          <NavLink to="/photos" className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
            photos
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
