
import React, { useState, useEffect } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { RecentWorkEntries } from '@/components/dashboard/RecentWorkEntries';
import { WorkEntryForm } from '@/components/forms/WorkEntryForm';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';

const Index = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { workEntries, projects, billingCodes, teamMembers } = useApp();
  
  // Debug log to check if data is available
  useEffect(() => {
    console.log('Dashboard Data Check:', {
      workEntriesCount: workEntries?.length || 0,
      projectsCount: projects?.length || 0,
      billingCodesCount: billingCodes?.length || 0,
      teamMembersCount: teamMembers?.length || 0
    });
  }, [workEntries, projects, billingCodes, teamMembers]);
  
  return (
    <div className="min-h-screen bg-background px-2 md:px-0">
      {isMobile ? (
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2 mb-4 bg-muted/70 p-1 rounded-lg sticky top-0 z-20 mt-2 shadow-sm">
            <TabsTrigger value="dashboard" className="text-sm py-1.5">Dashboard</TabsTrigger>
            <TabsTrigger value="work-entry" className="text-sm py-1.5">Work Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4 pb-20 animate-fade-in">
            <FilterBar />
            <Card className="p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-2">Revenue Overview</h3>
              <RevenueChart />
            </Card>
            <Card className="p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-2">Production</h3>
              <ProductionChart />
            </Card>
            <RecentInvoices />
          </TabsContent>
          
          <TabsContent value="work-entry" className="pb-20 animate-fade-in space-y-4">
            <WorkEntryForm />
            <RecentWorkEntries />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4 md:space-y-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <FilterBar />
              <RevenueChart />
              <ProductionChart />
            </div>
            
            <div className="lg:col-span-1 flex flex-col space-y-4" style={{ minHeight: 'auto' }}>
              <WorkEntryForm />
              <RecentInvoices />
            </div>
          </div>
          
          <RecentWorkEntries />
        </div>
      )}
    </div>
  );
};

export default Index;
