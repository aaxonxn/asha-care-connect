import { useNavigate } from "react-router-dom";
import { 
  CalendarCheck, 
  AlertTriangle, 
  UserPlus, 
  Baby, 
  Stethoscope,
  MapPin,
  Bell
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { ActionButton } from "@/components/ui/ActionButton";
import { PatientCard } from "@/components/ui/PatientCard";
import { OnlineIndicator } from "@/components/ui/ConnectivityBanner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { mockUser, mockDashboardStats, mockTodayVisits, mockNotifications } from "@/data/mockData";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isOnline } = useOnlineStatus();
  const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <OnlineIndicator isOnline={isOnline} />
          <button 
            onClick={() => navigate("/notifications")}
            className="relative p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>
        <h1 className="text-field-xl font-bold mb-1">
          {getGreeting()}, {mockUser.name.split(" ")[0]}!
        </h1>
        <p className="text-primary-foreground/80 text-field-sm">
          {mockUser.area}
        </p>
      </header>

      <div className="px-4 -mt-4 space-y-6 pb-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Today's Visits"
            value={mockDashboardStats.todayVisits}
            subtitle={`${mockDashboardStats.completedVisits} completed`}
            icon={CalendarCheck}
            variant="primary"
          />
          <StatCard
            title="High Risk"
            value={mockDashboardStats.highRiskCases}
            subtitle="Cases to monitor"
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton
              label="Add Mother"
              icon={UserPlus}
              onClick={() => navigate("/mothers/add")}
            />
            <ActionButton
              label="Add Child"
              icon={Baby}
              onClick={() => navigate("/children/add")}
            />
            <ActionButton
              label="Start Visit"
              icon={Stethoscope}
              onClick={() => navigate("/exam")}
              variant="primary"
            />
            <ActionButton
              label="Plan Route"
              icon={MapPin}
              onClick={() => navigate("/map")}
            />
          </div>
        </section>

        {/* Today's Priority Visits */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Priority Visits Today</h2>
            <button 
              onClick={() => navigate("/visits")}
              className="text-primary text-sm font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {mockTodayVisits
              .filter(v => v.status === "pending")
              .slice(0, 3)
              .map((visit) => (
                <PatientCard
                  key={visit.id}
                  name={visit.patientName}
                  subtitle={visit.patientType === "mother" ? "Pregnant Mother" : "Child"}
                  riskLevel={visit.riskLevel}
                  address={visit.address}
                  onClick={() => navigate(`/exam/${visit.patientId}`)}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
