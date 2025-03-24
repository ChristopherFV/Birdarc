
import React from 'react';
import { 
  SidebarHeader as UISidebarHeader,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const SidebarHeader: React.FC = () => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <UISidebarHeader className="flex flex-col p-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleSidebar}
        className="flex items-center gap-1 border border-border self-start"
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
    </UISidebarHeader>
  );
};
