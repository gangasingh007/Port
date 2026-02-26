import { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  type: 'input' | 'output' | 'system';
  content: React.ReactNode;
}

const commands: Record<string, React.ReactNode> = {
  help: (
    <div className="text-gray-300">
      Available commands:<br/>
      <span className="text-green-400">whoami</span>      — About me<br/>
      <span className="text-green-400">cat resume</span>  — View resume<br/>
      <span className="text-green-400">skills</span>      — List skills<br/>
      <span className="text-green-400">contact</span>     — Contact info<br/>
      <span className="text-green-400">clear</span>       — Clear terminal<br/>
      <span className="text-green-400">help</span>        — Show this help
    </div>
  ),
  whoami: (
    <div className="text-gray-300">
      Ganga Singh<br/>
      Full Stack Developer | Ludhiana, India<br/>
      Passionate about building beautiful web experiences.
    </div>
  ),
 
  'cat resume': (
    <div className="text-gray-300">
      <div className="border-b border-dashed border-gray-500 pb-2 mb-2">
        <span className="font-bold text-white">Ganga Singh</span> — Full Stack Developer
      </div>

      <span className="text-yellow-200 font-bold">EDUCATION</span><br/>
      &nbsp;&nbsp;Btech in CSE — Guru Nanak Dev University, Amritsar<br/><br/>
      <span className="text-yellow-200 font-bold">SKILLS</span><br/>
      &nbsp;&nbsp;Frontend: React, TypeScript, Tailwind, NextJs, GSAP<br/>
      &nbsp;&nbsp;Backend:  Node.js, Python, PostgreSQL, Redis, WebSockets<br/>
      &nbsp;&nbsp;DevOps:   Docker, AWS, CI/CD<br/>
    </div>
  ),
  skills: (
    <div className="text-gray-300">
      <span className="text-cyan-400"> Languages:</span><br/>
      &nbsp;&nbsp;TypeScript <span className="text-green-400">████████░░</span> 95%<br/>
      &nbsp;&nbsp;JavaScript <span className="text-green-400">████████░░</span> 95%<br/>
      &nbsp;&nbsp;Python     <span className="text-yellow-400">███████░░░</span> 80%<br/>
      <span className="text-cyan-400"> Frameworks:</span><br/>
      &nbsp;&nbsp;React      <span className="text-green-400">████████░░</span> 95%<br/>
      &nbsp;&nbsp;Next.js    <span className="text-green-400">████████░░</span> 85%<br/>
      &nbsp;&nbsp;Node.js    <span className="text-green-400">█████████░</span> 90%<br/>
    </div>
  ),
  contact: (
    <div className="text-gray-300">
      Email:    <a href="mailto:gangasingh734@gmail.com" className="text-blue-400 hover:underline">gangasingh734@gmail.com</a><br/>
      Website:  <a href="/" className="text-blue-400 hover:underline">portfolio.com</a><br/>
      GitHub:   <a href="https://github.com/gangasingh007" className="text-blue-400 hover:underline">github.com/gangasingh007</a>
    </div>
  ),
};

const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: `Last login: Mon Feb 23 17:29:43 on ttys000` },
    { type: 'system', content: 'Welcome to Terminal v1.0.0. Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  
  // Command History State
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInput(history[history.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(history[history.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) {
      setLines(prev => [...prev, { type: 'input', content: '' }]);
      return;
    }

    // Update History
    setHistory(prev => [...prev, cmd]);
    setHistoryIdx(-1);

    const newLines = [...lines, { type: 'input' as const, content: cmd }];

    if (cmd === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

    const output = commands[cmd];
    if (output) {
      newLines.push({ type: 'output', content: output });
    } else {
      newLines.push({ type: 'output', content: <span className="text-red-400">zsh: command not found: {cmd}</span> });
    }

    setLines(newLines);
    setInput('');
  };

  const Prompt = () => (
    <span className="mr-2 select-none">
      <span className="text-green-400 font-medium">visitor</span>
      <span className="text-gray-400">@</span>
      <span className="text-blue-400 font-medium">gangasingh</span>
      <span className="text-gray-400"> ~ %</span>
    </span>
  );

  return (
    <div
      className="h-full p-4 overflow-x-hidden overflow-y-auto cursor-text bg-black font-mono text-[16px] leading-relaxed selection:bg-gray-500/50"
      style={{ fontFamily: 'Menlo, Monaco, "Courier New", monospace' }}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div key={i} className="mb-1 break-words">
          {line.type === 'system' && (
            <div className="text-gray-500">{line.content}</div>
          )}
          {line.type === 'input' && (
            <div>
              <Prompt />
              <span className="text-white/30">{line.content}</span>
            </div>
          )}
          {line.type === 'output' && (
            <div className="mt-1 mb-2">{line.content}</div>
          )}
        </div>
      ))}
      
      {/* Active Input Line */}
      <form onSubmit={handleSubmit} className="flex mt-1">
        <Prompt />
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white outline-none caret-gray-300"
          autoFocus
          placeholder='...'
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </form>
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

export default Terminal;