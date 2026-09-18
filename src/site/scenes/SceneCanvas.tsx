import React, { useEffect, useRef } from 'react';
import { mountScene, Scene } from './canvas';
import './scenes.css';

interface SceneCanvasProps {
  scene: Scene;
  aspect: number;
  label: string;
  className?: string;
}

/** React wrapper around a procedural canvas scene. */
const SceneCanvas: React.FC<SceneCanvasProps> = ({ scene, aspect, label, className = '' }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    return mountScene(canvas, scene, aspect);
  }, [scene, aspect]);

  return (
    <div className={`scene ${className}`.trim()}>
      <canvas ref={ref} role="img" aria-label={label} />
    </div>
  );
};

export default SceneCanvas;
