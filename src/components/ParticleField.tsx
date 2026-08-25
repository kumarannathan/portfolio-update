import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Points } from 'three';
import './ParticleField.css';

const COUNT = 16000;

function useGlobalPointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return pointer;
}

const ParticleBlob: React.FC<{ pointer: React.MutableRefObject<{ x: number; y: number }> }> = ({ pointer }) => {
  const pointsRef = useRef<Points>(null);

  const { positions, originalPositions } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const originalPositions = new Float32Array(COUNT * 3);

    let i = 0;
    while (i < COUNT) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 13;
      const z = (Math.random() - 0.5) * 4;
      const y = Math.sin(x * 0.7) * 0.35 + Math.cos(z * 1.4) * 0.2 + Math.sin(x * 1.8 + z) * 0.12;

      const holeDist = Math.hypot(x - 0.6, z);
      if (holeDist < 0.9) continue;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;
      i++;
    }

    return { positions, originalPositions };
  }, []);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const posAttr = points.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    const mouseX = pointer.current.x * 6;
    const mouseY = pointer.current.y * 3;

    for (let idx = 0; idx < posAttr.length; idx += 3) {
      const ox = originalPositions[idx];
      const oy = originalPositions[idx + 1];
      const oz = originalPositions[idx + 2];

      const dx = ox - mouseX;
      const dy = oy - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, 1 - dist / 2.4);
      const push = force * force * 0.6;

      posAttr[idx] += (ox + dx * push - posAttr[idx]) * 0.08;
      posAttr[idx + 1] += (oy + Math.sin(ox * 2 + t) * 0.03 + dy * push - posAttr[idx + 1]) * 0.08;
      posAttr[idx + 2] += (oz + Math.cos(ox + t) * 0.04 - posAttr[idx + 2]) * 0.08;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.rotation.y = Math.sin(t * 0.12) * 0.06;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e8e8e2" size={0.016} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  );
};

const ParticleField: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const pointer = useGlobalPointer();

  return (
    <div className="particle-field" style={{ opacity }} aria-hidden="true">
      <Canvas camera={{ position: [0, 1.2, 7.5], fov: 45 }} dpr={[1, 1.5]}>
        <ParticleBlob pointer={pointer} />
      </Canvas>
    </div>
  );
};

export default ParticleField;
