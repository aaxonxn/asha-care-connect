import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

const variantConfig = {
  default: 'bg-card border-border hover:border-primary/30 hover:bg-accent',
  primary: 'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
  secondary: 'bg-secondary border-secondary hover:bg-secondary/80',
};

export function ActionButton({
  label,
  icon: Icon,
  onClick,
  variant = 'default',
  disabled = false,
  className,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl",
        "border shadow-sm min-h-[100px] w-full",
        "active:scale-[0.98] transition-all duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantConfig[variant],
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full",
          variant === 'primary' 
            ? 'bg-primary-foreground/20' 
            : 'bg-primary/10'
        )}
      >
        <Icon
          className={cn(
            "w-6 h-6",
            variant === 'primary' ? 'text-primary-foreground' : 'text-primary'
          )}
        />
      </div>
      <span
        className={cn(
          "text-field-sm font-medium text-center",
          variant === 'primary' ? 'text-primary-foreground' : 'text-foreground'
        )}
      >
        {label}
      </span>
    </button>
  );
}
