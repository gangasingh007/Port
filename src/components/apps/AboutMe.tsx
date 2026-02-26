import { CodeXmlIcon } from 'lucide-react';
import { useState } from 'react';

// Added SVG icons to mimic Apple's SF Symbols
const sidebarItems = [
  { 
    id: 'Overview', 
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg> 
  },
  { 
    id: 'Education', 
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> 
  },
  { 
    id: 'Interests', 
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> 
  },
];

const content: Record<string, JSX.Element> = {
  Overview: (
    <div className="p-8 space-y-6">
      {/* Contact Card Style */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2b88ff] to-[#1a73e8] flex items-center justify-center text-4xl shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.3)] border-2 border-white/10">
          <CodeXmlIcon className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Ganga Singh</h2>
          <p className="text-[15px] text-white/60 mt-0.5 font-medium"> Full Stack Developer</p>
        </div>
      </div>
      
      <p className="text-[14px] text-white/80 leading-relaxed max-w-2xl">
        Passionate developer with a love for crafting beautiful, performant web experiences. 
        I specialize in building modern applications with React, TypeScript, and Node.js. 
        When I'm not coding, you'll find me exploring new technologies and contributing to open source.
      </p>

      {/* Info Widgets */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        {[
          { label: 'Years Experience', value: '5+' },
          { label: 'Projects Shipped', value: '10+' },
          { label: 'Current Location', value: 'Ludhiana,Pb' },
        ].map(s => (
          <div key={s.label} className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-inner">
            <p className="text-xl font-semibold text-white">{s.value}</p>
            <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  ),
  Experience: (
    <div className="p-8 space-y-4">
      <h2 className="text-lg font-semibold text-white/90 mb-4 px-1">Work Experience</h2>
      {[
        { role: 'Senior Frontend Engineer', company: 'Tech Corp', period: '2022 — Present', desc: 'Led development of customer-facing products using React and TypeScript. Architected the design system used across 5 internal teams.' },
        { role: 'Full Stack Developer', company: 'Startup Inc', period: '2020 — 2022', desc: 'Built scalable APIs and microservices architecture. Improved database query times by 40%.' },
        { role: 'Web Developer', company: 'Digital Agency', period: '2018 — 2020', desc: 'Full-stack development on high-traffic e-commerce platforms using Node.js and React.' },
      ].map((exp, i) => (
        <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-5 hover:bg-white/[0.03] transition-colors duration-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[15px] font-semibold text-white/90">{exp.role}</h3>
              <p className="text-[13px] text-[#2b88ff] font-medium mt-0.5">{exp.company}</p>
            </div>
            <span className="text-[12px] text-white/40 font-medium bg-black/30 px-2 py-1 rounded-md border border-white/5">{exp.period}</span>
          </div>
          <p className="text-[13.5px] text-white/70 mt-3 leading-relaxed">{exp.desc}</p>
        </div>
      ))}
    </div>
  ),
  Education: (
    <div className="p-8 space-y-4">
      <h2 className="text-lg font-semibold text-white/90 mb-4 px-1">Education & Certifications</h2>
      
      <div className="bg-black/20 border border-white/5 rounded-xl p-5 hover:bg-white/[0.03] transition-colors duration-200">
        <h3 className="text-[15px] font-semibold text-white/90">Btech in Computer Science</h3>
        <p className="text-[13px] text-[#2b88ff] font-medium mt-0.5">Guru Nanak Dev University, Amitsar</p>
        <p className="text-[13px] text-white/50 mt-2">2023 — 2027</p>
      </div>

      <div className="bg-black/20 border border-white/5 rounded-xl p-5 hover:bg-white/[0.03] transition-colors duration-200">
        <h3 className="text-[15px] font-semibold text-white/90 mb-3">Certifications</h3>
        <ul className="space-y-2.5">
          {['AWS Solutions Architect - Associate', 'Google Cloud Professional Developer', 'Meta Advanced Frontend Developer'].map(c => (
            <li key={c} className="text-[13.5px] text-white/80 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2b88ff] shadow-[0_0_8px_rgba(43,136,255,0.8)]" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),
  Interests: (
    <div className="p-8">
      <h2 className="text-lg font-semibold text-white/90 mb-4 px-1">Beyond Coding</h2>
      <div className="grid grid-cols-2 gap-3">
        {[' UI/UX Design', ' Gaming', ' Photography', ' Music', ' Travel', ' Reading'].map(i => (
          <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-4 text-[14px] font-medium text-white/80 flex items-center gap-3 hover:bg-white/[0.05] transition-colors cursor-default">
            {i}
          </div>
        ))}
      </div>
    </div>
  ),
};

const AboutMe = () => {
  const [active, setActive] = useState('Overview');

  return (
    <div className="flex h-full bg-transparent select-none">
      
      {/* Sidebar - Finder Style */}
      <div className="w-[180px] border-r border-white/10 pt-4 pb-2 px-2.5 shrink-0 bg-black/10">
        <p className="text-[11px] font-semibold text-white/40 mb-1 px-2">Portfolio</p>
        
        <div className="space-y-0.5">
          {sidebarItems.map(s => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] transition-colors duration-100 outline-none ${
                  isActive 
                    ? 'bg-white/15 text-white shadow-sm' // Active state matches macOS System Settings
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-white' : 'text-[#2b88ff]'}`}>
                  {s.icon}
                </span>
                <span className="text-[13px] font-medium">{s.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* The 'key' forces React to unmount/remount the div, triggering the fade-in animation */}
        <div key={active} className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out h-full">
          {content[active]}
        </div>
      </div>
      
    </div>
  );
};

export default AboutMe;