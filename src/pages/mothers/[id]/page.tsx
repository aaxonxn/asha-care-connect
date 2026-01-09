import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { mockMothers, mockTodayVisits } from "@/data/mockData";
import type { HealthExam, Mother, Visit } from "@/types";
import { AlertTriangle, Baby, Calendar, FileText, MapPin, Phone, Stethoscope, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// TODO: Replace with actual API services
const motherService = {
  getMother: async (id: string): Promise<Mother | null> => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMothers.find(m => m.id === id) || null;
  },
  getMotherVisits: async (motherId: string): Promise<Visit[]> => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTodayVisits.filter(v => v.patientId === motherId && v.patientType === "mother");
  },
  getMotherExaminations: async (motherId: string): Promise<HealthExam[]> => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 500));
    return []; // TODO: Add mock examination data
  }
};

export default function MotherDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [mother, setMother] = useState<Mother | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [examinations, setExaminations] = useState<HealthExam[]>([]);

  useEffect(() => {
    if (id) {
      loadMotherData(id);
    }
  }, [id]);

  const loadMotherData = async (motherId: string) => {
    setIsLoading(true);
    try {
      const [motherData, visitsData, examinationsData] = await Promise.all([
        motherService.getMother(motherId),
        motherService.getMotherVisits(motherId),
        motherService.getMotherExaminations(motherId)
      ]);

      if (!motherData) {
        toast.error("Mother not found");
        navigate("/mothers");
        return;
      }

      setMother(motherData);
      setVisits(visitsData);
      setExaminations(examinationsData);
    } catch (error) {
      toast.error("Failed to load mother details");
      console.error("Error loading mother data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVisit = () => {
    if (!mother) return;
    navigate(`/exam/${mother.id}`);
  };

  const handleViewHistory = () => {
    // TODO: Navigate to detailed history page
    toast.info("Visit history feature coming soon");
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not recorded";
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const calculateEDD = (lmp?: Date) => {
    if (!lmp) return "Not calculated";
    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280); // 40 weeks
    return edd.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Loading..." showBack />
        <div className="px-4 py-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!mother) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Mother Not Found" showBack />
        <div className="px-4 py-4">
          <Card className="p-8 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Mother not found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              The mother you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/mothers")}>
              Back to Mothers
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={mother.name}
        subtitle={`Age ${mother.age} • ${mother.address}`}
        showBack
      />

      <div className="px-4 py-4 space-y-4">
        {/* Mother Profile Card */}
        <Card className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-xl">
              {mother.name.charAt(0)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold">{mother.name}</h2>
                <RiskBadge level={mother.riskLevel} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Age {mother.age}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{mother.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{mother.address}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Last visit: {formatDate(mother.lastVisit)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Pregnancy Details */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Baby className="w-5 h-5" />
            Pregnancy Details
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pregnancy Week</p>
              <p className="font-semibold">
                {mother.pregnancyWeek ? `Week ${mother.pregnancyWeek}` : "Not recorded"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Expected Delivery Date</p>
              <p className="font-semibold">{calculateEDD(mother.lmp)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Visits</p>
              <p className="font-semibold">{mother.visitCount} visits</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Next Visit</p>
              <p className="font-semibold">{formatDate(mother.nextVisit)}</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleStartVisit}
            className="h-14"
            size="lg"
          >
            <Stethoscope className="w-5 h-5 mr-2" />
            Start Visit
          </Button>
          <Button
            variant="outline"
            onClick={handleViewHistory}
            className="h-14"
            size="lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            View History
          </Button>
        </div>

        {/* Recent Visits */}
        <section>
          <h3 className="font-semibold mb-3">Recent Visits</h3>
          
          {visits.length === 0 ? (
            <Card className="p-6 text-center">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No visits recorded yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {visits.slice(0, 3).map((visit) => (
                <Card key={visit.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{formatDate(visit.scheduledDate)}</p>
                      <p className="text-sm text-muted-foreground">{visit.address}</p>
                    </div>
                    <Badge 
                      className={
                        visit.status === "completed" 
                          ? "bg-risk-low text-risk-low"
                          : visit.status === "missed"
                          ? "bg-risk-high text-risk-high"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {visit.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Risk Factors */}
        {mother.riskLevel !== "low" && (
          <Card className="p-4 border-risk-high/20 bg-risk-high/5">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-risk-high">
              <AlertTriangle className="w-5 h-5" />
              Risk Factors
            </h3>
            <p className="text-sm text-muted-foreground">
              {mother.riskLevel === "high" 
                ? "High-risk pregnancy requires close monitoring and regular follow-ups."
                : "Medium-risk pregnancy needs additional attention during visits."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
