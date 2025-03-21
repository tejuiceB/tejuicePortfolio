'use client'

import { useTheme } from '@/context/ThemeContext';

export default function MarvelOverlay() {
  const { theme } = useTheme();

  if (theme !== 'marvel') return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#64D2FF] to-transparent opacity-50 animate-jarvisScan"></div>
      <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-[#64D2FF] opacity-20">
        <div className="absolute inset-2 rounded-full border border-[#64D2FF] animate-pulse"></div>
      </div>
    </div>
  );
}
