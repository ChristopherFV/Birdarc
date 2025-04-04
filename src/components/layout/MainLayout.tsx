
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useApp } from '@/context/AppContext';
import { AppSidebar } from './sidebar/AppSidebar';
import { Navbar } from './navbar/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { companies, selectedCompany, setSelectedCompany } = useApp();
  
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Navbar positioned outside SidebarProvider */}
      <Navbar />
      
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-1 w-full">
          <AppSidebar />
          
          <SidebarInset>
            <main className="w-full flex flex-col">
              <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};
