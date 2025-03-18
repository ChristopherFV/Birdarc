
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppProvider } from '@/context/AppContext';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { WorkEntryForm } from '@/components/forms/WorkEntryForm';

const Index = () => {
  return (
    <AppProvider>
      <DashboardLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Track your fiber installation progress and revenue</p>
        </div>
        
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
      </DashboardLayout>
    </AppProvider>
  );
};

export default Index;
