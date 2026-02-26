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

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono font-medium text-foreground">{formatStatValue(homeVal, stat.format)}</span>
        <span className="text-[11px]">{stat.label}</span>
        <span className="font-mono font-medium text-foreground">{formatStatValue(awayVal, stat.format)}</span>
      </div>
      <div className="flex h-2 gap-0.5 rounded-full overflow-hidden">
        <div
          className="rounded-l-full bg-home transition-all duration-500"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="rounded-r-full bg-away transition-all duration-500"
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    </div>
  );
}
