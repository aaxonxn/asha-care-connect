import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const riskConfig = {
  low: {
    label: 'Low Risk',
    shortLabel: 'Low',
    className: 'bg-risk-low-bg text-risk-low',
    dotClassName: 'bg-risk-low',
  },
  medium: {
    label: 'Medium Risk',
    shortLabel: 'Medium',
    className: 'bg-risk-medium-bg text-risk-medium',
    dotClassName: 'bg-risk-medium',
  },
  high: {
    label: 'High Risk',
    shortLabel: 'High',
    className: 'bg-risk-high-bg text-risk-high',
    dotClassName: 'bg-risk-high',
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function RiskBadge({ 
  level, 
  size = 'md', 
  showLabel = true,
  className 
}: RiskBadgeProps) {
  const config = riskConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        config.className,
        sizeConfig[size],
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", config.dotClassName)} />
      {showLabel && (
        <span>{size === 'sm' ? config.shortLabel : config.label}</span>
      )}
    </span>
  );
}
