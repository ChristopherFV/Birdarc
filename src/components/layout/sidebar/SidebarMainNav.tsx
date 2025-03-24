
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
import { LayoutDashboard, FileText, ListTodo, Building2 } from 'lucide-react';

export const SidebarMainNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-fieldvision-orange">Main</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              tooltip="Dashboard"
              className={location.pathname === '/' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange !bg-transparent' : ''}
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
              tooltip="Work Entries"
              className={location.pathname === '/work-entries' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange !bg-transparent' : ''}
            >
              <Link to="/work-entries">
                <ListTodo />
                <span>Work Entries</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              tooltip="Repository"
              className={location.pathname === '/repository' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange !bg-transparent' : ''}
            >
              <Link to="/repository">
                <FileText />
                <span>Repository</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              tooltip="Projects"
              className={location.pathname === '/projects' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange !bg-transparent' : ''}
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
