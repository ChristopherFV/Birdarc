
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
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="work-entry">Work Entry</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <FilterBar />
            <Card className="p-2">
              <RevenueChart />
            </Card>
            <Card className="p-2">
              <ProductionChart />
            </Card>
            <Card className="p-2">
              <RecentInvoices />
            </Card>
          </TabsContent>
          
          <TabsContent value="work-entry">
            <WorkEntryForm />
          </TabsContent>
          
          <TabsContent value="recent">
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
