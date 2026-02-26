import { useState, useEffect } from 'react';

const Notification = () => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Initial delay to show the notification
  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(showTimer);
  }, []);

  // Auto-hide logic
  useEffect(() => {
    if (!visible) return;
    
    // Pause the auto-hide timer if the user is hovering over it
    if (isHovered) return;

    const hideTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setVisible(false), 400); // Matches the exit animation duration
    }, 6000); // Extended slightly so they have time to read it

    return () => clearTimeout(hideTimer);
  }, [visible, isHovered]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExiting(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleClose()}
      className={`fixed top-12 right-4 z-[500] w-[340px] flex items-start gap-3 p-3.5 
      
        bg-[#1c1c1e]/75 backdrop-blur-3xl border border-white/10 rounded-2xl 
        /* Deep Shadow for floating effect */
        shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset] 
        cursor-default group
        transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1)
        ${exiting ? 'translate-x-[120%] opacity-0' : 'animate-in slide-in-from-right-12 fade-in duration-500 ease-out'}
      `}
    >
      {/* App Icon (Simulating a system icon) */}
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2b88ff] to-[#1a73e8] flex items-center justify-center shrink-0 shadow-sm border border-white/10">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>

      {/* Text Content */}
      <div className="flex-1 pt-0.5">
        <div className="flex items-start justify-between">
          <p className="text-[14px] font-semibold text-white/90 leading-tight">System Welcome</p>
          <span className="text-[11px] text-white/40 font-medium">now</span>
        </div>
        <p className="text-[13px] text-white/70 mt-1 leading-snug pr-2">
          Click the dock icons below to explore my portfolio apps, projects, and resume.
        </p>
      </div>

      {/* Hover Close Button (Classic macOS behavior) */}
      <button
        onClick={handleClose}
        className={`absolute top-3 right-3 w-5 h-5 rounded-full bg-black/40 flex items-center justify-center transition-opacity duration-200 border border-white/10 hover:bg-black/60 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >{}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Notification;