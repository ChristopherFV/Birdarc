
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
import { Menu } from 'lucide-react';

export const AppSidebar: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <>
      <Sidebar className="bg-white border-r border-fieldvision-orange/50 shadow-sm">
        <SidebarHeader />
        
        <SidebarContent>
          <SidebarMainNav />
          <SidebarTechNav />
        </SidebarContent>
        
        <SidebarFooterNav />
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
