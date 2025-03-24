
import React from 'react';
import { Link } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { RecentWorkEntries } from '@/components/dashboard/RecentWorkEntries';
import { WorkEntryForm } from '@/components/forms/WorkEntryForm';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { Settings, FolderOpen, Glasses, HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { selectedCompany } = useApp();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
      <div>
        <img 
          src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
          alt="Fieldvision Logo" 
          className="h-6 w-auto object-contain mb-0.5" 
        />
        <p className="text-muted-foreground text-[10px] max-w-[280px] sm:max-w-none">
          Powering Payments and Performance for Contractors
        </p>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-start sm:justify-end">
        <Link to="/repository" className="mr-1">
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              style={{ backgroundColor: "#F18E1D", color: "white", borderColor: "#F18E1D" }}
              size={isMobile ? "sm" : "sm"}
            >
              <FolderOpen className="h-4 w-4" />
              <span>Fieldvision</span>
            </Button>
            <Badge 
              variant="soft-orange" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full shadow-sm"
            >
              <Glasses className="h-3 w-3" />
            </Badge>
          </div>
        </Link>
        <Link to="/technician">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            style={{ backgroundColor: "#F18E1D", color: "white", borderColor: "#F18E1D" }}
            size={isMobile ? "sm" : "sm"}
          >
            <HardHat className="h-4 w-4" />
            <span className="whitespace-nowrap">{isMobile ? "Tech View" : "Technician View"}</span>
          </Button>
        </Link>
        <div className="text-right ml-auto sm:ml-0">
          <p className="font-medium text-sm sm:text-base">{selectedCompany.name}</p>
        </div>
        <Button variant="outline" size="icon" className="ml-1">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </div>
  );
};

const HeaderWithProvider = () => (
  <AppProvider>
    <Header />
  </AppProvider>
);

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          <HeaderWithProvider />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Filters bar now only above charts */}
              <FilterBar />
              <RevenueChart />
              <ProductionChart />
            </div>
            
            <div className="lg:col-span-1 flex flex-col space-y-4" style={{ minHeight: isMobile ? 'auto' : 'calc(840px + 1.5rem)' }}>
              <WorkEntryForm />
              <RecentInvoices />
            </div>
          </div>
          
          <RecentWorkEntries />
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
