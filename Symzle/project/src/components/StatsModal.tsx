import React from 'react';
import { X, Trophy, Target, Flame, TrendingUp } from 'lucide-react';
import { GameStats } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  gameStatus: 'playing' | 'won' | 'lost';
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, gameStatus }) => {
  if (!isOpen) return null;

  const winPercentage = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  const getNextPuzzleTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Statistics</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="text-purple-400 mr-2" size={20} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.gamesPlayed}</div>
            <div className="text-gray-400 text-sm">Played</div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="text-green-400 mr-2" size={20} />
            </div>
            <div className="text-2xl font-bold text-white">{winPercentage}%</div>
            <div className="text-gray-400 text-sm">Win Rate</div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="text-orange-400 mr-2" size={20} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.winStreak}</div>
            <div className="text-gray-400 text-sm">Current Streak</div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="text-yellow-400 mr-2" size={20} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.maxWinStreak}</div>
            <div className="text-gray-400 text-sm">Max Streak</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Guess Distribution</h3>
          <div className="space-y-2">
            {stats.guessDistribution.map((count, index) => {
              const maxCount = Math.max(...stats.guessDistribution);
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-white w-4 text-sm">{index + 1}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 relative">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {gameStatus !== 'playing' && (
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Next Symzle</div>
            <div className="text-white font-bold text-lg">{getNextPuzzleTime()}</div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StatsModal;