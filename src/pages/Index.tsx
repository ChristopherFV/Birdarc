
import React from 'react';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { RecentWorkEntries } from '@/components/dashboard/RecentWorkEntries';
import { WorkEntryForm } from '@/components/forms/WorkEntryForm';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background">
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
    </div>
  );
};

export default Index;
