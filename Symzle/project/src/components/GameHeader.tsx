import React, { useState } from 'react';
import { Info, BarChart3, Crown, Trophy, User, LogOut } from 'lucide-react';
import { GameStats } from '../types';
import { useAuth } from '../hooks/useAuth';
import StatsModal from './StatsModal';
import InstructionsModal from './InstructionsModal';
import LeaderboardModal from './LeaderboardModal';
import AuthModal from './AuthModal';

interface GameHeaderProps {
  stats: GameStats;
  gameStatus: 'playing' | 'won' | 'lost';
}

const GameHeader: React.FC<GameHeaderProps> = ({ stats, gameStatus }) => {
  const [showStats, setShowStats] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const { user, signOut, loading } = useAuth();

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <header className="bg-gray-900 text-white p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-teal-500 p-2 rounded-lg">
              <Crown className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                Symzle
              </h1>
              <p className="text-gray-400 text-sm">{today}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-lg">
                  <User size={16} className="text-purple-400" />
                  <span className="text-sm text-white truncate max-w-24">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-lg transition-colors text-sm font-semibold"
              >
                <User size={16} />
                Sign In
              </button>
            )}
            
            <button
              onClick={() => setShowLeaderboard(true)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="Leaderboard"
            >
              <Trophy size={20} />
            </button>
            
            <button
              onClick={() => setShowInstructions(true)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="Instructions"
            >
              <Info size={20} />
            </button>
            
            <button
              onClick={() => setShowStats(true)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="Statistics"
            >
              <BarChart3 size={20} />
            </button>
          </div>
        </div>
      </header>

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        gameStatus={gameStatus}
      />
      
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </>
  );
};

export default GameHeader;