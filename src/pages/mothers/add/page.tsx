import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Mother, RiskLevel } from "@/types";
import { Baby, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// TODO: Replace with actual API service
const motherService = {
  createMother: async (motherData: Omit<Mother, "id">) => {
    // Mock API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newMother: Mother = {
      ...motherData,
      id: Math.random().toString(36).substr(2, 9),
      visitCount: 0,
    };
    return newMother;
  }
};

export default function AddMother() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    address: "",
    pregnancyWeek: "",
    riskLevel: "low" as RiskLevel,
    lastVisitDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age || parseInt(formData.age) < 15 || parseInt(formData.age) > 50) {
      newErrors.age = "Age must be between 15 and 50";
    }
    if (!formData.phone || formData.phone.length !== 10) {
      newErrors.phone = "Valid 10-digit phone number required";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.pregnancyWeek || parseInt(formData.pregnancyWeek) < 0 || parseInt(formData.pregnancyWeek) > 42) {
      newErrors.pregnancyWeek = "Pregnancy week must be between 0 and 42";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const motherData: Omit<Mother, "id"> = {
        name: formData.name,
        age: parseInt(formData.age),
        phone: formData.phone,
        address: formData.address,
        pregnancyWeek: parseInt(formData.pregnancyWeek),
        riskLevel: formData.riskLevel,
        lastVisit: formData.lastVisitDate ? new Date(formData.lastVisitDate) : undefined,
        visitCount: 0,
      };

      const newMother = await motherService.createMother(motherData);
      
      toast.success("Mother registered successfully!", {
        description: `${newMother.name} has been added to your records.`
      });
      
      navigate("/mothers");
    } catch (error) {
      toast.error("Failed to register mother", {
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

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Add Mother"
        subtitle="Register a pregnant mother"
        showBack
      />

      <div className="px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter mother's full name"
                  className={cn(errors.name && "border-destructive")}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="25"
                    min="15"
                    max="50"
                    className={cn(errors.age && "border-destructive")}
                    disabled={isLoading}
                  />
                  {errors.age && (
                    <p className="text-sm text-destructive mt-1">{errors.age}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    maxLength={10}
                    className={cn(errors.phone && "border-destructive")}
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Village, District, State"
                  className={cn(errors.address && "border-destructive")}
                  disabled={isLoading}
                />
                {errors.address && (
                  <p className="text-sm text-destructive mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </section>

          {/* Pregnancy Information */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Baby className="w-5 h-5" />
              Pregnancy Details
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pregnancyWeek">Pregnancy Week *</Label>
                  <Input
                    id="pregnancyWeek"
                    type="number"
                    value={formData.pregnancyWeek}
                    onChange={(e) => handleInputChange("pregnancyWeek", e.target.value)}
                    placeholder="28"
                    min="0"
                    max="42"
                    className={cn(errors.pregnancyWeek && "border-destructive")}
                    disabled={isLoading}
                  />
                  {errors.pregnancyWeek && (
                    <p className="text-sm text-destructive mt-1">{errors.pregnancyWeek}</p>
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

              <div>
                <Label htmlFor="lastVisitDate">Last Visit Date</Label>
                <Input
                  id="lastVisitDate"
                  type="date"
                  value={formData.lastVisitDate}
                  onChange={(e) => handleInputChange("lastVisitDate", e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/mothers")}
              disabled={isLoading}
              className="flex-1 h-14"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-14"
            >
              {isLoading ? "Registering..." : "Register Mother"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
