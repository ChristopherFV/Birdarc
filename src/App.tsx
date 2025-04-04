
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { ScheduleProvider } from "@/context/ScheduleContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WorkEntriesPage from "./pages/WorkEntriesPage";
import RepositoryPage from "./pages/RepositoryPage";
import ProjectsPage from "./pages/ProjectsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import TeamInvitePage from "./pages/TeamInvitePage";
import GuidedProjectPage from "./pages/GuidedProjectPage";
import SchedulePage from "./pages/SchedulePage";
import { AddProjectDialog } from "@/components/forms/AddProjectDialog";
import { AddInvoiceDialog } from "@/components/forms/AddInvoiceDialog";
import { TechnicianWindow } from "@/components/technician/TechnicianWindow";
import { TechnicianDashboard } from "@/components/technician/TechnicianDashboard";
import TechnicianDrawingPage from "./pages/TechnicianDrawingPage";
import { MainLayout } from "@/components/layout/MainLayout";
import { TechnicianLayout } from "@/components/layout/TechnicianLayout";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <ScheduleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AddProjectDialog />
          <AddInvoiceDialog />
          <BrowserRouter>
            <Routes>
              {/* Auth and onboarding routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/team-invite" element={<TeamInvitePage />} />
              <Route path="/guided-project" element={<GuidedProjectPage />} />
              
              {/* Main app routes with layout */}
              <Route path="/schedule" element={<MainLayout><SchedulePage /></MainLayout>} />
              <Route path="/dashboard" element={<MainLayout><Index /></MainLayout>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/work-entries" element={<MainLayout><WorkEntriesPage /></MainLayout>} />
              <Route path="/repository" element={<MainLayout><RepositoryPage /></MainLayout>} />
              <Route path="/projects" element={<MainLayout><ProjectsPage /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
              
              {/* Technician routes with consistent layout */}
              <Route path="/technician" element={<TechnicianLayout><TechnicianWindow /></TechnicianLayout>} />
              <Route path="/technician/dashboard" element={<TechnicianLayout><TechnicianDashboard /></TechnicianLayout>} />
              <Route path="/technician/drawing" element={<TechnicianLayout><TechnicianDrawingPage /></TechnicianLayout>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ScheduleProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
