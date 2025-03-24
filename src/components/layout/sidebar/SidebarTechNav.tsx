
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { LayoutDashboard, HardHat } from 'lucide-react';

export const SidebarTechNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-fieldvision-orange">Technician</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              tooltip="Technician"
              className={location.pathname === '/technician' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange !bg-transparent' : ''}
            >
              <Link to="/technician">
                <HardHat />
                <span>My Tasks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              tooltip="Tech Dashboard"
              className={location.pathname === '/technician/dashboard' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange !bg-transparent' : ''}
            >
              <Link to="/technician/dashboard">
                <LayoutDashboard />
                <span>Tech Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
