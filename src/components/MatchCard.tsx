import { Match, HOME_PLAYERS, AWAY_PLAYERS, MATCH_MODE_LABELS, MatchMode } from "@/lib/match-types";
import { formatDate, getWinner } from "@/lib/match-utils";
import { findTeamByName } from "@/lib/team-utils";
import { useNavigate } from "react-router-dom";
import { Clock, Target, Keyboard } from "lucide-react";

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

export default function MatchCard({ match, compact }: MatchCardProps) {
  const navigate = useNavigate();
  const winner = getWinner(match);
  const homeTeam = findTeamByName(match.home_team_name);
  const awayTeam = findTeamByName(match.away_team_name);

  const borderClass = winner === "home"
    ? "hover:border-primary/40"
    : winner === "away"
    ? "hover:border-accent/40"
    : "hover:border-border/60";

  return (
    <button
      onClick={() => navigate(`/match/${match.id}`)}
      className={`w-full ea-card rounded-xl p-3 text-left transition-all ${borderClass}`}
    >
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
        <span className="font-medium uppercase tracking-wider">{formatDate(match.match_date)}</span>
        <div className="flex items-center gap-1.5">
          {match.match_mode !== "regular" && (
            <span className="flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-primary font-bold uppercase tracking-wider">
              {match.match_mode === "extra_time" ? <Clock className="h-3 w-3" /> : <Target className="h-3 w-3" />}
              {MATCH_MODE_LABELS[match.match_mode as MatchMode]}
            </span>
          )}
          {match.entry_mode === "quick" && (
            <span className="flex items-center gap-0.5 text-muted-foreground/50">
              <Keyboard className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className={`flex-1 flex items-center gap-1.5 min-w-0 ${winner === "home" ? "text-primary" : "text-foreground/70"}`}>
          {homeTeam?.logoUrl && (
            <img src={homeTeam.logoUrl} alt="" className="h-5 w-5 flex-shrink-0 object-contain" />
          )}
          <span className="text-sm font-bold truncate">{match.home_team_name}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-score px-3 py-1.5 border border-border/50">
          <span className={`font-mono text-lg font-black ${winner === "home" ? "text-primary" : "text-score-foreground/60"}`}>
            {match.home_score}
          </span>
          <span className="text-muted-foreground/30 font-mono font-bold">:</span>
          <span className={`font-mono text-lg font-black ${winner === "away" ? "text-accent" : "text-score-foreground/60"}`}>
            {match.away_score}
          </span>
        </div>
        <div className={`flex-1 flex items-center justify-end gap-1.5 min-w-0 ${winner === "away" ? "text-accent" : "text-foreground/70"}`}>
          <span className="text-sm font-bold truncate">{match.away_team_name}</span>
          {awayTeam?.logoUrl && (
            <img src={awayTeam.logoUrl} alt="" className="h-5 w-5 flex-shrink-0 object-contain" />
          )}
        </div>
      </div>

      {!compact && (
        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">
          <span>{HOME_PLAYERS}</span>
          <span>{AWAY_PLAYERS}</span>
        </div>
      )}
    </button>
  );
}
