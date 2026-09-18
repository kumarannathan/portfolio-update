import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

/** A small ← in the top left. Goes back if there's history, otherwise to the fallback route. */
const BackButton: React.FC<{ fallback: string; label?: string }> = ({ fallback, label = 'back' }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="backbtn"
      onClick={() => {
        if (window.history.state && window.history.state.idx > 0) navigate(-1);
        else navigate(fallback);
      }}
      aria-label={label}
      title={label}
    >
      <span aria-hidden>←</span>
    </button>
  );
};

export default BackButton;
