import teamsData from "@/data/teams.json";

export interface Team {
  id: number;
  name: string;
  logoUrl: string | null;
  league: string;
  isPopular: boolean;
}

// Pre-sorted by name for display; build a lowercase index for fast search
const allTeams: Team[] = teamsData as Team[];

// Deduplicate by name – keep the one with a logo (or the first occurrence)
const uniqueByName = new Map<string, Team>();
for (const t of allTeams) {
  const key = t.name.toLowerCase();
  const existing = uniqueByName.get(key);
  if (!existing || (!existing.logoUrl && t.logoUrl)) {
    uniqueByName.set(key, t);
  }
}
const teams: Team[] = Array.from(uniqueByName.values()).sort((a, b) =>
  a.name.localeCompare(b.name)
);

/** All unique teams (deduplicated by name, prioritizing entries with logos) */
export function getAllTeams(): Team[] {
  return teams;
}

/**
 * Simple fuzzy search: matches if every word in the query appears as a
 * substring in the team name (case-insensitive). Returns results sorted by
 * best-match-first (exact prefix > contains).
 */
export function searchTeams(query: string, limit = 10): Team[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  const matches: { team: Team; score: number }[] = [];

  for (const team of teams) {
    const lower = team.name.toLowerCase();

    // Every query word must appear in the name
    const allMatch = words.every((w) => lower.includes(w));
    if (!allMatch) continue;

    // Score: lower is better
    let score = 0;
    if (lower === q) {
      score = 0; // exact match
    } else if (lower.startsWith(q)) {
      score = 1; // prefix match
    } else {
      score = 2 + lower.indexOf(words[0]); // further in string → worse
    }

    // Boost popular teams
    if (team.isPopular) score -= 0.5;

    matches.push({ team, score });
  }

  matches.sort((a, b) => a.score - b.score);
  return matches.slice(0, limit).map((m) => m.team);
}

/**
 * Find a team by exact name (case-insensitive).
 * Returns undefined if not found.
 */
export function findTeamByName(name: string): Team | undefined {
  if (!name) return undefined;
  return uniqueByName.get(name.toLowerCase());
}

/**
 * Find a team by ID.
 */
export function findTeamById(id: number): Team | undefined {
  return allTeams.find((t) => t.id === id);
}
