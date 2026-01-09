import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Syringe, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockChildren } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Child } from "@/types";

const vaccinationConfig = {
  "up-to-date": { label: "Vaccinated", className: "bg-risk-low-bg text-risk-low" },
  "due": { label: "Due", className: "bg-risk-medium-bg text-risk-medium" },
  "overdue": { label: "Overdue", className: "bg-risk-high-bg text-risk-high" },
};

function ChildCard({ child, onClick }: { child: Child; onClick: () => void }) {
  const vacConfig = vaccinationConfig[child.vaccinationStatus];

  return (
    <button
      onClick={onClick}
      className="w-full bg-card border border-border rounded-xl p-4 text-left active:bg-accent transition-colors"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center",
            "bg-accent text-accent-foreground font-semibold text-lg"
          )}
        >
          {child.name.charAt(0)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {child.name}
            </h3>
            <RiskBadge level={child.riskLevel} size="sm" showLabel={false} />
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {child.ageMonths} months • {child.gender === "male" ? "Boy" : "Girl"}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Mother: {child.motherName}
          </p>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                vacConfig.className
              )}
            >
              <Syringe className="w-3 h-3" />
              {vacConfig.label}
            </span>
            {child.weight && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                {child.weight} kg
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="mt-4 pt-3 border-t border-border">
        <span className="text-primary text-sm font-medium">
          Start Screening →
        </span>
      </div>
    </button>
  );
}

export default function Children() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [vacFilter, setVacFilter] = useState<Child["vaccinationStatus"] | "all">("all");

  const filteredChildren = mockChildren.filter((child) => {
    const matchesSearch = 
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.motherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVac = vacFilter === "all" || child.vaccinationStatus === vacFilter;
    return matchesSearch && matchesVac;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Children"
        subtitle={`${mockChildren.length} registered`}
        rightContent={
          <Button
            size="icon"
            onClick={() => navigate("/children/add")}
            className="rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>

        {/* Vaccination Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(["all", "up-to-date", "due", "overdue"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setVacFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                vacFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {status === "all" 
                ? "All" 
                : status === "up-to-date" 
                ? "Vaccinated" 
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Children List */}
        <div className="space-y-3">
          {filteredChildren.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onClick={() => navigate(`/children/${child.id}`)}
            />
          ))}
        </div>

        {filteredChildren.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No children found</p>
          </div>
        )}
      </div>
    </div>
  );
}
