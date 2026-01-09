import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, Loader2, AlertCircle, CheckCircle, Info } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ScreeningState = "idle" | "uploading" | "analyzing" | "complete" | "error";

interface AIResult {
  observations: string[];
  confidenceScore: number;
  riskIndicators: string[];
}

export default function AIScreening() {
  const navigate = useNavigate();
  const [state, setState] = useState<ScreeningState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AIResult | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setState("idle");
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!previewUrl) return;

    setState("uploading");
    await new Promise((r) => setTimeout(r, 1000));

    setState("analyzing");
    await new Promise((r) => setTimeout(r, 2500));

    // Simulate AI result
    setResult({
      observations: [
        "Normal fetal positioning observed",
        "Placenta appears healthy",
        "Amniotic fluid levels within normal range",
        "No visible abnormalities detected",
      ],
      confidenceScore: 0.87,
      riskIndicators: ["Mild swelling in lower limbs noted"],
    });
    setState("complete");
  };

  const handleRetry = () => {
    setState("idle");
    setResult(null);
  };

  return (
    <div className="animate-fade-in min-h-screen pb-6">
      <PageHeader title="AI Screening" subtitle="Upload image for analysis" showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
            previewUrl ? "border-primary bg-primary-light" : "border-border"
          )}
        >
          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-lg"
              />
              <p className="text-sm text-muted-foreground">Image ready for analysis</p>
            </div>
          ) : (
            <div className="py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-2">Upload Image or Video</p>
              <p className="text-sm text-muted-foreground mb-4">
                Take a photo or select from gallery
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </span>
              </Button>
            </label>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Gallery
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Analyze Button */}
        {previewUrl && state === "idle" && (
          <Button onClick={handleAnalyze} className="w-full h-14 text-lg">
            Analyze Image
          </Button>
        )}

        {/* Loading States */}
        {(state === "uploading" || state === "analyzing") && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">
              {state === "uploading" ? "Uploading..." : "Analyzing image..."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {state === "analyzing" && "AI is processing the image. This may take a moment."}
            </p>
          </div>
        )}

        {/* Error State */}
        {state === "error" && (
          <div className="bg-risk-high-bg border border-risk-high/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-risk-high mx-auto mb-4" />
            <p className="text-lg font-medium text-risk-high mb-2">Analysis Failed</p>
            <p className="text-sm text-muted-foreground mb-4">
              Unable to process the image. Please try again.
            </p>
            <Button variant="outline" onClick={handleRetry}>
              Try Again
            </Button>
          </div>
        )}

        {/* Results */}
        {state === "complete" && result && (
          <div className="space-y-4 animate-slide-up">
            {/* Confidence Score */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Confidence Score</span>
                <span className="text-lg font-bold text-primary">
                  {Math.round(result.confidenceScore * 100)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${result.confidenceScore * 100}%` }}
                />
              </div>
            </div>

            {/* Observations */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-risk-low" />
                Observations
              </h3>
              <ul className="space-y-2">
                {result.observations.map((obs, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-risk-low rounded-full mt-2 flex-shrink-0" />
                    {obs}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Indicators */}
            {result.riskIndicators.length > 0 && (
              <div className="bg-risk-medium-bg border border-risk-medium/20 rounded-xl p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-risk-medium">
                  <AlertCircle className="w-5 h-5" />
                  Points to Note
                </h3>
                <ul className="space-y-2">
                  {result.riskIndicators.map((indicator, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-risk-medium rounded-full mt-2 flex-shrink-0" />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-muted rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> This AI screening is for assistive purposes only and
                does not constitute a medical diagnosis. Always consult with qualified healthcare
                professionals for medical decisions.
              </p>
            </div>

            {/* Continue Button */}
            <Button onClick={() => navigate(-1)} className="w-full h-14">
              Continue with Examination
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
