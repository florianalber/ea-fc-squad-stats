import { useMatches } from "@/hooks/use-matches";
import { HOME_PLAYERS, AWAY_PLAYERS } from "@/lib/match-types";
import { getHomeWins, getAwayWins, getGoalDifference, getCurrentStreak } from "@/lib/match-utils";
import MatchCard from "@/components/MatchCard";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trophy, TrendingUp, Flame } from "lucide-react";

export default function Dashboard() {
  const { data: matches = [], isLoading } = useMatches();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 pb-20">
        <div className="text-6xl">⚽</div>
        <h1 className="text-2xl font-bold text-center">Noch keine Matches gespielt</h1>
        <p className="text-muted-foreground text-center">Zeit für das erste Duell!</p>
        <button
          onClick={() => navigate("/new")}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
        >
          <PlusCircle className="h-5 w-5" />
          Erstes Spiel erfassen
        </button>
      </div>
    );
  }

  const homeWins = getHomeWins(matches);
  const awayWins = getAwayWins(matches);
  const homeGD = getGoalDifference(matches, "home");
  const awayGD = getGoalDifference(matches, "away");
  const homeStreak = getCurrentStreak(matches, "home");
  const awayStreak = getCurrentStreak(matches, "away");
  const lastThree = matches.slice(0, 3);

  return (
    <div className="container pb-24 pt-6 space-y-6">
      {/* Hero Scoreboard */}
      <div className="rounded-2xl bg-score p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-score-foreground/50 mb-4">
          Gesamtstand
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 text-right">
            <p className="text-sm font-semibold text-home mb-1">{HOME_PLAYERS}</p>
          </div>
          <div className="flex items-baseline gap-2 animate-score-pop">
            <span className="font-mono text-5xl font-black text-home">{homeWins}</span>
            <span className="font-mono text-2xl font-bold text-score-foreground/30">:</span>
            <span className="font-mono text-5xl font-black text-away">{awayWins}</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-away mb-1">{AWAY_PLAYERS}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-score-foreground/40">{matches.length} Spiele gespielt</p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold text-home">{HOME_PLAYERS}</p>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tordifferenz:</span>
            <span className="font-mono font-bold">{homeGD > 0 ? `+${homeGD}` : homeGD}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Serie:</span>
            <span className="font-mono font-bold">{homeStreak} {homeStreak === 1 ? "Sieg" : "Siege"}</span>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold text-away">{AWAY_PLAYERS}</p>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tordifferenz:</span>
            <span className="font-mono font-bold">{awayGD > 0 ? `+${awayGD}` : awayGD}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Serie:</span>
            <span className="font-mono font-bold">{awayStreak} {awayStreak === 1 ? "Sieg" : "Siege"}</span>
          </div>
        </div>
      </div>

      {/* Last 3 Matches */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Letzte Spiele</h2>
        <div className="space-y-2">
          {lastThree.map((match) => (
            <MatchCard key={match.id} match={match} compact />
          ))}
        </div>
      </div>
    </div>
  );
}
