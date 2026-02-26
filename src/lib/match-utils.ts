import { Match, HOME_PLAYERS, AWAY_PLAYERS } from "@/lib/match-types";

export function getHomeWins(matches: Match[]): number {
  return matches.filter((m) => m.home_score > m.away_score).length;
}

export function getAwayWins(matches: Match[]): number {
  return matches.filter((m) => m.away_score > m.home_score).length;
}

export function getGoalDifference(matches: Match[], side: "home" | "away"): number {
  return matches.reduce((acc, m) => {
    if (side === "home") return acc + m.home_score - m.away_score;
    return acc + m.away_score - m.home_score;
  }, 0);
}

export function getCurrentStreak(matches: Match[], side: "home" | "away"): number {
  const sorted = [...matches].sort(
    (a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime()
  );
  let streak = 0;
  for (const m of sorted) {
    const won =
      side === "home" ? m.home_score > m.away_score : m.away_score > m.home_score;
    if (won) streak++;
    else break;
  }
  return streak;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatStatValue(value: number | null | undefined, format?: string): string {
  if (value == null) return "–";
  if (format === "percent") return `${Math.round(value)}%`;
  if (format === "decimal") return value.toFixed(1);
  return String(Math.round(value));
}

export function getWinner(match: Match): "home" | "away" {
  return match.home_score > match.away_score ? "home" : "away";
}

// --- Aggregierte Statistiken ---

/** Gesamtzahl Tore pro Team */
export function getTotalGoals(matches: Match[], side: "home" | "away"): number {
  return matches.reduce((acc, m) => acc + (side === "home" ? m.home_score : m.away_score), 0);
}

/** Durchschnittliche Tore pro Spiel je Team */
export function getGoalsPerGame(matches: Match[], side: "home" | "away"): number {
  if (matches.length === 0) return 0;
  return getTotalGoals(matches, side) / matches.length;
}

/** Höchster Sieg (größte Tordifferenz) eines Teams. Gibt Match + Differenz zurück */
export function getBiggestWin(matches: Match[], side: "home" | "away"): { match: Match; diff: number } | null {
  let best: { match: Match; diff: number } | null = null;
  for (const m of matches) {
    const diff = side === "home" ? m.home_score - m.away_score : m.away_score - m.home_score;
    if (diff > 0 && (!best || diff > best.diff)) {
      best = { match: m, diff };
    }
  }
  return best;
}

/** Durchschnittlicher Ballbesitz (nur Foto-Spiele) */
export function getAvgPossession(matches: Match[], side: "home" | "away"): number | null {
  const photoMatches = matches.filter(
    (m) => m.entry_mode === "photo" && m.home_possession != null && m.away_possession != null
  );
  if (photoMatches.length === 0) return null;
  const total = photoMatches.reduce(
    (acc, m) => acc + ((side === "home" ? m.home_possession : m.away_possession) ?? 0),
    0
  );
  return total / photoMatches.length;
}

/** Gesamtschüsse pro Team */
export function getTotalShots(matches: Match[], side: "home" | "away"): number {
  return matches.reduce((acc, m) => {
    const val = side === "home" ? m.home_shots : m.away_shots;
    return acc + (val ?? 0);
  }, 0);
}

/** Durchschnittliche Schüsse pro Spiel (nur Foto-Spiele) */
export function getShotsPerGame(matches: Match[], side: "home" | "away"): number | null {
  const photoMatches = matches.filter(
    (m) => m.entry_mode === "photo" && m.home_shots != null && m.away_shots != null
  );
  if (photoMatches.length === 0) return null;
  const total = photoMatches.reduce(
    (acc, m) => acc + ((side === "home" ? m.home_shots : m.away_shots) ?? 0),
    0
  );
  return total / photoMatches.length;
}

/** Gesamt-xG pro Team */
export function getTotalXg(matches: Match[], side: "home" | "away"): number | null {
  const photoMatches = matches.filter(
    (m) => m.entry_mode === "photo" && m.home_xg != null && m.away_xg != null
  );
  if (photoMatches.length === 0) return null;
  return photoMatches.reduce(
    (acc, m) => acc + ((side === "home" ? m.home_xg : m.away_xg) ?? 0),
    0
  );
}

/** Durchschnittliche xG pro Spiel (nur Foto-Spiele) */
export function getAvgXg(matches: Match[], side: "home" | "away"): number | null {
  const photoMatches = matches.filter(
    (m) => m.entry_mode === "photo" && m.home_xg != null && m.away_xg != null
  );
  if (photoMatches.length === 0) return null;
  const total = photoMatches.reduce(
    (acc, m) => acc + ((side === "home" ? m.home_xg : m.away_xg) ?? 0),
    0
  );
  return total / photoMatches.length;
}

/** Durchschnittliche Passgenauigkeit (nur Foto-Spiele) */
export function getAvgPassAccuracy(matches: Match[], side: "home" | "away"): number | null {
  const photoMatches = matches.filter(
    (m) => m.entry_mode === "photo" && m.home_pass_accuracy != null && m.away_pass_accuracy != null
  );
  if (photoMatches.length === 0) return null;
  const total = photoMatches.reduce(
    (acc, m) => acc + ((side === "home" ? m.home_pass_accuracy : m.away_pass_accuracy) ?? 0),
    0
  );
  return total / photoMatches.length;
}

/** Anzahl Spiele mit Verlängerung oder Elfmeterschießen */
export function getOvertimeGames(matches: Match[]): { extraTime: number; penalties: number } {
  return {
    extraTime: matches.filter((m) => m.match_mode === "extra_time").length,
    penalties: matches.filter((m) => m.match_mode === "penalties").length,
  };
}

/** Längste Siegesserie aller Zeiten */
export function getLongestStreak(matches: Match[], side: "home" | "away"): number {
  const sorted = [...matches].sort(
    (a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
  );
  let longest = 0;
  let current = 0;
  for (const m of sorted) {
    const won = side === "home" ? m.home_score > m.away_score : m.away_score > m.home_score;
    if (won) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }
  return longest;
}

/** Clean Sheets (Zu-Null-Siege) */
export function getCleanSheets(matches: Match[], side: "home" | "away"): number {
  return matches.filter((m) => {
    if (side === "home") return m.home_score > m.away_score && m.away_score === 0;
    return m.away_score > m.home_score && m.home_score === 0;
  }).length;
}
