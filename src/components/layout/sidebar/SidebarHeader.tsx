
import React from 'react';
import { 
  SidebarHeader as UISidebarHeader
} from "@/components/ui/sidebar";
import { CompanySelector } from '@/components/ui/CompanySelector';
import { Company } from '@/types/app-types';

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
  return (
    <UISidebarHeader className="flex flex-col">
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
    </UISidebarHeader>
  );
};
