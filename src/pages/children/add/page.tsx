import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Child, RiskLevel } from "@/types";
import { Baby, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// TODO: Replace with actual API service
const childService = {
  createChild: async (childData: Omit<Child, "id">) => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newChild: Child = {
      ...childData,
      id: Math.random().toString(36).substr(2, 9),
    };
    return newChild;
  },
  getMothers: async () => {
    // Mock mothers data - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: "1", name: "Rani Devi" },
      { id: "2", name: "Sita Kumari" },
      { id: "3", name: "Gauri Sharma" },
    ];
  }
};

export default function AddChild() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mothers, setMothers] = useState<Array<{id: string, name: string}>>([]);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female",
    motherId: "",
    birthWeight: "",
    riskLevel: "low" as RiskLevel,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load mothers on component mount
  useState(() => {
    const loadMothers = async () => {
      try {
        const mothersData = await childService.getMothers();
        setMothers(mothersData);
      } catch (error) {
        console.error("Failed to load mothers:", error);
      }
    };
    loadMothers();
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Child's name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.motherId) newErrors.motherId = "Mother selection is required";
    if (formData.birthWeight && (parseFloat(formData.birthWeight) < 0.5 || parseFloat(formData.birthWeight) > 10)) {
      newErrors.birthWeight = "Birth weight must be between 0.5 and 10 kg";
    }

    // Validate date of birth is not in future
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      if (dob > new Date()) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      }
      if (dob < new Date(new Date().setFullYear(new Date().getFullYear() - 10))) {
        newErrors.dateOfBirth = "Date of birth cannot be more than 10 years ago";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const selectedMother = mothers.find(m => m.id === formData.motherId);
      
      const childData: Omit<Child, "id"> = {
        name: formData.name,
        dateOfBirth: new Date(formData.dateOfBirth),
        gender: formData.gender,
        motherId: formData.motherId,
        motherName: selectedMother?.name || "Unknown",
        riskLevel: formData.riskLevel,
        ageMonths: calculateAgeMonths(new Date(formData.dateOfBirth)),
        vaccinationStatus: "due", // New children start as due for vaccinations
        weight: formData.birthWeight ? parseFloat(formData.birthWeight) : undefined,
      };

      const newChild = await childService.createChild(childData);
      
      toast.success("Child registered successfully!", {
        description: `${newChild.name} has been added to your records.`
      });
      
      navigate("/children");
    } catch (error) {
      toast.error("Failed to register child", {
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const calculateAgeMonths = (dateOfBirth: Date): number => {
    const today = new Date();
    const months = (today.getFullYear() - dateOfBirth.getFullYear()) * 12 + 
                   (today.getMonth() - dateOfBirth.getMonth());
    return Math.max(0, months);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Add Child"
        subtitle="Register a child under care"
        showBack
      />

      <div className="px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Baby className="w-5 h-5" />
              Child Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Child's Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter child's name"
                  className={cn(errors.name && "border-destructive")}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={cn(errors.dateOfBirth && "border-destructive")}
                    disabled={isLoading}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-destructive mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: "male" | "female") => handleInputChange("gender", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Boy</SelectItem>
                      <SelectItem value="female">Girl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="birthWeight">Birth Weight (kg)</Label>
                <Input
                  id="birthWeight"
                  type="number"
                  step="0.1"
                  value={formData.birthWeight}
                  onChange={(e) => handleInputChange("birthWeight", e.target.value)}
                  placeholder="3.2"
                  min="0.5"
                  max="10"
                  className={cn(errors.birthWeight && "border-destructive")}
                  disabled={isLoading}
                />
                {errors.birthWeight && (
                  <p className="text-sm text-destructive mt-1">{errors.birthWeight}</p>
                )}
              </div>
            </div>
          </section>

          {/* Mother Information */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Mother Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="motherId">Select Mother *</Label>
                <Select
                  value={formData.motherId}
                  onValueChange={(value) => handleInputChange("motherId", value)}
                  disabled={isLoading || mothers.length === 0}
                >
                  <SelectTrigger className={cn(errors.motherId && "border-destructive")}>
                    <SelectValue placeholder="Select mother from list" />
                  </SelectTrigger>
                  <SelectContent>
                    {mothers.map((mother) => (
                      <SelectItem key={mother.id} value={mother.id}>
                        {mother.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.motherId && (
                  <p className="text-sm text-destructive mt-1">{errors.motherId}</p>
                )}
                {mothers.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No mothers registered. Please add a mother first.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value: RiskLevel) => handleInputChange("riskLevel", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/children")}
              disabled={isLoading}
              className="flex-1 h-14"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || mothers.length === 0}
              className="flex-1 h-14"
            >
              {isLoading ? "Registering..." : "Register Child"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
