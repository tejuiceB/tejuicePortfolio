'use client'

import { useEffect, useState, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 200; // Slower initial speed
const SPEED_INCREASE = 10; // How much to decrease interval per score increment
const MIN_SPEED = 50; // Fastest possible speed

type Position = { x: number; y: number };

export default function Snake() {
  const { theme } = useTheme();
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<string>('right');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const getRandomPosition = () => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  });

  const moveSnake = useCallback(() => {
    if (gameOver || paused) return;

    setSnake(snake => {
      const head = snake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'up': newHead.y -= 1; break;
        case 'down': newHead.y += 1; break;
        case 'left': newHead.x -= 1; break;
        case 'right': newHead.x += 1; break;
      }

      // Check collision with walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || 
          newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return snake;
      }

      // Check collision with self
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return snake;
      }

      const newSnake = [newHead, ...snake];
      
      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        // Increase speed based on score
        setSpeed(Math.max(INITIAL_SPEED - Math.floor(newScore / 50) * SPEED_INCREASE, MIN_SPEED));
        setFood(getRandomPosition());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, paused, score]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition());
    setDirection('right');
    setGameOver(false);
    setScore(0);
    setPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': setDirection('up'); break;
        case 'ArrowDown': setDirection('down'); break;
        case 'ArrowLeft': setDirection('left'); break;
        case 'ArrowRight': setDirection('right'); break;
        case 'p': setPaused(p => !p); break;
        case 'r': if (gameOver) window.location.reload(); break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    const gameInterval = setInterval(moveSnake, speed); // Use dynamic speed

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      clearInterval(gameInterval);
    };
  }, [moveSnake, speed]); // Add speed to dependencies

  // Add gameOver to dependencies
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key) {
        case 'ArrowUp': setDirection('up'); break;
        case 'ArrowDown': setDirection('down'); break;
        case 'ArrowLeft': setDirection('left'); break;
        case 'ArrowRight': setDirection('right'); break;
        case 'p': setPaused(p => !p); break;
        case 'r': if (gameOver) window.location.reload(); break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [gameOver]); // Add gameOver to dependency array

  const cellColor = theme === 'matrix' ? '#00FF00' : 
                   theme === 'ubuntu' ? '#E95420' : '#16C60C';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center">
          <div className="text-[#16C60C]">Score: {score}</div>
          <button 
            onClick={() => setPaused(!paused)}
            className="px-2 py-1 rounded border border-gray-600 hover:bg-gray-800 text-[#16C60C] text-sm"
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
          {gameOver && (
            <button 
              onClick={resetGame}
              className="px-2 py-1 rounded border border-gray-600 hover:bg-gray-800 text-[#16C60C] text-sm"
            >
              Try Again
            </button>
          )}
        </div>
        <div className="text-gray-400 text-sm">
          Controls: Arrows to move | P to pause | R to restart
        </div>
      </div>

      <div className="relative border border-gray-600 rounded"
           style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
        {/* Food */}
        <div className="absolute rounded-full"
             style={{
               left: food.x * CELL_SIZE,
               top: food.y * CELL_SIZE,
               width: CELL_SIZE - 2,
               height: CELL_SIZE - 2,
               backgroundColor: '#FF0000'
             }}/>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div key={i}
               className="absolute rounded-sm"
               style={{
                 left: segment.x * CELL_SIZE,
                 top: segment.y * CELL_SIZE,
                 width: CELL_SIZE - 2,
                 height: CELL_SIZE - 2,
                 backgroundColor: cellColor
               }}/>
        ))}

        {/* Updated Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-xl">Game Over!</div>
              <div className="text-[#16C60C]">Final Score: {score}</div>
              <div className="space-x-4">
                <button 
                  onClick={resetGame}
                  className="px-4 py-2 rounded border border-[#16C60C] hover:bg-[#16C60C]/20 text-[#16C60C]"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {paused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-[#16C60C]">PAUSED</div>
          </div>
        )}
      </div>
    </div>
  );
}
