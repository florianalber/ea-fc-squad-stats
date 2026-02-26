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
      <h1 className="text-xl font-bold">Neues Spiel erfassen</h1>

      {/* Tab toggle */}
      <div className="flex rounded-lg border bg-secondary/30 p-1">
        <button
          onClick={() => setEntryMode("quick")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${
            entryMode === "quick" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
          }`}
        >
          <Keyboard className="h-4 w-4" />
          Schnelleingabe
        </button>
        <button
          onClick={() => setEntryMode("photo")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${
            entryMode === "photo" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
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
