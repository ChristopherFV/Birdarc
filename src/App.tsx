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
import { AddProjectDialog } from "@/components/forms/AddProjectDialog";
import { AddInvoiceDialog } from "@/components/forms/AddInvoiceDialog";
import { TechnicianWindow } from "@/components/technician/TechnicianWindow";
import { TechnicianDashboard } from "@/components/technician/TechnicianDashboard";

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
              <Route path="/" element={<Index />} />
              <Route path="/invoicing" element={<WorkEntriesPage />} />
              <Route path="/work-entries" element={<WorkEntriesPage />} />
              <Route path="/repository" element={<RepositoryPage />} />
              <Route path="/technician" element={<TechnicianWindow />} />
              <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ScheduleProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
