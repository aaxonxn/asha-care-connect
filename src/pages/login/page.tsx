import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Baby, Loader2, Phone, Shield, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type UserRole = "asha" | "beneficiary";
type LoginStep = "phone" | "otp";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("asha");
  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      setError("Please enter complete OTP");
      return;
    }
    setError("");
    setIsLoading(true);
    
    // Simulate API call - accept any OTP for demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store role in localStorage for auth context
    localStorage.setItem("userRole", role);
    localStorage.setItem("isAuthenticated", "true");
    
    setIsLoading(false);
    
    // Role-based routing
    if (role === "asha") {
      navigate("/dashboard");
    } else {
      navigate("/beneficiary/dashboard");
    }
  };

  const getRoleIcon = (selectedRole: UserRole) => {
    return selectedRole === "asha" ? (
      <User className="w-5 h-5" />
    ) : (
      <Baby className="w-5 h-5" />
    );
  };

  const getRoleTitle = (selectedRole: UserRole) => {
    return selectedRole === "asha" ? "ASHA Worker" : "Mother / Caregiver";
  };

  const getRoleDescription = (selectedRole: UserRole) => {
    return selectedRole === "asha" 
      ? "Healthcare worker managing multiple beneficiaries"
      : "View your personal health data and children's details";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-16 text-center">
        <div className="w-20 h-20 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10" />
        </div>
        <h1 className="text-field-2xl font-bold mb-2">BabyAssist AI</h1>
        <p className="text-primary-foreground/80">
          Maternal & Child Healthcare Assistant
        </p>
      </div>

      {/* Form Card */}
      <div className="flex-1 px-4 -mt-8">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 max-w-md mx-auto">
          {/* Language Selector */}
          <div className="mb-6">
            <Label className="text-sm text-muted-foreground mb-2 block">
              Select Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <Label className="text-sm text-muted-foreground mb-3 block">
              Login as
            </Label>
            <RadioGroup value={role} onValueChange={(value: UserRole) => setRole(value)} className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asha" id="asha" className="peer" />
                <Label 
                  htmlFor="asha" 
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <User className="w-5 h-5" />
                  <div>
                    <div className="font-medium">🧑‍⚕️ ASHA Worker</div>
                    <div className="text-sm text-muted-foreground">
                      Field healthcare worker
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beneficiary" id="beneficiary" className="peer" />
                <Label 
                  htmlFor="beneficiary" 
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <Baby className="w-5 h-5" />
                  <div>
                    <div className="font-medium">👩‍👧 Mother / Caregiver</div>
                    <div className="text-sm text-muted-foreground">
                      View your health data
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Selected Role Display */}
          <Card className="p-3 mb-6 bg-muted/30">
            <div className="flex items-center gap-2">
              {getRoleIcon(role)}
              <div>
                <div className="font-medium text-sm">
                  {getRoleTitle(role)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getRoleDescription(role)}
                </div>
              </div>
            </div>
          </Card>

          {step === "phone" ? (
            <>
              <h2 className="text-xl font-semibold mb-1">
                Welcome back, {getRoleTitle(role)}
              </h2>
              <p className="text-muted-foreground mb-6">
                Enter your phone number to continue
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="pl-11 text-lg"
                      maxLength={10}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}

                <Button
                  onClick={handleSendOtp}
                  disabled={isLoading || phone.length < 10}
                  className="w-full h-14 text-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-1">Verify OTP</h2>
              <p className="text-muted-foreground mb-6">
                Enter the 6-digit code sent to +91 {phone}
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-[0.5em] mt-2"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}

                <Button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.length < 4}
                  className="w-full h-14 text-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify & Login as {getRoleTitle(role)}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <button
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError("");
                  }}
                  className="w-full text-primary text-sm font-medium py-2"
                >
                  Change phone number
                </button>
              </div>
            </>
          )}
        </div>

        {/* Demo hint */}
        <p className="text-center text-muted-foreground text-sm mt-6 px-4">
          Demo Mode: Enter any 10-digit number and any OTP to continue
        </p>
      </div>
    </div>
  );
}
