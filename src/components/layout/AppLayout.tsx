import { TopNavbar } from "@/components/navigation/TopNavbar";
import { ConnectivityBanner } from "@/components/ui/ConnectivityBanner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

type UserRole = "asha" | "beneficiary";

export function AppLayout() {
  const { isOnline, lastSyncTime } = useOnlineStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    // Check authentication and role
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole") as UserRole;
    const phone = localStorage.getItem("userPhone");

    if (!isAuthenticated || !role) {
      navigate("/login");
      return;
    }

    setUserRole(role);
    setUserName(phone || "User");

    // Route protection logic
    const currentPath = location.pathname;
    
    if (role === "beneficiary") {
      // Beneficiary can only access beneficiary routes
      const allowedBeneficiaryRoutes = [
        "/beneficiary/dashboard",
        "/beneficiary/children/",
        "/beneficiary/due-dates"
      ];

      const isAllowedRoute = allowedBeneficiaryRoutes.some(route => 
        currentPath.startsWith(route)
      );

      if (!isAllowedRoute) {
        // Redirect beneficiaries to their dashboard if they try to access ASHA routes
        navigate("/beneficiary/dashboard");
        return;
      }
    }
  }, [navigate, location.pathname]);

  // Show loading while checking auth
  if (!userRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ConnectivityBanner isOnline={isOnline} lastSyncTime={lastSyncTime} />
      
      {/* Top Navigation */}
      <TopNavbar userRole={userRole} userName={userName} />
      
      {/* Main Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
