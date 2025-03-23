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

const Header = () => {
  const { selectedCompany } = useApp();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
          alt="Fieldvision Logo" 
          className="h-10 w-auto object-contain" 
        />
        <p className="text-muted-foreground text-sm">Powering Payments and Performance for Contractors</p>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/repository">
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              style={{ backgroundColor: "#F18E1D", color: "white", borderColor: "#F18E1D" }}
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
          >
            <HardHat className="h-4 w-4" />
            <span>Technician View</span>
          </Button>
        </Link>
        <div className="text-right">
          <p className="font-medium">{selectedCompany.name}</p>
        </div>
        <Button variant="outline" size="icon">
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
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          <HeaderWithProvider />
          <FilterBar />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-6">
              <RevenueChart />
              <ProductionChart />
            </div>
            
            <div className="lg:col-span-1 flex flex-col space-y-4" style={{ minHeight: 'calc(840px + 1.5rem)' }}>
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
