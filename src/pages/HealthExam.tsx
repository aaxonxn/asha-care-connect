import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, ArrowRight, Camera } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormStepper } from "@/components/ui/FormStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: "vitals", label: "Vitals" },
  { id: "measurements", label: "Measurements" },
  { id: "notes", label: "Notes" },
];

export default function HealthExam() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    pulseRate: "",
    temperature: "",
    spO2: "",
    weight: "",
    height: "",
    hemoglobin: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100; // cm to m
    if (weight && height) {
      return (weight / (height * height)).toFixed(1);
    }
    return null;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Examination Saved",
      description: "Health examination data has been recorded successfully.",
    });
    navigate("/risk-summary");
  };

  const bmi = calculateBMI();

  return (
    <div className="animate-fade-in min-h-screen pb-24">
      <PageHeader
        title="Health Examination"
        subtitle="Sunita Devi • Week 28"
        showBack
      />

      <div className="px-4 py-6 space-y-6">
        <FormStepper steps={steps} currentStep={currentStep} />

        {currentStep === 0 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold">Vital Signs</h2>

            {/* Blood Pressure */}
            <div>
              <Label>Blood Pressure (mmHg)</Label>
              <div className="flex gap-3 mt-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Systolic"
                    value={formData.bloodPressureSystolic}
                    onChange={(e) =>
                      handleChange("bloodPressureSystolic", e.target.value)
                    }
                  />
                  <span className="text-xs text-muted-foreground mt-1 block">
                    Normal: 90-120
                  </span>
                </div>
                <span className="text-2xl text-muted-foreground self-start mt-3">/</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Diastolic"
                    value={formData.bloodPressureDiastolic}
                    onChange={(e) =>
                      handleChange("bloodPressureDiastolic", e.target.value)
                    }
                  />
                  <span className="text-xs text-muted-foreground mt-1 block">
                    Normal: 60-80
                  </span>
                </div>
              </div>
            </div>

            {/* Pulse Rate */}
            <div>
              <Label htmlFor="pulseRate">Pulse Rate (bpm)</Label>
              <Input
                id="pulseRate"
                type="number"
                inputMode="numeric"
                placeholder="Enter pulse rate"
                value={formData.pulseRate}
                onChange={(e) => handleChange("pulseRate", e.target.value)}
                className="mt-2"
              />
              <span className="text-xs text-muted-foreground mt-1 block">
                Normal: 60-100 bpm
              </span>
            </div>

            {/* Temperature */}
            <div>
              <Label htmlFor="temperature">Temperature (°F)</Label>
              <Input
                id="temperature"
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="Enter temperature"
                value={formData.temperature}
                onChange={(e) => handleChange("temperature", e.target.value)}
                className="mt-2"
              />
              <span className="text-xs text-muted-foreground mt-1 block">
                Normal: 97.0-99.0°F
              </span>
            </div>

            {/* SpO2 */}
            <div>
              <Label htmlFor="spO2">SpO₂ (%)</Label>
              <Input
                id="spO2"
                type="number"
                inputMode="numeric"
                placeholder="Enter oxygen saturation"
                value={formData.spO2}
                onChange={(e) => handleChange("spO2", e.target.value)}
                className="mt-2"
              />
              <span className="text-xs text-muted-foreground mt-1 block">
                Normal: 95-100%
              </span>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold">Body Measurements</h2>

            {/* Weight */}
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="Enter weight"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Height */}
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                inputMode="numeric"
                placeholder="Enter height"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
                className="mt-2"
              />
            </div>

            {/* BMI Display */}
            {bmi && (
              <div className="bg-primary-light rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Calculated BMI
                </p>
                <p className="text-2xl font-bold text-primary">{bmi}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {parseFloat(bmi) < 18.5
                    ? "Underweight"
                    : parseFloat(bmi) < 25
                    ? "Normal"
                    : parseFloat(bmi) < 30
                    ? "Overweight"
                    : "Obese"}
                </p>
              </div>
            )}

            {/* Hemoglobin */}
            <div>
              <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
              <Input
                id="hemoglobin"
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="Enter hemoglobin level"
                value={formData.hemoglobin}
                onChange={(e) => handleChange("hemoglobin", e.target.value)}
                className="mt-2"
              />
              <span className="text-xs text-muted-foreground mt-1 block">
                Normal for pregnant women: 11-14 g/dL
              </span>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold">Additional Notes</h2>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Observations & Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any observations, symptoms, or concerns..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="mt-2 min-h-[150px]"
              />
            </div>

            {/* AI Screening Button */}
            <Button
              variant="outline"
              className="w-full h-14"
              onClick={() => navigate("/ai-screening")}
            >
              <Camera className="w-5 h-5 mr-2" />
              AI Screening (Optional)
            </Button>
          </div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 flex gap-3">
        {currentStep > 0 && (
          <Button variant="outline" onClick={handleBack} className="flex-1 h-14">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} className="flex-1 h-14">
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="flex-1 h-14">
            <Save className="w-5 h-5 mr-2" />
            Save Examination
          </Button>
        )}
      </div>
    </div>
  );
}
