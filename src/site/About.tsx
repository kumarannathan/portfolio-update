import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import FadeContent from '../components/reactbits/FadeContent';
import SceneCanvas from './scenes/SceneCanvas';
import { LakeScene } from './scenes/LakeScene';
import { EXPERIENCE } from './data/experience';
import { ALL_WORK } from './data/work';
import ProjectCard from './ProjectCard';
import './About.css';
import './ProjectCard.css';

/** The two that lead, stacked. */
const FEATURED_IDS = ['yogger-web-redesign', 'toshi'];

interface AboutProps {
  /** The featured carousel and the work link. */
  showProjects?: boolean;
}

const About: React.FC<AboutProps> = ({ showProjects = true }) => {
  const lake = useMemo(() => new LakeScene(), []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const featured = showProjects
    ? FEATURED_IDS.map((id) => ALL_WORK.find((w) => w.id === id)).filter(
        (w): w is NonNullable<typeof w> => Boolean(w)
      )
    : [];

  return (
    <div className="about container">
      <FadeContent duration={700} threshold={0}>
        <h1 className="sr-only">Kumaran Nathan — software engineer in Detroit</h1>
        <header className="about__head">
          <img className="about__avatar" src={`${process.env.PUBLIC_URL || ''}/me.jpg`} alt="Kumaran Nathan" />
          <div>
            <h2 className="about__name">Kumaran Nathan</h2>
            <p className="about__role">software engineer · detroit</p>
          </div>
        </header>

        <section className="about__bio">
          <p>
            hey! i'm kumaran. i graduated from the university of michigan in 2025, where i studied computer science. i love
            working across the stack, building products from idea to production.
          </p>
          <p>
            my background is in engineering, with time at <strong>Snap</strong> and leading UI/UX at{' '}
            <strong>WolverineSoft</strong>, but the thing i keep coming back to is how software can feel more human, tactile,
            and alive.
          </p>
          <p>
            when i'm not at a keyboard i'm usually out with my camera (see <Link to="/photos">photos</Link>), hiking, or
            chasing a flow state in <strong>Valorant</strong>. peaked at Ascendant 3, top 0.73% NA,{' '}
            <a href="https://tracker.gg/valorant/profile/riot/iroh%237699/overview" target="_blank" rel="noreferrer">
              stats here
            </a>
            .
          </p>
        </section>
      </FadeContent>

      <section className="section about__section">
        <h2 className="label label--left">experience</h2>
        <ul className="xp">
          {EXPERIENCE.map((x) => (
            <li key={x.company + x.role} className="xp__row">
              <img className="xp__logo" src={x.logo} alt="" aria-hidden />
              <div className="xp__body">
                <div className="xp__title">
                  {x.companyUrl ? (
                    <a href={x.companyUrl} target="_blank" rel="noreferrer">
                      {x.company}
                    </a>
                  ) : (
                    <span>{x.company}</span>
                  )}
                  <span className="xp__role">, {x.role}</span>
                </div>
              </div>
              <div className="xp__period">{x.period}</div>
            </li>
          ))}
        </ul>
      </section>

      {showProjects && featured.length > 0 && (
        <section className="section about__section">
          <h2 className="label label--left">recent projects</h2>
          <div className="about__projects">
            {featured.map((item) => (
              <ProjectCard key={item.id} item={item} />
            ))}
          </div>
          <div className="about__more">
            <Link to="/work" className="textlink">
              see more work →
            </Link>
          </div>
        </section>
      )}

      <section className="section about__section">
        <h2 className="label label--left">elsewhere</h2>
        <div className="about__links">
          <a className="textlink" href="mailto:kumarann@umich.edu">
            email ↗
          </a>
          <a className="textlink" href="https://github.com/kumarannathan/" target="_blank" rel="noreferrer">
            github ↗
          </a>
          <a className="textlink" href="https://linkedin.com/in/kkumarann" target="_blank" rel="noreferrer">
            linkedin ↗
          </a>
          <a className="textlink" href="https://kumi.tiiny.site" target="_blank" rel="noreferrer">
            resume ↗
          </a>
        </div>
      </section>

      <section className="about__lake">
        <SceneCanvas
          scene={lake}
          aspect={900 / 420}
          label="A grey-blue lake with a pine shore, a drifting sailboat and gulls. Click the water to skip a stone."
        />
        <p className="about__lake-hint">click the water to skip a stone</p>
      </section>
    </div>
  );
};

export default About;
