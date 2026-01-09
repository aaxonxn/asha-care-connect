import { cn } from "@/lib/utils";
import { RiskBadge } from "./RiskBadge";
import { ChevronRight, Calendar, MapPin } from "lucide-react";
import type { RiskLevel } from "@/types";

interface PatientCardProps {
  name: string;
  subtitle: string;
  riskLevel: RiskLevel;
  nextVisit?: Date;
  address?: string;
  onClick?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export function PatientCard({
  name,
  subtitle,
  riskLevel,
  nextVisit,
  address,
  onClick,
  rightContent,
  className,
}: PatientCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl",
        "bg-card border border-border",
        "active:bg-accent transition-colors text-left",
        className
      )}
    >
      {/* Avatar / Initials */}
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full",
          "bg-primary/10 text-primary font-semibold text-lg"
        )}
      >
        {name.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground truncate">{name}</h3>
          <RiskBadge level={riskLevel} size="sm" showLabel={false} />
        </div>
        <p className="text-sm text-muted-foreground mb-1">{subtitle}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {nextVisit && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(nextVisit)}
            </span>
          )}
          {address && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{address}</span>
            </span>
          )}
        </div>
      </div>

      {/* Right Content */}
      {rightContent || <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </button>
  );
}
