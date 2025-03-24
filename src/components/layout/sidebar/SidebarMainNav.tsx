
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
import { 
  LayoutDashboard, 
  ListTodo, 
  FileText, 
  Building2
} from 'lucide-react';

export const SidebarMainNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-fieldvision-orange">Main Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/'} 
              tooltip="Dashboard"
              className={location.pathname === '/' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange' : ''}
            >
              <Link to="/">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/work-entries'} 
              tooltip="Invoices"
              className={location.pathname === '/work-entries' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange' : ''}
            >
              <Link to="/work-entries">
                <ListTodo />
                <span>Invoices</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/repository'} 
              tooltip="FieldVision"
              className={location.pathname === '/repository' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange' : ''}
            >
              <Link to="/repository">
                <FileText />
                <span>FieldVision</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/projects'} 
              tooltip="Projects"
              className={location.pathname === '/projects' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange' : ''}
            >
              <Link to="/projects">
                <Building2 />
                <span>Projects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
