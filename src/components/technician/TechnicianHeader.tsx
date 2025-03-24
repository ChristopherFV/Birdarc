
import React from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Check, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TechnicianHeaderProps {
  taskTitle: string;
  handleCompleteReview: () => void;
}

export const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({ taskTitle, handleCompleteReview }) => {
  return (
    <header className="bg-fieldvision-navy p-3 flex justify-between items-center shadow-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Link to="/technician/dashboard">
          <Button variant="ghost" size="sm" className="text-white hover:bg-fieldvision-navy/80">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        
        <Menubar className="bg-transparent border-none">
          <MenubarMenu>
            <MenubarTrigger className="text-white hover:bg-fieldvision-navy/80 data-[state=open]:bg-fieldvision-navy/80">
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
              <Link to="/schedule">
                <MenubarItem>
                  <Check className="h-4 w-4 mr-2" />
                  My Tasks
                </MenubarItem>
              </Link>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      
      <h1 className="text-white font-semibold truncate max-w-[60%]">{taskTitle}</h1>
      
      <Button 
        onClick={handleCompleteReview}
        className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded"
      >
        Complete Review
      </Button>
    </header>
  );
};
