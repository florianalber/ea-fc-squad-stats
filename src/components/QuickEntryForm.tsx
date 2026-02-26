import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInsertMatch } from "@/hooks/use-matches";
import { MatchMode, MATCH_MODE_LABELS } from "@/lib/match-types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import TeamAutocomplete from "@/components/TeamAutocomplete";

export default function QuickEntryForm() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [matchMode, setMatchMode] = useState<MatchMode>("regular");
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split("T")[0]);
  const insertMatch = useInsertMatch();
  const navigate = useNavigate();

  const canSubmit = homeTeam && awayTeam && homeScore !== "" && awayScore !== "" && homeScore !== awayScore;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      await insertMatch.mutateAsync({
        home_team_name: homeTeam,
        away_team_name: awayTeam,
        home_score: parseInt(homeScore),
        away_score: parseInt(awayScore),
        match_mode: matchMode,
        entry_mode: "quick",
        match_date: matchDate,
        home_possession: null, away_possession: null,
        home_shots: null, away_shots: null,
        home_xg: null, away_xg: null,
        home_shot_accuracy: null, away_shot_accuracy: null,
        home_pass_accuracy: null, away_pass_accuracy: null,
        home_passes: null, away_passes: null,
        home_dribble_success: null, away_dribble_success: null,
        home_tackles: null, away_tackles: null,
        home_tackles_won: null, away_tackles_won: null,
        home_ball_recovery_time: null, away_ball_recovery_time: null,
        home_interceptions: null, away_interceptions: null,
        home_saves: null, away_saves: null,
        home_fouls: null, away_fouls: null,
        home_offsides: null, away_offsides: null,
        home_corners: null, away_corners: null,
        home_free_kicks: null, away_free_kicks: null,
        home_penalties: null, away_penalties: null,
        home_yellow_cards: null, away_yellow_cards: null,
        photo_url: null,
      });
      toast.success("Spiel gespeichert!");
      navigate("/");
    } catch {
      toast.error("Fehler beim Speichern.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Heimteam (Verein)</label>
          <TeamAutocomplete
            value={homeTeam}
            onChange={setHomeTeam}
            placeholder="z.B. Real Madrid"
            accent="primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Auswärtsteam (Verein)</label>
          <TeamAutocomplete
            value={awayTeam}
            onChange={setAwayTeam}
            placeholder="z.B. FC Bayern"
            accent="accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tore Heim</label>
          <input
            type="number"
            min="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tore Auswärts</label>
          <input
            type="number"
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Datum</label>
        <input
          type="date"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Spielmodus</label>
        <div className="flex gap-2">
          {(Object.entries(MATCH_MODE_LABELS) as [MatchMode, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMatchMode(key)}
              className={`flex-1 rounded-lg border py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                matchMode === key
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {homeScore !== "" && awayScore !== "" && homeScore === awayScore && (
        <p className="text-xs text-destructive font-medium">Unentschieden nicht erlaubt – bitte Ergebnis nach Verlängerung/Elfmeterschießen eintragen.</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || insertMatch.isPending}
        className="w-full rounded-lg ea-btn-primary py-3 font-bold text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider text-sm transition-colors"
      >
        {insertMatch.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Spiel speichern
      </button>
    </form>
  );
}
