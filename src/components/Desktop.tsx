import { useState, useCallback, useEffect, useRef } from 'react';
import { useWindowManager } from '@/hooks/useWindowManager';

import MenuBar from '@/components/MenuBar';
import Dock from '@/components/Dock';
import MacWindow from '@/components/MacWindow';
import Spotlight from '@/components/Spotlight';
import ContextMenu from '@/components/ContextMenu';
import Notification from '@/components/Notification';
import BootScreen from '@/components/BootScreen';

import AboutMe from '@/components/apps/AboutMe';
import Projects from '@/components/apps/Projects';
import Skills from '@/components/apps/Skills';
import Terminal from '@/components/apps/Terminal';
import Resume from '@/components/apps/Resume';
import Contact from '@/components/apps/Contact';

import bg1 from "../assets/background.avif";
import bg2 from "../assets/bg.avif";
import bg3 from "../assets/bg.jpg";
import bg4 from "../assets/bg2.jpg";
import bg5 from "../assets/bg3.jpg";
import bg6 from "../assets/bg4.jpg";
import bg7 from "../assets/bg5.jpg";
import bg8 from "../assets/bg6.jpg";
import bg9 from "../assets/bg7.jpg";
import bg10 from "../assets/bg1.jpg";

const appContent: Record<string, () => JSX.Element> = {
  about: () => <AboutMe />,
  projects: () => <Projects />,
  skills: () => <Skills />,
  terminal: () => <Terminal />,
  resume: () => <Resume />,
  contact: () => <Contact />,
};

const imageWallpapers = [
  { id: 'wall-1', label: 'Wallpaper 1', src: bg1 },
  { id: 'wall-2', label: 'Wallpaper 2', src: bg2 },
  { id: 'wall-3', label: 'Wallpaper 3', src: bg3 },
  { id: 'wall-4', label: 'Wallpaper 4', src: bg4 },
  { id: 'wall-5', label: 'Wallpaper 5', src: bg5 },
  { id: 'wall-6', label: 'Wallpaper 6', src: bg6 },
  { id: 'wall-7', label: 'Wallpaper 7', src: bg7 },
  { id: 'wall-8', label: 'Wallpaper 8', src: bg8 },
  { id: 'wall-9', label: 'Wallpaper 9', src: bg9 },
  { id: 'wall-10', label: 'Wallpaper 10', src: bg10 },
] as const;

const Desktop = () => {
  const [booted, setBooted] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [waking, setWaking] = useState(false);

  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [contextMenu, setContextMenu] =
    useState<{ x: number; y: number } | null>(null);

  const [clockTime, setClockTime] = useState(new Date());
  const [wallpaperIndex, setWallpaperIndex] = useState(0);

  const desktopRef = useRef<HTMLDivElement>(null);

  const {
    windows,
    focusedWindowId,
    bouncingApp,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
  } = useWindowManager();

  useEffect(() => {
    const i = setInterval(() => setClockTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWallpaperIndex(prev =>
        (prev + 1) % imageWallpapers.length
      );
    }, 10000); 
  
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        setSpotlightOpen(p => !p);
      }

      if (e.key === 'Escape') {
        setContextMenu(null);
        setSpotlightOpen(false);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleAppleMenuAction = useCallback(
    (action: string) => {
      if (action === 'about') openWindow('about');
      if (action === 'sleep') setSleeping(true);
      if (action === 'restart') setBooted(false);
    },
    [openWindow]
  );

  const handleContextAction = useCallback(
    (action: string) => {
      if (action === 'finder') openWindow('about');
      if (action === 'about-portfolio') openWindow('about');
    },
    [openWindow]
  );

  const handleDesktopContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    },
    []
  );

  const handleWake = useCallback(() => {
    if (!sleeping) return;
    setWaking(true);
    setTimeout(() => {
      setSleeping(false);
      setWaking(false);
    }, 600);
  }, [sleeping]);

  if (!booted) {
    return <BootScreen onComplete={() => setBooted(true)} />;
  }

  const activeWallpaper = imageWallpapers[wallpaperIndex].src;

  return (
    <div
      ref={desktopRef}
      className="fixed inset-0  z-[-100] overflow-hidden select-none bg-black"
      onContextMenu={handleDesktopContextMenu}
      onClick={() => setContextMenu(null)}
    >
      {/* ===== Wallpaper ===== */}
      <div
        className="absolute z-[-10] inset-0"
        style={{
          backgroundImage: `url('${activeWallpaper}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ===== Vignette ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* ===== Sleep Screen ===== */}
      <div
        className={`fixed inset-0 bg-black z-[9998] transition-opacity pointer-events-none ${
          sleeping && !waking ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
        onClick={handleWake}
      />

      {/* ===== Clock ===== */}
      {windows.length === 0 && !sleeping && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="text-[min(16vw,160px)] font-thin text-white/10 tabular-nums">
            {clockTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </div>
          <div className="mt-4 text-sm tracking-[0.3em] uppercase text-white/10">
            {clockTime.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      )}

      {/* ===== UI Layer ===== */}
      <div className="relative z-10">
        <MenuBar
          focusedApp={focusedWindowId}
          onAppleMenuAction={handleAppleMenuAction}
          onSpotlightOpen={() => setSpotlightOpen(true)}
        />

        {windows.map(win => (
          <MacWindow
            key={win.id}
            window={win}
            isFocused={focusedWindowId === win.id}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onPositionChange={pos => updatePosition(win.id, pos)}
          >
            {appContent[win.id]()}
          </MacWindow>
        ))}

        <Dock
          windows={windows}
          bouncingApp={bouncingApp}
          onAppClick={openWindow}
        />

        <Spotlight
          isOpen={spotlightOpen}
          onClose={() => setSpotlightOpen(false)}
          onSelect={openWindow}
        />

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onAction={handleContextAction}
          />
        )}

        <Notification />
      </div>
    </div>
  );
};

export default Desktop;