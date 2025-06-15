import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface LeaderboardPlayer {
  id: string;
  displayName: string;
  currentStreak: number;
  maxStreak: number;
  gamesWon: number;
  lastWinDate: string | null;
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('game_stats')
        .select(`
          player_id,
          current_streak,
          max_streak,
          games_won,
          last_win_date,
          players(
            id,
            display_name
          )
        `)
        .order('current_streak', { ascending: false })
        .order('games_won', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedData = data.map((item: any) => ({
        id: item.players.id,
        displayName: item.players.display_name,
        currentStreak: item.current_streak,
        maxStreak: item.max_streak,
        gamesWon: item.games_won,
        lastWinDate: item.last_win_date,
      }));

      setLeaderboard(formattedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const isStreakActive = (lastWinDate: string | null): boolean => {
    if (!lastWinDate) return false;
    
    const today = new Date();
    const lastWin = new Date(lastWinDate);
    const diffTime = today.getTime() - lastWin.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 1;
  };

  return {
    leaderboard,
    loading,
    refetch: fetchLeaderboard,
    isStreakActive,
  };
};