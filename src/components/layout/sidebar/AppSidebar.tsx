
import React from 'react';
import { 
  Sidebar, 
  SidebarContent,
  useSidebar
} from "@/components/ui/sidebar";
import { SidebarHeader } from './SidebarHeader';
import { SidebarMainNav } from './SidebarMainNav';
import { SidebarTechNav } from './SidebarTechNav';
import { SidebarFooterNav } from './SidebarFooterNav';
import { Company } from '@/types/app-types';
import { Button } from '@/components/ui/button';
import { Menu, ArrowLeft, ArrowRight } from 'lucide-react';

interface AppSidebarProps {
  companies: Company[];
  selectedCompany: Company;
  setSelectedCompany: (company: Company) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  companies,
  selectedCompany,
  setSelectedCompany
}) => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <>
      <Sidebar className="bg-white border-r border-fieldvision-orange/50 shadow-sm">
        <SidebarHeader 
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          isCollapsed={isCollapsed}
        />
        
        <SidebarContent>
          <SidebarMainNav />
          <SidebarTechNav />
        </SidebarContent>
        
        <SidebarFooterNav />
      </Sidebar>
      
      {/* Desktop toggle button - positioned above filters */}
      <div className="fixed top-2 left-[calc(var(--sidebar-width)_-_0.5rem)] z-50 hidden md:block transition-all duration-300 ease-in-out" 
           style={{ 
             left: isCollapsed ? "8rem" : "calc(var(--sidebar-width) - 0.5rem)" 
           }}>
        <Button 
          variant="orange" 
          size="sm" 
          onClick={toggleSidebar}
          className="shadow-md flex items-center gap-1 h-7 px-2"
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
      </div>
      
      {/* Mobile menu toggle button */}
      <div className="fixed bottom-4 left-4 z-50 md:hidden">
        <Button 
          variant="orange" 
          size="icon" 
          onClick={toggleSidebar}
          className="rounded-full shadow-md"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>
    </>
  );
};
