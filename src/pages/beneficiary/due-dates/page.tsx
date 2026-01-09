import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockChildren, mockTodayVisits } from "@/data/mockData";
import type { Child } from "@/types";
import { AlertTriangle, Baby, Calendar, Clock, Syringe } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// TODO: Replace with actual API service
const dueDatesService = {
  getDueDates: async (phone: string) => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, show all children's vaccination due dates
    return {
      children: mockChildren,
      upcomingVisits: mockTodayVisits.filter(v => v.patientType === "child")
    };
  }
};

export default function DueDatesPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dueDatesData, setDueDatesData] = useState<{
    children: Child[];
    upcomingVisits: any[];
  } | null>(null);
  const [userPhone, setUserPhone] = useState<string>("");

  useEffect(() => {
    // Get user info from localStorage
    const role = localStorage.getItem("userRole");
    const phone = localStorage.getItem("userPhone") || "+919876543210"; // Mock phone for demo
    
    if (role !== "beneficiary") {
      navigate("/login");
      return;
    }

    setUserPhone(phone);
    loadDueDates(phone);
  }, []);

  const loadDueDates = async (phone: string) => {
    setIsLoading(true);
    try {
      const data = await dueDatesService.getDueDates(phone);
      setDueDatesData(data);
    } catch (error) {
      toast.error("Failed to load due dates");
      console.error("Error loading due dates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not scheduled";
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

  const getVaccinationStatus = (status: string) => {
    switch (status) {
      case "up-to-date": return { label: "Up to Date", className: "bg-risk-low-bg text-risk-low" };
      case "due": return { label: "Due", className: "bg-risk-medium-bg text-risk-medium" };
      case "overdue": return { label: "Overdue", className: "bg-risk-high-bg text-risk-high" };
      default: return { label: "Unknown", className: "bg-muted text-muted-foreground" };
    }
  };

  const getVaccinationSchedule = (child: Child) => {
    // Mock vaccination schedule based on age
    const ageMonths = child.ageMonths;
    const schedule = [];

    if (ageMonths >= 0 && ageMonths < 2) {
      schedule.push({ name: "BCG", dueDate: new Date(), status: "due" });
      schedule.push({ name: "Hepatitis B - Birth Dose", dueDate: new Date(), status: "due" });
      schedule.push({ name: "OPV - Birth Dose", dueDate: new Date(), status: "due" });
    }
    
    if (ageMonths >= 6 && ageMonths < 8) {
      schedule.push({ name: "DPT - 1st Dose", dueDate: new Date(), status: "due" });
      schedule.push({ name: "OPV - 1st Dose", dueDate: new Date(), status: "due" });
      schedule.push({ name: "Rotavirus - 1st Dose", dueDate: new Date(), status: "due" });
    }
    
    if (ageMonths >= 10 && ageMonths < 12) {
      schedule.push({ name: "DPT - 2nd Dose", dueDate: new Date(), status: "due" });
      schedule.push({ name: "OPV - 2nd Dose", dueDate: new Date(), status: "due" });
      schedule.push({ name: "Rotavirus - 2nd Dose", dueDate: new Date(), status: "due" });
    }

    return schedule;
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Loading..." />
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

  if (!dueDatesData) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Data Not Found" />
        <div className="px-4 py-4">
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No data found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              We couldn't find your vaccination records. Please contact your ASHA worker.
            </p>
            <Button onClick={() => navigate("/beneficiary/dashboard")}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const { children, upcomingVisits } = dueDatesData;

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Due Dates" 
        subtitle="Vaccination schedule and upcoming visits"
      />

      <div className="px-4 py-4 space-y-6">
        {/* Vaccination Schedule */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Syringe className="w-5 h-5" />
            Vaccination Schedule
          </h2>
          
          {children.length === 0 ? (
            <Card className="p-8 text-center">
              <Baby className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No children registered</h3>
              <p className="text-muted-foreground text-sm">
                Contact your ASHA worker to register your children.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {children.map((child) => {
                const schedule = getVaccinationSchedule(child);
                const vacStatus = getVaccinationStatus(child.vaccinationStatus);
                
                return (
                  <Card key={child.id} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                        {child.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{child.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {calculateAge(child.dateOfBirth)} • {child.gender === "male" ? "Boy" : "Girl"}
                        </p>
                      </div>
                      <Badge className={vacStatus.className}>
                        {vacStatus.label}
                      </Badge>
                    </div>

                    {schedule.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Upcoming Vaccines</h4>
                        {schedule.map((vaccine, index) => {
                          const status = getVaccinationStatus(vaccine.status);
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Syringe className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-sm">{vaccine.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Due: {formatDate(vaccine.dueDate)}
                                  </p>
                                </div>
                              </div>
                              <Badge className={status.className}>
                                {vaccine.status === "due" && "⏳ Due"}
                                {vaccine.status === "overdue" && "⚠️ Overdue"}
                                {vaccine.status === "completed" && "✅ Done"}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">
                          All vaccinations up to date for {child.name}
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Upcoming ASHA Visits */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming ASHA Visits
          </h2>
          
          {upcomingVisits.length === 0 ? (
            <Card className="p-6 text-center">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No upcoming visits scheduled
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingVisits.map((visit) => (
                <Card key={visit.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{visit.patientName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(visit.scheduledDate)} • {visit.address}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {visit.patientType === "child" ? "Child health check-up" : "Mother health check-up"}
                      </p>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">
                      Scheduled
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Important Reminders */}
        <Card className="p-4 bg-muted/20 border-l-4 border-l-primary">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Important Reminders
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Keep vaccination cards handy during ASHA visits</li>
            <li>• Inform ASHA worker about any allergies or reactions</li>
            <li>• Maintain proper nutrition before and after vaccinations</li>
            <li>• Contact ASHA worker immediately if you notice any adverse reactions</li>
          </ul>
        </Card>

        {/* Contact ASHA */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Contact your ASHA worker for vaccination appointments or health concerns.
          </p>
          <Button variant="outline" className="w-full">
            Contact ASHA Worker
          </Button>
        </Card>
      </div>
    </div>
  );
}
