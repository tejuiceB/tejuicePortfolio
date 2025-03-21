'use client'

import { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';

export default function ExperienceReveal() {
  const [stage, setStage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      const timer = setInterval(() => {
        setStage(prev => {
          if (prev < 3) return prev + 1;
          clearInterval(timer);
          return prev;
        });
      }, 1500);
      return () => clearInterval(timer);
    }, 1000);
  }, []);

  return (
    <div className="text-[#16C60C] space-y-4">
      {loading ? (
        <div className="terminal-entry">
          <TypewriterText text="[System] Accessing experience database..." delay={30} />
          <div className="mt-2 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-[#16C60C] rounded-full animate-bounce" 
                   style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {stage >= 1 && (
            <div className="terminal-entry border-l-2 border-[#16C60C] pl-4 ml-2">
              <div className="flex items-center gap-2 text-gray-400">
                <TypewriterText text=">> Role identified: Software Developer Intern" delay={20} />
              </div>
              <p className="font-bold mt-2 text-[#FFFF00]">Synchronik.co.in</p>
            </div>
          )}

          {stage >= 2 && (
            <div className="terminal-entry border-l-2 border-[#16C60C] pl-4 ml-2">
              <div className="flex items-center gap-2 text-gray-400">
                <TypewriterText text=">> Time period: Jan 2025 - Present" delay={20} />
              </div>
              <div className="mt-2 px-2 py-1 bg-gray-800 rounded inline-block">
                <span className="text-[#FFFF00]">Status:</span> Active
              </div>
            </div>
          )}

          {stage >= 3 && (
            <div className="terminal-entry border-l-2 border-[#16C60C] pl-4 ml-2">
              <div className="flex items-center gap-2 text-gray-400">
                <TypewriterText text=">> Fetching responsibilities..." delay={20} />
              </div>
              <ul className="mt-2 space-y-2 list-none">
                {[
                  'Full-stack development using Django and React',
                  'Improved database query efficiency by 30%',
                  'Implemented new features for ERP system',
                  'Collaborated on microservices architecture'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#FFFF00]">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
