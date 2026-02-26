import { useParams, useNavigate } from "react-router-dom";
import { useMatch } from "@/hooks/use-matches";
import {
  HOME_PLAYERS,
  AWAY_PLAYERS,
  MATCH_MODE_LABELS,
  PRIMARY_STATS,
  SECONDARY_STATS,
  MatchMode,
} from "@/lib/match-types";
import { formatDate, getWinner } from "@/lib/match-utils";
import StatBar from "@/components/StatBar";
import { ArrowLeft, ChevronDown, Clock, Target, Keyboard } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading } = useMatch(id!);
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Match nicht gefunden.</p>
        <button onClick={() => navigate(-1)} className="text-primary underline">Zurück</button>
      </div>
    );
  }

  const winner = getWinner(match);
  const hasStats = match.entry_mode === "photo";

  return (
    <div className="container pb-24 pt-4 space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Zurück
      </button>

      {/* Header */}
      <div className="rounded-2xl bg-score p-5 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs text-score-foreground/50">
          <span>{formatDate(match.match_date)}</span>
          {match.match_mode !== "regular" && (
            <span className="flex items-center gap-0.5 rounded bg-accent/20 px-1.5 py-0.5 text-accent font-medium">
              {match.match_mode === "extra_time" ? <Clock className="h-3 w-3" /> : <Target className="h-3 w-3" />}
              {MATCH_MODE_LABELS[match.match_mode as MatchMode]}
            </span>
          )}
          {match.entry_mode === "quick" && (
            <span className="flex items-center gap-0.5 text-score-foreground/40">
              <Keyboard className="h-3 w-3" /> Nur Ergebnis
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 text-right">
            <p className={`text-base font-bold ${winner === "home" ? "text-home" : "text-score-foreground/70"}`}>
              {match.home_team_name}
            </p>
            <p className="text-[10px] text-score-foreground/40">{HOME_PLAYERS}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-mono text-4xl font-black ${winner === "home" ? "text-home" : "text-score-foreground/60"}`}>
              {match.home_score}
            </span>
            <span className="font-mono text-xl text-score-foreground/30">:</span>
            <span className={`font-mono text-4xl font-black ${winner === "away" ? "text-away" : "text-score-foreground/60"}`}>
              {match.away_score}
            </span>
          </div>
          <div className="flex-1 text-left">
            <p className={`text-base font-bold ${winner === "away" ? "text-away" : "text-score-foreground/70"}`}>
              {match.away_team_name}
            </p>
            <p className="text-[10px] text-score-foreground/40">{AWAY_PLAYERS}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {hasStats ? (
        <div className="space-y-5">
          <div className="space-y-3">
            {PRIMARY_STATS.map((stat) => (
              <StatBar key={stat.key} stat={stat} match={match} />
            ))}
          </div>

          <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-center gap-1 rounded-lg border py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50 transition-colors">
              Weitere Statistiken
              <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              {SECONDARY_STATS.map((stat) => (
                <StatBar key={stat.key} stat={stat} match={match} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : (
        <div className="rounded-xl border bg-secondary/30 p-6 text-center">
          <Keyboard className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Detaillierte Statistiken nicht verfügbar.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Dieses Spiel wurde per Schnelleingabe erfasst.
          </p>
        </div>
      )}
    </div>
  );
}
