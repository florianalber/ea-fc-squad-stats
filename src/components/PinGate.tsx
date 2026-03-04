import { useState, useRef, useEffect } from "react";
import { Lock } from "lucide-react";

const PIN = "2009";
const STORAGE_KEY = "eafc_pin_ok";

export default function PinGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === "1");
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Focus first input on mount
  useEffect(() => {
    if (!unlocked) refs[0].current?.focus();
  }, [unlocked]); // eslint-disable-line react-hooks/exhaustive-deps

  if (unlocked) return <>{children}</>;

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(false);

    if (digit && index < 3) {
      refs[index + 1].current?.focus();
    }

    // Check PIN when all 4 digits entered
    if (digit && index === 3) {
      const entered = next.join("");
      if (entered === PIN) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setUnlocked(true);
      } else {
        setError(true);
        setDigits(["", "", "", ""]);
        setTimeout(() => refs[0].current?.focus(), 150);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const next = pasted.split("");
      setDigits(next);
      if (pasted === PIN) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setUnlocked(true);
      } else {
        setError(true);
        setDigits(["", "", "", ""]);
        setTimeout(() => refs[0].current?.focus(), 150);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 bg-background">
      <div className={`rounded-full p-4 ${error ? "bg-destructive/10" : "bg-primary/10"} transition-colors`}>
        <Lock className={`h-8 w-8 ${error ? "text-destructive" : "text-primary"} transition-colors`} />
      </div>
      <div className="text-center space-y-1">
        <h1 className="text-xl font-extrabold tracking-tight">EA FC Squad Stats</h1>
        <p className="text-sm text-muted-foreground">PIN eingeben</p>
      </div>
      <div className="flex gap-3" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-14 h-16 rounded-xl border-2 bg-card/80 backdrop-blur-sm text-center text-2xl font-mono font-bold outline-none transition-all ${
              error
                ? "border-destructive/50 text-destructive animate-shake"
                : "border-border/50 text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            }`}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm font-medium text-destructive animate-fade-in">Falscher PIN</p>
      )}
    </div>
  );
}
