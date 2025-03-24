
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { useApp } from '@/context/AppContext';
import { AppSidebar } from './sidebar/AppSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { companies, selectedCompany, setSelectedCompany } = useApp();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        />
        
        <SidebarRail />
        
        <SidebarInset>
          <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
