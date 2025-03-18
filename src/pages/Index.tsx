
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { WorkEntryForm } from '@/components/forms/WorkEntryForm';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

// Create a new Header component
const Header = () => {
  const { selectedCompany } = useApp();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1 text-[#403E43]">Dashboard</h1>
        <p className="text-muted-foreground text-[#8A898C]">Track your fiber installation progress and revenue</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium text-[#403E43]">{selectedCompany.name}</p>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full border-[#F1F0FB] bg-white shadow-subtle hover:bg-[#F6F6F7]"
        >
          <Settings className="h-[1.2rem] w-[1.2rem] text-[#403E43]" />
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
      <div className="min-h-screen bg-[#F1F1F1]">
        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-subtle p-6 md:p-8">
            <HeaderWithProvider />
            <FilterBar />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <RevenueChart />
                <ProductionChart />
              </div>
              
              <div className="lg:col-span-1">
                <WorkEntryForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
