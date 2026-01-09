import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

// Simulated risk analysis result
const riskAnalysis = {
  patientName: "Sunita Devi",
  overallRisk: "high" as RiskLevel,
  riskScore: 72,
  factors: [
    { label: "Elevated blood pressure (140/92 mmHg)", severity: "high" as const },
    { label: "Low hemoglobin (9.8 g/dL)", severity: "medium" as const },
    { label: "Previous pregnancy complications", severity: "high" as const },
    { label: "BMI within normal range", severity: "low" as const },
    { label: "Regular prenatal visits", severity: "low" as const },
  ],
  suggestedFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  referralSuggested: true,
  referralReason: "Consider referral to PHC for blood pressure monitoring and anemia management",
};

const severityConfig = {
  high: { icon: AlertTriangle, className: "text-risk-high bg-risk-high-bg" },
  medium: { icon: AlertTriangle, className: "text-risk-medium bg-risk-medium-bg" },
  low: { icon: CheckCircle, className: "text-risk-low bg-risk-low-bg" },
};

export default function RiskSummary() {
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  };

  return (
    <div className="animate-fade-in min-h-screen pb-24">
      <PageHeader title="Risk Assessment" showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Patient Info & Overall Risk */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{riskAnalysis.patientName}</h2>
              <p className="text-sm text-muted-foreground">Risk Assessment Complete</p>
            </div>
            <RiskBadge level={riskAnalysis.overallRisk} size="lg" />
          </div>

          {/* Risk Score Meter */}
          <div className="bg-muted rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Risk Score</span>
              <span
                className={cn(
                  "text-2xl font-bold",
                  riskAnalysis.riskScore >= 70
                    ? "text-risk-high"
                    : riskAnalysis.riskScore >= 40
                    ? "text-risk-medium"
                    : "text-risk-low"
                )}
              >
                {riskAnalysis.riskScore}/100
              </span>
            </div>
            <div className="h-3 bg-background rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  riskAnalysis.riskScore >= 70
                    ? "bg-risk-high"
                    : riskAnalysis.riskScore >= 40
                    ? "bg-risk-medium"
                    : "bg-risk-low"
                )}
                style={{ width: `${riskAnalysis.riskScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Contributing Factors */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contributing Factors</h3>
          <div className="space-y-3">
            {riskAnalysis.factors.map((factor, index) => {
              const config = severityConfig[factor.severity];
              const Icon = config.icon;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl",
                    config.className
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{factor.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Follow-up Suggestion */}
        <div className="bg-primary-light border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Suggested Follow-up</p>
              <p className="font-semibold text-primary">
                {formatDate(riskAnalysis.suggestedFollowUp)}
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Schedule Visit
          </Button>
        </div>

        {/* Referral Suggestion */}
        {riskAnalysis.referralSuggested && (
          <div className="bg-risk-medium-bg border border-risk-medium/20 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 text-risk-medium flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-risk-medium mb-1">
                  Referral Suggested
                </p>
                <p className="text-sm text-foreground/80">
                  {riskAnalysis.referralReason}
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              Contact PHC
            </Button>
          </div>
        )}

        {/* Important Disclaimer */}
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> This assessment is based on recorded observations and
            is intended to assist ASHA workers in prioritizing care. It does not replace
            professional medical evaluation. For any emergency symptoms, immediately
            refer to the nearest health facility.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <Button onClick={() => navigate("/")} className="w-full h-14">
          Back to Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
