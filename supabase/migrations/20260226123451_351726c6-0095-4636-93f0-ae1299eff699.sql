
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  match_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Core match data
  home_team_name TEXT NOT NULL,
  away_team_name TEXT NOT NULL,
  home_score INTEGER NOT NULL,
  away_score INTEGER NOT NULL,
  match_mode TEXT NOT NULL DEFAULT 'regular' CHECK (match_mode IN ('regular', 'extra_time', 'penalties')),
  entry_mode TEXT NOT NULL DEFAULT 'quick' CHECK (entry_mode IN ('photo', 'quick')),
  
  -- Primary stats (nullable for quick entry)
  home_possession NUMERIC,
  away_possession NUMERIC,
  home_shots INTEGER,
  away_shots INTEGER,
  home_xg NUMERIC,
  away_xg NUMERIC,
  home_shot_accuracy NUMERIC,
  away_shot_accuracy NUMERIC,
  home_pass_accuracy NUMERIC,
  away_pass_accuracy NUMERIC,
  home_passes INTEGER,
  away_passes INTEGER,
  home_dribble_success NUMERIC,
  away_dribble_success NUMERIC,
  home_tackles INTEGER,
  away_tackles INTEGER,
  home_tackles_won INTEGER,
  away_tackles_won INTEGER,
  
  -- Secondary stats
  home_ball_recovery_time NUMERIC,
  away_ball_recovery_time NUMERIC,
  home_interceptions INTEGER,
  away_interceptions INTEGER,
  home_saves INTEGER,
  away_saves INTEGER,
  home_fouls INTEGER,
  away_fouls INTEGER,
  home_offsides INTEGER,
  away_offsides INTEGER,
  home_corners INTEGER,
  away_corners INTEGER,
  home_free_kicks INTEGER,
  away_free_kicks INTEGER,
  home_penalties INTEGER,
  away_penalties INTEGER,
  home_yellow_cards INTEGER,
  away_yellow_cards INTEGER,
  
  -- Photo reference
  photo_url TEXT
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Public read/write for this group app (no auth needed)
CREATE POLICY "Allow public read" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.matches FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.matches FOR DELETE USING (true);
