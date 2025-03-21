'use client'

import { useState, useEffect, useCallback } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;

type Piece = {
  shape: number[][];
  color: string;
  x: number;
  y: number;
};

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
  L: { shape: [[1, 0], [1, 0], [1, 1]], color: '#f0a000' },
  J: { shape: [[0, 1], [0, 1], [1, 1]], color: '#0000f0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' }
};

export default function Tetris() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [board, setBoard] = useState<string[][]>(
    Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);

  const getRandomTetromino = () => {
    const pieces = Object.keys(TETROMINOS) as (keyof typeof TETROMINOS)[];
    const randPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const tetromino = TETROMINOS[randPiece];
    return {
      shape: tetromino.shape,
      color: tetromino.color,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: 0
    };
  };

  const createEmptyBoard = useCallback(() => 
    Array.from({ length: BOARD_HEIGHT }, () => 
      Array.from({ length: BOARD_WIDTH }, () => '')
    ), []);

  const isValidMove = (piece: Piece, offsetX: number, offsetY: number) => {
    return piece.shape.every((row, y) =>
      row.every((cell, x) => {
        if (cell === 0) return true;
        const newX = piece.x + x + offsetX;
        const newY = piece.y + y + offsetY;
        return (
          newX >= 0 &&
          newX < BOARD_WIDTH &&
          newY < BOARD_HEIGHT &&
          !board[newY]?.[newX]
        );
      })
    );
  };

  const mergePieceToBoard = (piece: Piece) => {
    const newBoard = board.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          newBoard[piece.y + y][piece.x + x] = piece.color;
        }
      });
    });
    return newBoard;
  };

  const rotatePiece = (piece: Piece) => {
    const rotated = {
      ...piece,
      shape: piece.shape[0].map((_, i) =>
        piece.shape.map(row => row[i]).reverse()
      )
    };
    return isValidMove(rotated, 0, 0) ? rotated : piece;
  };

  const clearLines = (boardToCheck: string[][]) => {
    return boardToCheck.reduce((acc, row) => {
      if (row.every(cell => cell !== '')) {
        setScore(prev => prev + 100);
        return [Array(BOARD_WIDTH).fill(''), ...acc];
      }
      return [...acc, row];
    }, [] as string[][]);
  };

  const moveDown = useCallback(() => {
    if (!currentPiece || paused || gameOver) return;

    if (isValidMove(currentPiece, 0, 1)) {
      setCurrentPiece(prev => prev && { ...prev, y: prev.y + 1 });
    } else {
      if (currentPiece.y <= 1) {
        setGameOver(true);
        return;
      }
      
      const newBoard = mergePieceToBoard(currentPiece);
      const clearedBoard = clearLines(newBoard);
      setBoard(clearedBoard);
      setCurrentPiece(getRandomTetromino());
    }
  }, [currentPiece, paused, gameOver, board, isValidMove, mergePieceToBoard]);

  useEffect(() => {
    const initialBoard = createEmptyBoard();
    setBoard(initialBoard);
    setCurrentPiece(getRandomTetromino());
    setGameOver(false);
    setPaused(false);
    setScore(0);
  }, [createEmptyBoard]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!paused && !gameOver) {
        moveDown();
      }
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [moveDown, paused, gameOver]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!currentPiece || paused || gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (isValidMove(currentPiece, -1, 0)) {
            setCurrentPiece(prev => prev && { ...prev, x: prev.x - 1 });
          }
          break;
        case 'ArrowRight':
          if (isValidMove(currentPiece, 1, 0)) {
            setCurrentPiece(prev => prev && { ...prev, x: prev.x + 1 });
          }
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          setCurrentPiece(prev => prev && rotatePiece(prev));
          break;
        case 'p':
          setPaused(prev => !prev);
          break;
        case 'r':
          if (gameOver) {
            const newBoard = createEmptyBoard();
            setBoard(newBoard);
            setCurrentPiece(getRandomTetromino());
            setGameOver(false);
            setScore(0);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [currentPiece, paused, gameOver, moveDown, createEmptyBoard, isValidMove, rotatePiece]);

  const boardWithPiece = board.map(row => [...row]);
  if (currentPiece) {
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          boardWithPiece[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
        }
      });
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="text-[#16C60C]">Score: {score}</div>
          <button 
            onClick={() => setPaused(!paused)}
            className="px-2 py-1 rounded border border-gray-600 hover:bg-gray-800 text-[#16C60C] text-sm"
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
        <div className="text-gray-400 text-sm">
          Controls: ←↓→ to move | ↑ to rotate | P to pause
        </div>
      </div>

      <div className="relative border border-gray-600 rounded"
           style={{ 
             width: BOARD_WIDTH * CELL_SIZE, 
             height: BOARD_HEIGHT * CELL_SIZE 
           }}>
        {/* Game board rendering */}
        {boardWithPiece.map((row, y) => 
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="absolute border border-gray-800"
              style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: cell || 'transparent'
              }}
            />
          ))
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-xl">Game Over!</div>
              <div className="text-[#16C60C]">Final Score: {score}</div>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded border border-[#16C60C] hover:bg-[#16C60C]/20 text-[#16C60C]"
              >
                Try Again
              </button>
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
