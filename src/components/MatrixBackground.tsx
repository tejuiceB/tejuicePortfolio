'use client'

import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      if (!context || !canvas) return;

      context.fillStyle = theme === 'matrix' ? 
        'rgba(0, 0, 0, 0.1)' : 
        'rgba(1, 36, 86, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = theme === 'matrix' ? 
        '#00FF00' : 
        '#16C60C';
      context.font = '15px monospace';

      drops.forEach((drop, i) => {
        const text = characters[Math.floor(Math.random() * characters.length)];
        context.fillText(text, i * 20, drop * 20);

        if (drop * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none ${
        theme === 'matrix' ? 'opacity-40' : 'opacity-20'
      }`}
    />
  );
}
