'use client'

import { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';

interface Achievement {
  type: 'certification' | 'competition';
  title: string;
  icon: string;
  date?: string;
  color: string;
}

const achievements: Achievement[] = [
  { type: 'certification', title: 'Google IT Automation with Python', icon: '🎓', date: '2023', color: '#16C60C' },
  { type: 'certification', title: 'Full-Stack Web Development with Django', icon: '📜', date: '2023', color: '#3B91F7' },
  { type: 'certification', title: 'Data Structures & Algorithms in Java', icon: '🏆', date: '2022', color: '#FFFF00' },
  { type: 'competition', title: 'e-Yantra Robotics Competition - IIT Bombay', icon: '🤖', color: '#FF5F56' },
  { type: 'competition', title: 'Top performer in coding challenges', icon: '⭐', color: '#FFBD2E' },
  { type: 'competition', title: 'API optimization achievement', icon: '🚀', color: '#27C93F' },
];

export default function AchievementsReveal() {
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < achievements.length - 1) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      {currentIndex === -1 ? (
        <div className="terminal-entry">
          <TypewriterText text="[System] Loading achievements..." delay={30} />
          <div className="mt-2 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-[#16C60C] rounded-full animate-bounce" 
                   style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.slice(0, currentIndex + 1).map((achievement, idx) => (
            <div key={idx} 
                 className="terminal-entry group border-l-2 border-transparent hover:border-[#16C60C] pl-4 py-2 transition-all duration-300">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="text-[#16C60C] group-hover:text-[#FFFF00] transition-colors">
                    {achievement.title}
                  </p>
                  {achievement.date && (
                    <p className="text-xs text-gray-500">{achievement.date}</p>
                  )}
                </div>
                <span className="text-xs px-2 py-1 rounded-full" 
                      style={{ backgroundColor: achievement.color + '20', color: achievement.color }}>
                  {achievement.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
