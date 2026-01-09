import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Grid, List } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PatientCard } from "@/components/ui/PatientCard";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockMothers } from "@/data/mockData";
import type { RiskLevel } from "@/types";

export default function Mothers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredMothers = mockMothers.filter((mother) => {
    const matchesSearch = mother.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "all" || mother.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const riskCounts = {
    all: mockMothers.length,
    high: mockMothers.filter(m => m.riskLevel === "high").length,
    medium: mockMothers.filter(m => m.riskLevel === "medium").length,
    low: mockMothers.filter(m => m.riskLevel === "low").length,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Mothers"
        subtitle={`${mockMothers.length} registered`}
        rightContent={
          <Button
            size="icon"
            onClick={() => navigate("/mothers/add")}
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

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(["all", "high", "medium", "low"] as const).map((risk) => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                riskFilter === risk
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {risk === "all" ? (
                "All"
              ) : (
                <>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      risk === "high"
                        ? "bg-risk-high"
                        : risk === "medium"
                        ? "bg-risk-medium"
                        : "bg-risk-low"
                    }`}
                  />
                  {risk.charAt(0).toUpperCase() + risk.slice(1)}
                </>
              )}
              <span className="text-xs opacity-70">({riskCounts[risk]})</span>
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex justify-end gap-1">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>

        {/* Mother List */}
        {viewMode === "list" ? (
          <div className="space-y-3">
            {filteredMothers.map((mother) => (
              <PatientCard
                key={mother.id}
                name={mother.name}
                subtitle={`Week ${mother.pregnancyWeek || "?"} • Age ${mother.age}`}
                riskLevel={mother.riskLevel}
                nextVisit={mother.nextVisit}
                address={mother.address}
                onClick={() => navigate(`/mothers/${mother.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredMothers.map((mother) => (
              <button
                key={mother.id}
                onClick={() => navigate(`/mothers/${mother.id}`)}
                className="bg-card border border-border rounded-xl p-4 text-left active:bg-accent transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg mb-3">
                  {mother.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-foreground truncate mb-1">
                  {mother.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Week {mother.pregnancyWeek || "?"}
                </p>
                <RiskBadge level={mother.riskLevel} size="sm" />
              </button>
            ))}
          </div>
        )}

        {filteredMothers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No mothers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
