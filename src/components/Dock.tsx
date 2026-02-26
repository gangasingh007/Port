import { useState, useRef, useCallback, useEffect } from 'react';
import type { WindowState } from '@/hooks/useWindowManager';

interface DockProps {
  windows: WindowState[];
  bouncingApp: string | null;
  onAppClick: (id: string) => void;
}

const dockApps = [
  { id: 'about', label: 'Finder', color: '#1a73e8' },
  { id: 'projects', label: 'Projects', color: '#ff6b35' },
  { id: 'skills', label: 'System Settings', color: '#6d6d6d' },
  { id: 'terminal', label: 'Terminal', color: '#2d2d2d' },
  { id: 'resume', label: 'Safari', color: '#0fb5ee' },
  { id: 'contact', label: 'Messages', color: '#34c759' },
];

// Precomputed icon centers stored per index — updated on layout/resize
const useIconPositions = (count: number) => {
  const refs = useRef<(HTMLDivElement | null)[]>(Array(count).fill(null));
  return refs;
};

const icons: Record<string, JSX.Element> = {
  about: (
    <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4da3ff" />
          <stop offset="100%" stopColor="#1a73e8" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#blue-grad)" />
      <rect x="8" y="12" width="14" height="24" rx="2" fill="white" fillOpacity="0.95" />
      <rect x="26" y="12" width="14" height="10" rx="2" fill="white" fillOpacity="0.8" />
      <rect x="26" y="26" width="14" height="10" rx="2" fill="white" fillOpacity="0.8" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="orange-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9a6c" />
          <stop offset="100%" stopColor="#ff6b35" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#orange-grad)" />
      <rect x="8" y="8" width="14" height="14" rx="3" fill="white" fillOpacity="0.95" />
      <rect x="26" y="8" width="14" height="14" rx="3" fill="white" fillOpacity="0.8" />
      <rect x="8" y="26" width="14" height="14" rx="3" fill="white" fillOpacity="0.8" />
      <rect x="26" y="26" width="14" height="14" rx="3" fill="white" fillOpacity="0.6" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="gray-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#999" />
          <stop offset="100%" stopColor="#5c5c5c" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#gray-grad)" />
      <circle cx="24" cy="24" r="12" fill="none" stroke="white" strokeWidth="3" strokeOpacity="0.9" />
      <circle cx="24" cy="24" r="4" fill="white" fillOpacity="0.9" />
      <rect x="22" y="6" width="4" height="6" rx="2" fill="white" fillOpacity="0.9" />
      <rect x="22" y="36" width="4" height="6" rx="2" fill="white" fillOpacity="0.9" />
      <rect x="6" y="22" width="6" height="4" rx="2" fill="white" fillOpacity="0.9" />
      <rect x="36" y="22" width="6" height="4" rx="2" fill="white" fillOpacity="0.9" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="dark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#1e1e1e" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#dark-grad)" />
      <path d="M14 16l8 8-8 8" stroke="#34c759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="26" y1="32" x2="36" y2="32" stroke="#34c759" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  resume: (
    <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="cyan-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60d8ff" />
          <stop offset="100%" stopColor="#0fb5ee" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#cyan-grad)" />
      <circle cx="24" cy="24" r="14" fill="white" fillOpacity="0.2" />
      <path d="M24 10C16.3 10 10 16.3 10 24s6.3 14 14 14c3.1 0 5.9-1 8.2-2.7L24 24V10z" fill="white" fillOpacity="0.95" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ee87a" />
          <stop offset="100%" stopColor="#28a745" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#green-grad)" />
      <path d="M10 14h28v18a2 2 0 01-2 2H14l-6 4V16a2 2 0 012-2z" fill="white" fillOpacity="0.95" />
    </svg>
  ),
};

interface DockIconProps {
  app: typeof dockApps[0];
  isOpen: boolean;
  isBouncing: boolean;
  mouseX: number | null;
  iconRef: (el: HTMLDivElement | null) => void;
  onClick: () => void;
}

const DockIcon = ({ app, isOpen, isBouncing, mouseX, iconRef: setRef, onClick }: DockIconProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);

  // Update scale whenever mouseX changes
  useEffect(() => {
    if (mouseX === null || !divRef.current) {
      setScale(1);
      return;
    }
    const rect = divRef.current.getBoundingClientRect();
    const iconCenter = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - iconCenter);
    const maxDist = 120;
    if (distance > maxDist) {
      setScale(1);
    } else {
      // Smooth cosine falloff
      const newScale = 1 + 0.55 * Math.cos((distance / maxDist) * (Math.PI / 2));
      setScale(newScale);
    }
  }, [mouseX]);

  const handleRef = useCallback((el: HTMLDivElement | null) => {
    (divRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    setRef(el);
  }, [setRef]);

  return (
    <div
      ref={handleRef}
      className="relative flex flex-col items-center pb-1 cursor-pointer select-none"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
        transition: mouseX === null
          ? 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'transform 0.05s linear',
        willChange: 'transform',
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
    >
      {/* Tooltip */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap pointer-events-none select-none"
        style={{
          background: 'rgba(28,28,30,0.88)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.92)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
          opacity: showTooltip ? 1 : 0,
          transform: `translateX(-50%) translateY(${showTooltip ? 0 : 4}px)`,
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}
      >
        {app.label}
        {/* Arrow */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
          style={{
            background: 'rgba(28,28,30,0.88)',
            borderRight: '1px solid rgba(255,255,255,0.12)',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
          }}
        />
      </div>

      {/* Icon */}
      <div
        className="w-12 h-12 relative"
        style={{
          animation: isBouncing ? 'dock-bounce 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite' : 'none',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
          transition: 'filter 0.15s ease',
        }}
      >
        {/* Glow ring on hover */}
        <div
          className="absolute inset-0 rounded-[10px] pointer-events-none"
          style={{
            boxShadow: showTooltip ? `0 0 0 2px rgba(255,255,255,0.18), 0 8px 24px rgba(0,0,0,0.35)` : 'none',
            transition: 'box-shadow 0.15s ease',
            borderRadius: '10px',
          }}
        />
        {icons[app.id]}
      </div>

      {/* Open indicator dot */}
      <div
        className="absolute -bottom-1 w-1 h-1 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.85)',
          boxShadow: '0 0 5px rgba(255,255,255,0.7)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />

      <style>{`
        @keyframes dock-bounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-12px); }
          60% { transform: translateY(-5px); }
          80% { transform: translateY(-9px); }
        }
      `}</style>
    </div>
  );
};

const Dock = ({ windows, bouncingApp, onAppClick }: DockProps) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>(Array(dockApps.length).fill(null));

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);
  const handleIconClick = useCallback((id: string) => {
    onAppClick(id);
  }, [onAppClick]);

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[100]">
      {/* Dock container */}
      <div
        className="relative flex items-end gap-2 px-4 pb-3 pt-2"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '24px',
          boxShadow:
            '0 12px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Subtle inner highlight */}
        <div
          className="absolute inset-x-4 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
          }}
        />

        {dockApps.map((app, i) => (
          <DockIcon
            key={app.id}
            app={app}
            isOpen={windows.find(w => w.id === app.id)?.isOpen ?? false}
            isBouncing={bouncingApp === app.id}
            mouseX={mouseX}
            iconRef={(el) => { iconRefs.current[i] = el; }}
            onClick={() => handleIconClick(app.id)}
          />
        ))}
      </div>

      {/* Dock shelf reflection */}
      <div
        className="mt-1 mx-6 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        }}
      />
    </div>
  );
};

export default Dock;