import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AIScreening from "./pages/AIScreening";
import Children from "./pages/Children";
import Dashboard from "./pages/Dashboard";
import HealthExam from "./pages/HealthExam";
import Login from "./pages/login/page";
import Mothers from "./pages/Mothers";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import RiskSummary from "./pages/RiskSummary";
import Settings from "./pages/Settings";
// New pages
import ChildDetail from "./pages/children/[id]/page";
import AddChild from "./pages/children/add/page";
import PlanRoute from "./pages/map/page";
import MotherDetail from "./pages/mothers/[id]/page";
import AddMother from "./pages/mothers/add/page";
import VisitsList from "./pages/visits/page";
// Beneficiary pages
import BeneficiaryChildDetail from "./pages/beneficiary/children/[id]/page";
import BeneficiaryDashboard from "./pages/beneficiary/dashboard/page";
import DueDatesPage from "./pages/beneficiary/due-dates/page";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            {/* ASHA Worker Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mothers" element={<Mothers />} />
            <Route path="/mothers/add" element={<AddMother />} />
            <Route path="/mothers/:id" element={<MotherDetail />} />
            <Route path="/children" element={<Children />} />
            <Route path="/children/add" element={<AddChild />} />
            <Route path="/children/:id" element={<ChildDetail />} />
            <Route path="/exam" element={<HealthExam />} />
            <Route path="/exam/:patientId" element={<HealthExam />} />
            <Route path="/ai-screening" element={<AIScreening />} />
            <Route path="/risk-summary" element={<RiskSummary />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/map" element={<PlanRoute />} />
            <Route path="/visits" element={<VisitsList />} />
            
            {/* Beneficiary Routes */}
            <Route path="/beneficiary/dashboard" element={<BeneficiaryDashboard />} />
            <Route path="/beneficiary/children/:id" element={<BeneficiaryChildDetail />} />
            <Route path="/beneficiary/due-dates" element={<DueDatesPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
