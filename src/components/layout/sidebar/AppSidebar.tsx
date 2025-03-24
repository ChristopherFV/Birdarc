
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
        />
        
        <SidebarContent>
          <SidebarMainNav />
          <SidebarTechNav />
        </SidebarContent>
        
        <SidebarFooterNav />
      </Sidebar>
      
      {/* Desktop toggle button - positioned absolutely to the right of the sidebar */}
      <div className="fixed top-4 left-[calc(var(--sidebar-width)_-_1rem)] z-50 hidden md:block transition-all duration-300 ease-in-out" 
           style={{ 
             left: isCollapsed ? "2.5rem" : "calc(var(--sidebar-width) - 1rem)" 
           }}>
        <Button 
          variant="orange" 
          size="sm" 
          onClick={toggleSidebar}
          className="shadow-md flex items-center gap-1"
        >
          {isCollapsed ? (
            <>
              <ArrowRight className="h-4 w-4" />
              <span>Menu</span>
            </>
          ) : (
            <>
              <ArrowLeft className="h-4 w-4" />
              <span>Hide</span>
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
