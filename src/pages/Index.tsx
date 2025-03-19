
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { WorkEntryForm } from '@/components/forms/WorkEntryForm';
import { Settings, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';

// Create a new Header component
const Header = () => {
  const { selectedCompany } = useApp();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Track your fiber installation progress and revenue</p>
      </div>
      <div className="flex items-center gap-4">
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

// QuickBooks sync indicator component
const QuickBooksSyncIndicator = () => (
  <Card className="bg-card border-border shadow-sm mb-3">
    <CardHeader className="py-3">
      <div className="flex items-center">
        <CheckCircle className="text-green-500 mr-2" size={16} />
        <p className="text-sm font-medium">QuickBooks Sync'd</p>
      </div>
    </CardHeader>
  </Card>
);

const Index = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          <HeaderWithProvider />
          <FilterBar />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RevenueChart />
              <ProductionChart />
            </div>
            
            <div className="lg:col-span-1">
              <QuickBooksSyncIndicator />
              <RecentInvoices />
              <WorkEntryForm />
            </div>
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
