
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Home, CheckSquare, LayoutDashboard, Map, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface TechnicianLayoutProps {
  children: React.ReactNode;
}

export const TechnicianLayout: React.FC<TechnicianLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-2 px-4">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
              alt="Fieldvision Logo" 
              className="h-8" 
            />
          </div>
          
          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/technician">
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle()}
                      active={location.pathname === '/technician'}
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Tasks
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/technician/dashboard">
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle()}
                      active={location.pathname === '/technician/dashboard'}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/technician/dashboard?tab=map">
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle()}
                      active={location.search === '?tab=map'}
                    >
                      <Map className="mr-2 h-4 w-4" />
                      Map
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Phone className="mr-2 h-4 w-4" />
                    Support
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
          
          <div>
            <button className="text-sm text-fieldvision-blue" onClick={() => navigate('/dashboard')}>
              Back to Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="grid grid-cols-4 items-center h-16">
            {/* Home Icon */}
            <Link to="/technician" className="flex flex-col items-center justify-center h-full">
              <div className={`p-1 rounded-full ${location.pathname === '/technician' ? 'bg-fieldvision-blue/10' : ''}`}>
                <CheckSquare className={`h-5 w-5 ${location.pathname === '/technician' ? 'text-fieldvision-blue' : 'text-gray-500'}`} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium text-gray-600">Tasks</span>
            </Link>
            
            {/* Dashboard Icon */}
            <Link to="/technician/dashboard" className="flex flex-col items-center justify-center h-full">
              <div className={`p-1 rounded-full ${location.pathname === '/technician/dashboard' ? 'bg-fieldvision-blue/10' : ''}`}>
                <LayoutDashboard className={`h-5 w-5 ${location.pathname === '/technician/dashboard' ? 'text-fieldvision-blue' : 'text-gray-500'}`} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium text-gray-600">Dashboard</span>
            </Link>
            
            {/* Map Icon */}
            <Link to="/technician/dashboard?tab=map" className="flex flex-col items-center justify-center h-full">
              <div className={`p-1 rounded-full ${location.search === '?tab=map' ? 'bg-fieldvision-blue/10' : ''}`}>
                <Map className={`h-5 w-5 ${location.search === '?tab=map' ? 'text-fieldvision-blue' : 'text-gray-500'}`} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium text-gray-600">Map</span>
            </Link>
            
            {/* Support Icon */}
            <div className="flex flex-col items-center justify-center h-full cursor-pointer">
              <div className="p-1 rounded-full">
                <Phone className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-[10px] mt-0.5 font-medium text-gray-600">Support</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Spacer to prevent content from being hidden behind the fixed mobile navbar */}
      {isMobile && <div className="h-16" />}
    </div>
  );
};
