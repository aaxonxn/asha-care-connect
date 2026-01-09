import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { mockChildren } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Child, HealthExam } from "@/types";
import { AlertTriangle, Baby, Calendar, FileText, Syringe, TrendingUp, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// TODO: Replace with actual API service
const childService = {
  getChild: async (id: string): Promise<Child | null> => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockChildren.find(c => c.id === id) || null;
  },
  getChildExaminations: async (childId: string): Promise<HealthExam[]> => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 500));
    return []; // TODO: Add mock examination data
  },
  getChildVaccinations: async (childId: string): Promise<any[]> => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 500));
    return []; // TODO: Add mock vaccination data
  }
};

const vaccinationConfig = {
  "up-to-date": { label: "Up to Date", className: "bg-risk-low-bg text-risk-low" },
  "due": { label: "Due", className: "bg-risk-medium-bg text-risk-medium" },
  "overdue": { label: "Overdue", className: "bg-risk-high-bg text-risk-high" },
};

export default function BeneficiaryChildDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [child, setChild] = useState<Child | null>(null);
  const [examinations, setExaminations] = useState<HealthExam[]>([]);
  const [vaccinations, setVaccinations] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      loadChildData(id);
    }
  }, [id]);

  const loadChildData = async (childId: string) => {
    setIsLoading(true);
    try {
      const [childData, examinationsData, vaccinationsData] = await Promise.all([
        childService.getChild(childId),
        childService.getChildExaminations(childId),
        childService.getChildVaccinations(childId)
      ]);

      if (!childData) {
        toast.error("Child not found");
        navigate("/beneficiary/dashboard");
        return;
      }

      setChild(childData);
      setExaminations(examinationsData);
      setVaccinations(vaccinationsData);
    } catch (error) {
      toast.error("Failed to load child details");
      console.error("Error loading child data:", error);
    } finally {
      setIsLoading(false);
    }
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

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const months = (today.getFullYear() - dateOfBirth.getFullYear()) * 12 + 
                   (today.getMonth() - dateOfBirth.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} months`;
    } else if (remainingMonths === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} months`;
    }
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

  if (!child) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Child Not Found" showBack />
        <div className="px-4 py-4">
          <Card className="p-8 text-center">
            <Baby className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Child not found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              The child you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/beneficiary/dashboard")}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const vacConfig = vaccinationConfig[child.vaccinationStatus];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={child.name}
        subtitle={`${calculateAge(child.dateOfBirth)} • ${child.gender === "male" ? "Boy" : "Girl"}`}
        showBack
      />

      <div className="px-4 py-4 space-y-4">
        {/* Child Profile Card */}
        <Card className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-xl">
              {child.name.charAt(0)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold">{child.name}</h2>
                <RiskBadge level={child.riskLevel} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{calculateAge(child.dateOfBirth)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>DOB: {formatDate(child.dateOfBirth)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Baby className="w-4 h-4" />
                  <span>{child.gender === "male" ? "Boy" : "Girl"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Mother: {child.motherName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Read-only indicator */}
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4" />
              <span>Read-only view - Contact your ASHA worker for updates</span>
            </div>
          </div>
        </Card>

        {/* Growth Chart */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Growth Summary
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Weight</p>
              <p className="font-semibold">{child.weight ? `${child.weight} kg` : "Not recorded"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Height</p>
              <p className="font-semibold">{child.height ? `${child.height} cm` : "Not recorded"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Age in Months</p>
              <p className="font-semibold">{child.ageMonths} months</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Screening</p>
              <p className="font-semibold">{formatDate(child.lastScreening)}</p>
            </div>
          </div>

          {/* Simple growth chart placeholder */}
          <div className="mt-4 p-4 bg-muted/20 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Growth chart visualization coming soon
            </p>
          </div>
        </Card>

        {/* Vaccination Status */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Syringe className="w-5 h-5" />
            Vaccination Status
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium", vacConfig.className)}>
              <Syringe className="w-3 h-3" />
              {vacConfig.label}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {child.vaccinationStatus === "up-to-date" 
              ? "All vaccinations are up to date. Next vaccination due according to schedule."
              : child.vaccinationStatus === "due"
              ? "Some vaccinations are due. Please contact your ASHA worker."
              : "Some vaccinations are overdue. Immediate attention required."}
          </p>

          {/* Vaccination History */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Vaccination History</h4>
            {vaccinations.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No vaccination records available
                </p>
              </div>
            ) : (
              vaccinations.slice(0, 3).map((vaccination: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div>
                    <p className="text-sm font-medium">{vaccination.name || "Vaccination"}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(vaccination.date)}</p>
                  </div>
                  <Badge className={cn(
                    vaccination.completed 
                      ? "bg-risk-low text-risk-low"
                      : vaccination.status === "due"
                      ? "bg-risk-medium text-risk-medium"
                      : "bg-risk-high text-risk-high"
                  )}>
                    {vaccination.completed ? "✅ Completed" : vaccination.status || "Pending"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Vaccines */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Upcoming Vaccines</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
              <div>
                <p className="font-medium">Next vaccination</p>
                <p className="text-sm text-muted-foreground">
                  {child.vaccinationStatus === "up-to-date" 
                    ? "According to immunization schedule"
                    : "Contact ASHA worker for appointment"}
                </p>
              </div>
              <Button size="sm" variant="outline" disabled>
                Schedule
              </Button>
            </div>
          </div>
        </Card>

        {/* Health Notes */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Health Notes
          </h3>
          
          <div className="space-y-2">
            {examinations.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No health examinations recorded yet
                </p>
              </div>
            ) : (
              examinations.slice(0, 2).map((exam: HealthExam, index: number) => (
                <div key={index} className="p-3 bg-muted/30 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{formatDate(exam.date)}</p>
                    <Badge className="bg-muted text-muted-foreground text-xs">
                      View Report
                    </Badge>
                  </div>
                  {exam.notes && (
                    <p className="text-sm text-muted-foreground">
                      {exam.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Contact ASHA */}
        <Card className="p-4 bg-muted/20">
          <h3 className="font-semibold mb-2">Need to Update Information?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Contact your ASHA worker to update health records or schedule appointments.
          </p>
          <Button variant="outline" className="w-full">
            Contact ASHA Worker
          </Button>
        </Card>
      </div>
    </div>
  );
}
