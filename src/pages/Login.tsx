import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ArrowRight, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LoginStep = "phone" | "otp";

export default function Login() {
  const navigate = useNavigate();
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
      setError("Please enter the complete OTP");
      return;
    }
    setError("");
    setIsLoading(true);
    
    // Simulate API call - accept any OTP for demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    navigate("/");
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

          {step === "phone" ? (
            <>
              <h2 className="text-xl font-semibold mb-1">Welcome back</h2>
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
                      Verify & Login
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
