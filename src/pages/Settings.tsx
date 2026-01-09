import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Globe, 
  RefreshCw, 
  LogOut, 
  Shield, 
  ChevronRight,
  User,
  Wifi,
  WifiOff,
  Loader2
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { mockUser } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Settings() {
  const navigate = useNavigate();
  const { isOnline } = useOnlineStatus();
  const [language, setLanguage] = useState("en");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSyncing(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="animate-fade-in pb-24">
      <PageHeader title="Settings" />

      <div className="px-4 py-4 space-y-6">
        {/* User Profile */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{mockUser.name}</h2>
              <p className="text-sm text-muted-foreground">{mockUser.phone}</p>
              <p className="text-xs text-muted-foreground mt-1">{mockUser.area}</p>
            </div>
          </div>
        </div>

        {/* Connectivity Status */}
        <div
          className={cn(
            "flex items-center gap-4 p-4 rounded-xl",
            isOnline ? "bg-risk-low-bg" : "bg-muted"
          )}
        >
          {isOnline ? (
            <Wifi className="w-6 h-6 text-risk-low" />
          ) : (
            <WifiOff className="w-6 h-6 text-offline" />
          )}
          <div className="flex-1">
            <p className="font-medium">
              {isOnline ? "Connected" : "Offline Mode"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isOnline
                ? "Data will sync automatically"
                : "Changes saved locally"}
            </p>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-2">
          {/* Language */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Language</span>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="bn">বাংলা</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Manual Sync */}
          <button
            onClick={handleSync}
            disabled={!isOnline || isSyncing}
            className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 disabled:opacity-50"
          >
            {isSyncing ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="font-medium flex-1 text-left">
              {isSyncing ? "Syncing..." : "Sync Data Now"}
            </span>
            {!isOnline && (
              <span className="text-xs text-muted-foreground">Requires internet</span>
            )}
          </button>

          {/* Privacy */}
          <button className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium flex-1 text-left">Privacy Policy</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Privacy Note */}
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground">
            <strong>Privacy Notice:</strong> All patient data is stored securely and
            encrypted. Your data is only shared with authorized healthcare personnel.
            This app complies with government health data protection guidelines.
          </p>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full h-14"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground">
          BabyAssist AI v1.0.0 • Demo Mode
        </p>
      </div>
    </div>
  );
}
