
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, LayoutDashboard, CheckSquare, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#CB9D06] shadow-inner">
      {isMobile ? (
        <>
          {/* Mobile Layout */}
          <div className="flex justify-between items-center w-full">
            {/* Left side - Menu button */}
            <Menubar className="bg-transparent border-none">
              <MenubarMenu>
                <MenubarTrigger 
                  className="text-white hover:bg-fieldvision-blue/80 data-[state=open]:bg-fieldvision-blue/80 px-2 py-1 text-xs"
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

            {/* Center - Logo */}
            <div className="flex-grow flex justify-center relative">
              <img 
                src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
                alt="Fieldvision Logo" 
                className="h-6 w-auto object-contain" 
              />
            </div>

            {/* Right side - View Tasks button */}
            <Link to="/technician" className="flex-shrink-0">
              <Button 
                variant="secondary" 
                size="sm" 
                className="whitespace-nowrap px-2 py-1 h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Tasks
              </Button>
            </Link>
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
