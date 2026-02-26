import { useRef } from "react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { Home, List, PlusCircle, Camera } from "lucide-react";
import { usePendingPhoto } from "@/hooks/use-pending-photo";

const links = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/history", label: "History", icon: List },
  { to: "/new", label: "Neues Spiel", icon: PlusCircle },
];

export default function BottomNav() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setFile } = usePendingPhoto();

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      navigate("/new?mode=photo");
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-background/90 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container flex h-16 items-center justify-around">
        {links.map(({ to, label, icon: Icon }) => (
          <RouterNavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                isActive ? "text-primary drop-shadow-[0_0_8px_hsl(187_100%_50%/0.4)]" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </RouterNavLink>
        ))}

        {/* Quick photo upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent/80 transition-all drop-shadow-[0_0_8px_hsl(340_100%_59%/0.3)]"
        >
          <Camera className="h-5 w-5" />
          <span>Foto</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />
      </div>
    </nav>
  );
}
