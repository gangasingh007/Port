import { useState, useEffect } from 'react';

interface MenuBarProps {
  focusedApp: string | null;
  onAppleMenuAction: (action: string) => void;
  onSpotlightOpen: () => void;
}

const MenuBar = ({ focusedApp, onAppleMenuAction, onSpotlightOpen }: MenuBarProps) => {
  const [time, setTime] = useState(new Date());
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const appName = focusedApp
    ? { about: 'Ganga', projects: 'Projects', skills: 'System Settings', terminal: 'Terminal', resume: 'Safari', contact: 'Messages' }[focusedApp] || 'Finder'
    : 'Ganga';

  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-black/20 backdrop-blur-3xl border-b border-white/10 z-[100] flex items-center justify-between px-2 text-[13px] font-medium text-white/90 shadow-sm select-none">
      
      {/* --- Left Side: App Menus --- */}
      <div className="flex items-center gap-1">
        
        {/* Apple Logo Dropdown */}
        <div className="relative flex items-center">
          <button
            onClick={() => setAppleMenuOpen(!appleMenuOpen)}
            className={`px-2 py-0.5 rounded-[4px] transition-colors duration-100 flex items-center justify-center ${
              appleMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >{}
            <svg width="14" height="14" viewBox="0 0 56 56" fill="currentColor">
              <path d="M42.5 18.7c-.3.2-5.5 3.2-5.5 9.7 0 7.6 6.7 10.3 6.9 10.3-.1.2-1.1 3.6-3.5 7.2-2.2 3.2-4.5 6.3-8 6.3s-4.4-2-8.4-2c-3.9 0-5.3 2.1-8.5 2.1s-5.5-2.9-7.9-6.5C4.7 41 2.5 35 2.5 29.3c0-9.2 6-14.1 11.9-14.1 3.1 0 5.7 2.1 7.7 2.1 1.8 0 4.8-2.2 8.3-2.2 1.5 0 6.7.1 10.1 5.6zM34.4 10c1.6-1.9 2.8-4.6 2.8-7.3 0-.4 0-.7-.1-1-2.7.1-5.8 1.8-7.7 4-1.5 1.7-2.9 4.4-2.9 7.1 0 .4.1.8.1.9.2 0 .4.1.6.1 2.4 0 5.4-1.6 7.2-3.8z" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {appleMenuOpen && (
            <>
              {/* Invisible overlay to catch outside clicks */}
              <div className="fixed inset-0 z-[200]" onClick={() => setAppleMenuOpen(false)} />
              
              <div className="absolute top-7 left-0 w-64 bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-lg py-1 z-[201] animate-in fade-in slide-in-from-top-1 duration-150">
                {[
                  { label: 'About This Portfolio', action: 'about' },
                  { label: '—', action: '' },
                  { label: 'Sleep', action: 'sleep' },
                  { label: 'Restart', action: 'restart' },
                ].map((item, i) =>
                  item.label === '—' ? (
                    <div key={i} className="h-[1px] bg-white/10 mx-3 my-1" />
                  ) : (
                    <div key={i} className="px-1.5">
                      <button
                        className="w-full text-left px-3 py-1 text-[13px] text-white/90 hover:bg-[#0066cc] hover:text-white rounded-[5px] transition-colors duration-75"
                        onClick={() => { onAppleMenuAction(item.action); setAppleMenuOpen(false); }}
                      >
                        {item.label}
                      </button>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>

        {/* Active App Name */}
        <button className="px-2 py-0.5 rounded-[4px] hover:bg-white/10 transition-colors font-bold text-white tracking-wide">
          {appName}
        </button>

        {/* Standard Menu Items */}
        <div className=" flex items-center gap-0.5 text-white/60 ml-3" id="standard-menus">
          {['File', 'Edit', 'View', 'Window', 'Help'].map((item) => (
            <button key={item} className="px-2 py-0.5 rounded-[4px] hover:bg-white/10 transition-colors">
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* --- Right Side: Status Icons & Time --- */}
      <div className="flex items-center gap-3 text-white/90 pr-2">
        
        {/* Spotlight */}
        <button title="Spotlight Search" onClick={onSpotlightOpen} className="p-1 rounded-[4px] hover:bg-white/10 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </button>

        {/* WiFi */}
        <button title="WiFi Status" className="p-1 rounded-[4px] hover:bg-white/10 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </button>

        {/* Battery - Redesigned for crispness */}
        <button title="Battery Level" className="flex items-center gap-1 p-1 rounded-[4px] hover:bg-white/10 transition-colors">
          <svg width="22" height="12" viewBox="0 0 26 12" fill="none">
            <rect x="0.5" y="0.5" width="23" height="11" rx="2.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            <rect x="2" y="2" width="18" height="8" rx="1" fill="currentColor" />
            <path d="M24.5 4C25.3284 4 26 4.67157 26 5.5V6.5C26 7.32843 25.3284 8 24.5 8V4Z" fill="currentColor" fillOpacity="0.5" />
          </svg>
        </button>

        {/* Date & Time */}
        <button title={`${dateStr} ${timeStr}`} className="flex items-center gap-2 px-2 py-0.5 rounded-[4px] hover:bg-white/10 transition-colors">
          <span>{dateStr}</span>
          <span>{timeStr}</span>
        </button>
        
      </div>
    </div>
  );
};

export default MenuBar;