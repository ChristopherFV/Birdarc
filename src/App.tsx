
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
import { AddProjectDialog } from "@/components/forms/AddProjectDialog";
import { AddInvoiceDialog } from "@/components/forms/AddInvoiceDialog";
import { TechnicianWindow } from "@/components/technician/TechnicianWindow";
import { TechnicianDashboard } from "@/components/technician/TechnicianDashboard";
import TechnicianDrawingPage from "./pages/TechnicianDrawingPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/dashboard" element={<DashboardLayout><Index /></DashboardLayout>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/work-entries" element={<DashboardLayout><WorkEntriesPage /></DashboardLayout>} />
              <Route path="/repository" element={<DashboardLayout><RepositoryPage /></DashboardLayout>} />
              <Route path="/projects" element={<DashboardLayout><ProjectsPage /></DashboardLayout>} />
              <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
              <Route path="/technician" element={<TechnicianWindow />} />
              <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
              <Route path="/technician/drawing" element={<TechnicianDrawingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ScheduleProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
