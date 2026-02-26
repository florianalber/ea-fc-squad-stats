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
