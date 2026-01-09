import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'warning' | 'danger';
  className?: string;
}

const variantConfig = {
  default: {
    container: 'bg-card border-border',
    icon: 'bg-muted text-muted-foreground',
    value: 'text-foreground',
  },
  primary: {
    container: 'bg-primary-light border-primary/20',
    icon: 'bg-primary text-primary-foreground',
    value: 'text-primary',
  },
  warning: {
    container: 'bg-risk-medium-bg border-risk-medium/20',
    icon: 'bg-warning text-warning-foreground',
    value: 'text-risk-medium',
  },
  danger: {
    container: 'bg-risk-high-bg border-risk-high/20',
    icon: 'bg-destructive text-destructive-foreground',
    value: 'text-risk-high',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className,
}: StatCardProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all",
        config.container,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className={cn("text-field-2xl font-bold", config.value)}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg",
            config.icon
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
