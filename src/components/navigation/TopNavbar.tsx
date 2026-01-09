import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Baby, Bell, Calendar, Home, LogOut, MapPin, Settings, Stethoscope, User, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TopNavbar.css";

type UserRole = "asha" | "beneficiary";

interface TopNavbarProps {
  userRole: UserRole;
  userName?: string;
}

export function TopNavbar({ userRole, userName = "User" }: TopNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userPhone");
    navigate("/login");
  };

  // ASHA Worker Navigation
  if (userRole === "asha") {
    const ashaNavItems = [
      { path: "/dashboard", label: "Dashboard", icon: Home },
      { path: "/mothers", label: "Mothers", icon: Users },
      { path: "/children", label: "Children", icon: Baby },
      { path: "/exam", label: "Screening", icon: Stethoscope },
      { path: "/map", label: "Routes", icon: MapPin },
      { path: "/notifications", label: "Alerts", icon: Bell },
      { path: "/settings", label: "Settings", icon: Settings },
    ];

    return (
      <nav className="top-nav">
        <div className="nav-brand">
          <span className="font-bold">BabyAssist AI</span>
        </div>
        
        <div className="nav-items">
          {ashaNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn("nav-item", isActive && "active")}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <User className="w-4 h-4" />
            <span className="text-sm">{userName}</span>
            <span className="role-badge">ASHA</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="logout-btn"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </nav>
    );
  }

  // Beneficiary (Mother/Caregiver) Navigation
  const beneficiaryNavItems = [
    { path: "/beneficiary/dashboard", label: "My Family", icon: Users },
    { path: "/beneficiary/due-dates", label: "Due Dates", icon: Calendar },
  ];

  return (
    <nav className="top-nav">
      <div className="nav-brand">
        <span className="font-bold">BabyAssist AI</span>
      </div>
      
      <div className="nav-items">
        {beneficiaryNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn("nav-item", isActive && "active")}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="nav-user">
        <div className="user-info">
          <User className="w-4 h-4" />
          <span className="text-sm">{userName}</span>
          <span className="role-badge">Mother</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="logout-btn"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
}
