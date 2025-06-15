import { useState, useEffect } from 'react';
import { GameState, GameStats, FeedbackType, MAX_ATTEMPTS, PUZZLE_LENGTH } from '../types';
import { generateDailyPuzzle, checkGuess, getTodayString, isGameWon } from '../utils/gameLogic';
import { useAuth } from './useAuth';
import { useGameStats } from './useGameStats';

const STORAGE_KEY = 'symbology-game-state';

const initialStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  winStreak: 0,
  maxWinStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

const createInitialState = (today: string): GameState => ({
  currentGuess: [],
  guesses: [],
  feedback: [],
  gameStatus: 'playing',
  currentAttempt: 0,
  dailyPuzzle: generateDailyPuzzle(today),
  lastPlayed: today,
  stats: initialStats,
});

export const useGame = () => {
  const { user } = useAuth();
  const { stats: cloudStats, updateStats: updateCloudStats } = useGameStats();
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const today = getTodayString();
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if it's a new day
      if (parsed.lastPlayed !== today) {
        const newState = createInitialState(today);
        // Preserve local stats if no cloud stats available
        return {
          ...newState,
          stats: parsed.stats || initialStats,
        };
      }
      return parsed;
    }
    
    return createInitialState(today);
  });

  // Sync cloud stats to local state when available
  useEffect(() => {
    if (cloudStats && user) {
      setGameState(prev => ({
        ...prev,
        stats: {
          gamesPlayed: cloudStats.gamesPlayed,
          gamesWon: cloudStats.gamesWon,
          winStreak: cloudStats.currentStreak,
          maxWinStreak: cloudStats.maxStreak,
          guessDistribution: cloudStats.guessDistribution,
        },
      }));
    }
  }, [cloudStats, user]);

  useEffect(() => {
    // Only save to localStorage if user is not logged in
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState, user]);

  const addSymbolToGuess = (symbol: string) => {
    if (gameState.currentGuess.length < PUZZLE_LENGTH && gameState.gameStatus === 'playing') {
      setGameState(prev => ({
        ...prev,
        currentGuess: [...prev.currentGuess, symbol],
      }));
    }
  };

  const removeSymbolFromGuess = () => {
    if (gameState.currentGuess.length > 0) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
      }));
    }
  };

  const submitGuess = () => {
    if (gameState.currentGuess.length !== PUZZLE_LENGTH || gameState.gameStatus !== 'playing') {
      return;
    }

    const feedback = checkGuess(gameState.currentGuess, gameState.dailyPuzzle);
    const won = isGameWon(feedback);
    const lost = !won && gameState.currentAttempt + 1 >= MAX_ATTEMPTS;

    setGameState(prev => {
      const newGuesses = [...prev.guesses, prev.currentGuess];
      const newFeedback = [...prev.feedback, feedback];
      const newStatus = won ? 'won' : lost ? 'lost' : 'playing';
      
      let newStats = { ...prev.stats };
      
      if (won || lost) {
        newStats.gamesPlayed += 1;
        if (won) {
          newStats.gamesWon += 1;
          newStats.winStreak += 1;
          newStats.maxWinStreak = Math.max(newStats.maxWinStreak, newStats.winStreak);
          newStats.guessDistribution[prev.currentAttempt] += 1;
        } else {
          newStats.winStreak = 0;
        }

        // Update cloud stats if user is logged in
        if (user && updateCloudStats) {
          updateCloudStats(
            won,
            prev.currentAttempt + 1,
            newStats.winStreak,
            newStats.gamesWon,
            newStats.gamesPlayed
          );
        }
      }

      return {
        ...prev,
        currentGuess: [],
        guesses: newGuesses,
        feedback: newFeedback,
        gameStatus: newStatus,
        currentAttempt: prev.currentAttempt + 1,
        stats: newStats,
      };
    });
  };

  return {
    gameState,
    addSymbolToGuess,
    removeSymbolFromGuess,
    submitGuess,
  };
};