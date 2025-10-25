import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0); // 0: setting up, 1: loading
  const [dots, setDots] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Stage 1: Setting up
    const setupTimer = setTimeout(() => {
      setStage(1);
    }, 500);

    return () => clearTimeout(setupTimer);
  }, []);

  useEffect(() => {
    if (stage === 1) {
      // Animate dots while loading
      const dotsInterval = setInterval(() => {
        setDots((prev) => {
          if (prev === '...') return '.';
          return prev + '.';
        });
      }, 400);

      // Complete loading after dots animation
      const completeTimer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(onComplete, 600);
      }, 2000);

      return () => {
        clearInterval(dotsInterval);
        clearTimeout(completeTimer);
      };
    }
  }, [stage, onComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="scanlines"></div>
      <div className="loading-content">
        <div className="loading-text">
          {stage >= 0 && <div className="loading-prompt">&gt; setting up</div>}
          {stage >= 1 && (
            <div className="loading-prompt">
              &gt; loading{dots}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
