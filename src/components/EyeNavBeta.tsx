import React, { useEffect, useRef, useState } from 'react';

// Minimal native eye/head navigation (beta):
// - Uses MediaPipe Tasks Vision FaceLandmarker (local package)
// - Estimates head motion and scrolls page up/down based on relative movement
// - Includes calibration, unlock, sensitivity/deadzone tuning, and overlay

type AnyDetector = any;

const EyeNavBeta: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baselineYRef = useRef<number | null>(null);
  const smoothYRef = useRef<number | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [sensitivity, setSensitivity] = useState(0.7); // scroll scale
  const [thresholdPx, setThresholdPx] = useState(8); // deadzone in px
  const [faceFound, setFaceFound] = useState(false);

  useEffect(() => {
    const localVideo = videoRef.current;
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (localVideo) {
        localVideo.pause();
        if (localVideo.srcObject) {
          (localVideo.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        }
      }
    };
  }, []);

  const initLandmarker = async () => {
    const vision = await import('@mediapipe/tasks-vision');
    const { FaceLandmarker, FilesetResolver } = vision as any;
    // Try local assets first, then fall back to CDN if missing (avoids Unexpected token '<' from 404 HTML)
    let landmarker: any = null;
    let lastError: unknown = null;
    const attempts = [
      {
        wasmBase: '/mediapipe/wasm',
        model: '/mediapipe/models/face_landmarker.task'
      },
      {
        wasmBase: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm',
        model: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
      }
    ];
    for (const cfg of attempts) {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(cfg.wasmBase);
        landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: { modelAssetPath: cfg.model, delegate: 'GPU' },
          outputFaceBlendshapes: false,
          runningMode: 'LIVE_STREAM',
          numFaces: 1
        });
        detectorRef.current = landmarker;
        return;
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError ?? new Error('Failed to initialize FaceLandmarker');
  };

  const initModel = async () => {
    await initLandmarker();
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 360 } });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  };

  const loop = async () => {
    if (!running) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    const detector = detectorRef.current;
    if (v && detector) {
      try {
        const res = await detector.detectForVideo(v, performance.now());
        const faces = res?.faceLandmarks ?? [];
        const lm = faces[0];
        setFaceFound(!!lm);
        if (lm) {
          const kps = lm as Array<{ x: number; y: number; z?: number }>;
          // Draw overlay
          if (c) {
            if (c.width !== v.videoWidth || c.height !== v.videoHeight) {
              c.width = v.videoWidth;
              c.height = v.videoHeight;
            }
            const ctx = c.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, c.width, c.height);
              ctx.fillStyle = 'rgba(110, 249, 253, 0.9)';
              for (let i = 0; i < kps.length; i += 12) {
                const px = kps[i].x * c.width;
                const py = kps[i].y * c.height;
                ctx.beginPath();
                ctx.arc(px, py, 1.6, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
          const avgY = kps.reduce((acc, p) => acc + p.y, 0) / kps.length;
          if (baselineYRef.current == null) {
            baselineYRef.current = avgY;
            smoothYRef.current = avgY;
          }
          // Smooth Y
          const prev = smoothYRef.current ?? avgY;
          const smoothed = prev + (avgY - prev) * 0.15;
          smoothYRef.current = smoothed;
          const delta = smoothed - (baselineYRef.current ?? smoothed);
          if (unlocked && Math.abs(delta) > thresholdPx) {
            const adjusted = (delta - Math.sign(delta) * thresholdPx) * sensitivity;
            window.scrollBy({ top: adjusted, behavior: 'auto' });
          }
        }
      } catch (e) {
        // ignore frame errors
      }
    }
    rafRef.current = requestAnimationFrame(loop);
  };

  const onStart = async () => {
    try {
      setError(null);
      setLoading(true);
      // load local deps and model
      await startCamera();
      await initModel();
      baselineYRef.current = null;
      smoothYRef.current = null;
      setRunning(true);
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start EyeNav');
    } finally {
      setLoading(false);
    }
  };

  const onStop = () => {
    setRunning(false);
    setUnlocked(false);
    setFaceFound(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const v = videoRef.current;
    v?.pause();
    if (v?.srcObject) {
      (v.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      v.srcObject = null;
    }
  };

  return (
    <div className="project-widget-container" style={{ maxWidth: 600 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px' }}>
        <div style={{ color:'rgba(255,255,255,0.8)', fontWeight:600 }}>Eye Navigation (Native Beta)</div>
        {!running ? (
          <button className="widget-fullscreen-btn" onClick={onStart} disabled={loading}>
            {loading ? 'Loading…' : 'Start'}
          </button>
        ) : (
          <button className="widget-fullscreen-btn" onClick={onStop}>Stop</button>
        )}
      </div>
      {error && <div style={{ color:'#ff9c9c', padding:'0 12px 8px' }}>{error}</div>}
      <div style={{ padding:'0 12px 0', color:'rgba(255,255,255,0.75)', fontSize:12 }}>
        1) Center your face, 2) Press Calibrate, 3) Toggle Unlock, 4) Nod up/down.
      </div>
      <div style={{ padding:'8px 12px 0', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        <button className="project-link-button" onClick={() => { if (smoothYRef.current != null) baselineYRef.current = smoothYRef.current; }} disabled={!running}>
          <span>Calibrate</span>
        </button>
        <button className="project-link-button" onClick={() => setUnlocked(u => !u)} disabled={!running}>
          <span>{unlocked ? 'Lock' : 'Unlock'}</span>
        </button>
        <label style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>
          Sensitivity
          <input type="range" min={0.4} max={1.4} step={0.1} value={sensitivity} onChange={(e)=>setSensitivity(parseFloat(e.target.value))} style={{ marginLeft:8 }} />
        </label>
        <label style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>
          Deadzone
          <input type="range" min={4} max={20} step={1} value={thresholdPx} onChange={(e)=>setThresholdPx(parseInt(e.target.value))} style={{ marginLeft:8 }} />
        </label>
      </div>
      <div style={{ padding:'0 12px 12px', position:'relative' }}>
        <video ref={videoRef} playsInline muted style={{ width:'100%', borderRadius:8, background:'#000', opacity: running ? 0.9 : 0.3 }} />
        <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:8, left:16, color: faceFound ? '#9ff' : '#f99', fontSize:12, background:'rgba(0,0,0,0.35)', padding:'4px 8px', borderRadius:6 }}>
          {faceFound ? 'Face mesh: detected' : 'Face mesh: not detected'}
        </div>
      </div>
    </div>
  );
};

export default EyeNavBeta;


