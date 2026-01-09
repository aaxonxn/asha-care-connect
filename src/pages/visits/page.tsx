import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTodayVisits } from "@/data/mockData";
import type { Visit } from "@/types";
import { Calendar, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// TODO: Replace with actual API service
const visitService = {
  getAllVisits: async (filters?: {
    status?: string;
    patientType?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Visit[]> => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredVisits = [...mockTodayVisits];
    
    if (filters) {
      if (filters.status) {
        filteredVisits = filteredVisits.filter(v => v.status === filters.status);
      }
      if (filters.patientType) {
        filteredVisits = filteredVisits.filter(v => v.patientType === filters.patientType);
      }
    }
    
    return filteredVisits;
  },
  updateVisitStatus: async (visitId: string, status: Visit["status"]) => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

export default function VisitsList() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [updatingVisit, setUpdatingVisit] = useState<string | null>(null);

  useEffect(() => {
    loadVisits();
  }, [statusFilter, typeFilter]);

  const loadVisits = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      if (typeFilter !== "all") filters.patientType = typeFilter;
      
      const visitsData = await visitService.getAllVisits(filters);
      setVisits(visitsData);
    } catch (error) {
      toast.error("Failed to load visits");
      console.error("Error loading visits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVisitStatus = async (visitId: string, status: Visit["status"]) => {
    setUpdatingVisit(visitId);
    try {
      await visitService.updateVisitStatus(visitId, status);
      
      setVisits(prev => prev.map(v => 
        v.id === visitId ? { ...v, status } : v
      ));
      
      toast.success("Visit updated successfully", {
        description: `Visit marked as ${status}.`
      });
    } catch (error) {
      toast.error("Failed to update visit");
      console.error("Error updating visit:", error);
    } finally {
      setUpdatingVisit(null);
    }
  };

  const handleStartVisit = (visitId: string) => {
    navigate(`/exam/${visitId}`);
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = 
      visit.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-risk-low text-risk-low";
      case "missed": return "bg-risk-high text-risk-high";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const isToday = (date: Date | string) => {
    const visitDate = new Date(date);
    const today = new Date();
    return visitDate.toDateString() === today.toDateString();
  };

  const sortedVisits = [...filteredVisits].sort((a, b) => {
    // Sort by date (newest first), then by priority
    const dateA = new Date(a.scheduledDate).getTime();
    const dateB = new Date(b.scheduledDate).getTime();
    
    if (dateA !== dateB) {
      return dateB - dateA; // Newest first
    }
    
    return a.priority - b.priority; // Lower priority number first
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="All Visits"
        subtitle={`${visits.length} total visits`}
        showBack
      />

      <div className="px-4 py-4 space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by patient name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mother">Mothers</SelectItem>
                <SelectItem value="child">Children</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Visits List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : sortedVisits.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No visits found</h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters or search query"
                : "No visits scheduled yet"}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedVisits.map((visit) => (
              <Card key={visit.id} className="p-4">
                <div className="flex items-start gap-3">
                  {/* Patient Avatar */}
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                    {visit.patientName.charAt(0)}
                  </div>

                  {/* Visit Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{visit.patientName}</h3>
                      {isToday(visit.scheduledDate) && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          Today
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {visit.patientType === "mother" ? "Pregnant Mother" : "Child"} • {visit.address}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(visit.scheduledDate)}
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {visit.distance} km
                      </div>

                      <RiskBadge level={visit.riskLevel} />
                      
                      <Badge className={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {visit.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStartVisit(visit.id)}
                          className="text-xs"
                        >
                          Start
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateVisitStatus(visit.id, "missed")}
                          disabled={updatingVisit === visit.id}
                          className="text-xs"
                        >
                          {updatingVisit === visit.id ? "..." : "Miss"}
                        </Button>
                      </>
                    )}
                    
                    {visit.status === "missed" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateVisitStatus(visit.id, "pending")}
                        disabled={updatingVisit === visit.id}
                        className="text-xs"
                      >
                        {updatingVisit === visit.id ? "..." : "Reschedule"}
                      </Button>
                    )}
                    
                    {visit.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/exam/${visit.id}`)}
                        className="text-xs"
                      >
                        View Report
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
