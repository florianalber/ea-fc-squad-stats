// Match type matching PocketBase 'matches' collection schema
export interface Match {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  match_date: string;
  home_team_name: string;
  away_team_name: string;
  home_score: number;
  away_score: number;
  match_mode: string;
  entry_mode: string;
  home_possession: number | null;
  away_possession: number | null;
  home_shots: number | null;
  away_shots: number | null;
  home_xg: number | null;
  away_xg: number | null;
  home_shot_accuracy: number | null;
  away_shot_accuracy: number | null;
  home_pass_accuracy: number | null;
  away_pass_accuracy: number | null;
  home_passes: number | null;
  away_passes: number | null;
  home_dribble_success: number | null;
  away_dribble_success: number | null;
  home_tackles: number | null;
  away_tackles: number | null;
  home_tackles_won: number | null;
  away_tackles_won: number | null;
  home_ball_recovery_time: number | null;
  away_ball_recovery_time: number | null;
  home_interceptions: number | null;
  away_interceptions: number | null;
  home_saves: number | null;
  away_saves: number | null;
  home_fouls: number | null;
  away_fouls: number | null;
  home_offsides: number | null;
  away_offsides: number | null;
  home_corners: number | null;
  away_corners: number | null;
  home_free_kicks: number | null;
  away_free_kicks: number | null;
  home_penalties: number | null;
  away_penalties: number | null;
  home_yellow_cards: number | null;
  away_yellow_cards: number | null;
  photo_url: string | null;
}

export const HOME_PLAYERS = "Jeniffen + Florian";
export const AWAY_PLAYERS = "Dirk + Niklas";

export type MatchMode = "regular" | "extra_time" | "penalties";
export type EntryMode = "photo" | "quick";

export const MATCH_MODE_LABELS: Record<MatchMode, string> = {
  regular: "Regulär",
  extra_time: "Verlängerung",
  penalties: "Elfmeterschießen",
};

export interface PrimaryStat {
  key: string;
  label: string;
  homeKey: keyof Match;
  awayKey: keyof Match;
  format?: "percent" | "decimal" | "number";
}

export interface SecondaryStat extends PrimaryStat {}

export const PRIMARY_STATS: PrimaryStat[] = [
  { key: "possession", label: "Ballbesitz", homeKey: "home_possession", awayKey: "away_possession", format: "percent" },
  { key: "shots", label: "Schüsse", homeKey: "home_shots", awayKey: "away_shots", format: "number" },
  { key: "xg", label: "Erwartete Tore (xG)", homeKey: "home_xg", awayKey: "away_xg", format: "decimal" },
  { key: "shot_accuracy", label: "Schusspräzision", homeKey: "home_shot_accuracy", awayKey: "away_shot_accuracy", format: "percent" },
  { key: "pass_accuracy", label: "Passgenauigkeit", homeKey: "home_pass_accuracy", awayKey: "away_pass_accuracy", format: "percent" },
  { key: "passes", label: "Pässe", homeKey: "home_passes", awayKey: "away_passes", format: "number" },
  { key: "dribble_success", label: "Dribbling-Erfolg", homeKey: "home_dribble_success", awayKey: "away_dribble_success", format: "percent" },
  { key: "tackles", label: "Zweikämpfe", homeKey: "home_tackles", awayKey: "away_tackles", format: "number" },
  { key: "tackles_won", label: "Gewonnene Zweikämpfe", homeKey: "home_tackles_won", awayKey: "away_tackles_won", format: "number" },
];

export const SECONDARY_STATS: SecondaryStat[] = [
  { key: "ball_recovery_time", label: "Ballrückeroberungs-Zeit", homeKey: "home_ball_recovery_time", awayKey: "away_ball_recovery_time", format: "decimal" },
  { key: "interceptions", label: "Abgefangene Bälle", homeKey: "home_interceptions", awayKey: "away_interceptions", format: "number" },
  { key: "saves", label: "Paraden", homeKey: "home_saves", awayKey: "away_saves", format: "number" },
  { key: "fouls", label: "Begangene Fouls", homeKey: "home_fouls", awayKey: "away_fouls", format: "number" },
  { key: "offsides", label: "Abseits", homeKey: "home_offsides", awayKey: "away_offsides", format: "number" },
  { key: "corners", label: "Ecken", homeKey: "home_corners", awayKey: "away_corners", format: "number" },
  { key: "free_kicks", label: "Freistöße", homeKey: "home_free_kicks", awayKey: "away_free_kicks", format: "number" },
  { key: "penalties_stat", label: "Elfmeter", homeKey: "home_penalties", awayKey: "away_penalties", format: "number" },
  { key: "yellow_cards", label: "Gelbe Karten", homeKey: "home_yellow_cards", awayKey: "away_yellow_cards", format: "number" },
];
