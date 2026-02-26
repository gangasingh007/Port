import { useState, useCallback } from 'react';

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  defaultSize: { width: number; height: number };
}

const defaultWindows: Omit<WindowState, 'zIndex' | 'isOpen' | 'isMinimized' | 'isMaximized'>[] = [
  { id: 'about', title: 'Finder', icon: 'finder', position: { x: 80, y: 60 }, size: { width: 780, height: 500 }, defaultSize: { width: 780, height: 500 } },
  { id: 'projects', title: 'Projects', icon: 'projects', position: { x: 150, y: 80 }, size: { width: 820, height: 540 }, defaultSize: { width: 820, height: 540 } },
  { id: 'skills', title: 'System Settings', icon: 'settings', position: { x: 120, y: 70 }, size: { width: 760, height: 500 }, defaultSize: { width: 760, height: 500 } },
  { id: 'terminal', title: 'Terminal', icon: 'terminal', position: { x: 200, y: 100 }, size: { width: 680, height: 440 }, defaultSize: { width: 680, height: 440 } },
  { id: 'resume', title: 'Safari', icon: 'safari', position: { x: 100, y: 50 }, size: { width: 840, height: 560 }, defaultSize: { width: 840, height: 560 } },
  { id: 'contact', title: 'Messages', icon: 'messages', position: { x: 250, y: 90 }, size: { width: 700, height: 480 }, defaultSize: { width: 700, height: 480 } },
];

let maxZ = 10;

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>(
    defaultWindows.map(w => ({ ...w, zIndex: 10, isOpen: false, isMinimized: false, isMaximized: false }))
  );
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [bouncingApp, setBouncingApp] = useState<string | null>(null);

  const openWindow = useCallback((id: string) => {
    setBouncingApp(id);
    setTimeout(() => setBouncingApp(null), 600);

    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        maxZ++;
        return { ...w, isOpen: true, isMinimized: false, zIndex: maxZ };
      }
      return w;
    }));
    setFocusedWindowId(id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false, isMaximized: false } : w));
    setFocusedWindowId(prev => prev === id ? null : prev);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setFocusedWindowId(prev => prev === id ? null : prev);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, isMaximized: !w.isMaximized };
      }
      return w;
    }));
  }, []);

  const focusWindow = useCallback((id: string) => {
    maxZ++;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZ } : w));
    setFocusedWindowId(id);
  }, []);

  const updatePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position } : w));
  }, []);

  const updateSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size } : w));
  }, []);

  return {
    windows,
    focusedWindowId,
    bouncingApp,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
    updateSize,
  };
}
