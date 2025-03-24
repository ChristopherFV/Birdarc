
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sidebar } from './Sidebar';
import { Search, Bell, User } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { selectedCompany } = useApp();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 sticky top-0 z-10">
          <div className="flex-1 flex items-center">
            <div className="max-w-md w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fieldvision-blue/30 focus:border-fieldvision-blue"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              <Bell size={20} />
            </button>
            
            <div className="flex items-center">
              <div className="text-right mr-3">
                <div className="font-medium">Anima Agrawal</div>
                <div className="text-sm text-gray-500">U.P, India</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
