import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface CloudGameStats {
  id: string;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastPlayedDate: string;
  lastWinDate: string | null;
}

export const useGameStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<CloudGameStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      setStats(null);
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('game_stats')
        .select('*')
        .eq('player_id', user.id);

      if (error) throw error;

      // If no stats found, set to null (user hasn't played yet)
      if (!data || data.length === 0) {
        setStats(null);
        return;
      }

      const statsData = data[0];
      setStats({
        id: statsData.id,
        gamesPlayed: statsData.games_played,
        gamesWon: statsData.games_won,
        currentStreak: statsData.current_streak,
        maxStreak: statsData.max_streak,
        guessDistribution: statsData.guess_distribution,
        lastPlayedDate: statsData.last_played_date,
        lastWinDate: statsData.last_win_date,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async (
    won: boolean,
    attemptNumber: number,
    newStreak: number,
    totalWins: number,
    totalGames: number
  ) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // If no existing stats, create new record
    if (!stats) {
      const newGuessDistribution = [0, 0, 0, 0, 0, 0];
      if (won) {
        newGuessDistribution[attemptNumber - 1] = 1;
      }

      try {
        const { data, error } = await supabase
          .from('game_stats')
          .insert({
            player_id: user.id,
            games_played: totalGames,
            games_won: totalWins,
            current_streak: newStreak,
            max_streak: newStreak,
            guess_distribution: newGuessDistribution,
            last_played_date: today,
            last_win_date: won ? today : null,
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state with new record
        setStats({
          id: data.id,
          gamesPlayed: totalGames,
          gamesWon: totalWins,
          currentStreak: newStreak,
          maxStreak: newStreak,
          guessDistribution: newGuessDistribution,
          lastPlayedDate: today,
          lastWinDate: won ? today : null,
        });
      } catch (error) {
        console.error('Error creating stats:', error);
      }
      return;
    }

    // Update existing stats
    const newGuessDistribution = [...stats.guessDistribution];
    if (won) {
      newGuessDistribution[attemptNumber - 1] += 1;
    }

    const newMaxStreak = Math.max(stats.maxStreak, newStreak);

    try {
      const { error } = await supabase
        .from('game_stats')
        .update({
          games_played: totalGames,
          games_won: totalWins,
          current_streak: newStreak,
          max_streak: newMaxStreak,
          guess_distribution: newGuessDistribution,
          last_played_date: today,
          last_win_date: won ? today : stats.lastWinDate,
        })
        .eq('id', stats.id);

      if (error) throw error;

      // Update local state
      setStats({
        ...stats,
        gamesPlayed: totalGames,
        gamesWon: totalWins,
        currentStreak: newStreak,
        maxStreak: newMaxStreak,
        guessDistribution: newGuessDistribution,
        lastPlayedDate: today,
        lastWinDate: won ? today : stats.lastWinDate,
      });
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  return {
    stats,
    loading,
    updateStats,
    refetch: fetchStats,
  };
};