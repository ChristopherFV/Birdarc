
import React from 'react';
import { 
  SidebarHeader as UISidebarHeader,
} from "@/components/ui/sidebar";
import { CompanySelector } from '@/components/ui/CompanySelector';
import { Company } from '@/types/app-types';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

interface SidebarHeaderProps {
  companies: Company[];
  selectedCompany: Company;
  setSelectedCompany: (company: Company) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  companies, 
  selectedCompany, 
  setSelectedCompany 
}) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <UISidebarHeader className="flex flex-col">
      <div className="flex items-center justify-between px-2 h-16">
        <div className="flex flex-col items-center">
          <img 
            src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
            alt="Fieldvision Logo" 
            className="h-6" 
          />
          <span className="text-[8px] text-fieldvision-orange mt-0.5">Powering Payments and Performance for Contractors</span>
        </div>
        <div className="hidden md:block">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <Menu className="h-5 w-5 text-fieldvision-orange" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>
      <div className="px-2 pt-2 pb-2">
        <CompanySelector 
          companies={companies}
          selectedCompany={selectedCompany}
          onChange={setSelectedCompany}
        />
      </div>
    </UISidebarHeader>
  );
};
