
import React from 'react';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { RecentWorkEntries } from '@/components/dashboard/RecentWorkEntries';
import { WorkEntryForm } from '@/components/forms/WorkEntryForm';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        // Mobile Layout
        <div className="space-y-4">
          {/* Mobile Tabs Navigation */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="entry">Add Entry</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-2">
              <FilterBar />
              <RevenueChart />
              <ProductionChart />
              <RecentInvoices />
            </TabsContent>
            
            <TabsContent value="entry" className="mt-2">
              <WorkEntryForm />
            </TabsContent>
            
            <TabsContent value="recent" className="mt-2">
              <RecentWorkEntries />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Desktop Layout
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <FilterBar />
            <RevenueChart />
            <ProductionChart />
          </div>
          
          <div className="lg:col-span-1 flex flex-col space-y-4" style={{ minHeight: 'calc(840px + 1.5rem)' }}>
            <WorkEntryForm />
            <RecentInvoices />
          </div>
          
          <RecentWorkEntries />
        </div>
      )}
    </div>
  );
};

export default Index;
