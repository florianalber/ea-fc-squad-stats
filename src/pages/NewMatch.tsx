import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInsertMatch } from "@/hooks/use-matches";
import { MatchMode, EntryMode, HOME_PLAYERS, AWAY_PLAYERS } from "@/lib/match-types";
import { toast } from "sonner";
import { Camera, Keyboard, Loader2 } from "lucide-react";
import QuickEntryForm from "@/components/QuickEntryForm";
import PhotoEntryForm from "@/components/PhotoEntryForm";

export default function NewMatch() {
  const [entryMode, setEntryMode] = useState<EntryMode>("quick");
  const navigate = useNavigate();

  return (
    <div className="container pb-24 pt-6 space-y-5">
      <h1 className="text-xl font-extrabold uppercase tracking-wider">Neues Spiel</h1>

      {/* Tab toggle */}
      <div className="flex rounded-xl border border-border bg-muted/30 p-1">
        <button
          onClick={() => setEntryMode("quick")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            entryMode === "quick" ? "bg-card text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Keyboard className="h-4 w-4" />
          Schnelleingabe
        </button>
        <button
          onClick={() => setEntryMode("photo")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            entryMode === "photo" ? "bg-card text-accent border border-accent/20" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Camera className="h-4 w-4" />
          Foto-Upload
        </button>
      </div>

      {entryMode === "quick" ? <QuickEntryForm /> : <PhotoEntryForm />}
    </div>
  );
}
