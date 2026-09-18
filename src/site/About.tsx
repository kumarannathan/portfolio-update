import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FadeContent from '../components/reactbits/FadeContent';
import { EXPERIENCE } from './data/experience';
import tdVideo from '../components/td.MP4';
import td1Video from '../components/td1.MP4';
import td2Video from '../components/td2.MP4';
import './About.css';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="about container">
      <FadeContent duration={700} threshold={0}>
        <header className="about__head">
          <img className="about__avatar" src={`${process.env.PUBLIC_URL || ''}/me.jpg`} alt="Kumaran Nathan" />
          <div>
            <h1 className="about__name">Kumaran Nathan</h1>
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
            and alive. the sketches on the <Link to="/">home page</Link> are that itch.
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
                <p className="xp__desc">{x.description}</p>
                <p className="xp__tech">{x.technologies}</p>
              </div>
              <div className="xp__period">{x.period}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section about__section">
        <h2 className="label label--left">currently</h2>
        <p className="about__blurb">
          experimenting with a <strong>TouchDesigner plugin</strong> for computer vision, bridging real-time CV models with
          generative visuals. right now it's going into a speed camera project that detects and visualizes motion as it
          happens.
        </p>
        <div className="about__videos">
          {[tdVideo, td1Video, td2Video].map((src) => (
            <video key={src} autoPlay loop muted playsInline preload="metadata" className="about__video">
              <source src={src} type="video/mp4" />
            </video>
          ))}
        </div>
      </section>

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
    </div>
  );
};

export default About;
