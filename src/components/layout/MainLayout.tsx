
import React from 'react';
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { useApp } from '@/context/AppContext';
import { AppSidebar } from './sidebar/AppSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Company } from '@/types/app-types';
import { Navbar } from './navbar/Navbar';

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
        
        <SidebarInset>
          <main className="w-full flex flex-col">
            <Navbar />
            <div className="sticky top-16 z-40 bg-background pb-4">
              <HeaderSection />
            </div>
            <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

// Create a header section component that includes toggle button
const HeaderSection = () => {
  return (
    <div className="px-6 md:px-8 pt-4">
      <ToggleButton />
    </div>
  );
};

// Extract toggle button into a separate component
const ToggleButton = () => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleSidebar}
      className="flex items-center gap-1 border border-border"
    >
      {isCollapsed ? (
        <>
          <ArrowRight className="h-3 w-3" />
          <span className="text-xs">Menu</span>
        </>
      ) : (
        <>
          <ArrowLeft className="h-3 w-3" />
          <span className="text-xs">Hide</span>
        </>
      )}
    </Button>
  );
};
