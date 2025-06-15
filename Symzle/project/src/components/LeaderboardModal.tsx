import React from 'react';
import { X, Trophy, Crown, Medal, Award, User, Calendar, Target, Loader2 } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../hooks/useAuth';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { leaderboard, loading, isStreakActive } = useLeaderboard();
  const { user } = useAuth();

  if (!isOpen) return null;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={20} />;
      case 2:
        return <Medal className="text-gray-300" size={20} />;
      case 3:
        return <Award className="text-amber-600" size={20} />;
      default:
        return <Trophy className="text-purple-400" size={16} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  const isCurrentPlayer = (playerId: string) => {
    return user && user.id === playerId;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-purple-400" size={32} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-400" size={24} />
            <h2 className="text-xl font-bold text-white">Global Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="text-gray-500 mx-auto mb-4" size={48} />
            <p className="text-gray-400">No players on the leaderboard yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to create an account and start competing!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((player, index) => {
              const rank = index + 1;
              const isActive = isStreakActive(player.lastWinDate);
              const isCurrent = isCurrentPlayer(player.id);
              
              return (
                <div
                  key={player.id}
                  className={`
                    rounded-lg p-4 transition-all duration-200
                    ${getRankColor(rank)}
                    ${isCurrent ? 'ring-2 ring-purple-400 ring-opacity-50' : ''}
                    ${rank <= 3 ? 'shadow-lg' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getRankIcon(rank)}
                        <span className="font-bold text-lg">#{rank}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span className="font-semibold">
                          {player.displayName}
                          {isCurrent && (
                            <span className="ml-2 text-xs bg-purple-500 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span className="font-bold">{player.currentStreak}</span>
                        <span className="opacity-75">days</span>
                        {isActive && (
                          <div className="w-2 h-2 bg-green-400 rounded-full ml-1" 
                               title="Active streak" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Target size={14} />
                        <span>{player.gamesWon}</span>
                        <span className="opacity-75">wins</span>
                      </div>
                    </div>
                  </div>
                  
                  {player.lastWinDate && (
                    <div className="mt-2 text-xs opacity-75">
                      Last win: {new Date(player.lastWinDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!user && (
          <div className="mt-6 bg-purple-900 bg-opacity-50 border border-purple-500 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <User size={16} />
              Join the Competition
            </h3>
            <p className="text-purple-200 text-sm">
              Create an account to track your stats and compete on the global leaderboard!
            </p>
          </div>
        )}

        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span>🏆</span> How Rankings Work
          </h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Ranked by consecutive days solved</li>
            <li>• Ties broken by total wins</li>
            <li>• Streak resets if you miss a day</li>
            <li>• Green dot = active streak</li>
          </ul>
        </div>

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

export default LeaderboardModal;