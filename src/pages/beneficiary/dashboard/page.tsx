import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { mockChildren, mockMothers } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Child, Mother } from "@/types";
import { AlertTriangle, Baby, Calendar, MapPin, Syringe, TrendingUp, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// TODO: Replace with actual API service
const beneficiaryService = {
  getBeneficiaryData: async (phone: string) => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find beneficiary by phone (mock logic)
    const mother = mockMothers.find(m => m.phone === phone);
    // TODO: Add phone field to Child type or use different lookup method
    const children = mockChildren; // For demo, show all children
    
    return {
      mother,
      children: children.length > 0 ? children : null
    };
  }
};

export default function BeneficiaryDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [beneficiaryData, setBeneficiaryData] = useState<{
    mother?: Mother;
    children?: Child[];
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
    loadBeneficiaryData(phone);
  }, []);

  const loadBeneficiaryData = async (phone: string) => {
    setIsLoading(true);
    try {
      const data = await beneficiaryService.getBeneficiaryData(phone);
      setBeneficiaryData(data);
    } catch (error) {
      toast.error("Failed to load your data");
      console.error("Error loading beneficiary data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userPhone");
    navigate("/login");
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

  const getVaccinationStatus = (status: string) => {
    switch (status) {
      case "up-to-date": return { label: "Up to Date", className: "bg-risk-low-bg text-risk-low" };
      case "due": return { label: "Due", className: "bg-risk-medium-bg text-risk-medium" };
      case "overdue": return { label: "Overdue", className: "bg-risk-high-bg text-risk-high" };
      default: return { label: "Unknown", className: "bg-muted text-muted-foreground" };
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="Loading..." 
          rightContent={
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          }
        />
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

  if (!beneficiaryData) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="Data Not Found" 
          rightContent={
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          }
        />
        <div className="px-4 py-4">
          <Card className="p-8 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No data found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              We couldn't find your health records. Please contact your ASHA worker.
            </p>
            <Button onClick={() => navigate("/login")}>
              Back to Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const { mother, children } = beneficiaryData;

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="My Health" 
        subtitle={`Welcome back! ${userPhone}`}
        rightContent={
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Personal Details Section */}
        {mother && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Details
            </h2>
            
            <Card className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-xl">
                  {mother.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{mother.name}</h3>
                    <RiskBadge level={mother.riskLevel} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Age {mother.age}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{mother.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Last visit: {formatDate(mother.lastVisit)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Baby className="w-4 h-4" />
                      <span>Pregnancy: {mother.pregnancyWeek ? `Week ${mother.pregnancyWeek}` : "Not recorded"}</span>
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
          </section>
        )}

        {/* Children Details Section */}
        {children && children.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Baby className="w-5 h-5" />
              Children Details
            </h2>
            
            <div className="space-y-3">
              {children.map((child) => (
                <Card key={child.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                      {child.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{child.name}</h3>
                        <RiskBadge level={child.riskLevel} />
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {calculateAge(child.dateOfBirth)} • {child.gender === "male" ? "Boy" : "Girl"}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          <TrendingUp className="w-3 h-3" />
                          {child.weight ? `${child.weight} kg` : "Weight not recorded"}
                        </span>
                        
                        {(() => {
                          const vacStatus = getVaccinationStatus(child.vaccinationStatus);
                          return (
                            <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", vacStatus.className)}>
                              <Syringe className="w-3 h-3" />
                              {vacStatus.label}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/beneficiary/children/${child.id}`)}
                          className="text-xs"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Vaccination Schedule Section */}
        {children && children.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Syringe className="w-5 h-5" />
              Vaccination Schedule
            </h2>
            
            <Card className="p-4">
              <div className="space-y-3">
                {children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{child.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Next vaccination: {child.vaccinationStatus === "up-to-date" ? "Up to date" : "Due soon"}
                      </p>
                    </div>
                    
                    <div className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getVaccinationStatus(child.vaccinationStatus).className
                    )}>
                      {getVaccinationStatus(child.vaccinationStatus).label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Upcoming Follow-ups Section */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Follow-ups
          </h2>
          
          <Card className="p-4">
            <div className="space-y-3">
              {mother && mother.nextVisit && (
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Next ASHA Visit</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(mother.nextVisit)}
                    </p>
                  </div>
                  
                  <Badge className="bg-primary text-primary-foreground">
                    Scheduled
                  </Badge>
                </div>
              )}
              
              {children && children.length === 0 && !mother && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">
                    No upcoming follow-ups scheduled
                  </p>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Help Section */}
        <Card className="p-4 bg-muted/20">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Contact your ASHA worker for any health concerns or to update your information.
          </p>
          <Button variant="outline" className="w-full">
            Contact ASHA Worker
          </Button>
        </Card>
      </div>
    </div>
  );
}
