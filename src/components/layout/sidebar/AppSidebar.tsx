
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
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

export const AppSidebar: React.FC = () => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <>
      <Sidebar className="bg-white border-r border-fieldvision-orange/50 shadow-sm">
        <SidebarHeader />
        
        <SidebarContent>
          <SidebarMainNav />
          <SidebarTechNav />
        </SidebarContent>
        
        <SidebarFooterNav />
        
        {/* Toggle button positioned on the sidebar border */}
        <div className="absolute -right-3 top-16 z-50">
          <Button 
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-6 w-6 rounded-full bg-white border border-border shadow-sm"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </div>
      </Sidebar>
      
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
