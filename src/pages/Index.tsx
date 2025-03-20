
import React from 'react';
import { Link } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { RecentWorkEntries } from '@/components/dashboard/RecentWorkEntries';
import { WorkEntryForm } from '@/components/forms/WorkEntryForm';
import { Settings, Map, ListTodo, FolderOpen, Glasses } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { InvoicesButton } from '@/components/dashboard/InvoicesButton';
import { Badge } from '@/components/ui/badge';

// Create a new Header component
const Header = () => {
  const { selectedCompany } = useApp();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">FieldVision</h1>
        <p className="text-muted-foreground">Powering Payments and Performance for Contractors.</p>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/repository">
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              style={{ backgroundColor: "#002B3D", color: "white", borderColor: "#002B3D" }}
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
        <Link to="/schedule">
          <Button variant="outline" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span>Schedule</span>
          </Button>
        </Link>
        <InvoicesButton />
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

// Wrap Header in a provider to access context
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
            
            <div className="lg:col-span-1 flex flex-col" style={{ minHeight: 'calc(840px + 1.5rem)' }}>
              <WorkEntryForm />
            </div>
          </div>
          
          {/* Recent Work Entries now takes full width */}
          <RecentWorkEntries />
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
