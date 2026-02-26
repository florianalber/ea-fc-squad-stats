import { Match, HOME_PLAYERS, AWAY_PLAYERS, MATCH_MODE_LABELS, MatchMode } from "@/lib/match-types";
import { formatDate, getWinner } from "@/lib/match-utils";
import { useNavigate } from "react-router-dom";
import { Trophy, Clock, Target, Camera, Keyboard } from "lucide-react";

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

export default function MatchCard({ match, compact }: MatchCardProps) {
  const navigate = useNavigate();
  const winner = getWinner(match);

  return (
    <button
      onClick={() => navigate(`/match/${match.id}`)}
      className="w-full rounded-lg border bg-card p-3 text-left transition-colors hover:bg-secondary/50"
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>{formatDate(match.match_date)}</span>
        <div className="flex items-center gap-1.5">
          {match.match_mode !== "regular" && (
            <span className="flex items-center gap-0.5 rounded bg-accent/15 px-1.5 py-0.5 text-accent font-medium">
              {match.match_mode === "extra_time" ? <Clock className="h-3 w-3" /> : <Target className="h-3 w-3" />}
              {MATCH_MODE_LABELS[match.match_mode as MatchMode]}
            </span>
          )}
          {match.entry_mode === "quick" && (
            <span className="flex items-center gap-0.5 text-muted-foreground/70">
              <Keyboard className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className={`flex-1 text-sm font-semibold truncate ${winner === "home" ? "text-home" : ""}`}>
          {match.home_team_name}
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-score px-3 py-1">
          <span className={`font-mono text-lg font-bold ${winner === "home" ? "text-home" : "text-score-foreground"}`}>
            {match.home_score}
          </span>
          <span className="text-score-foreground/40 font-mono">:</span>
          <span className={`font-mono text-lg font-bold ${winner === "away" ? "text-away" : "text-score-foreground"}`}>
            {match.away_score}
          </span>
        </div>
        <div className={`flex-1 text-sm font-semibold text-right truncate ${winner === "away" ? "text-away" : ""}`}>
          {match.away_team_name}
        </div>
      </div>

      {!compact && (
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{HOME_PLAYERS}</span>
          <span>{AWAY_PLAYERS}</span>
        </div>
      )}
    </button>
  );
}
