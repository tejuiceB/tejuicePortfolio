'use client'

import { useState, useEffect } from 'react';

const MORSE_CODE = {
  // Letters
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', 
  // Numbers
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  // Symbols
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--',
  '/': '-..-.', '@': '.--.-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '\'': '.----.', 
  // Space
  ' ': '/'
};

interface MorseCodeProps {
  mode: 'encode' | 'decode' | 'learn';
}

export default function MorseCode({ mode }: MorseCodeProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    setAudioContext(new AudioContext());
    return () => audioContext?.close();
  }, []);

  const playBeep = async (isDot: boolean) => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    await new Promise(resolve => setTimeout(resolve, isDot ? 100 : 300));
    oscillator.stop();
  };

  const playMorseCode = async (code: string) => {
    setIsPlaying(true);
    for (const char of code) {
      if (char === '.') await playBeep(true);
      if (char === '-') await playBeep(false);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    setIsPlaying(false);
  };

  const handleInput = (text: string) => {
    setInput(text);
    if (mode === 'encode') {
      const encoded = text.toUpperCase().split('').map(char => 
        MORSE_CODE[char] || char
      ).join(' ');
      setOutput(encoded);
    } else if (mode === 'decode') {
      const decoded = text.split(' ').map(code => {
        const char = Object.entries(MORSE_CODE).find(([_, m]) => m === code);
        return char ? char[0] : code;
      }).join('');
      setOutput(decoded);
    }
  };

  return (
    <div className="space-y-4 text-[#16C60C]">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode' : 'Enter morse code (use . and -)'}
          className="bg-transparent border border-gray-600 rounded px-3 py-2 w-full"
        />
        <button
          onClick={() => playMorseCode(mode === 'encode' ? output : input)}
          disabled={isPlaying || !output}
          className="px-3 py-2 border border-gray-600 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {isPlaying ? 'Playing...' : '▶ Play'}
        </button>
      </div>
      <div className="font-mono">
        {output.split('').map((char, i) => (
          <span
            key={i}
            className={`inline-block ${char === '.' ? 'w-2' : char === '-' ? 'w-4' : 'w-2'}`}
          >
            {char}
          </span>
        ))}
      </div>
      {mode === 'learn' && (
        <div className="mt-4 border-t border-gray-600 pt-4">
          <h3 className="text-lg mb-2">Morse Code Reference:</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Letters</h4>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(MORSE_CODE)
                  .filter(([char]) => /[A-Z]/.test(char))
                  .map(([char, code]) => (
                    <div key={char} className="flex items-center gap-2">
                      <span>{char}</span>
                      <span className="text-gray-400">{code}</span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Numbers</h4>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(MORSE_CODE)
                  .filter(([char]) => /[0-9]/.test(char))
                  .map(([char, code]) => (
                    <div key={char} className="flex items-center gap-2">
                      <span>{char}</span>
                      <span className="text-gray-400">{code}</span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Symbols</h4>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(MORSE_CODE)
                  .filter(([char]) => !/[A-Z0-9\s]/.test(char))
                  .map(([char, code]) => (
                    <div key={char} className="flex items-center gap-2">
                      <span>{char}</span>
                      <span className="text-gray-400">{code}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
