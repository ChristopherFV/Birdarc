
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { Settings, LogOut } from 'lucide-react';

export const SidebarFooterNav: React.FC = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            tooltip="Settings"
            className={location.pathname === '/settings' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange !bg-transparent' : ''}
          >
            <Link to="#">
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            tooltip="Logout"
            className={location.pathname === '/logout' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange !bg-transparent' : ''}
          >
            <Link to="#">
              <LogOut />
              <span>Logout</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      
      {/* FieldVision Logo and Tagline */}
      <div className="flex flex-col items-center justify-center p-4 border-t border-border mt-4">
        <img 
          src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
          alt="Fieldvision Logo" 
          className="h-6" 
        />
        {!isCollapsed && (
          <span className="text-[8px] text-fieldvision-orange mt-0.5 text-center">
            Powering Payments and Performance for Contractors
          </span>
        )}
      </div>
    </SidebarFooter>
  );
};
