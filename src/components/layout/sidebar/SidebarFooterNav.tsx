
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Settings, LogOut } from 'lucide-react';

export const SidebarFooterNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            tooltip="Settings"
            className={location.pathname === '/settings' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange' : ''}
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
            className={location.pathname === '/logout' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange' : ''}
          >
            <Link to="#">
              <LogOut />
              <span>Logout</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
