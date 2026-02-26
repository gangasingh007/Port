import { useRef, useState, useCallback, useEffect } from 'react';
import type { WindowState } from '@/hooks/useWindowManager';

interface MacWindowProps {
  window: WindowState;
  isFocused: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (pos: { x: number; y: number }) => void;
  children: React.ReactNode;
}

const MacWindow = ({
  window: win,
  isFocused,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  children,
}: MacWindowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.traffic-lights')) return;
    e.preventDefault();
    onFocus();
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - win.position.x,
      y: e.clientY - win.position.y,
    };
  }, [win.position, onFocus]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      onPositionChange({
        x: e.clientX - dragOffset.current.x,
        y: Math.max(28, e.clientY - dragOffset.current.y), // Keep below menu bar
      });
    };
    const handleUp = () => setIsDragging(false);
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, onPositionChange]);

  const handleClose = () => {
    // Call onClose immediately so there is no delayed close
    // that can race with a quick re-open from the dock.
    onClose();
  };

  const handleMinimize = () => {
    setIsMinimizing(true);
    setTimeout(() => {
      onMinimize();
      setIsMinimizing(false);
    }, 400);
  };

  if (!win.isOpen || win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { top: 28, left: 0, width: '100vw', height: 'calc(100vh - 28px)', zIndex: win.zIndex }
    : { top: win.position.y, left: win.position.x, width: win.size.width, height: win.size.height, zIndex: win.zIndex };

  return (
    <div
      className={`fixed flex flex-col overflow-hidden rounded-xl transition-transform duration-75 ease-out
        /* Material & Blur */
        bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/10
        /* Lighting & Shadows */
        shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] 
        ${isFocused ? 'shadow-[0_30px_60px_rgba(0,0,0,0.6)]' : 'shadow-[0_15px_30px_rgba(0,0,0,0.4)]'}
        /* Animations */
        ${isClosing ? 'animate-window-close' : 'animate-window-open'} 
        ${isMinimizing ? 'animate-minimize' : ''}
        ${isDragging ? 'scale-[0.99] opacity-95 cursor-grabbing' : 'scale-100'}
      `}
      style={style}
      onMouseDown={() => onFocus()}
    >
      {/* Title bar */}
      <div
        className={`h-12 flex items-center px-4 shrink-0 select-none border-b border-white/5 transition-colors duration-200 ${
          isDragging ? 'cursor-grabbing' : 'cursor-default'
        } ${isFocused ? 'bg-white/5' : 'bg-transparent'}`}
        onMouseDown={handleMouseDown}
      >
        {/* Traffic lights */}
        <div className={`traffic-lights flex items-center gap-2 mr-4 transition-opacity duration-200 ${
          isFocused ? 'opacity-100' : 'opacity-40 grayscale' // Grayscale when unfocused!
        }`}>
          <button
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all group relative border border-[#e0443e]"
          >{}
            <svg className="w-2 h-2 absolute inset-0.5 opacity-0 group-hover:opacity-100 text-[#4d0000]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
          <button
            onClick={handleMinimize}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all group relative border border-[#dea123]"
          >{}
            <svg className="w-2 h-2 absolute inset-0.5 opacity-0 group-hover:opacity-100 text-[#995700]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 6h8" />
            </svg>
          </button>
          <button
            onClick={onMaximize}
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-all group relative border border-[#1aab29]"
          >{}
            <svg className="w-1.5 h-1.5 absolute inset-[2.5px] opacity-0 group-hover:opacity-100 text-[#006500]" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 2h3v1H3v2H2V2zM7 2h3v3h-1V3H7V2zM2 7h1v2h2v1H2V7zM9 9H7v1h3V7h-1v2z" />
            </svg>
          </button>
        </div>
        
        {/* Window Title */}
        <span className={`text-sm font-medium flex-1 text-center pr-16 transition-colors duration-200 ${
          isFocused ? 'text-gray-200' : 'text-gray-500'
        }`}>
          {win.title}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-black/20">
        {children}
      </div>
    </div>
  );
};

export default MacWindow;