
import React from 'react';
import { 
  SidebarHeader as UISidebarHeader,
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
      <div className="px-2 py-4">
        <CompanySelector 
          companies={companies}
          selectedCompany={selectedCompany}
          onChange={setSelectedCompany}
        />
      </div>
    </UISidebarHeader>
  );
};
