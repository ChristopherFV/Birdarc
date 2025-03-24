
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, LayoutDashboard, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarTrigger 
} from "@/components/ui/menubar";

interface PageFooterProps {
  backLink?: string;
  backLabel?: string;
  actionButton?: ReactNode;
  logoSrc?: string;
  logoAlt?: string;
}

export const PageFooter: React.FC<PageFooterProps> = ({ 
  backLink = '/', 
  backLabel = 'Back',
  actionButton,
  logoSrc = "/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png",
  logoAlt = "Fieldvision Logo"
}) => {
  return (
    <div className="bg-[#CB9D06] p-3 flex justify-between items-center shadow-inner">
      <div className="flex items-center gap-3">
        {backLink && (
          <Link to={backLink}>
            <Button 
              variant="blue" 
              size="sm" 
              className="text-white hover:bg-fieldvision-blue/80"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {backLabel}
            </Button>
          </Link>
        )}
        
        <Menubar className="bg-transparent border-none">
          <MenubarMenu>
            <MenubarTrigger 
              className="text-white hover:bg-fieldvision-blue/80 data-[state=open]:bg-fieldvision-blue/80"
            >
              <LayoutDashboard className="h-4 w-4 mr-1" />
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
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      
      {/* Logo in center of bottom bar */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img 
          src={logoSrc} 
          alt={logoAlt} 
          className="h-6 w-auto object-contain" 
        />
      </div>
      
      {actionButton}
    </div>
  );
};
