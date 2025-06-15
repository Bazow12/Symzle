/*
  # Create players and game stats tables

  1. New Tables
    - `players`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `display_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `game_stats`
      - `id` (uuid, primary key)
      - `player_id` (uuid, foreign key to players)
      - `games_played` (integer)
      - `games_won` (integer)
      - `current_streak` (integer)
      - `max_streak` (integer)
      - `guess_distribution` (integer array)
      - `last_played_date` (date)
      - `last_win_date` (date, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policy for public leaderboard access
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_stats table
CREATE TABLE IF NOT EXISTS game_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  games_played integer DEFAULT 0,
  games_won integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  max_streak integer DEFAULT 0,
  guess_distribution integer[] DEFAULT ARRAY[0,0,0,0,0,0],
  last_played_date date DEFAULT CURRENT_DATE,
  last_win_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

-- Players policies
CREATE POLICY "Users can read own player data"
  ON players
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own player data"
  ON players
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own player data"
  ON players
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Game stats policies
CREATE POLICY "Users can read own game stats"
  ON game_stats
  FOR SELECT
  TO authenticated
  USING (player_id = auth.uid());

CREATE POLICY "Users can insert own game stats"
  ON game_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Users can update own game stats"
  ON game_stats
  FOR UPDATE
  TO authenticated
  USING (player_id = auth.uid());

-- Public leaderboard access
CREATE POLICY "Anyone can read leaderboard data"
  ON players
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read leaderboard stats"
  ON game_stats
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_stats_player_id ON game_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_current_streak ON game_stats(current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_game_stats_last_win_date ON game_stats(last_win_date DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_stats_updated_at
  BEFORE UPDATE ON game_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();