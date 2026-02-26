import { useState, useRef, useCallback, useEffect } from 'react';
import resume from '../../assets/resume.pdf';

const Resume = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1); // Update if multi-page
  const [showToolbar, setShowToolbar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [urlBarFocused, setUrlBarFocused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide toolbar on idle
  useEffect(() => {
    const handleMouseMove = () => {
      setShowToolbar(true);
      if (toolbarTimeoutRef.current) clearTimeout(toolbarTimeoutRef.current);
      toolbarTimeoutRef.current = setTimeout(() => {
        if (isFullscreen) setShowToolbar(false);
      }, 3000);
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
      if (toolbarTimeoutRef.current) clearTimeout(toolbarTimeoutRef.current);
    };
  }, [isFullscreen]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 25, 250));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 25, 50));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(100);
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = resume;
    link.download = 'Ganga_Resume.pdf';
    link.click();
  }, []);

  const handlePrint = useCallback(() => {
    const printWindow = window.open(resume, '_blank');
    printWindow?.addEventListener('load', () => {
      printWindow.print();
    });
  }, []);

  const handleOpenExternal = useCallback(() => {
    window.open(resume, '_blank');
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ganga — Resume',
          text: 'Check out my resume!',
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-[#282828] select-none overflow-hidden"
    >
      {/* ===== Safari-Style Toolbar ===== */}
      <div
        className="shrink-0 transition-all duration-300"
        style={{
          opacity: showToolbar ? 1 : 0,
          transform: showToolbar ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        {/* Main toolbar */}
        <div
          className="flex items-center gap-2 px-3 py-[7px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(48,48,50,0.95) 0%, rgba(40,40,42,0.95) 100%)',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Left: Navigation */}
          <div className="flex items-center gap-[2px]">
            {/* Back */}
            <button
              className="p-1.5 rounded-md text-white/25 cursor-default"
              title="Back"
              disabled
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            {/* Forward */}
            <button
              className="p-1.5 rounded-md text-white/25 cursor-default"
              title="Forward"
              disabled
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Center: URL/Title Bar */}
          <div className="flex-1 flex justify-center px-2">
            <div
              className={`
                flex items-center gap-2 max-w-[420px] w-full px-3 py-[4px] rounded-lg
                transition-all duration-200
                ${urlBarFocused
                  ? 'bg-white/[0.1] ring-1 ring-[#5B9BF5]/50'
                  : 'bg-white/[0.05] hover:bg-white/[0.07]'
                }
              `}
              style={{
                border: '0.5px solid rgba(255,255,255,0.06)',
              }}
              onClick={() => setUrlBarFocused(true)}
              onBlur={() => setUrlBarFocused(false)}
            >
              {/* Lock icon */}
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white/25 shrink-0"
              >
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 11V7a4 4 0 018 0v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Title / URL */}
              <div className="flex-1 min-w-0 text-center">
                {urlBarFocused ? (
                  <span className="text-[12px] text-white/50 truncate block">
                    file:///resume.pdf
                  </span>
                ) : (
                  <span className="text-[12px] text-white/70 font-medium truncate block">
                    Ganga — Resume.pdf
                  </span>
                )}
              </div>

              {/* Reload */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1000);
                }}
                className="p-0.5 rounded hover:bg-white/[0.06] transition-colors shrink-0"
                title="Reload"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-white/25 ${isLoading ? 'animate-spin' : ''}`}
                >
                  <path
                    d="M21 12a9 9 0 11-2.2-5.9"
                    strokeLinecap="round"
                  />
                  <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-[2px]">
            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-100"
              title="Share"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16,6 12,2 8,6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>

            {/* Open in new tab */}
            <button
              onClick={handleOpenExternal}
              className="p-1.5 rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-100"
              title="Open in new tab"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Secondary toolbar — PDF controls */}
        <div
          className="flex items-center justify-between px-3 py-[5px]"
          style={{
            background: 'rgba(36,36,38,0.9)',
            borderBottom: '0.5px solid rgba(255,255,255,0.04)',
          }}
        >
          {/* Left: Page info */}
          <div className="flex items-center gap-3">
            {/* PDF icon */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-[18px] h-[22px] rounded-[3px] flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FF3B30 0%, #FF2D55 100%)',
                  boxShadow: '0 1px 3px rgba(255,59,48,0.3)',
                }}
              >
                <span className="text-[6px] font-black text-white tracking-tight">
                  PDF
                </span>
              </div>
              <span className="text-[11px] text-white/40 font-medium">
                Resume.pdf
              </span>
            </div>

            {/* Separator */}
            <div className="w-[1px] h-[14px] bg-white/[0.06]" />

            {/* Page navigation */}
            <div className="flex items-center gap-1">
              <button
                className="p-1 rounded hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-all disabled:opacity-30 disabled:cursor-default"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" />
                </svg>
              </button>
              <span className="text-[11px] text-white/40 tabular-nums font-medium min-w-[40px] text-center">
                {currentPage} / {totalPages}
              </span>
              <button
                className="p-1 rounded hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-all disabled:opacity-30 disabled:cursor-default"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Center: Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1 rounded hover:bg-white/[0.06] text-white/35 hover:text-white/60 transition-all disabled:opacity-30 disabled:cursor-default"
              title="Zoom out"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                <path d="M8 11h6" strokeLinecap="round" />
              </svg>
            </button>

            <button
              onClick={handleResetZoom}
              className="px-1.5 py-0.5 rounded hover:bg-white/[0.06] transition-colors min-w-[36px]"
              title="Reset zoom"
            >
              <span className="text-[10px] text-white/40 font-medium tabular-nums">
                {zoom}%
              </span>
            </button>

            <button
              onClick={handleZoomIn}
              disabled={zoom >= 250}
              className="p-1 rounded hover:bg-white/[0.06] text-white/35 hover:text-white/60 transition-all disabled:opacity-30 disabled:cursor-default"
              title="Zoom in"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                <path d="M11 8v6M8 11h6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Right: Document actions */}
          <div className="flex items-center gap-[2px]">
            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-md text-white/35 hover:text-white/65 hover:bg-white/[0.06] transition-all duration-100"
              title="Print (⌘P)"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9V2h12v7" />
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 py-[4px] rounded-md transition-all duration-150
                bg-[#3478F6]/80 hover:bg-[#3478F6] active:scale-[0.97]
                text-white text-[11px] font-medium
                shadow-[0_1px_3px_rgba(52,120,246,0.3)]"
              title="Download Resume"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>

      {/* ===== PDF Content Area ===== */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, #1a1a1c 0%, #222224 5%, #2a2a2c 50%, #222224 95%, #1a1a1c 100%)',
        }}
      >
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1e1e20]">
            {/* Safari-style loading */}
            <div className="relative mb-6">
              {/* Outer ring */}
              <svg
                className="w-[48px] h-[48px] animate-spin"
                style={{ animationDuration: '1.2s' }}
                viewBox="0 0 48 48"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * 0.72}`}
                />
              </svg>
              {/* Center PDF icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-[20px] h-[24px] rounded-[3px] flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, #FF3B30 0%, #FF2D55 100%)',
                  }}
                >
                  <span className="text-[5px] font-black text-white">
                    PDF
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[12px] text-white/30 font-medium">
              Loading Resume...
            </p>
            {/* Progress bar */}
            <div className="w-[120px] h-[2px] rounded-full bg-white/[0.05] mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/20"
                style={{
                  animation: 'loadProgress 1.5s ease-out forwards',
                }}
              />
            </div>
          </div>
        )}

        {/* Error state */}
        {loadError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1e1e20]">
            <div
              className="w-[56px] h-[56px] rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'rgba(255,59,48,0.1)',
                border: '0.5px solid rgba(255,59,48,0.15)',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF3B30"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p className="text-[14px] text-white/60 font-semibold mb-1">
              Unable to load PDF
            </p>
            <p className="text-[12px] text-white/25 mb-4 max-w-[240px] text-center">
              The resume file couldn't be loaded. Try downloading it instead.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLoadError(false);
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1000);
                }}
                className="px-3 py-1.5 rounded-md text-[12px] font-medium bg-white/[0.06] border border-white/[0.08] text-white/60 hover:bg-white/[0.1] transition-all"
              >
                Try Again
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-md text-[12px] font-medium bg-[#3478F6] text-white hover:bg-[#2563EB] transition-all shadow-[0_1px_3px_rgba(52,120,246,0.3)]"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}

        {/* PDF iframe with zoom */}
        <div
          className="w-full h-full overflow-auto flex justify-center"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.12) transparent',
          }}
        >
          <div
            className="transition-transform duration-200 ease-out origin-top"
            style={{
              transform: `scale(${zoom / 100})`,
              width: zoom > 100 ? `${(100 / zoom) * 100}%` : '100%',
              height: zoom > 100 ? `${(100 / zoom) * 100}%` : '100%',
              minHeight: '100%',
            }}
          >
            <iframe
              ref={iframeRef}
              src={`${resume}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              width="100%"
              height="100%"
              title="Resume - Ganga"
              className={`border-none transition-opacity duration-500 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                background: 'white',
                borderRadius: '0',
                minHeight: '100%',
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setLoadError(true);
              }}
            />
          </div>
        </div>

        {/* Subtle inner shadow overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow:
              'inset 0 1px 3px rgba(0,0,0,0.2), inset 0 -1px 2px rgba(0,0,0,0.1)',
          }}
        />

        {/* Top loading bar (Safari-style) */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-[2px] z-30">
            <div
              className="h-full rounded-r-full"
              style={{
                background:
                  'linear-gradient(90deg, #3478F6, #5B9BF5)',
                boxShadow: '0 0 8px rgba(52,120,246,0.5)',
                animation: 'safariLoadBar 1.5s ease-out forwards',
              }}
            />
          </div>
        )}
      </div>

      {/* ===== Bottom Info Bar ===== */}
      <div
        className="shrink-0 flex items-center justify-between px-3 py-[3px]"
        style={{
          background: 'rgba(32,32,34,0.9)',
          borderTop: '0.5px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/20">
            PDF Document
          </span>
          <span className="text-[10px] text-white/12">·</span>
          <span className="text-[10px] text-white/20">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/15 tabular-nums">
            {zoom}%
          </span>
          <span className="text-[10px] text-white/12">·</span>
          <span className="text-[10px] text-white/15">
            Resume.pdf
          </span>
        </div>
      </div>

      {/* ===== Keyboard Shortcuts ===== */}
      <KeyboardHandler
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />

      {/* ===== Animations ===== */}
      <style>{`
        @keyframes loadProgress {
          0% { width: 0%; }
          30% { width: 40%; }
          60% { width: 70%; }
          80% { width: 85%; }
          100% { width: 100%; }
        }

        @keyframes safariLoadBar {
          0% { width: 0%; }
          20% { width: 25%; }
          50% { width: 60%; }
          80% { width: 85%; }
          95% { width: 95%; }
          100% { width: 100%; opacity: 0; }
        }

        /* Custom scrollbar for PDF area */
        .overflow-auto::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .overflow-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
        }
        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </div>
  );
};

/* =======================
   Keyboard Shortcuts Hook
======================= */
const KeyboardHandler = ({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onDownload,
  onPrint,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onDownload: () => void;
  onPrint: () => void;
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      switch (e.key) {
        case '=':
        case '+':
          e.preventDefault();
          onZoomIn();
          break;
        case '-':
          e.preventDefault();
          onZoomOut();
          break;
        case '0':
          e.preventDefault();
          onResetZoom();
          break;
        case 's':
          e.preventDefault();
          onDownload();
          break;
        case 'p':
          e.preventDefault();
          onPrint();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onZoomIn, onZoomOut, onResetZoom, onDownload, onPrint]);

  return null;
};

export default Resume;