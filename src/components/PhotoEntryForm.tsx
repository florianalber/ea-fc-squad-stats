import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInsertMatch } from "@/hooks/use-matches";
import { MatchMode, MATCH_MODE_LABELS } from "@/lib/match-types";
import { toast } from "sonner";
import { Upload, Loader2, Check, AlertCircle, Clock } from "lucide-react";
import { parseMatchStats } from "@/lib/match-api";
import { usePendingPhoto } from "@/hooks/use-pending-photo";
import TeamAutocomplete from "@/components/TeamAutocomplete";

interface ParsedStats {
  home_team_name: string;
  away_team_name: string;
  home_score: number;
  away_score: number;
  minutes_played?: number;
  home_possession?: number;
  away_possession?: number;
  home_shots?: number;
  away_shots?: number;
  home_xg?: number;
  away_xg?: number;
  home_shot_accuracy?: number;
  away_shot_accuracy?: number;
  home_pass_accuracy?: number;
  away_pass_accuracy?: number;
  home_passes?: number;
  away_passes?: number;
  home_dribble_success?: number;
  away_dribble_success?: number;
  home_tackles?: number;
  away_tackles?: number;
  home_tackles_won?: number;
  away_tackles_won?: number;
  home_ball_recovery_time?: number;
  away_ball_recovery_time?: number;
  home_interceptions?: number;
  away_interceptions?: number;
  home_saves?: number;
  away_saves?: number;
  home_fouls?: number;
  away_fouls?: number;
  home_offsides?: number;
  away_offsides?: number;
  home_corners?: number;
  away_corners?: number;
  home_free_kicks?: number;
  away_free_kicks?: number;
  home_penalties?: number;
  away_penalties?: number;
  home_yellow_cards?: number;
  away_yellow_cards?: number;
}

/** Spielmodus aus gespielten Minuten ableiten */
function inferMatchMode(minutes?: number): MatchMode {
  if (minutes != null && minutes > 100) return "extra_time";
  return "regular";
}

export default function PhotoEntryForm() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<ParsedStats | null>(null);
  const [matchMode, setMatchMode] = useState<MatchMode>("regular");
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);
  const [autoDetected, setAutoDetected] = useState(false);
  const insertMatch = useInsertMatch();
  const navigate = useNavigate();
  const { consume } = usePendingPhoto();

  // Wenn ein Foto über die BottomNav ausgewählt wurde, übernehmen
  useEffect(() => {
    const pending = consume();
    if (pending) {
      setFile(pending);
      setParsed(null);
      setError(null);
      setAutoDetected(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setParsed(null);
      setError(null);
      setAutoDetected(false);
    }
  };

  // Automatisch Statistiken erkennen sobald ein Bild ausgewählt wird
  useEffect(() => {
    if (!file || parsing || parsed) return;

    let cancelled = false;

    (async () => {
      setParsing(true);
      setError(null);

      try {
        const base64 = await fileToBase64(file);
        if (cancelled) return;
        const data = await parseMatchStats(base64);
        if (cancelled) return;
        if (data?.error) throw new Error(data.error);

        const stats = data as ParsedStats;
        setParsed(stats);

        const inferred = inferMatchMode(stats.minutes_played);
        if (inferred !== "regular") {
          setMatchMode(inferred);
          setAutoDetected(true);
          toast.success(`Statistiken erkannt! Verlängerung erkannt (${stats.minutes_played} Min.)`);
        } else {
          toast.success("Statistiken erkannt!");
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Fehler bei der Erkennung.");
          toast.error("Erkennung fehlgeschlagen.");
        }
      } finally {
        if (!cancelled) setParsing(false);
      }
    })();

    return () => { cancelled = true; };
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    if (!parsed) return;
    try {
      // minutes_played wird nicht in die DB geschrieben, nur für die Erkennung genutzt
      const { minutes_played, ...statsWithoutMinutes } = parsed;
      await insertMatch.mutateAsync({
        ...statsWithoutMinutes,
        match_mode: matchMode,
        entry_mode: "photo",
        match_date: matchDate,
        home_score: parsed.home_score,
        away_score: parsed.away_score,
        home_team_name: parsed.home_team_name,
        away_team_name: parsed.away_team_name,
        photo_url: null,
      });
      toast.success("Spiel gespeichert!");
      navigate("/");
    } catch {
      toast.error("Fehler beim Speichern.");
    }
  };

  const updateField = (key: keyof ParsedStats, value: string) => {
    if (!parsed) return;
    const numVal = value === "" ? undefined : parseFloat(value);
    setParsed({ ...parsed, [key]: typeof parsed[key] === "string" ? value : numVal });
  };

  return (
    <div className="space-y-4">
      <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 backdrop-blur-sm p-8 cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {file ? file.name : "Foto des Statistik-Bildschirms hochladen"}
        </span>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      {parsing && (
        <div className="w-full rounded-lg ea-magenta-gradient py-3 font-bold text-accent-foreground flex items-center justify-center gap-2 uppercase tracking-wider text-sm ea-glow-magenta">
          <Loader2 className="h-4 w-4 animate-spin" />
          Wird analysiert...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {parsed && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 p-3 text-xs text-primary font-bold uppercase tracking-wider">
            <Check className="h-4 w-4" />
            Erkannte Werte – bitte prüfen und ggf. korrigieren.
          </div>

          {/* Auto-detected match mode hint */}
          {autoDetected && parsed.minutes_played != null && (
            <div className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 p-3 text-xs text-accent font-bold uppercase tracking-wider">
              <Clock className="h-4 w-4" />
              {parsed.minutes_played} Min. erkannt – Verlängerung automatisch gesetzt. Falls Elfmeterschießen, bitte unten ändern.
            </div>
          )}

          {/* Core fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Heimteam</label>
              <TeamAutocomplete
                value={parsed.home_team_name}
                onChange={(v) => updateField("home_team_name", v)}
                accent="primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Auswärtsteam</label>
              <TeamAutocomplete
                value={parsed.away_team_name}
                onChange={(v) => updateField("away_team_name", v)}
                accent="accent"
              />
            </div>
            <EditField label="Tore Heim" value={String(parsed.home_score)} onChange={(v) => updateField("home_score", v)} type="number" />
            <EditField label="Tore Auswärts" value={String(parsed.away_score)} onChange={(v) => updateField("away_score", v)} type="number" />
          </div>

          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Kern-Statistiken</h3>
          <div className="grid grid-cols-2 gap-3">
            <EditField label="Ballbesitz Heim %" value={String(parsed.home_possession ?? "")} onChange={(v) => updateField("home_possession", v)} type="number" />
            <EditField label="Ballbesitz Ausw. %" value={String(parsed.away_possession ?? "")} onChange={(v) => updateField("away_possession", v)} type="number" />
            <EditField label="Schüsse Heim" value={String(parsed.home_shots ?? "")} onChange={(v) => updateField("home_shots", v)} type="number" />
            <EditField label="Schüsse Ausw." value={String(parsed.away_shots ?? "")} onChange={(v) => updateField("away_shots", v)} type="number" />
            <EditField label="xG Heim" value={String(parsed.home_xg ?? "")} onChange={(v) => updateField("home_xg", v)} type="number" />
            <EditField label="xG Ausw." value={String(parsed.away_xg ?? "")} onChange={(v) => updateField("away_xg", v)} type="number" />
            <EditField label="Schussgenau. Heim %" value={String(parsed.home_shot_accuracy ?? "")} onChange={(v) => updateField("home_shot_accuracy", v)} type="number" />
            <EditField label="Schussgenau. Ausw. %" value={String(parsed.away_shot_accuracy ?? "")} onChange={(v) => updateField("away_shot_accuracy", v)} type="number" />
            <EditField label="Passgenau. Heim %" value={String(parsed.home_pass_accuracy ?? "")} onChange={(v) => updateField("home_pass_accuracy", v)} type="number" />
            <EditField label="Passgenau. Ausw. %" value={String(parsed.away_pass_accuracy ?? "")} onChange={(v) => updateField("away_pass_accuracy", v)} type="number" />
            <EditField label="Pässe Heim" value={String(parsed.home_passes ?? "")} onChange={(v) => updateField("home_passes", v)} type="number" />
            <EditField label="Pässe Ausw." value={String(parsed.away_passes ?? "")} onChange={(v) => updateField("away_passes", v)} type="number" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Datum</label>
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Spielmodus
              {parsed.minutes_played != null && (
                <span className="ml-2 text-muted-foreground/60 normal-case tracking-normal">({parsed.minutes_played} Min. erkannt)</span>
              )}
            </label>
            <div className="flex gap-2">
              {(Object.entries(MATCH_MODE_LABELS) as [MatchMode, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setMatchMode(key); setAutoDetected(false); }}
                  className={`flex-1 rounded-lg border py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    matchMode === key
                      ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_10px_hsl(187_100%_50%/0.1)]"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={insertMatch.isPending}
            className="w-full rounded-lg ea-cyan-gradient py-3 font-bold text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider text-sm ea-glow-cyan transition-all hover:scale-[1.01]"
          >
            {insertMatch.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Spiel speichern
          </button>
        </div>
      )}
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm px-2.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
      />
    </div>
  );
}

/**
 * Convert any image file to a JPEG base64 data URL via Canvas.
 * This ensures compatibility with Claude Vision API (which only supports
 * jpeg/png/gif/webp) and also reduces file size for large phone photos.
 * Max dimension is capped at 2048px to stay within API limits.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX_DIM = 2048;
      let { width, height } = img;

      // Scale down if needed
      if (width > MAX_DIM || height > MAX_DIM) {
        const scale = MAX_DIM / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG (good quality, compatible with Claude API)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      URL.revokeObjectURL(img.src);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Could not load image"));
    };
    // Use object URL so the browser decodes the image (works for HEIC, WebP, etc.)
    img.src = URL.createObjectURL(file);
  });
}
