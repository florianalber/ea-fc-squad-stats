import { useMatches } from "@/hooks/use-matches";
import { HOME_PLAYERS, AWAY_PLAYERS } from "@/lib/match-types";
import {
  getHomeWins,
  getAwayWins,
  getGoalDifference,
  getCurrentStreak,
  getTotalGoals,
  getGoalsPerGame,
  getBiggestWin,
  getAvgPossession,
  getTotalShots,
  getShotsPerGame,
  getTotalXg,
  getAvgXg,
  getAvgPassAccuracy,
  getOvertimeGames,
  getLongestStreak,
  getCleanSheets,
} from "@/lib/match-utils";
import MatchCard from "@/components/MatchCard";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  TrendingUp,
  Flame,
  Swords,
  Target,
  Crosshair,
  Timer,
  ShieldCheck,
  Trophy,
  Zap,
  BarChart3,
  Percent,
} from "lucide-react";

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
          className="flex items-center gap-2 rounded-lg ea-btn-primary px-6 py-3 font-bold text-primary-foreground transition-colors"
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
  const lastFive = matches.slice(0, 5);

  const homeTotalGoals = getTotalGoals(matches, "home");
  const awayTotalGoals = getTotalGoals(matches, "away");
  const homeGPG = getGoalsPerGame(matches, "home");
  const awayGPG = getGoalsPerGame(matches, "away");
  const homeBigWin = getBiggestWin(matches, "home");
  const awayBigWin = getBiggestWin(matches, "away");
  const homeAvgPoss = getAvgPossession(matches, "home");
  const awayAvgPoss = getAvgPossession(matches, "away");
  const homeTotalShots = getTotalShots(matches, "home");
  const awayTotalShots = getTotalShots(matches, "away");
  const homeSPG = getShotsPerGame(matches, "home");
  const awaySPG = getShotsPerGame(matches, "away");
  const homeTotalXg = getTotalXg(matches, "home");
  const awayTotalXg = getTotalXg(matches, "away");
  const homeAvgXg = getAvgXg(matches, "home");
  const awayAvgXg = getAvgXg(matches, "away");
  const homePassAcc = getAvgPassAccuracy(matches, "home");
  const awayPassAcc = getAvgPassAccuracy(matches, "away");
  const overtime = getOvertimeGames(matches);
  const homeLongest = getLongestStreak(matches, "home");
  const awayLongest = getLongestStreak(matches, "away");
  const homeClean = getCleanSheets(matches, "home");
  const awayClean = getCleanSheets(matches, "away");

  const photoCount = matches.filter((m) => m.entry_mode === "photo").length;

  return (
    <div className="container pb-24 pt-6 space-y-6">
      {/* Hero Scoreboard */}
      <div className="ea-scoreboard rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-1.5 mb-5">
          <Swords className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            Rivalry Record
          </p>
          <Swords className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 text-right">
            <p className="text-sm font-bold text-primary mb-1 tracking-wide">{HOME_PLAYERS}</p>
          </div>
          <div className="flex items-baseline gap-3 animate-score-pop">
            <span className="font-mono text-6xl font-black text-primary">{homeWins}</span>
            <span className="font-mono text-2xl font-bold text-muted-foreground/30">:</span>
            <span className="font-mono text-6xl font-black text-accent">{awayWins}</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-accent mb-1 tracking-wide">{AWAY_PLAYERS}</p>
          </div>
        </div>
        <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{matches.length} Spiele gespielt</p>
      </div>

      {/* Quick Team Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="ea-card-home rounded-xl p-4 space-y-3">
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
        <div className="ea-card-away rounded-xl p-4 space-y-3">
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

      {/* === Gesamtstatistiken === */}
      <div className="space-y-3">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Gesamtstatistiken</h2>

        <div className="ea-card rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">Tore</span>
          </div>
          <ComparisonRow label="Gesamt" homeVal={homeTotalGoals} awayVal={awayTotalGoals} />
          <ComparisonRow label="Pro Spiel" homeVal={homeGPG} awayVal={awayGPG} format="decimal" />
        </div>

        <div className="ea-card rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">Höchster Sieg</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              {homeBigWin ? (
                <>
                  <span className="font-mono text-lg font-black text-primary">
                    {homeBigWin.match.home_score}:{homeBigWin.match.away_score}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">(+{homeBigWin.diff} Tore)</p>
                </>
              ) : (
                <span className="text-sm text-muted-foreground/50">–</span>
              )}
            </div>
            <div className="text-center">
              {awayBigWin ? (
                <>
                  <span className="font-mono text-lg font-black text-accent">
                    {awayBigWin.match.home_score}:{awayBigWin.match.away_score}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">(+{awayBigWin.diff} Tore)</p>
                </>
              ) : (
                <span className="text-sm text-muted-foreground/50">–</span>
              )}
            </div>
          </div>
        </div>

        <div className="ea-card rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">Schüsse</span>
            {photoCount > 0 && <span className="text-[9px] text-muted-foreground/50 ml-auto">{photoCount} Foto-Spiele</span>}
          </div>
          <ComparisonRow label="Gesamt" homeVal={homeTotalShots} awayVal={awayTotalShots} />
          {homeSPG != null && awaySPG != null && (
            <ComparisonRow label="Pro Spiel" homeVal={homeSPG} awayVal={awaySPG} format="decimal" />
          )}
        </div>

        {homeTotalXg != null && awayTotalXg != null && (
          <div className="ea-card rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Expected Goals (xG)</span>
            </div>
            <ComparisonRow label="Gesamt" homeVal={homeTotalXg} awayVal={awayTotalXg} format="decimal" />
            {homeAvgXg != null && awayAvgXg != null && (
              <ComparisonRow label="Pro Spiel" homeVal={homeAvgXg} awayVal={awayAvgXg} format="decimal" />
            )}
          </div>
        )}

        {(homeAvgPoss != null || homePassAcc != null) && (
          <div className="ea-card rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Percent className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Ballbesitz & Pässe</span>
            </div>
            {homeAvgPoss != null && awayAvgPoss != null && (
              <ComparisonRow label="Ballbesitz (Ø)" homeVal={homeAvgPoss} awayVal={awayAvgPoss} format="percent" />
            )}
            {homePassAcc != null && awayPassAcc != null && (
              <ComparisonRow label="Passgenau. (Ø)" homeVal={homePassAcc} awayVal={awayPassAcc} format="percent" />
            )}
          </div>
        )}

        <div className="ea-card rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">Rekorde & Serien</span>
          </div>
          <ComparisonRow label="Längste Serie" homeVal={homeLongest} awayVal={awayLongest} suffix="Siege" />
          <ComparisonRow label="Clean Sheets" homeVal={homeClean} awayVal={awayClean} />
        </div>

        {(overtime.extraTime > 0 || overtime.penalties > 0) && (
          <div className="ea-card rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Spielverlauf</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Verlängerung</span>
              <span className="font-mono font-bold text-foreground">{overtime.extraTime}x</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Elfmeterschießen</span>
              <span className="font-mono font-bold text-foreground">{overtime.penalties}x</span>
            </div>
          </div>
        )}
      </div>

      {/* Last 3 Matches */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">Letzte Spiele</h2>
        <div className="space-y-2">
          {lastFive.map((match) => (
            <MatchCard key={match.id} match={match} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  homeVal,
  awayVal,
  format,
  suffix,
}: {
  label: string;
  homeVal: number;
  awayVal: number;
  format?: "decimal" | "percent";
  suffix?: string;
}) {
  const homeLeads = homeVal > awayVal;
  const awayLeads = awayVal > homeVal;

  const fmt = (v: number) => {
    if (format === "decimal") return v.toFixed(1);
    if (format === "percent") return `${Math.round(v)}%`;
    return String(Math.round(v));
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <span className={`font-mono font-bold min-w-[48px] ${homeLeads ? "text-primary" : "text-foreground/60"}`}>
        {fmt(homeVal)}{suffix ? ` ${suffix}` : ""}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`font-mono font-bold min-w-[48px] text-right ${awayLeads ? "text-accent" : "text-foreground/60"}`}>
        {fmt(awayVal)}{suffix ? ` ${suffix}` : ""}
      </span>
    </div>
  );
}
