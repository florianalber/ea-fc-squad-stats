import { useMatches } from "@/hooks/use-matches";
import MatchCard from "@/components/MatchCard";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export default function MatchHistory() {
  const { data: matches = [], isLoading } = useMatches();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container pb-24 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold uppercase tracking-wider">Match-History</h1>
        <button
          onClick={() => navigate("/new")}
          className="flex items-center gap-1.5 rounded-lg ea-cyan-gradient px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground ea-glow-cyan transition-all hover:scale-105"
        >
          <PlusCircle className="h-4 w-4" />
          Neu
        </button>
      </div>

      {matches.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground font-medium">Noch keine Matches erfasst.</p>
      ) : (
        <div className="space-y-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
