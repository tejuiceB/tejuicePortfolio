'use client'

import { useState } from 'react';
import TypewriterText from './TypewriterText';

interface Project {
  name: string;
  tech: string;
  link: string;
  description: string;
}

export default function ProjectReveal({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);

  const handleKeyPress = () => {
    if (currentIndex < projects.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowPrompt(true);
    }
  };

  return (
    <div 
      className="space-y-6 focus:outline-none"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleKeyPress()}
      onClick={handleKeyPress}
    >
      {projects.slice(0, currentIndex + 1).map((project, idx) => (
        <div key={project.name} className="terminal-entry">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <span>$</span>
            <TypewriterText text={`show-project-${idx + 1}`} delay={50} />
          </div>
          
          <div className="border border-gray-700 p-6 rounded-md hover:border-[#16C60C] transition-all duration-300 group">
            <a href={project.link} 
               target="_blank"
               rel="noopener noreferrer"
               className="font-bold text-[#16C60C] group-hover:text-[#FFFF00] transition-colors">
              {project.name}
            </a>
            <p className="text-sm text-gray-400 mt-2">{project.tech}</p>
            <p className="text-sm mt-3 leading-relaxed text-[#16C60C]">{project.description}</p>
          </div>
        </div>
      ))}
      
      {currentIndex < projects.length - 1 && showPrompt && (
        <div className="text-gray-400 text-sm animate-pulse">
          Press Enter or Click to reveal next project...
          <span className="ml-1 animate-blink">_</span>
        </div>
      )}
    </div>
  );
}
