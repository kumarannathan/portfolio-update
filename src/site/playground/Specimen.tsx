import React from 'react';
import './Playground.css';

interface SpecimenProps {
  name: string;
  /** Where the logic comes from in the original codebase. */
  source: string;
  description: string;
  /** Which product's look the demo wears. */
  skin: 'toshi' | 'yogger' | 'crm';
  children: React.ReactNode;
}

/** A live component from a project, framed like a page in a component library. */
const Specimen: React.FC<SpecimenProps> = ({ name, source, description, skin, children }) => (
  <figure className="spec">
    <figcaption className="spec__head">
      <div className="spec__title-row">
        <h3 className="spec__name">{name}</h3>
        <code className="spec__source">{source}</code>
      </div>
      <p className="spec__desc">{description}</p>
    </figcaption>
    <div className={`spec__stage spec__stage--${skin}`}>{children}</div>
  </figure>
);

export default Specimen;
