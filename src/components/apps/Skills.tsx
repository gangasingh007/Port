import { useState, useEffect } from 'react';

const categories: Record<string, { name: string; level: number }[]> = {
  Languages: [
    { name: 'TypeScript', level: 95 },
    { name: 'JavaScript', level: 95 },
    { name: 'Python', level: 80 },
    { name: 'Java', level: 50 },
    { name: 'HTML/CSS', level: 95 },
  ],
  Frameworks: [
    { name: 'React', level: 95 },
    { name: 'Next.js', level: 85 },
    { name: 'Node.js', level: 90 },
    { name: 'Express', level: 85 },
    { name: 'Tailwind CSS', level: 95 },
  ],
  Tools: [
    { name: 'Git', level: 90 },
    { name: 'Docker', level: 80 },
    { name: 'VS Code', level: 95 },
    { name: 'Figma', level: 75 },
    { name: 'AWS', level: 70 },
    { name: 'CI/CD', level: 80 },
  ],
  Databases: [
    { name: 'PostgreSQL', level: 85 },
    { name: 'MongoDB', level: 80 },
    { name: 'Redis', level: 75 },
    { name: 'SQLite', level: 80 },
    { name: 'Supabase', level: 85 },
    { name: 'Firebase', level: 70 },
  ],
};

// macOS System Settings style icons and gradients
const categoryMeta: Record<string, { bg: string; icon: JSX.Element }> = {
  Languages: {
    bg: 'bg-gradient-to-b from-[#4c9bf5] to-[#2b88ff]',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
  },
  Frameworks: {
    bg: 'bg-gradient-to-b from-[#ffb340] to-[#f58b00]',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
  },
  Tools: {
    bg: 'bg-gradient-to-b from-[#a3a3a3] to-[#737373]',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
  },
  Databases: {
    bg: 'bg-gradient-to-b from-[#7fd141] to-[#42731d]',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
  },
};

const categoryKeys = Object.keys(categories);

// Separate component for the skill bar to handle the mount animation
const SkillRow = ({ skill, isLast }: { skill: { name: string; level: number }, isLast: boolean }) => {
  const [width, setWidth] = useState(0);

  // Trigger the fill animation slightly after the component mounts
  useEffect(() => {
    const timer = setTimeout(() => setWidth(skill.level), 100);
    return () => clearTimeout(timer);
  }, [skill.level]);

  return (
    <div className={`py-3 flex items-center justify-between gap-6 ${!isLast ? 'border-b border-white/5' : ''}`}>
      <span className="text-[14px] font-medium text-white/90 w-28 shrink-0">{skill.name}</span>
      
      <div className="flex-1 flex items-center gap-3">
        {/* Progress Track */}
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#2b88ff] to-[#4c9bf5] rounded-full relative"
            style={{ 
              width: `${width}%`, 
              transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' // Apple's buttery spring curve
            }}
          >
            {/* Glossy top highlight for realism */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>
        {/* Percentage Label */}
        <span className="text-[12px] font-semibold text-white/40 w-8 text-right shrink-0">
          {skill.level}%
        </span>
      </div>
    </div>
  );
};

const Skills = () => {
  const [active, setActive] = useState(categoryKeys[0]);

  return (
    <div className="flex h-full select-none bg-transparent">
      
      {/* Sidebar - System Settings Style */}
      <div className="w-[220px] border-r border-white/10 pt-4 pb-2 px-3 shrink-0 bg-black/10">
        <div className="space-y-1">
          {categoryKeys.map(c => {
            const isActive = active === c;
            const meta = categoryMeta[c];
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`w-full text-left px-2 py-1.5 rounded-[8px] transition-colors duration-100 flex items-center gap-3 outline-none ${
                  isActive ? 'bg-white/15 shadow-sm' : 'hover:bg-white/5'
                }`}
              >
                {/* macOS Preference Pane Icon */}
                <div className={`w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 shadow-sm border border-white/10 text-white ${meta.bg}`}>
                  <div className="w-4 h-4 opacity-90">
                    {meta.icon}
                  </div>
                </div>
                <span className={`text-[13px] ${isActive ? 'font-semibold text-white' : 'font-medium text-white/80'}`}>
                  {c}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div key={active} className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 px-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md border border-white/10 text-white ${categoryMeta[active].bg}`}>
              <div className="w-6 h-6 opacity-90">
                {categoryMeta[active].icon}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{active}</h2>
              <p className="text-[13px] text-white/50 font-medium">Proficiency & Comfort Level</p>
            </div>
          </div>

          {/* Inset Card for the list */}
          <div className="bg-black/20 border border-white/10 rounded-2xl px-5 py-2 shadow-inner">
            {categories[active].map((skill, index) => (
              <SkillRow 
                key={skill.name} 
                skill={skill} 
                isLast={index === categories[active].length - 1} 
              />
            ))}
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Skills;