import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Nav.css';

const SOCIAL = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/kkumarann',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    )
  },
  {
    label: 'GitHub',
    href: 'https://github.com/kumarannathan/',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.66-3.645-1.455-3.645-1.455-.495-1.26-1.2-1.59-1.2-1.59-.99-.675.075-.66.075-.66 1.095.075 1.665 1.125 1.665 1.125.975 1.665 2.55 1.185 3.165.9.105-.735.39-1.185.705-1.455-2.46-.27-5.04-1.23-5.04-5.515 0-1.23.435-2.23 1.125-3.015-.105-.27-.45-1.365.105-2.85 0 0 .915-.285 3.015 1.14.87-.24 1.815-.36 2.745-.36s1.875.12 2.745.36c2.1-1.425 3.015-1.14 3.015-1.14.555 1.485.21 2.58.105 2.85.69.785 1.125 1.785 1.125 3.015 0 4.305-2.595 5.25-5.07 5.55.405.345.765 1.02.765 2.055 0 1.485-.015 2.685-.015 3.045 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    )
  },
  {
    label: 'Resume',
    href: 'https://kumi.tiiny.site',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h6" />
      </svg>
    )
  },
  {
    label: 'Email',
    href: 'mailto:kumarann@umich.edu',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    )
  }
];

const Nav: React.FC = () => {
  const { pathname } = useLocation();
  const onHome = pathname === '/';

  return (
    <header className="nav">
      <a className="nav__skip" href="#main">
        skip to content
      </a>
      <div className="nav__inner">
        <Link to="/" className={`nav__brand${onHome ? ' is-active' : ''}`}>
          kumaran nathan
        </Link>
        <nav className="nav__links" aria-label="Primary">
          <NavLink to="/work" className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
            work
          </NavLink>
          <NavLink to="/photos" className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
            photos
          </NavLink>
        </nav>
        <div className="nav__social">
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              className="nav__icon"
              href={s.href}
              target={s.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={s.label}
              title={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Nav;
