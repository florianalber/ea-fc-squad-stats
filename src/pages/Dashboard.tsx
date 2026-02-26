import { useMatches } from "@/hooks/use-matches";
import { HOME_PLAYERS, AWAY_PLAYERS } from "@/lib/match-types";
import { getHomeWins, getAwayWins, getGoalDifference, getCurrentStreak } from "@/lib/match-utils";
import MatchCard from "@/components/MatchCard";
import { useNavigate } from "react-router-dom";
import { PlusCircle, TrendingUp, Flame, Swords } from "lucide-react";

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
        <h1 className="text-2xl font-extrabold text-center tracking-tight">Noch keine Matches gespielt</h1>
        <p className="text-muted-foreground text-center">Zeit für das erste Duell!</p>
        <button
          onClick={() => navigate("/new")}
          className="flex items-center gap-2 rounded-lg ea-gold-gradient px-6 py-3 font-bold text-primary-foreground transition-transform hover:scale-105 ea-glow-gold"
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
      <div className="ea-scoreboard rounded-2xl p-6 text-center relative overflow-hidden">
        {/* Decorative lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <Swords className="h-3.5 w-3.5 text-primary/60" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
            Rivalry Record
          </p>
          <Swords className="h-3.5 w-3.5 text-primary/60" />
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 text-right">
            <p className="text-sm font-bold text-primary mb-1 tracking-wide">{HOME_PLAYERS}</p>
          </div>
          <div className="flex items-baseline gap-2 animate-score-pop">
            <span className="font-mono text-5xl font-black text-primary drop-shadow-[0_0_10px_hsl(45_100%_51%/0.3)]">{homeWins}</span>
            <span className="font-mono text-2xl font-bold text-muted-foreground/40">:</span>
            <span className="font-mono text-5xl font-black text-accent drop-shadow-[0_0_10px_hsl(170_70%_45%/0.3)]">{awayWins}</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-accent mb-1 tracking-wide">{AWAY_PLAYERS}</p>
          </div>
        </div>
        <p className="mt-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{matches.length} Spiele gespielt</p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="ea-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">{HOME_PLAYERS}</p>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tordiff.</span>
            <span className="font-mono font-bold text-foreground ml-auto">{homeGD > 0 ? `+${homeGD}` : homeGD}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Serie</span>
            <span className="font-mono font-bold text-foreground ml-auto">{homeStreak} {homeStreak === 1 ? "Sieg" : "Siege"}</span>
          </div>
        </div>
        <div className="ea-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-accent uppercase tracking-wider">{AWAY_PLAYERS}</p>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tordiff.</span>
            <span className="font-mono font-bold text-foreground ml-auto">{awayGD > 0 ? `+${awayGD}` : awayGD}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Serie</span>
            <span className="font-mono font-bold text-foreground ml-auto">{awayStreak} {awayStreak === 1 ? "Sieg" : "Siege"}</span>
          </div>
        </div>
      </div>

      {/* Last 3 Matches */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">Letzte Spiele</h2>
        <div className="space-y-2">
          {lastThree.map((match) => (
            <MatchCard key={match.id} match={match} compact />
          ))}
        </div>
      </div>
    </div>
  );
}
