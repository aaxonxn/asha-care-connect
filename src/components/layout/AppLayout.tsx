import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { ConnectivityBanner } from "@/components/ui/ConnectivityBanner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function AppLayout() {
  const { isOnline, lastSyncTime } = useOnlineStatus();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ConnectivityBanner isOnline={isOnline} lastSyncTime={lastSyncTime} />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
