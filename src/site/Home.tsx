import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FadeContent from '../components/reactbits/FadeContent';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import SceneCanvas from './scenes/SceneCanvas';
import { AquariumScene } from './scenes/AquariumScene';
import ProjectCard from './ProjectCard';
import { FEATURED_WORK } from './data/work';
import './Home.css';

const Home: React.FC = () => {
  const tank = useMemo(() => new AquariumScene(), []);
  const [, setTick] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    // Re-render the little hint now and then so the algae warning can show up.
    const id = window.setInterval(() => setTick((n) => n + 1), 1500);
    return () => window.clearInterval(id);
  }, []);

  const addFish = () => {
    tank.addFish();
    setTick((n) => n + 1);
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="home">
      <h1 className="sr-only">Kumaran Nathan — software engineer in Detroit</h1>

      <section className="hero">
        <FadeContent blur duration={900} threshold={0} className="hero__frame">
          <SceneCanvas
            scene={tank}
            aspect={900 / 585}
            label="A planted fish tank on a wooden table, lit by a desk lamp. Click the water to feed the fish."
          />
        </FadeContent>
        <div className="hero__tools">
          <button type="button" className="hero__tool" onClick={addFish} disabled={tank.fishCount >= 8}>
            + fish
          </button>
          <span className="hero__dot" aria-hidden>
            ·
          </span>
          <span className="hero__hint">
            {tank.algae > 0.45 ? 'easy on the food, the glass is going green' : 'click the water to feed them'}
          </span>
        </div>
        <button type="button" className="hero__arrow" onClick={scrollToProjects} aria-label="Scroll to projects">
          ↓
        </button>
      </section>

      <section className="section container" id="projects">
        <h2 className="label">recent projects</h2>
        <AnimatedContent distance={24} duration={0.7} threshold={0.05}>
          <div className="pgrid">
            {FEATURED_WORK.map((item) => (
              <ProjectCard key={item.id} item={item} />
            ))}
          </div>
        </AnimatedContent>
        <div className="home__more">
          <Link to="/work" className="textlink">
            see more work →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
