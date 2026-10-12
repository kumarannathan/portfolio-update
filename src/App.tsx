import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Nav from './site/Nav';
import CaseStudy from './site/CaseStudy';
import About from './site/About';

const Gallery = React.lazy(() => import('./site/Gallery'));
const Tanks = React.lazy(() => import('./site/Tanks'));
const A16zAlpha = React.lazy(() => import('./components/A16ZAlpha'));

/** Routes that bring their own full-screen chrome and skip the site nav. */
const BARE_ROUTES = new Set(['/a16z']);

const Shell: React.FC = () => {
  const location = useLocation();
  const bare = BARE_ROUTES.has(location.pathname);

  return (
    <div className="site">
      {!bare && <Nav />}
      <main id="main" className={`site-main${bare ? ' site-main--bare' : ''}`}>
        <React.Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/work/:id" element={<CaseStudy />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/work" element={<Navigate to="/" replace />} />
            <Route path="/photos" element={<Gallery />} />
            <Route path="/fish-tanks" element={<Tanks />} />
            <Route path="/a16z" element={<A16zAlpha />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Shell />
    </Router>
  );
}

export default App;
