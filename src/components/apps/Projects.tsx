import { useState, useCallback, useRef, useEffect } from 'react';

interface Project {
  name: string;
  tech: string[];
  desc: string;
  github: string;
  demo: string;
  longDesc?: string;
  features?: string[];
  year?: string;
 
}

const projects: Project[] = [
  {
    name: 'ProtoLab',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'WebSockets', 'Redis'],
    desc: 'AI-native real-time collaborative research OS',
    longDesc:
      'Protolab is an AI-native, real-time collaborative research OS that unifies electronic lab notebooks, Git-integrated experiment tracking, knowledge graphs, and semantic search to deliver end-to-end reproducible workflows and cross-lab synergy.',
    features: [
      'Real-time collaboration with WebSocket sync',
      'Git-integrated experiment version control',
      'AI-powered semantic search across research data',
      'Interactive knowledge graph visualization',
      'Reproducible workflow templates',
      'Easier onboarding process'
    ],
    github: 'https://github.com/gangasingh007/ProtoLab',
    demo: 'https://proto-lab-3ibi.vercel.app/',
    year: 'Dec 2025',
 
  },
  {
    name: 'WanderAI',
    tech: ['NextJS', 'Supabase', 'TypeScript'],
    desc: 'A next-gen, map-first travel discovery and planning platform that transforms travel discovery into a browser-like experience',
    longDesc:
      'Wander AI combines a ChatGPT-style conversational interface, a map canvas for visual exploration, and a creator community hub for authentic, data-rich itineraries. Users can discover, remix, and personalize travel content sourced from creators into interactive itineraries pinned on a map.',
    features: [
      'Clean Landing Page - Minimal, premium UI inspired by Apple, Notion, and Linear',
      'Map-First Exploration (Google Maps-like)',
      'Creator Content Hub',
      'Community & Marketplace',
      'Conversational AI Interface (ChatGPT-style)',
    ],
    github: 'https://github.com/gangasingh007/WanderAI-Travel-Browser',
    demo: '#',
    year: '2025',
    
  },
  {
    name: 'UniConnect',
    tech: ['ReactJS', ,'GSAP','TypeScript', 'NodeJs','MongoDB',"GeminiAPI"],
    desc: 'Full-stack SaaS platform',
    longDesc:
      'UniConnect is a full-stack web application for university students and admins to manage courses, resources, and documents. It features authentication, resource sharing, document uploads (with Firebase), and a modern UI built with React, Vite, TailwindCSS, and Framer Motion.',
    features: [
      'Single Click AI-powered document summarization (Gemini API)',
      'Role-based access (admin/user)',
      'Modern, beautilful and  responsive UI',
      'Edge-optimized API routes',
      'Course & subject management',
    ],
    github: 'https://github.com/gangasingh007/Uniconnect',
    demo: 'https://uniconnect-ai.vercel.app/',
    year: '2025',

  },
  // {
  //   name: 'ML Vision Pipeline',
  //   tech: ['Python', 'TensorFlow', 'FastAPI'],
  //   desc: 'Machine learning image classification',
  //   longDesc:
  //     'An end-to-end machine learning pipeline for image classification tasks. Includes data preprocessing, model training with transfer learning, hyperparameter optimization, and a FastAPI serving endpoint with batch prediction support.',
  //   features: [
  //     'Transfer learning with EfficientNet',
  //     'Automated hyperparameter tuning',
  //     'FastAPI REST inference endpoint',
  //     'Batch prediction processing',
  //     'MLflow experiment tracking',
  //   ],
  //   github: '#',
  //   demo: '#',
  //   year: '2023',

  // },
  // {
  //   name: 'Mobile Companion',
  //   tech: ['React Native', 'Expo', 'Firebase'],
  //   desc: 'Cross-platform mobile app',
  //   longDesc:
  //     'A cross-platform mobile application with offline-first architecture using WatermelonDB. Features push notifications, biometric authentication, and seamless cloud sync with Firebase backend.',
  //   features: [
  //     'Offline-first with WatermelonDB',
  //     'Biometric authentication',
  //     'Push notifications via FCM',
  //     'Cloud sync with conflict resolution',
  //     'Expo OTA updates',
  //   ],
  //   github: '#',
  //   demo: '#',
  //   year: '2023',
    
  // },
  // {
  //   name: 'Subscription Manager',
  //   tech: ['Vue.js', 'Supabase', 'Stripe'],
  //   desc: 'E-commerce subscription platform',
  //   longDesc:
  //     'A modern e-commerce platform specializing in subscription management. Includes product catalog, cart system, recurring billing through Stripe, customer portal, and real-time inventory tracking.',
  //   features: [
  //     'Recurring billing management',
  //     'Customer self-service portal',
  //     'Real-time inventory tracking',
  //     'Webhook-driven order processing',
  //     'Analytics & revenue reporting',
  //   ],
  //   github: '#',
  //   demo: '#',
  //   year: '2023',
   
  // },
];

// ===== Realistic macOS Folder Icon =====
const MacFolderIcon = ({ size = 64, selected = false }: { size?: number; selected?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-lg"
    style={{
      filter: selected
        ? 'drop-shadow(0 4px 12px rgba(59,130,246,0.3))'
        : 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
    }}
  >
    {/* Shadow base */}
    <ellipse cx="32" cy="58" rx="22" ry="3" fill="rgba(0,0,0,0.15)" />

    {/* Back panel */}
    <path
      d="M6 16C6 12.6863 8.68629 10 12 10H22.3431C23.404 10 24.4214 10.4214 25.1716 11.1716L29.8284 15.8284C30.5786 16.5786 31.596 17 32.6569 17H52C55.3137 17 58 19.6863 58 23V50C58 53.3137 55.3137 56 52 56H12C8.68629 56 6 53.3137 6 50V16Z"
      fill="url(#back-grad)"
    />

    {/* Inner shadow on back */}
    <path
      d="M6 16C6 12.6863 8.68629 10 12 10H22.3431C23.404 10 24.4214 10.4214 25.1716 11.1716L29.8284 15.8284C30.5786 16.5786 31.596 17 32.6569 17H52C55.3137 17 58 19.6863 58 23V50C58 53.3137 55.3137 56 52 56H12C8.68629 56 6 53.3137 6 50V16Z"
      fill="url(#back-inner)"
      opacity="0.5"
    />

    {/* Tab fold highlight */}
    <path
      d="M22.3431 10H12C8.68629 10 6 12.6863 6 16V18H28L25.1716 11.1716C24.4214 10.4214 23.404 10 22.3431 10Z"
      fill="rgba(255,255,255,0.08)"
    />

    {/* Front panel */}
    <path
      d="M4 24C4 21.7909 5.79086 20 8 20H56C58.2091 20 60 21.7909 60 24V50C60 53.3137 57.3137 56 54 56H10C6.68629 56 4 53.3137 4 50V24Z"
      fill="url(#front-grad)"
    />

    {/* Front panel top highlight */}
    <path
      d="M4 24C4 21.7909 5.79086 20 8 20H56C58.2091 20 60 21.7909 60 24V26H4V24Z"
      fill="rgba(255,255,255,0.1)"
    />

    {/* Front panel bottom shadow */}
    <path
      d="M4 48V50C4 53.3137 6.68629 56 10 56H54C57.3137 56 60 53.3137 60 50V48C60 51.3137 57.3137 54 54 54H10C6.68629 54 4 51.3137 4 48Z"
      fill="rgba(0,0,0,0.08)"
    />

    {/* Subtle front lines */}
    <line x1="12" y1="30" x2="52" y2="30" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
    <line x1="12" y1="36" x2="52" y2="36" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
    <line x1="12" y1="42" x2="52" y2="42" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />

    <defs>
      <linearGradient id="back-grad" x1="32" y1="10" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor={selected ? '#5B9EFF' : '#5B9EFF'} />
        <stop offset="1" stopColor={selected ? '#2563EB' : '#3574E8'} />
      </linearGradient>
      <linearGradient id="back-inner" x1="32" y1="10" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="transparent" />
        <stop offset="1" stopColor="rgba(0,0,0,0.15)" />
      </linearGradient>
      <linearGradient id="front-grad" x1="32" y1="20" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor={selected ? '#8BBFFF' : '#8BBFFF'} />
        <stop offset="0.5" stopColor={selected ? '#5A9FFF' : '#60A5FA'} />
        <stop offset="1" stopColor={selected ? '#3B82F6' : '#4B8DF5'} />
      </linearGradient>
    </defs>
  </svg>
);

// ===== Document/File Icon for detail view =====
const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-white/30">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type ViewState = 'folders' | 'detail';

const Projects = () => {
  const [viewState, setViewState] = useState<ViewState>('folders');
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<number[]>([]);
  const [hoveredFolder, setHoveredFolder] = useState<number | null>(null);
  const [renaming, setRenaming] = useState<number | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [lastClickIndex, setLastClickIndex] = useState(-1);
  const [animatingOpen, setAnimatingOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentProject = openProject !== null ? projects[openProject] : null;

  // Handle folder click (single = select, double = open)
  const handleFolderClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const now = Date.now();

      if (lastClickIndex === index && now - lastClickTime < 400) {
        // Double click — open folder
        setAnimatingOpen(true);
        setSelectedFolder(index);

        setTimeout(() => {
          setOpenProject(index);
          setViewState('detail');
          setNavigationHistory((prev) => [...prev, index]);
          setAnimatingOpen(false);
        }, 300);

        setLastClickTime(0);
        setLastClickIndex(-1);
      } else {
        // Single click — select
        setSelectedFolder(index);
        setLastClickTime(now);
        setLastClickIndex(index);
      }
    },
    [lastClickTime, lastClickIndex]
  );

  // Navigate back to folder view
  const handleGoBack = useCallback(() => {
    setViewState('folders');
    setOpenProject(null);
    setNavigationHistory([]);
  }, []);

  // Deselect on background click
  const handleBackgroundClick = useCallback(() => {
    setSelectedFolder(null);
    setRenaming(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (viewState === 'folders') {
        if (e.key === 'Enter' && selectedFolder !== null) {
          setAnimatingOpen(true);
          setTimeout(() => {
            setOpenProject(selectedFolder);
            setViewState('detail');
            setNavigationHistory([selectedFolder]);
            setAnimatingOpen(false);
          }, 300);
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedFolder((prev) =>
            prev === null ? 0 : Math.min(prev + 1, projects.length - 1)
          );
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedFolder((prev) =>
            prev === null ? 0 : Math.max(prev - 1, 0)
          );
        }
      }
      if (viewState === 'detail') {
        if (e.key === 'Backspace' || (e.key === 'ArrowLeft' && e.metaKey)) {
          handleGoBack();
        }
      }
      if (e.key === 'Escape') {
        if (viewState === 'detail') handleGoBack();
        else setSelectedFolder(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [viewState, selectedFolder, handleGoBack]);

  // Scroll to top on view change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [viewState, openProject]);



  return (
    <div className="flex flex-col h-full bg-[#1a1a1c] select-none" onClick={handleBackgroundClick}>
      {/* ===== Finder Toolbar ===== */}
      <div
        className="h-[38px] shrink-0 flex items-center justify-between px-2"
        style={{
          background: 'linear-gradient(180deg, rgba(44,44,46,0.9) 0%, rgba(36,36,38,0.9) 100%)',
          borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Left: Navigation */}
        <div className="flex items-center gap-1">
          {/* Back button */}
          <button
            onClick={handleGoBack}
            disabled={viewState === 'folders'}
            className={`flex items-center gap-0.5 px-1.5 py-1 rounded-md transition-all duration-100 ${
              viewState === 'detail'
                ? 'text-[#5AC8F5] hover:bg-white/[0.05] active:bg-white/[0.08]'
                : 'text-white/15 cursor-default'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Forward button */}
          <button className="px-1.5 py-1 rounded-md text-white/15 cursor-default">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={handleGoBack}
              className={`text-[12px] font-medium transition-colors ${
                viewState === 'detail'
                  ? 'text-white/40 hover:text-white/60 cursor-pointer'
                  : 'text-white/80'
              }`}
            >
              Projects
            </button>
            {currentProject && (
              <>
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/20">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span className="text-[12px] font-medium text-white/80">
                  {currentProject.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex items-center gap-2">
          {viewState === 'folders' && (
            <span className="text-[11px] text-white/25 font-medium tabular-nums">
              {projects.length} items
            </span>
          )}

          {/* Search icon */}
          <button className="p-1 rounded-md hover:bg-white/[0.05] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/30">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* ===== Content Area ===== */}
      <div
        ref={contentRef}
        className="flex-1 overflow-auto"
        style={{
          background: 'linear-gradient(180deg, #1c1c1e 0%, #161618 100%)',
        }}
      >
        {viewState === 'folders' ? (
          /* ===== FOLDER GRID VIEW ===== */
          <div className="p-6 pb-8">
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
              {projects.map((project, index) => {
                const isSelected = selectedFolder === index;
                const isHovered = hoveredFolder === index;
                const isAnimating = animatingOpen && isSelected;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1 group cursor-default"
                    onClick={(e) => handleFolderClick(index, e)}
                    onMouseEnter={() => setHoveredFolder(index)}
                    onMouseLeave={() => setHoveredFolder(null)}
                    style={{
                      transform: isAnimating
                        ? 'scale(1.15)'
                        : isHovered && !isSelected
                          ? 'scale(1.02)'
                          : 'scale(1)',
                      opacity: isAnimating ? 0.5 : 1,
                      transition: 'transform 250ms cubic-bezier(0.2, 0.9, 0.3, 1), opacity 200ms ease',
                    }}
                  >
                    {/* Folder Icon */}
                    <div
                      className="relative p-1 rounded-lg transition-all duration-150"
                      style={{
                        background: isSelected ? 'rgba(59,130,246,0.12)' : 'transparent',
                      }}
                    >
                      <MacFolderIcon size={56} selected={isSelected} />
                    </div>

                    {/* Folder Name */}
                    <div
                      className={`
                        max-w-[90px] text-center px-1.5 py-[1px] rounded-[4px] transition-all duration-100
                        ${isSelected
                          ? 'bg-[#3478F6] text-white'
                          : 'text-white/75 bg-transparent'
                        }
                      `}
                    >
                      <span className="text-[11px] font-normal leading-tight line-clamp-2 break-words">
                        {project.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : currentProject ? (
          /* ===== PROJECT DETAIL VIEW ===== */
          <div
            className="p-6"
            style={{
              animation: 'detailSlideIn 0.35s cubic-bezier(0.2, 0.9, 0.3, 1) both',
            }}
          >
            {/* Header Section */}
            <div className="flex items-start gap-5 mb-6">
              {/* Large folder icon */}
              <div className="shrink-0">
                <MacFolderIcon size={80} selected />
              </div>

              {/* Project info */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-[20px] font-bold text-white/90 tracking-tight">
                    {currentProject.name}
                  </h1>
                </div>

                <p className="text-[12px] text-white/35 mb-3">
                  {currentProject.year} · {currentProject.tech.length} technologies
                </p>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={currentProject.github}
                    className="flex items-center gap-1.5 px-3 py-[5px] rounded-md text-[12px] font-medium transition-all duration-150
                      bg-white/[0.06] border border-white/[0.08] text-white/70
                      hover:bg-white/[0.1] hover:border-white/[0.12] hover:text-white/90
                      active:scale-[0.97]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View Source
                  </a>
                  <a
                    href={currentProject.demo}
                    className="flex items-center gap-1.5 px-3 py-[5px] rounded-md text-[12px] font-medium transition-all duration-150
                      bg-[#3478F6] border border-[#3478F6] text-white
                      hover:bg-[#2563EB] hover:border-[#2563EB]
                      active:scale-[0.97]
                      shadow-[0_1px_4px_rgba(52,120,246,0.3)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                    Live Demo
                  </a>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-[0.5px] bg-white/[0.06] mb-5" />

            {/* Description Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2.5">
                <FileIcon />
                <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-wider">
                  About
                </h2>
              </div>
              <p className="text-[13.5px] text-white/60 leading-[1.7] pl-6">
                {currentProject.longDesc || currentProject.desc}
              </p>
            </div>

            {/* Features Section */}
            {currentProject.features && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-white/30">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-wider">
                    Key Features
                  </h2>
                </div>
                <div className="pl-6 space-y-1.5">
                  {currentProject.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 group/feature"
                      style={{
                        animation: `featureSlide 0.3s ease-out ${idx * 0.06}s both`,
                      }}
                    >
                      <div className="w-[5px] h-[5px] rounded-full bg-[#3478F6] mt-[7px] shrink-0 group-hover/feature:shadow-[0_0_6px_rgba(52,120,246,0.4)] transition-shadow" />
                      <span className="text-[13px] text-white/55 leading-relaxed group-hover/feature:text-white/70 transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-white/30">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-wider">
                  Tech Stack
                </h2>
              </div>
              <div className="pl-6 flex flex-wrap gap-2">
                {currentProject.tech.map((tech, idx) => {
                  const colors = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EC4899', '#14B8A6'];
                  const color = colors[idx % colors.length];

                  return (
                    <span
                      key={tech}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all duration-150 hover:scale-105 cursor-default"
                      style={{
                        background: `${color}10`,
                        color: `${color}cc`,
                        border: `0.5px solid ${color}20`,
                        animation: `featureSlide 0.3s ease-out ${idx * 0.05}s both`,
                      }}
                    >
                      <div
                        className="w-[6px] h-[6px] rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* File Info Section — mimicking Finder's "Get Info" */}
          
          </div>
        ) : null}
      </div>

      {/* ===== Bottom Status Bar ===== */}
      <div
        className="h-[22px] shrink-0 flex items-center justify-between px-3"
        style={{
          background: 'rgba(30,30,32,0.8)',
          borderTop: '0.5px solid rgba(255,255,255,0.04)',
        }}
      >
        <span className="text-[10px] text-white/20">
          {viewState === 'folders'
            ? `${projects.length} items`
            : currentProject
              ? `${currentProject.tech.length} technologies · ${currentProject.features?.length || 0} features`
              : ''
          }
        </span>
        {selectedFolder !== null && viewState === 'folders' && (
          <span className="text-[10px] text-white/20">
            "{projects[selectedFolder].name}" selected
          </span>
        )}
      </div>

      {/* ===== Animations ===== */}
      <style>{`
        @keyframes detailSlideIn {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes featureSlide {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Projects;