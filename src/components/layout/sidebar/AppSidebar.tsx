
import React from 'react';
import { 
  Sidebar, 
  SidebarContent,
  SidebarTrigger,
  useSidebar
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
  const { state } = useSidebar();
  
  return (
    <>
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
      
      {/* Add the collapse trigger button */}
      <div className="fixed bottom-4 left-4 z-50 md:hidden">
        <SidebarTrigger />
      </div>
    </>
  );
};
