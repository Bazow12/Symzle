import { LeaderboardEntry } from '../types';

const LEADERBOARD_KEY = 'symbology-leaderboard';
const MAX_LEADERBOARD_SIZE = 50;

export const getLeaderboard = (): LeaderboardEntry[] => {
  const saved = localStorage.getItem(LEADERBOARD_KEY);
  if (!saved) return [];
  
  try {
    const leaderboard = JSON.parse(saved);
    return Array.isArray(leaderboard) ? leaderboard : [];
  } catch {
    return [];
  }
};

export const updateLeaderboard = (playerName: string, won: boolean, currentStreak: number, totalWins: number): void => {
  if (!playerName.trim()) return;
  
  const leaderboard = getLeaderboard();
  const today = new Date().toISOString().split('T')[0];
  
  // Find existing player or create new entry
  const existingIndex = leaderboard.findIndex(entry => 
    entry.playerName.toLowerCase() === playerName.toLowerCase()
  );
  
  if (existingIndex >= 0) {
    // Update existing player
    const existing = leaderboard[existingIndex];
    leaderboard[existingIndex] = {
      ...existing,
      consecutiveDays: currentStreak,
      lastWinDate: won ? today : existing.lastWinDate,
      totalWins: totalWins,
    };
  } else {
    // Add new player
    leaderboard.push({
      playerName: playerName.trim(),
      consecutiveDays: currentStreak,
      lastWinDate: won ? today : '',
      totalWins: totalWins,
    });
  }
  
  // Sort by consecutive days (descending), then by total wins (descending)
  leaderboard.sort((a, b) => {
    if (a.consecutiveDays !== b.consecutiveDays) {
      return b.consecutiveDays - a.consecutiveDays;
    }
    return b.totalWins - a.totalWins;
  });
  
  // Keep only top entries
  const trimmedLeaderboard = leaderboard.slice(0, MAX_LEADERBOARD_SIZE);
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmedLeaderboard));
};

export const getPlayerRank = (playerName: string): number => {
  if (!playerName.trim()) return -1;
  
  const leaderboard = getLeaderboard();
  const index = leaderboard.findIndex(entry => 
    entry.playerName.toLowerCase() === playerName.toLowerCase()
  );
  
  return index >= 0 ? index + 1 : -1;
};

export const isStreakActive = (lastWinDate: string): boolean => {
  if (!lastWinDate) return false;
  
  const today = new Date();
  const lastWin = new Date(lastWinDate);
  const diffTime = today.getTime() - lastWin.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Streak is active if last win was today or yesterday
  return diffDays <= 1;
};