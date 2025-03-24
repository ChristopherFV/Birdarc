
import React from 'react';
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { useApp } from '@/context/AppContext';
import { AppSidebar } from './sidebar/AppSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
          <main className="w-full">
            <div className="sticky top-0 z-40 bg-background pb-4">
              <HeaderSection selectedCompany={selectedCompany} />
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

// Create a header section component that includes toggle button and company name
const HeaderSection = ({ selectedCompany }: { selectedCompany: Company }) => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <div className="px-6 md:px-8 pt-4">
      <ToggleButton />
      
      {isCollapsed && (
        <div className="mt-2 mb-1">
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-fieldvision-blue/20 flex items-center justify-center text-fieldvision-blue text-xs font-medium">
              {selectedCompany.name.charAt(0)}{selectedCompany.name.split(' ')[1]?.charAt(0) || ''}
            </div>
            <span className="ml-2.5 text-sm font-medium truncate">
              {selectedCompany.name}
            </span>
          </div>
        </div>
      )}
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
