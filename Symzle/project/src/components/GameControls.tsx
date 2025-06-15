import React from 'react';
import { Check, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onSubmit: () => void;
  canSubmit: boolean;
  gameStatus: 'playing' | 'won' | 'lost';
}

const GameControls: React.FC<GameControlsProps> = ({
  onSubmit,
  canSubmit,
  gameStatus,
}) => {
  const getButtonText = () => {
    if (gameStatus === 'won') return 'You Won!';
    if (gameStatus === 'lost') return 'Game Over';
    return 'Submit Guess';
  };

  const getButtonIcon = () => {
    if (gameStatus === 'won') return <Check size={20} />;
    if (gameStatus === 'lost') return <RotateCcw size={20} />;
    return <Check size={20} />;
  };

  const getButtonColor = () => {
    if (gameStatus === 'won') return 'bg-green-600 hover:bg-green-700';
    if (gameStatus === 'lost') return 'bg-red-600 hover:bg-red-700';
    return 'bg-purple-600 hover:bg-purple-700';
  };

  return (
    <div className="flex justify-center p-4">
      <button
        onClick={onSubmit}
        disabled={!canSubmit || gameStatus !== 'playing'}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
          transition-all duration-200 transform
          ${getButtonColor()}
          ${!canSubmit || gameStatus !== 'playing' 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:scale-105 active:scale-95'
          }
          focus:outline-none focus:ring-2 focus:ring-purple-500
          text-white
        `}
      >
        {getButtonIcon()}
        <span>{getButtonText()}</span>
      </button>
    </div>
  );
};

export default GameControls;