import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectivityBannerProps {
  isOnline: boolean;
  lastSyncTime?: Date;
  className?: string;
}

export function ConnectivityBanner({
  isOnline,
  lastSyncTime,
  className,
}: ConnectivityBannerProps) {
  if (isOnline) return null;

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-2",
        "bg-muted text-muted-foreground",
        "text-sm font-medium",
        className
      )}
    >
      <WifiOff className="w-4 h-4" />
      <span>
        Offline mode
        {lastSyncTime && ` • Last synced at ${formatTime(lastSyncTime)}`}
      </span>
    </div>
  );
}

export function OnlineIndicator({ isOnline }: { isOnline: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          isOnline ? "bg-online" : "bg-offline"
        )}
      />
      <span className="text-xs text-muted-foreground">
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}
