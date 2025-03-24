
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  ListTodo, 
  FileText, 
  Settings, 
  Building2, 
  LogOut,
  HardHat
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CompanySelector } from '@/components/ui/CompanySelector';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { companies, selectedCompany, setSelectedCompany } = useApp();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="bg-white border-r border-border shadow-sm">
          <SidebarHeader className="flex flex-col">
            <div className="flex items-center justify-between px-2 h-16">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
                  alt="Fieldvision Logo" 
                  className="h-8" 
                />
              </div>
            </div>
            <div className="px-2 pt-2 pb-2">
              <CompanySelector 
                companies={companies}
                selectedCompany={selectedCompany}
                onChange={setSelectedCompany}
              />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === '/'} 
                      tooltip="Dashboard"
                      className={location.pathname === '/' ? 'bg-primary/10 text-primary font-medium' : ''}
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
                      className={location.pathname === '/work-entries' ? 'bg-primary/10 text-primary font-medium' : ''}
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
                      className={location.pathname === '/repository' ? 'bg-primary/10 text-primary font-medium' : ''}
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
                      className={location.pathname === '/projects' ? 'bg-primary/10 text-primary font-medium' : ''}
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
            
            <SidebarGroup>
              <SidebarGroupLabel>Technician</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === '/technician'} 
                      tooltip="Technician"
                      className={location.pathname === '/technician' ? 'bg-primary/10 text-primary font-medium' : ''}
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
                      isActive={location.pathname === '/technician/dashboard'} 
                      tooltip="Tech Dashboard"
                      className={location.pathname === '/technician/dashboard' ? 'bg-primary/10 text-primary font-medium' : ''}
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
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Settings"
                  className={location.pathname === '#settings' ? 'bg-primary/10 text-primary font-medium' : ''}
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
                  className={location.pathname === '#logout' ? 'bg-primary/10 text-primary font-medium' : ''}
                >
                  <Link to="#">
                    <LogOut />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
