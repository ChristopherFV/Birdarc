
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { ScheduleProvider } from "@/context/ScheduleContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WorkEntriesPage from "./pages/WorkEntriesPage";
import RepositoryPage from "./pages/RepositoryPage";
import ProjectsPage from "./pages/ProjectsPage";
import SettingsPage from "./pages/SettingsPage";
import { AddProjectDialog } from "@/components/forms/AddProjectDialog";
import { AddInvoiceDialog } from "@/components/forms/AddInvoiceDialog";
import { TechnicianWindow } from "@/components/technician/TechnicianWindow";
import { TechnicianDashboard } from "@/components/technician/TechnicianDashboard";
import TechnicianDrawingPage from "./pages/TechnicianDrawingPage";
import { MainLayout } from "@/components/layout/MainLayout";

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
              <Route path="/" element={<MainLayout><Index /></MainLayout>} />
              <Route path="/work-entries" element={<MainLayout><WorkEntriesPage /></MainLayout>} />
              <Route path="/repository" element={<MainLayout><RepositoryPage /></MainLayout>} />
              <Route path="/projects" element={<MainLayout><ProjectsPage /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
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
