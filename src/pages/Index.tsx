
import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { RecentWorkEntries } from '@/components/dashboard/RecentWorkEntries';
import { WorkEntryForm } from '@/components/forms/WorkEntryForm';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';

const Index = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  return (
    <div className="min-h-screen bg-background px-2 md:px-0">
      {isMobile ? (
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 mb-4 bg-muted/70 p-0.5 rounded-lg sticky top-0 z-20 mt-2">
            <TabsTrigger value="dashboard" className="text-xs py-2">Dashboard</TabsTrigger>
            <TabsTrigger value="work-entry" className="text-xs py-2">Work Entry</TabsTrigger>
            <TabsTrigger value="recent" className="text-xs py-2">Recent Work</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4 pb-16 animate-fade-in">
            <FilterBar />
            <Card className="p-3 shadow-sm">
              <h3 className="text-sm font-medium mb-1">Revenue Overview</h3>
              <RevenueChart />
            </Card>
            <Card className="p-3 shadow-sm">
              <h3 className="text-sm font-medium mb-1">Production</h3>
              <ProductionChart />
            </Card>
            <RecentInvoices />
          </TabsContent>
          
          <TabsContent value="work-entry" className="pb-16 animate-fade-in">
            <WorkEntryForm />
          </TabsContent>
          
          <TabsContent value="recent" className="pb-16 animate-fade-in">
            <RecentWorkEntries />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <FilterBar />
            <RevenueChart />
            <ProductionChart />
          </div>
          
          <div className="lg:col-span-1 flex flex-col space-y-4" style={{ minHeight: isMobile ? 'auto' : 'calc(840px + 1.5rem)' }}>
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
