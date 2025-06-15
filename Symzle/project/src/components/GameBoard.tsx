import React from 'react';
import { GameState, FeedbackType, MAX_ATTEMPTS, PUZZLE_LENGTH } from '../types';

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const getFeedbackColor = (status: FeedbackType['status']) => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 border-green-500 text-white';
      case 'present':
        return 'bg-yellow-500 border-yellow-500 text-white';
      case 'absent':
        return 'bg-gray-600 border-gray-600 text-white';
      default:
        return 'bg-gray-800 border-gray-700 text-gray-300';
    }
  };

  const renderRow = (rowIndex: number) => {
    const isCurrentRow = rowIndex === gameState.currentAttempt;
    const isCompletedRow = rowIndex < gameState.guesses.length;
    
    let symbols: string[] = [];
    let feedback: FeedbackType[] = [];
    
    if (isCompletedRow) {
      symbols = gameState.guesses[rowIndex];
      feedback = gameState.feedback[rowIndex];
    } else if (isCurrentRow) {
      symbols = [...gameState.currentGuess];
      // Pad with empty strings to show empty cells
      while (symbols.length < PUZZLE_LENGTH) {
        symbols.push('');
      }
    } else {
      symbols = Array(PUZZLE_LENGTH).fill('');
    }

    return (
      <div key={rowIndex} className="flex gap-2 mb-2">
        {symbols.map((symbol, colIndex) => {
          const cellFeedback = feedback[colIndex];
          const isEmpty = !symbol;
          const isAnimating = isCompletedRow && cellFeedback;
          
          return (
            <div
              key={colIndex}
              className={`
                w-16 h-16 border-2 rounded-lg flex items-center justify-center
                text-2xl font-bold transition-all duration-300 transform
                ${isEmpty ? 'bg-gray-800 border-gray-700' : ''}
                ${isCurrentRow && !isEmpty ? 'bg-gray-700 border-gray-600 scale-105' : ''}
                ${cellFeedback ? getFeedbackColor(cellFeedback.status) : ''}
                ${isAnimating ? 'animate-pulse' : ''}
              `}
              style={{
                animationDelay: isAnimating ? `${colIndex * 100}ms` : '0ms',
              }}
            >
              {symbol}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-gray-900 rounded-xl p-6 shadow-2xl">
        {Array.from({ length: MAX_ATTEMPTS }, (_, index) => renderRow(index))}
      </div>
    </div>
  );
};

export default GameBoard;