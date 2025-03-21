'use client'

import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
}

export default function TypewriterText({ text, delay = 30 }: TypewriterTextProps) {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, delay);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [text, delay]);

  return (
    <div className="relative">
      {typedText}
      <span className={`inline-block w-2 h-4 bg-[#16C60C] ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
    </div>
  );
}
