import React, { useEffect, useState } from 'react';
import GameHeader from './components/GameHeader';
import GameBoard from './components/GameBoard';
import SymbolSelector from './components/SymbolSelector';
import GameControls from './components/GameControls';
import InstructionsModal from './components/InstructionsModal';
import AuthModal from './components/AuthModal';
import { useGame } from './hooks/useGame';
import { useAuth } from './hooks/useAuth';
import { PUZZLE_LENGTH } from './types';

function App() {
  const { gameState, addSymbolToGuess, removeSymbolFromGuess, submitGuess } = useGame();
  const { user, loading: authLoading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    // Show welcome modal for first-time players
    const hasPlayedBefore = localStorage.getItem('symbology-game-state');
    if (!hasPlayedBefore && !authLoading) {
      setShowWelcome(true);
    }
  }, [authLoading]);

  useEffect(() => {
    // Show auth prompt after winning if not logged in
    if (gameState.gameStatus === 'won' && !user && !authLoading) {
      const timer = setTimeout(() => {
        setShowAuthPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus, user, authLoading]);

  const canSubmit = gameState.currentGuess.length === PUZZLE_LENGTH;
  const isGameOver = gameState.gameStatus !== 'playing';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameHeader 
        stats={gameState.stats} 
        gameStatus={gameState.gameStatus}
      />
      
      <main className="max-w-2xl mx-auto py-8">
        <GameBoard gameState={gameState} />
        
        {!isGameOver && (
          <>
            <SymbolSelector
              onSymbolSelect={addSymbolToGuess}
              onBackspace={removeSymbolFromGuess}
              disabled={isGameOver}
            />
            
            <GameControls
              onSubmit={submitGuess}
              canSubmit={canSubmit}
              gameStatus={gameState.gameStatus}
            />
          </>
        )}

        {isGameOver && (
          <div className="text-center py-8">
            <div className="bg-gray-800 rounded-xl p-6 mx-4">
              <h2 className="text-2xl font-bold mb-4">
                {gameState.gameStatus === 'won' ? '🎉 Congratulations!' : '😔 Better luck tomorrow!'}
              </h2>
              <p className="text-gray-300 mb-4">
                {gameState.gameStatus === 'won' 
                  ? `You solved today's Symzle in ${gameState.currentAttempt} attempt${gameState.currentAttempt === 1 ? '' : 's'}!`
                  : 'The correct sequence was:'
                }
              </p>
              {gameState.gameStatus === 'lost' && (
                <div className="flex justify-center gap-2 mb-4">
                  {gameState.dailyPuzzle.map((symbol, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 bg-green-500 border-2 border-green-500 rounded-lg flex items-center justify-center text-xl font-bold text-white"
                    >
                      {symbol}
                    </div>
                  ))}
                </div>
              )}
              
              {gameState.gameStatus === 'won' && gameState.stats.winStreak > 1 && (
                <div className="bg-purple-600 rounded-lg p-3 mb-4">
                  <p className="text-white font-semibold">
                    🔥 {gameState.stats.winStreak} Day Streak!
                  </p>
                  {!user && (
                    <p className="text-purple-200 text-sm">
                      Sign in to save your progress and compete globally!
                    </p>
                  )}
                </div>
              )}
              
              <p className="text-gray-400 text-sm">
                Come back tomorrow for a new puzzle!
              </p>
            </div>
          </div>
        )}
      </main>

      <InstructionsModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />

      <AuthModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
      />
    </div>
  );
}

export default App;