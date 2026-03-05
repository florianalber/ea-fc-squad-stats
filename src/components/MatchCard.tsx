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
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground mb-2">
        <span className="font-medium uppercase tracking-wider">{formatDate(match.match_date)}</span>
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

      <div className="flex items-center justify-center gap-3">
        {/* Home Team */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
          {homeTeam?.logoUrl && (
            <img src={homeTeam.logoUrl} alt="" className="h-10 w-10 flex-shrink-0 object-contain" />
          )}
          <div className="flex flex-col items-end min-w-0">
            <span className={`text-xs font-bold truncate max-w-full leading-tight ${winner === "home" ? "text-primary" : "text-foreground/70"}`}>
              {match.home_team_name}
            </span>
            {homeTeam?.overall != null && (
              <span className={`mt-0.5 text-[10px] font-mono font-bold rounded-md px-1.5 py-0.5 leading-none ${winner === "home" ? "bg-primary/15 text-primary/80" : "bg-muted/40 text-muted-foreground/50"}`}>
                {homeTeam.overall} GES
              </span>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1 rounded-xl bg-score px-4 py-1.5 border border-border/50 shadow-sm shadow-black/20 flex-shrink-0">
          <span className={`font-mono text-3xl font-black leading-none tabular-nums ${winner === "home" ? "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]" : "text-score-foreground/80"}`}>
            {match.home_score}
          </span>
          <span className="text-muted-foreground/30 font-mono text-xl font-bold leading-none mx-0.5">:</span>
          <span className={`font-mono text-3xl font-black leading-none tabular-nums ${winner === "away" ? "text-accent drop-shadow-[0_0_6px_hsl(var(--accent)/0.4)]" : "text-score-foreground/80"}`}>
            {match.away_score}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-start">
          <div className="flex flex-col items-start min-w-0">
            <span className={`text-xs font-bold truncate max-w-full leading-tight ${winner === "away" ? "text-accent" : "text-foreground/70"}`}>
              {match.away_team_name}
            </span>
            {awayTeam?.overall != null && (
              <span className={`mt-0.5 text-[10px] font-mono font-bold rounded-md px-1.5 py-0.5 leading-none ${winner === "away" ? "bg-accent/15 text-accent/80" : "bg-muted/40 text-muted-foreground/50"}`}>
                {awayTeam.overall} GES
              </span>
            )}
          </div>
          {awayTeam?.logoUrl && (
            <img src={awayTeam.logoUrl} alt="" className="h-10 w-10 flex-shrink-0 object-contain" />
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
