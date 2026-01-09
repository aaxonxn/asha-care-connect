import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle, 
  Calendar, 
  Syringe, 
  CheckCircle,
  Bell
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { mockNotifications } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

const typeConfig = {
  "high-risk": {
    icon: AlertTriangle,
    iconClass: "text-risk-high bg-risk-high-bg",
    label: "High Risk Alert",
  },
  "vaccination": {
    icon: Syringe,
    iconClass: "text-risk-medium bg-risk-medium-bg",
    label: "Vaccination",
  },
  "follow-up": {
    icon: Calendar,
    iconClass: "text-primary bg-primary-light",
    label: "Follow-up",
  },
  "visit-due": {
    icon: Bell,
    iconClass: "text-info bg-info/10",
    label: "Visit Due",
  },
};

function NotificationCard({
  notification,
  onMarkComplete,
}: {
  notification: Notification;
  onMarkComplete: (id: string) => void;
}) {
  const navigate = useNavigate();
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div
      className={cn(
        "bg-card border rounded-xl p-4 transition-colors",
        notification.isRead ? "border-border" : "border-primary/30 bg-primary-light/30"
      )}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            config.iconClass
          )}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{notification.title}</h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDate(notification.createdAt)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>

          {/* Actions */}
          <div className="flex gap-2">
            {notification.patientId && (
              <button
                onClick={() =>
                  navigate(
                    notification.type === "vaccination"
                      ? `/children/${notification.patientId}`
                      : `/mothers/${notification.patientId}`
                  )
                }
                className="text-sm text-primary font-medium"
              >
                View Patient →
              </button>
            )}
            {!notification.isRead && (
              <button
                onClick={() => onMarkComplete(notification.id)}
                className="text-sm text-muted-foreground font-medium ml-auto flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const handleMarkComplete = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
      />

      <div className="px-4 py-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              filter === "unread"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkComplete={handleMarkComplete}
            />
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-1">No notifications</p>
            <p className="text-sm text-muted-foreground">
              {filter === "unread"
                ? "You've read all notifications!"
                : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
