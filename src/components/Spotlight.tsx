import { useState, useEffect, useRef } from 'react';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

const items = [
  { id: 'about', label: 'About Me', subtitle: 'Finder — Overview, Experience, Education' },
  { id: 'projects', label: 'Projects', subtitle: 'View portfolio projects' },
  { id: 'skills', label: 'Skills', subtitle: 'System Settings — Languages, Frameworks, Tools' },
  { id: 'terminal', label: 'Terminal', subtitle: 'Interactive command line' },
  { id: 'resume', label: 'Resume', subtitle: 'Safari — View resume' },
  { id: 'contact', label: 'Contact', subtitle: 'Messages — Get in touch' },
];

const Spotlight = ({ isOpen, onClose, onSelect }: SpotlightProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(query.toLowerCase()) ||
    i.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
      if (e.key === 'ArrowUp') setSelectedIndex(i => Math.max(i - 1, 0));
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        onSelect(filtered[selectedIndex].id);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, filtered, selectedIndex, onClose, onSelect]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[300] bg-background/40" onClick={onClose} />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[640px] max-w-[90vw] z-[301] mac-glass rounded-xl overflow-hidden animate-fade-in mac-window-shadow">
        <div className="flex items-center px-4 py-3 gap-3 border-b border-foreground/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/40 shrink-0">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Spotlight Search"
            className="flex-1 bg-transparent text-lg text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        {filtered.length > 0 && (
          <div className="py-1 max-h-80 overflow-auto">
            {filtered.map((item, i) => (
              <button
                key={item.id}
                className={`w-full text-left px-4 py-2.5 flex flex-col gap-0.5 mac-transition ${
                  i === selectedIndex ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-foreground/5'
                }`}
                onClick={() => { onSelect(item.id); onClose(); }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className={`text-xs ${i === selectedIndex ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {item.subtitle}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Spotlight;
