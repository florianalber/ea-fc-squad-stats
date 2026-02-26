import { NavLink as RouterNavLink } from "react-router-dom";
import { Home, List, PlusCircle } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/history", label: "History", icon: List },
  { to: "/new", label: "Neues Spiel", icon: PlusCircle },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
      <div className="container flex h-16 items-center justify-around">
        {links.map(({ to, label, icon: Icon }) => (
          <RouterNavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </RouterNavLink>
        ))}
      </div>
    </nav>
  );
}
