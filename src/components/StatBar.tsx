import { Match, PrimaryStat, SecondaryStat } from "@/lib/match-types";
import { formatStatValue } from "@/lib/match-utils";

interface StatBarProps {
  stat: PrimaryStat | SecondaryStat;
  match: Match;
}

export default function StatBar({ stat, match }: StatBarProps) {
  const homeVal = match[stat.homeKey] as number | null;
  const awayVal = match[stat.awayKey] as number | null;

  if (homeVal == null && awayVal == null) return null;

  const hv = homeVal ?? 0;
  const av = awayVal ?? 0;
  const total = hv + av || 1;
  const homePercent = (hv / total) * 100;
  const awayPercent = (av / total) * 100;
  const homeLeads = hv > av;
  const awayLeads = av > hv;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-mono font-bold ${homeLeads ? "text-primary text-glow-cyan" : "text-foreground/60"}`}>
          {formatStatValue(homeVal, stat.format)}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
        <span className={`font-mono font-bold ${awayLeads ? "text-accent text-glow-magenta" : "text-foreground/60"}`}>
          {formatStatValue(awayVal, stat.format)}
        </span>
      </div>
      <div className="flex h-1.5 gap-0.5 rounded-full overflow-hidden bg-muted/30">
        <div
          className={`rounded-l-full transition-all duration-500 ${homeLeads ? "stat-bar-home" : "stat-bar-home-dim"}`}
          style={{ width: `${homePercent}%` }}
        />
        <div
          className={`rounded-r-full transition-all duration-500 ${awayLeads ? "stat-bar-away" : "stat-bar-away-dim"}`}
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    </div>
  );
}
