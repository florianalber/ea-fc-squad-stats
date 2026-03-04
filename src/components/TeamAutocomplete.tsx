import { useState, useRef, useEffect, useCallback } from "react";
import { searchTeams, findTeamByName, type Team } from "@/lib/team-utils";

interface TeamAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Extra classes on the <input> itself */
  inputClassName?: string;
  /** Which color accent to use for the focus ring */
  accent?: "primary" | "accent";
}

export default function TeamAutocomplete({
  value,
  onChange,
  placeholder,
  className = "",
  inputClassName = "",
  accent = "primary",
}: TeamAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Team[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const matched = findTeamByName(value);

  // Search when value changes
  useEffect(() => {
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const r = searchTeams(value, 8);
    setResults(r);
    setActiveIdx(-1);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const item = listRef.current.children[activeIdx] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIdx]);

  const select = useCallback(
    (team: Team) => {
      onChange(team.name);
      setOpen(false);
      inputRef.current?.blur();
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      select(results[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const ringClass =
    accent === "accent"
      ? "focus:ring-accent/30 focus:border-accent/40"
      : "focus:ring-primary/30 focus:border-primary/40";

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 transition-colors placeholder:text-muted-foreground/40 ${ringClass} ${
            matched ? "pr-16" : ""
          } ${inputClassName}`}
          autoComplete="off"
        />
        {/* Team logo + OVR badge when matched */}
        {matched && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {matched.overall != null && (
              <span className="text-[10px] font-mono font-bold text-muted-foreground/60">{matched.overall}</span>
            )}
            {matched.logoUrl && (
              <img src={matched.logoUrl} alt="" className="h-5 w-5 object-contain" />
            )}
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-border/60 bg-card/95 backdrop-blur-md shadow-lg shadow-black/30"
        >
          {results.map((team, idx) => (
            <li
              key={team.id}
              onMouseDown={() => select(team)}
              onMouseEnter={() => setActiveIdx(idx)}
              className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer text-sm transition-colors ${
                idx === activeIdx
                  ? "bg-primary/15 text-primary"
                  : "text-foreground hover:bg-muted/30"
              }`}
            >
              {team.logoUrl ? (
                <img
                  src={team.logoUrl}
                  alt=""
                  className="h-5 w-5 flex-shrink-0 object-contain"
                />
              ) : (
                <span className="h-5 w-5 flex-shrink-0 rounded bg-muted/30" />
              )}
              <span className="truncate font-medium">{team.name}</span>
              {team.overall != null && (
                <span className="flex-shrink-0 text-[10px] font-mono font-bold text-muted-foreground/50">{team.overall}</span>
              )}
              {team.league && (
                <span className="ml-auto flex-shrink-0 text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                  {team.league}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
