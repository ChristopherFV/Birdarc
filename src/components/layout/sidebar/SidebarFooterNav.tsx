
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { Settings, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SidebarFooterNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Show toast notification
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    
    // Redirect to login page
    navigate('/login');
  };
  
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            tooltip="Settings"
            className={location.pathname === '/settings' ? 'text-fieldvision-orange font-medium border-l-2 border-fieldvision-orange !bg-transparent' : ''}
          >
            <Link to="/settings">
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            tooltip="Logout"
            className="hover:text-destructive"
          >
            <Link to="#" onClick={handleLogout}>
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
