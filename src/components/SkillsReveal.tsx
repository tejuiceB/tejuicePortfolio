'use client'

import { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';

interface Skill {
  skill: string;
  level: number;
}

export default function SkillsReveal({ skills }: { skills: Skill[] }) {
  const [visibleSkills, setVisibleSkills] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
    const timer = setInterval(() => {
      setVisibleSkills(prev => {
        if (prev.length < skills.length) {
          return [...prev, prev.length];
        }
        clearInterval(timer);
        return prev;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [skills.length]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="terminal-entry text-[#16C60C]">
          <TypewriterText text="[System] Analyzing skill proficiency..." delay={30} />
          <div className="mt-2 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-[#16C60C] rounded-full animate-bounce" 
                   style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {skills.map((item, idx) => (
            visibleSkills.includes(idx) && (
              <div key={item.skill} className="terminal-entry text-[#16C60C] group">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <span>$</span>
                  <TypewriterText text={`skill-scan --name="${item.skill}" --analyze`} delay={20} />
                </div>
                <div className="pl-4 border-l-2 border-[#16C60C] ml-2">
                  <div className="flex justify-between mb-2">
                    <span className="group-hover:text-[#FFFF00] transition-colors">{item.skill}</span>
                    <span className="font-mono">[{item.level}%]</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#16C60C] rounded-full transition-all duration-1000 ease-out group-hover:bg-[#FFFF00]" 
                      style={{ width: `${item.level}%`, animation: 'growBar 1.5s ease-out' }}
                    />
                  </div>
                </div>
              </div>
            )
          ))}
        </>
      )}
    </div>
  );
}
