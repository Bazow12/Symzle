export interface GameState {
  currentGuess: string[];
  guesses: string[][];
  feedback: FeedbackType[][];
  gameStatus: 'playing' | 'won' | 'lost';
  currentAttempt: number;
  dailyPuzzle: string[];
  lastPlayed: string;
  stats: GameStats;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  winStreak: number;
  maxWinStreak: number;
  guessDistribution: number[];
}

export interface FeedbackType {
  symbol: string;
  status: 'correct' | 'present' | 'absent';
}

export const SYMBOLS = ['◆', '◇', '●', '○', '▲', '△', '■', '□'];
export const MAX_ATTEMPTS = 6;
export const PUZZLE_LENGTH = 5;