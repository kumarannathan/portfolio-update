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

  const commands: { [key: string]: () => string } = {
    help: () => `Available commands:
  help         - Show this help message
  about        - Learn more about me
  projects     - View my projects
  experience   - View my work experience
  skills       - View my technical skills
  contact      - Get my contact information
  clear        - Clear the terminal
  whoami       - Display current user
  date         - Display current date`,
    
    about: () => `I'm a Computer Science graduate from the University of Michigan with a 
passion for full-stack development, UI/UX design, and emerging technologies. 
My experience spans across web development, AR/VR applications, and data 
analytics. I've worked with companies like Snapchat and led development 
teams at WolverineSoft.`,
    
    projects: () => `Recent Projects:
  • Test Generation Platform - React, TypeScript, Node.js, Python
  • Social Platform Database - Java, JDBC, Oracle SQL
  • TennisCV - Computer Vision Pipeline
  • DanceAR - AR Fitness Platform
  • SmartReview - AI Chrome Extension
  • JobSim VR - Corporate Life Simulator
  
Scroll down to see detailed descriptions!`,
    
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
      </div>
    </div>
  );
};

export default Terminal;

