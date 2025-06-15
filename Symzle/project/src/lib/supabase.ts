import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      game_stats: {
        Row: {
          id: string;
          player_id: string;
          games_played: number;
          games_won: number;
          current_streak: number;
          max_streak: number;
          guess_distribution: number[];
          last_played_date: string;
          last_win_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          games_played?: number;
          games_won?: number;
          current_streak?: number;
          max_streak?: number;
          guess_distribution?: number[];
          last_played_date?: string;
          last_win_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          games_played?: number;
          games_won?: number;
          current_streak?: number;
          max_streak?: number;
          guess_distribution?: number[];
          last_played_date?: string;
          last_win_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};