
import React from 'react';
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { useApp } from '@/context/AppContext';
import { AppSidebar } from './sidebar/AppSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayoutContent = ({ children }: MainLayoutProps) => {
  const { companies, selectedCompany, setSelectedCompany } = useApp();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar 
        companies={companies}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
      
      <SidebarInset>
        <main className={`p-6 md:p-8 max-w-7xl mx-auto w-full ${isCollapsed ? 'ml-16' : ''}`}>
          {children}
        </main>
      </SidebarInset>
    </div>
  );
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <MainLayoutContent>{children}</MainLayoutContent>
    </SidebarProvider>
  );
};
