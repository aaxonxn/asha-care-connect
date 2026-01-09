import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockTodayVisits } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Visit } from "@/types";
import { AlertTriangle, Clock, MapPin, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// TODO: Replace with actual API service
const routeService = {
  getTodayVisits: async () => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTodayVisits;
  },
  startNavigation: (visitId: string) => {
    // Mock navigation start - integrate with actual GPS/navigation
    console.log("Starting navigation to visit:", visitId);
  }
};

export default function PlanRoute() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<string | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    loadTodayVisits();
  }, []);

  const loadTodayVisits = async () => {
    setIsLoading(true);
    try {
      const todayVisits = await routeService.getTodayVisits();
      setVisits(todayVisits.filter(v => v.status === "pending"));
    } catch (error) {
      toast.error("Failed to load today's visits");
      console.error("Error loading visits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNavigation = (visitId: string) => {
    setSelectedVisit(visitId);
    routeService.startNavigation(visitId);
    toast.success("Navigation started", {
      description: "Following route to first visit location."
    });
  };

  const handleCompleteVisit = (visitId: string) => {
    // TODO: Update visit status via API
    setVisits(prev => prev.map(v => 
      v.id === visitId ? { ...v, status: "completed" as const } : v
    ));
    setSelectedVisit(null);
    toast.success("Visit completed", {
      description: "Visit marked as completed successfully."
    });
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return "bg-risk-high text-risk-high";
    if (priority <= 4) return "bg-risk-medium text-risk-medium";
    return "bg-risk-low text-risk-low";
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high": return "bg-risk-high text-risk-high";
      case "medium": return "bg-risk-medium text-risk-medium";
      default: return "bg-risk-low text-risk-low";
    }
  };

  const sortedVisits = [...visits].sort((a, b) => a.priority - b.priority);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Plan Route"
        subtitle="Optimize your daily visits"
        showBack
      />

      <div className="px-4 py-4 space-y-4">
        {/* Map Section */}
        <section>
          <Card className="overflow-hidden">
            <div className="relative h-64 bg-muted">
              {!mapError ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground/70">
                      {/* TODO: Integrate with actual map service (Google Maps, OpenStreetMap, etc.) */}
                      Map integration coming soon
                    </p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-2" />
                    <p className="text-destructive">Map unavailable</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setMapError(false)}
                      className="mt-2"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Route Summary */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Today's Route</h2>
            <Badge variant="secondary">
              {sortedVisits.length} visits
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Est. Time</span>
              </div>
              <p className="font-semibold">~{sortedVisits.length * 30} min</p>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Distance</span>
              </div>
              <p className="font-semibold">~{sortedVisits.length * 2} km</p>
            </Card>
          </div>
        </section>

        {/* Visit List */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Visit Schedule</h2>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </Card>
              ))}
            </div>
          ) : sortedVisits.length === 0 ? (
            <Card className="p-8 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No visits today</h3>
              <p className="text-muted-foreground text-sm">
                All visits completed or no visits scheduled
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {sortedVisits.map((visit, index) => (
                <Card 
                  key={visit.id} 
                  className={cn(
                    "p-4 transition-all",
                    selectedVisit === visit.id && "ring-2 ring-primary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Visit Number */}
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>

                    {/* Visit Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{visit.patientName}</h3>
                        <Badge className={getPriorityColor(visit.priority)}>
                          Priority {visit.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {visit.patientType === "mother" ? "Pregnant Mother" : "Child"} • {visit.address}
                      </p>

                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(visit.riskLevel)}>
                          {visit.riskLevel} risk
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {visit.distance} km away
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {selectedVisit === visit.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleCompleteVisit(visit.id)}
                            className="text-xs"
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedVisit(null)}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleStartNavigation(visit.id)}
                          className="text-xs"
                          disabled={selectedVisit !== null}
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          Navigate
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Start Route Button */}
        {sortedVisits.length > 0 && !selectedVisit && (
          <div className="fixed bottom-4 left-4 right-4 z-10">
            <Button
              onClick={() => handleStartNavigation(sortedVisits[0].id)}
              className="w-full h-14"
              size="lg"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Start Route
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
