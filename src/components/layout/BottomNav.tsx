import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  Baby, 
  Bell, 
  Settings,
  type LucideIcon 
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { path: "/", label: "Home", icon: Home },
  { path: "/mothers", label: "Mothers", icon: Users },
  { path: "/children", label: "Children", icon: Baby },
  { path: "/notifications", label: "Alerts", icon: Bell },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn("nav-item", isActive && "active")}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
