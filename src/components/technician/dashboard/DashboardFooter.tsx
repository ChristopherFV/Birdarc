import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ChevronLeft, 
  LayoutDashboard, 
  CheckSquare, 
  Phone, 
  Mail, 
  Home,
  Calendar,
  Map,
  User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarTrigger 
} from "@/components/ui/menubar";

export const DashboardFooter: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  return (
    <div className="bg-[#CB9D06] shadow-inner">
      {isMobile ? (
        <>
          {/* New Mobile App-style Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="grid grid-cols-5 items-center h-16">
              {/* Dashboard Icon */}
              <Link to="/technician/dashboard" className="flex flex-col items-center justify-center h-full">
                <div className={`p-1 rounded-full ${location.pathname === '/technician/dashboard' ? 'bg-fieldvision-blue/10' : ''}`}>
                  <Home className={`h-5 w-5 ${location.pathname === '/technician/dashboard' ? 'text-fieldvision-blue' : 'text-gray-500'}`} />
                </div>
                <span className="text-[10px] mt-0.5 font-medium text-gray-600">Home</span>
              </Link>
              
              {/* Tasks Icon */}
              <Link to="/technician" className="flex flex-col items-center justify-center h-full">
                <div className={`p-1 rounded-full ${location.pathname === '/technician' ? 'bg-fieldvision-blue/10' : ''}`}>
                  <CheckSquare className={`h-5 w-5 ${location.pathname === '/technician' ? 'text-fieldvision-blue' : 'text-gray-500'}`} />
                </div>
                <span className="text-[10px] mt-0.5 font-medium text-gray-600">Tasks</span>
              </Link>
              
              {/* Center - Add Button */}
              <Link to="/technician" className="flex flex-col items-center justify-center h-full relative">
                <div className="bg-fieldvision-blue rounded-full p-3 shadow-md -mt-5">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] mt-0.5 font-medium text-gray-600">New Task</span>
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
          
          {/* Spacer to prevent content from being hidden behind the fixed footer */}
          <div className="h-16"></div>
          
          {/* Top logo bar for mobile */}
          <div className="flex justify-center p-3 bg-[#CB9D06]">
            <img 
              src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
              alt="Fieldvision Logo" 
              className="h-7 w-auto object-contain" 
            />
          </div>
        </>
      ) : (
        <>
          {/* Desktop Layout */}
          {/* Menu section */}
          <div className="flex items-center gap-2">
            <Menubar className="bg-transparent border-none">
              <MenubarMenu>
                <MenubarTrigger 
                  className="text-white hover:bg-fieldvision-blue/80 data-[state=open]:bg-fieldvision-blue/80 px-2 py-1.5 text-xs"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
                  Menu
                </MenubarTrigger>
                <MenubarContent>
                  <Link to="/technician/dashboard">
                    <MenubarItem>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </MenubarItem>
                  </Link>
                  <Link to="/technician">
                    <MenubarItem>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      My Tasks
                    </MenubarItem>
                  </Link>
                  <MenubarItem>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            
            <Link to="/technician/dashboard">
              <Button 
                variant="blue" 
                size="sm" 
                className="text-white hover:bg-fieldvision-blue/80 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Back
              </Button>
            </Link>
          </div>
          
          {/* Center logo - positioned absolutely for true center alignment */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
              alt="Fieldvision Logo" 
              className="h-7 w-auto object-contain" 
            />
          </div>
          
          {/* Right side buttons */}
          <Link to="/technician">
            <Button variant="secondary" size="sm" className="text-xs whitespace-nowrap">
              <Plus className="h-3.5 w-3.5 mr-1" />
              View Tasks
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};
