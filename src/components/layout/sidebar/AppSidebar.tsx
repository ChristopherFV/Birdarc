
import React from 'react';
import { 
  Sidebar, 
  SidebarContent 
} from "@/components/ui/sidebar";
import { SidebarHeader } from './SidebarHeader';
import { SidebarMainNav } from './SidebarMainNav';
import { SidebarTechNav } from './SidebarTechNav';
import { SidebarFooterNav } from './SidebarFooterNav';
import { Company } from '@/types/app-types';

interface AppSidebarProps {
  companies: Company[];
  selectedCompany: Company;
  setSelectedCompany: (company: Company) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  companies,
  selectedCompany,
  setSelectedCompany
}) => {
  return (
    <Sidebar className="bg-white border-r border-fieldvision-orange/50 shadow-sm">
      <SidebarHeader 
        companies={companies}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
      
      <SidebarContent>
        <SidebarMainNav />
        <SidebarTechNav />
      </SidebarContent>
      
      <SidebarFooterNav />
    </Sidebar>
  );
};
