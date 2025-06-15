import { SYMBOLS, PUZZLE_LENGTH } from '../types';

export const generateDailyPuzzle = (date: string): string[] => {
  // Use date as seed for consistent daily puzzle
  const seed = date.split('-').reduce((acc, num) => acc + parseInt(num), 0);
  const random = seedRandom(seed);
  
  const puzzle: string[] = [];
  for (let i = 0; i < PUZZLE_LENGTH; i++) {
    puzzle.push(SYMBOLS[Math.floor(random() * SYMBOLS.length)]);
  }
  return puzzle;
};

export const seedRandom = (seed: number) => {
  let m = 0x80000000;
  let a = 1103515245;
  let c = 12345;
  
  seed = (a * seed + c) % m;
  
  return () => {
    seed = (a * seed + c) % m;
    return seed / (m - 1);
  };
};

export const checkGuess = (guess: string[], solution: string[]) => {
  const feedback = guess.map((symbol, index) => {
    if (symbol === solution[index]) {
      return { symbol, status: 'correct' as const };
    } else if (solution.includes(symbol)) {
      // Check if this symbol appears more times in the guess than in the solution
      const symbolCountInSolution = solution.filter(s => s === symbol).length;
      const symbolCountInGuessUpToIndex = guess.slice(0, index + 1).filter(s => s === symbol).length;
      const correctPositions = guess.filter((s, i) => s === symbol && s === solution[i]).length;
      
      if (symbolCountInGuessUpToIndex - correctPositions <= symbolCountInSolution - correctPositions) {
        return { symbol, status: 'present' as const };
      } else {
        return { symbol, status: 'absent' as const };
      }
    } else {
      return { symbol, status: 'absent' as const };
    }
  });
  
  return feedback;
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const isGameWon = (feedback: any[]): boolean => {
  return feedback.every(f => f.status === 'correct');
};