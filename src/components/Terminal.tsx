import React, { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to KumaranOS v1.0' },
    { type: 'output', content: 'Type "help" to see available commands' },
    { type: 'output', content: '' }
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Airplane mini-game state
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [planeRow, setPlaneRow] = useState(2);
  const [obstacles, setObstacles] = useState<{ col: number, row: number }[]>([]);
  const [airplaneScore, setAirplaneScore] = useState(0);
  const gameIntervalRef = useRef<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const commands: { [key: string]: () => string } = {
    help: () => `Available commands:
  help         - Show this help message
  about        - Learn more about me
  projects     - View my projects
  experience   - View my work experience
  skills       - View my technical skills
  contact      - Get my contact information
  airplane     - Play a mini ASCII plane game
  eyenav       - Try eye-based page scrolling (external demo)
  clear        - Clear the terminal
  whoami       - Display current user
  date         - Display current date`,
    
    about: () => `I'm a Computer Science graduate from the University of Michigan with a 
passion for full-stack development, UI/UX design, and emerging technologies. 
My experience spans across web development, AR/VR applications, and data 
analytics. I've worked with companies like Snapchat and led development 
teams at WolverineSoft.`,
    
    projects: () => `Recent Projects:
  • Focus Zone - React, MediaPipe, Computer Vision, Hand Gesture
  • Smart Meeting Summarizer - React, FastAPI, AssemblyAI, OpenRouter
  • Test Generation Platform - React, Node.js, Python, Gemini API
  • JobSim VR - Unity, C#, VR

Scroll down to see detailed descriptions!`,

    eyenav: () => `Eye Navigation (demo):
  Scroll a page hands-free using head/eye gestures.
  Demo: https://scrolling-web-page-with-your-eyes.glitch.me/
  Repo: https://github.com/Arcady1/Eye-tracker

How to use (on the demo):
  1) Allow camera access
  2) Wait for face recognition
  3) Double-blink to unlock, nod up/down to scroll
  4) Double-blink again to stop`,

    experience: () => `Work Experience:
  • Freelance Developer (Mar 2025 - Present)
    Full Stack Developer
  
  • EinNel Technologies (Jul 2024 - Oct 2024)
    Frontend Web Developer & Designer
  
  • Snapchat (Mar 2024 - May 2024)
    AR & Digital Developer
  
  • WolverineSoft (Aug 2023 - May 2024)
    UI/UX & QA Department Lead`,
    
    skills: () => `Technical Skills:
  Frontend: React, TypeScript, JavaScript, HTML/CSS, Swift
  Backend: Node.js, Python, SQL, AWS, REST APIs, C++
  AI/CV: PyTorch, OpenCV, YOLOv8, MediaPipe
  Tools: Git, Figma, VS Code, Jira, Agile/Scrum`,
    
    contact: () => `Contact Information:
  Email: kumarann@umich.edu
  Location: Ann Arbor, MI
  LinkedIn: linkedin.com/in/kkumarann
  
Feel free to reach out!`,

    airplane: () => {
      setAirplaneMode(true);
      setPlaneRow(2);
      setObstacles([]);
      setAirplaneScore(0);
      setGameOver(false);
      return 'Launching ASCII Airplane Game! Use W/S or arrow keys to move up/down, avoid the | bars! Type "quit" or press Escape to exit.';
    },

    clear: () => {
      setHistory([]);
      return '';
    },
    
    whoami: () => 'kumaran',
    
    date: () => new Date().toString(),
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    setHistory(prev => [...prev, { type: 'input', content: `$ ${cmd}` }]);
    
    if (!trimmedCmd) {
      setHistory(prev => [...prev, { type: 'output', content: '' }]);
      return;
    }

    if (airplaneMode && (trimmedCmd === 'quit' || trimmedCmd === 'exit')) {
      // end game
      setAirplaneMode(false);
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
      setHistory(prev => [...prev, { type: 'output', content: `Game exited. Score: ${airplaneScore}` }]);
      return;
    }

    if (commands[trimmedCmd]) {
      const output = commands[trimmedCmd]();
      if (output) {
        setHistory(prev => [...prev, { type: 'output', content: output }]);
      }
    } else {
      setHistory(prev => [...prev, { 
        type: 'error', 
        content: `Command not found: ${trimmedCmd}. Type "help" for available commands.` 
      }]);
    }
    
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // Game loop
  useEffect(() => {
    if (!airplaneMode) return;
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    const interval = window.setInterval(() => {
      setObstacles((prev) => {
        const moved = prev
          .map(o => ({ ...o, col: o.col - 1 }))
          .filter(o => o.col >= 0);
        if (Math.random() < 0.27) {
          moved.push({ col: 19, row: Math.floor(Math.random() * 5) });
        }
        return moved;
      });
    }, 160);
    gameIntervalRef.current = interval;
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
    };
  }, [airplaneMode]);

  // Collision + scoring
  useEffect(() => {
    if (!airplaneMode) return;
    for (let o of obstacles) {
      if (o.col === 1 && o.row === planeRow) {
        setAirplaneMode(false);
        setGameOver(true);
        if (gameIntervalRef.current) {
          clearInterval(gameIntervalRef.current);
          gameIntervalRef.current = null;
        }
        setHistory(prev => [...prev, { type: 'output', content: `GAME OVER! Plane crashed. Final score: ${airplaneScore}` }]);
        return;
      }
    }
    const points = obstacles.filter(o => o.col === 0).length;
    if (points) setAirplaneScore(s => s + points);
  }, [obstacles, planeRow, airplaneMode, airplaneScore, setHistory]);

  // Keyboard for game
  useEffect(() => {
    if (!airplaneMode || gameOver) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') {
        setPlaneRow(row => Math.max(0, row - 1));
        e.preventDefault();
      } else if (e.key === 's' || e.key === 'ArrowDown') {
        setPlaneRow(row => Math.min(4, row + 1));
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setAirplaneMode(false);
        if (gameIntervalRef.current) {
          clearInterval(gameIntervalRef.current);
          gameIntervalRef.current = null;
        }
        setHistory(prev => [...prev, { type: 'output', content: `Game exited. Score: ${airplaneScore}` }]);
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [airplaneMode, gameOver, airplaneScore]);

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-button close"></span>
          <span className="terminal-button minimize"></span>
          <span className="terminal-button maximize"></span>
        </div>
        <div className="terminal-title">kumaran@portfolio:~</div>
      </div>
      <div className="terminal-body" ref={terminalRef} onClick={() => inputRef.current?.focus()}>
        {history.map((line, idx) => (
          <div key={idx} className={`terminal-line terminal-${line.type}`}>
            {line.content}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
        {airplaneMode && (
          <div style={{ margin: '18px 0', width:'100%', display:'flex', justifyContent:'center' }}>
            <pre className="ascii-airplane-game" style={{ background:'rgba(0,0,0,0.22)', color:'#6EF9FD', fontSize:'16px', lineHeight:'18px', letterSpacing:'1px', borderRadius:'9px', padding:'13px 25px', margin:'0 auto', minWidth:'380px', maxWidth:'99%' }}>
              {(()=>{
                  // 5 rows, 20 cols
                  let rows = [];
                  for (let r=0; r<5; ++r) {
                    let rowText = '';
                    for (let c=0; c<20; ++c) {
                      const isPlane = (r===planeRow && c===1);
                      const obsHere = obstacles.find(o => o.row===r && o.col===c);
                      rowText += isPlane ? '✈️ ' : (obsHere ? '| ' : '  ');
                    }
                    rows.push(rowText);
                  }
                  return rows.join('\n');
                })()}
            </pre>
            <div style={{ marginLeft:'20px', color:'#fff', fontWeight:'500', fontSize:'15px' }}>
              <div>Score: {airplaneScore}</div>
              <div style={{fontSize:'12px',marginTop:'8px', color:'#9ff'}}><kbd style={{background:'#222',padding:'2px 7px',borderRadius:'4px'}}>W / ↑</kbd> up<br/><kbd style={{background:'#222',padding:'2px 7px',borderRadius:'4px'}}>S / ↓</kbd> down</div>
              <div style={{fontSize:'11px',marginTop:'10px'}}>Type quit or Esc to exit</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;

