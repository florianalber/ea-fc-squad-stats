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
import { ArrowLeft, ChevronDown, Clock, Target, Keyboard, Swords } from "lucide-react";
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
        <button onClick={() => navigate(-1)} className="text-primary underline font-medium">Zurück</button>
      </div>
    );
  }

  const winner = getWinner(match);
  const hasStats = match.entry_mode === "photo";

  return (
    <div className="container pb-24 pt-4 space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
        <ArrowLeft className="h-4 w-4" /> Zurück
      </button>

      {/* Header */}
      <div className="ea-scoreboard rounded-2xl p-5 text-center space-y-3 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
          <span className="font-bold uppercase tracking-[0.15em]">{formatDate(match.match_date)}</span>
          {match.match_mode !== "regular" && (
            <span className="flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-primary font-bold uppercase tracking-wider">
              {match.match_mode === "extra_time" ? <Clock className="h-3 w-3" /> : <Target className="h-3 w-3" />}
              {MATCH_MODE_LABELS[match.match_mode as MatchMode]}
            </span>
          )}
          {match.entry_mode === "quick" && (
            <span className="flex items-center gap-0.5 text-muted-foreground/50">
              <Keyboard className="h-3 w-3" /> Nur Ergebnis
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 text-right">
            <p className={`text-base font-extrabold tracking-wide ${winner === "home" ? "text-primary" : "text-foreground/50"}`}>
              {match.home_team_name}
            </p>
            <p className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider">{HOME_PLAYERS}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-mono text-4xl font-black ${winner === "home" ? "text-primary drop-shadow-[0_0_8px_hsl(45_100%_51%/0.3)]" : "text-foreground/30"}`}>
              {match.home_score}
            </span>
            <span className="font-mono text-xl text-muted-foreground/30 font-bold">:</span>
            <span className={`font-mono text-4xl font-black ${winner === "away" ? "text-accent drop-shadow-[0_0_8px_hsl(170_70%_45%/0.3)]" : "text-foreground/30"}`}>
              {match.away_score}
            </span>
          </div>
          <div className="flex-1 text-left">
            <p className={`text-base font-extrabold tracking-wide ${winner === "away" ? "text-accent" : "text-foreground/50"}`}>
              {match.away_team_name}
            </p>
            <p className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider">{AWAY_PLAYERS}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {hasStats ? (
        <div className="space-y-5">
          <div className="ea-card rounded-xl p-4 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground text-center">Match-Statistiken</h3>
            {PRIMARY_STATS.map((stat) => (
              <StatBar key={stat.key} stat={stat} match={match} />
            ))}
          </div>

          <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-center gap-1 rounded-xl border border-border/50 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
              Weitere Statistiken
              <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="ea-card rounded-xl p-4 space-y-4">
                {SECONDARY_STATS.map((stat) => (
                  <StatBar key={stat.key} stat={stat} match={match} />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : (
        <div className="ea-card rounded-xl p-6 text-center">
          <Keyboard className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground font-medium">
            Detaillierte Statistiken nicht verfügbar.
          </p>
          <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-wider font-medium">
            Dieses Spiel wurde per Schnelleingabe erfasst.
          </p>
        </div>
      )}
    </div>
  );
}
